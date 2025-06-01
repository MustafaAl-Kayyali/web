//to load the page and get the products and render them
window.onload = function () {
    const select = document.getElementById("productSelect");
    const products = JSON.parse(localStorage.getItem("products")) || [];

    products.forEach((product, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = product.name;
        select.appendChild(option);
    });
//to change the product
    select.addEventListener("change", function () {
        const selectedIndex = parseInt(this.value);

        if (!isNaN(selectedIndex)) {
            const selectedProduct = products[selectedIndex];

            document.getElementById("Uname").value = selectedProduct.name || "";
            document.getElementById("Udescription").value = selectedProduct.description || "";
            document.getElementById("Uprice").value = selectedProduct.price || "";
            document.getElementById("Uquantity").value = selectedProduct.quantity || "";
            document.getElementById("imagePreview").src = selectedProduct.image || "";
            imageBase64 = selectedProduct.image || "";  
        } else {
            clearForm();
        }
    });
//to add the image
    document.getElementById("UproductImage").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            imageBase64 = e.target.result;
            const preview = document.getElementById("imagePreview");
            preview.src = imageBase64;
            preview.style.display = "block";
            preview.style.maxWidth = "200px";
            preview.style.maxHeight = "200px";
            preview.style.border = "1px solid #ccc";
            preview.style.marginTop = "10px";
        };
        reader.readAsDataURL(file);
    });
//to update the product
    document.getElementById("discountForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const select = document.getElementById("productSelect");
        const selectedIndex = parseInt(select.value);

        if (isNaN(selectedIndex)) {
            alert("Please select a product to update.");
            return;
        }

        const name = document.getElementById("Uname").value.trim();
        const description = document.getElementById("Udescription").value.trim();
        const price = document.getElementById("Uprice").value.trim();
        const quantity = document.getElementById("Uquantity").value.trim();

        if (!name || !description || !price || !quantity || !imageBase64) {
            alert("Please fill in all fields and upload an image.");
            return;
        }

        if (isNaN(price) || price <= 0) {
            alert("Please enter a valid price.");
            return;
        }

        if (isNaN(quantity) || quantity <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }

        const existingProduct = products.find((p, idx) => p.name.toLowerCase() === name.toLowerCase() && idx !== selectedIndex);
        if (existingProduct) {
            alert("Another product with this name already exists.");
            return;
        }

        products[selectedIndex].name = name;
        products[selectedIndex].description = description;
        products[selectedIndex].price = parseFloat(price);
        products[selectedIndex].quantity = parseInt(quantity);
        products[selectedIndex].image = imageBase64;

        localStorage.setItem("products", JSON.stringify(products));

        alert("Product updated successfully!");
        clearForm();


        refreshProductSelect();
    });
};
//to clear the form
function clearForm() {
    document.getElementById("productSelect").value = "";
    document.getElementById("Uname").value = "";
    document.getElementById("Udescription").value = "";
    document.getElementById("Uprice").value = "";
    document.getElementById("Uquantity").value = "";
    document.getElementById("UproductImage").value = "";
    document.getElementById("imagePreview").src = "";
    imageBase64 = "";
}
//to refresh the product select
function refreshProductSelect() {
    const select = document.getElementById("productSelect");
    select.innerHTML = '<option value="">-- Select a Product --</option>';

    products.forEach((product, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = product.name;
        select.appendChild(option);
    });
}
