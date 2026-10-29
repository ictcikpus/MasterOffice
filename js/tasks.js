// ==========================================
// TASKS SYSTEM (FINAL VERSION - CLEAN CONSOLE)
// ==========================================

const GAS_URL = "https://script.google.com/macros/s/AKfycbxu2pRUrXHIex2xABFFANCxvrhWHialnwst3e3VPHZBl9arG8WAWRmcj_U_eFAGWOEZCA/exec";
const FOLDER_ID = "1_K4XXQc4umLJPpKmnpwEUcIGX9ed7m6e"; 

let allTasks = [];
let allSubmissionsData = {}; 
let currentSelectedTaskId = null; 
let currentViewingTaskId = null; 
let currentEditTaskId = null;

const todayStrTasks = new Date().toISOString().split('T')[0];

function escapeHTML(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function stripHtml(html) {
    if (!html) return "";
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
}

// 1. INISIALISASI
document.addEventListener("DOMContentLoaded", () => {
    listenToFirebaseData();
    
    // EVENT DELEGATION UNTUK TOMBOL
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.btn-edit-guru')) {
            const id = e.target.closest('.btn-edit-guru').dataset.id;
            window.editTugas(id);
        }
        if (e.target.closest('.btn-hapus-guru')) {
            const id = e.target.closest('.btn-hapus-guru').dataset.id;
            window.hapusTugas(id);
        }
        if (e.target.closest('.btn-rekap-guru')) {
            const btn = e.target.closest('.btn-rekap-guru');
            window.openLihatPengumpulan(btn.dataset.id, btn.dataset.title);
        }
        if (e.target.closest('.btn-kumpul-siswa')) {
            const btn = e.target.closest('.btn-kumpul-siswa');
            window.openKumpulTugasModal(btn.dataset.id, btn.dataset.title, btn.dataset.link || '');
        }
    });
});

function listenToFirebaseData() {
    db.ref('tasks').on('value', snap => {
        allTasks = [];
        snap.forEach(child => allTasks.push({ id: child.key, ...child.val() }));
        allTasks.reverse(); 
        
        try {
            const statTugas = document.getElementById('stat-tugas');
            if(statTugas) statTugas.innerText = allTasks.length;
        } catch (e) {}

        forceRender();
    }, error => console.error("❌ Error Firebase Tasks:", error));

    db.ref('submissions').on('value', snap => {
        allSubmissionsData = snap.val() || {};
        forceRender(); 
    });
}

function forceRender() {
    if (document.getElementById('guru-tugas-list')) window.renderGuruTugasList();
    if (document.getElementById('siswa-tugas-list')) renderSiswaTugas();
}

// ==========================================
// 2. FUNGSI GURU (RENDER KARTU)
// ==========================================
window.renderGuruTugasList = function() {
    const container = document.getElementById('guru-tugas-list');
    if(!container) return;
    container.innerHTML = '';

    if (allTasks.length === 0) {
        container.innerHTML = `<div class="col-span-full p-8 text-center bg-rose-50 text-rose-600 border border-rose-200 rounded-lg">
            <i class="fa-solid fa-triangle-exclamation text-3xl mb-3 block"></i>
            <span class="font-bold text-lg">Daftar Tugas Kosong!</span>
        </div>`;
        return;
    }

    let htmlString = "";

    allTasks.forEach((t, index) => {
        try {
            const taskId = t.id || "unknown_" + index;
            const title = escapeHTML(t.title || "Tanpa Judul");
            const deadline = escapeHTML(t.deadline || "-");
            
            let cleanDesc = stripHtml(t.desc);
            if(cleanDesc.length > 100) cleanDesc = cleanDesc.substring(0, 100) + "...";
            cleanDesc = escapeHTML(cleanDesc);

            let submittedCount = 0;
            for (const cls in allSubmissionsData) {
                for (const name in allSubmissionsData[cls]) {
                    if (allSubmissionsData[cls] && allSubmissionsData[cls][name] && allSubmissionsData[cls][name][taskId]) {
                        submittedCount++;
                    }
                }
            }

            htmlString += `
                <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative">
                    <div>
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-lg text-slate-800 leading-tight pr-2">${title}</h3>
                            <span class="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap"><i class="fa-regular fa-clock"></i> ${deadline}</span>
                        </div>
                        <p class="text-sm text-slate-500 mt-2">${cleanDesc}</p>
                    </div>
                    <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div class="text-sm font-bold text-emerald-600">
                            <i class="fa-solid fa-users mr-1"></i> ${submittedCount} Kumpul
                        </div>
                        <div class="flex gap-2">
                            <button data-id="${taskId}" class="btn-edit-guru bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white p-2 rounded-lg transition" title="Edit"><i class="fa-solid fa-pen"></i></button>
                            <button data-id="${taskId}" class="btn-hapus-guru bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white p-2 rounded-lg transition" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                            <button data-id="${taskId}" data-title="${title}" class="btn-rekap-guru bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition">Rekap <i class="fa-solid fa-arrow-right ml-1"></i></button>
                        </div>
                    </div>
                </div>
            `;
        } catch (err) {
            console.error(`❌ GAGAL MERENDER TUGAS GURU KE-${index + 1}:`, err, t);
            htmlString += `
                <div class="bg-rose-50 rounded-2xl border border-rose-200 p-5 shadow-sm">
                    <p class="text-rose-600 font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Gagal memuat Tugas ke-${index + 1}</p>
                    <p class="text-xs text-rose-400 mt-1">Data tugas ini rusak atau tidak lengkap.</p>
                </div>
            `;
        }
    });

    container.innerHTML = htmlString;
};

