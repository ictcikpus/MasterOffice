// ==========================================
// AUTHENTICATION SYSTEM
// ==========================================

const TEACHER_PASSWORD = "guru123";

function openLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
}

function closeLoginModal() {
    document.getElementById('login-modal').classList.add('hidden');
}

function loginGuru() {
    const pass = document.getElementById('teacher-pass').value;
    if (pass === TEACHER_PASSWORD) {
        sessionStorage.setItem('is_teacher', 'true');
        
        document.getElementById('login-modal').classList.add('hidden');
        document.getElementById('role-selection-modal').classList.add('hidden');

        // UI Guru
        document.getElementById('nav-siswa').classList.add('hidden');
        document.getElementById('bottom-nav-siswa').classList.add('hidden');
        document.getElementById('nav-guru').classList.remove('hidden');
        document.getElementById('bottom-nav-guru').classList.remove('hidden');
        document.getElementById('mobile-player-name').innerText = "Guru";

        // 🔥 PENTING: Tarik data Firebase seketika setelah login
        if (typeof window.initTeacherAttendance === 'function') window.initTeacherAttendance();
        if (typeof window.initTeacherTasks === 'function') window.initTeacherTasks();
        
        // Sembunyikan layar pilihan peran
        document.getElementById('role-selection-modal').classList.add('hidden');

        if (typeof navigate === 'function') navigate('guru-dashboard');
        
        if (typeof loadAnnouncement === 'function') loadAnnouncement();
    } else {
        alert("❌ Password salah!");
    }
}

function logoutGuru() {
    sessionStorage.removeItem('is_teacher');
    location.reload(); 
}
