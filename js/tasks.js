// ==========================================
// TASKS SYSTEM (Master-Detail View)
// ==========================================

const GAS_URL = "https://script.google.com/macros/s/AKfycbxu2pRUrXHIex2xABFFANCxvrhWHialnwst3e3VPHZBl9arG8WAWRmcj_U_eFAGWOEZCA/exec";
const FOLDER_ID = "1_K4XXQc4umLJPpKmnpwEUcIGX9ed7m6e";

let allTasks = [];
let allSubmissionsData = {}; 
let currentSelectedTaskId = null;
let currentViewingTaskId = null; 

const todayStrTasks = new Date().toISOString().split('T')[0];
let isTeacherTasksListenerAttached = false;

document.addEventListener("DOMContentLoaded", () => {
    const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
    if (!isTeacher) {
        initStudentTasksData();
    }
});

// --- FUNGSI SISWA ---
function initStudentTasksData() {
    db.ref('tasks').on('value', snap => {
        allTasks = [];
        snap.forEach(child => allTasks.push({ id: child.key, ...child.val() }));
        allTasks.reverse();
        renderSiswaTugas();
    });

    db.ref('submissions').on('value', snap => {
        allSubmissionsData = snap.val() || {};
        renderSiswaTugas(); 
    });
}

function renderSiswaTugas() {
    const container = document.getElementById('siswa-tugas-list');
    if(!container) return;
    const studentName = localStorage.getItem("student_name");
    const studentClass = localStorage.getItem("student_class");

    if(!studentName || !studentClass) return;

    container.innerHTML = '';
    if (allTasks.length === 0) {
        container.innerHTML = `<div class="text-center p-8 bg-white rounded-2xl border border-slate-200"><p class="text-slate-500 font-bold">Belum ada tugas dari Guru.</p></div>`;
        return;
    }

    const mySubmissions = allSubmissionsData[studentClass]?.[studentName] || {};

    allTasks.forEach(t => {
        const isSubmitted = mySubmissions[t.id];
        let statusHtml = isSubmitted 
            ? `<span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold"><i class="fa-solid fa-check-circle mr-1"></i> Sudah Dikumpulkan</span>`
            : `<button onclick="window.openKumpulTugasModal('${t.id}', '${t.title}')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition"><i class="fa-solid fa-paper-plane mr-1"></i> Kumpulkan Tugas</button>`;

        container.innerHTML += `
            <div class="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm mb-4">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2 border-b border-slate-100 pb-3">
                    <h3 class="font-bold text-xl text-slate-800">${t.title}</h3>
                    <span class="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg"><i class="fa-regular fa-clock mr-1"></i> Tenggat: ${t.deadline}</span>
                </div>
                <div class="text-slate-600 mb-5">${t.desc}</div>
                <div class="flex justify-end">${statusHtml}</div>
            </div>
        `;
    });
}

// --- FUNGSI GURU ---
window.initTeacherTasks = function() {
    if (isTeacherTasksListenerAttached) return;
    isTeacherTasksListenerAttached = true;

    db.ref('tasks').on('value', snap => {
        allTasks = [];
        snap.forEach(child => allTasks.push({ id: child.key, ...child.val() }));
        allTasks.reverse();
        
        const statTugas = document.getElementById('stat-tugas');
        if(statTugas) statTugas.innerText = allTasks.length;
        
        // Render otomatis jika sedang di halaman tugas
        if (document.getElementById('view-guru-tugas') && !document.getElementById('view-guru-tugas').classList.contains('hidden')) {
            window.renderGuruTugasList();
        }
    });

    db.ref('submissions').on('value', snap => {
        allSubmissionsData = snap.val() || {};
        if (document.getElementById('view-guru-tugas') && !document.getElementById('view-guru-tugas').classList.contains('hidden')) {
            window.renderGuruTugasList(); 
        }
    });
};

window.openBuatTugasModal = function() { document.getElementById('modal-buat-tugas').classList.remove('hidden'); };
window.closeBuatTugasModal = function() { document.getElementById('modal-buat-tugas').classList.add('hidden'); };

window.simpanTugas = function() {
    const title = document.getElementById('tugas-title').value;
    const desc = document.getElementById('tugas-desc').value;
    const deadline = document.getElementById('tugas-deadline').value;
    
    if (!title || !desc || !deadline) return alert("Harap isi semua kolom!");

    db.ref('tasks').push({ 
        title: title, 
        desc: desc, 
        deadline: deadline, 
        timestamp: firebase.database.ServerValue.TIMESTAMP 
    })
    .then(() => { 
        alert("✅ Tugas berhasil dibuat!");
        window.closeBuatTugasModal();
        // Paksa render ulang agar langsung terlihat
        if (document.getElementById('view-guru-tugas') && !document.getElementById('view-guru-tugas').classList.contains('hidden')) {
            window.renderGuruTugasList();
        }
    })
    .catch(err => {
        alert("❌ Gagal membuat tugas. Pastikan aturan Firebase Rules mengizinkan Write.\n\nError: " + err.message);
    });
};

window.renderGuruTugasList = function() {
    const container = document.getElementById('guru-tugas-list');
    if(!container) return;
    container.innerHTML = '';

    if (allTasks.length === 0) {
        container.innerHTML = `<div class="col-span-full p-8 text-center bg-rose-50 text-rose-600 border border-rose-200 rounded-lg"><i class="fa-solid fa-triangle-exclamation text-3xl mb-3 block"></i><span class="font-bold text-lg">Daftar Tugas Kosong!</span><br><span class="text-sm">Silakan klik tombol <b>"Generate Tugas Awal"</b> di atas.</span></div>`;
        return;
    }

    allTasks.forEach(t => {
        let submittedCount = 0;
        for (const cls in allSubmissionsData) {
            for (const name in allSubmissionsData[cls]) {
                if (allSubmissionsData[cls][name][t.id]) submittedCount++;
            }
        }

        container.innerHTML += `
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-bold text-lg text-slate-800 leading-tight">${t.title}</h3>
                        <span class="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-1 rounded"><i class="fa-regular fa-clock"></i> ${t.deadline}</span>
                    </div>
                    <div class="text-sm text-slate-500 line-clamp-2 mt-2">${t.desc}</div>
                </div>
                <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div class="text-sm font-bold text-emerald-600">
                        <i class="fa-solid fa-users mr-1"></i> ${submittedCount} Mengumpulkan
                    </div>
                    <button onclick="openLihatPengumpulan('${t.id}', '${t.title}')" class="bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition">
                        Lihat Rekap <i class="fa-solid fa-arrow-right ml-1"></i>
                    </button>
                </div>
            </div>
        `;
    });
};
