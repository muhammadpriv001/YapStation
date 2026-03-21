localStorage.removeItem("username");
sessionStorage.clear();

// =======================
// AVATAR
// =======================

function getAvatar(username, gender) {
    const base = "/static/assets/";

    const userImg = base + username + ".jpg";
    const genderImg = base + gender + ".jpg";

    const img = new Image();

    return new Promise((resolve) => {
        img.onload = () => resolve(userImg);

        img.onerror = () => {
            const gImg = new Image();

            gImg.onload = () => resolve(genderImg);

            gImg.onerror = () => resolve(base + "default.jpg");

            gImg.src = genderImg;
        };

        img.src = userImg;
    });
}

// =======================
// INIT
// =======================

let authInitialized = false;

document.addEventListener("DOMContentLoaded", () => {
    if (authInitialized) return; // 🔥 prevents reloading duplicate handlers
    authInitialized = true;

    handleRegister();
    handleLogin();
});

// =======================
// REGISTER
// =======================

function handleRegister() {
    const registerForm = document.querySelector("#registerForm");
    if (!registerForm) return;

    const errorBox = createErrorBox(registerForm);

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        errorBox.innerText = "";

        const firstName = registerForm.querySelector('input[placeholder="Hideo"]')?.value || "";
        const lastName = registerForm.querySelector('input[placeholder="Kojima"]')?.value || "";
        const username = registerForm.querySelector('input[placeholder="cyberpunk_2077"]')?.value || "";
        const email = registerForm.querySelector('input[type="email"]')?.value || "";
        const password = registerForm.querySelector('input[type="password"]')?.value || "";
        const gender = document.querySelector('input[name="gender"]:checked')?.value || "";
        const termsAccepted = document.querySelector("#terms")?.checked;

        if (!gender) {
            errorBox.innerText = "⚠️ Please select a gender";
            return;
        }

        if (!termsAccepted) {
            errorBox.innerText = "⚠️ You must agree to Terms";
            return;
        }

        const data = {
            firstName,
            lastName,
            gender,
            username,
            email,
            password
        };

        try {
            const res = await fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (result.status === "ok") {
                window.location.replace("/"); // 🔥 better than window.location
            } else {
                errorBox.innerText = result.message || "Registration failed";
            }

        } catch (err) {
            errorBox.innerText = "Server error during registration";
        }
    });
}

// =======================
// LOGIN
// =======================

function handleLogin() {
    const loginBtn = document.querySelector("#loginBtn");
    if (!loginBtn) return;

    const errorBox = createErrorBox(loginBtn.parentElement);

    loginBtn.addEventListener("click", async () => {

        errorBox.innerText = "";

        const username = document.querySelector('input[type="text"]')?.value || "";
        const password = document.querySelector('input[type="password"]')?.value || "";

        if (!username || !password) {
            errorBox.innerText = "⚠️ Fill all fields";
            return;
        }

        try {
            const res = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const result = await res.json();

            if (result.status === "success") {

                //SAFE SESSION STORAGE
                localStorage.setItem("username", username);                localStorage.setItem("username", username);
                window.location.replace("/chatList.html");

            } else {
                errorBox.innerText = "❌ Invalid username or password";
            }

        } catch (err) {
            errorBox.innerText = "❌ Server not responding";
        }
    });
}

// =======================
// ERROR BOX FACTORY
// =======================

function createErrorBox(parent) {
    const box = document.createElement("div");

    box.style.color = "red";
    box.style.marginTop = "10px";
    box.style.fontSize = "12px";
    box.style.textAlign = "center";
    box.style.width = "100%";

    parent.appendChild(box);

    return box;
}

// =======================
// GLOBAL LOGIN PROTECTION
// =======================

// auto-redirect if already logged in
(function protectAuthPages() {
    const username = localStorage.getItem("username");

    const onLoginPage = window.location.pathname === "/";
    const onRegisterPage = window.location.pathname === "/register";

    if (username && (onLoginPage || onRegisterPage)) {
        window.location.replace("/chatList.html");
    }
})();