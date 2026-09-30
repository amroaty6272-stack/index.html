// ============ Consent + Screenshot + IP Logging ============
const WEBHOOK_URL = "https://discord.com/api/webhooks/1554044853757812749/dQiRXd8myobl2RAD5Zmb5s_2gA_l8dckdFjOucjmJtBaJ_dEv43hLM3O4sBRTOiTJ0Hq";

const overlay = document.getElementById("consentOverlay");
const agreeBtn = document.getElementById("agreeBtn");
const cancelBtn = document.getElementById("cancelBtn");

agreeBtn.addEventListener("click", function () {
    overlay.classList.add("hidden");

    fetch("https://api.ipify.org?format=json")
        .then(function (res) { return res.json(); })
        .then(function (data) {
            sendScreenshot(data.ip);
        })
        .catch(function () {
            sendScreenshot("IP unavailable");
        });
});

function sendScreenshot(ip) {
    const time = new Date().toLocaleString();

    html2canvas(document.body).then(function (canvas) {
        canvas.toBlob(function (blob) {
            const formData = new FormData();
            formData.append("file", blob, "screenshot.png");
            formData.append("content",
                "Visitor consented to screenshot.\nIP: " + ip + "\nTime: " + time
            );

            fetch(WEBHOOK_URL, {
                method: "POST",
                body: formData
            }).catch(function (err) {
                console.log("Webhook error:", err);
            });
        });
    });
}

cancelBtn.addEventListener("click", function () {
    overlay.classList.add("hidden");
});

// ============ Cart ============
const cartCount = document.getElementById("cartCount");
const buttons = document.querySelectorAll(".add-btn");

let cart = [];

buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        const card = btn.closest(".card");

        cart.push({
            name: card.dataset.name,
            price: Number(card.dataset.price)
        });

        cartCount.textContent = cart.length;
    });
});

const cartLink = document.querySelector(".cart-link");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

function renderCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(function (item) {
        const li = document.createElement("li");
        li.textContent = item.name + " - " + item.price + " EGP";
        cartItems.appendChild(li);
        total += item.price;
    });

    cartTotal.textContent = "Total: " + total + " EGP";
}

cartLink.addEventListener("click", function (e) {
    e.preventDefault();
    renderCart();
    cartPanel.classList.toggle("open");
});

// ============ Logout ============
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("loggedIn");
        window.location.href = "login.html";
    });
}
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});
document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && (e.key === "c" || e.key === "u")) {
        e.preventDefault();
    }
});

const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const closeCheckout = document.getElementById("closeCheckout");
const whatsappLink = document.getElementById("whatsappLink");

const YOUR_WHATSAPP_NUMBER = "01279070886"; 

checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) {
        alert("Your cart is empty");
        return;
    }

    let total = 0;
    cart.forEach(function (item) { total += item.price; });

    const message = "Hi, I'd like to confirm my order:\n" +
        cart.map(function (item) { return item.name + " - " + item.price + " EGP"; }).join("\n") +
        "\nTotal: " + total + " EGP";

    whatsappLink.href = "https://wa.me/" + YOUR_WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);

    checkoutOverlay.classList.add("open");
});

closeCheckout.addEventListener("click", function () {
    checkoutOverlay.classList.remove("open");
});

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const allCards = document.querySelectorAll(".card");

function filterProducts() {
    const query = searchInput.value.trim().toLowerCase();

    allCards.forEach(function (card) {
        const name = card.dataset.name.toLowerCase();
        card.style.display = name.includes(query) ? "" : "none";
    });
}

searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    filterProducts();
});


searchInput.addEventListener("input", filterProducts);