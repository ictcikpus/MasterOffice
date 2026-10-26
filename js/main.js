// ==========================================
// MAIN APP LOGIC & SHORTCUT TRAINER
// ==========================================

function navigate(viewId) {
    if (typeof stopCamera === 'function') stopCamera();

    var views = document.querySelectorAll('.view');
    for (var i = 0; i < views.length; i++) {
        views[i].classList.add('hidden');
    }
    
    var targetView = document.getElementById('view-' + viewId);
    if (targetView) {
        targetView.classList.remove('hidden');
    }

    // Update Desktop Nav
    var navItems = document.querySelectorAll('.nav-item');
    for (var j = 0; j < navItems.length; j++) {
        navItems[j].classList.remove('text-emerald-600', 'bg-emerald-50');
        navItems[j].classList.add('text-slate-500');
    }
    var activeNav = document.querySelector(`.nav-item[onclick="navigate('${viewId}')"]`);
    if (activeNav) {
        activeNav.classList.remove('text-slate-500');
        activeNav.classList.add('text-emerald-600', 'bg-emerald-50');
    }

    // Update Mobile Nav
    var bottomNavs = document.querySelectorAll('.bottom-nav-item');
    for (var k = 0; k < bottomNavs.length; k++) {
        bottomNavs[k].classList.remove('text-emerald-600');
        bottomNavs[k].classList.add('text-slate-400');
    }
    var activeBtn = document.querySelector(`.bottom-nav-item[onclick="navigate('${viewId}')"]`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-400');
        activeBtn.classList.add('text-emerald-600');
    }

    window.scrollTo(0, 0);
}

// Simpan Profil dari Modal
function saveProfile() {
    const name = document.getElementById('setup-name').value.trim();
    const cls = document.getElementById('setup-class').value;
    
    if (!name || !cls) return alert("Harap isi nama dan pilih kelas!");
    
    localStorage.setItem("student_name", name);
    localStorage.setItem("student_class", cls);
    
    // Reload halaman agar data terupdate
    location.reload();
}

document.addEventListener('DOMContentLoaded', function() {
    var isTeacher = sessionStorage.getItem('is_teacher') === 'true';
    
    if (!isTeacher) {
        var name = localStorage.getItem("student_name");
        
        // JIKA NAMA BELUM ADA, TAMPILKAN MODAL (Bukan Prompt)
        if (!name) {
            document.getElementById('profile-modal').classList.remove('hidden');
        } else {
            // Jika sudah ada, update UI
            var dashName = document.getElementById('dashboard-player-name');
            if(dashName) dashName.innerText = name;
            
            var mobileName = document.getElementById('mobile-player-name');
            if(mobileName) mobileName.innerText = name.split(' ')[0];
            
            var score = parseInt(localStorage.getItem("student_score")) || 0;
            var dashScore = document.getElementById('dash-score');
            if(dashScore) dashScore.innerText = score;
            
            var progress = JSON.parse(localStorage.getItem("office_progress")) || {};
            var levelsDone = Object.values(progress).filter(function(v) { return v === true; }).length;
            
            var dashLevels = document.getElementById('dash-levels');
            if(dashLevels) dashLevels.innerText = levelsDone + "/9";
            
            var matProgress = document.getElementById('materi-progress-text');
            if(matProgress) matProgress.innerText = Math.round((levelsDone/9)*100) + "% Selesai";
        }
        
    } else {
        if(document.getElementById('dashboard-player-name')) document.getElementById('dashboard-player-name').innerText = "Guru";
        if(document.getElementById('mobile-player-name')) document.getElementById('mobile-player-name').innerText = "Guru";
        navigate('guru');
    }

    initShortcutGame();
});

// Fitur Fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`Gagal mengaktifkan layar penuh: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

