// ==========================================
// MAIN APP LOGIC
// ==========================================

let currentMateriId = null;
let currentSlideIndex = 0;

function chooseRole(role) {
    const roleModal = document.getElementById('role-selection-modal');
    roleModal.classList.add('hidden');

    if (role === 'siswa') {
        if (localStorage.getItem('student_name')) {
            applyStudentUI();
        } else {
            document.getElementById('profile-modal').classList.remove('hidden');
        }
    } else if (role === 'guru') {
        document.getElementById('login-modal').classList.remove('hidden');
    }
}

function backToRoleSelection() {
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('role-selection-modal').classList.remove('hidden');
}

function applyStudentUI() {
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
    applyStudentUI();
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

// (Fungsi openMateriDetail, loadSlide, checkSlideQuiz, changeSlide tetap sama seperti sebelumnya)

function logoutApp() {
    if(confirm("Yakin ingin keluar dari aplikasi?")) {
        sessionStorage.removeItem('is_teacher');
        location.reload(); 
    }
}

// 🔥 INISIALISASI SAAT REFRESH 🔥
document.addEventListener('DOMContentLoaded', function() {
    const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
    
    if (isTeacher) {
        // JIKA SUDAH LOGIN SEBAGAI GURU & REFRESH
        document.getElementById('role-selection-modal').classList.add('hidden');
        document.getElementById('nav-guru').classList.remove('hidden');
        document.getElementById('bottom-nav-guru').classList.remove('hidden');
        document.getElementById('mobile-player-name').innerText = "Guru";
        
        // Tarik data Firebase
        if (typeof window.initTeacherAttendance === 'function') window.initTeacherAttendance();
        if (typeof window.initTeacherTasks === 'function') window.initTeacherTasks();
        
        navigate('guru-dashboard');
    } else {
        // JIKA BELUM LOGIN, TAMPILKAN PILIHAN PERAN
        // (Modal role-selection sudah otomatis muncul dari HTML)
    }
});
