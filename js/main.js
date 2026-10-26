// ==========================================
// DATA MATERI & TUGAS (Konten LMS Nyata)
// ==========================================
const materiData = [
    {
        id: 'word',
        title: 'Microsoft Word',
        icon: 'fa-file-word',
        color: 'blue',
        desc: 'Software pengolah kata paling populer di dunia.',
        items: [
            {
                title: 'Pengertian',
                content: 'Microsoft Word adalah perangkat lunak pengolah kata (word processor) andalan Microsoft. Digunakan untuk membuat, mengedit, dan memformat dokumen seperti surat, laporan, makalah, dan buku.'
            },
            {
                title: 'Fungsi Utama',
                content: '1. Membuat dokumen cetak dan digital.<br>2. Memformat teks (tebal, miring, garis bawah, warna).<br>3. Menyisipkan gambar, tabel, dan grafik.<br>4. Fitur Mail Merge untuk surat massal.'
            },
            {
                title: 'Cara Penggunaan Dasar',
                content: '1. Buka Word, pilih Blank Document.<br>2. Ketik teks Anda.<br>3. Gunakan Tab "Home" untuk mengubah font, ukuran, dan paragraf.<br>4. Gunakan Tab "Insert" untuk menambah gambar atau tabel.<br>5. Simpan dengan Ctrl+S.'
            }
        ]
    },
    {
        id: 'excel',
        title: 'Microsoft Excel',
        icon: 'fa-file-excel',
        color: 'emerald',
        desc: 'Aplikasi spreadsheet untuk mengolah angka dan data.',
        items: [
            {
                title: 'Pengertian',
                content: 'Microsoft Excel adalah program aplikasi lembar kerja (spreadsheet) yang fitur utamanya adalah mengolah data secara otomatis meliputi perhitungan dasar, penggunaan rumus, dan pembuatan grafik.'
            },
            {
                title: 'Fungsi Utama',
                content: '1. Menghitung data (SUM, AVERAGE, MAX, MIN).<br>2. Membuat laporan keuangan.<br>3. Menganalisis data statistik.<br>4. Membuat grafik dari data tabel.'
            },
            {
                title: 'Cara Penggunaan Dasar',
                content: '1. Ketik data Anda di sel (kotak).<br>2. Untuk menggunakan rumus, awali dengan tanda sama dengan (=). Contoh: =SUM(A1:A5).<br>3. Gunakan Tab "Insert" untuk menyisipkan grafik (Chart).'
            }
        ]
    },
    {
        id: 'ppt',
        title: 'Microsoft PowerPoint',
        icon: 'fa-file-powerpoint',
        color: 'orange',
        desc: 'Software presentasi untuk membuat slide interaktif.',
        items: [
            {
                title: 'Pengertian',
                content: 'Microsoft PowerPoint adalah program presentasi yang dikembangkan oleh Microsoft. Digunakan untuk menyampaikan ide atau informasi melalui slide yang menarik.'
            },
            {
                title: 'Fungsi Utama',
                content: '1. Membuat materi presentasi.<br>2. Menambahkan animasi dan transisi pada objek/slide.<br>3. Menampilkan video dan audio dalam slide.'
            },
            {
                title: 'Cara Penggunaan Dasar',
                content: '1. Pilih tema desain saat membuka PPT.<br>2. Tambahkan slide baru (Ctrl+M).<br>3. Masukkan teks dan gambar.<br>4. Tekan F5 untuk memulai presentasi (Slide Show).'
            }
        ]
    },
    {
        id: 'google',
        title: 'Google Workspace',
        icon: 'fa-brands fa-google',
        color: 'yellow',
        desc: 'Ekstensi Docs, Sheets, dan Slides berbasis cloud.',
        items: [
            {
                title: 'Pengertian',
                content: 'Google Workspace (Docs, Sheets, Slides) adalah aplikasi perkantoran berbasis web (cloud) yang dikembangkan Google. Berbeda dengan Ms Office, aplikasi ini diakses melalui browser.'
            },
            {
                title: 'Fungsi Utama',
                content: '1. Kolaborasi real-time (banyak orang mengedit dokumen yang sama secara bersamaan).<br>2. Penyimpanan otomatis di Google Drive.<br>3. Akses dari mana saja (PC, HP, Tablet) tanpa instalasi.<br>4. Fitur Chat dan Komentar di dalam dokumen.'
            },
            {
                title: 'Cara Penggunaan Dasar',
                content: '1. Login ke akun Google.<br>2. Buka docs.google.com, sheets.google.com, atau slides.google.com.<br>3. Pilih Blank untuk memulai.<br>4. Bagikan file dengan mengklik tombol "Share" (Bagikan) di pojok kanan atas.'
            }
        ]
    }
];

