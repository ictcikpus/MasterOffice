// ==========================================
// MAIN APP LOGIC (Slide Navigation & Quiz)
// ==========================================

let currentMateriId = null;
let currentSlideIndex = 0;

function navigate(viewId) {
    if (typeof stopCamera === 'function') stopCamera();

    document.querySelectorAll('.view').forEach(el => el.classList.add('hidden'));
    const targetView = document.getElementById('view-' + viewId);
    if (targetView) targetView.classList.remove('hidden');

    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('text-emerald-600', 'bg-emerald-50', 'text-amber-600', 'bg-amber-50');
        el.classList.add('text-slate-500');
    });

    const activeNav = document.querySelector(`.nav-item[onclick="navigate('${viewId}')"]`);
    if (activeNav) {
        activeNav.classList.remove('text-slate-500');
        const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
        if (isTeacher) activeNav.classList.add('text-amber-600', 'bg-amber-50');
        else activeNav.classList.add('text-emerald-600', 'bg-emerald-50');
    }
    window.scrollTo(0, 0);
}

function saveProfile() {
    const name = document.getElementById('setup-name').value.trim();
    const cls = document.getElementById('setup-class').value;
    if (!name || !cls) return alert("Harap isi nama dan pilih kelas!");
    localStorage.setItem("student_name", name);
    localStorage.setItem("student_class", cls);
    location.reload();
}

// Render Daftar Modul
function renderMateri() {
    const container = document.getElementById('materi-container');
    if(!container) return;
    container.innerHTML = '';
    
    // Pastikan materiData sudah dimuat dari data_materi.js
    if (typeof materiData === 'undefined') {
        container.innerHTML = '<p class="text-rose-500">Gagal memuat data materi.</p>';
        return;
    }

    materiData.forEach(m => {
        container.innerHTML += `
            <div onclick="openMateriDetail('${m.id}')" class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all">
                <div class="h-2 w-full bg-${m.color}-500"></div>
                <div class="p-5 flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-${m.color}-50 text-${m.color}-600 flex items-center justify-center text-2xl"><i class="fa-solid ${m.icon}"></i></div>
                    <div><h3 class="font-bold text-lg text-slate-800">${m.title}</h3><p class="text-xs text-slate-500 mt-1">${m.desc}</p></div>
                </div>
            </div>`;
    });
}

function openMateriDetail(id) {
    const materi = materiData.find(m => m.id === id);
    if(!materi) return;
    currentMateriId = id;
    currentSlideIndex = 0;
    loadSlide();
    navigate('materi-detail');
}

// Render Konten Slide + Kuis
function loadSlide() {
    const materi = materiData.find(m => m.id === currentMateriId);
    if(!materi) return;
    const slide = materi.slides[currentSlideIndex];
    
    document.getElementById('slide-current').innerText = currentSlideIndex + 1;
    document.getElementById('slide-total').innerText = materi.slides.length;
    
    let html = `
        <h2 class="text-sm font-bold text-${materi.color}-500 uppercase tracking-widest mb-1">${materi.title}</h2>
        <h1 class="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">${slide.title}</h1>
        <div class="animate-fade-in text-slate-700 leading-relaxed mb-8">${slide.content}</div>
    `;

    // Jika slide memiliki kuis, tambahkan UI kuis
    if (slide.quiz) {
        html += `
            <div class="bg-slate-50 border border-slate-200 p-5 rounded-2xl mt-4">
                <h4 class="font-bold text-slate-800 mb-3"><i class="fa-solid fa-circle-question text-sky-500 mr-2"></i> Uji Pemahaman</h4>
                <p class="text-sm font-medium mb-3">${slide.quiz.question}</p>
                <div class="space-y-2" id="quiz-options">
        `;
        
        slide.quiz.options.forEach((opt, idx) => {
            html += `<button onclick="checkQuizAnswer(${idx}, ${slide.quiz.correct})" class="w-full text-left p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition text-sm">${String.fromCharCode(65 + idx)}. ${opt}</button>`;
        });

        html += `
                </div>
                <div id="quiz-feedback" class="mt-3 text-sm font-bold hidden"></div>
            </div>
        `;
    }

    document.getElementById('slide-content').innerHTML = html;

    // Atur tombol navigasi
    document.getElementById('btn-prev-slide').disabled = (currentSlideIndex === 0);
    
    const btnNext = document.getElementById('btn-next-slide');
    if (currentSlideIndex === materi.slides.length - 1) {
        btnNext.innerHTML = 'Selesai <i class="fa-solid fa-check ml-1"></i>';
        btnNext.classList.replace('bg-emerald-600', 'bg-amber-500');
        btnNext.classList.replace('hover:bg-emerald-700', 'hover:bg-amber-600');
    } else {
        btnNext.innerHTML = 'Lanjut <i class="fa-solid fa-chevron-right ml-1"></i>';
        btnNext.classList.replace('bg-amber-500', 'bg-emerald-600');
        btnNext.classList.replace('hover:bg-amber-600', 'hover:bg-emerald-700');
    }
}

