// ==========================================
// MAIN APP LOGIC & SLIDE MATERI
// ==========================================

// Data Materi (Dibagi per Slide/Halaman)
const materiData = [
    {
        id: 'word',
        title: 'Microsoft Word',
        icon: 'fa-file-word',
        color: 'blue',
        desc: 'Software pengolah kata paling populer.',
        slides: [
            {
                title: 'Halaman 1: Pengenalan Microsoft Word',
                content: `
                    <div class="text-center mb-6">
                        <div class="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl"><i class="fa-solid fa-file-word"></i></div>
                    </div>
                    <h3 class="text-xl font-bold text-slate-800 mb-3">Apa itu Microsoft Word?</h3>
                    <p class="text-slate-600 leading-relaxed mb-4">Microsoft Word adalah perangkat lunak pengolah kata (word processor) andalan Microsoft. Digunakan untuk membuat, mengedit, dan memformat dokumen seperti surat, laporan, makalah, dan buku.</p>
                    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <p class="text-sm text-blue-800"><b>Tahukah kamu?</b> Ekstensi file Word adalah .doc atau .docx.</p>
                    </div>
                `
            },
            {
                title: 'Halaman 2: Fungsi Utama Word',
                content: `
                    <h3 class="text-xl font-bold text-slate-800 mb-4">Fungsi Utama</h3>
                    <div class="space-y-3">
                        <div class="flex items-start gap-3"><i class="fa-solid fa-check-circle text-blue-500 mt-1"></i> <div><b>Membuat Dokumen:</b> Menulis teks, artikel, surat, dan laporan.</div></div>
                        <div class="flex items-start gap-3"><i class="fa-solid fa-check-circle text-blue-500 mt-1"></i> <div><b>Formatting:</b> Menebalkan (Bold), memiringkan (Italic), memberi warna, dan mengatur spasi.</div></div>
                        <div class="flex items-start gap-3"><i class="fa-solid fa-check-circle text-blue-500 mt-1"></i> <div><b>Menyisipkan Objek:</b> Menambahkan gambar, tabel, grafik, dan nomor halaman.</div></div>
                        <div class="flex items-start gap-3"><i class="fa-solid fa-check-circle text-blue-500 mt-1"></i> <div><b>Mail Merge:</b> Membuat surat massal dengan nama penerima berbeda secara otomatis.</div></div>
                    </div>
                `
            },
            {
                title: 'Halaman 3: Tampilan Antarmuka (UI)',
                content: `
                    <h3 class="text-xl font-bold text-slate-800 mb-3">Mengenal Bagian Word</h3>
                    <p class="text-slate-600 mb-4">Saat membuka Word, Anda akan melihat beberapa bagian penting:</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200"><b>1. Ribbon (Menu Atas)</b><br><span class="text-sm text-slate-500">Berisi Tab Home, Insert, Design, dll.</span></div>
                        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200"><b>2. Document Area</b><br><span class="text-sm text-slate-500">Lembar kerja putih tempat Anda mengetik.</span></div>
                        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200"><b>3. Scrollbar</b><br><span class="text-sm text-slate-500">Untuk naik turun halaman.</span></div>
                        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200"><b>4. Status Bar</b><br><span class="text-sm text-slate-500">Menampilkan jumlah halaman & kata.</span></div>
                    </div>
                `
            },
            {
                title: 'Halaman 4: Simulasi Interaktif',
                content: `
                    <h3 class="text-xl font-bold text-slate-800 mb-2">Simulasi: Ikon Word</h3>
                    <p class="text-slate-600 mb-4">Klik ikon yang sesuai dengan fungsinya!</p>
                    <div class="bg-slate-100 p-4 rounded-xl border border-slate-300">
                        <p class="text-sm font-bold mb-2">Pertanyaan: Ikon mana yang digunakan untuk menebalkan teks?</p>
                        <div class="flex gap-2">
                            <button onclick="alert('Salah! Ini untuk memiringkan teks.')" class="bg-white p-3 rounded border hover:bg-slate-50 w-12 font-serif italic font-bold">I</button>
                            <button onclick="alert('Benar! Ikon B (Bold) untuk menebalkan teks.')" class="bg-white p-3 rounded border hover:bg-slate-50 w-12 font-serif font-bold">B</button>
                            <button onclick="alert('Salah! Ini untuk menggarisbawahi teks.')" class="bg-white p-3 rounded border hover:bg-slate-50 w-12 font-serif underline">U</button>
                        </div>
                    </div>
                `
            },
            {
                title: 'Halaman 5: Cara Menyimpan',
                content: `
                    <h3 class="text-xl font-bold text-slate-800 mb-4">Menyimpan Dokumen</h3>
                    <p class="text-slate-600 mb-4">Jangan sampai pekerjaan Anda hilang! Ada 2 cara menyimpan:</p>
                    <div class="space-y-4">
                        <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                            <b>1. Save (Ctrl + S)</b><br>
                            <span class="text-sm text-slate-600">Menyimpan file yang sudah pernah disimpan sebelumnya.</span>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-xl border border-blue-200">
                            <b>2. Save As (F12)</b><br>
                            <span class="text-sm text-slate-600">Menyimpan file dengan nama atau format baru (misal: ubah ke PDF).</span>
                        </div>
                    </div>
                `
            }
        ]
    },
    {
        id: 'excel',
        title: 'Microsoft Excel',
        icon: 'fa-file-excel',
        color: 'emerald',
        desc: 'Aplikasi spreadsheet pengolah angka.',
        slides: [
            {
                title: 'Halaman 1: Pengenalan Excel',
                content: `<h3 class="text-xl font-bold text-slate-800 mb-3">Apa itu Excel?</h3><p class="text-slate-600">Excel adalah program lembar kerja (spreadsheet) untuk mengolah data secara otomatis meliputi perhitungan dasar, penggunaan rumus, dan pembuatan grafik.</p>`
            },
            {
                title: 'Halaman 2: Rumus Dasar (Formula)',
                content: `<h3 class="text-xl font-bold text-slate-800 mb-3">Aturan Formula</h3><p class="text-slate-600 mb-4">Setiap rumus di Excel <b>WAJIB</b> diawali dengan tanda sama dengan (=).</p><div class="bg-emerald-50 p-4 rounded-xl border border-emerald-200"><b>Contoh:</b> <code class="text-emerald-700">=SUM(A1:A5)</code> untuk menjumlahkan data dari sel A1 sampai A5.</div>`
            },
            {
                title: 'Halaman 3: Simulasi Interaktif',
                content: `<h3 class="text-xl font-bold text-slate-800 mb-3">Simulasi Excel</h3><p class="text-slate-600 mb-4">Jika Anda ingin menjumlahkan data dari A1 sampai A10, rumus apa yang benar?</p><div class="space-y-2"><button onclick="alert('Salah! Harus diawali tanda =')" class="w-full text-left p-3 bg-white border rounded-xl hover:bg-slate-50">SUM(A1:A10)</button><button onclick="alert('Benar! =SUM(A1:A10) adalah format yang tepat.')" class="w-full text-left p-3 bg-white border rounded-xl hover:bg-slate-50">=SUM(A1:A10)</button></div>`
            }
        ]
    },
    {
        id: 'google',
        title: 'Google Workspace',
        icon: 'fa-brands fa-google',
        color: 'yellow',
        desc: 'Docs, Sheets, Slides (Berbasis Cloud).',
        slides: [
            {
                title: 'Halaman 1: Kolaborasi Cloud',
                content: `<h3 class="text-xl font-bold text-slate-800 mb-3">Google Docs/Sheets/Slides</h3><p class="text-slate-600">Berbeda dengan Ms Office, Google Workspace berjalan di browser. Keunggulannya adalah <b>Kolaborasi Real-time</b>. Anda dan teman Anda bisa mengetik di dokumen yang sama secara bersamaan!</p>`
            }
        ]
    }
];

