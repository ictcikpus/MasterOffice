// ==========================================
// TASKS SYSTEM (Anti-Crash, Full Program)
// Dibungkus dalam IIFE agar tidak bentrok dengan file lain
// ==========================================

(function() {
    const GAS_URL = "https://script.google.com/macros/s/AKfycbxu2pRUrXHIex2xABFFANCxvrhWHialnwst3e3VPHZBl9arG8WAWRmcj_U_eFAGWOEZCA/exec";

    // ⚠️ GANTI DENGAN ID FOLDER GOOGLE DRIVE ANDA ⚠️
    const FOLDER_ID = "1_K4XXQc4umLJPpKmnpwEUcIGX9ed7m6e";

    let allTasks = [];
    let allSubmissionsData = {}; 
    let allAttendanceToday = {}; 

    // Nama variabel diganti agar tidak bentrok dengan attendance.js
    const todayStrTasks = new Date().toISOString().split('T')[0];

    document.addEventListener("DOMContentLoaded", () => {
        const isTeacher = sessionStorage.getItem('is_teacher') === 'true';

        // 1. LISTENER TUGAS
        db.ref('tasks').on('value', snap => {
            allTasks = [];
            snap.forEach(child => allTasks.push({ id: child.key, ...child.val() }));
            allTasks.reverse();
            
            if (isTeacher) {
                const statTugas = document.getElementById('stat-tugas');
                if(statTugas) statTugas.innerText = allTasks.length;
                if (document.getElementById('view-guru-tugas') && !document.getElementById('view-guru-tugas').classList.contains('hidden')) {
                    renderRekapTugasGuru();
                }
            } else {
                renderSiswaTugas();
            }
        });

        // 2. LISTENER PENGUMPULAN TUGAS
        db.ref('submissions').on('value', snap => {
            allSubmissionsData = snap.val() || {};
            if (isTeacher && document.getElementById('view-guru-tugas') && !document.getElementById('view-guru-tugas').classList.contains('hidden')) {
                renderRekapTugasGuru();
            } else if (!isTeacher) {
                renderSiswaTugas(); 
            }
        });

        // 3. LISTENER ABSENSI (Untuk Guru)
        if (isTeacher) {
            db.ref(`attendance/${todayStrTasks}`).on('value', snap => {
                allAttendanceToday = snap.val() || {};
                let count = 0;
                for (const cls in allAttendanceToday) {
                    count += Object.keys(allAttendanceToday[cls]).length;
                }
                const statHadir = document.getElementById('stat-hadir');
                if(statHadir) statHadir.innerText = count;
                if (document.getElementById('view-guru-tugas') && !document.getElementById('view-guru-tugas').classList.contains('hidden')) {
                    renderRekapTugasGuru();
                }
            });
        }
    });

    // ==========================================
    // FUNGSI GENERATE TUGAS DEFAULT
    // ==========================================
    window.generateDefaultTasks = function() {
        if (!confirm("Ini akan menambahkan 3 Tugas Default ke dalam daftar. Lanjutkan?")) return;

        const defaultTasks = [
            { title: 'Tugas 1: Surat Jalan Perusahaan (Word / Google Docs)', desc: '<p class="mb-3 font-medium text-slate-700">Tugas administrasi bisnis formal.</p><ol class="list-decimal pl-5 space-y-1 text-sm text-slate-600"><li>Judul: <b>"PT. MAJU BERSAMA SEJAHTERA"</b> (Tengah).</li><li>Format Surat: No, Tanggal, Kepada, Alamat.</li><li><b>Tabel</b>: No, Nama Barang, Kuantitas, Ket (3 barang).</li><li>Tanda tangan Pengirim & Penerima.</li></ol>', deadline: '2026-10-31' },
            { title: 'Tugas 2: Catatan Uang Kas Pribadi (Excel / Google Sheets)', desc: '<p class="mb-3 font-medium text-slate-700">Pengelolaan keuangan dasar.</p><ol class="list-decimal pl-5 space-y-1 text-sm text-slate-600"><li>Header: Tanggal, Ket, Pemasukan, Pengeluaran, Saldo.</li><li>Isi 5 baris data.</li><li>Saldo gunakan rumus: <code>=C2-D2</code>, dst.</li><li>Gunakan <b>SUM</b> untuk total.</li></ol>', deadline: '2026-11-15' },
            { title: 'Tugas 3: Presentasi Peluncuran Produk (PPT / Google Slides)', desc: '<p class="mb-3 font-medium text-slate-700">Materi presentasi visual.</p><ol class="list-decimal pl-5 space-y-1 text-sm text-slate-600"><li>Minimal 4 slide (Judul, Fitur, Harga, Penutup).</li><li>Tambahkan Gambar dan Transisi.</li></ol>', deadline: '2026-11-30' }
        ];

        const promises = defaultTasks.map(t => db.ref('tasks').push({ ...t, timestamp: firebase.database.ServerValue.TIMESTAMP }));
        
        Promise.all(promises).then(() => {
            alert("✅ 3 Tugas Default berhasil ditambahkan! Silakan cek tabel di bawah.");
        }).catch(err => alert("Gagal membuat tugas default: " + err.message));
    };

    // ==========================================
    // FUNGSI GURU
    // ==========================================
    window.openBuatTugasModal = function() { document.getElementById('modal-buat-tugas').classList.remove('hidden'); };
    window.closeBuatTugasModal = function() { document.getElementById('modal-buat-tugas').classList.add('hidden'); };

    window.simpanTugas = function() {
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
    };

    function renderRekapTugasGuru() {
        const filterKelasEl = document.getElementById('filter-kelas-tugas');
        const tbody = document.getElementById('body-rekap-tugas');
        
        if(!tbody || !filterKelasEl) return;
        
        const filterKelas = filterKelasEl.value;
        tbody.innerHTML = '';

        if (allTasks.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="p-8 text-center bg-rose-50 text-rose-600 border border-rose-200 rounded-lg">
                        <i class="fa-solid fa-triangle-exclamation text-3xl mb-3 block"></i>
                        <span class="font-bold text-lg">Daftar Tugas Kosong!</span><br>
                        <span class="text-sm">Silakan klik tombol <b>"Generate 3 Tugas Awal"</b> di atas untuk membuat tugas baru.</span>
                    </td>
                </tr>`;
            return;
        }

        let studentList = [];
        
        if (allSubmissionsData) {
            for (const cls in allSubmissionsData) {
                if (filterKelas === 'all' || filterKelas === cls) {
                    for (const name in allSubmissionsData[cls]) {
                        studentList.push({ name, class: cls, id: `${cls}_${name}` });
                    }
                }
            }
        }
        
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
            tbody.innerHTML = `<tr><td colspan="3" class="p-6 text-center text-slate-500">Belum ada siswa yang absen atau mengumpulkan tugas untuk filter ini.</td></tr>`;
            return;
        }

        studentList.sort((a,b) => a.name.localeCompare(b.name));

        studentList.forEach(student => {
            let statusTugasHtml = '<div class="flex flex-wrap gap-1.5">';
            
            allTasks.forEach((task, index) => {
                const isSubmitted = allSubmissionsData[student.class]?.[student.name]?.[task.id];
                
                if (isSubmitted) {
                    statusTugasHtml += `
                        <a href="${isSubmitted.link}" target="_blank" class="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300 px-2 py-1 rounded text-xs font-bold transition flex items-center gap-1" title="Sudah Dikumpulkan">
                            <i class="fa-solid fa-check-circle"></i> Tugas ${index+1}
                        </a>`;
                } else {
                    statusTugasHtml += `
                        <span class="bg-slate-100 text-slate-400 border border-slate-200 px-2 py-1 rounded text-xs font-bold flex items-center gap-1" title="Belum Dikumpulkan">
                            <i class="fa-solid fa-times-circle"></i> Tugas ${index+1}
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
    // FUNGSI SISWA
    // ==========================================
    function renderSiswaTugas() {
        const container = document.getElementById('siswa-tugas-list');
        if(!container) return;
        
        const studentName = localStorage.getItem("student_name");
        const studentClass = localStorage.getItem("student_class");

        if(!studentName || !studentClass) {
            container.innerHTML = `
                <div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                    <i class="fa-solid fa-user-slash text-4xl text-amber-500 mb-3"></i>
                    <p class="text-amber-700 font-bold mb-2">Profil Tidak Ditemukan</p>
                    <p class="text-sm text-slate-600 mb-4">Sepertinya Anda belum mengisi nama atau kelas, atau data browser terhapus.</p>
                    <button onclick="location.reload()" class="bg-amber-500 text-white px-5 py-2 rounded-lg font-bold">Muat Ulang Halaman</button>
                </div>
            `;
            return;
        }

        container.innerHTML = '';

        if (allTasks.length === 0) {
            container.innerHTML = `
                <div class="text-center p-8 bg-white rounded-2xl border border-slate-200">
                    <i class="fa-solid fa-folder-open text-4xl text-slate-300 mb-3"></i>
                    <p class="text-slate-500 font-bold">Belum ada tugas dari Guru.</p>
                </div>`;
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
                alert("⚠️ ANDA BELUM ABSEN HARI INI!\n\nAnda harus mengisi kehadiran di menu 'Absensi' terlebih dahulu sebelum bisa mengumpulkan tugas.");
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

            if (FOLDER_ID === "GANTI_DENGAN_ID_FOLDER_DRIVE_ANDA") {
                alert("⚠️ ID Folder Google Drive belum diatur di tasks.js. Hubungi Guru.");
                btn.disabled = false;
                btn.innerHTML = originalText;
                return;
            }

            try {
                const response = await fetch(GAS_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify({ 
                        file: base64Data, 
                        filename: filename, 
                        mimeType: mimeType,
                        folderId: FOLDER_ID 
                    })
                });
                const result = await response.json();
                if (result.status === 'success' && result.url) {
                    saveSubmissionToFirebase(result.url);
                } else {
                    throw new Error(result.message || "Gagal mengunggah.");
                }
            } catch (error) {
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
})();
