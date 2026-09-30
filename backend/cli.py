# Terminal version of the game using input() and print().
"""Terminal version of the game using input() and print().

Players take turns on the same computer. Each player has their own timer,
and the point goes to the fastest CORRECT player.

Run:  python cli.py
"""

import time

from game_logic import (POINT, add_player, advance, current_question,
                        leaderboard, new_game, start_game, submit_answer)
from questions import QUESTIONS


def ask_player(name, q):
    """Show the options, time the player, return (choice_index, seconds)."""
    input(f"\n{name}, press Enter when you are ready...")
    print(q["q"])
    for i, option in enumerate(q["options"], start=1):
        print(f"  {i}. {option}")

    start = time.time()                       # timer starts when the question appears
    raw = input("Your answer (number): ")
    elapsed = time.time() - start

    choice = int(raw) - 1 if raw.isdigit() else -1   # -1 = invalid answer
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

        results = []                          # list of (name, choice, seconds)
        for name in game["players"]:
            choice, elapsed = ask_player(name, q)
            results.append((name, choice, elapsed))

        # Fastest first, so the fastest correct player gets the point (lambda)
        results.sort(key=lambda r: r[2])
        for name, choice, elapsed in results:
            submit_answer(game, name, choice)

        print(f"Correct answer: {q['options'][q['answer']]}")
        if game["winner"]:
            print(f"Point goes to: {game['winner']} (+{POINT})")
        else:
            print("Nobody got it right, no points!")

        if game["phase"] == "question":   # nobody was correct, so move to reveal
            advance(game)
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