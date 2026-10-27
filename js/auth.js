// ==========================================
// AUTHENTICATION SYSTEM (Login Guru & Trigger Data)
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
        
        // Sembunyikan modal
        document.getElementById('login-modal').classList.add('hidden');
        document.getElementById('role-selection-modal').classList.add('hidden');

        // Tampilkan UI Guru
        document.getElementById('nav-siswa').classList.add('hidden');
        document.getElementById('bottom-nav-siswa').classList.add('hidden');
        
        document.getElementById('nav-guru').classList.remove('hidden');
        document.getElementById('bottom-nav-guru').classList.remove('hidden');
        
        document.getElementById('mobile-player-name').innerText = "Guru";

        // 🔥 KUNCI PERBAIKAN: Panggil inisialisasi data Guru di sini
        if (typeof window.initTeacherAttendance === 'function') window.initTeacherAttendance();
        if (typeof window.initTeacherTasks === 'function') window.initTeacherTasks();

        // Pindah ke tab dashboard guru
        if (typeof navigate === 'function') navigate('guru-dashboard');
        
        // Mulai data realtime pengumuman dan streak (jika ada)
        if (typeof loadAnnouncement === 'function') loadAnnouncement();
    } else {
        alert("❌ Password salah!");
    }
}

function logoutGuru() {
    sessionStorage.removeItem('is_teacher');
    location.reload(); 
}
