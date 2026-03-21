const API_BASE = `${window.location.protocol}//${window.location.hostname}:8000`;

// =======================
// USER
// =======================
const username = localStorage.getItem("username");
if (!username) window.location = "/";

// =======================
// CONVERSATION
// =======================
const convId = localStorage.getItem("convId");

// =======================
// SOCKET
// =======================
let socket = null;
let reconnectAttempts = 0;

// =======================
// STATE
// =======================
let onlineUsers = new Set();
let currentChatUser = null;

// =======================
// ELEMENTS
// =======================
let chatBox, fileInput, input, sendBtn, backBtn, headerTitle, headerSub;

// =======================
// SOCKET CONNECT FUNCTION
// =======================
function connectSocket() {
    const WS_PROTOCOL = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.hostname;
    socket = new WebSocket(`${WS_PROTOCOL}://${host}:8000/ws/${encodeURIComponent(username)}`);

    socket.onopen = () => {
        console.log("Socket connected");

        reconnectAttempts = 0;

        socket.send(JSON.stringify({
            type: "online",
            user: username
        }));
    };

    socket.onmessage = (e) => {
        const msg = JSON.parse(e.data);

        // ONLINE USERS UPDATE
        if (msg.type === "online_list") {
            onlineUsers = new Set(msg.users);
            updateOnlineStatus();
            return;
        }

        // CHAT MESSAGE
        if (msg.conversationId == convId) {
            addMessage(msg);
        }
    };

    socket.onclose = () => {
        console.log("Socket disconnected. Reconnecting...");

        const timeout = Math.min(1000 * 2 ** reconnectAttempts, 10000);
        reconnectAttempts++;

        setTimeout(connectSocket, timeout);
    };

    socket.onerror = () => {
        socket.close();
    };
}

// =======================
// HEADER
// =======================
function setupHeader() {
    backBtn = document.querySelector("header button");
    headerTitle = document.querySelector("header h2");
    headerSub = document.querySelector("header p");

    if (backBtn) {
        backBtn.onclick = () => {
            window.location.href = "/chatList.html";
        };
    }
}

// =======================
// LOAD CONVERSATION INFO
// =======================
async function loadConversationInfo() {
    const res = await fetch(`${API_BASE}/api/conversations/${username}`);
    const data = await res.json();

    const conv = data.data.find(row => row.startsWith(convId + "|"));
    if (!conv) return;

    const [id, name, isGroup] = conv.split("|");

    headerTitle.textContent = name;
    currentChatUser = name;

    if (isGroup === "1") {
        const res2 = await fetch(`${API_BASE}/api/conversationUsers/${convId}`);
        const users = await res2.json();

        headerSub.innerHTML = `
            <div class="overflow-hidden whitespace-nowrap w-40">
                <div class="animate-marquee inline-block">
                    ${users.users.join(" • ")}
                </div>
            </div>
        `;
    } else {
        headerSub.textContent = "Offline";
    }
}

// =======================
// ONLINE STATUS
// =======================
function updateOnlineStatus() {
    if (!headerSub || !currentChatUser) return;

    const isOnline = onlineUsers.has(currentChatUser);

    headerSub.textContent = isOnline ? "Online" : "Offline";

    const container = document.getElementById("status-container");
    if (!container) return;

    container.innerHTML = `
        <div class="w-3 h-3 rounded-full border-2 border-background-dark ${
            isOnline ? "bg-green-500" : "bg-red-500"
        }"></div>
    `;
}

// =======================
// LOAD MESSAGES
// =======================
async function loadMessages() {
    if (!convId) return;

    const res = await fetch(`${API_BASE}/api/messages/${convId}`);
    const data = await res.json();

    if (!chatBox) return;

    chatBox.innerHTML = "";
    data.messages.forEach(addMessage);
}

