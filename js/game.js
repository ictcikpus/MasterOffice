// Status Penyelesaian Level Siswa (Wajib True Semua untuk Sertifikat)
let userProgress = JSON.parse(localStorage.getItem("office_progress")) || {
    "word_1": false, "word_2": false, "word_3": false,
    "excel_1": false, "excel_2": false, "excel_3": false,
    "ppt_1": false, "ppt_2": false, "ppt_3": false
};

let currentModule = "word";
let currentLevel = 1;
let lives = 3;
let score = 0;
let materialsData = [];

// Inisialisasi Identitas
let userName = localStorage.getItem("student_name") || prompt("Masukkan Nama Lengkap Siswa:") || "Siswa Baru";
let userClass = localStorage.getItem("student_class") || prompt("Masukkan Kelas (Contoh: X-RPL 1):") || "Kelas Umum";

localStorage.setItem("student_name", userName);
localStorage.setItem("student_class", userClass);

document.getElementById("player-name").innerText = userName;
document.getElementById("player-class").innerText = "Kelas: " + userClass;

// Load Data Materi & Render Tree Level
fetch('data/materials.json')
    .then(res => res.json())
    .then(data => {
        materialsData = data;
        renderLevelTree();
        loadMaterial(currentModule, currentLevel);
    });

function saveProgress() {
    localStorage.setItem("office_progress", JSON.stringify(userProgress));
    renderLevelTree();
    checkAllLevelsCompleted();
}

function renderLevelTree() {
    const tree = document.getElementById("level-tree");
    tree.innerHTML = "";

    const modules = [
        { id: "word", name: "Microsoft Word", icon: "fa-file-word text-blue-500" },
        { id: "excel", name: "Microsoft Excel", icon: "fa-file-excel text-emerald-500" },
        { id: "ppt", name: "Microsoft PPT", icon: "fa-file-powerpoint text-amber-500" }
    ];

    modules.forEach(m => {
        let modHtml = `<div class="space-y-1"><div class="text-xs font-bold text-slate-300 flex items-center gap-2"><i class="fa-solid ${m.icon}"></i> ${m.name}</div><div class="grid grid-cols-3 gap-1.5">`;
        
        for (let l = 1; l <= 3; l++) {
            const key = `${m.id}_${l}`;
            const isDone = userProgress[key];
            const isActive = currentModule === m.id && currentLevel === l;
            
            let btnClass = isDone ? "bg-emerald-600/30 border-emerald-500 text-emerald-400" : "bg-slate-700/50 border-slate-600 text-slate-400";
            if (isActive) btnClass += " ring-2 ring-sky-400";

            modHtml += `
                <button onclick="selectLevel('${m.id}', ${l})" class="text-xs py-1.5 border rounded-lg font-semibold flex items-center justify-center gap-1 ${btnClass}">
                    Lvl ${l} ${isDone ? '<i class="fa-solid fa-check text-[10px]"></i>' : ''}
                </button>
            `;
        }
        modHtml += `</div></div>`;
        tree.innerHTML += modHtml;
    });
}

function selectLevel(mod, lvl) {
    currentModule = mod;
    currentLevel = lvl;
    renderLevelTree();
    loadMaterial(mod, lvl);
    switchTab('material');
}

function loadMaterial(mod, lvl) {
    const key = `${mod}_${lvl}`;
    const mat = materialsData.find(m => m.id === key) || {
        title: `Materi ${mod.toUpperCase()} Level ${lvl}`,
        module: mod.toUpperCase(),
        content: "Materi untuk level ini mencakup pemahaman konsep mendasar dan praktik langsung."
    };

    document.getElementById("mat-title").innerText = mat.title;
    document.getElementById("mat-module").innerText = `${mod.toUpperCase()} - Level ${lvl}`;
    document.getElementById("mat-content").innerText = mat.content;
}

function switchTab(tab) {
    const matPanel = document.getElementById("panel-material");
    const gamePanel = document.getElementById("panel-game");
    const matBtn = document.getElementById("tab-material-btn");
    const gameBtn = document.getElementById("tab-game-btn");

    if (tab === 'material') {
        matPanel.classList.remove("hidden");
        gamePanel.classList.add("hidden");
        matBtn.className = "flex-1 py-2.5 rounded-lg font-bold text-sm bg-blue-600 text-white transition flex items-center justify-center gap-2";
        gameBtn.className = "flex-1 py-2.5 rounded-lg font-bold text-sm text-slate-400 hover:text-white transition flex items-center justify-center gap-2";
    } else {
        matPanel.classList.add("hidden");
        gamePanel.classList.remove("hidden");
        gameBtn.className = "flex-1 py-2.5 rounded-lg font-bold text-sm bg-blue-600 text-white transition flex items-center justify-center gap-2";
        matBtn.className = "flex-1 py-2.5 rounded-lg font-bold text-sm text-slate-400 hover:text-white transition flex items-center justify-center gap-2";
        initGameMechanic();
    }
}

function startChallengeFromMaterial() {
    switchTab('game');
}

