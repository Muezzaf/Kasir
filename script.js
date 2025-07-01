// === Data ===
let terapisList = JSON.parse(localStorage.getItem('terapisList')) || [];
let produkList = JSON.parse(localStorage.getItem('produkList')) || [];
let keranjang = [];
let riwayat = JSON.parse(localStorage.getItem('riwayatTransaksi')) || [];

// === Produk ===
function simpanProdukBaru() {
  const nama = document.getElementById("namaProduk").value;
  const harga = parseFloat(document.getElementById("hargaProduk").value);
  const kategori = document.getElementById("kategoriProduk").value;
  if (!nama || isNaN(harga)) return alert("Isi nama dan harga layanan dengan benar");

  produkList.push({ nama, harga, kategori });
  localStorage.setItem("produkList", JSON.stringify(produkList));
  document.getElementById("namaProduk").value = "";
  document.getElementById("hargaProduk").value = "";
  renderProduk();
}

function renderProduk(kategori = 'all') {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  let list = kategori === 'all' ? produkList : produkList.filter(p => p.kategori === kategori);

  list.forEach((produk, i) => {
    const item = document.createElement("div");
    item.className = "produk-item";
    item.innerHTML = `
      <strong>${produk.nama}</strong><br>
      <small>${produk.kategori}</small><br>
      <span>Rp${produk.harga.toLocaleString("id-ID")}</span><br>
      <button onclick="tambahKeKeranjang(${i})">Pilih</button>
    `;
    grid.appendChild(item);
  });
}

function tambahKeKeranjang(index) {
  keranjang.push(produkList[index]);
  renderKeranjang();
}

function renderKeranjang() {
  const box = document.getElementById("cartItems");
  box.innerHTML = "";
  let total = 0;
  keranjang.forEach((item, i) => {
    total += item.harga;
    const div = document.createElement("div");
    div.innerHTML = `${item.nama} - Rp${item.harga.toLocaleString("id-ID")} <button onclick="hapusItemKeranjang(${i})">❌</button>`;
    box.appendChild(div);
  });
  document.getElementById("totalHarga").textContent = `Rp${total.toLocaleString("id-ID")}`;
}

function hapusItemKeranjang(i) {
  keranjang.splice(i, 1);
  renderKeranjang();
}

// === Terapis ===
function simpanTerapisBaru() {
  const nama = document.getElementById("namaTerapisBaru").value;
  const komisi = parseFloat(document.getElementById("komisiTerapisBaru").value);
  if (!nama || isNaN(komisi)) return alert("Isi nama dan komisi dengan benar");

  terapisList.push({ nama, komisi });
  localStorage.setItem("terapisList", JSON.stringify(terapisList));
  document.getElementById("namaTerapisBaru").value = "";
  document.getElementById("komisiTerapisBaru").value = "";
  renderTerapis();
  renderDropdownTerapis();
}

function renderTerapis() {
  const box = document.getElementById("daftarTerapis");
  box.innerHTML = "";
  terapisList.forEach((terapis, index) => {
    const item = document.createElement("div");
    item.className = "terapis-item";
    item.innerHTML = `
      <span>${terapis.nama} - ${terapis.komisi}%</span>
      <div>
        <button onclick="editTerapis(${index})">Edit</button>
        <button onclick="hapusTerapis(${index})" style="background:#e74c3c">Hapus</button>
      </div>
    `;
    box.appendChild(item);
  });
}

function renderDropdownTerapis() {
  const select = document.getElementById("namaTerapis");
  select.innerHTML = "<option value=''>Pilih Terapis</option>";
  terapisList.forEach((t, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = t.nama;
    select.appendChild(opt);
  });
}

function editTerapis(index) {
  const terapis = terapisList[index];
  const nama = prompt("Edit nama terapis:", terapis.nama);
  const komisi = prompt("Edit komisi (%):", terapis.komisi);
  if (nama && !isNaN(parseFloat(komisi))) {
    terapisList[index] = { nama, komisi: parseFloat(komisi) };
    localStorage.setItem("terapisList", JSON.stringify(terapisList));
    renderTerapis();
    renderDropdownTerapis();
  }
}

function hapusTerapis(index) {
  if (confirm("Hapus terapis ini?")) {
    terapisList.splice(index, 1);
    localStorage.setItem("terapisList", JSON.stringify(terapisList));
    renderTerapis();
    renderDropdownTerapis();
  }
}

function toggleFormEditTerapis() {
  const form = document.getElementById("formEditTerapis");
  form.style.display = form.style.display === "none" ? "block" : "none";
}

// === Bayar ===
document.getElementById("bayarBtn").addEventListener("click", () => {
  const pelanggan = document.getElementById("namaPelanggan").value;
  const indexTerapis = document.getElementById("namaTerapis").value;
  if (!pelanggan || keranjang.length === 0 || indexTerapis === '') return alert("Lengkapi data terlebih dahulu");

  const terapis = terapisList[indexTerapis];
  const total = keranjang.reduce((acc, item) => acc + item.harga, 0);

  const transaksi = {
    tanggal: new Date().toLocaleString("id-ID"),
    pelanggan,
    terapis: terapis.nama,
    komisi: (terapis.komisi / 100) * total,
    total,
    layanan: [...keranjang]
  };

  riwayat.push(transaksi);
  localStorage.setItem("riwayatTransaksi", JSON.stringify(riwayat));
  keranjang = [];
  renderKeranjang();
  document.getElementById("namaPelanggan").value = "";
  cetakStruk(transaksi);
});

function cetakStruk(data) {
  const box = document.getElementById("isiStruk");
  box.innerHTML = `
    <h3>STRUK PEMBAYARAN</h3>
    <p>${data.tanggal}</p>
    <p>Nama Terapis: ${data.terapis}</p>
    <ul>
      ${data.layanan.map(item => `<li>${item.nama} - Rp${item.harga.toLocaleString("id-ID")}</li>`).join('')}
    </ul>
    <strong>Total: Rp${data.total.toLocaleString("id-ID")}</strong>
  `;
  document.getElementById("popupStruk").style.display = "block";
}

function tutupStruk() {
  document.getElementById("popupStruk").style.display = "none";
}

// === Filter ===
function filterKategori(kat) {
  document.querySelectorAll(".kategori li").forEach(li => li.classList.remove("active"));
  event.target.classList.add("active");
  renderProduk(kat);
}

// === Riwayat ===
document.getElementById("lihatRiwayatBtn").addEventListener("click", () => {
  const box = document.getElementById("riwayatList");
  document.getElementById("riwayatBox").style.display = "block";
  box.innerHTML = riwayat.map(r => `
    <div>
      <strong>${r.tanggal}</strong> - ${r.pelanggan}<br>
      Terapis: ${r.terapis} - Total: Rp${r.total.toLocaleString("id-ID")}
    </div>
  `).join('');
});

function tutupRiwayat() {
  document.getElementById("riwayatBox").style.display = "none";
}

function hapusSemuaRiwayat() {
  if (confirm("Hapus semua riwayat?")) {
    riwayat = [];
    localStorage.setItem("riwayatTransaksi", JSON.stringify(riwayat));
    document.getElementById("riwayatList").innerHTML = "";
  }
}

function exportExcel() {
  let csv = "Tanggal,Pelanggan,Terapis,Total\n";
  riwayat.forEach(r => {
    csv += `${r.tanggal},${r.pelanggan},${r.terapis},${r.total}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'riwayat-transaksi.csv';
  link.click();
}

// === Init ===
document.addEventListener("DOMContentLoaded", () => {
  renderTerapis();
  renderDropdownTerapis();
  renderProduk();
});
