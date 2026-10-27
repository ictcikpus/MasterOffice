// ==========================================
// ATTENDANCE SYSTEM (Absensi + Selfie + Dashboard Sync)
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

    // Listener ini menarik SEMUA data absensi dari Firebase
    db.ref('attendance').on('value', (snapshot) => {
        allAttendanceData = [];
        let todayCount = 0; // Variabel untuk menyimpan jumlah hadir hari ini
        
        snapshot.forEach((dateNode) => {
            const date = dateNode.key;
            dateNode.forEach((classNode) => {
                const className = classNode.key;
                classNode.forEach((studentNode) => {
                    allAttendanceData.push({
                        id: `${date}/${className}/${studentNode.key}`, 
                        ...studentNode.val()
                    });
                    
                    // 🔥 PERBAIKAN: Hitung jika tanggal absen sama dengan hari ini
                    if (date === todayStrAttendance) {
                        todayCount++;
                    }
                });
            });
        });
        
        allAttendanceData.sort((a, b) => b.timestamp - a.timestamp);
        
        // 🔥 PERBAIKAN: Update angka di Dashboard Guru secara otomatis
        const statHadir = document.getElementById('stat-hadir');
        if (statHadir) {
            statHadir.innerText = todayCount;
        }

        // Render tabel jika sedang membuka menu Rekap Absensi
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

window.exportToPDF = function() {
    const table = document.getElementById("teacher-attendance-table");
    if (table.rows.length <= 1) return alert("Tidak ada data untuk diexport.");
    const element = document.getElementById("print-area");
    const opt = {
        margin:       10,
        filename:     `Rekap_Absensi_${todayStrAttendance}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    const filterSection = document.getElementById('filter-section');
    const exportButtons = document.getElementById('export-buttons');
    if(filterSection) filterSection.style.display = 'none';
    if(exportButtons) exportButtons.style.display = 'none';
    html2pdf().set(opt).from(element).save().then(() => {
        if(filterSection) filterSection.style.display = 'flex';
        if(exportButtons) exportButtons.style.display = 'flex';
    });
};
