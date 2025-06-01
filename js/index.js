window.onload = function () {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    const productList = document.getElementById("product-list");
    const sortBy = document.getElementById("sortBy");
    const searchInput = document.getElementById("search");
    const searchBtn = document.getElementById("searchBtn");

    if (!productList) {
        console.error("No element with id 'product-list' found.");
        return;
    }
//to get the current price
    function getCurrentProductPrice(product) {
        const now = new Date();
        let price = product.originalPrice;

       
        if (
            product.discount &&
            product.discount.start &&
            product.discount.end &&
            new Date(product.discount.start) <= now &&
            now <= new Date(product.discount.end)
        ) {
            const discountedPrice = product.originalPrice - (product.originalPrice * product.discount.percentage / 100);
            return parseFloat(discountedPrice).toFixed(2);
        }

        return parseFloat(product.originalPrice || product.price).toFixed(2);
    }
//to render the products
    function renderProducts(filteredProductsWithIndex) {
        productList.innerHTML = "";

        if (filteredProductsWithIndex.length === 0) {
            productList.innerHTML = "<p>No products available.</p>";
            return;
        }

        filteredProductsWithIndex.forEach(({ product, idx }) => {
            const productElement = document.createElement("div");
            productElement.className = "product-item";
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="width: 120px; height: auto;">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div>
                    <button id="minus-${idx}" onclick="quantityMinus(${idx})" disabled>-</button>
                    <span class="quantity" id="quantity-${idx}">1</span>
                    <button id="plus-${idx}" onclick="quantityPlus(${idx})">+</button>
                </div>
                <p class="price">
                    ${
                        product.discount &&
                        product.discount.start &&
                        product.discount.end &&
                        new Date(product.discount.start) <= new Date() &&
                        new Date() <= new Date(product.discount.end)
                            ? `<span style="text-decoration: line-through; color: gray;">$${parseFloat(product.originalPrice).toFixed(2)}</span> 
                               <span style="color: red; font-weight: bold;"> $${getCurrentProductPrice(product)}</span> 
                               <small style="color: green;">
                               (${product.discount.percentage}% off)</small>`
                            : `$${parseFloat(product.originalPrice || product.price).toFixed(2) && parseFloat(product.price).toFixed(2)}
                            `
                    }
                </p>
                <button onclick="addToCart(${idx})">Add to Cart</button>
            `;
            productList.appendChild(productElement);
            updateButtonStates(idx, 0, product.quantity || 0);
        });
    }
//to filter the search and sort
    function filterAndSort() {
        let filteredProducts = products.map((product, idx) => ({ product, idx }));

        if (searchInput && searchInput.value.trim() !== "") {
            const query = searchInput.value.trim().toLowerCase();
            filteredProducts = filteredProducts.filter(({ product }) =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
        }

        if (sortBy) {
            switch (sortBy.value) {
                case "name-asc":
                    filteredProducts.sort((a, b) => a.product.name.localeCompare(b.product.name));
                    break;
                case "name-desc":
                    filteredProducts.sort((a, b) => b.product.name.localeCompare(a.product.name));
                    break;
                case "price-asc":
                    filteredProducts.sort((a, b) => parseFloat(getCurrentProductPrice(a.product)) - parseFloat(getCurrentProductPrice(b.product)));
                    break;
                case "price-desc":
                    filteredProducts.sort((a, b) => parseFloat(getCurrentProductPrice(b.product)) - parseFloat(getCurrentProductPrice(a.product)));
                    break;
            }
        }

        renderProducts(filteredProducts);
    }

    if (products.length === 0) {
        productList.innerHTML = "<p>No products available.</p>";
        return;
    }

    renderProducts(products.map((product, idx) => ({ product, idx })));

    if (searchBtn) {
        searchBtn.addEventListener("click", function (e) {
            e.preventDefault();
            filterAndSort();
        });
    }

    if (sortBy) {
        sortBy.addEventListener("change", filterAndSort);
    }
};
//to update the button states
function updateButtonStates(index, currentQuantity, maxQuantity) {
    const minusBtn = document.getElementById(`minus-${index}`);
    const plusBtn = document.getElementById(`plus-${index}`);

    if (minusBtn) minusBtn.disabled = currentQuantity <= 0;
    if (plusBtn) plusBtn.disabled = currentQuantity >= maxQuantity;
}
//to quantity plus
function quantityPlus(index) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const quantityElement = document.getElementById(`quantity-${index}`);
    let currentQuantity = parseInt(quantityElement.textContent) || 0;
    const maxQuantity = products[index]?.quantity || 1;

    if (currentQuantity < maxQuantity) {
        currentQuantity += 1;
        quantityElement.textContent = currentQuantity;
    }

    updateButtonStates(index, currentQuantity, maxQuantity);
}
//to quantity minus
function quantityMinus(index) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const quantityElement = document.getElementById(`quantity-${index}`);
    let currentQuantity = parseInt(quantityElement.textContent) || 1;

    if (currentQuantity >= 1) {
        currentQuantity -= 1;
        quantityElement.textContent = currentQuantity;
    }
    else {
        currentQuantity = 0;
        quantityElement.textContent = currentQuantity;
    }

    const maxQuantity = products[index]?.quantity || 0;
    updateButtonStates(index, currentQuantity, maxQuantity);
}
//to add to the cart
function addToCart(index) {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        alert("You must be logged in to add items to the cart.");
        window.location.href = "/html/Login.html"; 
        return;
    }

    const products = JSON.parse(localStorage.getItem("products")) || [];
    const quantityElement = document.getElementById(`quantity-${index}`);
    let currentQuantity = parseInt(quantityElement.textContent) || 0;
    const product = products[index];

    if (!product || currentQuantity <= 0) {
        alert("Please select a valid quantity.");
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex(item => item.name === product.name);

    const price = parseFloat(product.price); 

    if (isNaN(currentPrice)) {
        alert("Product price is invalid.");
        return;
    }

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += currentQuantity;
    } else {
        cart.push({
            image: product.image,
            name: product.name,
            description: product.description,
            price: price, 
            quantity: currentQuantity
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} has been added to your cart.`);
    quantityElement.textContent = "0";
    updateButtonStates(index, 0, product.quantity || 0);
}

//to render the product
function renderProduct(product) {
    const now = new Date();
    let priceHTML = "";

    if (
        product.discount &&
        product.discount.start &&
        product.discount.end &&
        new Date(product.discount.start) <= now &&
        now <= new Date(product.discount.end)
    ) {
        priceHTML = `
            <span style="text-decoration: line-through; color: gray;">
                $${parseFloat(product.originalPrice).toFixed(2)}
            </span> 
            <span style="color: red; font-weight: bold;">
                $${getCurrentProductPrice(product)}
            </span> 
            <small style="color: green;">(${product.discount.percentage}% off)</small>
        `;
    } else {
        priceHTML = `$${parseFloat(product.originalPrice || product.price).toFixed(2)}`;
    }

    return `
        <div class="product-item">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">${priceHTML}</p>
        </div>
    `;
}
//to update the product
function updateProduct(){
    prodects = JSON.parse(localStorage.getItem("products")) || [];
    products[0].price = parseFloat(products[0].price).toFixed(2);
    console.log(products[0].price);
}
//localStorage.setItem("products", JSON.stringify([]));