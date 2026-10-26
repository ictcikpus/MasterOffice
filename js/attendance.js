// ==========================================
// ATTENDANCE SYSTEM (Absensi)
// ==========================================

let allAttendanceData = []; // Menyimpan data sementara untuk difilter

document.addEventListener("DOMContentLoaded", () => {
    const attForm = document.getElementById("attendance-form");
    if (attForm) {
        attForm.addEventListener("submit", function(e) {
            e.preventDefault();
            submitAttendance();
        });
    }
});

function submitAttendance() {
    const name = document.getElementById("att-name").value.trim();
    const className = document.getElementById("att-class").value;
    
    if (!name || !className) return alert("Lengkapi Nama dan Kelas!");

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // Format YYYY-MM-DD
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    // Hari dalam Bahasa Indonesia
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

    // Simpan ke Firebase di bawah node 'attendance'
    db.ref('attendance').push(attendanceData)
        .then(() => {
            alert(`✅ Absensi Berhasil!\n\nNama: ${name}\nKelas: ${className}\nHari: ${dayName}, ${dateStr}\nJam: ${timeStr}`);
            document.getElementById("attendance-form").reset();
            // Set filter kelas ke kelas yang baru saja diabsen agar guru langsung lihat
            document.getElementById("filter-class").value = className;
            document.getElementById("filter-date").value = dateStr;
            renderAttendanceTable();
        })
        .catch((error) => {
            console.error("Error Absensi:", error);
            alert("❌ Gagal menyimpan absensi. Periksa koneksi internet.");
        });
}

// Listener Realtime untuk menarik data absensi
db.ref('attendance').on('value', (snapshot) => {
    allAttendanceData = [];
    snapshot.forEach((childSnapshot) => {
        allAttendanceData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
        });
    });
    
    // Urutkan dari yang terbaru (timestamp descending)
    allAttendanceData.sort((a, b) => b.timestamp - a.timestamp);
    
    renderAttendanceTable();
});

function renderAttendanceTable() {
    const listElement = document.getElementById("attendance-list");
    const filterClass = document.getElementById("filter-class").value;
    const filterDate = document.getElementById("filter-date").value;
    
    if (!listElement) return;

    // Filter Data
    let filteredData = allAttendanceData;
    
    if (filterClass !== "all") {
        filteredData = filteredData.filter(item => item.class === filterClass);
    }
    if (filterDate) {
        filteredData = filteredData.filter(item => item.date === filterDate);
    }

    listElement.innerHTML = "";

    if (filteredData.length === 0) {
        listElement.innerHTML = `<tr><td colspan="5" class="text-center p-6 text-slate-500">Tidak ada data absensi untuk filter ini.</td></tr>`;
        return;
    }

    filteredData.forEach((data, index) => {
        // Format Tanggal: "Senin, 2023-10-25"
        const displayDate = `${data.day}, ${data.date}`;
        
        listElement.innerHTML += `
            <tr class="hover:bg-slate-800/50 transition-colors border-b border-slate-800">
                <td class="p-3 text-center text-slate-400">${index + 1}</td>
                <td class="p-3 font-medium text-slate-200">${data.name}</td>
                <td class="p-3 text-sky-400 font-bold">${data.class}</td>
                <td class="p-3 text-slate-300">${displayDate}</td>
                <td class="p-3 text-slate-400">${data.time}</td>
            </tr>
        `;
    });
}

// ==========================================
// EXPORT FUNCTIONS
// ==========================================

function exportToExcel() {
    const table = document.getElementById("attendance-table");
    if (table.rows.length <= 1) return alert("Tidak ada data untuk diexport.");
    
    // Menggunakan SheetJS (XLSX)
    const wb = XLSX.utils.table_to_book(table, { sheet: "Absensi" });
    XLSX.writeFile(wb, `Rekap_Absensi_${new Date().toISOString().split('T')[0]}.xlsx`);
}

function exportToPDF() {
    const table = document.getElementById("attendance-table");
    if (table.rows.length <= 1) return alert("Tidak ada data untuk diexport.");
    
    const element = document.getElementById("print-area");
    
    // Konfigurasi PDF
    const opt = {
        margin:       10,
        filename:     `Rekap_Absensi_${new Date().toISOString().split('T')[0]}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Sembunyikan tombol dan filter sementara agar tidak ikut terprint (via CSS @media print atau manipulasi DOM)
    const filterSection = document.querySelector('.flex.flex-col.md\\:flex-row.gap-4.mb-4');
    const exportButtons = document.querySelector('.flex.gap-2');
    if(filterSection) filterSection.style.display = 'none';
    if(exportButtons) exportButtons.style.display = 'none';

    // Generate PDF
    html2pdf().set(opt).from(element).save().then(() => {
        // Kembalikan tampilan semula
        if(filterSection) filterSection.style.display = 'flex';
        if(exportButtons) exportButtons.style.display = 'flex';
    });
}
