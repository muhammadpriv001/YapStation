const API_BASE = `${window.location.protocol}//${window.location.hostname}:8000`;

const username = localStorage.getItem("username");

// =======================
// AUTH GUARD
// =======================
if (!username) {
    window.location.replace("/");
}

// =======================
// STATE
// =======================
let allConversations = [];

const container = document.getElementById("chatList");
const searchInput = document.getElementById("searchInput");

// prevent double init on reload/hot reload
let initialized = false;

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {
    if (initialized) return;
    initialized = true;

    loadConversations();

    if (searchInput) {
        searchInput.addEventListener("input", handleSearch);
    }

    // optional live refresh (chat apps NEED this)
    setInterval(loadConversations, 5000);
});

// =======================
// SAFE PARSE
// =======================
function parseConv(row) {
    if (!row || typeof row !== "string") return null;

    const parts = row.split("|");

    const id = parts[0];
    const name = parts[1] || "Unknown";
    const isGroup = parts[2] || "0";

    return { id, name, isGroup };
}

// =======================
// RENDER
// =======================
function renderConversations(convs) {
    if (!container) return;

    container.innerHTML = "";

    if (!convs || !convs.length) {
        container.innerHTML = `
            <p class="text-sm text-gray-400 p-4">
                No conversations yet
            </p>
        `;
        return;
    }

    convs.forEach(row => {
        const conv = parseConv(row);
        if (!conv) return;

        const { id, name, isGroup } = conv;

        const isGroupChat = isGroup === "1";

        const div = document.createElement("div");

        div.className =
            "flex items-center justify-between p-4 rounded-xl cursor-pointer bg-white/5 hover:bg-primary/10 border border-primary/10 transition-all";

        div.innerHTML = `
            <div>
                <h3 class="font-bold">
                    ${isGroupChat ? "👥 " : "💬 "}${escapeHtml(name)}
                </h3>
                <p class="text-sm text-gray-400">
                    ${isGroupChat ? "Group Chat" : "Direct Message"}
                </p>
            </div>
        `;

        div.onclick = () => {
            localStorage.setItem("convId", id);
            window.location.replace("/activeChat.html");
        };

        container.appendChild(div);
    });
}

// =======================
// LOAD CONVERSATIONS
// =======================
async function loadConversations() {
    try {
        const res = await fetch(`${API_BASE}/api/conversations/${username}`);
        const data = await res.json();

        allConversations = Array.isArray(data.data) ? data.data : [];

        renderConversations(allConversations);

    } catch (err) {
        console.error("Failed to load conversations:", err);
    }
}

// =======================
// SEARCH
// =======================
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
        renderConversations(allConversations);
        return;
    }

    const filtered = allConversations.filter(row => {
        const conv = parseConv(row);
        if (!conv) return false;

        return conv.name.toLowerCase().includes(query);
    });

    renderConversations(filtered);
}

// =======================
// SECURITY
// =======================
function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}