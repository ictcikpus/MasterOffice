// ==========================================
// ATTENDANCE SYSTEM (Absensi + Selfie)
// ==========================================

let allAttendanceData = [];
const todayStr = new Date().toISOString().split('T')[0]; 
let videoStream = null; // Menyimpan stream kamera
let selfieTaken = false; // Status apakah user sudah jepret foto

document.addEventListener("DOMContentLoaded", () => {
    const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
    
    if (isTeacher) {
        initTeacherDashboard();
    } else {
        initStudentAttendance();
    }
});

// Mematikan kamera saat pindah tab/menu
function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
}

// ------------------------------------------
// LOGIKA SISWA (KAMERA & ANTI KECURANGAN)
// ------------------------------------------
function initStudentAttendance() {
    const formContainer = document.getElementById("attendance-form-container");
    if (!formContainer) return;

    let studentName = localStorage.getItem("student_name");
    let studentClass = localStorage.getItem("student_class");

    if (!studentName || studentName === "Siswa Baru") {
        studentName = prompt("Masukkan Nama Lengkap Anda untuk Absensi:") || "Siswa Baru";
        studentClass = prompt("Masukkan Kelas Anda (Contoh: X TEI 1):") || "Umum";
        localStorage.setItem("student_name", studentName);
        localStorage.setItem("student_class", studentClass);
    }

    formContainer.innerHTML = `
        <div class="text-center p-6">
            <i class="fa-solid fa-spinner fa-spin text-3xl text-emerald-500 mb-2"></i>
            <p class="text-sm text-slate-500">Memeriksa status kehadiran...</p>
        </div>
    `;

    const checkRef = db.ref(`attendance/${todayStr}/${studentClass}/${studentName}`);
    
    checkRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            // === JIKA SUDAH ABSEN (Terkunci) ===
            localStorage.setItem('last_attendance_date', todayStr);
            stopCamera(); // Pastikan kamera mati
            
            formContainer.innerHTML = `
                <div class="text-center p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl animate-pop">
                    <i class="fa-solid fa-circle-check text-5xl text-emerald-500 mb-3"></i>
                    <h3 class="text-lg font-bold text-emerald-700">Anda Sudah Absen Hari Ini</h3>
                    <p class="text-sm text-emerald-600 mt-2">Halo <b>${studentName}</b>, kehadiran Anda sudah tercatat di server pada hari ini.</p>
                </div>
            `;
        } else {
            // === JIKA BELUM ABSEN (Tampilkan Kamera) ===
            localStorage.removeItem('last_attendance_date');
            selfieTaken = false;
            
            formContainer.innerHTML = `
                <div class="space-y-4">
                    <!-- Info Siswa (Readonly) -->
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm">
                        <div class="flex justify-between mb-1"><span class="text-slate-500">Nama:</span> <span class="font-bold text-slate-800">${studentName}</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Kelas:</span> <span class="font-bold text-slate-800">${studentClass}</span></div>
                    </div>

                    <!-- Area Kamera -->
                    <div class="relative bg-slate-900 rounded-xl overflow-hidden aspect-square flex items-center justify-center border-2 border-dashed border-slate-300">
                        <video id="camera-stream" autoplay playsinline class="w-full h-full object-cover hidden"></video>
                        <canvas id="photo-canvas" class="w-full h-full object-cover hidden"></canvas>
                        <div id="camera-placeholder" class="text-center text-slate-400">
                            <i class="fa-solid fa-camera-retro text-4xl mb-2"></i>
                            <p class="text-xs px-4">Kamera belum menyala</p>
                        </div>
                    </div>

                    <!-- Tombol Kamera -->
                    <div id="camera-actions" class="flex gap-2">
                        <button type="button" onclick="startCamera()" class="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-md">
                            <i class="fa-solid fa-video mr-1"></i> Nyalakan Kamera
                        </button>
                        <button type="button" id="btn-take-photo" onclick="takeSelfie()" class="hidden flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-md">
                            <i class="fa-solid fa-camera mr-1"></i> Ambil Foto
                        </button>
                        <button type="button" id="btn-retake-photo" onclick="retakeSelfie()" class="hidden flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md">
                            <i class="fa-solid fa-rotate-left mr-1"></i> Ulangi
                        </button>
                    </div>

                    <!-- Tombol Kirim -->
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

// Fungsi Menyalakan Kamera
async function startCamera() {
    try {
        const video = document.getElementById('camera-stream');
        const placeholder = document.getElementById('camera-placeholder');
        const btnStart = document.getElementById('camera-actions').children[0];
        const btnTake = document.getElementById('btn-take-photo');

        // Minta izin kamera (depan)
        videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = videoStream;
        
        video.classList.remove('hidden');
        placeholder.classList.add('hidden');
        btnStart.classList.add('hidden');
        btnTake.classList.remove('hidden');

    } catch (err) {
        alert("❌ Gagal mengakses kamera. Pastikan Anda memberikan izin kamera pada browser.");
        console.error(err);
    }
}

// Fungsi Mengambil Gambar (Tanpa Upload)
function takeSelfie() {
    const video = document.getElementById('camera-stream');
    const canvas = document.getElementById('photo-canvas');
    
    // Atur ukuran canvas sama dengan video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Gambar frame video ke canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Tampilkan hasil jepretan
    video.classList.add('hidden');
    canvas.classList.remove('hidden');
    
    // Sembunyikan tombol jepret, munculkan tombol ulangi & aktifkan tombol submit
    document.getElementById('btn-take-photo').classList.add('hidden');
    document.getElementById('btn-retake-photo').classList.remove('hidden');
    
    const btnSubmit = document.getElementById('btn-submit-attendance');
    btnSubmit.disabled = false;
    btnSubmit.classList.remove('bg-slate-300', 'text-slate-500', 'cursor-not-allowed');
    btnSubmit.classList.add('bg-emerald-600', 'hover:bg-emerald-700', 'text-white', 'shadow-lg');

    // Matikan kamera setelah jepret untuk hemat baterai
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }

    selfieTaken = true;
}

// Fungsi Mengulangi Foto
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

    startCamera(); // Nyalakan ulang kamera
}

// Fungsi Kirim Data (Hanya Teks ke Firebase)
async function submitAttendance(studentName, studentClass) {
    if (!selfieTaken) return alert("Silakan ambil foto selfie terlebih dahulu!");
    
    const btn = document.getElementById('btn-submit-attendance');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Menyimpan Data...';

    try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const checkRef = db.ref(`attendance/${todayStr}/${studentClass}/${studentName}`);
        
        // HANYA MENYIMPAN TEKS (Foto tidak di-upload)
        await checkRef.set({
            name: studentName,
            class: studentClass,
            date: todayStr,
            day: days[now.getDay()],
            time: timeStr,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        stopCamera(); // Pastikan kamera mati total
        alert(`✅ Absensi Berhasil!\n\nNama: ${studentName}\nKelas: ${studentClass}\nJam: ${timeStr}`);
        
        // Refresh tampilan menjadi terkunci
        initStudentAttendance();

    } catch (error) {
        console.error("Error Absensi:", error);
        alert("❌ Terjadi kesalahan koneksi.");
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-fingerprint mr-2"></i> Kirim Kehadiran';
    }
}
