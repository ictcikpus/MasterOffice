// ==========================================
// AUTHENTICATION SYSTEM (Login Guru)
// ==========================================

// Password default Guru (Bisa Anda ubah di sini)
const TEACHER_PASSWORD = "guru123";

function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if(modal) {
        modal.classList.remove('hidden');
        document.getElementById('teacher-pass').value = "";
        document.getElementById('teacher-pass').focus();
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if(modal) modal.classList.add('hidden');
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
    
    // Ambil elemen-elemen tombol
    const navGuru = document.getElementById('nav-btn-guru');
    const btnLoginDesktop = document.getElementById('btn-login-guru');
    const btnLogoutDesktop = document.getElementById('btn-logout-guru');
    const btnLoginMobile = document.getElementById('btn-login-guru-mobile');
    const btnLogoutMobile = document.getElementById('btn-logout-guru-mobile');
    const bottomNav = document.querySelector('body > nav'); // Menu bawah HP
    
    if (isTeacher) {
        // --- TAMPILAN UNTUK GURU ---
        if(navGuru) navGuru.classList.remove('hidden'); // Munculkan menu Dashboard Guru di Sidebar
        
        if(btnLoginDesktop) btnLoginDesktop.classList.add('hidden');
        if(btnLogoutDesktop) btnLogoutDesktop.classList.remove('hidden');
        
        if(btnLoginMobile) btnLoginMobile.classList.add('hidden');
        if(btnLogoutMobile) btnLogoutMobile.classList.remove('hidden');
        
        // Sembunyikan menu navigasi bawah (karena guru hanya butuh dashboard)
        if(bottomNav) bottomNav.classList.add('hidden');
        
    } else {
        // --- TAMPILAN UNTUK SISWA ---
        if(navGuru) navGuru.classList.add('hidden');
        
        if(btnLoginDesktop) btnLoginDesktop.classList.remove('hidden');
        if(btnLogoutDesktop) btnLogoutDesktop.classList.add('hidden');
        
        if(btnLoginMobile) btnLoginMobile.classList.remove('hidden');
        if(btnLogoutMobile) btnLogoutMobile.classList.add('hidden');
        
        if(bottomNav) bottomNav.classList.remove('hidden');
    }
});
