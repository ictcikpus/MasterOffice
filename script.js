// AUDIO SYSTEM
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() { if (!audioCtx) audioCtx = new AudioContext(); }

function playSound(type) {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    
    if (type === 'hover') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.05);
    } else if (type === 'click') {
        osc.type = 'square'; osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'correct') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start(); osc.stop(audioCtx.currentTime + 0.5);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'win') {
        osc.type = 'square';
        [400, 500, 600, 800, 1200].forEach((freq, i) => {
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + (i*0.1));
        });
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
        osc.start(); osc.stop(audioCtx.currentTime + 1);
    }
}

// GLOBAL VARIABLES
let db = { materi: [], soal: [] };
let currentUser = { name: '', class: '' };
let currentModul = null;
let quizPool = [];
let currentQIndex = 0;
let score = 0;
let timerInterval;
const QUESTIONS_PER_SESSION = 15; // Set how many questions per module

// UTILS
const switchScreen = (hideId, showId) => {
    document.getElementById(hideId).classList.replace('active-screen', 'hidden-screen');
    document.getElementById(showId).classList.replace('hidden-screen', 'active-screen');
};
const attachHoverSound = () => {
    document.querySelectorAll('button, .level-card, .option-btn').forEach(el => {
        el.addEventListener('mouseenter', () => playSound('hover'));
    });
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(res => res.json())
        .then(data => { db = data; attachHoverSound(); })
        .catch(err => alert("Gagal memuat database! Pastikan menggunakan Live Server."));
        
    document.getElementById('btn-login').addEventListener('click', handleLogin);
});

function handleLogin() {
    const nama = document.getElementById('player-name').value.trim();
    const kelas = document.getElementById('player-class').value.trim();
    if(!nama || !kelas) { alert("Akses Ditolak: Masukkan Nama dan Kelas."); return; }
    
    playSound('click');
    currentUser = { name: nama, class: kelas };
    document.getElementById('display-name').innerText = nama.toUpperCase();
    document.getElementById('display-class').innerText = kelas.toUpperCase();
    
    renderDashboard();
    switchScreen('login-section', 'dashboard-section');
}

function renderDashboard() {
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';
    
    db.materi.forEach(modul => {
        const card = document.createElement('div');
        card.className = 'level-card';
        card.style.borderColor = modul.color;
        card.innerHTML = `
            <div class="level-icon" style="color: ${modul.color};">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="${modul.icon}"/></svg>
            </div>
            <h3 style="color: ${modul.color}; margin-bottom: 10px;">${modul.title.split(' ')[1]}</h3>
            <p class="text-muted text-sm">Status: <span style="color:#fff">BELUM SELESAI</span></p>
        `;
        card.onclick = () => { playSound('click'); openMateri(modul); };
        card.onmouseenter = () => playSound('hover');
        grid.appendChild(card);
    });
}

function openMateri(modul) {
    currentModul = modul;
    document.getElementById('materi-title').innerText = modul.title;
    document.getElementById('materi-title').style.color = modul.color;
    document.getElementById('materi-icon-path').setAttribute('d', modul.icon);
    document.getElementById('materi-icon-svg').style.color = modul.color;
    document.getElementById('materi-content').innerHTML = modul.content;
    
    switchScreen('dashboard-section', 'materi-section');
}

document.getElementById('btn-back-materi').onclick = () => {
    playSound('click');
    switchScreen('materi-section', 'dashboard-section');
};

document.getElementById('btn-start-quiz').onclick = () => {
    playSound('click');
    startQuiz();
};

// QUIZ ENGINE
function startQuiz() {
    // Filter questions by module and SHUFFLE them for uniqueness
    let allModulQs = db.soal.filter(q => q.modul === currentModul.id);
    allModulQs.sort(() => Math.random() - 0.5); 
    
    // Pick N questions
    quizPool = allModulQs.slice(0, QUESTIONS_PER_SESSION);
    
    if(quizPool.length === 0) {
        alert("Sistem mendeteksi bank soal kosong untuk modul ini."); return;
    }
    
    currentQIndex = 0;
    score = 0;
    switchScreen('materi-section', 'quiz-section');
    loadQuestion();
}

function loadQuestion() {
    if(currentQIndex >= quizPool.length) {
        endQuiz(); return;
    }
    
    const qData = quizPool[currentQIndex];
    document.getElementById('q-current').innerText = currentQIndex + 1;
    document.getElementById('q-total').innerText = quizPool.length;
    document.getElementById('question-text').innerText = qData.question;
    
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    // Shuffle options again
    let options = [...qData.options];
    options.sort(() => Math.random() - 0.5);
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onmouseenter = () => playSound('hover');
        btn.onclick = () => handleAnswer(btn, opt, qData.answer);
        container.appendChild(btn);
    });
}

function handleAnswer(btn, selected, correct) {
    // Disable all buttons
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(b => b.disabled = true);
    
    if(selected === correct) {
        playSound('correct');
        btn.classList.add('correct');
        score += (100 / quizPool.length);
    } else {
        playSound('wrong');
        btn.classList.add('wrong');
        // Highlight correct
        buttons.forEach(b => {
            if(b.innerText === correct) b.classList.add('correct');
        });
    }
    
    setTimeout(() => {
        currentQIndex++;
        loadQuestion();
    }, 1500);
}

function endQuiz() {
    playSound('win');
    switchScreen('quiz-section', 'result-section');
    
    const finalScore = Math.round(score);
    document.getElementById('final-score').innerText = finalScore;
    
    let rank = 'C'; let msg = "Perlu banyak berlatih agen!";
    if(finalScore >= 90) { rank = 'S'; msg = "Sempurna! Penguasaan materi kelas dunia."; }
    else if(finalScore >= 75) { rank = 'A'; msg = "Sangat Baik! Anda siap beroperasi."; }
    else if(finalScore >= 60) { rank = 'B'; msg = "Cukup baik, tapi masih perlu perbaikan."; }
    
    document.getElementById('result-rank').innerText = `RANK: ${rank}`;
    document.getElementById('result-message').innerText = msg;
    
    confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 }, zIndex: 9999, colors: ['#66fcf1', '#45a29e', '#fff'] });
}

document.getElementById('btn-back-home').onclick = () => {
    playSound('click');
    switchScreen('result-section', 'dashboard-section');
};
