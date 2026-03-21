from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import engine
import os

app = FastAPI()
core = engine.Engine()

BASE = os.path.dirname(__file__)
FRONTEND = os.path.join(BASE, "../frontend")

app.mount("/static", StaticFiles(directory=FRONTEND), name="static")

# =========================
# CONNECTIONS
# =========================
connections = {}

# =========================
# BROADCAST ONLINE USERS
# =========================
async def broadcast_online():
    users = list(connections.keys())

    payload = {
        "type": "online_list",
        "users": users
    }

    for user in connections:
        for ws in list(connections[user]):
            try:
                await ws.send_json(payload)
            except:
                pass

# =========================
# LOGIN
# =========================
@app.get("/")
def login_page():
    return FileResponse(os.path.join(FRONTEND, "login.html"))

@app.post("/login")
async def login(req: Request):
    data = await req.json()

    if core.login(data["username"], data["password"]):
        return {"status": "success"}
    return {"status": "fail"}

# =========================
# REGISTER
# =========================
@app.get("/register")
def register_page():
    return FileResponse(os.path.join(FRONTEND, "register.html"))

@app.post("/register")
async def register(data: dict):
    try:
        core.registerUser(
            data["firstName"],
            data["lastName"],
            data["gender"],
            data["username"],
            data["email"],
            data["password"]
        )
        return {"status": "ok"}

    except Exception as e:
        return {"status": "error", "message": str(e)}

# =========================
# PAGES
# =========================
@app.get("/chatList.html")
def chat_list_page():
    return FileResponse(os.path.join(FRONTEND, "chatList.html"))

@app.get("/newChat.html")
def new_chat_page():
    return FileResponse(os.path.join(FRONTEND, "newChat.html"))

@app.get("/activeChat.html")
def active_chat():
    return FileResponse(os.path.join(FRONTEND, "activeChat.html"))

# =========================
# API
# =========================
@app.get("/api/conversationUsers/{convId}")
def get_conversation_users(convId: int):
    return {"users": core.getConversationUsers(convId)}

@app.get("/api/conversations/{username}")
def get_conversations(username: str):
    return {"data": core.getUserConversations(username)}

@app.get("/api/users")
def get_all_users():
    users = core.getAllUsers()
    return {"users": [{"username": u} for u in users]}

@app.post("/api/createConversation")
async def create_chat(data: dict):
    users = sorted(data.get("users", []))
    name = (data.get("name") or "").strip()

    if len(users) < 2:
        return {"error": "Need at least 2 users"}

    is_group = len(users) >= 3

    existing = core.findConversation(users)
    if existing != -1:
        return {"conversationId": existing}

    if is_group:
        if not name:
            name = "Group Chat"
    else:
        name = users[1]

    conv_id = core.createConversation(users, is_group, name)

    return {"conversationId": conv_id}

@app.get("/api/messages/{convId}")
def get_messages(convId: int):
    return {"messages": core.getMessages(convId)}

# =========================
# WEBSOCKET
# =========================
@app.websocket("/ws/{username}")
async def websocket_endpoint(ws: WebSocket, username: str):
    await ws.accept()

    connections.setdefault(username, set()).add(ws)

    await broadcast_online()

    try:
        while True:
            data = await ws.receive_json()

            # IGNORE PING / ONLINE EVENTS
            if data.get("type") == "online":
                await broadcast_online()
                continue

            convo_id = data.get("conversationId")
            sender = data.get("sender")
            msg_type = data.get("type")
            content = data.get("content", "")
            media = data.get("media", "")

            # SAFE VALIDATION (FIXED)
            if convo_id is None or sender is None or msg_type is None:
                continue

            try:
                convo_id = int(convo_id)
            except:
                continue

            core.sendMessage(sender, convo_id, content, msg_type, media)

            users = core.getConversationUsers(convo_id)

            payload = {
                "conversationId": convo_id,
                "sender": sender,
                "type": msg_type,
                "content": content,
                "media": media
            }

            # BROADCAST MESSAGE
            for u in users:
                if u in connections:
                    dead = []

                    for conn in connections[u]:
                        try:
                            await conn.send_json(payload)
                        except:
                            dead.append(conn)

                    for d in dead:
                        connections[u].remove(d)

    except WebSocketDisconnect:
        pass

    finally:
        if username in connections:
            connections[username].discard(ws)

            if len(connections[username]) == 0:
                del connections[username]

            await broadcast_online()