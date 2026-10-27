// ==========================================
// AUTHENTICATION SYSTEM
// ==========================================

const TEACHER_PASSWORD = "guru123";

function loginGuru() {
    const pass = document.getElementById('teacher-pass').value;
    if (pass === TEACHER_PASSWORD) {
        sessionStorage.setItem('is_teacher', 'true');
        
        // Sembunyikan modal
        const loginModal = document.getElementById('login-modal');
        const roleModal = document.getElementById('role-selection-modal');
        if(loginModal) loginModal.classList.add('hidden');
        if(roleModal) roleModal.classList.add('hidden');

        // Tampilkan UI Guru
        const navSiswa = document.getElementById('nav-siswa');
        const botNavSiswa = document.getElementById('bottom-nav-siswa');
        if(navSiswa) navSiswa.classList.add('hidden');
        if(botNavSiswa) botNavSiswa.classList.add('hidden');
        
        const navGuru = document.getElementById('nav-guru');
        const botNavGuru = document.getElementById('bottom-nav-guru');
        if(navGuru) navGuru.classList.remove('hidden');
        if(botNavGuru) botNavGuru.classList.remove('hidden');
        
        const mobName = document.getElementById('mobile-player-name');
        if(mobName) mobName.innerText = "Guru";

        // 🔥 PENTING: Panggil inisialisasi data
        if (typeof window.initTeacherAttendance === 'function') window.initTeacherAttendance();
        if (typeof window.initTeacherTasks === 'function') window.initTeacherTasks();
        if (typeof loadAnnouncement === 'function') loadAnnouncement();

        // Pindah ke dashboard guru
        if (typeof navigate === 'function') navigate('guru-dashboard');
        
    } else {
        alert("❌ Password salah!");
    }
}

function logoutGuru() {
    sessionStorage.removeItem('is_teacher');
    location.reload(); 
}
