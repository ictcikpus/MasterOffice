// ==========================================
// DATABASE MATERI LENGKAP (Slide & Kuis)
// ==========================================
const materiData = [
    {
        id: 'word',
        title: 'Microsoft Word',
        icon: 'fa-file-word',
        color: 'blue',
        desc: 'Software pengolah kata untuk dokumen profesional.',
        slides: [
            {
                title: 'Pengenalan Antarmuka Word',
                content: `
                    <p class="mb-4">Saat membuka Microsoft Word, Anda akan disambut oleh antarmuka yang terdiri dari beberapa bagian utama:</p>
                    <ul class="list-disc pl-5 space-y-2 mb-4 text-slate-600">
                        <li><b>Quick Access Toolbar:</b> Tombol simpan, undo, redo di pojok kiri atas.</li>
                        <li><b>Ribbon:</b> Deretan menu (Home, Insert, Design, dll) di bagian atas.</li>
                        <li><b>Document Area:</b> Halaman putih tempat Anda mengetik.</li>
                        <li><b>Status Bar:</b> Menunjukkan jumlah halaman dan kata di pojok kiri bawah.</li>
                    </ul>
                    <div class="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <p class="text-sm text-blue-800"><i class="fa-solid fa-lightbulb"></i> <b>Tips:</b> Tekan tombol <kbd class="bg-white px-2 py-1 rounded border shadow-sm">Ctrl + F1</kbd> untuk menyembunyikan/menampilkan Ribbon agar layar lebih luas.</p>
                    </div>
                `,
                quiz: {
                    question: "Bagian Word yang berisi menu Home, Insert, dan Design disebut...",
                    options: ["Status Bar", "Ribbon", "Document Area", "Quick Access"],
                    correct: 1
                }
            },
            {
                title: 'Formatting Teks Dasar',
                content: `
                    <p class="mb-4">Di tab <b>Home</b>, terdapat grup <b>Font</b> yang berfungsi mengubah tampilan teks:</p>
                    <div class="grid grid-cols-2 gap-2 mb-4">
                        <div class="bg-slate-100 p-2 rounded"><b>B (Bold):</b> Menebalkan teks</div>
                        <div class="bg-slate-100 p-2 rounded"><b>I (Italic):</b> Memiringkan teks</div>
                        <div class="bg-slate-100 p-2 rounded"><b>U (Underline):</b> Garis bawah</div>
                        <div class="bg-slate-100 p-2 rounded"><b>A (Font Color):</b> Warna teks</div>
                    </div>
                    <p class="text-sm text-slate-500">Shortcut: <b>Ctrl+B</b> (Bold), <b>Ctrl+I</b> (Italic), <b>Ctrl+U</b> (Underline).</p>
                `,
                quiz: {
                    question: "Shortcut keyboard untuk menebalkan teks (Bold) adalah...",
                    options: ["Ctrl + I", "Ctrl + U", "Ctrl + B", "Ctrl + D"],
                    correct: 2
                }
            },
            {
                title: 'Pengaturan Paragraf & Spasi',
                content: `
                    <p class="mb-4">Paragraf yang rapi sangat penting untuk dokumen formal. Anda dapat mengaturnya di grup <b>Paragraph</b>.</p>
                    <ul class="list-disc pl-5 space-y-2 text-slate-600 mb-4">
                        <li><b>Alignment:</b> Rata kiri (Left), Tengah (Center), Kanan (Right), Rata Kiri-Kanan (Justify).</li>
                        <li><b>Line Spacing:</b> Jarak antar baris (1.0, 1.5, atau 2.0). Standar makalah biasanya 1.5.</li>
                        <li><b>Bullets & Numbering:</b> Membuat daftar berpoin atau bernomor.</li>
                    </ul>
                `,
                quiz: {
                    question: "Untuk membuat makalah formal, spasi baris (Line Spacing) yang disarankan adalah...",
                    options: ["1.0", "1.5", "2.5", "3.0"],
                    correct: 1
                }
            },
            {
                title: 'Menyisipkan Tabel (Insert Table)',
                content: `
                    <p class="mb-4">Tabel digunakan untuk menyajikan data terstruktur. Masuk ke tab <b>Insert</b> -> <b>Table</b>.</p>
                    <div class="bg-white border border-slate-200 rounded-xl p-4 mb-4">
                        <table class="w-full text-sm text-center border-collapse">
                            <tr class="bg-slate-100"><th class="border p-2">No</th><th class="border p-2">Nama</th><th class="border p-2">Nilai</th></tr>
                            <tr><td class="border p-2">1</td><td class="border p-2">Budi</td><td class="border p-2">90</td></tr>
                        </table>
                    </div>
                    <p class="text-sm text-slate-600">Setelah tabel dibuat, Anda bisa mengubah desainnya di tab <b>Table Design</b> dan menambah baris/kolom di tab <b>Layout</b>.</p>
                `,
                quiz: {
                    question: "Tab apa yang digunakan untuk pertama kali menyisipkan tabel?",
                    options: ["Home", "Insert", "Design", "Layout"],
                    correct: 1
                }
            },
            {
                title: 'Menyimpan & Format File (Save As)',
                content: `
                    <p class="mb-4">Menyimpan dokumen Word sangat mudah, namun perhatikan formatnya:</p>
                    <ul class="list-disc pl-5 space-y-2 mb-4">
                        <li><b>.docx:</b> Format standar Word (bisa diedit).</li>
                        <li><b>.pdf:</b> Format dokumen terkunci (tidak bisa diedit, aman untuk dikirim).</li>
                    </ul>
                    <p class="text-sm text-slate-500">Gunakan <b>F12</b> atau <b>File -> Save As</b> untuk memilih format dan lokasi penyimpanan.</p>
                `,
                quiz: {
                    question: "Jika Anda ingin mengirim dokumen agar tidak bisa diedit orang lain, sebaiknya simpan dalam format...",
                    options: [".docx", ".txt", ".pdf", ".exe"],
                    correct: 2
                }
            }
        ]
    },
    {
        id: 'excel',
        title: 'Microsoft Excel',
        icon: 'fa-file-excel',
        color: 'emerald',
        desc: 'Spreadsheet pengolah angka dan data statistik.',
        slides: [
            {
                title: 'Sekilas Tentang Excel',
                content: `
                    <p class="mb-4">Excel adalah program lembar kerja (spreadsheet) yang terdiri dari baris (Rows) dan kolom (Columns).</p>
                    <ul class="list-disc pl-5 space-y-2 mb-4">
                        <li><b>Row (Baris):</b> Ditandai dengan angka (1, 2, 3...).</li>
                        <li><b>Column (Kolom):</b> Ditandai dengan huruf (A, B, C...).</li>
                        <li><b>Cell (Sel):</b> Pertemuan antara baris dan kolom (contoh: A1).</li>
                        <li><b>Range:</b> Kumpulan sel (contoh: A1:A5).</li>
                    </ul>
                `,
                quiz: {
                    question: "Pertemuan antara Kolom B dan Baris 3 disebut...",
                    options: ["Sel B3", "Kolom 3B", "Baris B3", "Range B3"],
                    correct: 0
                }
            },
            {
                title: 'Aturan Penulisan Rumus',
                content: `
                    <div class="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                        <p class="text-amber-800 font-bold">PENTING!</p>
                        <p class="text-sm text-amber-700 mt-1">Setiap penulisan rumus di Excel <b>WAJIB</b> diawali dengan tanda sama dengan (<b>=</b>). Jika tidak, Excel akan menganggapnya sebagai teks biasa.</p>
                    </div>
                    <p class="mb-2">Contoh: <br> <code class="bg-slate-200 px-2 py-1 rounded">=2+2</code> (Benar, hasilnya 4) <br> <code class="bg-slate-200 px-2 py-1 rounded">2+2</code> (Salah, hanya teks "2+2")</p>
                `,
                quiz: {
                    question: "Karakter apa yang wajib ada di awal setiap rumus Excel?",
                    options: ["+", "-", "=", "@"],
                    correct: 2
                }
            },
            {
                title: 'Fungsi Matematika Dasar (SUM & AVERAGE)',
                content: `
                    <p class="mb-4">Fungsi paling sering digunakan untuk menghitung banyak data sekaligus:</p>
                    <ul class="list-disc pl-5 space-y-2 mb-4">
                        <li><b>SUM:</b> Menjumlahkan. Contoh: <code class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">=SUM(A1:A10)</code></li>
                        <li><b>AVERAGE:</b> Mencari rata-rata. Contoh: <code class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">=AVERAGE(B1:B5)</code></li>
                        <li><b>MAX:</b> Mencari nilai tertinggi.</li>
                        <li><b>MIN:</b> Mencari nilai terendah.</li>
                    </ul>
                `,
                quiz: {
                    question: "Rumus untuk menjumlahkan data dari sel A1 sampai A5 adalah...",
                    options: ["=JUMLAH(A1:A5)", "=TOTAL(A1:A5)", "=SUM(A1:A5)", "=PLUS(A1:A5)"],
                    correct: 2
                }
            },
            {
                title: 'Fungsi Logika IF',
                content: `
                    <p class="mb-4">Fungsi IF digunakan untuk mengambil keputusan berdasarkan kondisi tertentu (True/False).</p>
                    <p class="mb-2">Struktur: <code>=IF(Kondisi, Nilai_Jika_Benar, Nilai_Jika_Salah)</code></p>
                    <div class="bg-slate-100 p-4 rounded-lg text-sm mb-4">
                        <b>Contoh Kasus:</b> Jika nilai di sel B2 lebih dari 75, maka "LULUS", jika tidak "GAGAL".<br>
                        <code class="text-emerald-600 font-bold mt-2 block">=IF(B2>75, "LULUS", "GAGAL")</code>
                    </div>
                `,
                quiz: {
                    question: "Fungsi IF akan menghasilkan nilai jika kondisi bernilai...",
                    options: ["Hanya Benar (True)", "Hanya Salah (False)", "Benar dan Salah (Bisa diatur)", "Error"],
                    correct: 2
                }
            },
            {
                title: 'Membekukan Baris (Freeze Panes)',
                content: `
                    <p class="mb-4">Saat bekerja dengan data ratusan baris, judul kolom di atas akan hilang saat Anda scroll ke bawah.</p>
                    <p class="mb-4">Gunakan fitur <b>Freeze Panes</b> di tab <b>View</b> untuk mengunci baris atau kolom tertentu agar selalu terlihat.</p>
                `,
                quiz: {
                    question: "Fitur untuk mengunci baris judul agar tidak ikut ter-scroll disebut...",
                    options: ["Lock Cell", "Freeze Panes", "Protect Sheet", "Fix Row"],
                    correct: 1
                }
            }
        ]
    },
    {
        id: 'ppt',
        title: 'Microsoft PowerPoint',
        icon: 'fa-file-powerpoint',
        color: 'orange',
        desc: 'Software presentasi untuk slide yang menarik.',
        slides: [
            {
                title: 'Dasar Presentasi',
                content: `
                    <p class="mb-4">PowerPoint digunakan untuk menyampaikan ide melalui slide visual. Slide terdiri dari:</p>
                    <ul class="list-disc pl-5 space-y-2">
                        <li><b>Title Placeholder:</b> Tempat untuk judul slide.</li>
                        <li><b>Content Placeholder:</b> Tempat untuk teks, gambar, atau video.</li>
                    </ul>
                `,
                quiz: {
                    question: "Tombol keyboard untuk memulai presentasi (Slide Show) dari awal adalah...",
                    options: ["F1", "F5", "F12", "Esc"],
                    correct: 1
                }
            },
            {
                title: 'Transisi vs Animasi',
                content: `
                    <p class="mb-4">Banyak yang tertukar antara dua fitur ini:</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-orange-50 p-4 rounded-xl border border-orange-200">
                            <b class="text-orange-700">Transisi (Transition)</b>
                            <p class="text-sm text-slate-600 mt-1">Efek perpindahan antar <b>Slide</b> (misal: Slide 1 ke Slide 2 memudar).</p>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-xl border border-blue-200">
                            <b class="text-blue-700">Animasi (Animation)</b>
                            <p class="text-sm text-slate-600 mt-1">Efek pergerakan pada <b>Objek</b> di dalam slide (misal: teks muncul satu per satu).</p>
                        </div>
                    </div>
                `,
                quiz: {
                    question: "Efek teks yang muncul bergerak satu per satu di dalam satu slide disebut...",
                    options: ["Transition", "Animation", "Slide Show", "Design"],
                    correct: 1
                }
            },
            {
                title: 'Menggunakan Slide Master',
                content: `
                    <p class="mb-4">Jika Anda ingin menambahkan Logo sekolah di <b>SEMUA</b> slide tanpa harus copy-paste satu per satu, gunakan fitur <b>Slide Master</b> (di tab View).</p>
                    <p class="text-sm text-slate-500">Perubahan di Slide Master akan otomatis diterapkan ke seluruh halaman presentasi.</p>
                `,
                quiz: {
                    question: "Fitur untuk mengatur desain template seluruh slide secara serentak adalah...",
                    options: ["Slide Layout", "Slide Master", "Design Ideas", "Format Background"],
                    correct: 1
                }
            }
        ]
    },
    {
        id: 'gdocs',
        title: 'Google Docs',
        icon: 'fa-brands fa-google',
        color: 'blue',
        desc: 'Word processor berbasis cloud dengan kolaborasi.',
        slides: [
            {
                title: 'Apa itu Google Docs?',
                content: `
                    <p class="mb-4">Berbeda dengan Microsoft Word yang diinstal di komputer, Google Docs berjalan sepenuhnya di browser web Anda.</p>
                    <ul class="list-disc pl-5 space-y-2 mb-4">
                        <li><b>Gratis:</b> Cukup punya akun Google (Gmail).</li>
                        <li><b>Auto-Save:</b> Semua ketikan tersimpan otomatis di Google Drive, tidak perlu klik Save.</li>
                        <li><b>Riwayat Versi:</b> Anda bisa melihat siapa yang mengedit dokumen dan kapan.</li>
                    </ul>
                `,
                quiz: {
                    question: "Keunggulan utama Google Docs dibanding Ms Word biasa adalah...",
                    options: ["Fitur rumus yang lebih lengkap", "Menyimpan otomatis (Auto-save) di Cloud", "Tidak butuh internet", "Tampilan lebih gelap"],
                    correct: 1
                }
            },
            {
                title: 'Kolaborasi Real-Time',
                content: `
                    <p class="mb-4">Ini adalah fitur "killer" Google Docs. Anda dan teman Anda bisa mengetik di dokumen yang <b>SAMA</b> secara bersamaan.</p>
                    <div class="bg-slate-100 p-4 rounded-xl border border-slate-300">
                        <i class="fa-solid fa-users text-blue-500 mb-2"></i>
                        <p class="text-sm">Klik tombol <b>Share</b> di pojok kanan atas, masukkan email teman/guru, dan mereka bisa melihat atau mengedit dokumen Anda langsung dari layar mereka.</p>
                    </div>
                `,
                quiz: {
                    question: "Tombol apa yang digunakan untuk membagikan dokumen kepada guru atau teman?",
                    options: ["Publish", "Share", "Send", "Export"],
                    correct: 1
                }
            },
            {
                title: 'Komentar & Saran (Suggestion Mode)',
                content: `
                    <p class="mb-4">Saat guru merevisi tugas Anda, guru tidak harus menghapus teks asli Anda. Guru bisa menggunakan mode <b>Suggestion</b>.</p>
                    <p class="text-sm text-slate-600">Teks yang dihapus akan dicoret, dan teks baru akan berwarna. Anda bisa menerima (Accept) atau menolak (Reject) saran tersebut. Anda juga bisa menambahkan komentar di teks tertentu.</p>
                `,
                quiz: {
                    question: "Mode di Google Docs yang memungkinkan guru merevisi tanpa menghapus teks asli adalah...",
                    options: ["Editing Mode", "Viewing Mode", "Suggestion Mode", "Delete Mode"],
                    correct: 2
                }
            }
        ]
    },
    {
        id: 'gsheets',
        title: 'Google Sheets',
        icon: 'fa-solid fa-table',
        color: 'emerald',
        desc: 'Spreadsheet berbasis cloud untuk data kolaboratif.',
        slides: [
            {
                title: 'Google Sheets Dasar',
                content: `
                    <p class="mb-4">Konsep Google Sheets hampir sama dengan Microsoft Excel. Terdiri dari baris, kolom, dan sel.</p>
                    <p class="mb-4">Karena berbasis cloud, Anda bisa mengerjakan tugas kelompok dengan teman secara <i>real-time</i> di satu spreadsheet yang sama.</p>
                    <p class="text-sm text-slate-500">Menu Insert, Format, dan Data memiliki fungsi yang mirip dengan Excel.</p>
                `,
                quiz: {
                    question: "Fungsi utama Google Sheets adalah untuk mengolah...",
                    options: ["Video", "Teks Laporan", "Data dan Angka", "Presentasi"],
                    correct: 2
                }
            },
            {
                title: 'Rumus di Google Sheets',
                content: `
                    <p class="mb-4">Sama seperti Excel, penulisan rumus di Sheets juga diawali dengan tanda sama dengan (=).</p>
                    <p class="mb-2">Contoh fungsi penting yang sama persis:</p>
                    <ul class="list-disc pl-5 text-sm text-slate-600">
                        <li><code>=SUM(A1:A10)</code> untuk menjumlahkan.</li>
                        <li><code>=AVERAGE(B1:B5)</code> untuk rata-rata.</li>
                        <li><code>=VLOOKUP()</code> untuk mencari data vertikal.</li>
                    </ul>
                `,
                quiz: {
                    question: "Apakah rumus SUM() dari Excel bisa digunakan di Google Sheets?",
                    options: ["Tidak bisa sama sekali", "Bisa, karena sintaksnya sama", "Hanya bisa di PC", "Harus diubah formatnya"],
                    correct: 1
                }
            }
        ]
    },
    {
        id: 'gslides',
        title: 'Google Slides',
        icon: 'fa-solid fa-display',
        color: 'yellow',
        desc: 'Presentasi cloud dengan fitur kolaborasi.',
        slides: [
            {
                title: 'Presentasi Kolaboratif',
                content: `
                    <p class="mb-4">Google Slides memiliki fungsi yang sama dengan PowerPoint, namun berjalan di web.</p>
                    <p class="mb-4">Keunggulannya adalah tim Anda bisa mengedit slide presentasi secara bersamaan. Anda juga bisa membagikan tautan (link) presentasi agar bisa dilihat oleh orang lain tanpa perlu mengunduh file.</p>
                `,
                quiz: {
                    question: "Salah satu fitur unggulan Google Slides adalah...",
                    options: ["File berukuran sangat besar", "Bisa diedit beramai-ramai (real-time)", "Hanya jalan di Windows", "Tidak butuh akun"],
                    correct: 1
                }
            },
            {
                title: 'Menghubungkan ke Google Meet',
                content: `
                    <p class="mb-4">Saat presentasi online, Google Slides terintegrasi langsung dengan Google Meet.</p>
                    <p class="text-sm text-slate-600">Anda bisa membuka kamera/video call langsung dari dalam mode presentasi, sehingga audiens bisa melihat wajah Anda dan slide secara bersamaan.</p>
                `,
                quiz: {
                    question: "Aplikasi video conference yang terintegrasi langsung dengan Google Slides adalah...",
                    options: ["Zoom", "Microsoft Teams", "Google Meet", "WhatsApp"],
                    correct: 2
                }
            }
        ]
    }
];
