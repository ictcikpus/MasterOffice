// ==========================================
// TYPING GAME 10 JARI (US Keyboard)
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
let typingStartTime = null;
let typingErrors = 0;
let typingTotalTyped = 0;
let typingIsPlaying = false;

function startTypingGame() {
    document.getElementById('arena-menu').classList.add('hidden');
    document.getElementById('shortcut-game-container').classList.add('hidden');
    document.getElementById('quiz-game-container').classList.add('hidden');
    document.getElementById('typing-game-container').classList.remove('hidden');

    // Reset State
    typingTargetText = typingTexts[Math.floor(Math.random() * typingTexts.length)];
    typingTimeLeft = 60;
    typingErrors = 0;
    typingTotalTyped = 0;
    typingIsPlaying = true;
    
    const inputEl = document.getElementById('typing-input');
    inputEl.value = "";
    inputEl.disabled = false;
    
    // Render Teks Target
    const display = document.getElementById('typing-text-display');
    display.innerHTML = "";
    typingTargetText.split("").forEach((char, index) => {
        const span = document.createElement('span');
        span.innerText = char;
        span.id = `char-${index}`;
        span.className = "text-slate-500";
        display.appendChild(span);
    });

    document.getElementById('typing-time').innerText = `${typingTimeLeft}s`;
    document.getElementById('typing-wpm').innerText = "0";
    document.getElementById('typing-acc').innerText = "100%";
    
    // Fokus ke input
    inputEl.focus();
    
    // Timer
    clearInterval(typingTimer);
    typingTimer = setInterval(() => {
        typingTimeLeft--;
        document.getElementById('typing-time').innerText = `${typingTimeLeft}s`;
        
        if (typingTimeLeft <= 0) {
            endTypingGame();
        }
    }, 1000);
}

// Event Listener Input (Hidden Input)
document.addEventListener('DOMContentLoaded', () => {
    const inputEl = document.getElementById('typing-input');
    if(inputEl) {
        inputEl.addEventListener('input', (e) => {
            if (!typingIsPlaying) return;
            
            const typedText = e.target.value;
            typingTotalTyped = typedText.length;
            
            // Hitung Error & Cek Karakter
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
            
            // Highlight karakter selanjutnya
            if (typedText.length < typingTargetText.length) {
                const nextChar = document.getElementById(`char-${typedText.length}`);
                if (nextChar) nextChar.className = "text-slate-800 font-bold bg-yellow-200 rounded-sm animate-pulse";
            }

            // Hitung Akurasi & WPM secara real-time
            const accuracy = typedText.length > 0 ? Math.round(((typedText.length - typingErrors) / typedText.length) * 100) : 100;
            document.getElementById('typing-acc').innerText = `${accuracy}%`;
            
            const timeElapsedMins = (60 - typingTimeLeft) / 60;
            if (timeElapsedMins > 0.05) {
                const wpm = Math.round((typedText.length / 5) / timeElapsedMins);
                document.getElementById('typing-wpm').innerText = wpm;
            }

            // Jika selesai
            if (typedText === typingTargetText) {
                endTypingGame(true);
            }
        });
    }

    // Event Listener Virtual Keyboard
    document.querySelectorAll('#typing-game-container .key').forEach(key => {
        key.addEventListener('click', (e) => {
            if (!typingIsPlaying) return;
            const keyValue = e.target.getAttribute('data-key');
            const inputEl = document.getElementById('typing-input');
            
            // Simulasi mengetik (kecuali tombol modifier)
            if (keyValue === "Backspace") {
                inputEl.value = inputEl.value.slice(0, -1);
            } else if (keyValue === " " || keyValue === "Space") {
                inputEl.value += " ";
            } else if (keyValue.length === 1) {
                inputEl.value += keyValue.toLowerCase(); // Huruf kecil default
            }
            
            // Trigger event input manual
            inputEl.dispatchEvent(new Event('input'));
            inputEl.focus();
        });
    });
});

function endTypingGame(isFinished = false) {
    typingIsPlaying = false;
    clearInterval(typingTimer);
    document.getElementById('typing-input').disabled = true;
    
    const finalWpm = parseInt(document.getElementById('typing-wpm').innerText) || 0;
    const finalAcc = parseInt(document.getElementById('typing-acc').innerText) || 0;

    if (isFinished) {
        alert(`🎉 Luar Biasa! Anda menyelesaikan teks ini.\n\nKecepatan: ${finalWpm} WPM\nAkurasi: ${finalAcc}%`);
    } else {
        alert(`⏰ Waktu Habis!\n\nKecepatan Akhir: ${finalWpm} WPM\nAkurasi: ${finalAcc}%`);
    }

    // Berikan Poin jika WPM dan Akurasi memenuhi syarat
    if (finalWpm >= 20 && finalAcc >= 80) {
        const points = Math.round(finalWpm + (finalAcc / 2)); // Contoh rumus poin
        if (typeof addGlobalScore === 'function') {
            addGlobalScore(points);
        }
    } else {
        alert("Tingkatkan kecepatan dan akurasi Anda untuk mendapatkan poin (Min. 20 WPM & 80% Akurasi).");
    }
}
