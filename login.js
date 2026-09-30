const form = document.getElementById("loginForm");
const error = document.getElementById("error");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username] && users[username] === password) {
        localStorage.setItem("loggedIn", "yes");
        localStorage.setItem("currentUser", username);
        window.location.href = "index.html";
    } else {
        error.textContent = "Wrong username or password";
    }
});