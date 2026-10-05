/**
 * GAME ENGINE - EDP (OFFICE MASTER)
 * Sistem Pembelajaran & Evaluasi Otomatis Microsoft Office (Word, Excel, PPT)
 */

// ==========================================
// 1. CONSTANTS & GLOBAL STATE
// ==========================================

// Urutan Sekuensial Pembukaan Level (Total 9 Level)
const LEVEL_SEQUENCE = [
    "word_1", "word_2", "word_3",
    "excel_1", "excel_2", "excel_3",
    "ppt_1", "ppt_2", "ppt_3"
];

// Data Modul Utama
const MODULE_CONFIG = [
    { id: "word", name: "Microsoft Word", icon: "fa-file-word text-blue-500" },
    { id: "excel", name: "Microsoft Excel", icon: "fa-file-excel text-emerald-500" },
    { id: "ppt", name: "Microsoft PPT", icon: "fa-file-powerpoint text-amber-500" }
];

// Bank Soal Interaktif per Level & Modul
const QUESTION_BANK = {
    // --- MS WORD ---
    "word_1": {
        type: "quiz",
        question: "Shortcut keyboard manakah yang digunakan untuk meratakan teks menjadi Rata Kiri-Kanan (Justify)?",
        options: [
            { text: "Ctrl + J", correct: true },
            { text: "Ctrl + E", correct: false },
            { text: "Ctrl + R", correct: false },
            { text: "Ctrl + L", correct: false }
        ]
    },
    "word_2": {
        type: "matching",
        question: "Pilih pasangan fitur dan fungsi Microsoft Word yang PALING TEPAT:",
        options: [
            { text: "Page Break -> Membagi halaman tanpa membuat section baru", correct: true },
            { text: "Mail Merge -> Mengurutkan data angka secara otomatis", correct: false },
            { text: "Header -> Menyisipkan watermark gambar transparan", correct: false }
        ]
    },
    "word_3": {
        type: "simulator",
        question: "Ketikkan kombinasi tombol shortcut keyboard untuk menambahkan Catatan Kaki (Footnote) secara cepat:",
        targetAnswers: ["alt+ctrl+f", "ctrl+alt+f"],
        hint: "Format jawaban: Alt+Ctrl+F"
    },

    // --- MS EXCEL ---
    "excel_1": {
        type: "quiz",
        question: "Fungsi statistik manakah yang digunakan untuk menghitung RATA-RATA dari rentang sel A1 sampai A10?",
        options: [
            { text: "=AVERAGE(A1:A10)", correct: true },
            { text: "=SUM(A1:A10)", correct: false },
            { text: "=COUNT(A1:A10)", correct: false },
            { text: "=MAX(A1:A10)", correct: false }
        ]
    },
    "excel_2": {
        type: "matching",
        question: "Manakah penulisan rumus penguncian sel absolut ($) dan fungsi pembacaan tabel yang BENAR?",
        options: [
            { text: "=VLOOKUP(A2, $B$2:$D$10, 2, FALSE)", correct: true },
            { text: "=LOOKUP(A2, B2-D10, 2)", correct: false },
            { text: "=HLOOKUP(A2, B2:D10, $2)", correct: false }
        ]
    },
    "excel_3": {
        type: "simulator",
        question: "Tuliskan rumus Excel untuk menjumlahkan isi rentang B2:B10 HANYA jika nilai di sel A2:A10 adalah \"Lulus\":",
        targetAnswers: [
            '=sumif(a2:a10,"lulus",b2:b10)',
            '=sumif(a2:a10; "lulus"; b2:b10)',
            '=sumif(a2:a10,"lulus", b2:b10)'
        ],
        hint: 'Format: =SUMIF(range_kriteria, "kriteria", range_jumlah)'
    },

    // --- MS POWERPOINT ---
    "ppt_1": {
        type: "quiz",
        question: "Tombol keyboard apa yang digunakan untuk memulai tayangan peragaan Slide Show LANGSUNG dari slide yang sedang aktif?",
        options: [
            { text: "Shift + F5", correct: true },
            { text: "F5", correct: false },
            { text: "Ctrl + F5", correct: false },
            { text: "Alt + F5", correct: false }
        ]
    },
    "ppt_2": {
        type: "matching",
        question: "Manakah pernyataan yang BENAR mengenai perbedaan Transisi dan Animasi di PowerPoint?",
        options: [
            { text: "Transition = Efek perpindahan antar slide; Animation = Efek pada objek di dalam slide", correct: true },
            { text: "Transition = Efek pergerakan teks; Animation = Efek perpindahan halaman slide", correct: false },
            { text: "Keduanya memiliki fungsi yang persis sama tanpa perbedaan", correct: false }
        ]
    },
    "ppt_3": {
        type: "simulator",
        question: "Ketikkan nama ekstensi format file PowerPoint yang jika diklik akan LANGSUNG menjalankan Slide Show tanpa membuka editor:",
        targetAnswers: [".ppsx", "ppsx"],
        hint: "Contoh jawaban: .ppsx"
    }
};

