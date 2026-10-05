// Web Audio API Setup
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) audioCtx = new AudioContext();
}

function playSound(type) {
    initAudio();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'hover') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
        oscillator.start(); 
        oscillator.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'click') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start(); 
        oscillator.stop(audioCtx.currentTime + 0.15);
    } else if (type === 'success') {
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
        oscillator.start(); 
        oscillator.stop(audioCtx.currentTime + 0.6);
    }
}

// Fetch dan Render Data
document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderMenu(data.materi);
        })
        .catch(error => console.error('Error memuat data:', error));
});

function renderMenu(officeData) {
    const mainMenu = document.getElementById('main-menu');
    mainMenu.innerHTML = '';
    
    officeData.forEach((modul, index) => {
        const btn = document.createElement('div');
        btn.className = 'module-btn';
        btn.style.animation = `bounceIn ${0.5 + (index * 0.2)}s ease-out`;
        btn.style.borderColor = modul.color;
        btn.innerHTML = `
            <div class="icon">${modul.icon}</div>
            <h3 style="color: ${modul.color}">${modul.title}</h3>
        `;
        
        btn.onmouseenter = () => playSound('hover');
        btn.onclick = () => { 
            playSound('click'); 
            openMateri(modul); 
        };
        
        mainMenu.appendChild(btn);
    });
}

function openMateri(modul) {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('content-area').classList.remove('hidden');
    
    const titleEl = document.getElementById('materi-title');
    const textEl = document.getElementById('materi-text');
    const cardEl = document.getElementById('materi-display');
    
    titleEl.innerHTML = `${modul.icon} ${modul.title}`;
    titleEl.style.color = modul.color;
    textEl.innerHTML = modul.content;
    cardEl.style.borderColor = modul.color;
    
    // Reset animasi agar jalan ulang setiap diklik
    cardEl.style.animation = 'none';
    cardEl.offsetHeight; 
    cardEl.style.animation = 'slideIn 0.5s forwards';
}

function goBack() {
    playSound('click');
    document.getElementById('content-area').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
}

function finishReading() {
    playSound('success');
    
    confetti({ 
        particleCount: 200, 
        spread: 100, 
        origin: { y: 0.6 }, 
        colors: ['#2e86de', '#10ac84', '#ee5253', '#feca57'] 
    });
    
    setTimeout(() => {
        alert("Luar biasa! Kamu sudah membaca mantra dan jurusnya. Waktunya mengerjakan kuis!");
        // Arahkan ke link kuis/bank soal yang sebenarnya di sini:
        // window.location.href = "halaman-kuis.html";
        goBack();
    }, 2500);
}
