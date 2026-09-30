"""Question bank used by the game.

Each question is a dict:
    q        the question text
    options  list of answer choices
    answer   index of the correct option (0-based)
"""

QUESTIONS = [
    {"q": "What is the capital of Saudi Arabia?",
     "options": ["Jeddah", "Riyadh", "Dammam"], "answer": 1},
    {"q": "When is Saudi Founding Day?",
     "options": ["Feb 22", "Sep 23", "Dec 18"], "answer": 0},
    {"q": "Which city is Hegra (Madain Salih) in?",
     "options": ["Abha", "AlUla", "Tabuk"], "answer": 1},
    {"q": "In which year was the Kingdom of Saudi Arabia unified?",
     "options": ["1902", "1932", "1953"], "answer": 1},
    {"q": "What is the highest peak in Saudi Arabia?",
     "options": ["Jabal Sawda", "Jabal Uhud", "Jabal Tuwaiq"], "answer": 0},
]