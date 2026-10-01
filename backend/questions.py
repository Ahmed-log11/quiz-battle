"""Question bank used by the game.

Each question is a dict:
    q        the question text
    options  list of answer choices
    answer   index of the correct option (0-based)
"""

QUESTIONS = [
    {"q": "Which function prints text on the screen?",
     "options": ["print()", "show()", "write()"], "answer": 0},
    {"q": "Which function reads input from the user?",
     "options": ["print()", "input()", "read()"], "answer": 1},
    {"q": "What is the data type of the value 5?",
     "options": ["str", "bool", "int"], "answer": 2},
    {"q": 'What is the data type of the value "Hello"?',
     "options": ["int", "list", "str"], "answer": 2},
    {"q": "Which one is a list?",
     "options": ["[1, 2, 3]", "(1, 2, 3)", "{1, 2, 3}"], "answer": 0},
    {"q": "Which one is a dictionary?",
     "options": ["[1, 2]", "{'name': 'Ali'}", "(1, 2)"], "answer": 1},
    {"q": "What is the result of 10 % 3?",
     "options": ["3", "0", "1"], "answer": 2},
    {"q": "Which one is a bool value?",
     "options": ["True", "'True'", "1"], "answer": 0},
    {"q": "Which keyword is used to create a function?",
     "options": ["func", "def", "define"], "answer": 1},
    {"q": "Which keyword sends a value back from a function?",
     "options": ["return", "print", "break"], "answer": 0},
]