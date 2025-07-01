// === Data ===
let terapisList = JSON.parse(localStorage.getItem('terapisList')) || [];

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

// === Inisialisasi ===
document.addEventListener("DOMContentLoaded", () => {
  renderTerapis();
  renderDropdownTerapis();
});
