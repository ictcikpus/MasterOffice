// ==========================================
// EXTENDED DASHBOARD (Streak, Announcements, Profile)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
    
    if (!isTeacher) {
        checkDailyStreak();
        loadAnnouncement();
        renderProfile();
    }
});

// --- 1. SISTEM STREAK HARIAN ---
function checkDailyStreak() {
    const studentName = localStorage.getItem("student_name");
    if (!studentName) return; // Belum login profil

    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('last_login_date');
    let streak = parseInt(localStorage.getItem('login_streak')) || 0;

    if (lastLogin !== today) {
        if (lastLogin) {
            const lastDate = new Date(lastLogin);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

            if (diffDays === 1) {
                // Login beruntun (kemarin & hari ini)
                streak++;
            } else if (diffDays > 1) {
                // Bolong sehari atau lebih, reset
                streak = 1;
            }
        } else {
            // Login pertama kali
            streak = 1;
        }

        // Simpan data baru
        localStorage.setItem('last_login_date', today);
        localStorage.setItem('login_streak', streak);

        // Beri bonus poin jika streak > 1 (contoh: +10 poin per hari streak)
        if (streak > 1) {
            let currentScore = parseInt(localStorage.getItem("student_score")) || 0;
            let bonus = streak * 10;
            let newScore = currentScore + bonus;
            localStorage.setItem("student_score", newScore);
            
            if (typeof window.syncScoreToDatabase === 'function') {
                const cls = localStorage.getItem("student_class");
                window.syncScoreToDatabase(studentName, cls, newScore);
            }

            setTimeout(() => {
                alert(`🔥 LUAR BIASA! Kamu sudah belajar ${streak} hari berturut-turut.\nBonus: +${bonus} Poin!`);
            }, 1000);
        }
    }

    // Update UI
    const dashStreak = document.getElementById('dash-streak');
    if (dashStreak) dashStreak.innerText = `🔥 ${streak}`;
    
    const dashScore = document.getElementById('dash-score');
    if (dashScore) dashScore.innerText = parseInt(localStorage.getItem("student_score")) || 0;
}

// --- 2. PENGUMUMAN GURU ---
// Fungsi ini dipanggil saat Guru mengklik tombol Kirim
function kirimPengumuman() {
    const text = document.getElementById('input-pengumuman').value.trim();
    if (!text) return alert("Ketik pesan pengumuman terlebih dahulu!");

    db.ref('announcements').set({
        message: text,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        alert("✅ Pengumuman berhasil dikirim ke siswa!");
        document.getElementById('input-pengumuman').value = '';
    });
}

// Fungsi ini dipanggil saat Siswa membuka Home
function loadAnnouncement() {
    db.ref('announcements').on('value', (snapshot) => {
        const data = snapshot.val();
        const banner = document.getElementById('announcement-banner');
        const textEl = document.getElementById('announcement-text');

        if (data && data.message) {
            textEl.innerText = data.message;
            banner.classList.remove('hidden');
        } else {
            banner.classList.add('hidden');
        }
    });
}

// --- 3. RENDER PROFIL & BADGES ---
function renderProfile() {
    const name = localStorage.getItem("student_name");
    const cls = localStorage.getItem("student_class");
    const score = parseInt(localStorage.getItem("student_score")) || 0;
    const streak = parseInt(localStorage.getItem('login_streak')) || 0;

    if(document.getElementById('profile-name')) {
        document.getElementById('profile-name').innerText = name || "Siswa";
        document.getElementById('profile-class').innerText = cls || "Kelas Umum";
        document.getElementById('profile-score').innerText = score;
        document.getElementById('profile-streak').innerText = streak;
    }

    // Tentukan Lencana (Badges)
    const badgesContainer = document.getElementById('badges-container');
    if (!badgesContainer) return;

    const badges = [
        { id: 'pemula', name: 'Pemula', icon: 'fa-seedling', color: 'emerald', unlocked: score >= 100 },
        { id: 'rajin', name: 'Rajin Belajar', icon: 'fa-fire', color: 'orange', unlocked: streak >= 3 },
        { id: 'jago_ketik', name: 'Jago Ketik', icon: 'fa-keyboard', color: 'purple', unlocked: false }, // Bisa di-update nanti
        { id: 'master', name: 'Master Office', icon: 'fa-crown', color: 'amber', unlocked: score >= 1000 }
    ];

    badgesContainer.innerHTML = '';
    badges.forEach(b => {
        const isUnlocked = b.unlocked;
        const bgClass = isUnlocked ? `bg-${b.color}-100 text-${b.color}-600` : 'bg-slate-100 text-slate-400 grayscale opacity-50';
        
        badgesContainer.innerHTML += `
            <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col items-center text-center">
                <div class="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 ${bgClass}">
                    <i class="fa-solid ${b.icon}"></i>
                </div>
                <h4 class="font-bold text-sm text-slate-800">${b.name}</h4>
                <p class="text-[10px] text-slate-500 mt-1">${isUnlocked ? 'Diraih!' : 'Terkunci'}</p>
            </div>
        `;
    });
}
