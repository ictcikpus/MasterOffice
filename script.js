// Web Audio API untuk Efek Suara Profesional (Sci-Fi / UI Modern)
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
    
    const now = audioCtx.currentTime;
    
    if (type === 'hover') {
        // Suara 'Tick' UI modern yang sangat singkat
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, now);
        gainNode.gain.setValueAtTime(0.01, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        oscillator.start(now); 
        oscillator.stop(now + 0.05);
    } else if (type === 'click') {
        // Suara konfirmasi sistem yang dalam
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.exponentialRampToValueAtTime(40, now + 0.1);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
        oscillator.start(now); 
        oscillator.stop(now + 0.1);
    } else if (type === 'success') {
        // Suara "Level Complete" / Sistem Unlocked (Arpeggio cepat)
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, now); // A4
        oscillator.frequency.setValueAtTime(554.37, now + 0.1); // C#5
        oscillator.frequency.setValueAtTime(659.25, now + 0.2); // E5
        oscillator.frequency.setValueAtTime(880, now + 0.3); // A5
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        oscillator.start(now); 
        oscillator.stop(now + 0.8);
    }
}

// Global Variables
let currentData = [];

// Fetch data saat DOM ter-load
document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            currentData = data.materi;
            renderDashboard(currentData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('level-grid').innerHTML = 
                "<p style='color:red;'>SYSTEM ERROR: Gagal memuat data sumber (Pastikan berjalan di server/GitHub Pages).</p>";
        });
});

function renderDashboard(data) {
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';
    
    data.forEach((modul) => {
        const card = document.createElement('div');
        card.className = 'level-card';
        // Set CSS Variables dinamis untuk efek hover & glow
        card.style.setProperty('--card-color', modul.color);
        card.style.setProperty('--card-glow', modul.glow);
        
        card.innerHTML = `
            <div class="level-tag">${modul.level}</div>
            <i class="${modul.icon} card-icon"></i>
            <h3>${modul.title}</h3>
            <p style="font-size: 0.9rem; color: #94a3b8;">${modul.desc}</p>
        `;
        
        card.onmouseenter = () => playSound('hover');
        card.onclick = () => { 
            playSound('click'); 
            openReader(modul); 
        };
        
        grid.appendChild(card);
    });
}

function openReader(modul) {
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('reader').classList.add('active');
    
    // Set root variables untuk panel aktif
    document.documentElement.style.setProperty('--active-color', modul.color);
    document.documentElement.style.setProperty('--active-glow', modul.glow);
    
    // Update Konten UI
    document.getElementById('level-indicator').textContent = modul.level;
    document.getElementById('materi-title').textContent = modul.title;
    document.getElementById('materi-title').style.color = modul.color;
    
    const iconEl = document.getElementById('materi-icon');
    iconEl.className = `${modul.icon} fa-2x`;
    iconEl.style.color = modul.color;
    
    document.getElementById('materi-text').innerHTML = modul.content;
    
    // Scroll text to top
    document.getElementById('materi-panel').scrollTop = 0;
}

function goBack() {
    playSound('click');
    document.getElementById('reader').classList.remove('active');
    document.getElementById('dashboard').classList.add('active');
}

function finishReading() {
    playSound('success');
    
    // Profesional Confetti (Warna Emas & Putih)
    const count = 200;
    const defaults = { origin: { y: 0.7 }, colors: ['#ffd700', '#ffffff', '#c0c0c0'] };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    setTimeout(() => {
        // Custom Alert UI atau native prompt
        alert("SISTEM: Modul selesai dipelajari. Mengarahkan ke Server Kuis...");
        
        // --- Integrasikan dengan sistem kuis Anda di baris ini ---
        // window.location.href = "kuis_level_1.html"; 
        goBack(); 
    }, 3000);
}