let currentMateriId = null;
let currentSlideIndex = 0;

function navigate(viewId) {
    if (typeof stopCamera === 'function') stopCamera();

    document.querySelectorAll('.view').forEach(el => el.classList.add('hidden'));
    const targetView = document.getElementById('view-' + viewId);
    if (targetView) targetView.classList.remove('hidden');

    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('text-emerald-600', 'bg-emerald-50', 'text-amber-600', 'bg-amber-50');
        el.classList.add('text-slate-500');
    });

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

function renderMateri() {
    const container = document.getElementById('materi-container');
    if(!container) return;
    container.innerHTML = '';
    materiData.forEach(m => {
        container.innerHTML += `
            <div onclick="openMateriDetail('${m.id}')" class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all">
                <div class="h-2 w-full bg-${m.color}-500"></div>
                <div class="p-5 flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-${m.color}-50 text-${m.color}-600 flex items-center justify-center text-2xl"><i class="fa-solid ${m.icon}"></i></div>
                    <div><h3 class="font-bold text-lg text-slate-800">${m.title}</h3><p class="text-xs text-slate-500 mt-1">${m.desc}</p></div>
                </div>
            </div>`;
    });
}

function openMateriDetail(id) {
    const materi = materiData.find(m => m.id === id);
    if(!materi) return;
    currentMateriId = id;
    currentSlideIndex = 0;
    loadSlide();
    navigate('materi-detail');
}

