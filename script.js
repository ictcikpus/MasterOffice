const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function initAudio() { if (!audioCtx) audioCtx = new AudioContext(); }

function playSound(type) {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
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
const QUESTIONS_PER_SESSION = 5;

// Data Siswa
let studentName = "";
let studentClass = "";

document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            modulesData = data.modules;
            renderModules();
        });
});

function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

// --- FUNGSI LOGIN IDENTITAS ---
function masukSistem() {
    playSound('click');
    const nameInput = document.getElementById('input-name').value;
    const classInput = document.getElementById('input-class').value;

    if (nameInput.trim() === "" || classInput.trim() === "") {
        alert("Mohon isi Nama Lengkap dan Kelas Anda terlebih dahulu!");
        return;
    }

    studentName = nameInput.trim();
    studentClass = classInput.trim();
    
    document.getElementById('user-status').innerHTML = `<i class="fa-solid fa-user"></i> ${studentName} (${studentClass})`;
    switchView('dashboard');
}

// --- FUNGSI MENU ---
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
    document.getElementById('module-title-display').textContent = mod.name.toUpperCase();
    
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';
    
    mod.levels.forEach((lvl) => {
        const card = document.createElement('div');
        card.className = 'level-card';
        card.style.setProperty('--card-color', mod.color);
        card.innerHTML = `<div class="level-tag">LEVEL ${lvl.id}</div><h3 style="margin-top:20px;">${lvl.name}</h3><p style="color: #94a3b8; font-size:0.85rem; margin-top:10px;">${lvl.desc}</p>`;
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
    document.getElementById('materi-icon').className = `${currentModule.icon} fa-2x`;
    document.getElementById('materi-icon').style.color = currentModule.color;
    document.getElementById('materi-text').innerHTML = level.material;
    document.getElementById('materi-panel').scrollTop = 0;
    switchView('reader');
}

function showDashboard() { playSound('click'); switchView('dashboard'); }
function goBackToLevels() { playSound('click'); switchView('level-selection'); }

// --- SISTEM KUIS ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    playSound('click');
    score = 0;
    currentQIndex = 0;
    document.getElementById('live-score').textContent = score;
    
    let bankSoal = [...currentLevelData.quizBank];
    bankSoal = shuffleArray(bankSoal); 
    let totalQ = Math.min(QUESTIONS_PER_SESSION, bankSoal.length);
    activeQuestions = bankSoal.slice(0, totalQ);
    
    document.getElementById('total-q-num').textContent = totalQ;
    renderQuestion();
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
        playSound('correct'); btnElement.classList.add('correct');
        score += (100 / activeQuestions.length); 
        document.getElementById('live-score').textContent = Math.round(score);
    } else {
        playSound('wrong'); btnElement.classList.add('wrong');
        allBtns[correctIndex].classList.add('correct'); 
    }
    
    setTimeout(() => {
        currentQIndex++;
        if (currentQIndex < activeQuestions.length) renderQuestion();
        else finishQuiz();
    }, 2000); 
}

function finishQuiz() {
    playSound('win');
    let finalScore = Math.round(score);
    document.getElementById('final-score').textContent = finalScore;
    
    const btnDownload = document.getElementById('btn-download-cert');
    // Hanya munculkan tombol sertifikat jika nilai tuntas (>= 70)
    if(finalScore >= 70) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        btnDownload.style.display = "block";
    } else {
        btnDownload.style.display = "none";
    }
    
    switchView('result-area');
}

// --- FUNGSI GENERATE SERTIFIKAT A4 ---
function downloadCertificate() {
    playSound('click');
    
    // 1. Masukkan data ke template HTML
    document.getElementById('cert-name').textContent = studentName;
    document.getElementById('cert-class').textContent = studentClass;
    document.getElementById('cert-module').textContent = currentModule.name + " - Level " + currentLevelData.id + " (" + currentLevelData.name + ")";
    
    let finalScore = Math.round(score);
    let predikat = "KOMPETEN";
    if(finalScore >= 90) predikat = "SANGAT MEMUASKAN";
    else if(finalScore >= 80) predikat = "MEMUASKAN";
    
    document.getElementById('cert-predikat').textContent = predikat;
    
    // 2. Munculkan elemen sebentar untuk ditangkap PDF
    const element = document.getElementById('certificate-template');
    element.style.display = 'block';

    // 3. Konfigurasi Kertas A4 (Landscape)
    const opt = {
        margin:       0,
        filename:     `Sertifikat_${studentName}_${currentModule.id}_Lvl${currentLevelData.id}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    // 4. Render dan Download
    html2pdf().set(opt).from(element.querySelector('.cert-container')).save().then(() => {
        // Sembunyikan kembali setelah proses download selesai
        element.style.display = 'none';
    });
}