// Logika Cek Jawaban Kuis di dalam Slide
function checkQuizAnswer(selected, correct) {
    const feedback = document.getElementById('quiz-feedback');
    const buttons = document.getElementById('quiz-options').querySelectorAll('button');
    
    // Disable all buttons after answering
    buttons.forEach(btn => btn.disabled = true);

    if (selected === correct) {
        buttons[selected].classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-800');
        feedback.innerHTML = '<span class="text-emerald-600"><i class="fa-solid fa-check-circle"></i> Jawaban Benar! Hebat.</span>';
    } else {
        buttons[selected].classList.add('bg-rose-100', 'border-rose-500', 'text-rose-800');
        buttons[correct].classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-800');
        feedback.innerHTML = '<span class="text-rose-600"><i class="fa-solid fa-times-circle"></i> Jawaban Kurang Tepat. Silakan pelajari lagi.</span>';
    }
    feedback.classList.remove('hidden');
}

function changeSlide(direction) {
    const materi = materiData.find(m => m.id === currentMateriId);
    if(!materi) return;
    
    const newIndex = currentSlideIndex + direction;
    
    if (newIndex >= materi.slides.length) {
        alert("🎉 Hebat! Anda telah menyelesaikan modul ini.");
        navigate('materi');
        return;
    }
    
    if (newIndex >= 0 && newIndex < materi.slides.length) {
        currentSlideIndex = newIndex;
        loadSlide();
    }
}

// Inisialisasi Aplikasi
document.addEventListener('DOMContentLoaded', function() {
    var isTeacher = sessionStorage.getItem('is_teacher') === 'true';
    
    if (!isTeacher) {
        var name = localStorage.getItem("student_name");
        if (!name) {
            document.getElementById('profile-modal').classList.remove('hidden');
        } else {
            document.getElementById('dashboard-player-name').innerText = name;
            document.getElementById('mobile-player-name').innerText = name.split(' ')[0];
            
            var score = parseInt(localStorage.getItem("student_score")) || 0;
            document.getElementById('dash-score').innerText = score;
            
            var progress = JSON.parse(localStorage.getItem("office_progress")) || {};
            var levelsDone = Object.values(progress).filter(function(v) { return v === true; }).length;
            document.getElementById('dash-levels').innerText = levelsDone + "/6";
            
            renderMateri();
        }
        navigate('home');
    } else {
        document.getElementById('mobile-player-name').innerText = "Guru";
        navigate('guru-dashboard');
    }

    initShortcutGame();
});

// Fitur Fullscreen & Shortcut Game (Sama seperti sebelumnya)
function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(err => alert(`Gagal: ${err.message}`));
    else { if (document.exitFullscreen) document.exitFullscreen(); }
}

var shortcutData = [
    { question: "Copy (Salin)", answer: ["Ctrl", "C"] }, { question: "Paste (Tempel)", answer: ["Ctrl", "V"] },
    { question: "Cut (Potong)", answer: ["Ctrl", "X"] }, { question: "Undo (Batal)", answer: ["Ctrl", "Z"] },
    { question: "Redo (Ulangi)", answer: ["Ctrl", "Y"] }, { question: "Save (Simpan)", answer: ["Ctrl", "S"] }
];
var currentShortcutIndex = 0; var shortcutScore = 0; var userKeysPressed = [];

function initShortcutGame() {
    currentShortcutIndex = 0; shortcutScore = 0;
    if(document.getElementById('shortcut-score')) document.getElementById('shortcut-score').innerText = shortcutScore;
    loadShortcutQuestion();
}
function loadShortcutQuestion() {
    if (currentShortcutIndex >= shortcutData.length) {
        document.getElementById('shortcut-question').innerText = "Selesai! 🎉";
        document.getElementById('shortcut-feedback').innerHTML = '<span class="text-emerald-600">Skor: ' + shortcutScore + '</span>';
        return;
    }
    var currentQ = shortcutData[currentShortcutIndex];
    document.getElementById('shortcut-question').innerText = currentQ.question;
    document.getElementById('shortcut-q-count').innerText = (currentShortcutIndex + 1) + "/" + shortcutData.length;
    document.getElementById('shortcut-feedback').innerHTML = "";
    userKeysPressed = [];
    document.querySelectorAll('.key').forEach(k => k.classList.remove('pressed'));
}
document.querySelectorAll('.key').forEach(key => {
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