function loadSlide() {
    const materi = materiData.find(m => m.id === currentMateriId);
    if(!materi) return;
    const slide = materi.slides[currentSlideIndex];
    
    document.getElementById('slide-current').innerText = currentSlideIndex + 1;
    document.getElementById('slide-total').innerText = materi.slides.length;
    
    // Render konten slide
    document.getElementById('slide-content').innerHTML = `
        <h2 class="text-sm font-bold text-${materi.color}-500 uppercase tracking-widest mb-1">${materi.title}</h2>
        <h1 class="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">${slide.title}</h1>
        <div class="animate-fade-in">${slide.content}</div>
    `;

    // Atur tombol navigasi
    document.getElementById('btn-prev-slide').disabled = (currentSlideIndex === 0);
    
    const btnNext = document.getElementById('btn-next-slide');
    if (currentSlideIndex === materi.slides.length - 1) {
        btnNext.innerHTML = 'Selesai <i class="fa-solid fa-check ml-1"></i>';
        btnNext.classList.replace('bg-emerald-600', 'bg-amber-500');
        btnNext.classList.replace('hover:bg-emerald-700', 'hover:bg-amber-600');
    } else {
        btnNext.innerHTML = 'Selanjutnya <i class="fa-solid fa-chevron-right ml-1"></i>';
        btnNext.classList.replace('bg-amber-500', 'bg-emerald-600');
        btnNext.classList.replace('hover:bg-amber-600', 'hover:bg-emerald-700');
    }
}

function changeSlide(direction) {
    const materi = materiData.find(m => m.id === currentMateriId);
    if(!materi) return;
    
    const newIndex = currentSlideIndex + direction;
    
    if (newIndex >= materi.slides.length) {
        alert("🎉 Hebat! Anda telah menyelesaikan modul ini.");
        navigate('materi');
        return;
    }
    
    if (newIndex >= 0 && newIndex < materi.slides.length) {
        currentSlideIndex = newIndex;
        loadSlide();
    }
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
        }
        navigate('home');
    } else {
        document.getElementById('mobile-player-name').innerText = "Guru";
        navigate('guru-dashboard');
    }

    initShortcutGame();
});

// Fitur Fullscreen & Shortcut Game (Sama seperti sebelumnya)
function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(err => alert(`Gagal: ${err.message}`));
    else { if (document.exitFullscreen) document.exitFullscreen(); }
}

var shortcutData = [
    { question: "Copy (Salin)", answer: ["Ctrl", "C"] }, { question: "Paste (Tempel)", answer: ["Ctrl", "V"] },
    { question: "Cut (Potong)", answer: ["Ctrl", "X"] }, { question: "Undo (Batal)", answer: ["Ctrl", "Z"] },
    { question: "Redo (Ulangi)", answer: ["Ctrl", "Y"] }, { question: "Save (Simpan)", answer: ["Ctrl", "S"] }
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
