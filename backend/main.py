"""
Quiz Battle web server.

One FastAPI app serves:
    /api/health   quick check that the server is up
    /ws           WebSocket for live play (host screen + players)
    /             the built React app (copied to ./static by the Dockerfile)

Game state lives in memory, so always run it with ONE worker.

WebSocket messages (JSON)
    client -> server
        {"type": "join", "role": "host"}       host screen (projector)
        {"type": "join", "role": "player", "name": "Lamya", "code": "KQZT", "id": "..."}
                             a student. `id` is a random id saved on the phone,
                             so the same player can reconnect after a refresh.
        {"type": "start"}    host: lobby -> first question
        {"type": "next"}     host: question -> reveal -> next question (or finished)
        {"type": "reset"}    host: new game with a new code (connected players stay)
        {"type": "answer", "choice": 1}        player: option index
    server -> client
        {"type": "state", ...}   sent to everyone after every change (see build_state)
        {"type": "error", "message": "..."}

A question ends when every connected player has answered, when the
timer runs out, or when the host presses Next.

Run locally:  uvicorn main:app --reload
"""

import asyncio
import time
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles

from game_logic import (POINT, TIME_LIMIT, add_player, advance, all_answered, awards,
                        current_question, leaderboard, new_game, rank, start_game,
                        submit_answer)
from questions import QUESTIONS

app = FastAPI(title="Quiz Battle")


@app.get("/api/health")
def health():
    return {"status": "ok"}


# ---------- Shared game state (one game for the whole class) ----------
game = new_game()
hosts = set()     # host-screen websockets
players = {}      # {name: websocket} for players who are connected right now
owners = {}       # {name: id} so only the same phone can take a name back
deadline = 0.0    # time.time() when the current question ends
timer_task = None


def start_timer():
    """Start the countdown for the current question."""
    global deadline, timer_task
    stop_timer()
    deadline = time.time() + TIME_LIMIT
    timer_task = asyncio.create_task(time_up(game["q_index"]))


def stop_timer():
    if timer_task is not None:
        timer_task.cancel()


async def time_up(index):
    """When time runs out, reveal the answer (if we are still on that question)."""
    await asyncio.sleep(TIME_LIMIT)
    if game["phase"] == "question" and game["q_index"] == index:
        advance(game)
        await broadcast()


def player_view(name):
    """The part of the state that is only about one player."""
    phase = game["phase"]
    q = current_question(game)
    answer = game["answers"].get(name)
    me = {"name": name, "choice": answer["choice"] if answer else None}

    if phase == "reveal":
        correct = bool(answer and answer["correct"])
        me["result"] = {
            "answered": answer is not None,
            "correct": correct,
            "points": POINT if game["winner"] == name else 0,
            "score": game["players"][name],
            "rank": rank(game, name),
            "totalPlayers": len(game["players"]),
            "streak": game["stats"][name]["streak"],
            "correctAnswer": q["options"][q["answer"]],
            "fastestName": game["winner"],
        }
    elif phase == "finished":
        me["final"] = {
            "rank": rank(game, name),
            "totalPlayers": len(game["players"]),
            "score": game["players"][name],
            "correctCount": game["stats"][name]["correct"],
            "totalQuestions": len(QUESTIONS),
            "bestStreak": game["stats"][name]["best_streak"],
        }
    return me


