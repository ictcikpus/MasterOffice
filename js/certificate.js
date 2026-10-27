// ==========================================
// CERTIFICATE GENERATOR (PREMIUM DESIGN)
// ==========================================

window.generateCertificate = function(name, className, score, date) {
    const certWindow = window.open('', '_blank');
    
    const today = date || new Date().toLocaleDateString('id-ID', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });

    const certHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sertifikat Kelulusan - ${name}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Poppins:wght@300;400;600&display=swap');
                
                body { 
                    font-family: 'Poppins', sans-serif; 
                    background-color: #1e293b; 
                    padding: 20px; 
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
                .certificate-wrapper {
                    background-color: white;
                    padding: 15px;
                    border-radius: 10px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    max-width: 900px;
                    width: 100%;
                }
                .certificate-container { 
                    border: 2px solid #0f172a; 
                    padding: 50px 30px; 
                    background-color: #fdfbf7;
                    position: relative;
                    text-align: center;
                    background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                /* Bingkai Emas */
                .border-inner {
                    position: absolute;
                    top: 15px; left: 15px; right: 15px; bottom: 15px;
                    border: 3px solid #d4af37;
                    pointer-events: none;
                }
                .border-outer {
                    position: absolute;
                    top: 5px; left: 5px; right: 5px; bottom: 5px;
                    border: 1px solid #d4af37;
                    pointer-events: none;
                }
                
                .logo {
                    width: 80px;
                    height: 80px;
                    background-color: #10b981;
                    color: white;
                    border-radius: 20px;
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 40px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
                }

                h1 { 
                    font-family: 'Playfair Display', serif;
                    color: #1e293b; 
                    font-size: 3em; 
                    margin: 0 0 10px 0; 
                    letter-spacing: 2px;
                }
                .subtitle {
                    font-size: 1.1em;
                    color: #64748b;
                    margin-bottom: 40px;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                }
                
                .name { 
                    font-family: 'Playfair Display', serif;
                    font-size: 3em; 
                    font-weight: bold; 
                    color: #0f172a; 
                    margin: 10px 0; 
                    border-bottom: 2px solid #d4af37;
                    display: inline-block;
                    padding-bottom: 5px;
                    padding-left: 20px;
                    padding-right: 20px;
                }
                .class-info {
                    font-size: 1.2em;
                    color: #475569;
                    margin-bottom: 40px;
                    font-weight: 600;
                }
                
                .description {
                    font-size: 1em;
                    color: #334155;
                    line-height: 1.8;
                    max-width: 600px;
                    margin: 0 auto 40px auto;
                }
                
                .score { 
                    font-size: 1.5em; 
                    font-weight: bold; 
                    color: #d97706; 
                    margin-bottom: 50px;
                    background-color: #fef3c7;
                    display: inline-block;
                    padding: 10px 30px;
                    border-radius: 50px;
                    border: 1px solid #fcd34d;
                }
                
                .footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 50px;
                    padding: 0 50px;
                }
                .signature {
                    text-align: center;
                }
                .signature-line {
                    width: 200px;
                    border-bottom: 1px solid #94a3b8;
                    margin-bottom: 10px;
                }
                .signature p {
                    margin: 5px 0;
                    color: #475569;
                    font-size: 0.9em;
                }
                .signature .title {
                    font-weight: bold;
                    color: #1e293b;
                }

                @media print {
                    body { background-color: white; padding: 0; }
                    .certificate-wrapper { box-shadow: none; padding: 0; }
                }
            </style>
        </head>
        <body>
            <div class="certificate-wrapper">
                <div class="certificate-container">
                    <div class="border-outer"></div>
                    <div class="border-inner"></div>
                    
                    <div class="logo">M</div>
                    <h1>SERTIFIKAT KELULUSAN</h1>
                    <p class="subtitle">Master Office LMS</p>
                    
                    <p style="color: #64748b; margin-bottom: 5px;">Diberikan dengan bangga kepada:</p>
                    <div class="name">${name}</div>
                    <p class="class-info">Kelas: ${className}</p>
                    
                    <p class="description">
                        Atas dedikasi, ketekunan, dan keberhasilannya telah menyelesaikan seluruh modul pembelajaran Microsoft Office & Google Workspace serta menyelesaikan semua tugas praktik yang diberikan.
                    </p>
                    
                    <div class="score">Skor Akhir: ${score} Poin</div>
                    
                    <div class="footer">
                        <div class="signature">
                            <p class="title">Master Office</p>
                            <div class="signature-line"></div>
                            <p>Administrator Sistem</p>
                        </div>
                        <div class="signature">
                            <p class="title">Dicetak pada:</p>
                            <div class="signature-line"></div>
                            <p>${today}</p>
                        </div>
                    </div>
                </div>
            </div>
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `;

    certWindow.document.write(certHTML);
    certWindow.document.close();
};
