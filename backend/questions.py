"""Question bank used by the game: Python basics.

Each question is a dict:
    q        the question text
    code     (optional) a code snippet shown under the question,
             for "what does this code print?" questions
    options  list of answer choices
    answer   index of the correct option, counting from 0
             (0 = first option, 1 = second, ...)
"""

QUESTIONS = [
    # ---------- Concept questions ----------
    {
        "q": "Which function prints text on the screen?",
        "options": ["print()", "show()", "write()", "display()"],
        "answer": 0,
    },
    {
        "q": "Which function takes input from the user?",
        "options": ["print()", "input()", "read()", "scan()"],
        "answer": 1,
    },
    {
        "q": "What is the data type of the value 5?",
        "options": ["str", "float", "int", "bool"],
        "answer": 2,
    },
    {
        "q": 'What is the data type of the value "Hello"?',
        "options": ["int", "bool", "list", "str"],
        "answer": 3,
    },
    {
        "q": "Which one is a list?",
        "options": ["(1, 2, 3)", "[1, 2, 3]", "{1, 2, 3}", "<1, 2, 3>"],
        "answer": 1,
    },
    {
        "q": "Which one is a dictionary?",
        "options": ["[1, 2]", "(1, 2)", "{'name': 'Ali'}", "'name'"],
        "answer": 2,
    },
    {
        "q": "What is the result of 10 % 3?",
        "options": ["3", "1", "0", "3.33"],
        "answer": 1,
    },
    {
        "q": "Which one is a bool value?",
        "options": ["True", "'True'", "'yes'", "1"],
        "answer": 0,
    },
    {
        "q": "Which keyword is used to create a function?",
        "options": ["function", "define", "def", "func"],
        "answer": 2,
    },
    {
        "q": "Which keyword sends a value back from a function?",
        "options": ["print", "input", "return", "break"],
        "answer": 2,
    },

    # ---------- Output questions: what does this code print? ----------
    {
        "q": "What does this code print?",
        "code": "x = 5\nx = x + 3\nprint(x)",
        "options": ["5", "8", "53", "Error"],
        "answer": 1,
    },
    {
        "q": "What does this code print?",
        "code": 'name = "Ali"\nprint("Hi " + name)',
        "options": ["Hi Ali", "Hi name", "HiAli", "Error"],
        "answer": 0,
    },
    {
        "q": "What does this code print?",
        "code": "nums = [4, 7, 9]\nprint(nums[1])",
        "options": ["4", "7", "9", "Error"],
        "answer": 1,
    },
    {
        "q": "What does this code print?",
        "code": "for i in range(3):\n    print(i, end=' ')",
        "options": ["1 2 3", "0 1 2", "0 1 2 3", "3"],
        "answer": 1,
    },
    {
        "q": "What does this code print?",
        "code": "age = 17\nif age >= 18:\n    print('Adult')\nelse:\n    print('Minor')",
        "options": ["Adult", "Minor", "17", "Nothing"],
        "answer": 1,
    },
    {
        "q": "What does this code print?",
        "code": "def double(n):\n    return n * 2\n\nprint(double(4))",
        "options": ["4", "6", "8", "44"],
        "answer": 2,
    },
    {
        "q": "What does this code print?",
        "code": "student = {'name': 'Sara', 'age': 20}\nprint(student['age'])",
        "options": ["Sara", "age", "20", "Error"],
        "answer": 2,
    },
    {
        "q": "What does this code print?",
        "code": "square = lambda x: x * x\nprint(square(3))",
        "options": ["6", "9", "33", "x * x"],
        "answer": 1,
    },
]
