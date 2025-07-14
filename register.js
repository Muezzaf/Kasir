function togglePass() {
  const passwordInput = document.getElementById("password");
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}

function register() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Email dan password tidak boleh kosong!");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Pendaftaran berhasil! Silakan login.");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error(error);
      alert("Gagal daftar: " + error.code + " - " + error.message);
    });
}