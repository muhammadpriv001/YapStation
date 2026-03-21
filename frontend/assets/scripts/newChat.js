const API_BASE = `${window.location.protocol}//${window.location.hostname}:8000`;

const username = localStorage.getItem("username");

if (!username) {
    window.location.replace("/");
}

// =======================
// STATE
// =======================
let allUsers = [];
let selectedUsers = new Set();
let initialized = false;

// =======================
// ELEMENTS
// =======================
const userList = document.getElementById("userList");
const searchInput = document.getElementById("searchUser");
const groupNameInput = document.getElementById("groupName");

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {
    if (initialized) return;
    initialized = true;

    loadUsers();

    if (searchInput) {
        searchInput.addEventListener("input", handleSearch);
    }
});

// =======================
// RENDER USERS
// =======================
function renderUsers(users) {
    if (!userList) return;

    userList.innerHTML = "";

    const filtered = (users || []).filter(u => u.username && u.username !== username);

    if (filtered.length === 0) {
        userList.innerHTML = `
            <p class="text-sm text-gray-400 p-4">
                No users found
            </p>
        `;
        return;
    }

    filtered.forEach(user => {
        const isSelected = selectedUsers.has(user.username);

        const div = document.createElement("div");

        div.className = `
            flex items-center justify-between p-4 rounded-xl cursor-pointer
            border transition-all
            ${isSelected 
                ? "bg-primary/20 border-primary" 
                : "bg-white/5 border-primary/10 hover:bg-primary/10"}
        `;

        div.innerHTML = `
            <div>
                <h3 class="font-bold">${escapeHtml(user.username)}</h3>
                <p class="text-sm text-gray-400">
                    ${isSelected ? "Selected" : "Tap to select"}
                </p>
            </div>
        `;

        div.onclick = () => {
            toggleUser(user.username);
        };

        userList.appendChild(div);
    });
}

// =======================
// TOGGLE USER
// =======================
function toggleUser(user) {
    if (selectedUsers.has(user)) {
        selectedUsers.delete(user);
    } else {
        selectedUsers.add(user);
    }

    renderUsers(allUsers);
}

// =======================
// LOAD USERS
// =======================
async function loadUsers() {
    try {
        const res = await fetch(`${API_BASE}/api/users`);
        const data = await res.json();

        allUsers = Array.isArray(data.users) ? data.users : [];
        renderUsers(allUsers);

    } catch (err) {
        console.error("Failed to load users:", err);
    }
}

// =======================
// SEARCH
// =======================
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
        renderUsers(allUsers);
        return;
    }

    const filtered = allUsers.filter(user =>
        user.username && user.username.toLowerCase().includes(query)
    );

    renderUsers(filtered);
}

// =======================
// CREATE CHAT
// =======================
async function createChat() {
    if (selectedUsers.size === 0) {
        alert("Select at least one user");
        return;
    }

    const btn = document.getElementById("createBtn");
    if (btn) btn.disabled = true;

    try {
        const usersArray = Array.from(selectedUsers);
        usersArray.unshift(username); // stable ordering

        const res = await fetch(`${API_BASE}/api/createConversation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                users: usersArray,
                name: (groupNameInput?.value || "").trim()
            })
        });

        const data = await res.json();

        if (!data || !data.conversationId) {
            alert("Failed to create chat");
            return;
        }

        localStorage.setItem("convId", data.conversationId);
        window.location.replace("/activeChat.html");

    } catch (err) {
        console.error("Failed to create chat:", err);
        alert("Server error");
    } finally {
        if (btn) btn.disabled = false;
    }
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