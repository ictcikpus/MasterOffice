// ==========================================
// TASKS SYSTEM (GLOBAL LISTENER & AUTO-RENDER)
// Master Office LMS
// ==========================================

const GAS_URL = "https://script.google.com/macros/s/AKfycbxu2pRUrXHIex2xABFFANCxvrhWHialnwst3e3VPHZBl9arG8WAWRmcj_U_eFAGWOEZCA/exec";
const FOLDER_ID = "1_K4XXQc4umLJPpKmnpwEUcIGX9ed7m6e"; 

let allTasks = [];
let allSubmissionsData = {}; 
let currentSelectedTaskId = null; 
let currentViewingTaskId = null; 

const todayStrTasks = new Date().toISOString().split('T')[0];

// ==========================================
// 1. GLOBAL LISTENER (Mendengar Perubahan Data)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Jalankan pendeteksi database setiap kali halaman dibuka
    listenToFirebaseData();
});

function listenToFirebaseData() {
    // Listener Tugas
    db.ref('tasks').on('value', snap => {
        allTasks = [];
        snap.forEach(child => {
            allTasks.push({ id: child.key, ...child.val() });
        });
        allTasks.reverse(); // Tugas terbaru di paling atas
        
        // Update angka statistik di Dashboard Guru
        const statTugas = document.getElementById('stat-tugas');
        if(statTugas) statTugas.innerText = allTasks.length;
        
        // Paksa render ke layar (Guru & Siswa)
        forceRender();
    }, error => {
        console.error("Gagal membaca Tugas:", error);
    });

    // Listener Pengumpulan Tugas
    db.ref('submissions').on('value', snap => {
        allSubmissionsData = snap.val() || {};
        forceRender(); // Paksa render jika ada siswa baru yang kumpul
    }, error => {
        console.error("Gagal membaca Pengumpulan:", error);
    });
}

// Fungsi untuk memaksa layar menggambar ulang data
function forceRender() {
    const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
    
    if (isTeacher) {
        if (typeof window.renderGuruTugasList === 'function') window.renderGuruTugasList();
    } else {
        if (typeof renderSiswaTugas === 'function') renderSiswaTugas();
    }
}

// ==========================================
// 2. FUNGSI UNTUK GURU
// ==========================================
window.initTeacherTasks = function() {
    forceRender(); // Dipanggil oleh auth.js saat guru login
};

window.openBuatTugasModal = function() { 
    document.getElementById('modal-buat-tugas').classList.remove('hidden'); 
};

window.closeBuatTugasModal = function() { 
    document.getElementById('modal-buat-tugas').classList.add('hidden'); 
};