// =======================
// RENDER MESSAGE
// =======================
function addMessage(raw) {
    let msg;

    if (typeof raw === "string") {
        const [sender, content, type, media] = raw.split("|");
        msg = { sender, content, type, media };
    } else {
        msg = raw;
    }

    const isMe = msg.sender === username;

    const wrapper = document.createElement("div");

    wrapper.className = isMe
        ? "flex justify-end w-full min-w-0"
        : "flex justify-start w-full min-w-0";

    let bubble = "";

    // TEXT
    if (msg.type === "text") {
        bubble = isMe
            ? `
            <div class="max-w-[70%] min-w-0 flex flex-col items-end leading-none">
                <div class="bg-primary text-white rounded-xl rounded-br-none px-2 py-0 shadow-lg max-w-full">
                    <span class="text-sm leading-none break-words whitespace-pre-wrap block">
                        ${msg.content}
                    </span>
                </div>
                <span class="text-sm text-slate-500 mr-1">${msg.sender}</span>
            </div>
            `
            : `
            <div class="max-w-[70%] min-w-0 flex flex-col items-start leading-none">
                <div class="bg-slate-200 dark:bg-slate-800/50 rounded-xl rounded-bl-none px-3 py-0 shadow-sm max-w-full">
                    <span class="text-sm leading-none break-words whitespace-pre-wrap">
                        ${msg.content}
                    </span>
                </div>
                <span class="text-sm text-slate-500 ml-1">${msg.sender}</span>
            </div>
            `;
    }

    // IMAGE
    if (msg.type === "image") {
        bubble = `
        <div class="flex flex-col gap-1 ${isMe ? "items-end" : ""} max-w-[85%]">
            <div class="p-1 rounded-xl ${isMe ? "bg-primary rounded-br-none" : "bg-slate-200 dark:bg-slate-800/50 rounded-bl-none"}">
                <img src="${msg.media}" class="w-48 rounded-lg object-cover"/>
            </div>
            <span class="text-sm text-slate-500 ${isMe ? "mr-1" : "ml-1"}">${msg.sender}</span>
        </div>
        `;
    }

    // VIDEO
    if (msg.type === "video") {
        bubble = `
        <div class="flex flex-col gap-1 ${isMe ? "items-end" : ""} max-w-[85%]">
            <div class="p-1 rounded-xl ${isMe ? "bg-primary rounded-br-none" : "bg-slate-200 dark:bg-slate-800/50 rounded-bl-none"}">
                <video src="${msg.media}" controls class="w-48 rounded-lg"></video>
            </div>
            <span class="text-sm text-slate-500 ${isMe ? "mr-1" : "ml-1"}">${msg.sender}</span>
        </div>
        `;
    }

    wrapper.innerHTML = bubble;
    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// =======================
// SEND MESSAGE
// =======================
function sendMessage() {
    const text = input.value.trim();

    if (!text) return;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({
        conversationId: convId,
        sender: username,
        type: "text",
        content: text,
        media: ""
    }));

    input.value = "";
}

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {
    chatBox = document.getElementById("messages");
    fileInput = document.getElementById("fileInput");
    input = document.getElementById("msgInput");
    sendBtn = document.getElementById("sendBtn");

    setupHeader();

    if (sendBtn) {
        sendBtn.addEventListener("click", sendMessage);
    }

    if (input) {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") sendMessage();
        });
    }

    if (fileInput) {
        fileInput.addEventListener("change", function () {
            const file = this.files[0];
            if (!file || !socket || socket.readyState !== WebSocket.OPEN) return;

            const reader = new FileReader();

            reader.onload = () => {
                socket.send(JSON.stringify({
                    conversationId: convId,
                    sender: username,
                    type: file.type.startsWith("image") ? "image" : "video",
                    content: "",
                    media: reader.result
                }));
            };

            reader.readAsDataURL(file);
        });
    }

    // START EVERYTHING
    connectSocket();
    loadConversationInfo();
    loadMessages();
});