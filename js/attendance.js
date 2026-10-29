// ==========================================
// ATTENDANCE SYSTEM (Absensi + PDF Kop Surat Resmi)
// ==========================================

let allAttendanceData = [];
const todayStrAttendance = new Date().toISOString().split('T')[0]; 
let videoStream = null; 
let selfieTaken = false; 
let isTeacherAttListenerAttached = false;

document.addEventListener("DOMContentLoaded", () => {
    const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
    if (!isTeacher) {
        initStudentAttendance();
    }
});

// ==========================================
// 1. FUNGSI SISWA (ABSENSI MANDIRI)
// ==========================================
function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
}

function initStudentAttendance() {
    const formContainer = document.getElementById("attendance-form-container");
    if (!formContainer) return;

    let studentName = localStorage.getItem("student_name");
    let studentClass = localStorage.getItem("student_class");

    if (!studentName || !studentClass) {
        formContainer.innerHTML = `<p class="text-center text-slate-500">Lengkapi profil Anda terlebih dahulu.</p>`;
        return;
    }

    formContainer.innerHTML = `
        <div class="text-center p-6">
            <i class="fa-solid fa-spinner fa-spin text-3xl text-emerald-500 mb-2"></i>
            <p class="text-sm text-slate-500">Memeriksa status kehadiran...</p>
        </div>
    `;

    const checkRef = db.ref(`attendance/${todayStrAttendance}/${studentClass}/${studentName}`);
    
    checkRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            localStorage.setItem('last_attendance_date', todayStrAttendance);
            stopCamera(); 
            
            formContainer.innerHTML = `
                <div class="text-center p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl animate-pop">
                    <i class="fa-solid fa-circle-check text-5xl text-emerald-500 mb-3"></i>
                    <h3 class="text-lg font-bold text-emerald-700">Anda Sudah Absen Hari Ini</h3>
                    <p class="text-sm text-emerald-600 mt-2">Halo <b>${studentName}</b>, kehadiran Anda sudah tercatat di server pada hari ini.</p>
                </div>
            `;
        } else {
            localStorage.removeItem('last_attendance_date');
            selfieTaken = false;
            
            formContainer.innerHTML = `
                <div class="space-y-4">
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm">
                        <div class="flex justify-between mb-1"><span class="text-slate-500">Nama:</span> <span class="font-bold text-slate-800">${studentName}</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Kelas:</span> <span class="font-bold text-slate-800">${studentClass}</span></div>
                    </div>

                    <div class="relative bg-slate-900 rounded-xl overflow-hidden aspect-square flex items-center justify-center border-2 border-dashed border-slate-300">
                        <video id="camera-stream" autoplay playsinline class="w-full h-full object-cover hidden"></video>
                        <canvas id="photo-canvas" class="w-full h-full object-cover hidden"></canvas>
                        <div id="camera-placeholder" class="text-center text-slate-400">
                            <i class="fa-solid fa-camera-retro text-4xl mb-2"></i>
                            <p class="text-xs px-4">Kamera belum menyala</p>
                        </div>
                    </div>

                    <div id="camera-actions" class="flex gap-2">
                        <button type="button" onclick="startCamera()" class="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"><i class="fa-solid fa-video mr-1"></i> Nyalakan Kamera</button>
                        <button type="button" id="btn-take-photo" onclick="takeSelfie()" class="hidden flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"><i class="fa-solid fa-camera mr-1"></i> Ambil Foto</button>
                        <button type="button" id="btn-retake-photo" onclick="retakeSelfie()" class="hidden flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"><i class="fa-solid fa-rotate-left mr-1"></i> Ulangi</button>
                    </div>

                    <button id="btn-submit-attendance" onclick="submitAttendance('${studentName}', '${studentClass}')" disabled class="w-full bg-slate-300 text-slate-500 py-3.5 rounded-xl font-bold transition-all mt-2 cursor-not-allowed shadow-none">
                        <i class="fa-solid fa-fingerprint mr-2"></i> Kirim Kehadiran
                    </button>
                </div>
            `;
        }
    }).catch(err => {
        console.error("Error Firebase:", err);
        formContainer.innerHTML = `<p class="text-rose-500 text-center">Gagal terhubung ke server.</p>`;
    });
}

async function startCamera() {
    try {
        const video = document.getElementById('camera-stream');
        const placeholder = document.getElementById('camera-placeholder');
        const btnStart = document.getElementById('camera-actions').children[0];
        const btnTake = document.getElementById('btn-take-photo');

        videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = videoStream;
        
        video.classList.remove('hidden');
        placeholder.classList.add('hidden');
        btnStart.classList.add('hidden');
        btnTake.classList.remove('hidden');
    } catch (err) {
        alert("❌ Gagal mengakses kamera. Pastikan Anda memberikan izin kamera pada browser.");
    }
}