// State Aplikasi
let userProgress = JSON.parse(localStorage.getItem("office_progress")) || {
    "word_1": false, "word_2": false, "word_3": false,
    "excel_1": false, "excel_2": false, "excel_3": false,
    "ppt_1": false, "ppt_2": false, "ppt_3": false
};

let currentModule = "word";
let currentLevel = 1;
let lives = 3;
let score = parseInt(localStorage.getItem("student_score")) || 0;
let materialsData = [];

let userName = localStorage.getItem("student_name") || "Siswa Baru";
let userClass = localStorage.getItem("student_class") || "Kelas Umum";

// ==========================================
// 2. INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // Inisialisasi Identitas Siswa jika belum ada
    if (!localStorage.getItem("student_name")) {
        const inputName = prompt("Masukkan Nama Lengkap Siswa:") || "Siswa Baru";
        const inputClass = prompt("Masukkan Kelas (Contoh: X-RPL 1):") || "Kelas Umum";
        userName = inputName.trim();
        userClass = inputClass.trim();
        localStorage.setItem("student_name", userName);
        localStorage.setItem("student_class", userClass);
    }

    updateProfileUI();

    // Fetch Data Materi dari file JSON
    fetch('data/materials.json')
        .then(res => {
            if (!res.ok) throw new Error("Gagal memuat materi JSON");
            return res.json();
        })
        .then(data => {
            materialsData = data;
            renderLevelTree();
            loadMaterial(currentModule, currentLevel);
        })
        .catch(err => {
            console.error("Error loading materials:", err);
            renderLevelTree();
        });

    checkAllLevelsCompleted();
});

// ==========================================
// 3. LOGIKA UNLOCKING & NAVIGATION
// ==========================================

function isLevelUnlocked(levelId) {
    const index = LEVEL_SEQUENCE.indexOf(levelId);
    if (index === 0) return true; // Level 1 Word selalu terbuka
    
    // Syarat Buka: Level sebelumnya HARUS sudah completed (true)
    const prevLevelId = LEVEL_SEQUENCE[index - 1];
    return userProgress[prevLevelId] === true;
}

function saveProgress() {
    localStorage.setItem("office_progress", JSON.stringify(userProgress));
    localStorage.setItem("student_score", score.toString());
    renderLevelTree();
    checkAllLevelsCompleted();
}

function renderLevelTree() {
    const tree = document.getElementById("level-tree");
    if (!tree) return;
    
    tree.innerHTML = "";

    MODULE_CONFIG.forEach(m => {
        let modHtml = `
            <div class="space-y-1.5 mb-3">
                <div class="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <i class="fa-solid ${m.icon}"></i> ${m.name}
                </div>
                <div class="grid grid-cols-3 gap-1.5">
        `;
        
        for (let l = 1; l <= 3; l++) {
            const key = `${m.id}_${l}`;
            const isDone = userProgress[key];
            const unlocked = isLevelUnlocked(key);
            const isActive = currentModule === m.id && currentLevel === l;
            
            let btnClass = "";
            let iconHtml = "";

            if (isDone) {
                btnClass = "bg-emerald-600/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-600/30";
                iconHtml = '<i class="fa-solid fa-circle-check text-[10px]"></i>';
            } else if (unlocked) {
                btnClass = "bg-sky-600/20 border-sky-500/50 text-sky-300 hover:bg-sky-600/30 cursor-pointer animate-pulse";
                iconHtml = '<i class="fa-solid fa-play text-[8px]"></i>';
            } else {
                btnClass = "bg-slate-800/40 border-slate-700 text-slate-600 cursor-not-allowed opacity-60";
                iconHtml = '<i class="fa-solid fa-lock text-[10px]"></i>';
            }

            if (isActive) btnClass += " ring-2 ring-sky-400 font-bold";

            modHtml += `
                <button onclick="selectLevel('${m.id}', ${l})" ${!unlocked ? 'disabled' : ''} 
                        class="text-xs py-2 border rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${btnClass}">
                    Lvl ${l} ${iconHtml}
                </button>
            `;
        }
        modHtml += `</div></div>`;
        tree.innerHTML += modHtml;
    });
}

