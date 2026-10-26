// ==========================================
// TASKS SYSTEM (Firebase + Fallback Dummy)
// ==========================================

let allTasks = [];
let currentSelectedTaskId = null;

document.addEventListener("DOMContentLoaded", () => {
    // Sinkronisasi data tugas dari Firebase
    db.ref('tasks').on('value', (snapshot) => {
        allTasks = [];
        snapshot.forEach((childSnapshot) => {
            allTasks.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });
        allTasks.reverse();
        
        // Jika Database kosong, buatkan 1 tugas awal agar siswa bisa lihat
        if (allTasks.length === 0) {
            db.ref('tasks').push({
                title: 'Tugas Perkenalan: Microsoft Word',
                desc: 'Buatlah dokumen Word berisi biodata diri Anda (Nama, Kelas, Alamat, Cita-cita). Gunakan format Bold pada Nama, dan Italic pada Cita-cita. Kumpulkan dalam bentuk link Google Drive (PDF).',
                deadline: '2026-12-31',
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            return; // Hentikan render, tunggu update listener
        }
        
        // Render sesuai role
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
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex justify-between items-center">
                <div>
                    <h3 class="font-bold text-lg text-slate-800">${t.title}</h3>
                    <p class="text-sm text-slate-500 mt-1">Deadline: <b>${t.deadline}</b></p>
                </div>
                <button onclick="hapusTugas('${t.id}')" class="bg-rose-100 text-rose-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-rose-600 hover:text-white transition"><i class="fa-solid fa-trash"></i> Hapus</button>
            </div>
        `;
    });
}

function hapusTugas(id) {
    if (confirm("Yakin ingin menghapus tugas ini?")) {
        db.ref('tasks/' + id).remove().then(() => alert("Tugas dihapus."));
    }
}

// ------------------------------------------
// LOGIKA SISWA
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

    if(!studentName) return; // Tunggu profil selesai diisi

    // Ambil data pengumpulan tugas siswa ini
    db.ref(`submissions/${studentClass}/${studentName}`).on('value', subSnap => {
        const mySubmissions = subSnap.val() || {};

        container.innerHTML = '';
        allTasks.forEach(t => {
            const isSubmitted = mySubmissions[t.id];
            let statusHtml = isSubmitted 
                ? `<span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold"><i class="fa-solid fa-check-circle mr-1"></i> Terkumpul</span>`
                : `<button onclick="openKumpulTugasModal('${t.id}', '${t.title}')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition">Kumpulkan</button>`;

            container.innerHTML += `
                <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-3">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-bold text-lg text-slate-800">${t.title}</h3>
                        <span class="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-1 rounded">Tenggat: ${t.deadline}</span>
                    </div>
                    <p class="text-sm text-slate-600 mb-4">${t.desc}</p>
                    <div class="flex justify-end">${statusHtml}</div>
                </div>
            `;
        });
    });
}

function openKumpulTugasModal(taskId, title) {
    currentSelectedTaskId = taskId;
    document.getElementById('kumpul-tugas-title').innerText = "Tugas: " + title;
    document.getElementById('link-tugas').value = "";
    document.getElementById('modal-kumpul-tugas').classList.remove('hidden');
}

function closeKumpulTugasModal() {
    document.getElementById('modal-kumpul-tugas').classList.add('hidden');
}

function kirimTugas() {
    const link = document.getElementById('link-tugas').value;
    if (!link || !link.includes('http')) return alert("Masukkan link Google Drive yang valid!");

    const studentName = localStorage.getItem("student_name");
    const studentClass = localStorage.getItem("student_class");

    db.ref(`submissions/${studentClass}/${studentName}/${currentSelectedTaskId}`).set({
        link: link,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        alert("✅ Tugas berhasil dikumpulkan!");
        closeKumpulTugasModal();
    }).catch(err => alert("Gagal mengumpulkan tugas: " + err.message));
}
