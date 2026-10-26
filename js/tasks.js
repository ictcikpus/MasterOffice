// ==========================================
// TASKS SYSTEM (Firebase + Google Apps Script Upload)
// ==========================================

// URL Google Apps Script Anda
const GAS_URL = "https://script.google.com/macros/s/AKfycbxu2pRUrXHIex2xABFFANCxvrhWHialnwst3e3VPHZBl9arG8WAWRmcj_U_eFAGWOEZCA/exec";

let allTasks = [];
let currentSelectedTaskId = null;

document.addEventListener("DOMContentLoaded", () => {
    db.ref('tasks').on('value', (snapshot) => {
        allTasks = [];
        snapshot.forEach((childSnapshot) => {
            allTasks.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });
        allTasks.reverse();
        
        // Buat tugas otomatis jika kosong (untuk testing awal)
        if (allTasks.length === 0) {
            db.ref('tasks').push({
                title: 'Tugas Perkenalan: Microsoft Word',
                desc: 'Buatlah dokumen Word berisi biodata diri Anda (Nama, Kelas, Alamat, Cita-cita). Unggah file PDF-nya di sini.',
                deadline: '2026-12-31',
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            return; 
        }
        
        const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
        if (isTeacher) {
            renderGuruTugas();
            document.getElementById('stat-tugas').innerText = allTasks.length;
        } else {
            renderSiswaTugas();
        }
    });
});

// ------------------------------------------
// LOGIKA GURU
// ------------------------------------------
function openBuatTugasModal() {
    document.getElementById('modal-buat-tugas').classList.remove('hidden');
}
function closeBuatTugasModal() {
    document.getElementById('modal-buat-tugas').classList.add('hidden');
    document.getElementById('tugas-title').value = '';
    document.getElementById('tugas-desc').value = '';
    document.getElementById('tugas-deadline').value = '';
}

function simpanTugas() {
    const title = document.getElementById('tugas-title').value;
    const desc = document.getElementById('tugas-desc').value;
    const deadline = document.getElementById('tugas-deadline').value;

    if (!title || !desc || !deadline) return alert("Harap isi semua kolom tugas!");

    db.ref('tasks').push({
        title: title,
        desc: desc,
        deadline: deadline,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        alert("✅ Tugas berhasil dibuat!");
        closeBuatTugasModal();
    }).catch(err => alert("Gagal membuat tugas: " + err.message));
}

function renderGuruTugas() {
    const container = document.getElementById('guru-tugas-list');
    if(!container) return;
    
    container.innerHTML = '';
    if (allTasks.length === 0) {
        container.innerHTML = `<div class="text-center p-8 bg-white rounded-2xl border border-slate-200"><p class="text-slate-500">Belum ada tugas.</p></div>`;
        return;
    }

    allTasks.forEach(t => {
        container.innerHTML += `
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 class="font-bold text-lg text-slate-800">${t.title}</h3>
                    <p class="text-sm text-slate-500 mt-1">Deadline: <b>${t.deadline}</b></p>
                </div>
                <div class="flex gap-2 w-full md:w-auto">
                    <button onclick="lihatPengumpulan('${t.id}', '${t.title}')" class="flex-1 md:flex-none bg-sky-100 text-sky-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-sky-600 hover:text-white transition"><i class="fa-solid fa-eye"></i> Cek Tugas</button>
                    <button onclick="hapusTugas('${t.id}')" class="bg-rose-100 text-rose-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-rose-600 hover:text-white transition"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

function hapusTugas(id) {
    if (confirm("Yakin ingin menghapus tugas ini? Siswa tidak akan bisa melihat tugas ini lagi.")) {
        db.ref('tasks/' + id).remove().then(() => alert("Tugas dihapus."));
    }
}

function lihatPengumpulan(taskId, title) {
    document.getElementById('lihat-pengumpulan-title').innerText = "Tugas: " + title;
    const container = document.getElementById('daftar-pengumpulan');
    container.innerHTML = '<p class="text-center text-slate-500 py-6"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data siswa...</p>';
    document.getElementById('modal-lihat-pengumpulan').classList.remove('hidden');

    db.ref('submissions').once('value').then(snapshot => {
        container.innerHTML = '';
        let found = false;
        
        snapshot.forEach(classSnap => {
            const className = classSnap.key;
            classSnap.forEach(studentSnap => {
                const studentName = studentSnap.key;
                const submissions = studentSnap.val();
                
                // Jika siswa ini mengumpulkan tugas yang sedang dicek
                if (submissions[taskId]) {
                    found = true;
                    const sub = submissions[taskId];
                    container.innerHTML += `
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center p-3 border-b border-slate-100 hover:bg-slate-50 gap-2">
                            <div>
                                <p class="font-bold text-slate-800">${studentName}</p>
                                <p class="text-xs text-slate-500">${className}</p>
                            </div>
                            <a href="${sub.link}" target="_blank" class="bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2">
                                <i class="fa-brands fa-google-drive"></i> Buka File Tugas
                            </a>
                        </div>
                    `;
                }
            });
        });
        
        if (!found) {
            container.innerHTML = '<p class="text-center text-slate-500 py-6">Belum ada siswa yang mengumpulkan tugas ini.</p>';
        }
    });
}

// ------------------------------------------
// LOGIKA SISWA (UPLOAD FILE)
// ------------------------------------------
function renderSiswaTugas() {
    const container = document.getElementById('siswa-tugas-list');
    if(!container) return;
    
    container.innerHTML = '';
    if (allTasks.length === 0) {
        container.innerHTML = `<div class="text-center p-8 bg-white rounded-2xl border border-slate-200"><p class="text-slate-500">Belum ada tugas dari Guru.</p></div>`;
        return;
    }

    const studentName = localStorage.getItem("student_name");
    const studentClass = localStorage.getItem("student_class");

    if(!studentName) return; 

    db.ref(`submissions/${studentClass}/${studentName}`).on('value', subSnap => {
        const mySubmissions = subSnap.val() || {};

        container.innerHTML = '';
        allTasks.forEach(t => {
            const isSubmitted = mySubmissions[t.id];
            let statusHtml = isSubmitted 
                ? `<span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold"><i class="fa-solid fa-check-circle mr-1"></i> Sudah Dikumpulkan</span>`
                : `<button onclick="openKumpulTugasModal('${t.id}', '${t.title}')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition">Kumpulkan Tugas</button>`;

            container.innerHTML += `
                <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-3">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
                        <h3 class="font-bold text-lg text-slate-800">${t.title}</h3>
                        <span class="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded">Tenggat: ${t.deadline}</span>
                    </div>
                    <p class="text-sm text-slate-600 mb-4">${t.desc}</p>
                    <div class="flex justify-end border-t border-slate-100 pt-3">${statusHtml}</div>
                </div>
            `;
        });
    });
}

