function openCertificateModal() {
    // Verifikasi Keamanan Ganda
    const allKeys = Object.keys(userProgress);
    const isAllFinished = allKeys.every(k => userProgress[k] === true);

    if (!isAllFinished) {
        alert("Akses Ditolak: Anda wajib menyelesaikan seluruh Level 1, 2, dan 3 di semua modul terlebih dahulu!");
        return;
    }

    // Isi Data Sertifikat
    document.getElementById("cert-name").innerText = userName.toUpperCase();
    document.getElementById("cert-class").innerText = "Kelas: " + userClass;
    
    // Format Tanggal Otomatis di Bekasi
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    document.getElementById("cert-date").innerText = `Bekasi, ${formattedDate}`;

    // Tampilkan View Sertifikat & Panggil Window Print PDF
    const certView = document.getElementById("certificate-view");
    certView.classList.remove("hidden");
    
    window.print();

    // Sembunyikan kembali setelah selesai dicetak
    setTimeout(() => {
        certView.classList.add("hidden");
    }, 1000);
}