const dummyTugas = [
    { id: 1, title: 'Praktik Dasar Microsoft Word', desc: 'Buatlah makalah 3 halaman dengan format font Times New Roman, spasi 1.5, dan daftar isi otomatis. Kumpulkan dalam bentuk PDF.', deadline: 'Besok, 23:59', status: 'Belum Selesai' },
    { id: 2, title: 'Analisis Data Excel', desc: 'Gunakan rumus VLOOKUP dan IF untuk mengisi kolom nilai pada file Excel yang disediakan guru.', deadline: '2 Hari lagi', status: 'Belum Selesai' }
];

// ==========================================
// NAVIGASI & RENDER UI
// ==========================================
function navigate(viewId) {
    if (typeof stopCamera === 'function') stopCamera();

    var views = document.querySelectorAll('.view');
    for (var i = 0; i < views.length; i++) views[i].classList.add('hidden');
    
    var targetView = document.getElementById('view-' + viewId);
    if (targetView) targetView.classList.remove('hidden');

    // Reset Nav Item Style
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('text-emerald-600', 'bg-emerald-50', 'text-amber-600', 'bg-amber-50');
        el.classList.add('text-slate-500');
    });

    // Highlight Nav Item yang aktif
    const activeNav = document.querySelector(`.nav-item[onclick="navigate('${viewId}')"]`);
    if (activeNav) {
        activeNav.classList.remove('text-slate-500');
        const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
        if (isTeacher) activeNav.classList.add('text-amber-600', 'bg-amber-50');
        else activeNav.classList.add('text-emerald-600', 'bg-emerald-50');
    }

    window.scrollTo(0, 0);
}

function saveProfile() {
    const name = document.getElementById('setup-name').value.trim();
    const cls = document.getElementById('setup-class').value;
    if (!name || !cls) return alert("Harap isi nama dan pilih kelas!");
    localStorage.setItem("student_name", name);
    localStorage.setItem("student_class", cls);
    location.reload();
}

// Render Materi Cards
function renderMateri() {
    const container = document.getElementById('materi-container');
    if(!container) return;
    container.innerHTML = '';

    materiData.forEach(m => {
        container.innerHTML += `
            <div onclick="openMateriDetail('${m.id}')" class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all">
                <div class="h-2 w-full bg-${m.color}-500"></div>
                <div class="p-5 flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-${m.color}-50 text-${m.color}-600 flex items-center justify-center text-2xl">
                        <i class="fa-solid ${m.icon}"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-slate-800">${m.title}</h3>
                        <p class="text-xs text-slate-500 mt-1">${m.desc}</p>
                    </div>
                </div>
            </div>
        `;
    });
}

// Buka Detail Materi
function openMateriDetail(id) {
    const materi = materiData.find(m => m.id === id);
    if(!materi) return;

    const content = document.getElementById('materi-detail-content');
    let html = `
        <div class="flex items-center gap-4 mb-6 border-b border-slate-200 pb-4">
            <div class="w-14 h-14 rounded-2xl bg-${materi.color}-50 text-${materi.color}-600 flex items-center justify-center text-3xl">
                <i class="fa-solid ${materi.icon}"></i>
            </div>
            <h1 class="text-2xl font-bold text-slate-800">${materi.title}</h1>
        </div>
        <div class="space-y-6">
    `;

    materi.items.forEach(item => {
        html += `
            <div>
                <h3 class="text-lg font-bold text-emerald-600 mb-2">${item.title}</h3>
                <div class="text-slate-600 leading-relaxed text-sm">${item.content}</div>
            </div>
        `;
    });
    html += `</div>`;
    
    content.innerHTML = html;
    navigate('materi-detail');
}

