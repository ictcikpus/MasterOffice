// ==========================================
// TYPING GAME 10 JARI (Responsive UI)
// ==========================================

const typingTexts = [
    "Selamat datang di Master Office. Latihan ini akan melatih kecepatan jari Anda dalam menggunakan keyboard.",
    "Microsoft Excel sangat berguna untuk mengolah data numerik seperti penjumlahan rata rata dan grafik.",
    "Google Workspace memungkinkan kita bekerja secara kolaboratif di cloud tanpa perlu menginstal aplikasi.",
    "Teknologi informasi adalah pondasi utama dalam perkembangan dunia digital saat ini.",
    "Belajar mengetik dengan sepuluh jari akan meningkatkan produktivitas kerja Anda secara signifikan."
];

let typingTargetText = "";
let typingTimer = null;
let typingTimeLeft = 60;
let typingErrors = 0;
let typingTotalTyped = 0;
let typingIsPlaying = false;

function startTypingGame() {
    document.body.classList.add('hide-nav');
    const arenaMenu = document.getElementById('arena-menu');
    const shortcutContainer = document.getElementById('shortcut-game-container');
    const quizContainer = document.getElementById('quiz-game-container');
    const typingContainer = document.getElementById('typing-game-container');
    
    if(arenaMenu) arenaMenu.classList.add('hidden');
    if(shortcutContainer) shortcutContainer.classList.add('hidden');
    if(quizContainer) quizContainer.classList.add('hidden');
    if(typingContainer) typingContainer.classList.remove('hidden');

    typingTargetText = typingTexts[Math.floor(Math.random() * typingTexts.length)];
    typingTimeLeft = 60;
    typingErrors = 0;
    typingTotalTyped = 0;
    typingIsPlaying = true;
    
    const inputEl = document.getElementById('typing-input');
    if(!inputEl) return;
    
    inputEl.value = "";
    inputEl.disabled = false;
    
    const display = document.getElementById('typing-text-display');
    if(display) {
        display.innerHTML = "";
        typingTargetText.split("").forEach((char, index) => {
            const span = document.createElement('span');
            span.innerText = char;
            span.id = `char-${index}`;
            span.className = "text-slate-500";
            display.appendChild(span);
        });
    }

    const timeEl = document.getElementById('typing-time');
    const wpmEl = document.getElementById('typing-wpm');
    const accEl = document.getElementById('typing-acc');
    
    if(timeEl) timeEl.innerText = `${typingTimeLeft}s`;
    if(wpmEl) wpmEl.innerText = "0";
    if(accEl) accEl.innerText = "100%";
    
    inputEl.focus();
    
    clearInterval(typingTimer);
    typingTimer = setInterval(() => {
        typingTimeLeft--;
        if(timeEl) timeEl.innerText = `${typingTimeLeft}s`;
        
        if (typingTimeLeft <= 0) {
            endTypingGame();
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    const inputEl = document.getElementById('typing-input');
    if(inputEl) {
        inputEl.addEventListener('input', (e) => {
            if (!typingIsPlaying) return;
            
            const typedText = e.target.value;
            typingTotalTyped = typedText.length;
            
            typingErrors = 0;
            for (let i = 0; i < typedText.length; i++) {
                const charSpan = document.getElementById(`char-${i}`);
                if (charSpan) {
                    if (typedText[i] === typingTargetText[i]) {
                        charSpan.className = "text-emerald-500 font-bold";
                    } else {
                        charSpan.className = "text-rose-500 bg-rose-100 font-bold rounded-sm";
                        typingErrors++;
                    }
                }
            }
            
            if (typedText.length < typingTargetText.length) {
                const nextChar = document.getElementById(`char-${typedText.length}`);
                if (nextChar) nextChar.className = "text-slate-800 font-bold bg-yellow-200 rounded-sm animate-pulse";
            }

            const accuracy = typedText.length > 0 ? Math.round(((typedText.length - typingErrors) / typedText.length) * 100) : 100;
            const accEl = document.getElementById('typing-acc');
            if(accEl) accEl.innerText = `${accuracy}%`;
            
            const timeElapsedMins = (60 - typingTimeLeft) / 60;
            if (timeElapsedMins > 0.05) {
                const wpm = Math.round((typedText.length / 5) / timeElapsedMins);
                const wpmEl = document.getElementById('typing-wpm');
                if(wpmEl) wpmEl.innerText = wpm;
            }

            if (typedText === typingTargetText) {
                endTypingGame(true);
            }
        });
    }

    document.querySelectorAll('#typing-game-container .key').forEach(key => {
        key.addEventListener('click', (e) => {
            if (!typingIsPlaying) return;
            const keyValue = e.target.getAttribute('data-key');
            const inputEl2 = document.getElementById('typing-input');
            if(!inputEl2) return;
            
            if (keyValue === "Backspace") {
                inputEl2.value = inputEl2.value.slice(0, -1);
            } else if (keyValue === " " || keyValue === "Space") {
                inputEl2.value += " ";
            } else if (keyValue.length === 1) {
                inputEl2.value += keyValue.toLowerCase(); 
            }
            
            inputEl2.dispatchEvent(new Event('input'));
            inputEl2.focus();
        });
    });
});

function endTypingGame(isFinished = false) {
    typingIsPlaying = false;
    clearInterval(typingTimer);
    const inputEl = document.getElementById('typing-input');
    if(inputEl) inputEl.disabled = true;
    
    const finalWpm = parseInt(document.getElementById('typing-wpm')?.innerText) || 0;
    const finalAcc = parseInt(document.getElementById('typing-acc')?.innerText) || 0;

    if (isFinished) {
        alert(`🎉 Luar Biasa! Anda menyelesaikan teks ini.\n\nKecepatan: ${finalWpm} WPM\nAkurasi: ${finalAcc}%`);
    } else {
        alert(`⏰ Waktu Habis!\n\nKecepatan Akhir: ${finalWpm} WPM\nAkurasi: ${finalAcc}%`);
    }

    if (finalWpm >= 20 && finalAcc >= 80) {
        const points = Math.round(finalWpm + (finalAcc / 2)); 
        if (typeof addGlobalScore === 'function') {
            addGlobalScore(points);
        }
    } else {
        alert("Tingkatkan kecepatan dan akurasi Anda untuk mendapatkan poin (Min. 20 WPM & 80% Akurasi).");
    }
}
