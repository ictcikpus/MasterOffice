// ==========================================
// TASKS SYSTEM (Firebase + Google Apps Script)
// ==========================================

const GAS_URL = "https://script.google.com/macros/s/AKfycbxu2pRUrXHIex2xABFFANCxvrhWHialnwst3e3VPHZBl9arG8WAWRmcj_U_eFAGWOEZCA/exec";

let allTasks = [];
let allSubmissionsData = {}; // Menyimpan data semua submission
let allAttendanceToday = {}; // Menyimpan data absen hari ini

const todayStr = new Date().toISOString().split('T')[0];

document.addEventListener("DOMContentLoaded", () => {
    const isTeacher = sessionStorage.getItem('is_teacher') === 'true';

    if (isTeacher) {
        // Guru: Tarik data tugas, submission, dan absen hari ini
        db.ref('tasks').on('value', snap => {
            allTasks = [];
            snap.forEach(child => allTasks.push({ id: child.key, ...child.val() }));
            allTasks.reverse();
            
            document.getElementById('stat-tugas').innerText = allTasks.length;
            
            // Jika sedang di halaman kelola tugas, render ulang
            if (!document.getElementById('view-guru-tugas').classList.contains('hidden')) {
                renderRekapTugasGuru();
            }
        });

        db.ref('submissions').on('value', snap => {
            allSubmissionsData = snap.val() || {};
            if (!document.getElementById('view-guru-tugas').classList.contains('hidden')) {
                renderRekapTugasGuru();
            }
        });

        db.ref(`attendance/${todayStr}`).on('value', snap => {
            allAttendanceToday = snap.val() || {};
            let count = 0;
            for (const cls in allAttendanceToday) {
                count += Object.keys(allAttendanceToday[cls]).length;
            }
            document.getElementById('stat-hadir').innerText = count;
        });

    } else {
        // Siswa: Tarik data tugas & submission mereka sendiri
        db.ref('tasks').on('value', snapshot => {
            allTasks = [];
            snapshot.forEach(childSnapshot => {
                allTasks.push({ id: childSnapshot.key, ...childSnapshot.val() });
            });
            allTasks.reverse();
            renderSiswaTugas();
        });
    }
});

// ==========================================
// FUNGSI GENERATE TUGAS DEFAULT (MANUAL)
// ==========================================
function generateDefaultTasks() {
    if (!confirm("Ini akan menambahkan 3 Tugas Default (Surat Jalan, Uang Kas, Presentasi) ke dalam daftar.\n\nLanjutkan?")) return;

    const defaultTasks = [
        {
            title: 'Tugas 1: Surat Jalan Perusahaan (Word / Google Docs)',
            desc: `
                <p class="mb-3 font-medium text-slate-700">Tugas ini melatih Anda membuat dokumen administrasi bisnis yang formal.</p>
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <ol class="list-decimal pl-5 space-y-2 text-sm text-slate-600">
                        <li>Buat dokumen baru. Judul di tengah: <b>"PT. MAJU BERSAMA SEJAHTERA"</b> dan sub-judul <b>"SURAT JALAN"</b>.</li>
                        <li>Buat format surat: <b>No. Surat, Tanggal, Kepada, Alamat</b>.</li>
                        <li>Buat <b>Tabel</b>: <i>No, Nama Barang, Kuantitas, Keterangan</i>. Isi 3 barang fiktif.</li>
                        <li>Buat area tanda tangan "Pengirim" (kiri) dan "Penerima" (kanan).</li>
                        <li>Kumpulkan dalam bentuk PDF atau Link Google Docs (Anyone with the link).</li>
                    </ol>
                </div>`,
            deadline: '2026-10-31'
        },
        {
            title: 'Tugas 2: Catatan Uang Kas Pribadi (Excel / Google Sheets)',
            desc: `
                <p class="mb-3 font-medium text-slate-700">Tugas ini melatih pengelolaan data keuangan dasar menggunakan rumus.</p>
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <ol class="list-decimal pl-5 space-y-2 text-sm text-slate-600">
                        <li>Header: <b>Tanggal, Keterangan, Pemasukan (Rp), Pengeluaran (Rp), Saldo (Rp)</b>.</li>
                        <li>Isi minimal <b>5 baris data</b> fiktif.</li>
                        <li>Kolom <b>Saldo</b> gunakan rumus: <code>=C2-D2</code> (baris 1), <code>=E2+C3-D3</code> (baris 2), dst.</li>
                        <li>Gunakan fungsi <b>SUM</b> untuk Total Pemasukan dan Pengeluaran di paling bawah.</li>
                        <li>Format angka menjadi <b>Mata Uang (Currency)</b>.</li>
                    </ol>
                </div>`,
            deadline: '2026-11-15'
        },
        {
            title: 'Tugas 3: Presentasi Peluncuran Produk (PPT / Google Slides)',
            desc: `
                <p class="mb-3 font-medium text-slate-700">Tugas merancang materi presentasi visual yang komunikatif.</p>
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <ol class="list-decimal pl-5 space-y-2 text-sm text-slate-600">
                        <li>Buat minimal <b>4 slide</b> untuk produk pilihan Anda.</li>
                        <li>Slide 1: Nama Produk & Tagline. Slide 2: Fitur. Slide 3: Harga. Slide 4: Penutup.</li>
                        <li>Tambahkan <b>Gambar</b> relevan di setiap slide.</li>
                        <li>Gunakan fitur <b>Transisi (Transition)</b> antar slide.</li>
                    </ol>
                </div>`,
            deadline: '2026-11-30'
        }
    ];

    const promises = defaultTasks.map(t => db.ref('tasks').push({ ...t, timestamp: firebase.database.ServerValue.TIMESTAMP }));
    
    Promise.all(promises).then(() => {
        alert("✅ 3 Tugas Default berhasil ditambahkan!");
    }).catch(err => alert("Gagal membuat tugas default: " + err.message));
}


