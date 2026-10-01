(function () {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const product = getProductById(id) || PRODUCTS[0];

    document.title = "Nours Makeup - " + product.name;
    document.getElementById("crumbName").textContent = product.name;
    document.getElementById("detailImage").src = product.image;
    document.getElementById("detailImage").alt = product.name;
    document.getElementById("detailName").textContent = product.name;
    document.getElementById("detailCategory").textContent = product.category;
    document.getElementById("detailDesc").textContent = product.description;
    document.getElementById("optPrice").textContent = "EGP " + product.price;
    document.getElementById("accHowTo").textContent = product.howToUse;
    document.getElementById("accIngredients").textContent = product.ingredients;

    // Quantity stepper
    let qty = 1;
    const qtyValue = document.getElementById("qtyValue");
    document.getElementById("qtyMinus").addEventListener("click", function () {
        if (qty > 1) { qty--; qtyValue.textContent = qty; }
    });
    document.getElementById("qtyPlus").addEventListener("click", function () {
        qty++; qtyValue.textContent = qty;
    });

    // Add to bag
    document.getElementById("addToBagBtn").addEventListener("click", function () {
        addToCart(product.name, product.price, qty);
        renderCart();
        document.getElementById("cartPanel").classList.add("open");
    });

    // Accordion
    function syncAccordionHeight(item) {
        const body = item.querySelector(".accordion-body");
        body.style.maxHeight = item.classList.contains("open") ? body.scrollHeight + "px" : "0px";
    }
    document.querySelectorAll("[data-acc]").forEach(function (item) {
        syncAccordionHeight(item);
        item.querySelector(".accordion-head").addEventListener("click", function () {
            document.querySelectorAll("[data-acc]").forEach(function (other) {
                if (other !== item) { other.classList.remove("open"); syncAccordionHeight(other); }
            });
            item.classList.toggle("open");
            syncAccordionHeight(item);
        });
    });

    // Related products
    const relatedGrid = document.getElementById("relatedGrid");
    PRODUCTS.filter(function (p) { return p.id !== product.id; })
        .slice(0, 4)
        .forEach(function (p) {
            relatedGrid.innerHTML += renderCard(p);
        });

    updateCartCount();
})();
