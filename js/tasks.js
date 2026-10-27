// ==========================================
// TASKS SYSTEM (Robust UI & Sync)
// ==========================================

const GAS_URL = "https://script.google.com/macros/s/AKfycbxu2pRUrXHIex2xABFFANCxvrhWHialnwst3e3VPHZBl9arG8WAWRmcj_U_eFAGWOEZCA/exec";
const FOLDER_ID = "1_K4XXQc4umLJPpKmnpwEUcIGX9ed7m6e"; 

let allTasks = [];
let allSubmissionsData = {}; 
let currentSelectedTaskId = null; 
let currentViewingTaskId = null; 

const todayStrTasks = new Date().toISOString().split('T')[0];

document.addEventListener("DOMContentLoaded", () => {
    listenToFirebaseData();
    const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
    if (!isTeacher) {
        setTimeout(() => { renderSiswaTugas(); }, 500);
    }
});

function listenToFirebaseData() {
    db.ref('tasks').on('value', snap => {
        allTasks = [];
        snap.forEach(child => allTasks.push({ id: child.key, ...child.val() }));
        allTasks.reverse(); 
        
        const statTugas = document.getElementById('stat-tugas');
        if(statTugas) statTugas.innerText = allTasks.length;
        
        const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
        if (isTeacher) {
            // Render jika sedang di halaman kelola tugas
            if (document.getElementById('view-guru-tugas') && !document.getElementById('view-guru-tugas').classList.contains('hidden')) {
                window.renderGuruTugasList();
            }
        } else {
            renderSiswaTugas();
        }
    }, error => console.error("Error tasks:", error));

    db.ref('submissions').on('value', snap => {
        allSubmissionsData = snap.val() || {};
        const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
        if (isTeacher) {
            if (document.getElementById('view-guru-tugas') && !document.getElementById('view-guru-tugas').classList.contains('hidden')) {
                window.renderGuruTugasList(); 
            }
        } else {
            renderSiswaTugas(); 
        }
    });
}

// ==========================================
// FUNGSI GURU
// ==========================================
window.openBuatTugasModal = function() { document.getElementById('modal-buat-tugas').classList.remove('hidden'); };
window.closeBuatTugasModal = function() { document.getElementById('modal-buat-tugas').classList.add('hidden'); };

