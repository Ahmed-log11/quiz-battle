"""Question bank used by the game: Python basics + Unit 2 (NumPy & Linear Algebra).

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
        "q": "v has 3 elements. What is the shape of v.reshape(-1, 1)?",
        "options": ["(3,)", "(1, 3)", "(3, 1)", "(3, 3)"],
        "answer": 2,
    },
    {
        "q": "The dot product of two vectors is close to 0. What does that mean?",
        "options": [
            "They point in the same direction",
            "They are perpendicular (orthogonal)",
            "They point in opposite directions",
            "One of them is all zeros",
        ],
        "answer": 1,
    },
    {
        "q": "Cosine similarity compares two vectors by their...",
        "options": ["Length", "Direction", "Number of elements", "Largest value"],
        "answer": 1,
    },
    {
        "q": "What happens when a function reaches return inside a for loop?",
        "options": [
            "It skips to the next loop iteration",
            "It exits the loop but keeps running the function",
            "It exits the function immediately",
            "It raises an error",
        ],
        "answer": 2,
    },
    {
        "q": "In Python 3, what is the type of 7 / 2?",
        "options": ["int", "float", "str", "Error"],
        "answer": 1,
    },

    # ---------- 2. Multiple choice: what does this code print? ----------
    {
        "q": "What does this code print?",
        "code": "import numpy as np\n\nM = np.array([[1, 2, 3],\n              [4, 5, 6]])\nprint(M.shape)",
        "options": ["(3, 2)", "(2, 3)", "(6,)", "(2,)"],
        "answer": 1,
        "time_limit": 25,
    },
    {
        "q": "What does this code print?",
        "code": "import numpy as np\n\na = np.array([1, 2, 3])\nb = np.array([4, 5, 6])\nprint(a * b)",
        "options": ["32", "[ 4 10 18]", "[5 7 9]", "Error"],
        "answer": 1,
        "time_limit": 25,
    },
    {
        "q": "What does this code print?",
        "code": "import numpy as np\n\nA = np.array([[2, 0],\n              [0, 3]])\nv = np.array([1, 1])\nprint(A @ v)",
        "options": ["[2 3]", "[3 2]", "[2 0]", "5"],
        "answer": 0,
        "time_limit": 25,
    },
    {
        "q": "What does this code print?",
        "code": "a = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))",
        "options": ["3", "4", "None", "Error"],
        "answer": 1,
        "time_limit": 25,
    },
    {
        "q": "What does this code print?",
        "code": "word = 'Python'\nprint(word[1:4])",
        "options": ["Pyt", "yth", "ytho", "yt"],
        "answer": 1,
        "time_limit": 25,
    },

    # ---------- 3. Typed answer: type what the code prints ----------
    {
        "type": "text",
        "q": "Type what this code prints",
        "code": "import numpy as np\n\nv = np.array([1, 2, 3])\nw = np.array([4, 5, 6])\nprint(np.dot(v, w))",
        "answer": "32",
        "time_limit": 40,
    },
    {
        "type": "text",
        "q": "Type what this code prints",
        "code": "import numpy as np\n\nv = np.array([3, 4])\nprint(int(np.linalg.norm(v)))",
        "answer": "5",
        "time_limit": 40,
    },
    {
        "type": "text",
        "q": "Type what this code prints",
        "code": "def check(n):\n    for i in range(n):\n        if i == 2:\n            return i * 10\n    return -1\n\nprint(check(5))",
        "answer": "20",
        "time_limit": 40,
    },
    {
        "type": "text",
        "q": "Type what this code prints",
        "code": "scores = {'Sara': 7, 'Omar': 9, 'Lama': 4}\nbest = max(scores, key=lambda k: scores[k])\nprint(best)",
        "answer": "Omar",
        "time_limit": 40,
    },
    {
        "type": "text",
        "q": "Type what this code prints",
        "code": "total = 0\nfor n in range(1, 6):\n    if n % 2 == 0:\n        total += n\n    elif n == 5:\n        total += 10\nprint(total)",
        "answer": "16",
        "time_limit": 40,
    },
]