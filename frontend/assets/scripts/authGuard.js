(function () {
    const username = localStorage.getItem("username");

    if (!username || username === "null" || username === "undefined") {
        localStorage.removeItem("username");
    }

    const current = window.location.pathname;

    const isAuthPage = current === "/" || current === "/register";
    const isProtected = !isAuthPage;

    // NOT LOGGED IN → FORCE LOGIN
    if (!localStorage.getItem("username") && isProtected) {
        window.location.replace("/");
        return;
    }

    window.addEventListener("pageshow", function () {
        const username = localStorage.getItem("username");

        if (!username && isProtected) {
            window.location.replace("/");
        }
    });
})();