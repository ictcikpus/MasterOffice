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
        location.reload(); 
    } else {
        alert("❌ Password salah!");
    }
}

function logoutGuru() {
    sessionStorage.removeItem('is_teacher');
    location.reload(); 
}

document.addEventListener('DOMContentLoaded', () => {
    const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
    
    // Elemen Navigasi Siswa
    const navSiswa = document.getElementById('nav-siswa');
    const bottomNavSiswa = document.getElementById('bottom-nav-siswa');
    const btnLoginDesktop = document.getElementById('btn-login-guru');
    const btnLoginMobile = document.getElementById('btn-login-guru-mobile');
    const profileModal = document.getElementById('profile-modal');
    
    // Elemen Navigasi Guru
    const navGuru = document.getElementById('nav-guru');
    const bottomNavGuru = document.getElementById('bottom-nav-guru');
    const btnLogoutDesktop = document.getElementById('btn-logout-guru');
    const btnLogoutMobile = document.getElementById('btn-logout-guru-mobile');

    if (isTeacher) {
        // TAMPILAN GURU
        navGuru.classList.remove('hidden');
        bottomNavGuru.classList.remove('hidden');
        btnLogoutDesktop.classList.remove('hidden');
        btnLogoutMobile.classList.remove('hidden');
        
        navSiswa.classList.add('hidden');
        bottomNavSiswa.classList.add('hidden');
        btnLoginDesktop.classList.add('hidden');
        btnLoginMobile.classList.add('hidden');
        profileModal.classList.add('hidden'); // Guru tidak butuh modal isi nama siswa

        // Redirect ke dashboard guru pertama kali login
        if(document.getElementById('view-home').classList.contains('view') && !document.querySelector('.view:not(.hidden)')) {
            navigate('guru-dashboard');
        }
    } else {
        // TAMPILAN SISWA
        navSiswa.classList.remove('hidden');
        bottomNavSiswa.classList.remove('hidden');
        btnLoginDesktop.classList.remove('hidden');
        btnLoginMobile.classList.remove('hidden');
        
        navGuru.classList.add('hidden');
        bottomNavGuru.classList.add('hidden');
        btnLogoutDesktop.classList.add('hidden');
        btnLogoutMobile.classList.add('hidden');
    }
});
