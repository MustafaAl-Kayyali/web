let products = [];
let imageBase64 = "";
//to load the page and get the products
window.onload = () => {
    products = JSON.parse(localStorage.getItem("products")) || [];
};
//to add the image
document.getElementById("productImage").addEventListener("change", function (event) {
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
//to add the product
    document.getElementById("productForm").addEventListener("submit", function (e) {
    e.preventDefault(); 

    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = document.getElementById("price").value.trim();
    const quantity = document.getElementById("quantity").value.trim();

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

    const existingProduct = products.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (existingProduct) {
        alert("Product with this name already exists.");
        return;
    }

    const newProduct = {
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        image: imageBase64
    };

    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    alert("Product added successfully!");
    clearForm();
});
//to clear the form
function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("productImage").value = "";
    document.getElementById("imagePreview").src = "";
    imageBase64 = "";
}