// ==========================================
// 3. FUNGSI SISWA (RENDER KARTU)
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
    let htmlString = "";

    allTasks.forEach((t, index) => {
        try {
            const taskId = t.id || "unknown_" + index;
            const title = escapeHTML(t.title || "Tanpa Judul");
            const deadline = escapeHTML(t.deadline || "-");
            const desc = escapeHTML(stripHtml(t.desc || "Tidak ada instruksi."));
            
            const isSubmitted = mySubmissions[taskId];
            let statusHtml = "";

            if (isSubmitted && typeof isSubmitted === 'object') {
                const submittedLink = escapeHTML(isSubmitted.link || "");
                
                statusHtml = `
                    <div class="flex flex-wrap items-center justify-end gap-2">
                        <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold"><i class="fa-solid fa-check-circle mr-1"></i> Sudah Dikumpulkan</span>
                        <button data-id="${taskId}" data-title="${title}" data-link="${submittedLink}" class="btn-kumpul-siswa bg-amber-100 text-amber-700 hover:bg-amber-500 hover:text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition">
                            <i class="fa-solid fa-pen mr-1"></i> Edit Tugas
                        </button>
                    </div>
                `;
            } else {
                statusHtml = `
                    <div class="flex flex-wrap items-center justify-end gap-2">
                        <button data-id="${taskId}" data-title="${title}" class="btn-kumpul-siswa bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition">
                            <i class="fa-solid fa-paper-plane mr-1"></i> Kumpulkan Tugas
                        </button>
                    </div>
                `;
            }

            htmlString += `
                <div class="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm mb-4 overflow-hidden">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2 border-b border-slate-100 pb-3">
                        <h3 class="font-bold text-xl text-slate-800 pr-2">${title}</h3>
                        <span class="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"><i class="fa-regular fa-clock mr-1"></i> Tenggat: ${deadline}</span>
                    </div>
                    <div class="text-slate-600 mb-5 whitespace-pre-wrap">${desc}</div>
                    <div class="flex justify-end">${statusHtml}</div>
                </div>
            `;
        } catch (err) {
            console.error(`❌ GAGAL MERENDER TUGAS SISWA KE-${index + 1}:`, err, t);
            htmlString += `
                <div class="bg-rose-50 rounded-2xl border border-rose-200 p-5 shadow-sm mb-4">
                    <p class="text-rose-600 font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Gagal memuat Tugas ke-${index + 1}</p>
                </div>
            `;
        }
    });

    container.innerHTML = htmlString;
}

// ==========================================
// 4. FUNGSI LAINNYA (Modal, Edit, Hapus, Kumpul)
// ==========================================
window.initTeacherTasks = function() { forceRender(); };

window.openBuatTugasModal = function() {
    currentEditTaskId = null;
    document.getElementById('modal-tugas-title').innerText = "Buat Tugas Baru";
    document.getElementById('tugas-title').value = '';
    document.getElementById('tugas-desc').value = '';
    document.getElementById('tugas-deadline').value = '';
    document.getElementById('modal-buat-tugas').classList.remove('hidden'); 
};

window.closeBuatTugasModal = function() { document.getElementById('modal-buat-tugas').classList.add('hidden'); };

window.editTugas = function(id) {
    const task = allTasks.find(t => t.id === id);
    if(!task) return;
    currentEditTaskId = id;
    document.getElementById('modal-tugas-title').innerText = "Edit Tugas";
    document.getElementById('tugas-title').value = task.title || "";
    document.getElementById('tugas-desc').value = task.desc || "";
    document.getElementById('tugas-deadline').value = task.deadline || "";
    document.getElementById('modal-buat-tugas').classList.remove('hidden');
};

window.hapusTugas = function(id) {
    if(confirm("⚠️ Yakin ingin menghapus tugas ini?")) {
        db.ref('tasks/' + id).remove().then(() => alert("✅ Tugas dihapus."));
    }
};