// INELISIASI MEKANIK GAME BERBEDA DI SETIAP LEVEL
function initGameMechanic() {
    lives = 3;
    document.getElementById("lives-count").innerText = lives;
    const workspace = document.getElementById("game-workspace");
    const badge = document.getElementById("game-mechanic-badge");

    if (currentLevel === 1) {
        // MEKANIK LEVEL 1: SPEED TRIVIA QUIZ
        badge.innerText = "Level 1: Speed Trivia Quiz";
        workspace.innerHTML = `
            <div class="space-y-4">
                <p id="q-text" class="font-bold text-base text-slate-100">Soal Level 1: Apa kombinasi tombol keyboard untuk menyimpan dokumen secara cepat?</p>
                <div id="q-options" class="grid grid-cols-1 gap-2.5">
                    <button onclick="handleAnswer(true)" class="p-3 bg-slate-700 hover:bg-sky-600 rounded-xl text-left text-sm transition">A. Ctrl + S</button>
                    <button onclick="handleAnswer(false)" class="p-3 bg-slate-700 hover:bg-sky-600 rounded-xl text-left text-sm transition">B. Ctrl + P</button>
                    <button onclick="handleAnswer(false)" class="p-3 bg-slate-700 hover:bg-sky-600 rounded-xl text-left text-sm transition">C. Ctrl + Z</button>
                </div>
            </div>
        `;
    } else if (currentLevel === 2) {
        // MEKANIK LEVEL 2: MATCHING CARDS / COCOKKAN PAIR
        badge.innerText = "Level 2: Matching Shortcut & Fungsi";
        workspace.innerHTML = `
            <div class="space-y-4">
                <p class="text-sm text-slate-300">Pilih fungsi yang sesuai untuk fitur **Mail Merge** pada MS Word:</p>
                <div class="grid grid-cols-1 gap-2">
                    <button onclick="handleAnswer(false)" class="p-3 bg-slate-700 hover:bg-amber-600 rounded-xl text-left text-sm">Menghitung rumus otomatis</button>
                    <button onclick="handleAnswer(true)" class="p-3 bg-slate-700 hover:bg-amber-600 rounded-xl text-left text-sm">Membuat surat masal dengan data berulang</button>
                    <button onclick="handleAnswer(false)" class="p-3 bg-slate-700 hover:bg-amber-600 rounded-xl text-left text-sm">Membuat slide presentasi baru</button>
                </div>
            </div>
        `;
    } else {
        // MEKANIK LEVEL 3: LAB SIMULATOR (KETIK RUMUS / INPUT PRESISI)
        badge.innerText = "Level 3: Interactive Lab Simulator";
        workspace.innerHTML = `
            <div class="space-y-4">
                <p class="text-sm text-slate-300">Ketikkan rumus Excel untuk menjumlahkan sel dari A1 sampai A10 dengan tepat:</p>
                <input type="text" id="sim-input" placeholder="Contoh: =SUM(A1:A10)" class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-sky-400 font-mono text-sm focus:outline-none focus:border-sky-500">
                <button onclick="checkSimulatorAnswer()" class="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold text-sm transition">Submit Formula</button>
            </div>
        `;
    }
}

function handleAnswer(isCorrect) {
    if (isCorrect) {
        score += 50;
        document.getElementById("game-score").innerText = score;
        alert("✨ Bagus! Jawaban Benar.");
        completeCurrentLevel();
    } else {
        lives--;
        document.getElementById("lives-count").innerText = lives;
        if (lives <= 0) {
            alert("❌ Nyawa Habis! Pelajari kembali materi sebelum mencoba lagi.");
            switchTab('material');
        } else {
            alert("❌ Kurang Tepat, coba lagi!");
        }
    }
}

function checkSimulatorAnswer() {
    const input = document.getElementById("sim-input").value.trim().toUpperCase();
    if (input === "=SUM(A1:A10)") {
        handleAnswer(true);
    } else {
        handleAnswer(false);
    }
}

function completeCurrentLevel() {
    const key = `${currentModule}_${currentLevel}`;
    userProgress[key] = true;
    saveProgress();
    alert(`🎉 Selamat! Kamu telah menyelesaikan ${currentModule.toUpperCase()} Level ${currentLevel}!`);
}

// PENGECEKAN MUTLAK: HANYA BISA CETAK SERTIFIKAT JIKA 100% LEVEL SELESAI
function checkAllLevelsCompleted() {
    const allKeys = Object.keys(userProgress);
    const isAllFinished = allKeys.every(k => userProgress[k] === true);

    const btnCert = document.getElementById("btn-cert");
    if (isAllFinished) {
        btnCert.disabled = false;
        btnCert.innerText = "🎓 Cetak Sertifikat";
        btnCert.className = "w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-extrabold py-2.5 rounded-xl cursor-pointer text-xs shadow-lg transition animate-bounce";
    } else {
        btnCert.disabled = true;
        btnCert.innerText = "Sertifikat Terkunci";
        btnCert.className = "w-full bg-slate-700 text-slate-500 font-bold py-2.5 rounded-xl cursor-not-allowed text-xs transition";
    }
}

function editProfile() {
    const newName = prompt("Edit Nama Lengkap:", userName);
    const newClass = prompt("Edit Kelas:", userClass);
    if (newName) { userName = newName.trim(); localStorage.setItem("student_name", userName); }
    if (newClass) { userClass = newClass.trim(); localStorage.setItem("student_class", userClass); }
    document.getElementById("player-name").innerText = userName;
    document.getElementById("player-class").innerText = "Kelas: " + userClass;
}

// Run check awal
checkAllLevelsCompleted();