function openKumpulTugasModal(taskId, title) {
    currentSelectedTaskId = taskId;
    document.getElementById('kumpul-tugas-title').innerText = "Tugas: " + title;
    document.getElementById('file-tugas').value = ""; // Reset file input
    document.getElementById('modal-kumpul-tugas').classList.remove('hidden');
}

function closeKumpulTugasModal() {
    document.getElementById('modal-kumpul-tugas').classList.add('hidden');
}

// FUNGSI UNTUK UPLOAD FILE KE GOOGLE DRIVE VIA APPS SCRIPT
async function uploadDanKirimTugas() {
    const fileInput = document.getElementById('file-tugas');
    const file = fileInput.files[0];

    if (!file) return alert("Pilih file tugas terlebih dahulu!");
    
    // Validasi ukuran file (maksimal 5MB untuk mencegah error memori)
    if (file.size > 5 * 1024 * 1024) {
        return alert("❌ Ukuran file terlalu besar. Maksimal 5MB.");
    }

    const btn = document.getElementById('btn-submit-tugas');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Mengunggah...';

    const reader = new FileReader();
    reader.onload = async function(e) {
        // Ambil string base64 saja (buang awalan data:image/png;base64,)
        const base64Data = e.target.result.split(',')[1]; 
        const mimeType = file.type;
        const studentName = localStorage.getItem("student_name");
        const filename = `${studentName}_${Date.now()}_${file.name}`;

        try {
            // Kirim data ke Google Apps Script
            const response = await fetch(GAS_URL, {
                method: 'POST',
                body: JSON.stringify({
                    file: base64Data,
                    filename: filename,
                    mimeType: mimeType
                })
            });

            const result = await response.json();

            if (result.status === 'success' && result.url) {
                // Jika berhasil diupload, simpan URL Drive ke Firebase
                saveSubmissionToFirebase(result.url);
            } else {
                throw new Error(result.message || "Gagal mengunggah ke Google Drive.");
            }
        } catch (error) {
            console.error("Upload Error:", error);
            alert(`❌ Gagal mengunggah file.\n\nPesan Error: ${error.message}\n\nPastikan Google Apps Script sudah di-deploy dengan akses "Anyone".`);
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    };
    reader.readAsDataURL(file);
}

function saveSubmissionToFirebase(driveUrl) {
    const studentName = localStorage.getItem("student_name");
    const studentClass = localStorage.getItem("student_class");

    db.ref(`submissions/${studentClass}/${studentName}/${currentSelectedTaskId}`).set({
        link: driveUrl,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        alert("✅ Tugas berhasil diunggah dan dikumpulkan!");
        closeKumpulTugasModal();
        
        // Kembalikan tombol ke keadaan semula
        const btn = document.getElementById('btn-submit-tugas');
        btn.disabled = false;
        btn.innerHTML = 'Kirim';
    }).catch(err => {
        alert("Gagal menyimpan link ke database: " + err.message);
        const btn = document.getElementById('btn-submit-tugas');
        btn.disabled = false;
        btn.innerHTML = 'Kirim';
    });
}