function selectLevel(mod, lvl) {
    const key = `${mod}_${lvl}`;
    if (!isLevelUnlocked(key)) {
        alert("🔒 Level ini masih terkunci! Selesaikan semua level dan modul sebelumnya terlebih dahulu.");
        return;
    }
    currentModule = mod;
    currentLevel = lvl;
    renderLevelTree();
    loadMaterial(mod, lvl);
    switchTab('material');
}

// ==========================================
// 4. PEMBACA MATERI (MATERIAL RENDERER)
// ==========================================

function loadMaterial(mod, lvl) {
    const key = `${mod}_${lvl}`;
    const mat = materialsData.find(m => m.id === key);

    const titleEl = document.getElementById("mat-title");
    const moduleEl = document.getElementById("mat-module");
    const contentEl = document.getElementById("mat-content");

    if (!titleEl || !contentEl) return;

    if (!mat) {
        titleEl.innerText = `Materi ${mod.toUpperCase()} Level ${lvl}`;
        if (moduleEl) moduleEl.innerText = `${mod.toUpperCase()} - Level ${lvl}`;
        contentEl.innerHTML = `<p class="text-slate-400">Materi sedang dipersiapkan...</p>`;
        return;
    }

    titleEl.innerText = mat.title;
    if (moduleEl) moduleEl.innerText = `${mat.module} - Level ${mat.level}`;

    let htmlContent = `<div class="space-y-6">`;

    if (mat.sections && mat.sections.length > 0) {
        mat.sections.forEach(sec => {
            htmlContent += `
                <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
                    <h4 class="text-md font-bold text-amber-400 mb-3 flex items-center gap-2">
                        <i class="fa-solid fa-bookmark text-xs text-sky-400"></i> ${sec.heading}
                    </h4>
                    <ul class="space-y-2 pl-2">
            `;
            
            sec.points.forEach(pt => {
                htmlContent += `
                    <li class="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5 leading-relaxed">
                        <i class="fa-solid fa-circle-check text-emerald-400 text-xs mt-1 shrink-0"></i>
                        <span>${pt}</span>
                    </li>
                `;
            });

            htmlContent += `</ul></div>`;
        });
    } else {
        htmlContent += `<p class="text-slate-300 leading-relaxed text-sm">${mat.content || ''}</p>`;
    }

    htmlContent += `</div>`;
    contentEl.innerHTML = htmlContent;
}

// ==========================================
// 5. TAB SYSTEM & PANEL SWITCHING
// ==========================================

function switchTab(tab) {
    const matPanel = document.getElementById("panel-material");
    const gamePanel = document.getElementById("panel-game");
    const matBtn = document.getElementById("tab-material-btn");
    const gameBtn = document.getElementById("tab-game-btn");

    if (!matPanel || !gamePanel) return;

    if (tab === 'material') {
        matPanel.classList.remove("hidden");
        gamePanel.classList.add("hidden");
        if (matBtn) matBtn.className = "flex-1 py-2.5 rounded-lg font-bold text-sm bg-blue-600 text-white transition flex items-center justify-center gap-2";
        if (gameBtn) gameBtn.className = "flex-1 py-2.5 rounded-lg font-bold text-sm text-slate-400 hover:text-white transition flex items-center justify-center gap-2";
    } else {
        matPanel.classList.add("hidden");
        gamePanel.classList.remove("hidden");
        if (gameBtn) gameBtn.className = "flex-1 py-2.5 rounded-lg font-bold text-sm bg-blue-600 text-white transition flex items-center justify-center gap-2";
        if (matBtn) matBtn.className = "flex-1 py-2.5 rounded-lg font-bold text-sm text-slate-400 hover:text-white transition flex items-center justify-center gap-2";
        initGameMechanic();
    }
}

