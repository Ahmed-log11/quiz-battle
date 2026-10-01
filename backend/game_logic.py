"""Core game logic: plain Python functions shared by cli.py and main.py.

No input(), print() or web code in this file, so it can be tested on its own.

Game phases:
    lobby     players are joining
    question  a question is on screen, players are answering
    reveal    correct answer + the winner of the point are shown
    finished  all questions are done, final leaderboard
"""

import random
import string

from questions import QUESTIONS

# Scoring: on every question ONLY the fastest correct player gets a point.
# Everyone else gets 0, even if their answer is also correct.
POINT = 1

# Seconds players have to answer each question
TIME_LIMIT = 20

# Lambda: sort {name: score} from highest to lowest
leaderboard = lambda scores: sorted(scores.items(), key=lambda item: item[1], reverse=True)


def new_code():
    """Random 4-letter room code, e.g. "KQZT"."""
    return "".join(random.choices(string.ascii_uppercase, k=4))


def new_game():
    """Create a fresh game state (a dict)."""
    return {
        "code": new_code(),    # room code players type to join
        "players": {},         # {name: score}
        "phase": "lobby",
        "q_index": 0,          # which question we are on
        "answers": {},         # {name: {"choice": int, "correct": bool, "seconds": float}}
        "winner": None,        # name of the fastest correct player (gets the point)
        "winner_seconds": None,
        "stats": {},           # {name: {"correct", "streak", "best_streak", "correct_time"}}
    }


def current_question(game):
    """Return the current question dict, or None if there is none."""
    if game["q_index"] < len(QUESTIONS):
        return QUESTIONS[game["q_index"]]
    return None


def add_player(game, name):
    """Add a player. Returns (ok, message)."""
    name = name.strip()
    if name == "":
        return False, "Enter a name"
    if game["phase"] != "lobby" and name not in game["players"]:
        return False, "Game already started"
    game["players"].setdefault(name, 0)   # keeps the old score if they rejoin
    game["stats"].setdefault(name, {"correct": 0, "streak": 0, "best_streak": 0, "correct_time": 0.0})
    return True, "joined"


def start_game(game):
    """Move from lobby to the first question. Returns True if started."""
    if game["phase"] == "lobby" and len(game["players"]) > 0:
        game["phase"] = "question"
        return True
    return False


def submit_answer(game, name, choice, seconds):
    """Save one answer. `seconds` is how long the player took.
    Everyone can answer; the point is given out at the reveal.
    Returns True if the answer was accepted."""
    q = current_question(game)
    if game["phase"] != "question" or q is None:
        return False
    if name not in game["players"] or name in game["answers"]:
        return False
    if seconds > TIME_LIMIT:
        return False                  # too late
    # choice must be a real option index (bool is excluded on purpose)
    if not isinstance(choice, int) or isinstance(choice, bool):
        return False
    if choice < 0 or choice >= len(q["options"]):
        return False

    correct = (choice == q["answer"])
    game["answers"][name] = {"choice": choice, "correct": correct, "seconds": seconds}
    return True


def all_answered(game, names):
    """True if every name in `names` has answered the current question."""
    return len(names) > 0 and all(n in game["answers"] for n in names)


def reveal(game):
    """End the question: the fastest correct player gets the point,
    and everyone's stats (correct count, streaks) are updated."""
    correct = [(a["seconds"], name) for name, a in game["answers"].items() if a["correct"]]
    if correct:
        seconds, name = min(correct)          # smallest time = fastest
        game["winner"] = name
        game["winner_seconds"] = seconds
        game["players"][name] += POINT

    for name, stats in game["stats"].items():
        answer = game["answers"].get(name)
        if answer and answer["correct"]:
            stats["correct"] += 1
            stats["correct_time"] += answer["seconds"]
            stats["streak"] += 1
            stats["best_streak"] = max(stats["best_streak"], stats["streak"])
        else:
            stats["streak"] = 0
    game["phase"] = "reveal"


def advance(game):
    """Host pressed Next (or time ran out):
    question -> reveal -> next question (or finished)."""
    if game["phase"] == "question":
        reveal(game)
    elif game["phase"] == "reveal":
        game["q_index"] += 1
        game["answers"] = {}
        game["winner"] = None
        game["winner_seconds"] = None
        if game["q_index"] >= len(QUESTIONS):
            game["phase"] = "finished"
        else:
            game["phase"] = "question"


def rank(game, name):
    """Position of a player (1 = first). Players with the same score share a rank."""
    mine = game["players"][name]
    return 1 + sum(1 for score in game["players"].values() if score > mine)


def awards(game):
    """Fun awards for the final screen: a list of {title, name, detail}."""
    stats = game["stats"]
    result = []

    streaks = [n for n in stats if stats[n]["best_streak"] >= 2]
    if streaks:
        best = max(streaks, key=lambda n: stats[n]["best_streak"])
        result.append({"title": "Biggest streak", "name": best,
                       "detail": f"{stats[best]['best_streak']} in a row"})

    answered_right = [n for n in stats if stats[n]["correct"] > 0]
    if answered_right:
        most = max(answered_right, key=lambda n: stats[n]["correct"])
        result.append({"title": "Most correct answers", "name": most,
                       "detail": f"{stats[most]['correct']} of {len(QUESTIONS)} right"})

        average = lambda n: stats[n]["correct_time"] / stats[n]["correct"]
        quickest = min(answered_right, key=average)
        result.append({"title": "Fastest on average", "name": quickest,
                       "detail": f"{average(quickest):.1f}s per correct answer"})
    return result
