// ==========================================
// TASKS SYSTEM (Master-Detail View)
// ==========================================

const GAS_URL = "https://script.google.com/macros/s/AKfycbxu2pRUrXHIex2xABFFANCxvrhWHialnwst3e3VPHZBl9arG8WAWRmcj_U_eFAGWOEZCA/exec";
const FOLDER_ID = "1_K4XXQc4umLJPpKmnpwEUcIGX9ed7m6e";

let allTasks = [];
let allSubmissionsData = {}; 
let allAttendanceToday = {}; 
let currentSelectedTaskId = null;
let currentViewingTaskId = null; // Untuk Modal Lihat Pengumpulan

const todayStrTasks = new Date().toISOString().split('T')[0];
let isTeacherTasksListenerAttached = false;

document.addEventListener("DOMContentLoaded", () => {
    const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
    if (!isTeacher) {
        initStudentTasksData();
    }
});

// ==========================================
// INISIALISASI DATA SISWA
// ==========================================
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

// ==========================================
// INISIALISASI DATA GURU
// ==========================================
window.initTeacherTasks = function() {
    if (isTeacherTasksListenerAttached) return;
    isTeacherTasksListenerAttached = true;

    db.ref('tasks').on('value', snap => {
        allTasks = [];
        snap.forEach(child => allTasks.push({ id: child.key, ...child.val() }));
        allTasks.reverse();
        
        const statTugas = document.getElementById('stat-tugas');
        if(statTugas) statTugas.innerText = allTasks.length;
        
        // Render daftar kartu tugas guru
        if (document.getElementById('view-guru-tugas') && !document.getElementById('view-guru-tugas').classList.contains('hidden')) {
            window.renderGuruTugasList();
        }
    });

    db.ref('submissions').on('value', snap => {
        allSubmissionsData = snap.val() || {};
        if (document.getElementById('view-guru-tugas') && !document.getElementById('view-guru-tugas').classList.contains('hidden')) {
            window.renderGuruTugasList(); // Update jumlah pengumpulan di kartu
        }
    });

    db.ref(`attendance/${todayStrTasks}`).on('value', snap => {
        allAttendanceToday = snap.val() || {};
        let count = 0;
        for (const cls in allAttendanceToday) {
            count += Object.keys(allAttendanceToday[cls]).length;
        }
        const statHadir = document.getElementById('stat-hadir');
        if(statHadir) statHadir.innerText = count;
    });
};

// ==========================================
// FUNGSI GURU (RENDER KARTU & MODAL)
// ==========================================
window.generateDefaultTasks = function() {
    if (!confirm("Ini akan menambahkan 3 Tugas Default ke dalam daftar. Lanjutkan?")) return;
    const defaultTasks = [
        { title: 'Tugas 1: Surat Jalan Perusahaan (Word / Google Docs)', desc: '<p>Buat surat jalan...</p>', deadline: '2026-10-31' },
        { title: 'Tugas 2: Catatan Uang Kas Pribadi (Excel / Google Sheets)', desc: '<p>Buat tabel kas...</p>', deadline: '2026-11-15' },
        { title: 'Tugas 3: Presentasi Peluncuran Produk (PPT / Google Slides)', desc: '<p>Buat 4 slide...</p>', deadline: '2026-11-30' }
    ];
    const promises = defaultTasks.map(t => db.ref('tasks').push({ ...t, timestamp: firebase.database.ServerValue.TIMESTAMP }));
    Promise.all(promises).then(() => alert("✅ 3 Tugas Default berhasil ditambahkan!"));
};

window.openBuatTugasModal = function() { document.getElementById('modal-buat-tugas').classList.remove('hidden'); };
window.closeBuatTugasModal = function() { document.getElementById('modal-buat-tugas').classList.add('hidden'); };