function startChallengeFromMaterial() {
    switchTab('game');
}

// ==========================================
// 6. GAME MECHANIC ENGINE
// ==========================================

function initGameMechanic() {
    lives = 3;
    const livesEl = document.getElementById("lives-count");
    const scoreEl = document.getElementById("game-score");
    const workspace = document.getElementById("game-workspace");
    const badge = document.getElementById("game-mechanic-badge");

    if (livesEl) livesEl.innerText = lives;
    if (scoreEl) scoreEl.innerText = score;

    const currentKey = `${currentModule}_${currentLevel}`;
    const questionData = QUESTION_BANK[currentKey];

    if (!questionData || !workspace) {
        if (workspace) workspace.innerHTML = `<p class="text-slate-400">Soal tantangan belum tersedia untuk level ini.</p>`;
        return;
    }

    if (badge) {
        const typeNames = { quiz: "Speed Quiz", matching: "Matching Challenge", simulator: "Lab Simulator" };
        badge.innerText = `Level ${currentLevel}: ${typeNames[questionData.type]} (${currentModule.toUpperCase()})`;
    }

    // Render Tampilan Berdasarkan Tipe Soal
    if (questionData.type === "quiz" || questionData.type === "matching") {
        let optionsHtml = questionData.options.map((opt, idx) => `
            <button onclick="handleAnswer(${opt.correct})" 
                    class="w-full p-3.5 bg-slate-800 hover:bg-sky-600/80 border border-slate-700 hover:border-sky-400 rounded-xl text-left text-xs sm:text-sm text-slate-200 transition-all duration-200 flex items-center gap-3">
                <span class="w-6 h-6 rounded-lg bg-slate-700 font-bold flex items-center justify-center text-xs shrink-0">${String.fromCharCode(65 + idx)}</span>
                <span>${opt.text}</span>
            </button>
        `).join('');

        workspace.innerHTML = `
            <div class="space-y-5">
                <div class="p-4 bg-slate-900/80 rounded-xl border border-slate-700/80">
                    <p class="font-bold text-sm sm:text-base text-slate-100 leading-relaxed">${questionData.question}</p>
                </div>
                <div class="grid grid-cols-1 gap-2.5">
                    ${optionsHtml}
                </div>
            </div>
        `;
    } else if (questionData.type === "simulator") {
        workspace.innerHTML = `
            <div class="space-y-4">
                <div class="p-4 bg-slate-900/80 rounded-xl border border-slate-700/80">
                    <p class="font-bold text-sm sm:text-base text-slate-100 mb-2">${questionData.question}</p>
                    <p class="text-xs text-amber-400 font-medium"><i class="fa-solid fa-lightbulb"></i> Petunjuk: ${questionData.hint}</p>
                </div>
                <div class="space-y-3">
                    <input type="text" id="sim-input" placeholder="Ketik jawaban/rumus di sini..." 
                           onkeypress="if(event.key==='Enter') checkSimulatorAnswer()"
                           class="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-sky-400 font-mono text-xs sm:text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400">
                    <button onclick="checkSimulatorAnswer()" 
                            class="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition">
                        Submit Jawaban <i class="fa-solid fa-paper-plane ml-1"></i>
                    </button>
                </div>
            </div>
        `;
    }
}

function handleAnswer(isCorrect) {
    if (isCorrect) {
        score += 50;
        const scoreEl = document.getElementById("game-score");
        if (scoreEl) scoreEl.innerText = score;
        completeCurrentLevel();
    } else {
        lives--;
        const livesEl = document.getElementById("lives-count");
        if (livesEl) livesEl.innerText = lives;

        if (lives <= 0) {
            alert("❌ Nyawa Habis! Pelajari kembali materi sebelum mencoba lagi.");
            switchTab('material');
        } else {
            alert(`❌ Jawaban Kurang Tepat! Sisa Nyawa: ${lives}`);
        }
    }
}

