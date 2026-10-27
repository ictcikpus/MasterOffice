// ==========================================
// TASKS SYSTEM (FULL PROGRAM & ANTI-CRASH LOOP)
// Master Office LMS
// ==========================================

const GAS_URL = "https://script.google.com/macros/s/AKfycbxu2pRUrXHIex2xABFFANCxvrhWHialnwst3e3VPHZBl9arG8WAWRmcj_U_eFAGWOEZCA/exec";
const FOLDER_ID = "1_K4XXQc4umLJPpKmnpwEUcIGX9ed7m6e"; 

let allTasks = [];
let allSubmissionsData = {}; 
let currentSelectedTaskId = null; 
let currentViewingTaskId = null; 
let currentEditTaskId = null;

const todayStrTasks = new Date().toISOString().split('T')[0];

// Fungsi pembersih HTML (mencegah crash jika deskripsi berisi tag aneh)
function stripHtml(html) {
    if (!html) return "";
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
}

// ==========================================
// 1. INISIALISASI & LISTENER FIREBASE
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    listenToFirebaseData();
});

function listenToFirebaseData() {
    // Listener Tugas
    db.ref('tasks').on('value', snap => {
        allTasks = [];
        snap.forEach(child => {
            // Pastikan data yang masuk memiliki ID
            allTasks.push({ id: child.key, ...child.val() });
        });
        allTasks.reverse(); // Urutkan dari yang terbaru
        
        const statTugas = document.getElementById('stat-tugas');
        if(statTugas) statTugas.innerText = allTasks.length;
        
        forceRender();
    }, error => {
        console.error("Error baca tugas:", error);
    });

    // Listener Pengumpulan
    db.ref('submissions').on('value', snap => {
        allSubmissionsData = snap.val() || {};
        forceRender();
    });
}

function forceRender() {
    if (document.getElementById('guru-tugas-list')) {
        window.renderGuruTugasList();
    }
    if (document.getElementById('siswa-tugas-list')) {
        renderSiswaTugas();
    }
}

// ==========================================
// 2. FUNGSI GURU (RENDER KARTU & CRUD)
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
    if(confirm("⚠️ Yakin ingin menghapus tugas ini?\n\nData pengumpulan siswa juga akan terhapus permanen.")) {
        db.ref('tasks/' + id).remove()
        .then(() => alert("✅ Tugas berhasil dihapus."))
        .catch(err => alert("Gagal menghapus: " + err.message));
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
        db.ref('tasks/' + currentEditTaskId).update(taskData)
        .then(() => {
            alert("✅ Tugas berhasil diperbarui!");
            window.closeBuatTugasModal();
            btn.disabled = false; btn.innerHTML = originalText;
        })
        .catch(err => {
            alert("❌ Gagal update: " + err.message);
            btn.disabled = false; btn.innerHTML = originalText;
        });
    } else {
        db.ref('tasks').push(taskData)
        .then(() => { 
            alert("✅ Tugas baru berhasil dibuat!");
            window.closeBuatTugasModal();
            if (typeof navigate === 'function') navigate('guru-tugas');
            btn.disabled = false; btn.innerHTML = originalText;
        })
        .catch(err => {
            alert("❌ Gagal menyimpan: " + err.message);
            btn.disabled = false; btn.innerHTML = originalText;
        });
    }
};