def build_state(name=None):
    """State sent to ONE client. name=None means a host screen.
    The correct answer, scores and the winner are hidden until the reveal,
    otherwise players could work out the answer from them."""
    phase = game["phase"]
    q = current_question(game)
    state = {
        "type": "state",
        "phase": phase,
        "code": game["code"],
        "players": [{"name": n, "connected": n in players} for n in game["players"]],
        "answered": len(game["answers"]),
        "index": game["q_index"],
        "total": len(QUESTIONS),
    }
    if phase in ("question", "reveal") and q is not None:
        state["question"] = {
            "index": game["q_index"],
            "total": len(QUESTIONS),
            "text": q["q"],
            "options": q["options"],
            "timeLimit": TIME_LIMIT,
            # time left instead of a clock time, because phone clocks are not exact
            "timeLeftMs": max(0, int((deadline - time.time()) * 1000)) if phase == "question" else 0,
        }
    if phase in ("reveal", "finished"):
        state["leaderboard"] = [{"name": n, "score": s} for n, s in leaderboard(game["players"])]
    if phase == "reveal" and q is not None:
        winner = game["winner"]
        state["reveal"] = {
            "correctOption": q["answer"],
            "correctAnswer": q["options"][q["answer"]],
            "fastest": {"name": winner, "seconds": round(game["winner_seconds"], 1)} if winner else None,
            "correctCount": sum(1 for a in game["answers"].values() if a["correct"]),
        }
    if phase == "finished":
        state["awards"] = awards(game)
    if name is not None:
        state["me"] = player_view(name)
    return state


async def send_safe(ws, data):
    """Send to one socket; ignore sockets that already closed."""
    try:
        await ws.send_json(data)
    except Exception:
        pass


async def broadcast():
    """Push the new state to every host and player at the same moment."""
    for ws in list(hosts):
        await send_safe(ws, build_state())
    for name, ws in list(players.items()):
        await send_safe(ws, build_state(name))


def reveal_if_everyone_answered():
    """End the question early once every connected player has answered."""
    if game["phase"] == "question" and all_answered(game, list(players)):
        advance(game)


@app.websocket("/ws")
async def game_socket(ws: WebSocket):
    global game
    await ws.accept()
    role = None    # "host" or "player" after a successful join
    name = None

    try:
        while True:
            msg = await ws.receive_json()
            kind = msg.get("type")

            # ---- step 1: every client must join first ----
            if role is None:
                if kind != "join":
                    await send_safe(ws, {"type": "error", "message": "Join first"})
                    continue
                if msg.get("role") == "host":
                    role = "host"
                    hosts.add(ws)
                elif msg.get("role") == "player":
                    wanted = str(msg.get("name", "")).strip()[:20]
                    player_id = str(msg.get("id", ""))
                    # same phone coming back (refresh, screen lock) -> no code needed
                    rejoining = (wanted in game["players"] and player_id != ""
                                 and owners.get(wanted) == player_id)
                    if not rejoining:
                        if str(msg.get("code", "")).strip().upper() != game["code"]:
                            await send_safe(ws, {"type": "error",
                                                 "message": "Room not found. Check the code on the screen"})
                            continue
                        if wanted in game["players"]:
                            await send_safe(ws, {"type": "error", "message": "Name already taken"})
                            continue
                    ok, message = add_player(game, wanted)
                    if not ok:
                        await send_safe(ws, {"type": "error", "message": message})
                        continue
                    old = players.get(wanted)
                    if old is not None:           # close the old connection of this player
                        try:
                            await old.close(code=4000, reason="You joined from another tab")
                        except Exception:
                            pass
                    role, name = "player", wanted
                    players[name] = ws
                    owners[name] = player_id
                else:
                    await send_safe(ws, {"type": "error", "message": "Unknown role"})
                    continue

            # ---- step 2: handle messages by role ----
            elif role == "host":
                if kind == "start":
                    if start_game(game):
                        start_timer()
                elif kind == "next":
                    advance(game)
                    if game["phase"] == "question":
                        start_timer()
                elif kind == "reset":
                    stop_timer()
                    game = new_game()
                    for n in players:          # connected players stay in the lobby
                        add_player(game, n)

            elif role == "player":
                if kind == "answer" and game["phase"] == "question":
                    seconds = TIME_LIMIT - (deadline - time.time())
                    submit_answer(game, name, msg.get("choice"), seconds)
                    reveal_if_everyone_answered()

            await broadcast()
    except WebSocketDisconnect:
        pass
    finally:
        hosts.discard(ws)
        if role == "player" and players.get(name) is ws:
            players.pop(name)
            reveal_if_everyone_answered()     # the one we were waiting for left
        await broadcast()


# Serve the built React app. Must come LAST so it doesn't swallow /ws or /api.
static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
