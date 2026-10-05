// ==========================================
// CERTIFICATE GENERATOR
// ==========================================

window.generateCertificate = function(name, className, score) {
    // Membuka tab/jendela baru
    const certWindow = window.open('', '_blank');
    
    // Tanggal hari ini
    const today = new Date().toLocaleDateString('id-ID', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });

    // Desain HTML Sertifikat
    const certHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sertifikat Kelulusan - ${name}</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    text-align: center; 
                    background-color: #cbd5e1; 
                    padding: 40px; 
                    margin: 0;
                }
                .certificate-container { 
                    border: 15px solid #0f172a; 
                    padding: 50px; 
                    background-color: white; 
                    max-width: 800px; 
                    margin: auto; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2); 
                    position: relative;
                }
                .certificate-container::before {
                    content: '';
                    position: absolute;
                    top: 10px; left: 10px; right: 10px; bottom: 10px;
                    border: 2px solid #cbd5e1;
                    pointer-events: none;
                }
                h1 { color: #0f172a; font-size: 3.5em; margin-bottom: 10px; letter-spacing: 2px; }
                p { color: #475569; font-size: 1.2em; margin: 15px 0; }
                .name { 
                    font-size: 2.8em; 
                    font-weight: bold; 
                    color: #0369a1; 
                    margin: 20px 0; 
                    text-transform: uppercase;
                    border-bottom: 2px solid #e2e8f0;
                    display: inline-block;
                    padding-bottom: 10px;
                }
                .score { 
                    font-size: 1.5em; 
                    font-weight: bold; 
                    color: #d97706; 
                    margin-top: 30px;
                    background-color: #fef3c7;
                    display: inline-block;
                    padding: 10px 25px;
                    border-radius: 50px;
                }
                .footer { margin-top: 60px; font-size: 1em; color: #64748b; }
            </style>
        </head>
        <body>
            <div class="certificate-container">
                <h1>SERTIFIKAT</h1>
                <p>Penghargaan ini diberikan dengan bangga kepada:</p>
                <div class="name">${name}</div>
                <p>Dari Kelas: <b>${className}</b></p>
                <p>Telah berhasil menyelesaikan seluruh materi dan tantangan pada<br><b>Edu Game - Office Master</b></p>
                <div class="score">Skor Akhir: ${score} Poin</div>
                <div class="footer">Dicetak secara resmi pada: ${today}</div>
            </div>
            <script>
                // Otomatis membuka dialog print saat halaman selesai dimuat
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `;

    // Tulis ke dokumen baru dan tutup stream
    certWindow.document.write(certHTML);
    certWindow.document.close();
};
