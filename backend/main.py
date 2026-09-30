"""
Quiz Battle web server.

One FastAPI app serves:
    /api/health   quick check that the server is up
    /ws           WebSocket for live play (currently echoes messages back)
    /             the built React app (copied to ./static by the Dockerfile)

Game state will live in memory, so always run it with ONE worker.

Run locally:  uvicorn main:app --reload
"""

from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Quiz Battle")


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.websocket("/ws")
async def game_socket(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            message = await ws.receive_json()
            await ws.send_json({"type": "echo", "received": message})
    except WebSocketDisconnect:
        pass


# Serve the built React app. Must come LAST so it doesn't swallow /ws or /api.
static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
