// Konteks Audio untuk efek suara sintesis (tanpa file mp3)
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
}

// Fungsi menghasilkan efek suara
function playSound(type) {
    initAudio();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'hover') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(500, audioCtx.currentTime); // Nada rendah
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Volume kecil
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'click') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1); // Nada naik
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.15);
    } else if (type === 'success') {
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    }
}

let officeData = [];

// Fetch data dari JSON
document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            officeData = data.materi;
            renderMenu();
        })
        .catch(error => console.error('Error memuat data:', error));
});

function renderMenu() {
    const mainMenu = document.getElementById('main-menu');
    mainMenu.innerHTML = ''; // Kosongkan dulu

    officeData.forEach(modul => {
        const btn = document.createElement('div');
        btn.className = 'module-btn';
        btn.style.borderColor = modul.color;
        btn.innerHTML = `
            <div class="icon">${modul.icon}</div>
            <h3 style="color: ${modul.color}">${modul.title}</h3>
        `;
        
        // Event Listeners untuk suara dan interaksi
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
}

function goBack() {
    playSound('click');
    document.getElementById('content-area').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
}

function finishReading() {
    playSound('success');
    
    // Tembakkan Confetti (Visual Effect)
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2b579a', '#217346', '#d24726', '#ffe259']
    });

    // Simulasi beralih ke soal
    setTimeout(() => {
        alert("Hebat! Kamu telah menyelesaikan materi ini. Sekarang kamu siap untuk menjawab soal kuis!");
        // Di sini Anda bisa mengarahkan ke halaman kuis Anda, misalnya:
        // window.location.href = "kuis.html";
        goBack();
    }, 2000);
}
