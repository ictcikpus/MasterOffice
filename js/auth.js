// ==========================================
// AUTHENTICATION SYSTEM
// ==========================================

const TEACHER_PASSWORD = "guru123";

function openLoginModal() {
    // Fungsi ini tidak lagi dipakai secara langsung, diganti chooseRole('guru')
    document.getElementById('login-modal').classList.remove('hidden');
}

function closeLoginModal() {
    document.getElementById('login-modal').classList.add('hidden');
}

function loginGuru() {
    const pass = document.getElementById('teacher-pass').value;
    if (pass === TEACHER_PASSWORD) {
        // 🔥 SIMPAN SESI GURU & HAPUS SESI SISWA
        sessionStorage.setItem('is_teacher', 'true');
        sessionStorage.removeItem('is_student');
        
        // Sembunyikan modal
        document.getElementById('login-modal').classList.add('hidden');
        document.getElementById('role-selection-modal').classList.add('hidden');

        // Tampilkan UI Guru
        document.getElementById('nav-siswa').classList.add('hidden');
        document.getElementById('bottom-nav-siswa').classList.add('hidden');
        
        document.getElementById('nav-guru').classList.remove('hidden');
        document.getElementById('bottom-nav-guru').classList.remove('hidden');
        
        document.getElementById('mobile-player-name').innerText = "Guru";

        // Panggil inisialisasi data Guru
        if (typeof window.initTeacherAttendance === 'function') window.initTeacherAttendance();
        if (typeof window.initTeacherTasks === 'function') window.initTeacherTasks();

        // Pindah ke tab dashboard guru
        if (typeof navigate === 'function') navigate('guru-dashboard');
        
        if (typeof loadAnnouncement === 'function') loadAnnouncement();
    } else {
        alert("❌ Password salah!");
    }
}

function logoutGuru() {
    // Fungsi ini bisa digunakan jika tombol logout guru terpisah
    sessionStorage.removeItem('is_teacher');
    sessionStorage.removeItem('is_student');
    location.reload(); 
}
