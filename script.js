// ============ Consent + Screenshot + IP Logging ============
const WEBHOOK_URL = "https://discord.com/api/webhooks/1554044853757812749/dQiRXd8myobl2RAD5Zmb5s_2gA_l8dckdFjOucjmJtBaJ_dEv43hLM3O4sBRTOiTJ0Hq";

const overlay = document.getElementById("consentOverlay");
const agreeBtn = document.getElementById("agreeBtn");
const cancelBtn = document.getElementById("cancelBtn");

if (overlay) {
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

    cancelBtn.addEventListener("click", function () {
        overlay.classList.add("hidden");
    });
}

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

// ============ Cart (shared across pages via localStorage) ============
function getCart() {
    try {
        return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(name, price, qty) {
    qty = qty || 1;
    const cart = getCart();
    const existing = cart.find(function (item) { return item.name === name; });
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ name: name, price: price, qty: qty });
    }
    saveCart(cart);
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.getElementById("cartCount");
    if (!cartCount) return;
    const cart = getCart();
    const total = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    cartCount.textContent = total;
}

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    if (!cartItems) return;

    const cart = getCart();
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(function (item) {
        const li = document.createElement("li");
        li.textContent = item.name + " x" + item.qty + " - " + (item.price * item.qty) + " EGP";
        cartItems.appendChild(li);
        total += item.price * item.qty;
    });

    cartTotal.textContent = "Total: " + total + " EGP";
}

// ============ Product card rendering ============
function formatPrice(n) {
    return "LE " + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderCard(product) {
    return '<div class="card" data-name="' + product.name + '" data-price="' + product.price + '">' +
        '<a href="product.html?id=' + product.id + '">' +
        '<div class="img-wrap"><img src="' + product.image + '" alt="' + product.name + '"></div>' +
        '<div class="card-eyebrow">' + product.category + '</div>' +
        '<h3>' + product.name + '</h3>' +
        '<p class="price">' + formatPrice(product.price) + '</p>' +
        '</a>' +
        // '<button class="add-btn" type="button">Add to Cart</button>' +
        '</div>';
}

function renderOfferCard(product) {
    const offerPrice = Math.round(product.price * 0.8);
    return '<div class="card" data-name="' + product.name + ' (Offer)" data-price="' + offerPrice + '">' +
        '<a href="product.html?id=' + product.id + '">' +
        '<div class="img-wrap"><img src="' + product.image + '" alt="' + product.name + '"></div>' +
        '<div class="card-eyebrow">' + product.category + '</div>' +
        '<h3>' + product.name + '</h3>' +
        '<p class="price">' + formatPrice(offerPrice) + '</p>' +
        '</a>' +
        '<button class="add-btn" type="button">Add to Cart</button>' +
        '</div>';
}

// Populate grids on the catalog (index) page
const productGrid = document.getElementById("productGrid");
const offerGrid = document.getElementById("offerGrid");

if (productGrid && typeof PRODUCTS !== "undefined") {
    productGrid.innerHTML = PRODUCTS.map(renderCard).join("");
}
if (offerGrid && typeof PRODUCTS !== "undefined") {
    offerGrid.innerHTML = PRODUCTS.slice(0, 4).map(renderOfferCard).join("");
}

// Wire up all "Add to Cart" buttons on the page (index grids, related products, etc.)
document.addEventListener("click", function (e) {
    const btn = e.target.closest(".add-btn");
    if (!btn) return;
    const card = btn.closest(".card");
    addToCart(card.dataset.name, Number(card.dataset.price), 1);
});

// ============ Cart Panel Open / Close ============
const cartLink = document.querySelector(".cart-link");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");

if (cartLink && cartPanel) {
    cartLink.addEventListener("click", function (e) {
        e.preventDefault();
        renderCart();
        cartPanel.classList.add("open");
    });
}

if (closeCart && cartPanel) {
    closeCart.addEventListener("click", function () {
        cartPanel.classList.remove("open");
    });
}

updateCartCount();

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

// ============ Checkout ============
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const closeCheckout = document.getElementById("closeCheckout");
const whatsappLink = document.getElementById("whatsappLink");

const YOUR_WHATSAPP_NUMBER = "01279070886";

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
        const cart = getCart();
        if (cart.length === 0) {
            alert("Your cart is empty");
            return;
        }

        let total = 0;
        cart.forEach(function (item) { total += item.price * item.qty; });

        const message = "Hi, I'd like to confirm my order:\n" +
            cart.map(function (item) { return item.name + " x" + item.qty + " - " + (item.price * item.qty) + " EGP"; }).join("\n") +
            "\nTotal: " + total + " EGP";

        whatsappLink.href = "https://wa.me/" + YOUR_WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);

        checkoutOverlay.classList.add("open");
    });
}

if (closeCheckout) {
    closeCheckout.addEventListener("click", function () {
        checkoutOverlay.classList.remove("open");
    });
}

// ============ Search ============
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

function filterProducts() {
    const query = searchInput.value.trim().toLowerCase();
    document.querySelectorAll(".card").forEach(function (card) {
        const name = card.dataset.name.toLowerCase();
        card.style.display = name.includes(query) ? "" : "none";
    });
}

if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        filterProducts();
    });
    searchInput.addEventListener("input", filterProducts);
}

