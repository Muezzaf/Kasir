let products = JSON.parse(localStorage.getItem("produk")) || [
  { id: 1, name: "Es Teh", price: 5000, kategori: "Minuman" },
  { id: 2, name: "Nasi Goreng", price: 15000, kategori: "Makanan" },
  { id: 3, name: "Keripik", price: 7000, kategori: "Snack" },
];

const cart = [];
let filterAktif = 'all';

function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  const hasilFilter = filterAktif === 'all' ? products : products.filter(p => p.kategori === filterAktif);
  hasilFilter.forEach(prod => {
    const item = document.createElement("div");
    item.className = "produk-item";
    item.innerHTML = `
      <h4>${prod.name}</h4>
      <p>Rp ${prod.price}</p>
      <small>${prod.kategori}</small><br>
      <button class="edit-btn" onclick="editProduk(${prod.id})">Edit</button>
      <button class="hapus-btn" onclick="hapusProduk(${prod.id})">Hapus</button>
    `;
    item.onclick = (e) => {
      if (!e.target.classList.contains('edit-btn') && !e.target.classList.contains('hapus-btn')) {
        addToCart(prod);
      }
    };
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
    div.innerHTML = `${item.name} - Rp ${item.price} <button onclick="hapusDariCart(${index})">❌</button>`;
    cartItems.appendChild(div);
  });

  document.getElementById("totalHarga").textContent = "Rp " + total;
}

function hapusDariCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function simpanProdukBaru() {
  const nama = document.getElementById("namaProduk").value.trim();
  const harga = parseInt(document.getElementById("hargaProduk").value);
  const kategori = document.getElementById("kategoriProduk").value;
  if (!nama || isNaN(harga)) return alert("Isi nama & harga dengan benar.");
  const newProduct = { id: Date.now(), name: nama, price: harga, kategori };
  products.push(newProduct);
  localStorage.setItem("produk", JSON.stringify(products));
  renderProducts();
  document.getElementById("namaProduk").value = "";
  document.getElementById("hargaProduk").value = "";
  document.getElementById("formTambahProduk").style.display = "none";
}

function editProduk(id) {
  const produk = products.find(p => p.id === id);
  const namaBaru = prompt("Ubah nama produk:", produk.name);
  const hargaBaru = prompt("Ubah harga:", produk.price);
  if (namaBaru && hargaBaru && !isNaN(parseInt(hargaBaru))) {
    produk.name = namaBaru;
    produk.price = parseInt(hargaBaru);
    localStorage.setItem("produk", JSON.stringify(products));
    renderProducts();
  } else {
    alert("Input tidak valid.");
  }
}

function hapusProduk(id) {
  if (confirm("Yakin hapus produk ini?")) {
    const index = products.findIndex(p => p.id === id);
    if (index > -1) {
      products.splice(index, 1);
      localStorage.setItem("produk", JSON.stringify(products));
      renderProducts();
    }
  }
}

function filterKategori(kat) {
  filterAktif = kat;
  renderProducts();
  document.querySelectorAll('.kategori li').forEach(li => li.classList.remove('active'));
  const aktif = [...document.querySelectorAll('.kategori li')].find(li => li.textContent.includes(kat) || kat === 'all');
  if (aktif) aktif.classList.add('active');
}

document.getElementById("addProductBtn").addEventListener("click", () => {
  const form = document.getElementById("formTambahProduk");
  form.style.display = form.style.display === "none" ? "block" : "none";
});

document.getElementById("bayarBtn").addEventListener("click", () => {
  const total = cart.reduce((a, b) => a + b.price, 0);
  if (cart.length === 0) return alert("Keranjang kosong!");
  simpanTransaksi(cart, total);
  tampilkanStruk(cart, total);
  cart.length = 0;
  updateCart();
});

function simpanTransaksi(keranjang, total) {
  const transaksi = {
    waktu: new Date().toLocaleString("id-ID"),
    barang: [...keranjang],
    total
  };
  let riwayat = JSON.parse(localStorage.getItem("riwayat")) || [];
  riwayat.push(transaksi);
  localStorage.setItem("riwayat", JSON.stringify(riwayat));
}

document.getElementById("lihatRiwayatBtn").addEventListener("click", () => {
  const box = document.getElementById("riwayatBox");
  const list = document.getElementById("riwayatList");
  const data = JSON.parse(localStorage.getItem("riwayat")) || [];
  list.innerHTML = "";
  if (data.length === 0) {
    list.innerHTML = "<p>Belum ada transaksi.</p>";
  } else {
    data.reverse().forEach(tx => {
      const items = tx.barang.map(b => `${b.name} (Rp ${b.price})`).join(", ");
      list.innerHTML += `<p><strong>${tx.waktu}</strong><br>${items}<br><strong>Total:</strong> Rp ${tx.total}</p>`;
    });
  }
  box.style.display = "block";
});

function exportExcel() {
  const riwayat = JSON.parse(localStorage.getItem("riwayat")) || [];
  if (riwayat.length === 0) return alert("Belum ada transaksi!");
  let html = `<table border='1'><tr><th>Waktu</th><th>Barang</th><th>Total</th></tr>`;
  riwayat.forEach(tx => {
    const items = tx.barang.map(b => `${b.name} (Rp ${b.price})`).join(", ");
    html += `<tr><td>${tx.waktu}</td><td>${items}</td><td>Rp ${tx.total}</td></tr>`;
  });
  html += "</table>";
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "riwayat-transaksi.xls";
  link.click();
}

function tampilkanStruk(items, total) {
  const container = document.getElementById("isiStruk");
  const waktu = new Date().toLocaleString("id-ID");
  let html = `<h3>Struk KasirQ</h3><p>${waktu}</p><hr>`;
  items.forEach(item => {
    html += `<p>${item.name} - Rp ${item.price}</p>`;
  });
  html += `<hr><p><strong>Total:</strong> Rp ${total}</p>`;
  container.innerHTML = html;
  document.getElementById("popupStruk").style.display = "block";
}

function tutupStruk() {
  document.getElementById("popupStruk").style.display = "none";
}
function tutupRiwayat() {
  document.getElementById("riwayatBox").style.display = "none";
}

function hapusSemuaRiwayat() {
  if (confirm("Yakin mau hapus semua riwayat transaksi?")) {
    localStorage.removeItem("riwayat");
    document.getElementById("riwayatList").innerHTML = "<p>Belum ada transaksi.</p>";
  }
}

function logout() {
  localStorage.removeItem("kasir");
  window.location.href = "login.html";
}

renderProducts();
