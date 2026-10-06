# Terminal version of the game using input() and print().
"""Terminal version of the game using input() and print().

Players take turns on the same computer. Each player has their own timer,
and the point goes to the fastest CORRECT player.

Run:  python cli.py
"""

import time

from game_logic import (POINT, add_player, advance, correct_answer_text, current_question,
                        is_text, leaderboard, new_game, start_game, submit_answer,
                        time_limit)
from questions import QUESTIONS


def ask_player(name, q):
    """Show the question, time the player, return (choice, seconds).
    choice is an option index, or the typed text for typed-answer questions."""
    limit = time_limit(q)
    input(f"\n{name}, press Enter when you are ready ({limit} seconds to answer)...")
    print(q["q"])
    if "code" in q:                           # output question: show the code
        print("-" * 30)
        print(q["code"])
        print("-" * 30)
    if not is_text(q):
        for i, option in enumerate(q["options"], start=1):
            print(f"  {i}. {option}")

    start = time.time()                       # timer starts when the question appears
    if is_text(q):
        choice = input("Type the output: ")   # typed answer: keep the text
    else:
        raw = input("Your answer (number): ")
        choice = int(raw) - 1 if raw.isdigit() else -1   # -1 = invalid answer
    elapsed = time.time() - start

    if elapsed > limit:
        input(f"Too slow ({elapsed:.1f}s), your answer doesn't count. Press Enter...")
    print("\n" * 40)                          # hide the screen from the next player
    return choice, elapsed


def main():
    game = new_game()

    names = input("Enter player names (comma separated): ").split(",")
    for name in names:
        add_player(game, name)
    if not start_game(game):
        print("You need at least one player.")
        return

    while game["phase"] == "question":
        q = current_question(game)
        print(f"\n===== Question {game['q_index'] + 1}/{len(QUESTIONS)} =====")

        for name in game["players"]:
            choice, elapsed = ask_player(name, q)
            submit_answer(game, name, choice, elapsed)

        advance(game)                     # question -> reveal: fastest correct gets the point
        print(f"Correct answer: {correct_answer_text(q)}")
        if game["winner"]:
            print(f"Point goes to: {game['winner']} ({game['winner_seconds']:.1f}s, +{POINT})")
        else:
            print("Nobody got it right, no points!")

        advance(game)                     # reveal -> next question (or finished)

    print("\n===== Final Scores =====")
    for rank, (name, score) in enumerate(leaderboard(game["players"]), start=1):
        print(f"{rank}. {name}: {score}")

    # ---------- Reflection ----------
    # Most challenging part: (write your answer here)
    # Concept I enjoyed the most: (write your answer here)
    # What I would improve with more time: (write your answer here)


if __name__ == "__main__":
    main()