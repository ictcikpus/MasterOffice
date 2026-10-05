// Konfigurasi Audio Synthesizer
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function initAudio() { if (!audioCtx) audioCtx = new AudioContext(); }

function playSound(type) {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    
    if (type === 'click') {
        osc.type = 'square'; osc.frequency.setValueAtTime(300, now); osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
    } else if (type === 'correct') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(600, now); osc.frequency.setValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, now); osc.frequency.setValueAtTime(150, now + 0.2);
        gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'win') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now); osc.frequency.setValueAtTime(554, now+0.1); osc.frequency.setValueAtTime(659, now+0.2);
        gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.6);
        osc.start(now); osc.stop(now + 0.6);
    }
}

// State Aplikasi
let modulesData = [];
let currentModule = null;
let currentLevelData = null;
let activeQuestions = [];
let currentQIndex = 0;
let score = 0;
const QUESTIONS_PER_SESSION = 5; // Mengambil 5 soal acak setiap main

// Fetch data
document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            modulesData = data.modules;
            renderModules();
        })
        .catch(err => console.error('Error muat data:', err));
});

// Fungsi Pindah Layar
function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

// Render Menu Utama
function renderModules() {
    const grid = document.getElementById('module-grid');
    grid.innerHTML = '';
    modulesData.forEach((mod) => {
        const card = document.createElement('div');
        card.className = 'level-card';
        card.style.setProperty('--card-color', mod.color);
        card.innerHTML = `
            <i class="${mod.icon} card-icon"></i>
            <h3>${mod.name}</h3>
            <p style="color: #94a3b8;">Terdiri dari ${mod.levels.length} Level</p>
        `;
        card.onclick = () => { playSound('click'); openModule(mod); };
        grid.appendChild(card);
    });
}

function openModule(mod) {
    currentModule = mod;
    document.documentElement.style.setProperty('--active-color', mod.color);
    document.documentElement.style.setProperty('--active-glow', `rgba(${mod.colorRGB}, 0.5)`);
    document.getElementById('module-title-display').textContent = mod.name.toUpperCase();
    
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';
    
    mod.levels.forEach((lvl) => {
        const card = document.createElement('div');
        card.className = 'level-card';
        card.style.setProperty('--card-color', mod.color);
        card.innerHTML = `
            <div class="level-tag">LEVEL ${lvl.id}</div>
            <h3 style="margin-top:20px;">${lvl.name}</h3>
            <p style="color: #94a3b8; font-size:0.85rem; margin-top:10px;">${lvl.desc}</p>
        `;
        card.onclick = () => { playSound('click'); openMaterial(lvl); };
        grid.appendChild(card);
    });
    switchView('level-selection');
}

function openMaterial(level) {
    currentLevelData = level;
    document.getElementById('level-badge').textContent = `LEVEL ${level.id}`;
    document.getElementById('materi-title').textContent = level.name;
    document.getElementById('materi-title').style.color = currentModule.color;
    
    const icon = document.getElementById('materi-icon');
    icon.className = `${currentModule.icon} fa-2x`;
    icon.style.color = currentModule.color;
    
    document.getElementById('materi-text').innerHTML = level.material;
    document.getElementById('materi-panel').scrollTop = 0;
    
    switchView('reader');
}

function showDashboard() { playSound('click'); switchView('dashboard'); }
function goBackToLevels() { playSound('click'); switchView('level-selection'); }

// --- SISTEM KUIS & PENGACAKAN ---

// Algoritma Fisher-Yates untuk acak array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    playSound('click');
    
    // Validasi Keamanan jika data belum ada
    if (!currentLevelData || !currentLevelData.quizBank || currentLevelData.quizBank.length === 0) {
        alert("Sistem Error: Bank Soal belum tersedia!"); return;
    }

    score = 0;
    currentQIndex = 0;
    document.getElementById('live-score').textContent = score;
    
    // Copy, Acak, dan Ambil 5 Soal
    let bankSoal = [...currentLevelData.quizBank];
    bankSoal = shuffleArray(bankSoal); 
    
    let totalQ = Math.min(QUESTIONS_PER_SESSION, bankSoal.length);
    activeQuestions = bankSoal.slice(0, totalQ);
    
    document.getElementById('total-q-num').textContent = totalQ;
    renderQuestion();
    
    // PINDAH LAYAR KE KUIS
    switchView('quiz-area');
}

function renderQuestion() {
    const q = activeQuestions[currentQIndex];
    document.getElementById('current-q-num').textContent = currentQIndex + 1;
    document.getElementById('question-text').innerHTML = q.question;
    
    const optionsGrid = document.getElementById('options-container');
    optionsGrid.innerHTML = '';
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span style="color:var(--active-color); font-weight:800;">${String.fromCharCode(65 + index)}.</span> ${opt}`;
        btn.onclick = () => checkAnswer(index, btn);
        optionsGrid.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, btnElement) {
    const correctIndex = activeQuestions[currentQIndex].answer;
    const allBtns = document.querySelectorAll('.option-btn');
    
    allBtns.forEach(btn => btn.disabled = true); 
    
    if (selectedIndex === correctIndex) {
        playSound('correct');
        btnElement.classList.add('correct');
        score += (100 / activeQuestions.length); 
        document.getElementById('live-score').textContent = Math.round(score);
    } else {
        playSound('wrong');
        btnElement.classList.add('wrong');
        allBtns[correctIndex].classList.add('correct'); // Tunjukkan yg benar
    }
    
    setTimeout(() => {
        currentQIndex++;
        if (currentQIndex < activeQuestions.length) {
            renderQuestion();
        } else {
            finishQuiz();
        }
    }, 2000); // Jeda 2 detik sebelum lanjut soal
}

function finishQuiz() {
    playSound('win');
    document.getElementById('final-score').textContent = Math.round(score);
    
    if(score >= 70) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
    
    switchView('result-area');
}
