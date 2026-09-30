"""
Quiz Battle web server.

One FastAPI app serves:
    /api/health   quick check that the server is up
    /ws           WebSocket for live play (host screen + players)
    /             the built React app (copied to ./static by the Dockerfile)

Game state lives in memory, so always run it with ONE worker.

WebSocket messages (JSON)
    client -> server
        {"type": "join", "role": "host"}                     host screen (projector)
        {"type": "join", "role": "player", "name": "Lamya"}  a student
        {"type": "start"}    host: lobby -> first question
        {"type": "next"}     host: question -> reveal -> next question
        {"type": "reset"}    host: back to the lobby (scores reset)
        {"type": "answer", "choice": 1}                      player: option index
    server -> client
        {"type": "state", ...}   sent to everyone after every change
        {"type": "error", "message": "..."}

Run locally:  uvicorn main:app --reload
"""

from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles

from game_logic import (POINT, add_player, advance, all_answered, current_question,
                        leaderboard, new_game, start_game, submit_answer)
from questions import QUESTIONS

app = FastAPI(title="Quiz Battle")


@app.get("/api/health")
def health():
    return {"status": "ok"}


# ---------- Shared game state (one game for the whole class) ----------
game = new_game()
hosts = set()     # host-screen websockets
players = {}      # {name: websocket} for players who are connected right now


def build_state(name=None):
    """State sent to ONE client. name=None means a host screen.
    The correct answer, scores and the winner are hidden until the reveal,
    otherwise players could work out the answer from them."""
    phase = game["phase"]
    q = current_question(game)
    state = {
        "type": "state",
        "phase": phase,
        "players": list(game["players"]),
        "connected": list(players),
        "answered": list(game["answers"]),
        "index": game["q_index"],
        "total": len(QUESTIONS),
        "point": POINT,
    }
    if phase in ("question", "reveal") and q is not None:
        state["question"] = {"q": q["q"], "options": q["options"]}
    if phase in ("lobby", "reveal", "finished"):
        state["leaderboard"] = leaderboard(game["players"])
    if phase == "reveal" and q is not None:
        state["correct"] = q["answer"]
        state["winner"] = game["winner"]

    mine = game["answers"].get(name)
    if mine is not None:
        state["me"] = {"choice": mine["choice"]}
        if phase == "reveal":
            state["me"]["correct"] = mine["correct"]
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
                    if wanted in players:
                        await send_safe(ws, {"type": "error", "message": "Name already taken"})
                        continue
                    ok, message = add_player(game, wanted)
                    if not ok:
                        await send_safe(ws, {"type": "error", "message": message})
                        continue
                    role, name = "player", wanted
                    players[name] = ws
                else:
                    await send_safe(ws, {"type": "error", "message": "Unknown role"})
                    continue

            # ---- step 2: handle messages by role ----
            elif role == "host":
                if kind == "start":
                    start_game(game)
                elif kind == "next":
                    advance(game)
                elif kind == "reset":
                    game = new_game()
                    for n in players:          # connected players stay in the lobby
                        add_player(game, n)

            elif role == "player":
                if kind == "answer":
                    submit_answer(game, name, msg.get("choice"))
                    # (a correct answer already moved us to the reveal)
                    # if everyone connected answered wrong, show the reveal too
                    if game["phase"] == "question" and all_answered(game, list(players)):
                        advance(game)

            await broadcast()
    except WebSocketDisconnect:
        pass
    finally:
        hosts.discard(ws)
        if role == "player" and players.get(name) is ws:
            players.pop(name)
        await broadcast()


# Serve the built React app. Must come LAST so it doesn't swallow /ws or /api.
static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")