function takeSelfie() {
    const video = document.getElementById('camera-stream');
    const canvas = document.getElementById('photo-canvas');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    video.classList.add('hidden');
    canvas.classList.remove('hidden');
    
    document.getElementById('btn-take-photo').classList.add('hidden');
    document.getElementById('btn-retake-photo').classList.remove('hidden');
    
    const btnSubmit = document.getElementById('btn-submit-attendance');
    btnSubmit.disabled = false;
    btnSubmit.classList.remove('bg-slate-300', 'text-slate-500', 'cursor-not-allowed');
    btnSubmit.classList.add('bg-emerald-600', 'hover:bg-emerald-700', 'text-white', 'shadow-lg');

    if (videoStream) videoStream.getTracks().forEach(track => track.stop());
    selfieTaken = true;
}

function retakeSelfie() {
    const video = document.getElementById('camera-stream');
    const canvas = document.getElementById('photo-canvas');
    
    canvas.classList.add('hidden');
    video.classList.remove('hidden');
    
    document.getElementById('btn-retake-photo').classList.add('hidden');
    document.getElementById('btn-take-photo').classList.remove('hidden');
    
    const btnSubmit = document.getElementById('btn-submit-attendance');
    btnSubmit.disabled = true;
    btnSubmit.classList.add('bg-slate-300', 'text-slate-500', 'cursor-not-allowed');
    btnSubmit.classList.remove('bg-emerald-600', 'hover:bg-emerald-700', 'text-white', 'shadow-lg');

    startCamera();
}

