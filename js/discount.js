//to load the page and get the products
window.onload = function () {
    const select = document.getElementById("productSelect");
    const products = JSON.parse(localStorage.getItem("products")) || [];

    products.forEach((product, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = product.name;
        select.appendChild(option);
    });

    document.getElementById("discountForm").addEventListener("submit", function (e) {
        e.preventDefault();
        applyDiscount();
    });
};
//to apply the discount
function applyDiscount() {
    const index = document.getElementById("productSelect").value;
    const discount = parseFloat(document.getElementById("discount").value);
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    let products = JSON.parse(localStorage.getItem("products")) || [];

    if (!products[index].originalPrice) {
        products[index].originalPrice = parseFloat(products[index].price);  
    }

    products[index].discount = {
        percentage: discount,
        start :startDate,
        end: endDate
    };

    localStorage.setItem("products", JSON.stringify(products));
    alert("Discount applied successfully!");
}
