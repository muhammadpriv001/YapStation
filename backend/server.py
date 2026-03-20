from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import engine
import os

app = FastAPI()
core = engine.Engine()

BASE = os.path.dirname(__file__)
FRONTEND = os.path.join(BASE, "../frontend")

app.mount("/static", StaticFiles(directory=FRONTEND), name="static")

@app.get("/")
def login_page():
    return FileResponse(os.path.join(FRONTEND, "login.html"))

@app.get("/register")
def register_page():
    return FileResponse(os.path.join(FRONTEND, "register.html"))

@app.post("/register")
async def register(data: dict):
    try:
        core.registerUser(
            data["firstName"],
            data["lastName"],
            data["username"],
            data["gender"],
            data["email"],
            data["password"]
        )
        return {"status": "ok"}

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@app.post("/login")
async def login(req: Request):
    data = await req.json()

    if core.login(data["username"], data["password"]):
        return {"status": "success"}
    return {"status": "fail"}