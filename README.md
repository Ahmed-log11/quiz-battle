# Quiz Battle

A live, Kahoot-style quiz for our class. The instructor runs the host screen on the projector, students join from their phones, and everyone answers the same question at the same moment.

- **Frontend:** React (Vite) in `frontend/`
- **Backend:** Python + FastAPI in `backend/`, with a WebSocket at `/ws`
- **Deployment:** one Docker service on Render, redeployed on every push to `main`

## Project structure

```
quiz-battle/
├── Dockerfile           # builds React, then runs FastAPI serving it
├── frontend/            # React (Vite)
└── backend/
    ├── main.py          # FastAPI: /api/health, /ws, serves the React build
    ├── game_logic.py    # game logic (plain Python functions)
    ├── questions.py     # question bank
    ├── cli.py           # terminal version using input()/print()
    └── requirements.txt
```

## Run it locally

You need **Python 3.10+** and **Node 20.19+**. No Docker needed for development.

First time only:

```bash
cd backend && pip install -r requirements.txt
cd ../frontend && npm install
```

Every time, in two terminals:

```bash
# terminal 1: backend on http://localhost:8000
cd backend
uvicorn main:app --reload

# terminal 2: frontend on http://localhost:5173
cd frontend
npm run dev
```

Open http://localhost:5173. The page should say **Server: connected**. If it says disconnected, check that the backend terminal is running.

To test on your phone, connect it to the same Wi-Fi and open the **Network** address that `npm run dev` prints (for example `http://192.168.1.20:5173`).

## Team workflow

1. Pull the latest `main`: `git checkout main && git pull`
2. Create a branch for your work: `git checkout -b my-feature`
3. Build and test locally.
4. Push your branch and open a pull request to `main`.
5. After a teammate reviews it, merge. **Merging to `main` deploys the live site.**

Rules:

- Only merge to `main` when it works locally.
- The frontend connects to `/ws` on the same site. Never hardcode `localhost` in React code.
- Use hash routes (`/#/host`, `/#/play`) so refreshing a page doesn't 404.
- Keep the server at **one worker**. Game state lives in memory.

## Deployment (Render)

Render builds the `Dockerfile` on every push to `main`. One-time setup:

1. On [Render](https://render.com), choose **New → Web Service** and connect this repo.
2. Render detects the Dockerfile. Pick the **Free** instance and deploy.

To check the production build on your machine first:

```bash
docker build -t quiz-battle .
docker run -p 8000:8000 quiz-battle
# open http://localhost:8000
```

Notes:

- The free server sleeps after 15 minutes with no visitors and takes about a minute to wake. Open the link a few minutes before class.
- A restart ends any game in progress.
- If a merge breaks the live site, roll back to the previous deploy from the Render dashboard.
