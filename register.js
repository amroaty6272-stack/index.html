const form = document.getElementById("registerForm");
const error = document.getElementById("error");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value;

    if (username === "" || password === "") {
        error.textContent = "Fill all fields";
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username]) {
        error.textContent = "Username already exists";
        return;
    }

    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("loggedIn", "yes");
    localStorage.setItem("currentUser", username);
    window.location.href = "index.html";
});