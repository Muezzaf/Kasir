const products = [
  { id: 1, name: "60 Menit", price: 5000 },
  { id: 2, name: "Nasi Goreng", price: 15000 },
  { id: 3, name: "Keripik", price: 7000 },
];

const cart = [];

function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  products.forEach(prod => {
    const item = document.createElement("div");
    item.className = "produk-item";
    item.innerHTML = `<h4>${prod.name}</h4><p>Rp ${prod.price}</p>`;
    item.onclick = () => addToCart(prod);
    grid.appendChild(item);
  });
}

function addToCart(product) {
  cart.push(product);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement("div");
    div.textContent = `${item.name} - Rp ${item.price}`;
    cartItems.appendChild(div);
  });

  document.getElementById("totalHarga").textContent = "Rp " + total;
}

document.getElementById("bayarBtn").addEventListener("click", () => {
  alert("Transaksi berhasil! Total: Rp " + cart.reduce((a, b) => a + b.price, 0));
  cart.length = 0;
  updateCart();
});

renderProducts();