window.simpanTugas = function() {
    const title = document.getElementById('tugas-title').value.trim();
    const desc = document.getElementById('tugas-desc').value.trim();
    const deadline = document.getElementById('tugas-deadline').value;
    if (!title || !desc || !deadline) return alert("⚠️ Harap isi semua kolom!");

    const btn = document.getElementById('btn-simpan-tugas');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

    const taskData = { title, desc, deadline, timestamp: firebase.database.ServerValue.TIMESTAMP };

    if (currentEditTaskId) {
        db.ref('tasks/' + currentEditTaskId).update(taskData).then(() => {
            alert("✅ Tugas diperbarui!");
            window.closeBuatTugasModal();
            btn.disabled = false; btn.innerHTML = originalText;
        });
    } else {
        db.ref('tasks').push(taskData).then(() => { 
            alert("✅ Tugas dibuat!");
            window.closeBuatTugasModal();
            if (typeof navigate === 'function') navigate('guru-tugas');
            btn.disabled = false; btn.innerHTML = originalText;
        });
    }
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
            if (allSubmissionsData[cls][name] && allSubmissionsData[cls][name][currentViewingTaskId]) {
                const sub = allSubmissionsData[cls][name][currentViewingTaskId];
                found = true;
                tbody.innerHTML += `
                    <tr class="hover:bg-slate-50 transition-colors">
                        <td class="p-3 font-medium text-slate-700">${name}</td>
                        <td class="p-3 text-sky-600 font-bold">${cls}</td>
                        <td class="p-3 text-center">
                            <a href="${sub.link}" target="_blank" class="inline-block bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white px-3 py-1 rounded text-xs font-bold transition">Buka</a>
                        </td>
                    </tr>
                `;
            }
        }
    }
    if (!found) tbody.innerHTML = `<tr><td colspan="3" class="p-6 text-center text-slate-500">Belum ada siswa yang mengumpulkan.</td></tr>`;
};

window.openKumpulTugasModal = function(taskId, title, existingLink = '') {
    const studentName = localStorage.getItem("student_name");
    const studentClass = localStorage.getItem("student_class");
    
    db.ref(`attendance/${todayStrTasks}/${studentClass}/${studentName}`).once('value').then(snap => {
        if (!snap.exists()) {
            alert("⚠️ ANDA BELUM ABSEN HARI INI!\n\nSilakan isi kehadiran di menu 'Absensi'.");
            if(typeof navigate === 'function') navigate('absen');
            return;
        }
        currentSelectedTaskId = taskId;
        document.getElementById('kumpul-tugas-title').innerText = "Tugas: " + title;
        document.getElementById('link-tugas').value = existingLink || "";
        document.getElementById('file-tugas').value = "";
        
        const btnSubmit = document.getElementById('btn-submit-tugas');
        if (existingLink) btnSubmit.innerHTML = 'Perbarui Tugas';
        else btnSubmit.innerHTML = 'Kirim';

        document.getElementById('modal-kumpul-tugas').classList.remove('hidden');
    });
};

window.closeKumpulTugasModal = function() { document.getElementById('modal-kumpul-tugas').classList.add('hidden'); };

window.prosesKumpulTugas = async function() {
    const linkInput = document.getElementById('link-tugas').value.trim();
    const fileInput = document.getElementById('file-tugas');
    const file = fileInput.files[0];

    if (!linkInput && !file) return alert("Masukkan Link ATAU Upload File.");
    if (linkInput && !linkInput.includes('http')) return alert("Format link salah.");

    const btn = document.getElementById('btn-submit-tugas');
    btn.disabled = true; 
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
    
    if (linkInput) {
        saveSubmissionToFirebase(linkInput);
    } else if (file) {
        if (file.size > 5 * 1024 * 1024) { 
            alert("❌ Ukuran file maksimal 5MB."); 
            btn.disabled = false; btn.innerHTML = 'Kirim'; return; 
        }
        uploadFileToDrive(file);
    }
};

function uploadFileToDrive(file) {
    const btn = document.getElementById('btn-submit-tugas');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengunggah...';
    const reader = new FileReader();
    reader.onload = async function(e) {
        const base64Data = e.target.result.split(',')[1]; 
        const studentName = localStorage.getItem("student_name");
        const filename = `${studentName}_${Date.now()}_${file.name}`;
        try {
            const response = await fetch(GAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ file: base64Data, filename: filename, mimeType: file.type, folderId: FOLDER_ID }) });
            const result = await response.json();
            if (result.status === 'success' && result.url) {
                saveSubmissionToFirebase(result.url);
            } else {
                throw new Error(result.message || "Gagal.");
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
        link: submissionUrl, 
        timestamp: firebase.database.ServerValue.TIMESTAMP 
    }).then(() => {
        alert("✅ Tugas berhasil disimpan!"); 
        window.closeKumpulTugasModal();
        document.getElementById('btn-submit-tugas').disabled = false; 
        document.getElementById('btn-submit-tugas').innerHTML = 'Kirim';
    });
}
