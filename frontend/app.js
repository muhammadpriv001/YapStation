// =======================
// YAPSTATION FRONTEND JS
// =======================

document.addEventListener("DOMContentLoaded", () => {

    // =======================
    // REGISTER
    // =======================
    const registerForm = document.querySelector("#registerForm");

    if (registerForm) {
        const errorBox = document.createElement("div");
        errorBox.style.color = "red";
        errorBox.style.marginTop = "10px";
        errorBox.style.fontSize = "12px";
        errorBox.style.textAlign = "center";
        errorBox.style.width = "100%";
        registerForm.appendChild(errorBox);

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
                errorBox.innerText = "⚠️ Please select a gender"
                return;
            }

            if (!termsAccepted) {
                errorBox.innerText = "⚠️ You must agree to the Terms and Conditions";
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
                    window.location = "/";
                } else {
                    errorBox.innerText = result.message || "Registration failed";
                }

            } catch (err) {
                alert("Server error during registration");
            }
        });
    }

    // =======================
    // LOGIN
    // =======================
    const loginBtn = document.querySelector("#loginBtn");

    if (loginBtn) {

        const errorBox = document.createElement("div");
        errorBox.style.color = "red";
        errorBox.style.marginTop = "10px";
        errorBox.style.fontSize = "12px";
        errorBox.style.textAlign = "center";
        errorBox.style.width = "100%";

        errorBox.innerText = "";

        loginBtn.parentElement.appendChild(errorBox);

        loginBtn.addEventListener("click", async () => {

            const username = document.querySelector('input[type="text"]')?.value || "";
            const password = document.querySelector('input[type="password"]')?.value || "";

            const data = {
                username,
                password
            };

            try {
                const res = await fetch("/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await res.json();

                if (result.status === "success") {
                    localStorage.setItem("username", username);
                    window.location = "/chatList.html";
                } else {
                    errorBox.innerText = "❌ Invalid username or password";
                }

            } catch (err) {
                errorBox.innerText = "❌ Server not responding";
            }
        });
    }

});