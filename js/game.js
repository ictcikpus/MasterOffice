/**
 * GAME ENGINE - EDP (OFFICE MASTER)
 * - Membaca data dinamis dari ./data/materials.json & ./data/questions.json
 * - Mendukung bank soal berupa Array (Pengacakan Soal & Pilihan Jawaban)
 * - Terintegrasi dengan leaderboard.js dan certificate.js
 */

// ==========================================
// 1. KONSTANTA & KONFIGURASI MODUL
// ==========================================
const LEVEL_SEQUENCE = [
    "word_1", "word_2", "word_3",
    "excel_1", "excel_2", "excel_3",
    "ppt_1", "ppt_2", "ppt_3"
];

const MODULE_CONFIG = [
    { id: "word", name: "Microsoft Word", icon: "fa-file-word text-blue-500" },
    { id: "excel", name: "Microsoft Excel", icon: "fa-file-excel text-emerald-500" },
    { id: "ppt", name: "Microsoft PPT", icon: "fa-file-powerpoint text-amber-500" }
];

// State Global Game
let QUESTION_BANK = {}; 
let materialsData = []; 

let userProgress = JSON.parse(localStorage.getItem("office_progress")) || {};
let currentModule = "word";
let currentLevel = 1;
let lives = 3;
let score = parseInt(localStorage.getItem("student_score")) || 0;
let userName = localStorage.getItem("student_name") || "Siswa Baru";
let userClass = localStorage.getItem("student_class") || "Kelas Umum";

let gameTimerInterval = null;
let timeLeft = 0;
let currentActiveQuestion = null;

// ==========================================
// 2. INISIALISASI & FETCH DATA JSON
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Profil Siswa Setup
    if (!localStorage.getItem("student_name")) {
        userName = prompt("Masukkan Nama Lengkap Siswa:") || "Siswa Baru";
        userClass = prompt("Masukkan Kelas (Contoh: X-RPL 1):") || "Kelas Umum";
        localStorage.setItem("student_name", userName);
        localStorage.setItem("student_class", userClass);
    }
    updateProfileUI();

    // Fetch JSON Paralel dari Folder data/
    Promise.all([
        fetch('./data/materials.json').then(res => {
            if (!res.ok) throw new Error("Gagal mengambil materials.json");
            return res.json();
        }),
        fetch('./data/questions.json').then(res => {
            if (!res.ok) throw new Error("Gagal mengambil questions.json");
            return res.json();
        })
    ])
    .then(([materials, questions]) => {
        materialsData = materials;
        QUESTION_BANK = questions;
        
        renderLevelTree();
        loadMaterial(currentModule, currentLevel);
        checkAllLevelsCompleted();
        
        // Kirim nilai awal ke Firebase jika pernah bermain sebelumnya
        if (score > 0 && typeof window.syncScoreToDatabase === 'function') {
            window.syncScoreToDatabase(userName, userClass, score);
        }
    })
    .catch(err => {
        console.error("Gagal memuat JSON:", err);
        const matContent = document.getElementById("mat-content");
        if (matContent) {
            matContent.innerHTML = `<p class="text-rose-500 font-bold p-4 bg-rose-950/30 rounded-xl border border-rose-800/50">
                ⚠️ Gagal memuat data soal/materi (${err.message}).<br>
                <span class="text-xs font-normal text-slate-300">Pastikan nama file di folder data/ sudah benar (lowercase) dan dijalankan di Live Server / GitHub Pages.</span>
            </p>`;
        }
    });
});

// ==========================================
// 3. LOGIKA UNLOCKING & NAVIGASI LEVEL
// ==========================================
function isLevelUnlocked(levelId) {
    const index = LEVEL_SEQUENCE.indexOf(levelId);
    if (index === 0) return true; // Level 1 Word selalu terbuka
    return userProgress[LEVEL_SEQUENCE[index - 1]] === true;
}

function saveProgress() {
    localStorage.setItem("office_progress", JSON.stringify(userProgress));
    localStorage.setItem("student_score", score.toString());
    
    // Sinkronkan ke Firebase melalui leaderboard.js
    if (typeof window.syncScoreToDatabase === 'function') {
        window.syncScoreToDatabase(userName, userClass, score);
    }
    
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
            
            let btnClass = isDone ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-400" : 
                           unlocked ? "bg-sky-600/20 border-sky-500/50 text-sky-300 cursor-pointer animate-pulse" : 
                           "bg-slate-800/40 border-slate-700 text-slate-600 cursor-not-allowed opacity-60";
            
            let iconHtml = isDone ? '<i class="fa-solid fa-circle-check text-[10px]"></i>' : 
                           unlocked ? '<i class="fa-solid fa-play text-[8px]"></i>' : 
                           '<i class="fa-solid fa-lock text-[10px]"></i>';
            
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
    if (!isLevelUnlocked(`${mod}_${lvl}`)) return alert("🔒 Selesaikan level sebelumnya terlebih dahulu!");
    currentModule = mod; 
    currentLevel = lvl;
    renderLevelTree(); 
    loadMaterial(mod, lvl); 
    switchTab('material');
}

