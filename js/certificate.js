// ==========================================
// CERTIFICATE GENERATOR (A4 PORTRAIT PREMIUM)
// ==========================================

window.generateCertificate = function(name, className, score, date, isPreview = false) {
    const certWindow = window.open('', '_blank');
    
    const today = date || new Date().toLocaleDateString('id-ID', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });

    // Data untuk QR Code verifikasi keaslian
    const verificationData = `Master Office | Nama: ${name} | Kelas: ${className} | Skor: ${score} | Tanggal: ${today}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationData)}`;

    const certHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sertifikat Kelulusan - ${name}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Poppins:wght@300;400;500;600&display=swap');
                
                /* Pengaturan Dasar & Reset */
                * { box-sizing: border-box; margin: 0; padding: 0; }
                
                body { 
                    font-family: 'Poppins', sans-serif; 
                    background-color: #1e293b; 
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: 20px;
                }
                
                /* Pengaturan Ukuran A4 Portrait */
                .certificate-page {
                    background-color: #ffffff;
                    width: 210mm;
                    height: 297mm;
                    position: relative;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    overflow: hidden;
                    padding: 15px; /* Jarak dari tepi kertas */
                }

                /* Bingkai Emas Ganda (Elegan) */
                .certificate-inner { 
                    border: 3px solid #0f172a; /* Biru Dongker Tua */
                    outline: 2px solid #d4af37; /* Emas */
                    outline-offset: -8px; /* Jarak outline ke dalam */
                    height: 100%;
                    padding: 50px 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    text-align: center;
                    position: relative;
                    background-image: 
                        radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 70%),
                        url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 0 0 L 100 0 L 100 100 L 0 100 Z" fill="none" stroke="%23f8fafc" stroke-width="2"/></svg>');
                }

                /* Ornamen Sudut (Opsional, mempermanis tampilan) */
                .corner-ornament {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    border: 2px solid #d4af37;
                }
                .top-left { top: 15px; left: 15px; border-right: none; border-bottom: none; }
                .top-right { top: 15px; right: 15px; border-left: none; border-bottom: none; }
                .bottom-left { bottom: 15px; left: 15px; border-right: none; border-top: none; }
                .bottom-right { bottom: 15px; right: 15px; border-left: none; border-top: none; }

                /* Bagian Header */
                .header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                }
                .logo {
                    max-height: 90px;
                    margin-bottom: 20px;
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
                }
                .title-main { 
                    font-family: 'Playfair Display', serif;
                    font-size: 3.5em; 
                    font-weight: 800;
                    color: #0f172a; 
                    letter-spacing: 6px;
                    line-height: 1.1;
                    text-transform: uppercase;
                }
                .title-sub {
                    font-size: 1.1em;
                    color: #d4af37; /* Warna Emas */
                    letter-spacing: 4px;
                    text-transform: uppercase;
                    font-weight: 600;
                    margin-top: 10px;
                    border-bottom: 1px solid #e2e8f0;
                    padding-bottom: 15px;
                    width: 60%;
                }
                
                /* Bagian Konten Utama */
                .content {
                    width: 100%;
                    margin: 30px 0;
                }
                .given-to {
                    font-size: 1em;
                    color: #64748b;
                    margin-bottom: 15px;
                    letter-spacing: 1px;
                }
                .name { 
                    font-family: 'Playfair Display', serif;
                    font-size: 3.8em; 
                    font-weight: 700; 
                    color: #0f172a; 
                    margin-bottom: 10px;
                    line-height: 1.2;
                    border-bottom: 2px solid #d4af37;
                    display: inline-block;
                    padding: 0 30px 10px 30px;
                }
                .class-info {
                    font-size: 1.2em;
                    color: #334155;
                    font-weight: 500;
                    margin-bottom: 30px;
                }
                
                .description {
                    font-size: 1em;
                    color: #475569;
                    line-height: 1.8;
                    max-width: 80%;
                    margin: 0 auto 30px auto;
                    text-align: justify;
                    text-align-last: center;
                }
                
                /* Skor Box */
                .score-box { 
                    display: inline-block;
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                    border: 1px solid #d4af37;
                    padding: 10px 40px;
                    border-radius: 50px;
                    box-shadow: 0 4px 10px rgba(212, 175, 55, 0.2);
                }
                .score-label {
                    display: block;
                    font-size: 0.75em;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: #b45309;
                    font-weight: 600;
                }
                .score-value {
                    font-family: 'Playfair Display', serif;
                    font-size: 2em;
                    font-weight: 700;
                    color: #0f172a;
                }
                
                /* Bagian Footer (QR & Tanda Tangan) */
                .footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    width: 100%;
                    padding: 0 20px;
                    margin-top: auto; /* Mendorong ke bawah */
                }

                /* QR Code */
                .qr-section {
                    text-align: center;
                }
                .qr-section img {
                    width: 110px;
                    height: 110px;
                    border: 1px solid #cbd5e1;
                    padding: 5px;
                    border-radius: 8px;
                    background: white;
                }
                .qr-text {
                    font-size: 0.7em;
                    color: #94a3b8;
                    margin-top: 8px;
                    max-width: 120px;
                    line-height: 1.2;
                }

                /* Tanda Tangan */
                .signature-section {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .location-date {
                    font-size: 1em;
                    color: #475569;
                    margin-bottom: 5px;
                }
                .role {
                    font-size: 1em;
                    color: #475569;
                    margin-bottom: 70px; /* Jarak untuk tanda tangan basah */
                }
                .signature-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.4em;
                    font-weight: 700;
                    color: #0f172a;
                    text-decoration: underline;
                    text-decoration-color: #d4af37;
                    text-underline-offset: 4px;
                }
                .nip {
                    font-size: 0.9em;
                    color: #64748b;
                    margin-top: 5px;
                }

                /* Media Print */
                @media print {
                    body { 
                        background-color: #ffffff; 
                        padding: 0; 
                        margin: 0;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .certificate-page { 
                        box-shadow: none; 
                        width: 100%; 
                        height: 100vh;
                        page-break-after: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <!-- Ukuran A4 Portrait -->
            <div class="certificate-page">
                <div class="certificate-inner">
                    <!-- Ornamen Sudut -->
                    <div class="corner-ornament top-left"></div>
                    <div class="corner-ornament top-right"></div>
                    <div class="corner-ornament bottom-left"></div>
                    <div class="corner-ornament bottom-right"></div>

                    <!-- HEADER -->
                    <div class="header">
                        <img src="https://www.smkn1cikarangpusat.sch.id/upload/picture/721842logo1000pxl.png" class="logo" alt="Logo SMKN 1 Cikarang Pusat">
                        <div class="title-main">SERTIFIKAT</div>
                        <div class="title-sub">Kelulusan Modul Master Office</div>
                    </div>
                    
                    <!-- CONTENT -->
                    <div class="content">
                        <p class="given-to">Diberikan dengan bangga kepada:</p>
                        <div class="name">${name}</div>
                        <p class="class-info">Kelas: ${className}</p>
                        
                        <p class="description">
                            Sebagai penghargaan atas dedikasi, ketekunan, dan keberhasilannya dalam menyelesaikan seluruh modul pembelajaran Microsoft Office & Google Workspace serta menyelesaikan semua tugas praktik dengan hasil yang memuaskan.
                        </p>
                        
                        <div class="score-box">
                            <span class="score-label">Skor Akhir Kelulusan</span>
                            <span class="score-value">${score} Poin</span>
                        </div>
                    </div>
                    
                    <!-- FOOTER (QR & TANDA TANGAN) -->
                    <div class="footer">
                        <!-- QR Code Kiri -->
                        <div class="qr-section">
                            <img src="${qrCodeUrl}" alt="QR Verifikasi" crossorigin="anonymous">
                            <div class="qr-text">Pindai untuk verifikasi keaslian</div>
                        </div>

                        <!-- Tanda Tangan Kanan -->
                        <div class="signature-section">
                            <p class="location-date">Bekasi, ${today}</p>
                            <p class="role">Guru Pengajar,</p>
                            <p class="signature-name">Otib Subagja, S.Kom</p>
                            <p class="nip">NIP. 199302102025211112</p>
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
    window.generateCertificate('Nama Siswa (Contoh)', 'Kelas (Contoh)', 1500, new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), true);
};
