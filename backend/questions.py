"""Question bank used by the game: Python basics.

There are three kinds of questions:

1. Multiple choice (regular)
       q        the question text
       options  list of answer choices
       answer   index of the correct option, counting from 0
                (0 = first option, 1 = second, ...)

2. Multiple choice with code: same as above plus
       code     a code snippet shown under the question

3. Typed answer: the player types what the code prints
       type        "text"
       q           the question text
       code        the code snippet
       answer      the exact output, as a string
       time_limit  (optional) seconds to answer; typing takes longer

Any question can have "time_limit"; without it the game uses TIME_LIMIT.
"""

QUESTIONS = [
    # ---------- 1. Regular multiple choice ----------
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
        "q": "Which keyword is used to create a function?",
        "options": ["function", "define", "def", "func"],
        "answer": 2,
    },

    # ---------- 2. Multiple choice: what does this code print? ----------
    {
        "q": "What does this code print?",
        "code": "nums = [4, 7, 9]\nprint(nums[1])",
        "options": ["4", "7", "9", "Error"],
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

    # ---------- 3. Typed answer: type what the code prints ----------
    {
        "type": "text",
        "q": "Type what this code prints",
        "code": "x = 10\ny = 3\nprint(x + y)",
        "answer": "13",
        "time_limit": 30,
    },
    {
        "type": "text",
        "q": "Type what this code prints",
        "code": "word = 'Py'\nprint(word * 3)",
        "answer": "PyPyPy",
        "time_limit": 30,
    },
    {
        "type": "text",
        "q": "Type what this code prints",
        "code": "total = 0\nfor n in [1, 2, 3, 4]:\n    total = total + n\nprint(total)",
        "answer": "10",
        "time_limit": 30,
    },
]