// ==========================================
// 4. PEMUATAN MATERI & MANAJEMEN TAB
// ==========================================
function loadMaterial(mod, lvl) {
    const key = `${mod}_${lvl}`;
    const mat = materialsData.find(m => m.id === key);
    const contentEl = document.getElementById("mat-content");
    if (!contentEl) return;

    if (!mat) {
        contentEl.innerHTML = `<p class="text-slate-400 text-sm italic">Materi untuk level ini belum tersedia di data/materials.json.</p>`;
        return;
    }

    document.getElementById("mat-title").innerText = mat.title;
    document.getElementById("mat-module").innerText = `${mat.module} - Level ${mat.level}`;

    let htmlContent = `<div class="space-y-4">`;
    if (mat.sections && Array.isArray(mat.sections)) {
        mat.sections.forEach(sec => {
            htmlContent += `
                <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h4 class="text-md font-bold text-amber-400 mb-2">${sec.heading}</h4>
                    <ul class="space-y-1 pl-2">
            `;
            sec.points.forEach(pt => {
                htmlContent += `
                    <li class="text-sm text-slate-300 flex items-start gap-2.5">
                        <i class="fa-solid fa-angle-right text-sky-400 mt-1 shrink-0 text-xs"></i>
                        <span>${pt}</span>
                    </li>
                `;
            });
            htmlContent += `</ul></div>`;
        });
    } else {
        htmlContent += `<p class="text-slate-300 text-sm">${mat.content || ''}</p>`;
    }
    contentEl.innerHTML = htmlContent + `</div>`;
}

function switchTab(tab) {
    document.getElementById("panel-material").classList.toggle("hidden", tab !== 'material');
    document.getElementById("panel-game").classList.toggle("hidden", tab === 'material');
    clearInterval(gameTimerInterval);
    if (tab === 'game') initGameMechanic();
}

function startChallengeFromMaterial() { 
    switchTab('game'); 
}

