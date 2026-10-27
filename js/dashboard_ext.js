// ==========================================
// EXTENDED DASHBOARD (Streak, Announcements, Profile, Certificate)
// ==========================================

let allTasksForCert = [];
let allSubmissionsForCert = {};
let isTeacherDashboard = false;

document.addEventListener('DOMContentLoaded', () => {
    isTeacherDashboard = sessionStorage.getItem('is_teacher') === 'true';
    
    if (!isTeacherDashboard) {
        checkDailyStreak();
        loadAnnouncement();
        
        // Listener untuk mengecek syarat sertifikat (Tugas)
        db.ref('tasks').on('value', snap => {
            allTasksForCert = [];
            snap.forEach(child => allTasksForCert.push({ id: child.key }));
            if(document.getElementById('view-profil') && !document.getElementById('view-profil').classList.contains('hidden')) {
                checkCertificateEligibility();
            }
        });

        db.ref('submissions').on('value', snap => {
            allSubmissionsForCert = snap.val() || {};
            if(document.getElementById('view-profil') && !document.getElementById('view-profil').classList.contains('hidden')) {
                checkCertificateEligibility();
            }
        });
    }
});

// --- 1. SISTEM STREAK HARIAN ---
function checkDailyStreak() {
    const studentName = localStorage.getItem("student_name");
    if (!studentName) return;

    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('last_login_date');
    let streak = parseInt(localStorage.getItem('login_streak')) || 0;

    if (lastLogin !== today) {
        if (lastLogin) {
            const lastDate = new Date(lastLogin);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

            if (diffDays === 1) streak++;
            else if (diffDays > 1) streak = 1;
        } else {
            streak = 1;
        }

        localStorage.setItem('last_login_date', today);
        localStorage.setItem('login_streak', streak);

        if (streak > 1) {
            let currentScore = parseInt(localStorage.getItem("student_score")) || 0;
            let bonus = streak * 10;
            let newScore = currentScore + bonus;
            localStorage.setItem("student_score", newScore);
            
            if (typeof window.syncScoreToDatabase === 'function') {
                const cls = localStorage.getItem("student_class");
                window.syncScoreToDatabase(studentName, cls, newScore);
            }

            setTimeout(() => { alert(`🔥 LUAR BIASA! Kamu sudah belajar ${streak} hari berturut-turut.\nBonus: +${bonus} Poin!`); }, 1000);
        }
    }
}

// --- 2. PENGUMUMAN GURU ---
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

function loadAnnouncement() {
    db.ref('announcements').on('value', (snapshot) => {
        const data = snapshot.val();
        const banner = document.getElementById('announcement-banner');
        const textEl = document.getElementById('announcement-text');

        if (data && data.message && banner && textEl) {
            textEl.innerText = data.message;
            banner.classList.remove('hidden');
        } else if (banner) {
            banner.classList.add('hidden');
        }
    });
}

// --- 3. RENDER PROFIL & BADGES & SERTIFIKAT ---
function renderProfile() {
    const name = localStorage.getItem("student_name") || "Siswa";
    const cls = localStorage.getItem("student_class") || "Kelas Umum";
    const score = parseInt(localStorage.getItem("student_score")) || 0;
    const streak = parseInt(localStorage.getItem('login_streak')) || 0;

    if(document.getElementById('profile-name')) {
        document.getElementById('profile-name').innerText = name;
        document.getElementById('profile-class').innerText = cls;
        document.getElementById('profile-score').innerText = score;
        document.getElementById('profile-streak').innerText = streak;
    }

    // Render Lencana
    const badgesContainer = document.getElementById('badges-container');
    if (badgesContainer) {
        const badges = [
            { id: 'pemula', name: 'Pemula', icon: 'fa-seedling', color: 'emerald', unlocked: score >= 100 },
            { id: 'rajin', name: 'Rajin Belajar', icon: 'fa-fire', color: 'orange', unlocked: streak >= 3 },
            { id: 'jago_ketik', name: 'Jago Ketik', icon: 'fa-keyboard', color: 'purple', unlocked: false }, 
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

    // Cek Kelayakan Sertifikat
    checkCertificateEligibility();
}

function checkCertificateEligibility() {
    const certContainer = document.getElementById('certificate-container');
    if (!certContainer) return;

    const name = localStorage.getItem("student_name");
    const cls = localStorage.getItem("student_class");
    const score = parseInt(localStorage.getItem("student_score")) || 0;
    const streak = parseInt(localStorage.getItem('login_streak')) || 0;

    // 1. Cek Tugas (Apakah semua tugas di database sudah dikumpulkan?)
    let allTasksDone = true;
    let missingTasksCount = 0;
    
    if (allTasksForCert.length > 0) {
        const mySubs = allSubmissionsForCert[cls]?.[name] || {};
        allTasksForCert.forEach(t => {
            if (!mySubs[t.id]) {
                allTasksDone = false;
                missingTasksCount++;
            }
        });
    } else {
        allTasksDone = false; // Jika guru belum buat tugas, sertifikat belum bisa dicetak
    }

    // 2. Cek Streak (Minimal 3 hari)
    const streakDone = streak >= 3;

    // 3. Render UI Tombol
    if (allTasksDone && streakDone) {
        certContainer.innerHTML = `
            <div class="bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-300 rounded-2xl p-6 text-center shadow-md">
                <i class="fa-solid fa-award text-5xl text-amber-500 mb-3 animate-bounce"></i>
                <h3 class="text-xl font-bold text-amber-800 mb-2">Luar Biasa, ${name}!</h3>
                <p class="text-sm text-amber-700 mb-4">Anda telah menyelesaikan seluruh materi, tugas, dan aktif belajar. Sertifikat Anda sudah siap!</p>
                <button onclick="window.generateCertificate('${name}', '${cls}', ${score})" class="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105">
                    <i class="fa-solid fa-print mr-2"></i> Cetak Sertifikat
                </button>
            </div>
        `;
    } else {
        let reasons = [];
        if (!allTasksDone) reasons.push(`Selesaikan ${missingTasksCount} tugas yang belum dikumpulkan`);
        if (!streakDone) reasons.push(`Aktif belajar minimal 3 hari (Streak Anda: ${streak})`);
        
        certContainer.innerHTML = `
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center opacity-70">
                <i class="fa-solid fa-lock text-4xl text-slate-400 mb-3"></i>
                <h3 class="text-lg font-bold text-slate-700 mb-2">Sertifikat Terkunci</h3>
                <p class="text-sm text-slate-500 mb-3">Selesaikan syarat berikut untuk membuka sertifikat:</p>
                <ul class="text-xs text-left inline-block text-slate-600 bg-white p-4 rounded-lg border border-slate-200">
                    ${reasons.map(r => `<li><i class="fa-solid fa-circle-xmark text-rose-400 mr-2"></i>${r}</li>`).join('')}
                </ul>
            </div>
        `;
    }
}