// ==========================================
// LOGIKA GURU (REKAP TUGAS TERPADU)
// ==========================================
function openBuatTugasModal() { document.getElementById('modal-buat-tugas').classList.remove('hidden'); }
function closeBuatTugasModal() { document.getElementById('modal-buat-tugas').classList.add('hidden'); }

function simpanTugas() {
    const title = document.getElementById('tugas-title').value;
    const desc = document.getElementById('tugas-desc').value;
    const deadline = document.getElementById('tugas-deadline').value;

    if (!title || !desc || !deadline) return alert("Harap isi semua kolom tugas!");

    db.ref('tasks').push({
        title: title, desc: desc, deadline: deadline, timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => {
        alert("✅ Tugas berhasil dibuat!");
        closeBuatTugasModal();
    }).catch(err => alert("Gagal membuat tugas: " + err.message));
}

function renderRekapTugasGuru() {
    const filterKelas = document.getElementById('filter-kelas-tugas').value;
    const tbody = document.getElementById('body-rekap-tugas');
    tbody.innerHTML = '';

    // Ambil daftar nama dari data submission dan data absensi
    let studentList = [];

    // Dari data submission
    if (allSubmissionsData) {
        for (const cls in allSubmissionsData) {
            if (filterKelas === 'all' || filterKelas === cls) {
                for (const name in allSubmissionsData[cls]) {
                    studentList.push({ name, class: cls, id: `${cls}_${name}` });
                }
            }
        }
    }

    // Dari data absensi hari ini (jika ada siswa yang absen tapi belum pernah submit tugas)
    if (allAttendanceToday) {
        for (const cls in allAttendanceToday) {
            if (filterKelas === 'all' || filterKelas === cls) {
                for (const name in allAttendanceToday[cls]) {
                    if (!studentList.find(s => s.name === name && s.class === cls)) {
                        studentList.push({ name, class: cls, id: `${cls}_${name}` });
                    }
                }
            }
        }
    }

    if (studentList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="p-6 text-center text-slate-500">Belum ada data siswa untuk filter ini.</td></tr>`;
        return;
    }

    // Render baris per siswa
    studentList.forEach(student => {
        let statusTugasHtml = '<div class="flex flex-wrap gap-1">';
        
        allTasks.forEach((task, index) => {
            const isSubmitted = allSubmissionsData[student.class]?.[student.name]?.[task.id];
            const icon = isSubmitted ? 'fa-check-circle text-emerald-500' : 'fa-times-circle text-rose-300';
            const titleText = isSubmitted ? `Tugas ${index+1}: Sudah (Klik untuk buka)` : `Tugas ${index+1}: Belum`;
            
            if (isSubmitted) {
                statusTugasHtml += `
                    <a href="${isSubmitted.link}" target="_blank" title="${titleText}" class="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded cursor-pointer transition">
                        <i class="fa-solid ${icon}"></i> T${index+1}
                    </a>`;
            } else {
                statusTugasHtml += `
                    <span title="${titleText}" class="bg-slate-50 border border-slate-200 px-2 py-1 rounded">
                        <i class="fa-solid ${icon}"></i> T${index+1}
                    </span>`;
            }
        });
        
        statusTugasHtml += '</div>';

        tbody.innerHTML += `
            <tr class="hover:bg-slate-50 border-b border-slate-100 transition-colors">
                <td class="p-3 font-medium text-slate-700">${student.name}</td>
                <td class="p-3 text-sky-600 font-bold">${student.class}</td>
                <td class="p-3">${statusTugasHtml}</td>
            </tr>
        `;
    });
}


// ==========================================
// LOGIKA SISWA (WAJIB ABSEN & RENDER TUGAS)
// ==========================================
function renderSiswaTugas() {
    const container = document.getElementById('siswa-tugas-list');
    if(!container) return;
    
    container.innerHTML = '';
    const studentName = localStorage.getItem("student_name");
    const studentClass = localStorage.getItem("student_class");

    if(!studentName) return; 

    // Cek apakah siswa sudah absen hari ini
    db.ref(`attendance/${todayStr}/${studentClass}/${studentName}`).once('value').then(attSnap => {
        const hasAbsen = attSnap.exists();

        if (!hasAbsen) {
            container.innerHTML = `
                <div class="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center shadow-sm">
                    <i class="fa-solid fa-triangle-exclamation text-5xl text-rose-500 mb-4 animate-pulse"></i>
                    <h3 class="text-xl font-bold text-rose-700 mb-2">Anda Belum Absen Hari Ini!</h3>
                    <p class="text-slate-600 mb-6">Sesuai aturan, Anda harus mengisi kehadiran (Absensi) terlebih dahulu sebelum dapat melihat dan mengumpulkan tugas.</p>
                    <button onclick="navigate('absen')" class="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg">
                        <i class="fa-solid fa-fingerprint mr-2"></i> Menuju Halaman Absensi
                    </button>
                </div>
            `;
            return;
        }

        // Jika sudah absen, tarik status submission
        db.ref(`submissions/${studentClass}/${studentName}`).on('value', subSnap => {
            const mySubmissions = subSnap.val() || {};
            container.innerHTML = '';

            if (allTasks.length === 0) {
                container.innerHTML = `<div class="text-center p-8 bg-white rounded-2xl border border-slate-200"><p class="text-slate-500">Belum ada tugas dari Guru.</p></div>`;
                return;
            }

            allTasks.forEach(t => {
                const isSubmitted = mySubmissions[t.id];
                let statusHtml = isSubmitted 
                    ? `<span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold"><i class="fa-solid fa-check-circle mr-1"></i> Sudah Dikumpulkan</span>`
                    : `<button onclick="openKumpulTugasModal('${t.id}', '${t.title}')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition"><i class="fa-solid fa-paper-plane mr-1"></i> Kumpulkan Tugas</button>`;

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
        });
    });
}

