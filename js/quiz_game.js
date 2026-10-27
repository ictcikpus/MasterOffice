// ==========================================
// ARENA LATIHAN (SHORTCUT & KUIS MATERI)
// ==========================================

// 1. GAME SHORTCUT
var shortcutData = [
    { question: "Copy (Salin)", answer: ["Ctrl", "C"] }, 
    { question: "Paste (Tempel)", answer: ["Ctrl", "V"] },
    { question: "Cut (Potong)", answer: ["Ctrl", "X"] }, 
    { question: "Undo (Batal)", answer: ["Ctrl", "Z"] },
    { question: "Redo (Ulangi)", answer: ["Ctrl", "Y"] }, 
    { question: "Save (Simpan)", answer: ["Ctrl", "S"] },
    { question: "Print (Cetak)", answer: ["Ctrl", "P"] },
    { question: "Find (Cari)", answer: ["Ctrl", "F"] }
];
var currentShortcutIndex = 0; 
var shortcutScore = 0; 
var userKeysPressed = [];

function startShortcutGame() {
    document.body.classList.add('hide-nav');
    document.getElementById('arena-menu').classList.add('hidden');
    document.getElementById('quiz-game-container').classList.add('hidden');
    document.getElementById('typing-game-container').classList.add('hidden');
    document.getElementById('shortcut-game-container').classList.remove('hidden');
    
    currentShortcutIndex = 0; shortcutScore = 0;
    document.getElementById('shortcut-score').innerText = shortcutScore;
    
    // Render Virtual Keyboard secara dinamis
    const kbContainer = document.getElementById('shortcut-keyboard');
    if(kbContainer) {
        kbContainer.innerHTML = `
            <div class="flex justify-center gap-1 mb-1"><kbd class="key" data-key="Q">Q</kbd><kbd class="key" data-key="W">W</kbd><kbd class="key" data-key="E">E</kbd><kbd class="key" data-key="R">R</kbd><kbd class="key" data-key="T">T</kbd><kbd class="key" data-key="Y">Y</kbd><kbd class="key" data-key="U">U</kbd><kbd class="key" data-key="I">I</kbd><kbd class="key" data-key="O">O</kbd><kbd class="key" data-key="P">P</kbd></div>
            <div class="flex justify-center gap-1 mb-1"><kbd class="key" data-key="A">A</kbd><kbd class="key" data-key="S">S</kbd><kbd class="key" data-key="D">D</kbd><kbd class="key" data-key="F">F</kbd><kbd class="key" data-key="G">G</kbd><kbd class="key" data-key="H">H</kbd><kbd class="key" data-key="J">J</kbd><kbd class="key" data-key="K">K</kbd><kbd class="key" data-key="L">L</kbd></div>
            <div class="flex justify-center gap-1 mb-1"><kbd class="key" data-key="Z">Z</kbd><kbd class="key" data-key="X">X</kbd><kbd class="key" data-key="C">C</kbd><kbd class="key" data-key="V">V</kbd><kbd class="key" data-key="B">B</kbd><kbd class="key" data-key="N">N</kbd><kbd class="key" data-key="M">M</kbd></div>
            <div class="flex justify-center gap-1"><kbd class="key w-16" data-key="Ctrl">Ctrl</kbd><kbd class="key w-12" data-key="Alt">Alt</kbd><kbd class="key w-32" data-key="Space">Space</kbd><kbd class="key w-14" data-key="Shift">Shift</kbd><kbd class="key w-16" data-key="Enter">Enter</kbd></div>
        `;
        
        // Event listener untuk keyboard
        document.querySelectorAll('#shortcut-keyboard .key').forEach(key => {
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
    }

    loadShortcutQuestion();
}

function loadShortcutQuestion() {
    if (currentShortcutIndex >= shortcutData.length) {
        document.getElementById('shortcut-question').innerText = "Selesai! 🎉";
        document.getElementById('shortcut-feedback').innerHTML = `<span class="text-emerald-600">Skor Game: ${shortcutScore}</span>`;
        addGlobalScore(shortcutScore); 
        return;
    }
    var currentQ = shortcutData[currentShortcutIndex];
    document.getElementById('shortcut-question').innerText = currentQ.question;
    document.getElementById('shortcut-q-count').innerText = (currentShortcutIndex + 1) + "/" + shortcutData.length;
    document.getElementById('shortcut-feedback').innerHTML = "";
    userKeysPressed = [];
    document.querySelectorAll('#shortcut-keyboard .key').forEach(k => k.classList.remove('pressed'));
}


// 2. KUIS MATERI INTERAKTIF
const quizData = [
    { type: "multiple", question: "Apa ekstensi file Microsoft Word yang bisa diedit?", options: [".pdf", ".docx", ".exe", ".jpg"], correct: 1 },
    { type: "typing", question: "Ketikkan rumus Excel untuk menjumlahkan A1 sampai A5", answer: "=sum(a1:a5)" },
    { type: "multiple", question: "Fitur untuk mengunci baris di Excel disebut...", options: ["Freeze Panes", "Lock Cell", "Protect Sheet", "Merge"], correct: 0 },
    { type: "typing", question: "Apa nama menu yang berisi ikon Home, Insert, Design di Word?", answer: "ribbon" },
    { type: "multiple", question: "Fitur di Google Docs untuk merevisi tanpa menghapus teks asli adalah...", options: ["Editing", "Suggestion", "Viewing", "Sharing"], correct: 1 },
    { type: "multiple", question: "Fungsi Excel untuk mencari nilai rata-rata adalah...", options: ["SUM", "MAX", "MIN", "AVERAGE"], correct: 3 },
    { type: "typing", question: "Shortcut keyboard untuk menyimpan dokumen adalah...", answer: "ctrl+s" },
    { type: "multiple", question: "Efek perpindahan antar slide di PowerPoint disebut...", options: ["Animation", "Transition", "Motion Path", "Slide Master"], correct: 1 },
    { type: "multiple", question: "Aplikasi Google yang digunakan untuk membuat spreadsheet adalah...", options: ["Google Docs", "Google Slides", "Google Sheets", "Google Drive"], correct: 2 },
    { type: "typing", question: "Ketikkan rumus Excel untuk mencari nilai tertinggi dari A1 sampai A10", answer: "=max(a1:a10)" }
];
let currentQuizIndex = 0; let quizScore = 0;

function startMateriQuiz() {
    document.body.classList.add('hide-nav');
    document.getElementById('arena-menu').classList.add('hidden');
    document.getElementById('shortcut-game-container').classList.add('hidden');
    document.getElementById('typing-game-container').classList.add('hidden');
    document.getElementById('quiz-game-container').classList.remove('hidden');
    
    currentQuizIndex = 0; quizScore = 0;
    document.getElementById('quiz-score').innerText = quizScore;
    loadQuizQuestion();
}

function loadQuizQuestion() {
    if (currentQuizIndex >= quizData.length) {
        document.getElementById('quiz-content').innerHTML = `
            <div class="text-center py-10">
                <i class="fa-solid fa-trophy text-6xl text-amber-500 mb-4 animate-bounce"></i>
                <h3 class="text-2xl font-bold text-slate-800 mb-2">Kuis Selesai!</h3>
                <p class="text-slate-600 mb-6">Skor yang Anda dapatkan: <b class="text-emerald-600 text-xl">${quizScore}</b></p>
            </div>
        `;
        document.getElementById('quiz-q-count').innerText = `${quizData.length}/${quizData.length}`;
        addGlobalScore(quizScore); 
        return;
    }

    const q = quizData[currentQuizIndex];
    document.getElementById('quiz-q-count').innerText = `${currentQuizIndex + 1}/${quizData.length}`;
    
    let html = `<p class="text-sm font-bold text-sky-500 mb-2 uppercase">Soal ${currentQuizIndex + 1}</p>
                <h3 class="text-lg font-bold text-slate-800 mb-6">${q.question}</h3>`;

    if (q.type === "multiple") {
        html += `<div class="space-y-3" id="quiz-options">`;
        q.options.forEach((opt, idx) => {
            html += `<button onclick="checkQuizMultiple(${idx}, ${q.correct})" class="w-full text-left p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition font-medium text-slate-700">${opt}</button>`;
        });
        html += `</div>`;
    } else if (q.type === "typing") {
        html += `
            <div class="flex flex-col gap-3">
                <input type="text" id="quiz-input" class="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-lg" placeholder="Ketik jawaban..." onkeypress="if(event.key==='Enter') checkQuizTyping()">
                <button onclick="checkQuizTyping()" class="bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-bold transition">Kirim Jawaban</button>
            </div>
        `;
    }

    html += `<div id="quiz-feedback" class="mt-4 text-sm font-bold hidden"></div>`;
    document.getElementById('quiz-content').innerHTML = html;
}

function checkQuizMultiple(selected, correct) {
    const buttons = document.getElementById('quiz-options').querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
    const feedback = document.getElementById('quiz-feedback');

    if (selected === correct) {
        buttons[selected].classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-800');
        feedback.innerHTML = '<span class="text-emerald-600"><i class="fa-solid fa-check-circle"></i> Benar! +20 Poin</span>';
        quizScore += 20;
        if(typeof confetti === 'function') confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } else {
        buttons[selected].classList.add('bg-rose-100', 'border-rose-500', 'text-rose-800');
        buttons[correct].classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-800');
        feedback.innerHTML = '<span class="text-rose-600"><i class="fa-solid fa-times-circle"></i> Salah.</span>';
    }
    
    document.getElementById('quiz-score').innerText = quizScore;
    feedback.classList.remove('hidden');
    
    currentQuizIndex++;
    setTimeout(loadQuizQuestion, 1500);
}

function checkQuizTyping() {
    const input = document.getElementById('quiz-input').value.trim().toLowerCase();
    const correct = quizData[currentQuizIndex].answer.toLowerCase();
    const feedback = document.getElementById('quiz-feedback');
    
    document.getElementById('quiz-input').disabled = true;
    const btn = document.querySelector('button[onclick="checkQuizTyping()"]');
    if(btn) btn.disabled = true;

    const cleanInput = input.replace(/\s+/g, '');
    const cleanCorrect = correct.replace(/\s+/g, '');

    if (cleanInput === cleanCorrect) {
        feedback.innerHTML = '<span class="text-emerald-600"><i class="fa-solid fa-check-circle"></i> Benar! +20 Poin</span>';
        quizScore += 20;
        if(typeof confetti === 'function') confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } else {
        feedback.innerHTML = `<span class="text-rose-600"><i class="fa-solid fa-times-circle"></i> Salah. Jawaban yang benar: <b>${quizData[currentQuizIndex].answer}</b></span>`;
    }
    
    document.getElementById('quiz-score').innerText = quizScore;
    feedback.classList.remove('hidden');
    
    currentQuizIndex++;
    setTimeout(loadQuizQuestion, 2500); 
}

// 3. FUNGSI GLOBAL ARENA
function closeGame() {
    document.body.classList.remove('hide-nav');
    document.getElementById('arena-menu').classList.remove('hidden');
    document.getElementById('shortcut-game-container').classList.add('hidden');
    document.getElementById('quiz-game-container').classList.add('hidden');
    document.getElementById('typing-game-container').classList.add('hidden');
}

function addGlobalScore(points) {
    if(points <= 0) return;
    
    let currentScore = parseInt(localStorage.getItem("student_score")) || 0;
    let newScore = currentScore + points;
    localStorage.setItem("student_score", newScore);
    
    if(document.getElementById('dash-score')) document.getElementById('dash-score').innerText = newScore;
    
    const name = localStorage.getItem("student_name");
    const cls = localStorage.getItem("student_class");
    if (typeof window.syncScoreToDatabase === 'function' && name) {
        window.syncScoreToDatabase(name, cls, newScore);
    }
    
    if(typeof confetti === 'function') confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    alert(`🎉 Selamat! Anda mendapatkan tambahan ${points} poin.`);
}