window.simpanTugas = function() {
    const title = document.getElementById('tugas-title').value;
    const desc = document.getElementById('tugas-desc').value;
    const deadline = document.getElementById('tugas-deadline').value;
    if (!title || !desc || !deadline) return alert("Harap isi semua kolom!");
    db.ref('tasks').push({ title: title, desc: desc, deadline: deadline, timestamp: firebase.database.ServerValue.TIMESTAMP })
    .then(() => { alert("✅ Tugas dibuat!"); window.closeBuatTugasModal(); });
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
        // Hitung berapa siswa yang sudah mengumpulkan tugas ini
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
        tbody.innerHTML = `<tr><td colspan="3" class="p-6 text-center text-slate-500">Belum ada siswa yang mengumpulkan tugas ini untuk filter kelas tersebut.</td></tr>`;
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

window.openKumpulTugasModal = function(taskId, title) {
    const studentName = localStorage.getItem("student_name");
    const studentClass = localStorage.getItem("student_class");
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cek...';
    btn.disabled = true;

    db.ref(`attendance/${todayStrTasks}/${studentClass}/${studentName}`).once('value').then(snap => {
        btn.innerHTML = originalText;
        btn.disabled = false;

        if (!snap.exists()) {
            alert("⚠️ ANDA BELUM ABSEN HARI INI!\n\nSilakan isi kehadiran di menu 'Absensi' terlebih dahulu.");
            if(typeof navigate === 'function') navigate('absen');
            return;
        }

        currentSelectedTaskId = taskId;
        document.getElementById('kumpul-tugas-title').innerText = "Tugas: " + title;
        document.getElementById('link-tugas').value = "";
        document.getElementById('file-tugas').value = "";
        document.getElementById('modal-kumpul-tugas').classList.remove('hidden');
    });
};

window.closeKumpulTugasModal = function() { document.getElementById('modal-kumpul-tugas').classList.add('hidden'); };

window.prosesKumpulTugas = async function() {
    const linkInput = document.getElementById('link-tugas').value.trim();
    const fileInput = document.getElementById('file-tugas');
    const file = fileInput.files[0];

    if (!linkInput && !file) return alert("Masukkan Link atau Upload File.");
    if (linkInput && !linkInput.includes('http')) return alert("Format link salah.");

    const btn = document.getElementById('btn-submit-tugas');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';

    if (linkInput) {
        saveSubmissionToFirebase(linkInput);
    } else if (file) {
        if (file.size > 5 * 1024 * 1024) { alert("Maks 5MB."); btn.disabled = false; btn.innerHTML = 'Kirim'; return; }
        uploadFileToDrive(file);
    }
};

function uploadFileToDrive(file) {
    const btn = document.getElementById('btn-submit-tugas');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengunggah...';
    const reader = new FileReader();
    reader.onload = async function(e) {
        const base64Data = e.target.result.split(',')[1]; 
        const mimeType = file.type;
        const studentName = localStorage.getItem("student_name");
        const filename = `${studentName}_${Date.now()}_${file.name}`;

        try {
            const response = await fetch(GAS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ file: base64Data, filename: filename, mimeType: mimeType, folderId: FOLDER_ID })
            });
            const result = await response.json();
            if (result.status === 'success' && result.url) {
                saveSubmissionToFirebase(result.url);
            } else {
                throw new Error(result.message || "Gagal mengunggah.");
            }
        } catch (error) {
            alert(`❌ Gagal: ${error.message}`);
            btn.disabled = false; btn.innerHTML = 'Kirim';
        }
    };
    reader.readAsDataURL(file);
}

function saveSubmissionToFirebase(submissionUrl) {
    const studentName = localStorage.getItem("student_name");
    const studentClass = localStorage.getItem("student_class");
    db.ref(`submissions/${studentClass}/${studentName}/${currentSelectedTaskId}`).set({
        link: submissionUrl, timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        alert("✅ Tugas Dikumpulkan!");
        window.closeKumpulTugasModal();
    });
}
