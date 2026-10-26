// ==========================================
// MAIN APP LOGIC & SHORTCUT TRAINER
// ==========================================

// 1. NAVIGASI SPA (Single Page Application)
function navigate(viewId) {
    if (typeof stopCamera === 'function') stopCamera();

    // Sembunyikan semua view
    var views = document.querySelectorAll('.view');
    // Sembunyikan semua view
    document.querySelectorAll('.view').forEach(el => el.classList.add('hidden'));
    
    // Tampilkan view yang dipilih
    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) targetView.classList.remove('hidden');

    // Reset Nav Style (Desktop)
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    // Note: Tombol aktif desktop tidak di-set secara dinamis di sini agar kodenya ringkas, 
    // tapi Anda bisa menambahkannya jika perlu.

    // Reset Bottom Nav Style (Mobile)
    document.querySelectorAll('.bottom-nav-item').forEach(el => {
        el.classList.remove('text-emerald-600');
        el.classList.add('text-slate-400');
    });
    const activeMobileNav = document.querySelector(`.bottom-nav-item[onclick="navigate('${viewId}')"]`);
    if (activeMobileNav) {
        activeMobileNav.classList.remove('text-slate-400');
        activeMobileNav.classList.add('text-emerald-600');
    }

    // Scroll ke atas saat pindah halaman
    window.scrollTo(0, 0);
}

// 2. INISIALISASI PROFIL SISWA
document.addEventListener('DOMContentLoaded', () => {
    const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
    
    if (!isTeacher) {
        // Cek Profil Siswa
        let name = localStorage.getItem("student_name");
        if (!name) {
            name = prompt("Masukkan Nama Lengkap Siswa:") || "Siswa";
            let cls = prompt("Masukkan Kelas (Contoh: X TEI 1):") || "Umum";
            localStorage.setItem("student_name", name);
            localStorage.setItem("student_class", cls);
        }
        
        // Update UI Profil
        document.getElementById('dashboard-player-name').innerText = name;
        document.getElementById('mobile-player-name').innerText = name.split(' ')[0]; // Nama depan saja
        
        // Ambil skor
        let score = parseInt(localStorage.getItem("student_score")) || 0;
        document.getElementById('dash-score').innerText = score;
        
        // Hitung level selesai
        let progress = JSON.parse(localStorage.getItem("office_progress")) || {};
        let levelsDone = Object.values(progress).filter(v => v === true).length;
        document.getElementById('dash-levels').innerText = `${levelsDone}/9`;
        document.getElementById('materi-progress-text').innerText = `${Math.round((levelsDone/9)*100)}% Selesai`;
    } else {
        // Tampilan Guru
        document.getElementById('dashboard-player-name').innerText = "Guru";
        document.getElementById('mobile-player-name').innerText = "Guru";
        navigate('guru'); // Langsung ke dashboard guru
    }

    // Mulai Game Shortcut
    initShortcutGame();
});


// 3. GAME SHORTCUT TRAINER (Virtual Keyboard)
const shortcutData = [
    { question: "Copy (Salin)", answer: ["Ctrl", "C"] },
    { question: "Paste (Tempel)", answer: ["Ctrl", "V"] },
    { question: "Cut (Potong)", answer: ["Ctrl", "X"] },
    { question: "Undo (Batal)", answer: ["Ctrl", "Z"] },
    { question: "Redo (Ulangi)", answer: ["Ctrl", "Y"] },
    { question: "Save (Simpan)", answer: ["Ctrl", "S"] },
    { question: "Select All (Pilih Semua)", answer: ["Ctrl", "A"] },
    { question: "Bold (Tebal)", answer: ["Ctrl", "B"] },
    { question: "Print (Cetak)", answer: ["Ctrl", "P"] },
    { question: "Find (Cari)", answer: ["Ctrl", "F"] }
];

let currentShortcutIndex = 0;
let shortcutScore = 0;
let userKeysPressed = [];
let shortcutTimer;

function initShortcutGame() {
    currentShortcutIndex = 0;
    shortcutScore = 0;
    document.getElementById('shortcut-score').innerText = shortcutScore;
    loadShortcutQuestion();
}

function loadShortcutQuestion() {
    if (currentShortcutIndex >= shortcutData.length) {
        document.getElementById('shortcut-question').innerText = "Selesai! 🎉";
        document.getElementById('shortcut-feedback').innerHTML = `<span class="text-emerald-600">Skor Akhir: ${shortcutScore}</span>`;
        return;
    }

    const currentQ = shortcutData[currentShortcutIndex];
    document.getElementById('shortcut-question').innerText = currentQ.question;
    document.getElementById('shortcut-q-count').innerText = `${currentShortcutIndex + 1}/${shortcutData.length}`;
    document.getElementById('shortcut-feedback').innerHTML = "";
    userKeysPressed = [];

    // Reset warna keyboard
    document.querySelectorAll('.key').forEach(k => k.classList.remove('pressed', 'bg-emerald-500', 'bg-rose-500'));
}

// Event Listener untuk Keyboard Virtual
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', (e) => {
        const keyValue = e.target.getAttribute('data-key');
        if (!keyValue || currentShortcutIndex >= shortcutData.length) return;

        // Animasi tekan
        e.target.classList.add('pressed');
        setTimeout(() => e.target.classList.remove('pressed'), 150);

        // Catat input user
        userKeysPressed.push(keyValue);

        // Cek Jawaban
        const correctAnswer = shortcutData[currentShortcutIndex].answer;
        
        // Cek apakah input sejauh ini cocok dengan kunci jawaban
        let isMatch = true;
        for (let i = 0; i < userKeysPressed.length; i++) {
            if (userKeysPressed[i] !== correctAnswer[i]) {
                isMatch = false;
                break;
            }
        }

        if (!isMatch) {
            // Salah
            document.getElementById('shortcut-feedback').innerHTML = `<span class="text-rose-500 animate-shake inline-block"><i class="fa-solid fa-xmark"></i> Salah, coba lagi!</span>`;
            setTimeout(() => {
                userKeysPressed = [];
                document.getElementById('shortcut-feedback').innerHTML = "";
            }, 1000);
        } else if (userKeysPressed.length === correctAnswer.length) {
            // Benar Penuh
            shortcutScore += 10;
            document.getElementById('shortcut-score').innerText = shortcutScore;
            document.getElementById('shortcut-feedback').innerHTML = `<span class="text-emerald-500 animate-pop inline-block"><i class="fa-solid fa-check"></i> Benar! +10</span>`;
            
            currentShortcutIndex++;
            setTimeout(loadShortcutQuestion, 1000);
        } else {
            // Baru separuh benar (misal baru tekan Ctrl)
            document.getElementById('shortcut-feedback').innerHTML = `<span class="text-amber-500">Lanjutkan...</span>`;
        }
    });
});

function resetShortcutGame() {
    initShortcutGame();
}