// ==========================================
// 5. MEKANISME GAME & PENGACAKAN SOAL
// ==========================================
function shuffleArray(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function initGameMechanic() {
    lives = 3; 
    updateProfileUI();
    
    const workspace = document.getElementById("game-workspace");
    const levelKey = `${currentModule}_${currentLevel}`;
    const questionDataRaw = QUESTION_BANK[levelKey];
    
    if (!questionDataRaw) {
        workspace.innerHTML = `<div class="p-6 text-center text-slate-400">
            <i class="fa-solid fa-folder-open text-3xl mb-2 text-slate-600"></i>
            <p class="font-semibold text-sm">Soal untuk ${levelKey} belum dimuat dari questions.json.</p>
        </div>`;
        return;
    }
    
    // Pilih 1 soal secara ACAK jika data bernilai Array
    if (Array.isArray(questionDataRaw)) {
        if (questionDataRaw.length === 0) {
            workspace.innerHTML = "<p class='text-slate-400 p-4'>Bank soal level ini kosong.</p>";
            return;
        }
        const randomIndex = Math.floor(Math.random() * questionDataRaw.length);
        currentActiveQuestion = questionDataRaw[randomIndex];
    } else {
        // Fallback jika format JSON masih berbentuk objek tunggal
        currentActiveQuestion = questionDataRaw;
    }
    
    timeLeft = currentActiveQuestion.time || 30; 
    clearInterval(gameTimerInterval); 
    startTimer();

    let timerHtml = `
        <div class="mb-4 flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span class="text-slate-400 text-xs font-bold">WAKTU TERSISA:</span>
            <span id="timer-display" class="text-sky-400 font-mono font-bold text-xl">${timeLeft}s</span>
        </div>
    `;
    
    if (currentActiveQuestion.type === "quiz") {
        // Acak opsi jawaban (A, B, C, D)
        let optionsHtml = shuffleArray(currentActiveQuestion.options).map((opt, idx) => `
            <button onclick="handleAnswer(${opt.correct})" class="w-full p-4 bg-slate-800 hover:bg-sky-600 border border-slate-700 rounded-xl text-left text-sm text-slate-200 transition-all font-medium flex items-start">
                <span class="mr-3 font-bold bg-slate-950 px-2.5 py-0.5 rounded text-sky-400 shrink-0">${String.fromCharCode(65 + idx)}</span> 
                <span>${opt.text}</span>
            </button>
        `).join('');
        
        workspace.innerHTML = timerHtml + `
            <p class="font-bold text-lg mb-5 text-white leading-relaxed">${currentActiveQuestion.question}</p>
            <div class="space-y-3">${optionsHtml}</div>
        `;
    } else if (currentActiveQuestion.type === "simulator" || currentActiveQuestion.type === "matching") {
        window.checkSimulatorAnswer = function() {
            const inputEl = document.getElementById("sim-input");
            if (!inputEl) return;
            const userInput = inputEl.value.trim().toLowerCase();
            const isCorrect = currentActiveQuestion.targetAnswers.some(ans => ans.toLowerCase() === userInput);
            handleAnswer(isCorrect);
        };

        workspace.innerHTML = timerHtml + `
            <p class="font-bold text-lg mb-2 text-white leading-relaxed">${currentActiveQuestion.question}</p>
            <p class="text-xs text-amber-400 mb-5 bg-amber-500/10 inline-block px-3 py-1.5 rounded-lg border border-amber-500/20">
                <i class="fa-solid fa-lightbulb"></i> Petunjuk: ${currentActiveQuestion.hint || "Ketik jawaban yang tepat"}
            </p>
            <input type="text" id="sim-input" placeholder="Ketik jawaban di sini..." 
                onkeypress="if(event.key === 'Enter') checkSimulatorAnswer()" 
                class="w-full p-4 bg-slate-950 border border-sky-500/50 rounded-xl text-sky-400 font-mono text-base mb-4 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-inner">
            <button onclick="checkSimulatorAnswer()" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg">
                Kirim Jawaban
            </button>
        `;
    }
}

function startTimer() {
    gameTimerInterval = setInterval(() => {
        timeLeft--;
        const td = document.getElementById("timer-display");
        if (td) td.innerText = `${timeLeft}s`;
        if (timeLeft <= 0) handleAnswer(false, true);
    }, 1000);
}

function handleAnswer(isCorrect, isTimeout = false) {
    clearInterval(gameTimerInterval);
    if (isCorrect) {
        const points = 50 + Math.floor(timeLeft * 1.5);
        score += points;
        saveProgress();
        updateProfileUI();
        alert(`🎉 Jawaban Benar! (+${points} Poin)`);
        completeCurrentLevel();
    } else {
        lives--; 
        updateProfileUI();
        if (lives <= 0) { 
            alert("❌ Nyawa habis! Kamu harus membaca materi kembali."); 
            switchTab('material'); 
        } else { 
            alert(isTimeout ? "⏰ Waktu Habis!" : "❌ Salah! Coba lagi."); 
            initGameMechanic(); 
        }
    }
}

function completeCurrentLevel() {
    userProgress[`${currentModule}_${currentLevel}`] = true; 
    saveProgress();
    const idx = LEVEL_SEQUENCE.indexOf(`${currentModule}_${currentLevel}`);
    
    if (idx < LEVEL_SEQUENCE.length - 1) {
        const [nextMod, nextLvl] = LEVEL_SEQUENCE[idx + 1].split("_");
        selectLevel(nextMod, parseInt(nextLvl));
    } else {
        alert("🏆 LUAR BIASA! Kamu menyelesaikan semua modul di game ini!");
        switchTab('material');
    }
}

function checkAllLevelsCompleted() {
    const btn = document.getElementById("btn-cert");
    if (!btn) return;
    const done = LEVEL_SEQUENCE.every(k => userProgress[k]);
    btn.disabled = !done;
    
    if (done) {
        btn.classList.remove("cursor-not-allowed", "opacity-50", "bg-amber-600/50");
        btn.classList.add("bg-amber-500", "text-black", "shadow-lg", "animate-bounce");
        btn.onclick = () => {
            if (typeof window.generateCertificate === 'function') {
                window.generateCertificate(userName, userClass, score);
            } else {
                alert("Sertifikat siap dicetak!");
            }
        };
    }
}

// ==========================================
// 6. UTILITY PROFILE & STATE RESET
// ==========================================
function updateProfileUI() { 
    if (document.getElementById("player-name")) document.getElementById("player-name").innerText = userName; 
    if (document.getElementById("player-class")) document.getElementById("player-class").innerText = "Kelas: " + userClass;
    if (document.getElementById("game-score")) document.getElementById("game-score").innerText = score;
    if (document.getElementById("lives-count")) document.getElementById("lives-count").innerText = lives;
}

function resetProgress() {
    if (confirm("⚠️ Yakin ingin mengulang semua progress dan skor?")) {
        localStorage.removeItem("office_progress");
        localStorage.removeItem("student_score");
        location.reload();
    }
}