function openKumpulTugasModal(taskId, title) {
    currentSelectedTaskId = taskId;
    document.getElementById('kumpul-tugas-title').innerText = "Tugas: " + title;
    document.getElementById('link-tugas').value = "";
    document.getElementById('file-tugas').value = "";
    document.getElementById('modal-kumpul-tugas').classList.remove('hidden');
}

function closeKumpulTugasModal() { document.getElementById('modal-kumpul-tugas').classList.add('hidden'); }

async function prosesKumpulTugas() {
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
        if (file.size > 5 * 1024 * 1024) { alert("❌ Ukuran file maksimal 5MB."); btn.disabled = false; btn.innerHTML = originalText; return; }
        uploadFileToDrive(file);
    }
}

function uploadFileToDrive(file) {
    const btn = document.getElementById('btn-submit-tugas');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Mengunggah ke Drive...';

    const reader = new FileReader();
    reader.onload = async function(e) {
        const base64Data = e.target.result.split(',')[1]; 
        const mimeType = file.type;
        const studentName = localStorage.getItem("student_name");
        const filename = `${studentName}_${Date.now()}_${file.name}`;

        try {
            const response = await fetch(GAS_URL, {
                method: 'POST',
                body: JSON.stringify({ file: base64Data, filename: filename, mimeType: mimeType })
            });
            const result = await response.json();
            if (result.status === 'success' && result.url) {
                saveSubmissionToFirebase(result.url);
            } else {
                throw new Error(result.message || "Gagal mengunggah ke Google Drive.");
            }
        } catch (error) {
            console.error("Upload Error:", error);
            alert(`❌ Gagal mengunggah file.\n\nPesan Error: ${error.message}`);
            btn.disabled = false;
            btn.innerHTML = originalText;
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
        closeKumpulTugasModal();
        document.getElementById('btn-submit-tugas').disabled = false;
        document.getElementById('btn-submit-tugas').innerHTML = 'Kirim';
    }).catch(err => {
        alert("Gagal menyimpan link ke database: " + err.message);
        document.getElementById('btn-submit-tugas').disabled = false;
        document.getElementById('btn-submit-tugas').innerHTML = 'Kirim';
    });
}
