function togglePass() {
  const passwordInput = document.getElementById("password");
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}

function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert("Email dan password harus diisi!");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Login berhasil!");
      localStorage.setItem("loggedIn", "true");
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error(error);
      alert("Login gagal: " + error.code + " - " + error.message);
    });
}