window.simpanTugas = function() {
    const title = document.getElementById('tugas-title').value.trim();
    const desc = document.getElementById('tugas-desc').value.trim();
    const deadline = document.getElementById('tugas-deadline').value;
    
    if (!title || !desc || !deadline) return alert("⚠️ Harap isi semua kolom!");

    const btn = document.querySelector('#modal-buat-tugas button[onclick="simpanTugas()"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

    db.ref('tasks').push({ 
        title: title, 
        desc: desc, 
        deadline: deadline, 
        timestamp: firebase.database.ServerValue.TIMESTAMP 
    })
    .then(() => { 
        alert("✅ Tugas berhasil dibuat dan dikirim ke database!");
        document.getElementById('tugas-title').value = '';
        document.getElementById('tugas-desc').value = '';
        document.getElementById('tugas-deadline').value = '';
        window.closeBuatTugasModal();
        
        // Paksa pindah ke halaman kelola tugas agar guru langsung melihatnya
        if (typeof navigate === 'function') navigate('guru-tugas');
        
        btn.disabled = false;
        btn.innerHTML = originalText;
    })
    .catch(err => {
        alert("❌ GAGAL MENYIMPAN!\n\nError: " + err.message);
        btn.disabled = false;
        btn.innerHTML = originalText;
    });
};

window.renderGuruTugasList = function() {
    const container = document.getElementById('guru-tugas-list');
    if(!container) return;
    container.innerHTML = '';

    if (allTasks.length === 0) {
        container.innerHTML = `<div class="col-span-full p-8 text-center bg-rose-50 text-rose-600 border border-rose-200 rounded-lg"><i class="fa-solid fa-triangle-exclamation text-3xl mb-3 block"></i><span class="font-bold text-lg">Daftar Tugas Kosong!</span><br><span class="text-sm">Silakan klik tombol <b>"Buat Tugas Baru"</b>.</span></div>`;
        return;
    }

    allTasks.forEach(t => {
        let submittedCount = 0;
        for (const cls in allSubmissionsData) {
            for (const name in allSubmissionsData[cls]) {
                if (allSubmissionsData[cls][name][t.id]) submittedCount++;
            }
        }

        // PEMBARUAN: Deskripsi dibungkus div overflow-hidden agar HTML rusak tidak merusak card
        container.innerHTML += `
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden">
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-bold text-lg text-slate-800 leading-tight pr-2">${t.title}</h3>
                        <span class="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap"><i class="fa-regular fa-clock"></i> ${t.deadline}</span>
                    </div>
                    <div class="text-sm text-slate-500 line-clamp-3 mt-2 overflow-hidden">${t.desc}</div>
                </div>
                <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div class="text-sm font-bold text-emerald-600">
                        <i class="fa-solid fa-users mr-1"></i> ${submittedCount} Kumpul
                    </div>
                    <button onclick="openLihatPengumpulan('${t.id}', '${t.title}')" class="bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">
                        Lihat Rekap <i class="fa-solid fa-arrow-right ml-1"></i>
                    </button>
                </div>
            </div>
        `;
    });
};

window.openLihatPengumpulan = function(taskId, title) {
    currentViewingTaskId = taskId;
    document.getElementById('lihat-pengumpulan-title').innerText = title;
    document.getElementById('filter-kelas-modal').value = 'all';
    document.getElementById('modal-lihat-pengumpulan').classList.remove('hidden');
    window.renderModalPengumpulan();
};

window.renderModalPengumpulan = function() {
    const filterKelas = document.getElementById('filter-kelas-modal').value;
    const tbody = document.getElementById('daftar-pengumpulan');
    tbody.innerHTML = '';

    let found = false;
    for (const cls in allSubmissionsData) {
        if (filterKelas !== 'all' && filterKelas !== cls) continue;
        for (const name in allSubmissionsData[cls]) {
            const sub = allSubmissionsData[cls][name][currentViewingTaskId];
            if (sub) {
                found = true;
                tbody.innerHTML += `
                    <tr class="hover:bg-slate-50 transition-colors">
                        <td class="p-3 font-medium text-slate-700">${name}</td>
                        <td class="p-3 text-sky-600 font-bold">${cls}</td>
                        <td class="p-3 text-center">
                            <a href="${sub.link}" target="_blank" class="inline-block bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white px-3 py-1 rounded text-xs font-bold transition">
                                <i class="fa-solid fa-external-link-alt mr-1"></i> Buka File
                            </a>
                        </td>
                    </tr>
                `;
            }
        }
    }
    if (!found) {
        tbody.innerHTML = `<tr><td colspan="3" class="p-6 text-center text-slate-500">Belum ada siswa yang mengumpulkan tugas ini.</td></tr>`;
    }
};

// ==========================================
// FUNGSI SISWA
// ==========================================
function renderSiswaTugas() {
    const container = document.getElementById('siswa-tugas-list');
    if(!container) return;
    
    const studentName = localStorage.getItem("student_name");
    const studentClass = localStorage.getItem("student_class");

    if(!studentName || !studentClass) return;

    container.innerHTML = '';
    if (allTasks.length === 0) {
        container.innerHTML = `<div class="text-center p-8 bg-white rounded-2xl border border-slate-200"><i class="fa-solid fa-folder-open text-4xl text-slate-300 mb-3"></i><p class="text-slate-500 font-bold">Belum ada tugas dari Guru.</p></div>`;
        return;
    }

    const mySubmissions = allSubmissionsData[studentClass]?.[studentName] || {};

    allTasks.forEach(t => {
        const isSubmitted = mySubmissions[t.id];
        let statusHtml = isSubmitted 
            ? `<span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold"><i class="fa-solid fa-check-circle mr-1"></i> Sudah Dikumpulkan</span>`
            : `<button onclick="window.openKumpulTugasModal('${t.id}', '${t.title}')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition"><i class="fa-solid fa-paper-plane mr-1"></i> Kumpulkan Tugas</button>`;

        container.innerHTML += `
            <div class="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm mb-4 overflow-hidden">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2 border-b border-slate-100 pb-3">
                    <h3 class="font-bold text-xl text-slate-800 pr-2">${t.title}</h3>
                    <span class="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"><i class="fa-regular fa-clock mr-1"></i> Tenggat: ${t.deadline}</span>
                </div>
                <div class="text-slate-600 mb-5 overflow-hidden">${t.desc}</div>
                <div class="flex justify-end">${statusHtml}</div>
            </div>
        `;
    });
}
// (Fungsi openKumpulTugasModal, prosesKumpulTugas, dll tetap sama)
