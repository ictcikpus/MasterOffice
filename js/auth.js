// ==========================================
// AUTHENTICATION SYSTEM (Login Guru)
// ==========================================

// Password default Guru (Bisa Anda ubah di sini)
const TEACHER_PASSWORD = "guru123";

function openLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
    document.getElementById('teacher-pass').value = "";
    document.getElementById('teacher-pass').focus();
}

function closeLoginModal() {
    document.getElementById('login-modal').classList.add('hidden');
}

function loginGuru() {
    const pass = document.getElementById('teacher-pass').value;
    if (pass === TEACHER_PASSWORD) {
        sessionStorage.setItem('is_teacher', 'true');
        location.reload(); // Reload halaman untuk menerapkan mode guru
    } else {
        alert("❌ Password salah! Silakan coba lagi.");
    }
}

function logoutGuru() {
    sessionStorage.removeItem('is_teacher');
    location.reload(); // Reload untuk kembali ke mode siswa
}

// Cek status login saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
    
    if (isTeacher) {
        // Tampilan untuk Guru
        document.getElementById('nav-btn-dashboard').classList.remove('hidden');
        document.getElementById('nav-btn-attendance').classList.add('hidden'); // Guru tidak perlu form absen siswa
        document.getElementById('btn-login-guru').classList.add('hidden');
        document.getElementById('btn-logout-guru').classList.remove('hidden');
    } else {
        // Tampilan untuk Siswa
        document.getElementById('nav-btn-dashboard').classList.add('hidden');
        document.getElementById('nav-btn-attendance').classList.remove('hidden');
        document.getElementById('btn-login-guru').classList.remove('hidden');
        document.getElementById('btn-logout-guru').classList.add('hidden');
    }
});
