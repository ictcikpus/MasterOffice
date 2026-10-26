// ==========================================
// TASKS SYSTEM (Firebase + Google Apps Script)
// ==========================================

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
        
        // Tugas Perdana (Jika database kosong)
        if (allTasks.length === 0) {
            generateDefaultTasks();
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

// Fungsi untuk membuat 3 tugas default
function generateDefaultTasks() {
    // --- TUGAS 1: WORD / GOOGLE DOCS ---
    db.ref('tasks').push({
        title: 'Tugas 1: Surat Jalan Perusahaan (Word / Google Docs)',
        desc: `
            <p class="mb-3 font-medium text-slate-700">Tugas ini melatih Anda membuat dokumen administrasi bisnis yang formal menggunakan aplikasi pengolah kata.</p>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 class="font-bold text-slate-800 mb-2">Instruksi (Pilih salah satu: Ms. Word atau Google Docs):</h4>
                <ol class="list-decimal pl-5 space-y-2 text-sm text-slate-600">
                    <li>Buat dokumen baru. Ketik Judul di tengah (Align Center): <b>"PT. MAJU BERSAMA SEJAHTERA"</b> dan sub-judul <b>"SURAT JALAN"</b>.</li>
                    <li>Di bawahnya, buat format surat berisi: <b>No. Surat, Tanggal, Kepada (Tujuan), dan Alamat</b>.</li>
                    <li>Buat sebuah <b>Tabel</b> dengan kolom: <i>No, Nama Barang, Kuantitas, dan Keterangan</i>. Isi dengan 3 barang fiktif.</li>
                    <li>Di bagian paling bawah, buat area tanda tangan untuk "Pengirim" (kiri) dan "Penerima" (kanan).</li>
                    <li>Jika menggunakan Google Docs, klik <b>Share</b> ubah ke <b>"Anyone with the link"</b> lalu salin link. Jika Ms. Word, simpan sebagai PDF lalu unggah file-nya.</li>
                </ol>
            </div>
        `,
        deadline: '2026-10-31',
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    // --- TUGAS 2: EXCEL / GOOGLE SHEETS ---
    db.ref('tasks').push({
        title: 'Tugas 2: Catatan Uang Kas Pribadi (Excel / Google Sheets)',
        desc: `
            <p class="mb-3 font-medium text-slate-700">Tugas ini melatih kemampuan Anda dalam mengelola data keuangan dasar menggunakan rumus (Formula) dan format angka.</p>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 class="font-bold text-slate-800 mb-2">Instruksi (Pilih salah satu: Ms. Excel atau Google Sheets):</h4>
                <ol class="list-decimal pl-5 space-y-2 text-sm text-slate-600">
                    <li>Buat tabel dengan header berikut: <b>Tanggal, Keterangan, Pemasukan (Rp), Pengeluaran (Rp), Saldo (Rp)</b>.</li>
                    <li>Isi minimal <b>5 baris data</b> fiktif (contoh: Uang Saku, Beli Makan, Beli Kuota, dll).</li>
                    <li>Gunakan rumus matematika pada kolom <b>Saldo</b>. (Contoh baris pertama: <code>=C2-D2</code>, lalu baris kedua: <code>=E2+C3-D3</code>).</li>
                    <li>Di bagian paling bawah tabel, gunakan fungsi <b>SUM</b> untuk menghitung <b>Total Pemasukan</b> dan <b>Total Pengeluaran</b>.</li>
                    <li>Blok kolom angka, lalu ubah format angkanya menjadi <b>Mata Uang (Currency)</b>.</li>
                    <li>Simpan sebagai PDF dan unggah, ATAU bagikan link Google Sheets Anda (Anyone with the link).</li>
                </ol>
            </div>
        `,
        deadline: '2026-11-15',
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    // --- TUGAS 3: PPT / GOOGLE SLIDES ---
    db.ref('tasks').push({
        title: 'Tugas 3: Presentasi Peluncuran Produk (PPT / Google Slides)',
        desc: `
            <p class="mb-3 font-medium text-slate-700">Tugas ini melatih Anda merancang materi presentasi visual yang komunikatif dan menarik untuk memperkenalkan sebuah produk.</p>
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 class="font-bold text-slate-800 mb-2">Instruksi (Pilih salah satu: Ms. PowerPoint atau Google Slides):</h4>
                <ol class="list-decimal pl-5 space-y-2 text-sm text-slate-600">
                    <li>Buat presentasi minimal <b>4 slide</b>. Anda bebas memilih produk.</li>
                    <li><b>Slide 1 (Judul):</b> Nama Produk, Tagline, dan Nama Anda.</li>
                    <li><b>Slide 2 (Fitur):</b> Keunggulan produk (poin-poin).</li>
                    <li><b>Slide 3 (Harga):</b> Informasi harga dan promo.</li>
                    <li><b>Slide 4 (Penutup):</b> Ajakan membeli dan kontak.</li>
                    <li>Tambahkan <b>Gambar</b> dan <b>Transisi (Transition)</b> antar slide.</li>
                    <li>Jika menggunakan Google Slides, bagikan link. Jika PPT, simpan sebagai PDF lalu unggah.</li>
                </ol>
            </div>
        `,
        deadline: '2026-11-30',
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    alert("✅ 3 Tugas Default berhasil dibuat!");
}

// Fungsi untuk Guru mereset tugas ke awal
function resetTugasDefault() {
    if (confirm("⚠️ PERINGATAN!\n\nIni akan menghapus SEMUA tugas yang ada saat ini (termasuk tugas buatan Anda sendiri) dan menggantinya dengan 3 Tugas Default.\n\nLanjutkan?")) {
        db.ref('tasks').remove().then(() => {
            generateDefaultTasks();
        }).catch(err => alert("Gagal mereset tugas: " + err.message));
    }
}

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
                <div class="flex-1">
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
    if (confirm("Yakin ingin menghapus tugas ini?")) {
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
                
                if (submissions[taskId]) {
                    found = true;
                    const sub = submissions[taskId];
                    const isDocs = sub.link.includes('docs.google.com') || sub.link.includes('spreadsheets') || sub.link.includes('presentation');
                    const icon = isDocs ? 'fa-brands fa-google-drive text-blue-600' : 'fa-file-pdf text-rose-600';
                    const color = isDocs ? 'text-blue-600 bg-blue-100' : 'text-rose-600 bg-rose-100';

                    container.innerHTML += `
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-slate-100 hover:bg-slate-50 gap-3">
                            <div>
                                <p class="font-bold text-slate-800">${studentName}</p>
                                <p class="text-xs text-slate-500">${className}</p>
                            </div>
                            <a href="${sub.link}" target="_blank" class="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${color} hover:opacity-80">
                                <i class="${icon} text-lg"></i> Buka File Tugas
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

    if(!studentName) return; 

    db.ref(`submissions/${studentClass}/${studentName}`).on('value', subSnap => {
        const mySubmissions = subSnap.val() || {};

        container.innerHTML = '';
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
}

function openKumpulTugasModal(taskId, title) {
    currentSelectedTaskId = taskId;
    document.getElementById('kumpul-tugas-title').innerText = "Tugas: " + title;
    document.getElementById('link-tugas').value = "";
    document.getElementById('file-tugas').value = "";
    document.getElementById('modal-kumpul-tugas').classList.remove('hidden');
}

function closeKumpulTugasModal() {
    document.getElementById('modal-kumpul-tugas').classList.add('hidden');
}

async function prosesKumpulTugas() {
    const linkInput = document.getElementById('link-tugas').value.trim();
    const fileInput = document.getElementById('file-tugas');
    const file = fileInput.files[0];

    if (!linkInput && !file) {
        return alert("Silakan masukkan Link Google Docs/Sheets/Slides ATAU unggah file PDF Anda.");
    }

    if (linkInput && !linkInput.includes('http')) {
        return alert("Format link tidak valid. Pastikan diawali dengan http:// atau https://");
    }

    const btn = document.getElementById('btn-submit-tugas');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Memproses...';

    if (linkInput) {
        saveSubmissionToFirebase(linkInput);
    } else if (file) {
        if (file.size > 5 * 1024 * 1024) {
            alert("❌ Ukuran file maksimal 5MB.");
            btn.disabled = false;
            btn.innerHTML = originalText;
            return;
        }
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
