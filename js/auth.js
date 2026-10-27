// ==========================================
// AUTHENTICATION SYSTEM (Login Guru)
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
        sessionStorage.setItem('is_teacher', 'true');
        
        // Sembunyikan modal
        document.getElementById('login-modal').classList.add('hidden');
        document.getElementById('role-selection-modal').classList.add('hidden');

        // Tampilkan UI Guru tanpa reload
        document.getElementById('nav-siswa').classList.add('hidden');
        document.getElementById('bottom-nav-siswa').classList.add('hidden');
        
        document.getElementById('nav-guru').classList.remove('hidden');
        document.getElementById('bottom-nav-guru').classList.remove('hidden');
        
        document.getElementById('mobile-player-name').innerText = "Guru";
        
        navigate('guru-dashboard');
    } else {
        alert("❌ Password salah!");
    }
}

function logoutGuru() {
    sessionStorage.removeItem('is_teacher');
    location.reload(); 
}