// Render Tugas Siswa
function renderTugasSiswa() {
    const container = document.getElementById('siswa-tugas-list');
    if(!container) return;
    container.innerHTML = '';

    if(dummyTugas.length === 0) {
        container.innerHTML = `<div class="text-center p-8 bg-white rounded-2xl border border-slate-200"><p class="text-slate-500">Belum ada tugas.</p></div>`;
        return;
    }

    dummyTugas.forEach(t => {
        container.innerHTML += `
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-lg text-slate-800">${t.title}</h3>
                    <span class="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded">${t.deadline}</span>
                </div>
                <p class="text-sm text-slate-600 mb-4">${t.desc}</p>
                <button class="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Kerjakan Tugas</button>
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var isTeacher = sessionStorage.getItem('is_teacher') === 'true';
    
    if (!isTeacher) {
        var name = localStorage.getItem("student_name");
        if (!name) {
            document.getElementById('profile-modal').classList.remove('hidden');
        } else {
            document.getElementById('dashboard-player-name').innerText = name;
            document.getElementById('mobile-player-name').innerText = name.split(' ')[0];
            
            var score = parseInt(localStorage.getItem("student_score")) || 0;
            document.getElementById('dash-score').innerText = score;
            
            var progress = JSON.parse(localStorage.getItem("office_progress")) || {};
            var levelsDone = Object.values(progress).filter(function(v) { return v === true; }).length;
            document.getElementById('dash-levels').innerText = levelsDone + "/9";
            
            renderMateri();
            renderTugasSiswa();
        }
        navigate('home');
    } else {
        document.getElementById('mobile-player-name').innerText = "Guru";
        navigate('guru-dashboard');
    }

    initShortcutGame();
});

// Fitur Fullscreen (Sama seperti sebelumnya)
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => alert(`Gagal: ${err.message}`));
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
    }
}

// Shortcut Game Logic (Sama seperti sebelumnya)
var shortcutData = [
    { question: "Copy (Salin)", answer: ["Ctrl", "C"] },
    { question: "Paste (Tempel)", answer: ["Ctrl", "V"] },
    { question: "Cut (Potong)", answer: ["Ctrl", "X"] },
    { question: "Undo (Batal)", answer: ["Ctrl", "Z"] },
    { question: "Redo (Ulangi)", answer: ["Ctrl", "Y"] },
    { question: "Save (Simpan)", answer: ["Ctrl", "S"] }
];
var currentShortcutIndex = 0; var shortcutScore = 0; var userKeysPressed = [];

function initShortcutGame() {
    currentShortcutIndex = 0; shortcutScore = 0;
    if(document.getElementById('shortcut-score')) document.getElementById('shortcut-score').innerText = shortcutScore;
    loadShortcutQuestion();
}
function loadShortcutQuestion() {
    if (currentShortcutIndex >= shortcutData.length) {
        document.getElementById('shortcut-question').innerText = "Selesai! 🎉";
        document.getElementById('shortcut-feedback').innerHTML = '<span class="text-emerald-600">Skor: ' + shortcutScore + '</span>';
        return;
    }
    var currentQ = shortcutData[currentShortcutIndex];
    document.getElementById('shortcut-question').innerText = currentQ.question;
    document.getElementById('shortcut-q-count').innerText = (currentShortcutIndex + 1) + "/" + shortcutData.length;
    document.getElementById('shortcut-feedback').innerHTML = "";
    userKeysPressed = [];
    document.querySelectorAll('.key').forEach(k => k.classList.remove('pressed'));
}
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', (e) => {
        var keyValue = e.target.getAttribute('data-key');
        if (!keyValue || currentShortcutIndex >= shortcutData.length) return;
        e.target.classList.add('pressed');
        setTimeout(() => e.target.classList.remove('pressed'), 150);
        userKeysPressed.push(keyValue);
        var correctAnswer = shortcutData[currentShortcutIndex].answer;
        var isMatch = true;
        for (var i = 0; i < userKeysPressed.length; i++) {
            if (userKeysPressed[i] !== correctAnswer[i]) { isMatch = false; break; }
        }
        if (!isMatch) {
            document.getElementById('shortcut-feedback').innerHTML = '<span class="text-rose-500 animate-shake inline-block"><i class="fa-solid fa-xmark"></i> Salah!</span>';
            setTimeout(() => { userKeysPressed = []; document.getElementById('shortcut-feedback').innerHTML = ""; }, 1000);
        } else if (userKeysPressed.length === correctAnswer.length) {
            shortcutScore += 10;
            document.getElementById('shortcut-score').innerText = shortcutScore;
            document.getElementById('shortcut-feedback').innerHTML = '<span class="text-emerald-500 animate-pop inline-block"><i class="fa-solid fa-check"></i> Benar! +10</span>';
            currentShortcutIndex++;
            setTimeout(loadShortcutQuestion, 1000);
        } else {
            document.getElementById('shortcut-feedback').innerHTML = '<span class="text-amber-500">Lanjutkan...</span>';
        }
    });
});