window.renderGuruTugasList = function() {
    const container = document.getElementById('guru-tugas-list');
    if(!container) return;
    container.innerHTML = '';

    if (allTasks.length === 0) {
        container.innerHTML = `<div class="col-span-full p-8 text-center bg-rose-50 text-rose-600 border border-rose-200 rounded-lg"><i class="fa-solid fa-triangle-exclamation text-3xl mb-3 block"></i><span class="font-bold text-lg">Daftar Tugas Kosong!</span></div>`;
        return;
    }

    let htmlString = "";

    allTasks.forEach(t => {
        // ANTI-CRASH: Gunakan try-catch untuk setiap tugas
        try {
            let submittedCount = 0;
            for (const cls in allSubmissionsData) {
                for (const name in allSubmissionsData[cls]) {
                    if (allSubmissionsData[cls][name] && allSubmissionsData[cls][name][t.id]) submittedCount++;
                }
            }

            // Nilai Default (Cadangan) jika data kosong
            const taskId = t.id || "unknown";
            const title = t.title || "Tanpa Judul";
            const deadline = t.deadline || "-";
            const desc = t.desc || "Tidak ada instruksi.";
            
            let cleanDesc = stripHtml(desc);
            if(cleanDesc.length > 100) cleanDesc = cleanDesc.substring(0, 100) + "...";

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
                            <button onclick="editTugas('${taskId}')" class="bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white p-2 rounded-lg transition" title="Edit Tugas"><i class="fa-solid fa-pen"></i></button>
                            <button onclick="hapusTugas('${taskId}')" class="bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white p-2 rounded-lg transition" title="Hapus Tugas"><i class="fa-solid fa-trash"></i></button>
                            <button onclick="openLihatPengumpulan('${taskId}', '${title.replace(/'/g, "\\'")}')" class="bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition">Rekap <i class="fa-solid fa-arrow-right ml-1"></i></button>
                        </div>
                    </div>
                </div>
            `;
        } catch (err) {
            // Jika satu tugas error, lanjut ke tugas berikutnya tanpa menghentikan seluruh proses
            console.error("Gagal merender satu tugas guru:", err, t);
        }
    });

    container.innerHTML = htmlString;
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
                                <i class="fa-solid fa-external-link-alt mr-1"></i> Buka
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
// 3. FUNGSI SISWA (MELIHAT & KUMPUL TUGAS)
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

    allTasks.forEach(t => {
        try {
            const isSubmitted = mySubmissions[t.id];
            let statusHtml = isSubmitted 
                ? `<span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold"><i class="fa-solid fa-check-circle mr-1"></i> Sudah Dikumpulkan</span>`
                : `<button onclick="window.openKumpulTugasModal('${t.id}', '${t.title.replace(/'/g, "\\'")}')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition"><i class="fa-solid fa-paper-plane mr-1"></i> Kumpulkan Tugas</button>`;

            const title = t.title || "Tanpa Judul";
            const deadline = t.deadline || "-";
            const desc = t.desc || "Tidak ada instruksi.";

            htmlString += `
                <div class="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm mb-4 overflow-hidden">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2 border-b border-slate-100 pb-3">
                        <h3 class="font-bold text-xl text-slate-800 pr-2">${title}</h3>
                        <span class="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"><i class="fa-regular fa-clock mr-1"></i> Tenggat: ${deadline}</span>
                    </div>
                    <div class="text-slate-600 mb-5 overflow-hidden">${desc}</div>
                    <div class="flex justify-end">${statusHtml}</div>
                </div>
            `;
        } catch (err) {
            console.error("Gagal merender satu tugas siswa:", err, t);
        }
    });

    container.innerHTML = htmlString;
}

window.openKumpulTugasModal = function(taskId, title) {
    const studentName = localStorage.getItem("student_name");
    const studentClass = localStorage.getItem("student_class");
    const btn = event ? event.target.closest('button') : null;
    if(btn) { btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cek...'; btn.disabled = true; }

    db.ref(`attendance/${todayStrTasks}/${studentClass}/${studentName}`).once('value').then(snap => {
        if(btn) { btn.innerHTML = 'Kumpulkan Tugas'; btn.disabled = false; }
        if (!snap.exists()) {
            alert("⚠️ ANDA BELUM ABSEN HARI INI!\n\nSilakan isi kehadiran di menu 'Absensi'.");
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
    if (!linkInput && !file) return alert("Masukkan Link ATAU Upload File.");
    if (linkInput && !linkInput.includes('http')) return alert("Format link salah.");
    const btn = document.getElementById('btn-submit-tugas');
    btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
    if (linkInput) saveSubmissionToFirebase(linkInput);
    else if (file) uploadFileToDrive(file);
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
            if (result.status === 'success' && result.url) saveSubmissionToFirebase(result.url);
            else throw new Error(result.message || "Gagal.");
        } catch (error) {
            alert(`❌ Gagal: ${error.message}`); btn.disabled = false; btn.innerHTML = 'Kirim';
        }
    };
    reader.readAsDataURL(file);
}

function saveSubmissionToFirebase(submissionUrl) {
    const studentName = localStorage.getItem("student_name");
    const studentClass = localStorage.getItem("student_class");
    db.ref(`submissions/${studentClass}/${studentName}/${currentSelectedTaskId}`).set({ link: submissionUrl, timestamp: firebase.database.ServerValue.TIMESTAMP })
    .then(() => {
        alert("✅ Tugas berhasil dikumpulkan!"); window.closeKumpulTugasModal();
        document.getElementById('btn-submit-tugas').disabled = false; document.getElementById('btn-submit-tugas').innerHTML = 'Kirim';
    });
}