document.addEventListener('fullscreenchange', (event) => {
    const isFullscreen = !!document.fullscreenElement;
    const iconDesktop = document.getElementById('fs-icon-desktop');
    const textDesktop = document.getElementById('fs-text-desktop');
    if (iconDesktop && textDesktop) {
        if (isFullscreen) {
            iconDesktop.className = 'fa-solid fa-compress';
            textDesktop.innerText = 'Keluar Layar Penuh';
        } else {
            iconDesktop.className = 'fa-solid fa-expand';
            textDesktop.innerText = 'Layar Penuh';
        }
    }
    const iconMobile = document.getElementById('fs-icon-mobile');
    if (iconMobile) {
        if (isFullscreen) iconMobile.className = 'fa-solid fa-compress text-lg';
        else iconMobile.className = 'fa-solid fa-expand text-lg';
    }
});

// SHORTCUT GAME LOGIC
var shortcutData = [
    { question: "Copy (Salin)", answer: ["Ctrl", "C"] },
    { question: "Paste (Tempel)", answer: ["Ctrl", "V"] },
    { question: "Cut (Potong)", answer: ["Ctrl", "X"] },
    { question: "Undo (Batal)", answer: ["Ctrl", "Z"] },
    { question: "Redo (Ulangi)", answer: ["Ctrl", "Y"] },
    { question: "Save (Simpan)", answer: ["Ctrl", "S"] }
];

var currentShortcutIndex = 0;
var shortcutScore = 0;
var userKeysPressed = [];

function initShortcutGame() {
    currentShortcutIndex = 0;
    shortcutScore = 0;
    var scoreEl = document.getElementById('shortcut-score');
    if(scoreEl) scoreEl.innerText = shortcutScore;
    loadShortcutQuestion();
}

function loadShortcutQuestion() {
    if (currentShortcutIndex >= shortcutData.length) {
        document.getElementById('shortcut-question').innerText = "Selesai! 🎉";
        document.getElementById('shortcut-feedback').innerHTML = '<span class="text-emerald-600">Skor Akhir: ' + shortcutScore + '</span>';
        return;
    }

    var currentQ = shortcutData[currentShortcutIndex];
    document.getElementById('shortcut-question').innerText = currentQ.question;
    document.getElementById('shortcut-q-count').innerText = (currentShortcutIndex + 1) + "/" + shortcutData.length;
    document.getElementById('shortcut-feedback').innerHTML = "";
    userKeysPressed = [];

    var keys = document.querySelectorAll('.key');
    for (var i = 0; i < keys.length; i++) {
        keys[i].classList.remove('pressed');
    }
}

var virtualKeys = document.querySelectorAll('.key');
for (var k = 0; k < virtualKeys.length; k++) {
    virtualKeys[k].addEventListener('click', function(e) {
        var keyValue = e.target.getAttribute('data-key');
        if (!keyValue || currentShortcutIndex >= shortcutData.length) return;

        e.target.classList.add('pressed');
        setTimeout(function() { e.target.classList.remove('pressed'); }, 150);

        userKeysPressed.push(keyValue);
        var correctAnswer = shortcutData[currentShortcutIndex].answer;
        var isMatch = true;
        
        for (var i = 0; i < userKeysPressed.length; i++) {
            if (userKeysPressed[i] !== correctAnswer[i]) {
                isMatch = false;
                break;
            }
        }

        if (!isMatch) {
            document.getElementById('shortcut-feedback').innerHTML = '<span class="text-rose-500 animate-shake inline-block"><i class="fa-solid fa-xmark"></i> Salah, coba lagi!</span>';
            setTimeout(function() {
                userKeysPressed = [];
                document.getElementById('shortcut-feedback').innerHTML = "";
            }, 1000);
        } else if (userKeysPressed.length === correctAnswer.length) {
            shortcutScore += 10;
            document.getElementById('shortcut-score').innerText = shortcutScore;
            document.getElementById('shortcut-feedback').innerHTML = '<span class="text-emerald-500 animate-pop inline-block"><i class="fa-solid fa-check"></i> Benar! +10</span>';
            
            currentShortcutIndex++;
            setTimeout(loadShortcutQuestion, 1000);
        } else {
            document.getElementById('shortcut-feedback').innerHTML = '<span class="text-amber-500">Lanjutkan...</span>';
        }
    });
}

function resetShortcutGame() { initShortcutGame(); }
