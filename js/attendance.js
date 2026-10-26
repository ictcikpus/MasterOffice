// ==========================================
// ATTENDANCE SYSTEM (Absensi)
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
// LOGIKA SISWA (ANTI KECURANGAN)
// ------------------------------------------
function initStudentAttendance() {
    const form = document.getElementById("attendance-form");
    if (!form) return;

    // 1. Cek Device Lock (Apakah perangkat ini sudah dipakai absen hari ini?)
    const lastDate = localStorage.getItem('last_attendance_date');
    if (lastDate === todayStr) {
        form.innerHTML = `
            <div class="text-center p-6 bg-emerald-900/30 border border-emerald-700 rounded-xl">
                <i class="fa-solid fa-circle-check text-5xl text-emerald-400 mb-4 animate-bounce"></i>
                <h3 class="text-lg font-bold text-emerald-300">Anda Sudah Absen Hari Ini</h3>
                <p class="text-sm text-emerald-500 mt-2">Perangkat ini telah digunakan untuk absensi pada hari ini. Silakan kembali besok.</p>
            </div>
        `;
        return;
    }

    // 2. Logika Submit Absen
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const name = document.getElementById("att-name").value.trim();
        const className = document.getElementById("att-class").value;
        
        if (!name || !className) return alert("Lengkapi Nama dan Kelas!");

        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Memproses...';

        try {
            // Cek ke Firebase: Apakah NAMA + KELAS ini sudah absen hari ini?
            const checkRef = db.ref(`attendance/${todayStr}/${className}/${name}`);
            const snapshot = await checkRef.once('value');
            
            if (snapshot.exists()) {
                alert("❌ Nama Anda sudah tercatat absen hari ini (mungkin dari perangkat lain). Hubungi Guru jika ini kesalahan.");
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-fingerprint mr-2"></i> Absen Sekarang';
                return;
            }

            // Simpan ke Firebase
            const now = new Date();
            const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            
            await checkRef.set({
                name: name,
                class: className,
                date: todayStr,
                day: days[now.getDay()],
                time: timeStr,
                deviceId: localStorage.getItem('office_player_id') || "unknown",
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });

            // Lock Perangkat (Simpan tanggal hari ini)
            localStorage.setItem('last_attendance_date', todayStr);
            
            alert(`✅ Absensi Berhasil!\n\nNama: ${name}\nKelas: ${className}\nJam: ${timeStr}`);
            location.reload(); // Reload halaman untuk menampilkan layar terkunci

        } catch (error) {
            console.error("Error Absensi:", error);
            alert("❌ Terjadi kesalahan koneksi. Pastikan internet stabil.");
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-fingerprint mr-2"></i> Absen Sekarang';
        }
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
            <tr class="hover:bg-slate-800/50 border-b border-slate-800 transition-colors">
                <td class="p-3 text-center text-slate-400">${index + 1}</td>
                <td class="p-3 font-medium text-slate-200">${data.name}</td>
                <td class="p-3 text-sky-400 font-bold">${data.class}</td>
                <td class="p-3 text-slate-300">${data.day}, ${data.date}</td>
                <td class="p-3 text-slate-400">${data.time}</td>
                <td class="p-3 text-center">
                    <button onclick="deleteAttendance('${data.id}')" class="bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white px-3 py-1 rounded transition text-xs font-bold" title="Hapus Data">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function deleteAttendance(idPath) {
    if (confirm("⚠️ Yakin ingin menghapus data absensi siswa ini?")) {
        db.ref('attendance/' + idPath).remove()
            .then(() => alert("✅ Data berhasil dihapus."))
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

    // Sembunyikan filter & tombol sementara agar rapi di PDF
    const filterSection = document.getElementById('filter-section');
    const exportButtons = document.getElementById('export-buttons');
    if(filterSection) filterSection.style.display = 'none';
    if(exportButtons) exportButtons.style.display = 'none';

    html2pdf().set(opt).from(element).save().then(() => {
        // Kembalikan tampilan semula setelah selesai
        if(filterSection) filterSection.style.display = 'flex';
        if(exportButtons) exportButtons.style.display = 'flex';
    });
}