function checkSimulatorAnswer() {
    const inputEl = document.getElementById("sim-input");
    if (!inputEl) return;

    const userInput = inputEl.value.trim().toLowerCase().replace(/\s+/g, ' ');
    const currentKey = `${currentModule}_${currentLevel}`;
    const questionData = QUESTION_BANK[currentKey];

    if (!questionData || !questionData.targetAnswers) return;

    const isMatch = questionData.targetAnswers.some(ans => ans.toLowerCase().replace(/\s+/g, ' ') === userInput);
    handleAnswer(isMatch);
}

// ==========================================
// 7. PROGRESSION & LEVEL COMPLETION
// ==========================================

function completeCurrentLevel() {
    const key = `${currentModule}_${currentLevel}`;
    userProgress[key] = true;
    saveProgress();

    const currentIndex = LEVEL_SEQUENCE.indexOf(key);
    
    if (currentIndex < LEVEL_SEQUENCE.length - 1) {
        const nextKey = LEVEL_SEQUENCE[currentIndex + 1];
        const [nextMod, nextLvl] = nextKey.split("_");
        alert(`🎉 Selamat! Kamu LULUS ${currentModule.toUpperCase()} Level ${currentLevel}.\n\n🔓 Level berikutnya (${nextMod.toUpperCase()} Level ${nextLvl}) telah terbuka!`);
        selectLevel(nextMod, parseInt(nextLvl));
    } else {
        alert("🏆 LUAR BIASA! Kamu telah menyelesaikan SELURUH level dari semua modul!\n\nSertifikat Kelulusan resmi sekarang dapat kamu cetak!");
        checkAllLevelsCompleted();
    }
}

function checkAllLevelsCompleted() {
    const allFinished = LEVEL_SEQUENCE.every(k => userProgress[k] === true);
    const btnCert = document.getElementById("btn-cert");

    if (!btnCert) return;

    if (allFinished) {
        btnCert.disabled = false;
        btnCert.innerText = "🎓 Cetak Sertifikat Kelulusan";
        btnCert.className = "w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-extrabold py-3 rounded-xl cursor-pointer text-xs shadow-lg transition animate-bounce";
    } else {
        btnCert.disabled = true;
        btnCert.innerText = "🔒 Sertifikat (Terkunci)";
        btnCert.className = "w-full bg-slate-800 text-slate-500 font-bold py-2.5 rounded-xl cursor-not-allowed text-xs border border-slate-700 transition";
    }
}

// ==========================================
// 8. PROFILE & UTILITIES
// ==========================================

function updateProfileUI() {
    const nameEl = document.getElementById("player-name");
    const classEl = document.getElementById("player-class");
    if (nameEl) nameEl.innerText = userName;
    if (classEl) classEl.innerText = "Kelas: " + userClass;
}

function editProfile() {
    const newName = prompt("Edit Nama Lengkap Siswa:", userName);
    const newClass = prompt("Edit Kelas:", userClass);
    if (newName && newName.trim() !== "") { 
        userName = newName.trim(); 
        localStorage.setItem("student_name", userName); 
    }
    if (newClass && newClass.trim() !== "") { 
        userClass = newClass.trim(); 
        localStorage.setItem("student_class", userClass); 
    }
    updateProfileUI();
}

function resetProgress() {
    if (confirm("⚠️ Apakah kamu yakin ingin mengulang seluruh progress dari awal?")) {
        localStorage.removeItem("office_progress");
        localStorage.removeItem("student_score");
        location.reload();
    }
}

function generateCertificate() {
    const allFinished = LEVEL_SEQUENCE.every(k => userProgress[k] === true);
    if (!allFinished) {
        alert("Selesaikan semua modul & level terlebih dahulu!");
        return;
    }
    alert(`🎓 SERTIFIKAT KELULUSAN\n\nDiberikan Kepada: ${userName}\nKelas: ${userClass}\nSkor Akhir: ${score}\n\nStatus: LULUS SPESIALIS MICROSOFT OFFICE`);
}
