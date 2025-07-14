// firebase-config.js

const firebaseConfig = {
  apiKey: "AIzaSyCn6miLD2qbtxZuu9zRZgz3UetszPs8SeQ",
  authDomain: "kedai-kita-bu-pipin.firebaseapp.com",
  projectId: "kedai-kita-bu-pipin",
  storageBucket: "kedai-kita-bu-pipin.firebasestorage.app",
  messagingSenderId: "137463947642",
  appId: "1:137463947642:web:f8aeadaa1ba70d854b36c3",
  measurementId: "G-760Y3TLJJ7"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();