async function submitAttendance(studentName, studentClass) {
    if (!selfieTaken) return alert("Silakan ambil foto selfie terlebih dahulu!");
    
    const btn = document.getElementById('btn-submit-attendance');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Menyimpan Data...';

    try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const checkRef = db.ref(`attendance/${todayStrAttendance}/${studentClass}/${studentName}`);
        
        await checkRef.set({
            name: studentName,
            class: studentClass,
            date: todayStrAttendance,
            day: days[now.getDay()],
            time: timeStr,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        stopCamera(); 
        alert(`✅ Absensi Berhasil!\n\nNama: ${studentName}\nKelas: ${studentClass}\nJam: ${timeStr}`);
        initStudentAttendance();

    } catch (error) {
        console.error("Error Absensi:", error);
        alert("❌ Terjadi kesalahan koneksi.");
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-fingerprint mr-2"></i> Kirim Kehadiran';
    }
}

// ==========================================
// 2. FUNGSI GURU (REKAP & DASHBOARD)
// ==========================================
window.initTeacherAttendance = function() {
    if (isTeacherAttListenerAttached) return;
    isTeacherAttListenerAttached = true;

    db.ref('attendance').on('value', (snapshot) => {
        allAttendanceData = [];
        let todayCount = 0; 
        
        snapshot.forEach((dateNode) => {
            const date = dateNode.key;
            dateNode.forEach((classNode) => {
                const className = classNode.key;
                classNode.forEach((studentNode) => {
                    allAttendanceData.push({
                        id: `${date}/${className}/${studentNode.key}`, 
                        ...studentNode.val()
                    });
                    
                    if (date === todayStrAttendance) {
                        todayCount++;
                    }
                });
            });
        });
        
        allAttendanceData.sort((a, b) => b.timestamp - a.timestamp);
        
        const statHadir = document.getElementById('stat-hadir');
        if (statHadir) {
            statHadir.innerText = todayCount;
        }

        if (document.getElementById('teacher-attendance-list')) {
            window.renderTeacherTable();
        }
    });
};

window.renderTeacherTable = function() {
    const listElement = document.getElementById("teacher-attendance-list");
    if (!listElement) return;

    const filterClass = document.getElementById('filter-class').value;
    const filterDate = document.getElementById('filter-date').value;
    
    let filteredData = allAttendanceData;
    if (filterClass !== "all") filteredData = filteredData.filter(item => item.class === filterClass);
    if (filterDate) filteredData = filteredData.filter(item => item.date === filterDate);

    listElement.innerHTML = "";

    if (filteredData.length === 0) {
        listElement.innerHTML = `<tr><td colspan="6" class="text-center p-6 text-slate-500">Tidak ada data absensi untuk filter ini.</td></tr>`;
        return;
    }

    filteredData.forEach((data, index) => {
        listElement.innerHTML += `
            <tr class="hover:bg-slate-50 border-b border-slate-100 transition-colors">
                <td class="p-3 text-center text-slate-400 text-xs">${index + 1}</td>
                <td class="p-3 font-medium text-slate-700">${data.name}</td>
                <td class="p-3 text-emerald-600 font-bold">${data.class}</td>
                <td class="p-3 text-slate-500 text-xs">${data.day}, ${data.date}</td>
                <td class="p-3 text-slate-500">${data.time}</td>
                <td class="p-3 text-center">
                    <button onclick="deleteAttendance('${data.id}')" class="bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white px-3 py-1.5 rounded-lg transition text-xs font-bold" title="Hapus Data">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
};

window.deleteAttendance = function(idPath) {
    if (confirm("⚠️ Yakin ingin menghapus data absensi siswa ini?\n\nJika dihapus, siswa tersebut akan bisa absen kembali dari perangkatnya hari ini.")) {
        db.ref('attendance/' + idPath).remove()
            .then(() => alert("✅ Data berhasil dihapus."))
            .catch(err => alert("❌ Gagal menghapus: " + err.message));
    }
};

window.exportToExcel = function() {
    const table = document.getElementById("teacher-attendance-table");
    if (table.rows.length <= 1) return alert("Tidak ada data untuk diexport.");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Absensi" });
    XLSX.writeFile(wb, `Rekap_Absensi_${todayStrAttendance}.xlsx`);
};

// PDF EXPORT WITH KOP SURAT RESMI SMKN 1 CIKARANG PUSAT
window.exportToPDF = function() {
    const table = document.getElementById("teacher-attendance-table");
    if (table.rows.length <= 1) return alert("Tidak ada data untuk diexport.");

    const filterClass = document.getElementById('filter-class').value;
    const filterDate = document.getElementById('filter-date').value;
    
    let infoText = "Semua Kelas";
    if (filterClass !== "all") infoText = `Kelas: ${filterClass}`;
    if (filterDate) {
        const dateObj = new Date(filterDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        infoText += ` | Tanggal: ${dateObj.toLocaleDateString('id-ID', options)}`;
    }

    // Clone tabel
    const tableClone = table.cloneNode(true);
    
    // Hapus kolom aksi
    tableClone.querySelectorAll('tr').forEach(row => {
        const lastCell = row.querySelector('td:last-child, th:last-child');
        if (lastCell) lastCell.remove();
    });

    // Persempit padding & font agar muat 40 baris di 1 lembar A4
    tableClone.style.width = '100%';
    tableClone.style.borderCollapse = 'collapse';
    tableClone.style.fontSize = '10px'; 
    tableClone.style.fontFamily = 'Arial, sans-serif';
    
    // Paksa semua teks menjadi hitam dan rata kiri (termasuk kolom kelas)
    tableClone.querySelectorAll('th, td').forEach(cell => {
        cell.style.border = '1px solid #000';
        cell.style.padding = '3px 5px'; // Padding super ketat
        cell.style.textAlign = 'left';
        cell.style.color = '#000'; // Warna hitam mutlak
        cell.style.fontWeight = 'normal'; // Hapus efek tebal
    });
    tableClone.querySelectorAll('th').forEach(th => {
        th.style.backgroundColor = '#f3f4f6';
        th.style.textAlign = 'center';
        th.style.fontWeight = 'bold'; // Header tetap tebal
    });

    const element = document.createElement('div');
    element.style.padding = '15px'; // Margin kertas
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.color = '#000';
    
    // Desain Kop Surat SMKN 1 CIKARANG PUSAT + LOGO & ALAMAT BARU
    element.innerHTML = `
        <div style="display: flex; align-items: center; border-bottom: 3px solid #000; padding-bottom: 15px; margin-bottom: 20px;">
            <!-- Logo Sekolah -->
            <div style="width: 90px; text-align: center;">
                <img src="https://www.smkn1cikarangpusat.sch.id/upload/picture/721842logo1000pxl.png" style="max-height: 80px; max-width: 80px; object-fit: contain;">
            </div>
            <div style="flex: 1; text-align: center;">
                <h2 style="margin: 0; font-size: 14px; font-weight: normal; font-family: Arial;">PEMERINTAH PROVINSI JAWA BARAT</h2>
                <h2 style="margin: 0; font-size: 14px; font-weight: normal; font-family: Arial;">DINAS PENDIDIKAN</h2>
                <h1 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px; font-family: Arial;">SMK NEGERI 1 CIKARANG PUSAT</h1>
                <p style="margin: 0; font-size: 10px; font-family: Arial;">Jl. Pasrirranji Desa Pasrirranji Kec. Cikarang Pusat Kab. Bekasi 17530</p>
                <p style="margin: 0; font-size: 10px; font-family: Arial;">Website: www.smkn1cikarangpusat.sch.id</p>
            </div>
        </div>
        
        <h3 style="text-align: center; text-decoration: underline; margin-bottom: 5px; font-size: 14px;">REKAPITULASI KEHADIRAN SISWA</h3>
        <p style="text-align: center; margin-bottom: 15px; font-size: 11px;">Mata Pelajaran: Informatika | ${infoText}</p>
    `;

    element.appendChild(tableClone);

    // Desain Tanda Tangan (Bekasi)
    element.innerHTML += `
        <div style="margin-top: 25px; display: flex; justify-content: flex-end;">
            <div style="text-align: center; width: 220px;">
                <p style="margin: 0; font-size: 11px;">Bekasi, ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="margin: 0; font-size: 11px;">Guru Pengajar,</p>
                <div style="height: 50px;"></div>
                <p style="margin: 0; font-size: 11px; font-weight: bold; text-decoration: underline;">Otib Subagja, S.Kom</p>
                <p style="margin: 0; font-size: 11px;">NIP. 199302102025211112</p>
            </div>
        </div>
    `;

    const opt = {
        margin:       10, 
        filename:     `Rekap_Absensi_${todayStrAttendance}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] } 
    };

    html2pdf().set(opt).from(element).save();
};
