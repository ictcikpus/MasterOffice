/**
 * GAME ENGINE - EDP (OFFICE MASTER)
 * Murni Logika Game - Membaca JSON via Fetch
 */

const LEVEL_SEQUENCE = [
    "word_1", "word_2", "word_3",
    "excel_1", "excel_2", "excel_3"
]; // Tambahkan ppt_1 dst jika modul sudah siap

const MODULE_CONFIG = [
    { id: "word", name: "Microsoft Word", icon: "fa-file-word text-blue-500" },
    { id: "excel", name: "Microsoft Excel", icon: "fa-file-excel text-emerald-500" }
];

let QUESTION_BANK = {}; 
let materialsData = []; 

let userProgress = JSON.parse(localStorage.getItem("office_progress")) || {};
let currentModule = "word";
let currentLevel = 1;
let lives = 3;
let score = parseInt(localStorage.getItem("student_score")) || 0;
let userName = localStorage.getItem("student_name") || "Siswa Baru";
let userClass = localStorage.getItem("student_class") || "Kelas Umum";

let gameTimerInterval;
let timeLeft = 0;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inisialisasi Profil
    if (!localStorage.getItem("student_name")) {
        userName = prompt("Masukkan Nama Lengkap Siswa:") || "Siswa Baru";
        userClass = prompt("Masukkan Kelas (Contoh: X-RPL 1):") || "Kelas Umum";
        localStorage.setItem("student_name", userName);
        localStorage.setItem("student_class", userClass);
    }
    updateProfileUI();

    // 2. Fetch Data JSON menggunakan path relatif ./data/ (Aman untuk GitHub Pages)
    Promise.all([
        fetch('./data/materials.json').then(res => res.json()),
        fetch('./data/questions.json').then(res => res.json())
    ])
    .then(([materials, questions]) => {
        materialsData = materials;
        QUESTION_BANK = questions;
        
        renderLevelTree();
        loadMaterial(currentModule, currentLevel);
        checkAllLevelsCompleted();
        
        // Pancing pengiriman data awal ke Firebase jika skor sudah ada
        if (score > 0 && typeof window.syncScoreToDatabase === 'function') {
            window.syncScoreToDatabase(userName, userClass, score);
        }
    })
    .catch(err => {
        console.error("Gagal memuat JSON:", err);
        document.getElementById("mat-content").innerHTML = `<p class="text-rose-500">Gagal memuat data. Jika di lokal, gunakan Live Server.</p>`;
    });
});

function isLevelUnlocked(levelId) {
    const index = LEVEL_SEQUENCE.indexOf(levelId);
    if (index === 0) return true; // Level pertama selalu terbuka
    return userProgress[LEVEL_SEQUENCE[index - 1]] === true;
}

function saveProgress() {
    localStorage.setItem("office_progress", JSON.stringify(userProgress));
    localStorage.setItem("student_score", score.toString());
    
    // Delegasikan penyimpanan ke Firebase melalui leaderboard.js
    if (typeof window.syncScoreToDatabase === 'function') {
        window.syncScoreToDatabase(userName, userClass, score);
    }
    
    renderLevelTree();
    checkAllLevelsCompleted();
}

function updateProfileUI() { 
    if(document.getElementById("player-name")) document.getElementById("player-name").innerText = userName; 
    if(document.getElementById("player-class")) document.getElementById("player-class").innerText = "Kelas: " + userClass;
    if(document.getElementById("game-score")) document.getElementById("game-score").innerText = score;
    if(document.getElementById("lives-count")) document.getElementById("lives-count").innerText = lives;
}

function renderLevelTree() {
    const tree = document.getElementById("level-tree");
    if (!tree) return;
    tree.innerHTML = "";

    MODULE_CONFIG.forEach(m => {
        let modHtml = `<div class="space-y-1.5 mb-3"><div class="text-xs font-bold text-slate-300 flex items-center gap-2"><i class="fa-solid ${m.icon}"></i> ${m.name}</div><div class="grid grid-cols-3 gap-1.5">`;
        
        for (let l = 1; l <= 3; l++) {
            const key = `${m.id}_${l}`;
            const isDone = userProgress[key];
            const unlocked = isLevelUnlocked(key);
            const isActive = currentModule === m.id && currentLevel === l;
            
            let btnClass = isDone ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-400" : 
                           unlocked ? "bg-sky-600/20 border-sky-500/50 text-sky-300 cursor-pointer animate-pulse" : 
                           "bg-slate-800/40 border-slate-700 text-slate-600 cursor-not-allowed opacity-60";
            let iconHtml = isDone ? '<i class="fa-solid fa-circle-check text-[10px]"></i>' : unlocked ? '<i class="fa-solid fa-play text-[8px]"></i>' : '<i class="fa-solid fa-lock text-[10px]"></i>';
            if (isActive) btnClass += " ring-2 ring-sky-400 font-bold";

            modHtml += `<button onclick="selectLevel('${m.id}', ${l})" ${!unlocked ? 'disabled' : ''} class="text-xs py-2 border rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${btnClass}">Lvl ${l} ${iconHtml}</button>`;
        }
        modHtml += `</div></div>`;
        tree.innerHTML += modHtml;
    });
}

