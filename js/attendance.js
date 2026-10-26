// ==========================================
// ATTENDANCE SYSTEM (Absensi) - Cloud Version
// ==========================================

let allAttendanceData = []; 

// Cek apakah URL memiliki parameter ?mode=guru
const urlParams = new URLSearchParams(window.location.search);
const isGuru = urlParams.get('mode') === 'guru';

document.addEventListener("DOMContentLoaded", () => {
    const attForm = document.getElementById("attendance-form");
    
    if (attForm) {
        attForm.addEventListener("submit", function(e) {
            e.preventDefault();
            submitAttendance();
        });
    }

    // UI Setup berdasarkan Mode (Guru vs Siswa)
    setupUI();
});

function setupUI() {
    const formContainer = document.getElementById("attendance-form").parentElement;
    const tableContainer = document.getElementById("table-container");
    const actionHeader = document.getElementById("action-header");

    if (isGuru) {
        // MODE GURU: Sembunyikan Form, Lebarkan Tabel, Tampilkan Tombol Hapus
        formContainer.classList.add("hidden");
        tableContainer.classList.remove("md:col-span-2");
        tableContainer.classList.add("md:col-span-3");
        actionHeader.classList.remove("hidden");
        
        // Tambahkan tulisan "Mode Guru" di judul
        document.querySelector("#panel-main-attendance h2").innerHTML = '<i class="fa-solid fa-chalkboard-user text-amber-400 mr-2"></i> Mode Guru: Rekap Kehadiran';
    } else {
        // MODE SISWA: Tampilkan form, sembunyikan tombol hapus
        actionHeader.classList.add("hidden");
    }
}

function submitAttendance() {
    const name = document.getElementById("att-name").value.trim();
    const className = document.getElementById("att-class").value;
    
    if (!name || !className) return alert("Lengkapi Nama dan Kelas!");

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; 
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = days[now.getDay()];

    const attendanceData = {
        name: name,
        class: className,
        date: dateStr,
        day: dayName,
        time: timeStr,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    // Simpan ke Firebase (Cloud) -> Otomatis terkirim ke perangkat guru
    db.ref('attendance').push(attendanceData)
        .then(() => {
            alert(`✅ Absensi Berhasil!\n\nNama: ${name}\nKelas: ${className}\nHari: ${dayName}, ${dateStr}\nJam: ${timeStr}`);
            document.getElementById("attendance-form").reset();
            
            // Auto-filter ke kelas yang baru diabsen
            document.getElementById("filter-class").value = className;
            document.getElementById("filter-date").value = dateStr;
            renderAttendanceTable();
        })
        .catch((error) => {
            console.error("Error Absensi:", error);
            alert("❌ Gagal menyimpan. Pastikan aturan Firebase Rules sudah diset '.read': true, '.write': true.");
        });
}

// Listener Realtime dari Firebase
db.ref('attendance').on('value', (snapshot) => {
    allAttendanceData = [];
    snapshot.forEach((childSnapshot) => {
        allAttendanceData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
        });
    });
    
    // Urutkan terbaru di atas
    allAttendanceData.sort((a, b) => b.timestamp - a.timestamp);
    renderAttendanceTable();
});

function renderAttendanceTable() {
    const listElement = document.getElementById("attendance-list");
    const filterClass = document.getElementById("filter-class").value;
    const filterDate = document.getElementById("filter-date").value;
    
    if (!listElement) return;

    let filteredData = allAttendanceData;
    
    if (filterClass !== "all") {
        filteredData = filteredData.filter(item => item.class === filterClass);
    }
    if (filterDate) {
        filteredData = filteredData.filter(item => item.date === filterDate);
    }

    listElement.innerHTML = "";

    if (filteredData.length === 0) {
        const colspan = isGuru ? 6 : 5;
        listElement.innerHTML = `<tr><td colspan="${colspan}" class="text-center p-6 text-slate-500">Tidak ada data untuk filter ini.</td></tr>`;
        return;
    }

    filteredData.forEach((data, index) => {
        const displayDate = `${data.day}, ${data.date}`;
        
        // Jika mode Guru, tampilkan tombol hapus (warna merah)
        const actionTd = isGuru ? `
            <td class="p-3 text-center">
                <button onclick="deleteAttendance('${data.id}')" class="bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white px-3 py-1 rounded transition text-xs font-bold">
                    <i class="fa-solid fa-trash"></i> Hapus
                </button>
            </td>
        ` : '';

        listElement.innerHTML += `
            <tr class="hover:bg-slate-800/50 transition-colors border-b border-slate-800">
                <td class="p-3 text-center text-slate-400">${index + 1}</td>
                <td class="p-3 font-medium text-slate-200">${data.name}</td>
                <td class="p-3 text-sky-400 font-bold">${data.class}</td>
                <td class="p-3 text-slate-300">${displayDate}</td>
                <td class="p-3 text-slate-400">${data.time}</td>
                ${actionTd}
            </tr>
        `;
    });
}

// Fungsi Hapus Data (Hanya dieksekusi oleh Guru)
function deleteAttendance(id) {
    if (!isGuru) return;
    if (confirm("⚠️ Yakin ingin menghapus data absensi siswa ini?")) {
        db.ref('attendance/' + id).remove()
            .then(() => alert("✅ Data berhasil dihapus."))
            .catch(err => alert("❌ Gagal menghapus: " + err.message));
    }
}

// ==========================================
// EXPORT FUNCTIONS (Sama seperti sebelumnya)
// ==========================================
function exportToExcel() {
    const table = document.getElementById("attendance-table");
    if (table.rows.length <= 1) return alert("Tidak ada data untuk diexport.");
    
    // Sembunyikan kolom aksi (jika guru) sebelum export
    const wb = XLSX.utils.table_to_book(table, { sheet: "Absensi" });
    XLSX.writeFile(wb, `Rekap_Absensi_${new Date().toISOString().split('T')[0]}.xlsx`);
}

function exportToPDF() {
    const table = document.getElementById("attendance-table");
    if (table.rows.length <= 1) return alert("Tidak ada data untuk diexport.");
    
    const element = document.getElementById("print-area");
    
    const opt = {
        margin:       10,
        filename:     `Rekap_Absensi_${new Date().toISOString().split('T')[0]}.pdf`,
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
        if(filterSection) filterSection.style.display = 'flex';
        if(exportButtons) exportButtons.style.display = 'flex';
    });
}
