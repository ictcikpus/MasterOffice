// ==========================================
// MAIN APP LOGIC & ROLE SELECTION
// ==========================================

let currentMateriId = null;
let currentSlideIndex = 0;

// Fungsi saat memilih peran di layar awal
function chooseRole(role) {
    const roleModal = document.getElementById('role-selection-modal');
    roleModal.classList.add('hidden');

    if (role === 'siswa') {
        // Cek apakah siswa sudah punya nama di localStorage
        if (localStorage.getItem('student_name')) {
            applyStudentUI();
        } else {
            document.getElementById('profile-modal').classList.remove('hidden');
        }
    } else if (role === 'guru') {
        document.getElementById('login-modal').classList.remove('hidden');
    }
}

// Fungsi jika Guru membatalkan login
function backToRoleSelection() {
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('role-selection-modal').classList.remove('hidden');
}

function applyStudentUI() {
    // Setup Navbar Siswa
    document.getElementById('nav-siswa').classList.remove('hidden');
    document.getElementById('bottom-nav-siswa').classList.remove('hidden');
    
    const name = localStorage.getItem("student_name");
    document.getElementById('dashboard-player-name').innerText = name;
    document.getElementById('mobile-player-name').innerText = name.split(' ')[0];
    
    let score = parseInt(localStorage.getItem("student_score")) || 0;
    if(document.getElementById('dash-score')) document.getElementById('dash-score').innerText = score;
    
    renderMateri();
    navigate('home');
}

function saveProfile() {
    const name = document.getElementById('setup-name').value.trim();
    const cls = document.getElementById('setup-class').value;
    if (!name || !cls) return alert("Harap isi nama dan pilih kelas!");
    
    localStorage.setItem("student_name", name);
    localStorage.setItem("student_class", cls);
    
    document.getElementById('profile-modal').classList.add('hidden');
    applyStudentUI(); // Langsung masuk tanpa reload
}

function navigate(viewId) {
    if (typeof stopCamera === 'function') stopCamera();
    document.body.classList.remove('hide-nav'); 

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
    
    if (viewId === 'profil' && typeof renderProfile === 'function') {
        renderProfile();
    }
    
    if (viewId === 'guru-tugas' && typeof window.renderRekapTugasGuru === 'function') {
        window.renderRekapTugasGuru();
    }

    window.scrollTo(0, 0);
}

function renderMateri() {
    const container = document.getElementById('materi-container');
    if(!container) return;
    container.innerHTML = '';
    if (typeof materiData === 'undefined') return;

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

    if (slide.quiz) {
        html += `
            <div class="bg-slate-50 border border-slate-200 p-5 rounded-2xl mt-4">
                <h4 class="font-bold text-slate-800 mb-3"><i class="fa-solid fa-circle-question text-sky-500 mr-2"></i> Uji Pemahaman</h4>
                <p class="text-sm font-medium mb-3">${slide.quiz.question}</p>
                <div class="space-y-2" id="quiz-options">
        `;
        slide.quiz.options.forEach((opt, idx) => {
            html += `<button onclick="checkSlideQuiz(${idx}, ${slide.quiz.correct})" class="w-full text-left p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition text-sm">${String.fromCharCode(65 + idx)}. ${opt}</button>`;
        });
        html += `</div><div id="quiz-feedback" class="mt-3 text-sm font-bold hidden"></div></div>`;
    }

    document.getElementById('slide-content').innerHTML = html;

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

function checkSlideQuiz(selected, correct) {
    const feedback = document.getElementById('quiz-feedback');
    const buttons = document.getElementById('quiz-options').querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);

    if (selected === correct) {
        buttons[selected].classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-800');
        feedback.innerHTML = '<span class="text-emerald-600"><i class="fa-solid fa-check-circle"></i> Jawaban Benar!</span>';
        if(typeof confetti === 'function') confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } else {
        buttons[selected].classList.add('bg-rose-100', 'border-rose-500', 'text-rose-800');
        buttons[correct].classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-800');
        feedback.innerHTML = '<span class="text-rose-600"><i class="fa-solid fa-times-circle"></i> Jawaban Kurang Tepat.</span>';
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

// Fungsi untuk keluar ke pilihan peran
function logoutApp() {
    if(confirm("Yakin ingin keluar dari aplikasi?")) {
        sessionStorage.removeItem('is_teacher');
        // Jangan hapus student_name agar siswa tidak perlu input nama lagi jika login sebagai siswa
        location.reload(); 
    }
}

// Inisialisasi Awal
document.addEventListener('DOMContentLoaded', function() {
    const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
    
    // Jika sebelumnya sudah login sebagai guru, langsung ke dashboard
    if (isTeacher) {
        document.getElementById('role-selection-modal').classList.add('hidden');
        document.getElementById('nav-guru').classList.remove('hidden');
        document.getElementById('bottom-nav-guru').classList.remove('hidden');
        document.getElementById('mobile-player-name').innerText = "Guru";
        navigate('guru-dashboard');
    } 
    // Jika tidak, biarkan modal role selection muncul (jangan lakukan apa-apa)
});