window.simpanTugas = function() {
    const title = document.getElementById('tugas-title').value.trim();
    const desc = document.getElementById('tugas-desc').value.trim();
    const deadline = document.getElementById('tugas-deadline').value;
    
    if (!title || !desc || !deadline) return alert("⚠️ Harap isi semua kolom!");

    const btn = document.querySelector('#modal-buat-tugas button[onclick="simpanTugas()"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

    // Simpan ke Firebase
    db.ref('tasks').push({ 
        title: title, 
        desc: desc, 
        deadline: deadline, 
        timestamp: firebase.database.ServerValue.TIMESTAMP 
    })
    .then(() => { 
        alert("✅ Tugas berhasil dibuat dan disinkronkan!");
        
        // Kosongkan form
        document.getElementById('tugas-title').value = '';
        document.getElementById('tugas-desc').value = '';
        document.getElementById('tugas-deadline').value = '';
        
        window.closeBuatTugasModal();
        
        // Paksa pindah ke halaman kelola tugas agar guru langsung melihat hasilnya
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
    if(!container) return; // Hentikan jika wadahnya tidak ada di halaman saat ini

    container.innerHTML = '';

    if (allTasks.length === 0) {
        container.innerHTML = `<div class="col-span-full p-8 text-center bg-rose-50 text-rose-600 border border-rose-200 rounded-lg"><i class="fa-solid fa-triangle-exclamation text-3xl mb-3 block"></i><span class="font-bold text-lg">Daftar Tugas Kosong!</span><br><span class="text-sm">Silakan buat tugas baru.</span></div>`;
        return;
    }

    allTasks.forEach(t => {
        let submittedCount = 0;
        // Hitung jumlah siswa yang mengumpulkan
        for (const cls in allSubmissionsData) {
            for (const name in allSubmissionsData[cls]) {
                if (allSubmissionsData[cls][name][t.id]) submittedCount++;
            }
        }

        // Cek apakah deskripsi mengandung tag HTML untuk mencegah error
        const safeDesc = t.desc ? t.desc : "Tidak ada instruksi.";
        
        try {
            container.innerHTML += `
                <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden">
                    <div>
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-lg text-slate-800 leading-tight pr-2">${t.title}</h3>
                            <span class="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap"><i class="fa-regular fa-clock"></i> ${t.deadline}</span>
                        </div>
                        <div class="text-sm text-slate-500 line-clamp-3 mt-2 overflow-hidden">${safeDesc}</div>
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
        } catch (e) {
            console.error("Gagal merender tugas:", t.title, e);
        }
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
// 3. FUNGSI UNTUK SISWA
// ==========================================
function renderSiswaTugas() {
    const container = document.getElementById('siswa-tugas-list');
    if(!container) return; // Hentikan jika tidak ada wadah di halaman ini
    
    const studentName = localStorage.getItem("student_name");
    const studentClass = localStorage.getItem("student_class");

    if(!studentName || !studentClass) {
        container.innerHTML = `<div class="text-center p-8 bg-amber-50 rounded-2xl border border-amber-200"><i class="fa-solid fa-user-slash text-4xl text-amber-500 mb-3"></i><p class="text-amber-700 font-bold">Profil Anda belum lengkap.</p></div>`;
        return;
    }

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

        const safeDesc = t.desc ? t.desc : "Tidak ada instruksi.";

        try {
            container.innerHTML += `
                <div class="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm mb-4 overflow-hidden">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2 border-b border-slate-100 pb-3">
                        <h3 class="font-bold text-xl text-slate-800 pr-2">${t.title}</h3>
                        <span class="bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"><i class="fa-regular fa-clock mr-1"></i> Tenggat: ${t.deadline}</span>
                    </div>
                    <div class="text-slate-600 mb-5 overflow-hidden">${safeDesc}</div>
                    <div class="flex justify-end">${statusHtml}</div>
                </div>
            `;
        } catch (e) {
            console.error("Gagal merender tugas siswa:", e);
        }
    });
}

window.openKumpulTugasModal = function(taskId, title) {
    const studentName = localStorage.getItem("student_name");
    const studentClass = localStorage.getItem("student_class");
    
    const btn = event ? event.target.closest('button') : null;
    let originalText = "";
    if(btn) {
        originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cek...';
        btn.disabled = true;
    }

    db.ref(`attendance/${todayStrTasks}/${studentClass}/${studentName}`).once('value').then(snap => {
        if(btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }

        if (!snap.exists()) {
            alert("⚠️ ANDA BELUM ABSEN HARI INI!\n\nAnda harus mengisi kehadiran di menu 'Absensi' terlebih dahulu.");
            if(typeof navigate === 'function') navigate('absen');
            return;
        }

        currentSelectedTaskId = taskId;
        document.getElementById('kumpul-tugas-title').innerText = "Tugas: " + title;
        document.getElementById('link-tugas').value = "";
        document.getElementById('file-tugas').value = "";
        document.getElementById('modal-kumpul-tugas').classList.remove('hidden');
    }).catch(err => {
        console.error("Error check absen:", err);
        if(btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
};

window.closeKumpulTugasModal = function() { 
    document.getElementById('modal-kumpul-tugas').classList.add('hidden'); 
};

window.prosesKumpulTugas = async function() {
    const linkInput = document.getElementById('link-tugas').value.trim();
    const fileInput = document.getElementById('file-tugas');
    const file = fileInput.files[0];

    if (!linkInput && !file) return alert("Silakan masukkan Link Google Docs ATAU unggah file PDF Anda.");
    if (linkInput && !linkInput.includes('http')) return alert("Format link tidak valid.");

    const btn = document.getElementById('btn-submit-tugas');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Memproses...';

    if (linkInput) {
        saveSubmissionToFirebase(linkInput);
    } else if (file) {
        if (file.size > 5 * 1024 * 1024) { 
            alert("❌ Ukuran file maksimal 5MB."); 
            btn.disabled = false; btn.innerHTML = originalText; return; 
        }
        uploadFileToDrive(file);
    }
};

function uploadFileToDrive(file) {
    const btn = document.getElementById('btn-submit-tugas');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Mengunggah...';

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
            alert(`❌ Gagal mengunggah file.\n\nPesan Error: ${error.message}`);
            btn.disabled = false; btn.innerHTML = originalText;
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
        alert("✅ Tugas berhasil dikumpulkan!");
        window.closeKumpulTugasModal();
        document.getElementById('btn-submit-tugas').disabled = false;
        document.getElementById('btn-submit-tugas').innerHTML = 'Kirim';
    }).catch(err => {
        alert("Gagal menyimpan link: " + err.message);
        document.getElementById('btn-submit-tugas').disabled = false;
        document.getElementById('btn-submit-tugas').innerHTML = 'Kirim';
    });
}
