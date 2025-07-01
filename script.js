// Final script.js dengan komisi per terapis dinamis dan tampilan harga Rp50.000

function formatRupiah(angka) {
  return 'Rp' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

let products = JSON.parse(localStorage.getItem("produk")) || [
  { id: 1, name: "Refleksi 60 Menit", price: 70000, kategori: "Refleksi" },
  { id: 2, name: "Full Body Massage 90 Menit", price: 120000, kategori: "Full Body Massage" },
  { id: 3, name: "Totok Wajah", price: 50000, kategori: "Other Service" },
];

let dataTerapis = JSON.parse(localStorage.getItem("terapis")) || [
  { nama: "Terapis A", komisi: 0.4 },
  { nama: "Terapis B", komisi: 0.35 }
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
      <p>${formatRupiah(prod.price)}</p>
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
    div.innerHTML = `${item.name} - ${formatRupiah(item.price)} <button onclick="hapusDariCart(${index})">❌</button>`;
    cartItems.appendChild(div);
  });

  document.getElementById("totalHarga").textContent = formatRupiah(total);
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
  const namaBaru = prompt("Ubah nama layanan:", produk.name);
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
  if (confirm("Yakin hapus layanan ini?")) {
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

function renderDropdownTerapis() {
  const select = document.getElementById("namaTerapis");
  select.innerHTML = "<option value=''>--Pilih Terapis--</option>";
  dataTerapis.forEach(t => {
    select.innerHTML += `<option value="${t.nama}">${t.nama}</option>`;
  });
}

function getKomisiTerapis(nama) {
  const t = dataTerapis.find(t => t.nama === nama);
  return t ? t.komisi : 0.4;
}

function simpanTerapisBaru() {
  const nama = document.getElementById("namaTerapisBaru").value.trim();
  const persen = parseFloat(document.getElementById("komisiTerapisBaru").value);
  if (!nama || isNaN(persen)) return alert("Isi nama & komisi dengan benar.");
  dataTerapis.push({ nama, komisi: persen / 100 });
  localStorage.setItem("terapis", JSON.stringify(dataTerapis));
  renderDropdownTerapis();
  document.getElementById("namaTerapisBaru").value = "";
  document.getElementById("komisiTerapisBaru").value = "";
}

document.getElementById("bayarBtn").addEventListener("click", () => {
  const nama = document.getElementById("namaPelanggan").value.trim();
  const terapis = document.getElementById("namaTerapis").value.trim();
  const total = cart.reduce((a, b) => a + b.price, 0);
  const persen = getKomisiTerapis(terapis);
  const komisi = Math.floor(persen * total);

  if (!nama || !terapis) return alert("Isi nama pelanggan & pilih terapis dulu.");
  if (cart.length === 0) return alert("Keranjang masih kosong!");

  simpanTransaksi(nama, terapis, cart, total, komisi);
  tampilkanStruk(terapis, total);
  cart.length = 0;
  updateCart();
  document.getElementById("namaPelanggan").value = "";
  document.getElementById("namaTerapis").value = "";
});

function simpanTransaksi(nama, terapis, keranjang, total, komisi) {
  const transaksi = {
    waktu: new Date().toLocaleString("id-ID"),
    pelanggan: nama,
    terapis,
    layanan: [...keranjang],
    total,
    komisi
  };
  let riwayat = JSON.parse(localStorage.getItem("riwayat")) || [];
  riwayat.push(transaksi);
  localStorage.setItem("riwayat", JSON.stringify(riwayat));
}

function tampilkanStruk(terapis, total) {
  const container = document.getElementById("isiStruk");
  let html = `<h3>Struk Layanan</h3>`;
  html += `<p>🧍‍♂️ Terapis: ${terapis}</p>`;
  html += `<p>💰 Total: ${formatRupiah(total)}</p>`;
  container.innerHTML = html;
  document.getElementById("popupStruk").style.display = "block";
}

document.getElementById("lihatRiwayatBtn").addEventListener("click", tampilkanRiwayat);

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderDropdownTerapis();
});

function tampilkanRiwayat() {
  const box = document.getElementById("riwayatBox");
  const list = document.getElementById("riwayatList");
  const data = JSON.parse(localStorage.getItem("riwayat")) || [];
  list.innerHTML = "";
  if (data.length === 0) {
    list.innerHTML = "<p>Belum ada transaksi.</p>";
  } else {
    data.reverse().forEach(tx => {
      const items = tx.layanan.map(b => `${b.name} (${formatRupiah(b.price)})`).join(", ");
      list.innerHTML += `<p><strong>${tx.waktu}</strong><br>👤 ${tx.pelanggan}<br>🧍‍♂️ ${tx.terapis}<br>${items}<br><strong>Total:</strong> ${formatRupiah(tx.total)} - Komisi: ${formatRupiah(tx.komisi)}</p>`;
    });
  }
  box.style.display = "block";
}

function exportExcel() {
  const riwayat = JSON.parse(localStorage.getItem("riwayat")) || [];
  if (riwayat.length === 0) return alert("Belum ada transaksi!");
  let html = `<table border='1'><tr><th>Waktu</th><th>Pelanggan</th><th>Terapis</th><th>Layanan</th><th>Total</th><th>Komisi</th></tr>`;
  riwayat.forEach(tx => {
    const items = tx.layanan.map(b => `${b.name} (${formatRupiah(b.price)})`).join(", ");
    html += `<tr><td>${tx.waktu}</td><td>${tx.pelanggan}</td><td>${tx.terapis}</td><td>${items}</td><td>${formatRupiah(tx.total)}</td><td>${formatRupiah(tx.komisi)}</td></tr>`;
  });
  html += "</table>";
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "riwayat-kasir-refleksi.xls";
  link.click();
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
    tampilkanRiwayat();
  }
}

function logout() {
  localStorage.removeItem("kasir");
  window.location.href = "login.html";
}
