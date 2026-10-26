// ==========================================
// ATTENDANCE SYSTEM (Absensi) - Cloud Sync
// ==========================================

let allAttendanceData = [];
const todayStr = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

document.addEventListener("DOMContentLoaded", () => {
    const isTeacher = sessionStorage.getItem('is_teacher') === 'true';
    
    if (isTeacher) {
        initTeacherDashboard();
    } else {
        initStudentAttendance();
    }
});

// ------------------------------------------
// LOGIKA SISWA (ANTI KECURANGAN & CLOUD SYNC)
// ------------------------------------------
function initStudentAttendance() {
    const formContainer = document.getElementById("attendance-form-container");
    if (!formContainer) return;

    // Ambil data siswa dari localStorage (diisi saat pertama kali buka web)
    let studentName = localStorage.getItem("student_name");
    let studentClass = localStorage.getItem("student_class");

    // Jika siswa belum punya nama (misal baru buka web), minta isi dulu
    if (!studentName || studentName === "Siswa Baru") {
        studentName = prompt("Masukkan Nama Lengkap Anda untuk Absensi:") || "Siswa Baru";
        studentClass = prompt("Masukkan Kelas Anda (Contoh: X TEI 1):") || "Umum";
        localStorage.setItem("student_name", studentName);
        localStorage.setItem("student_class", studentClass);
    }

    // Tampilkan Loading sementara ngecek ke Firebase
    formContainer.innerHTML = `
        <div class="text-center p-6">
            <i class="fa-solid fa-spinner fa-spin text-3xl text-emerald-500 mb-2"></i>
            <p class="text-sm text-slate-500">Memeriksa status kehadiran Anda di server...</p>
        </div>
    `;

    // CEK KE FIREBASE: Apakah nama & kelas ini sudah absen hari ini?
    // Struktur path: attendance/{tanggal}/{kelas}/{nama}
    const checkRef = db.ref(`attendance/${todayStr}/${studentClass}/${studentName}`);
    
    checkRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            // === JIKA SUDAH ABSEN (Terkunci) ===
            // Simpan tanggal di localStorage agar sinkron
            localStorage.setItem('last_attendance_date', todayStr);
            
            formContainer.innerHTML = `
                <div class="text-center p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl animate-pop">
                    <i class="fa-solid fa-circle-check text-5xl text-emerald-500 mb-3"></i>
                    <h3 class="text-lg font-bold text-emerald-700">Anda Sudah Absen Hari Ini</h3>
                    <p class="text-sm text-emerald-600 mt-2">Halo <b>${studentName}</b>, kehadiran Anda sudah tercatat di server pada hari ini. Silakan kembali besok.</p>
                </div>
            `;
        } else {
            // === JIKA BELUM ABSEN (Form Terbuka) ===
            // Hapus memori kunci lokal jika data di server sudah tidak ada (dihapus guru)
            localStorage.removeItem('last_attendance_date');
            
            formContainer.innerHTML = `
                <form id="attendance-form" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">Nama Lengkap</label>
                        <input type="text" id="att-name" value="${studentName}" readonly class="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed">
                        <p class="text-[10px] text-slate-400 mt-1">*Nama sesuai profil Anda</p>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">Kelas</label>
                        <input type="text" id="att-class" value="${studentClass}" readonly class="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed">
                    </div>
                    <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg mt-2">
                        <i class="fa-solid fa-fingerprint mr-2"></i> Kirim Kehadiran
                    </button>
                </form>
            `;

            // Pasang event listener untuk form yang baru dibuat
            const form = document.getElementById("attendance-form");
            form.addEventListener("submit", async function(e) {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]');
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Menyimpan...';

                try {
                    const now = new Date();
                    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                    
                    // Simpan ke Firebase
                    await checkRef.set({
                        name: studentName,
                        class: studentClass,
                        date: todayStr,
                        day: days[now.getDay()],
                        time: timeStr,
                        deviceId: localStorage.getItem('office_player_id') || "unknown",
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    });

                    // Kunci perangkat
                    localStorage.setItem('last_attendance_date', todayStr);
                    
                    alert(`✅ Absensi Berhasil!\n\nNama: ${studentName}\nKelas: ${studentClass}\nJam: ${timeStr}`);
                    
                    // Refresh tampilan tab absen agar berubah jadi terkunci
                    initStudentAttendance();

                } catch (error) {
                    console.error("Error Absensi:", error);
                    alert("❌ Terjadi kesalahan koneksi. Pastikan internet stabil.");
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa-solid fa-fingerprint mr-2"></i> Kirim Kehadiran';
                }
            });
        }
    }).catch(err => {
        console.error("Error Firebase:", err);
        formContainer.innerHTML = `<p class="text-rose-500 text-center">Gagal terhubung ke server. Periksa koneksi internet Anda.</p>`;
    });
}

// ------------------------------------------
// LOGIKA GURU (DASHBOARD)
// ------------------------------------------
function initTeacherDashboard() {
    const tableList = document.getElementById("teacher-attendance-list");
    if (!tableList) return;

    // Tarik data secara Realtime dari Firebase
    db.ref('attendance').on('value', (snapshot) => {
        allAttendanceData = [];
        
        // Iterasi struktur bersarang: Date -> Class -> Student
        snapshot.forEach((dateNode) => {
            const date = dateNode.key;
            dateNode.forEach((classNode) => {
                const className = classNode.key;
                classNode.forEach((studentNode) => {
                    allAttendanceData.push({
                        id: `${date}/${className}/${studentNode.key}`, // Path untuk hapus
                        ...studentNode.val()
                    });
                });
            });
        });
        
        // Urutkan dari yang paling baru
        allAttendanceData.sort((a, b) => b.timestamp - a.timestamp);
        renderTeacherTable();
    });
}

function renderTeacherTable() {
    const listElement = document.getElementById("teacher-attendance-list");
    if (!listElement) return;

    const filterClass = document.getElementById("filter-class").value;
    const filterDate = document.getElementById("filter-date").value;
    
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
                        <i class="fa-solid fa-trash"></i> Hapus
                    </button>
                </td>
            </tr>
        `;
    });
}

function deleteAttendance(idPath) {
    if (confirm("⚠️ Yakin ingin menghapus data absensi siswa ini?\n\nJika dihapus, siswa tersebut akan bisa absen kembali dari perangkatnya.")) {
        db.ref('attendance/' + idPath).remove()
            .then(() => alert("✅ Data berhasil dihapus. Perangkat siswa akan terbuka kembali."))
            .catch(err => alert("❌ Gagal menghapus: " + err.message));
    }
}

// ------------------------------------------
// EXPORT FUNCTIONS (HANYA GURU)
// ------------------------------------------
function exportToExcel() {
    const table = document.getElementById("teacher-attendance-table");
    if (table.rows.length <= 1) return alert("Tidak ada data untuk diexport.");
    
    const wb = XLSX.utils.table_to_book(table, { sheet: "Absensi" });
    XLSX.writeFile(wb, `Rekap_Absensi_${todayStr}.xlsx`);
}

function exportToPDF() {
    const table = document.getElementById("teacher-attendance-table");
    if (table.rows.length <= 1) return alert("Tidak ada data untuk diexport.");
    
    const element = document.getElementById("print-area");
    
    const opt = {
        margin:       10,
        filename:     `Rekap_Absensi_${todayStr}.pdf`,
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
}
