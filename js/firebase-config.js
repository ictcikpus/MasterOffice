// Konfigurasi Firebase Proyek MasterMicrosoft Anda
const firebaseConfig = {
  apiKey: "AIzaSyAUBlFUM_PwZBeiWL6k8xSgieUppjBWAbs",
  authDomain: "master-6ed14.firebaseapp.com",
  databaseURL: "https://master-6ed14-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "master-6ed14",
  storageBucket: "master-6ed14.firebasestorage.app",
  messagingSenderId: "198736537876",
  appId: "1:198736537876:web:dd0dc17a7736abaf21fa01",
  measurementId: "G-D652JVJNCY"
};

// Inisialisasi Firebase (Gunakan if agar tidak dobel inisialisasi)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Inisialisasi service database
const db = firebase.database();
