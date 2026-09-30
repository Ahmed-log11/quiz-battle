"""Core game logic: plain Python functions shared by cli.py and main.py.

No input(), print() or web code in this file, so it can be tested on its own.

Game phases:
    lobby     players are joining
    question  a question is on screen, players are answering
    reveal    correct answer + the winner of the point are shown
    finished  all questions are done, final leaderboard
"""

from questions import QUESTIONS

# Scoring: on every question ONLY the fastest correct player gets a point.
# Everyone else gets 0, even if their answer is also correct.
POINT = 1

# Lambda: sort {name: score} from highest to lowest
leaderboard = lambda scores: sorted(scores.items(), key=lambda item: item[1], reverse=True)


def new_game():
    """Create a fresh game state (a dict)."""
    return {
        "players": {},         # {name: score}
        "phase": "lobby",
        "q_index": 0,          # which question we are on
        "answers": {},         # {name: {"choice": int, "correct": bool}}
        "winner": None,        # name of the fastest correct player (gets the point)
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
    return True, "joined"


def start_game(game):
    """Move from lobby to the first question. Returns True if started."""
    if game["phase"] == "lobby" and len(game["players"]) > 0:
        game["phase"] = "question"
        return True
    return False


def submit_answer(game, name, choice):
    """Save one answer. The FIRST correct answer that arrives wins the point,
    and the question ends right away because nobody else can score.
    Returns True if the answer was accepted."""
    q = current_question(game)
    if game["phase"] != "question" or q is None:
        return False
    if name not in game["players"] or name in game["answers"]:
        return False
    # choice must be a real option index (bool is excluded on purpose)
    if not isinstance(choice, int) or isinstance(choice, bool):
        return False
    if choice < 0 or choice >= len(q["options"]):
        return False

    correct = (choice == q["answer"])
    game["answers"][name] = {"choice": choice, "correct": correct}

    if correct:
        game["winner"] = name
        game["players"][name] += POINT
        game["phase"] = "reveal"      # point taken -> show the answer to everyone
    return True


def all_answered(game, names):
    """True if every name in `names` has answered the current question."""
    return len(names) > 0 and all(n in game["answers"] for n in names)


def advance(game):
    """Host pressed Next: question -> reveal -> next question (or finished)."""
    if game["phase"] == "question":
        game["phase"] = "reveal"
    elif game["phase"] == "reveal":
        game["q_index"] += 1
        game["answers"] = {}
        game["winner"] = None
        if game["q_index"] >= len(QUESTIONS):
            game["phase"] = "finished"
        else:
            game["phase"] = "question"