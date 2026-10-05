// Logika Verifikasi & Pencetakan Sertifikat

function checkCertificateEligibility() {
    const btnCert = document.getElementById("btn-cert");
    // Syarat Lulus & Dapat Sertifikat: Poin Minimal 100 (Dapat disesuaikan)
    if (currentScore >= 100) {
        btnCert.disabled = false;
        btnCert.className = "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-extrabold px-5 py-3 rounded-xl hover:opacity-90 transition shadow-lg cursor-pointer flex items-center gap-2 animate-bounce";
    }
}

function openCertificateModal() {
    // Isi Data Sertifikat
    document.getElementById("cert-name").innerText = userName.toUpperCase();
    document.getElementById("cert-class").innerText = "Kelas: " + userClass;
    document.getElementById("cert-score").innerText = currentScore + " Poin";
    
    // Format Tanggal Hari Ini (Format Indonesia) di Bekasi
    const today = new Date();
    const options = { day: 'numeric', month: 'Long', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    document.getElementById("cert-date").innerText = `Bekasi, ${formattedDate}`;

    // Tampilkan View Sertifikat & Panggil Dialog Cetak
    const certView = document.getElementById("certificate-view");
    certView.classList.remove("hidden");
    
    window.print();

    // Sembunyikan kembali setelah cetak
    setTimeout(() => {
        certView.classList.add("hidden");
    }, 1000);
}
