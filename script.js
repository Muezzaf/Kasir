// Data awal
let produk = [];
let keranjang = [];
let terapis = JSON.parse(localStorage.getItem("terapis")) || [];
let riwayat = JSON.parse(localStorage.getItem("riwayat")) || [];
let selectedTerapis = "";

// DOM
const produkList = document.getElementById("produkList");
const kategoriList = document.getElementById("kategoriList");
const cartItems = document.getElementById("cartItems");
const terapisSelect = document.getElementById("terapisSelect");
const daftarTerapis = document.getElementById("daftarTerapis");
const riwayatList = document.getElementById("riwayatList");
const strukList = document.getElementById("strukList");
const totalBayarStruk = document.getElementById("totalBayarStruk");

// Inisialisasi
renderTerapis();
renderKeranjang();
renderRiwayat();

// Tambah Produk
const formTambahProduk = document.getElementById("formTambahProduk");
formTambahProduk.addEventListener("submit", function(e) {
  e.preventDefault();
  const nama = document.getElementById("produkNama").value;
  const harga = parseInt(document.getElementById("produkHarga").value);
  const kategori = document.getElementById("produkKategori").value;
  produk.push({ nama, harga, kategori });
  document.getElementById("produkNama").value = "";
  document.getElementById("produkHarga").value = "";
  renderProduk();
  renderKategori();
});

function renderProduk(kategori = "") {
  produkList.innerHTML = "";
  produk.filter(p => !kategori || p.kategori === kategori).forEach((p, index) => {
    const item = document.createElement("div");
    item.className = "produk-item";
    item.innerHTML = `
      <strong>${p.nama}</strong><br>
      Rp${p.harga.toLocaleString()}<br>
      <button onclick="tambahKeKeranjang(${index})">+</button>
    `;
    produkList.appendChild(item);
  });
}

function renderKategori() {
  const kategoriUnik = [...new Set(produk.map(p => p.kategori))];
  kategoriList.innerHTML = "";
  kategoriUnik.forEach(kat => {
    const li = document.createElement("li");
    li.textContent = kat;
    li.onclick = () => renderProduk(kat);
    kategoriList.appendChild(li);
  });
}

function tambahKeKeranjang(index) {
  keranjang.push(produk[index]);
  renderKeranjang();
}

function renderKeranjang() {
  cartItems.innerHTML = "";
  keranjang.forEach((item, i) => {
    const div = document.createElement("div");
    div.innerHTML = `${item.nama} - Rp${item.harga.toLocaleString()} <button onclick="hapusItem(${i})">x</button>`;
    cartItems.appendChild(div);
  });
  renderTerapisDropdown();
}

function hapusItem(index) {
  keranjang.splice(index, 1);
  renderKeranjang();
}

function renderTerapisDropdown() {
  terapisSelect.innerHTML = "";
  terapis.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.nama;
    opt.textContent = t.nama;
    terapisSelect.appendChild(opt);
  });
}

// Tambah/Edit Terapis
const formEditTerapis = document.getElementById("formEditTerapis");
formEditTerapis.addEventListener("submit", function(e) {
  e.preventDefault();
  const nama = document.getElementById("terapisNama").value;
  const komisi = parseInt(document.getElementById("terapisKomisi").value);
  const existing = terapis.find(t => t.nama === nama);
  if (existing) existing.komisi = komisi;
  else terapis.push({ nama, komisi });
  localStorage.setItem("terapis", JSON.stringify(terapis));
  document.getElementById("terapisNama").value = "";
  document.getElementById("terapisKomisi").value = "";
  renderTerapis();
  renderTerapisDropdown();
});

function renderTerapis() {
  daftarTerapis.innerHTML = "";
  terapis.forEach((t, i) => {
    const div = document.createElement("div");
    div.className = "terapis-item";
    div.innerHTML = `
      <span>${t.nama} (${t.komisi}%)</span>
      <div>
        <button onclick="editTerapis(${i})">Edit</button>
        <button onclick="hapusTerapis(${i})">Hapus</button>
      </div>
    `;
    daftarTerapis.appendChild(div);
  });
}

function editTerapis(index) {
  const t = terapis[index];
  document.getElementById("terapisNama").value = t.nama;
  document.getElementById("terapisKomisi").value = t.komisi;
}

function hapusTerapis(index) {
  terapis.splice(index, 1);
  localStorage.setItem("terapis", JSON.stringify(terapis));
  renderTerapis();
  renderTerapisDropdown();
}

function selesaiTransaksi() {
  if (!keranjang.length || !terapisSelect.value) return alert("Keranjang atau Terapis kosong!");
  const total = keranjang.reduce((sum, i) => sum + i.harga, 0);
  const namaTerapis = terapisSelect.value;
  const t = terapis.find(t => t.nama === namaTerapis);
  const komisi = t ? Math.round(total * t.komisi / 100) : 0;

  // Tampilkan struk
  strukList.innerHTML = `<li><strong>${namaTerapis}</strong> - Rp${total.toLocaleString()}</li>`;
  totalBayarStruk.textContent = `Total Bayar: Rp${total.toLocaleString()}`;
  document.getElementById("popupStruk").style.display = "block";

  // Simpan riwayat
  riwayat.push({ namaTerapis, total });
  localStorage.setItem("riwayat", JSON.stringify(riwayat));
  keranjang = [];
  renderKeranjang();
  renderRiwayat();
}

function tutupStruk() {
  document.getElementById("popupStruk").style.display = "none";
}

function renderRiwayat() {
  riwayatList.innerHTML = "";
  riwayat.forEach(r => {
    const div = document.createElement("div");
    div.textContent = `${r.namaTerapis} - Rp${r.total.toLocaleString()}`;
    riwayatList.appendChild(div);
  });
}

function hapusSemuaTransaksi() {
  if (confirm("Yakin hapus semua riwayat?")) {
    localStorage.removeItem("riwayat");
    riwayat = [];
    renderRiwayat();
  }
}

function exportExcel() {
  let csv = "Terapis,Total\n";
  riwayat.forEach(r => {
    csv += `${r.namaTerapis},${r.total}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "laporan_kasir.csv";
  a.click();
  URL.revokeObjectURL(url);
}