function selectLevel(mod, lvl) {
    if (!isLevelUnlocked(`${mod}_${lvl}`)) return alert("🔒 Selesaikan level sebelumnya dulu!");
    currentModule = mod; currentLevel = lvl;
    renderLevelTree(); 
    loadMaterial(mod, lvl); 
    switchTab('material');
}

function loadMaterial(mod, lvl) {
    const key = `${mod}_${lvl}`;
    const mat = materialsData.find(m => m.id === key);
    const contentEl = document.getElementById("mat-content");
    if (!contentEl) return;

    if (!mat) {
        contentEl.innerHTML = `<p class="text-slate-400 text-sm">Materi untuk level ini belum tersedia di JSON.</p>`;
        return;
    }

    document.getElementById("mat-title").innerText = mat.title;
    document.getElementById("mat-module").innerText = `${mat.module} - Level ${mat.level}`;

    let htmlContent = `<div class="space-y-4">`;
    if (mat.sections) {
        mat.sections.forEach(sec => {
            htmlContent += `<div class="bg-slate-950 p-4 rounded-xl border border-slate-800"><h4 class="text-md font-bold text-amber-400 mb-2">${sec.heading}</h4><ul class="space-y-1 pl-2">`;
            sec.points.forEach(pt => htmlContent += `<li class="text-sm text-slate-300 flex items-start gap-2.5"><i class="fa-solid fa-angle-right text-sky-400 mt-1 shrink-0 text-xs"></i><span>${pt}</span></li>`);
            htmlContent += `</ul></div>`;
        });
    }
    contentEl.innerHTML = htmlContent + `</div>`;
}

function switchTab(tab) {
    document.getElementById("panel-material").classList.toggle("hidden", tab !== 'material');
    document.getElementById("panel-game").classList.toggle("hidden", tab === 'material');
    clearInterval(gameTimerInterval);
    if (tab === 'game') initGameMechanic();
}

function startChallengeFromMaterial() { switchTab('game'); }

function shuffleArray(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Logika Tampilan & Mekanisme Kuis
function initGameMechanic() {
    lives = 3; 
    updateProfileUI();
    
    const workspace = document.getElementById("game-workspace");
    const questionData = QUESTION_BANK[`${currentModule}_${currentLevel}`];
    
    if (!questionData) {
        workspace.innerHTML = "<p class='text-slate-400'>Soal belum dimuat dari questions.json.</p>";
        return;
    }
    
    timeLeft = questionData.time || 30; 
    clearInterval(gameTimerInterval); 
    startTimer();

    let timerHtml = `<div class="mb-4 flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800"><span class="text-slate-400 text-xs font-bold">WAKTU:</span><span id="timer-display" class="text-sky-400 font-mono font-bold text-xl">${timeLeft}s</span></div>`;
    
    if (questionData.type === "quiz") {
        let optionsHtml = shuffleArray(questionData.options).map((opt, idx) => `
            <button onclick="handleAnswer(${opt.correct})" class="w-full p-4 bg-slate-800 hover:bg-sky-600 border border-slate-700 rounded-xl text-left text-sm text-slate-200 transition-all font-medium">
                <span class="mr-3 font-bold bg-slate-950 px-2.5 py-1 rounded text-sky-400">${String.fromCharCode(65 + idx)}</span> ${opt.text}
            </button>
        `).join('');
        workspace.innerHTML = timerHtml + `<p class="font-bold text-lg mb-5 text-white leading-relaxed">${questionData.question}</p><div class="space-y-3">${optionsHtml}</div>`;
    } else if (questionData.type === "simulator") {
        window.checkSimulatorAnswer = function() {
            const userInput = document.getElementById("sim-input").value.trim().toLowerCase();
            const isCorrect = questionData.targetAnswers.some(ans => ans.toLowerCase() === userInput);
            handleAnswer(isCorrect);
        };
        workspace.innerHTML = timerHtml + `
            <p class="font-bold text-lg mb-2 text-white leading-relaxed">${questionData.question}</p>
            <p class="text-xs text-amber-400 mb-5 bg-amber-500/10 inline-block px-3 py-1 rounded-full"><i class="fa-solid fa-lightbulb"></i> Petunjuk: ${questionData.hint}</p>
            <input type="text" id="sim-input" placeholder="Ketik jawaban di sini..." class="w-full p-4 bg-slate-950 border border-sky-500/50 rounded-xl text-sky-400 font-mono text-base mb-4 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-inner">
            <button onclick="checkSimulatorAnswer()" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg">Kirim Jawaban</button>
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
        // Hitung skor berdasarkan sisa waktu
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
        selectLevel(...LEVEL_SEQUENCE[idx + 1].split("_"));
    } else {
        alert("🏆 LUAR BIASA! Kamu menyelesaikan semua modul saat ini!");
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
            if (typeof window.generateCertificate === 'function') window.generateCertificate(userName, userClass, score);
            else alert("Sertifikat sedang diproses (Pastikan certificate.js aktif)!");
        };
    }
}
