// ==========================================
// CERTIFICATE GENERATOR (PREMIUM DESIGN + QR CODE)
// ==========================================

window.generateCertificate = function(name, className, score, date, isPreview = false) {
    const certWindow = window.open('', '_blank');
    
    const today = date || new Date().toLocaleDateString('id-ID', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });

    // Data yang akan dimasukkan ke dalam QR Code untuk verifikasi keaslian
    const verificationData = `Master Office | Nama: ${name} | Kelas: ${className} | Skor: ${score} | Tanggal: ${today}`;
    
    // Menggunakan API publik untuk membuat QR Code
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(verificationData)}`;

    const certHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sertifikat Kelulusan - ${name}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Poppins:wght@300;400;500;600&display=swap');
                
                body { 
                    font-family: 'Poppins', sans-serif; 
                    background-color: #0f172a; 
                    padding: 20px; 
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                
                .certificate-wrapper {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 4px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    max-width: 950px;
                    width: 100%;
                    position: relative;
                }

                .certificate-inner { 
                    border: 2px solid #0f172a; 
                    padding: 40px 40px 60px 40px; /* Padding bawah diperbesar agar tidak terpotong */
                    background-color: #fcfcfc;
                    position: relative;
                    text-align: center;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                
                /* Bingkai Emas Elegan */
                .border-gold {
                    position: absolute;
                    top: 10px; left: 10px; right: 10px; bottom: 10px;
                    border: 2px solid #d4af37;
                    pointer-events: none;
                }
                .border-gold-inner {
                    position: absolute;
                    top: 14px; left: 14px; right: 14px; bottom: 14px;
                    border: 1px solid #d4af37;
                    pointer-events: none;
                }
                
                /* Bagian Header */
                .header-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .logo {
                    max-height: 85px;
                    object-fit: contain;
                    margin-bottom: 15px;
                }

                h1 { 
                    font-family: 'Playfair Display', serif;
                    color: #0f172a; 
                    font-size: 2.6em; 
                    margin: 0; 
                    letter-spacing: 4px;
                    text-transform: uppercase;
                }
                .subtitle {
                    font-size: 1.1em;
                    color: #64748b;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    font-weight: 600;
                    margin-top: 5px;
                }
                
                /* Bagian Nama */
                .name-section {
                    margin: 20px 0;
                }
                .name { 
                    font-family: 'Playfair Display', serif;
                    font-size: 3.2em; 
                    font-weight: 700; 
                    color: #0f172a; 
                    margin: 5px 0; 
                    border-bottom: 2px solid #d4af37;
                    display: inline-block;
                    padding-bottom: 5px;
                    padding-left: 30px;
                    padding-right: 30px;
                    line-height: 1.2;
                }
                .class-info {
                    font-size: 1.1em;
                    color: #475569;
                    font-weight: 500;
                }
                
                /* Bagian Deskripsi */
                .description {
                    font-size: 0.95em;
                    color: #334155;
                    line-height: 1.7;
                    max-width: 70%;
                    margin: 0 auto;
                }
                
                /* Bagian Skor */
                .score { 
                    font-size: 1.3em; 
                    font-weight: 700; 
                    color: #b45309; 
                    background-color: #fef3c7;
                    display: inline-block;
                    padding: 8px 35px;
                    border-radius: 50px;
                    border: 1px solid #fcd34d;
                    margin-top: 20px;
                }
                
                /* Bagian Bawah (QR & Tanda Tangan) */
                .footer-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-top: 40px;
                    padding: 0 20px;
                }

                /* Gaya untuk QR Code */
                .qr-container {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .qr-container img {
                    width: 90px;
                    height: 90px;
                    border: 1px solid #cbd5e1;
                    padding: 4px;
                    border-radius: 8px;
                }
                .qr-text {
                    font-size: 0.65em;
                    color: #64748b;
                    margin-top: 5px;
                    max-width: 100px;
                    line-height: 1.2;
                }

                /* Gaya untuk Tanda Tangan */
                .signature {
                    text-align: center;
                    position: relative;
                }
                .signature p {
                    margin: 3px 0;
                    color: #475569;
                    font-size: 0.9em;
                }
                .signature .title {
                    font-weight: 500;
                }
                .signature-name {
                    font-weight: 700;
                    color: #0f172a;
                    font-size: 1.1em;
                    margin-top: 60px !important; 
                    text-decoration: underline;
                }

                @media print {
                    body { background-color: white; padding: 0; margin: 0; }
                    .certificate-wrapper { box-shadow: none; padding: 0; max-width: 100%; }
                    .certificate-inner { border: none; }
                }
            </style>
        </head>
        <body>
            <div class="certificate-wrapper">
                <div class="certificate-inner">
                    <div class="border-gold"></div>
                    <div class="border-gold-inner"></div>
                    
                    <div class="header-section">
                        <!-- LOGO SEKOLAH -->
                        <img src="https://www.smkn1cikarangpusat.sch.id/upload/picture/721842logo1000pxl.png" class="logo" alt="Logo SMKN 1 Cikarang Pusat">
                        
                        <!-- JUDUL BARU -->
                        <h1>SERTIFIKAT KELULUSAN</h1>
                        <p class="subtitle">Modul Master Office</p>
                    </div>
                    
                    <div class="name-section">
                        <p style="color: #64748b; margin: 0; font-size: 0.9em;">Diberikan dengan bangga kepada:</p>
                        <div class="name">${name}</div>
                        <p class="class-info">Kelas: ${className}</p>
                    </div>
                    
                    <p class="description">
                        Atas dedikasi, ketekunan, dan keberhasilannya telah menyelesaikan seluruh modul pembelajaran Microsoft Office & Google Workspace serta menyelesaikan semua tugas praktik dengan sangat baik.
                    </p>
                    
                    <div>
                        <div class="score">Skor Akhir: ${score} Poin</div>
                    </div>
                    
                    <!-- FOOTER: QR CODE & TANDA TANGAN -->
                    <div class="footer-section">
                        
                        <!-- QR Code Kiri -->
                        <div class="qr-container">
                            <img src="${qrCodeUrl}" alt="QR Code Verifikasi" crossorigin="anonymous">
                            <div class="qr-text">Scan untuk verifikasi keaslian sertifikat</div>
                        </div>

                        <!-- Tanda Tangan Kanan -->
                        <div class="signature">
                            <p style="margin-bottom: 5px;">Bekasi, ${today}</p>
                            <p class="title">Guru Pengajar,</p>
                            <p class="signature-name">Otib Subagja, S.Kom</p>
                            <p style="font-size: 0.8em;">NIP. 199302102025211112</p>
                        </div>
                    </div>
                </div>
            </div>
            <script>
                window.onload = function() { 
                    if (!${isPreview}) {
                        window.print(); 
                    }
                }
            </script>
        </body>
        </html>
    `;

    certWindow.document.write(certHTML);
    certWindow.document.close();
};

// Fungsi Tambahan untuk Preview dari Guru
window.previewCertificate = function() {
    // Memanggil fungsi generateCertificate dengan data contoh (Dummy) dan mode Preview = true
    window.generateCertificate('Nama Siswa (Contoh)', 'Kelas (Contoh)', 1500, new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), true);
};
