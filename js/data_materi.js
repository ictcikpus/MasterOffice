// ==========================================
// DATABASE MATERI LENGKAP (COMPREHENSIVE MODULES)
// ==========================================

const materiData = [
    {
        id: 'word',
        title: 'Microsoft Word',
        icon: 'fa-file-word',
        color: 'blue',
        desc: 'Panduan Lengkap Pengolah Kata Profesional',
        slides: [
            {
                title: 'Mengenal Antarmuka Microsoft Word',
                content: `
                    <p class="mb-4">Sebelum mulai mengetik, kenali bagian-bagian utama Word agar navigasi Anda cepat:</p>
                    <ul class="list-disc pl-5 space-y-2 mb-4 text-slate-600">
                        <li><b>Quick Access Toolbar:</b> Tombol simpan (disket), Undo, dan Redo di pojok kiri atas.</li>
                        <li><b>Ribbon:</b> Deretan menu utama (Home, Insert, Design, Layout, dll).</li>
                        <li><b>Document Area:</b> Halaman putih raksasa tempat Anda bekerja.</li>
                        <li><b>Ruler:</b> Penggaris di atas dan kiri untuk mengatur margin.</li>
                        <li><b>Status Bar:</b> Menampilkan jumlah halaman, jumlah kata, dan bahasa di pojok kiri bawah.</li>
                    </ul>
                    <div class="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <p class="text-sm text-blue-800"><i class="fa-solid fa-lightbulb"></i> <b>Tips:</b> Tekan <kbd class="bg-white px-2 py-1 rounded border">Ctrl + F1</kbd> untuk menyembunyikan Ribbon agar layar lebih luas.</p>
                    </div>
                `,
                quiz: {
                    question: "Bagian Word yang menampilkan jumlah halaman dan jumlah kata di bagian bawah layar disebut...",
                    options: ["Ribbon", "Status Bar", "Quick Access", "Ruler"],
                    correct: 1
                }
            },
            {
                title: 'Formatting Teks Dasar (Font)',
                content: `
                    <p class="mb-4">Di tab <b>Home</b>, grup <b>Font</b> berfungsi mengubah tampilan huruf:</p>
                    <div class="grid grid-cols-2 gap-2 mb-4 text-sm">
                        <div class="bg-slate-100 p-2 rounded"><b>B (Bold):</b> Menebalkan teks.</div>
                        <div class="bg-slate-100 p-2 rounded"><b>I (Italic):</b> Memiringkan teks.</div>
                        <div class="bg-slate-100 p-2 rounded"><b>U (Underline):</b> Memberi garis bawah.</div>
                        <div class="bg-slate-100 p-2 rounded"><b>Strikethrough:</b> Mencoret teks.</div>
                        <div class="bg-slate-100 p-2 rounded"><b>Subscript:</b> Teks kecil di bawah (H2O).</div>
                        <div class="bg-slate-100 p-2 rounded"><b>Superscript:</b> Teks kecil di atas (X2).</div>
                    </div>
                    <p class="text-sm text-slate-500">Shortcut: <b>Ctrl+B</b> (Bold), <b>Ctrl+I</b> (Italic), <b>Ctrl+U</b> (Underline).</p>
                `,
                quiz: {
                    question: "Jika Anda ingin membuat pangkat matematika seperti X pangkat 2 (X²), Anda menggunakan fitur...",
                    options: ["Subscript", "Superscript", "Strikethrough", "Italic"],
                    correct: 1
                }
            },
            {
                title: 'Pengaturan Paragraf dan Spasi',
                content: `
                    <p class="mb-4">Paragraf yang rapi sangat penting untuk dokumen formal (makalah/skripsi). Pengaturannya ada di grup <b>Paragraph</b>.</p>
                    <ul class="list-disc pl-5 space-y-2 text-slate-600 mb-4">
                        <li><b>Alignment:</b> Rata kiri (Left), Tengah (Center), Kanan (Right), Rata Kiri-Kanan (Justify).</li>
                        <li><b>Line Spacing:</b> Jarak antar baris (1.0, 1.15, 1.5, atau 2.0). Standar makalah Indonesia biasanya 1.5.</li>
                        <li><b>Paragraph Spacing:</b> Jarak sebelum (Before) dan sesudah (After) paragraf (biasanya 0 pt atau 6 pt).</li>
                        <li><b>Indent:</b> Menjorok ke dalam untuk awal paragraf.</li>
                    </ul>
                `,
                quiz: {
                    question: "Untuk membuat laporan formal, spasi baris (Line Spacing) yang paling umum digunakan adalah...",
                    options: ["1.0", "1.5", "3.0", "Tidak diatur"],
                    correct: 1
                }
            },
            {
                title: 'Menyisipkan Tabel (Insert Table)',
                content: `
                    <p class="mb-4">Tabel digunakan untuk menyajikan data terstruktur. Masuk ke tab <b>Insert</b> -> <b>Table</b>.</p>
                    <p class="mb-2">Setelah tabel dibuat, akan muncul tab baru: <b>Table Design</b> dan <b>Layout</b>.</p>
                    <ul class="list-disc pl-5 text-sm text-slate-600 mb-4">
                        <li><b>Merge Cells:</b> Menggabungkan beberapa sel menjadi satu.</li>
                        <li><b>Split Cells:</b> Memecah satu sel menjadi beberapa.</li>
                        <li><b>Shading:</b> Memberi warna latar pada sel tabel.</li>
                    </ul>
                `,
                quiz: {
                    question: "Fitur untuk menggabungkan beberapa sel tabel menjadi satu kotak besar disebut...",
                    options: ["Split Cells", "Merge Cells", "Shading", "Insert Row"],
                    correct: 1
                }
            },
            {
                title: 'Page Setup: Margin & Orientasi',
                content: `
                    <p class="mb-4">Pengaturan halaman ada di tab <b>Layout</b>.</p>
                    <ul class="list-disc pl-5 space-y-2 text-slate-600 mb-4">
                        <li><b>Margins:</b> Batas tepi kertas (Atas, Bawah, Kiri, Kanan). Standar skripsi: Kiri 4cm, Atas 4cm, Kanan 3cm, Bawah 3cm.</li>
                        <li><b>Orientation:</b> Portrait (Tegak) atau Landscape (Mendatar).</li>
                        <li><b>Size:</b> Ukuran kertas (A4, F4/Folio, Letter).</li>
                        <li><b>Columns:</b> Membagi halaman menjadi 2 atau 3 kolom (seperti koran).</li>
                    </ul>
                `,
                quiz: {
                    question: "Jika Anda ingin membuat dokumen seperti format koran (2 kolom), Anda menggunakan fitur...",
                    options: ["Margins", "Orientation", "Columns", "Size"],
                    correct: 2
                }
            },
            {
                title: 'Header, Footer & Nomor Halaman',
                content: `
                    <p class="mb-4">Header (atas) dan Footer (bawah) berguna untuk menampilkan info berulang seperti Nama Sekolah, Judul, atau Nomor Halaman.</p>
                    <p class="mb-4">Cara membuatnya: Tab <b>Insert</b> -> <b>Page Number</b> -> Pilih posisi (misal: Bottom of Page).</p>
                    <div class="bg-amber-50 p-4 rounded-xl border border-amber-200 mb-4">
                        <p class="text-sm text-amber-800"><b>Penting:</b> Untuk skripsi, biasanya halaman awal (Cover) tidak diberi nomor. Gunakan fitur <b>"Different First Page"</b> di tab Header & Footer.</p>
                    </div>
                `,
                quiz: {
                    question: "Untuk membuat halaman pertama (Cover) tidak memiliki nomor halaman, kita centang opsi...",
                    options: ["Different Odd & Even Pages", "Different First Page", "Link to Previous", "Page Number Format"],
                    correct: 1
                }
            },
            {
                title: 'Menggunakan Styles & Heading',
                content: `
                    <p class="mb-4">Jangan memformat judul secara manual (menebalkan dan memperbesar font satu per satu). Gunakan <b>Styles</b> di tab Home.</p>
                    <p class="mb-4">Klik teks judul Anda, lalu pilih <b>Heading 1</b> untuk judul bab, <b>Heading 2</b> untuk sub-bab, dan seterusnya.</p>
                    <p class="text-sm text-slate-600">Keuntungan: Anda bisa membuat Daftar Isi Otomatis dan Navigation Pane (View > Navigation Pane) untuk melihat struktur dokumen.</p>
                `,
                quiz: {
                    question: "Apa keuntungan utama menggunakan fitur 'Styles' (Heading 1, Heading 2) di Word?",
                    options: ["Membuat tulisan berwarna", "Bisa membuat Daftar Isi Otomatis", "Menyimpan file lebih cepat", "Menghapus gambar"],
                    correct: 1
                }
            },
            {
                title: 'Daftar Isi Otomatis (Table of Contents)',
                content: `
                    <p class="mb-4">Jika Anda sudah menggunakan Heading Styles, membuat Daftar Isi sangat mudah.</p>
                    <ol class="list-decimal pl-5 space-y-2 text-slate-600 mb-4">
                        <li>Klik di halaman kosong tempat Anda ingin meletakkan Daftar Isi.</li>
                        <li>Masuk ke tab <b>References</b>.</li>
                        <li>Klik <b>Table of Contents</b> -> pilih gaya otomatis.</li>
                        <li>Jika ada perubahan halaman, klik tombol <b>Update Table</b> agar nomor halaman menyesuaikan.</li>
                    </ol>
                `,
                quiz: {
                    question: "Tab apa yang digunakan untuk menyisipkan Daftar Isi Otomatis?",
                    options: ["Insert", "Design", "References", "Mailings"],
                    correct: 2
                }
            },
            {
                title: 'Fitur Find & Replace',
                content: `
                    <p class="mb-4">Ingin mengganti 1 kata yang salah di seluruh 100 halaman dokumen secara instan?</p>
                    <p class="mb-4">Gunakan <b>Find & Replace</b> (Tab Home -> Replace, atau shortcut <b>Ctrl + H</b>).</p>
                    <p class="text-sm text-slate-600">Masukkan kata yang salah di "Find what", dan kata yang benar di "Replace with". Klik <b>Replace All</b>.</p>
                `,
                quiz: {
                    question: "Shortcut keyboard untuk membuka menu Find & Replace adalah...",
                    options: ["Ctrl + F", "Ctrl + H", "Ctrl + R", "Ctrl + G"],
                    correct: 1
                }
            },
            {
                title: 'Mail Merge (Surat Massal)',
                content: `
                    <p class="mb-4">Mail Merge digunakan untuk membuat surat undangan atau sertifikat massal dengan nama yang berbeda-beda secara otomatis.</p>
                    <p class="mb-4">Prosesnya: Buat desain surat utama -> Siapkan daftar nama di Excel -> Hubungkan via tab <b>Mailings</b> -> Insert Merge Field.</p>
                    <div class="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <p class="text-sm text-blue-800">Hasil akhirnya bisa langsung dicetak tanpa perlu mengetik nama satu per satu.</p>
                    </div>
                `,
                quiz: {
                    question: "Fitur untuk membuat surat massal dengan nama penerima yang berbeda secara otomatis disebut...",
                    options: ["Envelopes", "Labels", "Mail Merge", "Macro"],
                    correct: 2
                }
            },
            {
                title: 'Menyimpan ke Format PDF',
                content: `
                    <p class="mb-4">Saat mengumpulkan tugas, seringkali guru meminta format PDF agar dokumen tidak bisa diedit dan formatnya tidak berubah di komputer lain.</p>
                    <p class="mb-4">Caranya: Klik <b>File > Save As</b> (atau F12), lalu pada bagian <i>Save as type</i>, pilih <b>PDF (*.pdf)</b>.</p>
                `,
                quiz: {
                    question: "Mengapa tugas sering diminta dalam format PDF?",
                    options: ["Agar file lebih kecil", "Agar format tidak berubah di komputer lain", "Agar bisa diedit dengan mudah", "Agar bisa disisipi video"],
                    correct: 1
                }
            }
        ]
    },
    {
        id: 'excel',
        title: 'Microsoft Excel',
        icon: 'fa-file-excel',
        color: 'emerald',
        desc: 'Dari Data Menjadi Informasi (Rumus & Analisis)',
        slides: [
            {
                title: 'Mengenal Sel, Baris, dan Kolom',
                content: `
                    <p class="mb-4">Excel adalah lembar kerja raksasa yang terdiri dari:</p>
                    <ul class="list-disc pl-5 space-y-2 mb-4">
                        <li><b>Kolom (Column):</b> Ditandai dengan huruf (A, B, C).</li>
                        <li><b>Baris (Row):</b> Ditandai dengan angka (1, 2, 3).</li>
                        <li><b>Sel (Cell):</b> Pertemuan antara baris dan kolom (Contoh: <b>A1</b>).</li>
                        <li><b>Range:</b> Kumpulan sel (Contoh: <b>A1:B5</b>).</li>
                    </ul>
                    <p class="text-sm text-slate-600">Data yang diketik selalu masuk ke dalam <b>Sel Aktif</b> (sel yang memiliki kotak tebal).</p>
                `,
                quiz: {
                    question: "Pertemuan antara kolom C dan baris 5 disebut dengan...",
                    options: ["Sel C5", "Baris C5", "Kolom 5C", "Range C"],
                    correct: 0
                }
            },
            {
                title: 'Aturan Wajib Rumus Excel',
                content: `
                    <div class="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                        <p class="text-amber-800 font-bold text-lg">HUKUM WAJIB EXCEL!</p>
                        <p class="text-sm text-amber-700 mt-1">Setiap penulisan rumus atau fungsi <b>HARUS</b> diawali dengan tanda sama dengan (<b>=</b>). Jika tidak, Excel akan menganggapnya sebagai teks biasa.</p>
                    </div>
                    <p class="mb-2">Contoh Benar: <br> <code class="bg-slate-200 px-2 py-1 rounded">=10+5</code> (Hasil: 15)</p>
                    <p class="mb-2">Contoh Salah: <br> <code class="bg-slate-200 px-2 py-1 rounded">10+5</code> (Hasil: Teks "10+5")</p>
                `,
                quiz: {
                    question: "Karakter wajib yang harus diketik di awal sebelum menuliskan rumus Excel adalah...",
                    options: ["+", "-", "=", "@"],
                    correct: 2
                }
            },
            {
                title: 'Fungsi Dasar: SUM & AVERAGE',
                content: `
                    <p class="mb-4">Jangan menjumlahkan angka satu per satu jika datanya ratusan. Gunakan fungsi:</p>
                    <ul class="list-disc pl-5 space-y-2 mb-4">
                        <li><b>SUM:</b> Untuk menjumlahkan total. <br> <code class="bg-emerald-100 text-emerald-800 px-2 py-1 rounded">=SUM(A1:A10)</code></li>
                        <li><b>AVERAGE:</b> Untuk mencari nilai rata-rata. <br> <code class="bg-emerald-100 text-emerald-800 px-2 py-1 rounded">=AVERAGE(B1:B5)</code></li>
                        <li><b>COUNT:</b> Menghitung berapa banyak sel yang berisi angka. <br> <code class="bg-emerald-100 text-emerald-800 px-2 py-1 rounded">=COUNT(C1:C20)</code></li>
                    </ul>
                `,
                quiz: {
                    question: "Rumus untuk menghitung rata-rata dari data di sel A1 sampai A10 adalah...",
                    options: ["=SUM(A1:A10)", "=AVERAGE(A1:A10)", "=COUNT(A1:A10)", "=MAX(A1:A10)"],
                    correct: 1
                }
            },
            {
                title: 'Fungsi Statistik: MAX, MIN, & IF',
                content: `
                    <p class="mb-4">Untuk mengambil keputusan berdasarkan data:</p>
                    <ul class="list-disc pl-5 space-y-2 mb-4">
                        <li><b>MAX:</b> Mencari nilai tertinggi. <code class="bg-emerald-100 text-emerald-800 px-2 py-1 rounded">=MAX(C1:C20)</code></li>
                        <li><b>MIN:</b> Mencari nilai terendah. <code class="bg-emerald-100 text-emerald-800 px-2 py-1 rounded">=MIN(D1:D15)</code></li>
                        <li><b>IF:</b> Fungsi logika untuk mengecek kondisi (Benar/Salah).</li>
                    </ul>
                    <div class="bg-slate-100 p-3 rounded text-sm mb-4">
                        <b>Contoh IF:</b> Jika nilai di B2 lebih besar dari 75, maka "LULUS". <br>
                        <code class="text-emerald-600 font-bold mt-1 block">=IF(B2>75, "LULUS", "GAGAL")</code>
                    </div>
                `,
                quiz: {
                    question: "Fungsi Excel yang digunakan untuk mencari nilai tertinggi dalam satu rentang data adalah...",
                    options: ["MIN", "MAX", "SUM", "AVERAGE"],
                    correct: 1
                }
            },
            {
                title: 'Referensi Sel: Relatif vs Absolut ($)',
                content: `
                    <p class="mb-4">Saat menyalin rumus (copy-paste), referensi sel bisa berubah atau tetap.</p>
                    <ul class="list-disc pl-5 space-y-2 text-slate-600 mb-4">
                        <li><b>Relatif (A1):</b> Berubah saat rumus digeser ke kanan/bawah.</li>
                        <li><b>Absolut ($A$1):</b> Selalu menunjuk ke sel A1, tidak berubah. Ditandai dengan tanda Dolar ($) pada kolom dan baris.</li>
                    </ul>
                    <p class="text-sm text-slate-600">Tekan tombol <b>F4</b> saat mengetik referensi sel untuk menambahkan tanda $ secara otomatis.</p>
                `,
                quiz: {
                    question: "Simbol apa yang digunakan untuk membuat referensi sel menjadi absolut (tidak berubah saat di-copy)?",
                    options: ["#", "@", "$", "%"],
                    correct: 2
                }
            },
            {
                title: 'VLOOKUP: Mencari Data Vertikal',
                content: `
                    <p class="mb-4">Fungsi VLOOKUP sangat sakti untuk mencari data dari tabel referensi (misal: mencari nama siswa berdasarkan NIS).</p>
                    <p class="mb-2">Struktur: <code>=VLOOKUP(Nilai_Yang_Dicari, Tabel_Referensi, Nomor_Kolom, 0)</code></p>
                    <div class="bg-amber-50 p-4 rounded-xl border border-amber-200 mb-4">
                        <p class="text-sm text-amber-800"><b>Ingat:</b> Nilai yang dicari harus berada di <b>kolom paling kiri</b> dari tabel referensi.</p>
                    </div>
                `,
                quiz: {
                    question: "Fungsi yang digunakan untuk mencari data secara vertikal dari tabel referensi adalah...",
                    options: ["HLOOKUP", "VLOOKUP", "SUMIF", "COUNTIF"],
                    correct: 1
                }
            },
            {
                title: 'Freeze Panes: Mengunci Judul',
                content: `
                    <p class="mb-4">Saat Anda scroll ke bawah pada data yang panjang (misal 1000 baris), judul kolom di atas akan hilang.</p>
                    <p class="mb-4">Untuk mengunci judul agar selalu terlihat, masuk ke tab <b>View</b> -> <b>Freeze Panes</b> -> Pilih <b>Freeze Top Row</b> (atau Freeze Panes jika ingin mengunci baris dan kolom tertentu).</p>
                `,
                quiz: {
                    question: "Fitur untuk mengunci baris judul agar tidak ikut ter-scroll saat ke bawah disebut...",
                    options: ["Lock Cell", "Freeze Panes", "Protect Sheet", "Format Painter"],
                    correct: 1
                }
            },
            {
                title: 'Membuat Grafik (Chart)',
                content: `
                    <p class="mb-4">Data yang hanya berupa angka akan membosankan. Ubah menjadi grafik agar mudah dibaca.</p>
                    <ol class="list-decimal pl-5 space-y-2 text-slate-600 mb-4">
                        <li>Blok data yang ingin dibuat grafik (termasuk judulnya).</li>
                        <li>Masuk ke tab <b>Insert</b>.</li>
                        <li>Pilih jenis grafik: <b>Column</b> (Batang), <b>Pie</b> (Lingkaran), atau <b>Line</b> (Garis).</li>
                    </ol>
                `,
                quiz: {
                    question: "Grafik berbentuk lingkaran yang biasanya digunakan untuk melihat persentase disebut...",
                    options: ["Column Chart", "Line Chart", "Pie Chart", "Bar Chart"],
                    correct: 2
                }
            },
            {
                title: 'Conditional Formatting (Format Bersyarat)',
                content: `
                    <p class="mb-4">Fitur ini memberi warna otomatis pada sel berdasarkan nilainya.</p>
                    <p class="mb-4">Contoh: Beri warna merah pada nilai di bawah 75, dan hijau pada nilai di atas 90.</p>
                    <p class="text-sm text-slate-600">Caranya: Blok data -> Tab <b>Home</b> -> <b>Conditional Formatting</b> -> <b>Highlight Cells Rules</b> -> <b>Less Than...</b></p>
                `,
                quiz: {
                    question: "Fitur untuk memberi warna otomatis pada sel jika nilainya memenuhi kriteria tertentu disebut...",
                    options: ["Format Painter", "Conditional Formatting", "Cell Styles", "Sort & Filter"],
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
        desc: 'Seni Menyampaikan Ide Melalui Presentasi',
        slides: [
            {
                title: 'Slide Layout & Desain',
                content: `
                    <p class="mb-4">Slide presentasi yang baik tidak penuh dengan teks. Gunakan <b>Layout</b> yang sesuai.</p>
                    <p class="mb-4">Saat membuat slide baru (Ctrl+M), pilih layout seperti <b>Title Slide</b> (Judul), <b>Title and Content</b> (Judul & Isi), atau <b>Two Content</b> (Dua Kolom).</p>
                    <p class="text-sm text-slate-600">Gunakan fitur <b>Design Ideas</b> (jika menggunakan Office 365) untuk mendapatkan saran tata letak otomatis yang keren.</p>
                `,
                quiz: {
                    question: "Shortcut untuk menambahkan slide baru di PowerPoint adalah...",
                    options: ["Ctrl + N", "Ctrl + M", "Ctrl + S", "Ctrl + P"],
                    correct: 1
                }
            },
            {
                title: 'Transisi vs Animasi',
                content: `
                    <p class="mb-4">Sering tertukar! Ini perbedaannya:</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-orange-50 p-4 rounded-xl border border-orange-200">
                            <b class="text-orange-700">Transisi (Transition)</b>
                            <p class="text-sm text-slate-600 mt-1">Efek perpindahan antar <b>Slide</b> (misal: Slide 1 memudar masuk ke Slide 2). Ada di tab Transitions.</p>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-xl border border-blue-200">
                            <b class="text-blue-700">Animasi (Animation)</b>
                            <p class="text-sm text-slate-600 mt-1">Efek pergerakan pada <b>Objek</b> (teks/gambar) di dalam satu slide (misal: teks muncul terbang dari kiri). Ada di tab Animations.</p>
                        </div>
                    </div>
                `,
                quiz: {
                    question: "Efek teks yang muncul bergerak terbang dari samping di dalam satu slide disebut...",
                    options: ["Transition", "Animation", "Slide Show", "Layout"],
                    correct: 1
                }
            },
            {
                title: 'Slide Master: Desain Global',
                content: `
                    <p class="mb-4">Ingin memasang Logo Sekolah di <b>SEMUA</b> slide tanpa harus copy-paste satu per satu?</p>
                    <p class="mb-4">Gunakan fitur <b>Slide Master</b> (Tab View -> Slide Master). Taruh logo atau ubah font di slide paling atas, maka semua slide di bawahnya akan ikut berubah secara otomatis.</p>
                `,
                quiz: {
                    question: "Fitur untuk mengatur desain template, font, dan logo di seluruh slide secara serentak adalah...",
                    options: ["Slide Layout", "Slide Master", "Design Ideas", "Format Background"],
                    correct: 1
                }
            },
            {
                title: 'Menyisipkan Multimedia',
                content: `
                    <p class="mb-4">Presentasi yang baik adalah yang tidak membosankan. Sisipkan elemen multimedia melalui tab <b>Insert</b>:</p>
                    <ul class="list-disc pl-5 space-y-2 mb-4">
                        <li><b>Pictures:</b> Memasukkan gambar dari komputer.</li>
                        <li><b>Icons:</b> Ikon vektor yang bisa diubah warnanya.</li>
                        <li><b>Video:</b> Memasukkan video dari YouTube atau file lokal.</li>
                        <li><b>Audio:</b> Memasukkan musik latar belakang.</li>
                    </ul>
                `,
                quiz: {
                    question: "Untuk menyisipkan video dari YouTube, kita menggunakan menu...",
                    options: ["Insert > Video > Online Video", "Insert > Audio", "Insert > Pictures", "Insert > Screen Recording"],
                    correct: 0
                }
            },
            {
                title: 'Mode Presenter (Presenter View)',
                content: `
                    <p class="mb-4">Saat sedang presentasi, Anda bisa melihat catatan (notes) dan slide selanjutnya di layar laptop Anda, sementara audiens hanya melihat slide saat ini di proyektor.</p>
                    <p class="mb-4">Gunakan <b>Presenter View</b> (muncul otomatis jika terhubung ke proyektor, atau centang di tab Slide Show -> Use Presenter View).</p>
                `,
                quiz: {
                    question: "Mode presentasi yang memungkinkan pembicara melihat catatan (notes) secara rahasia disebut...",
                    options: ["Reading View", "Slide Sorter", "Presenter View", "Normal View"],
                    correct: 2
                }
            },
            {
                title: 'Shortcut Presentasi (F5)',
                content: `
                    <p class="mb-4">Jangan menggunakan mouse untuk memutar slide saat presentasi.</p>
                    <ul class="list-disc pl-5 space-y-2 text-slate-600 mb-4">
                        <li><b>F5:</b> Memulai presentasi dari Slide Pertama.</li>
                        <li><b>Shift + F5:</b> Memulai presentasi dari slide yang sedang dibuka.</li>
                        <li><b>Tombol Panah Kanan / Spasi:</b> Maju ke slide berikutnya.</li>
                        <li><b>B (Black Screen):</b> Menghentikan presentasi sejenak (layar jadi hitam) untuk memberi fokus pada pembicara.</li>
                    </ul>
                `,
                quiz: {
                    question: "Tombol keyboard untuk memulai Slide Show dari slide paling awal adalah...",
                    options: ["F1", "F5", "F12", "Esc"],
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
        desc: 'Kolaborasi Dokumen Berbasis Cloud',
        slides: [
            {
                title: 'Berbasis Cloud & Auto-Save',
                content: `
                    <p class="mb-4">Google Docs berjalan di browser (tanpa instalasi). Semua yang Anda ketik akan <b>tersimpan otomatis (Auto-save)</b> di Google Drive.</p>
                    <p class="text-sm text-slate-600 mb-4">Anda tidak perlu menekan tombol Save. Jika koneksi internet putus, Docs akan menyimpannya secara offline sementara, dan akan sinkron saat internet kembali.</p>
                `,
                quiz: {
                    question: "Keunggulan utama Google Docs dibanding Microsoft Word biasa adalah...",
                    options: ["Fitur rumus lengkap", "Menyimpan otomatis di Cloud", "Tidak butuh internet", "Tampilan lebih gelap"],
                    correct: 1
                }
            },
            {
                title: 'Sharing & Hak Akses',
                content: `
                    <p class="mb-4">Untuk membagikan dokumen, klik tombol <b>Share</b> di pojok kanan atas.</p>
                    <ul class="list-disc pl-5 space-y-2 text-slate-600 mb-4">
                        <li><b>Viewer:</b> Hanya bisa melihat.</li>
                        <li><b>Commenter:</b> Bisa memberi komentar, tapi tidak bisa mengubah teks.</li>
                        <li><b>Editor:</b> Bisa mengubah dan mengetik di dokumen.</li>
                    </ul>
                    <div class="bg-amber-50 p-4 rounded-xl border border-amber-200">
                        <p class="text-sm text-amber-800">Untuk mengumpulkan tugas, pastikan Anda mengubah akses menjadi <b>"Anyone with the link"</b> (Siapa saja yang memiliki link).</p>
                    </div>
                `,
                quiz: {
                    question: "Jika kita ingin guru bisa merevisi teks, kita harus memberikan akses sebagai...",
                    options: ["Viewer", "Commenter", "Editor", "Publisher"],
                    correct: 2
                }
            },
            {
                title: 'Kolaborasi Real-Time',
                content: `
                    <p class="mb-4">Ini adalah fitur "Killer" Google Workspace. Anda dan teman kelompok Anda bisa mengetik di dokumen yang <b>SAMA</b> pada waktu yang <b>BERSAMAAN</b>.</p>
                    <p class="mb-4">Anda akan melihat kursor berwarna-warni dengan nama teman Anda yang sedang mengetik. Sangat cocok untuk kerja kelompok tugas sekolah.</p>
                `,
                quiz: {
                    question: "Fitur utama yang membedakan Google Docs dengan Word (offline) adalah...",
                    options: ["Bisa membuat tabel", "Bisa kolaborasi real-time", "Bisa mencetak", "Bisa menyisipkan gambar"],
                    correct: 1
                }
            },
            {
                title: 'Mode Saran (Suggestion Mode)',
                content: `
                    <p class="mb-4">Saat guru merevisi tugas Anda, mereka biasanya menggunakan mode <b>Suggestion</b> (bukan Editing).</p>
                    <p class="mb-4">Teks yang dihapus akan dicoret (strikethrough), dan teks baru akan berwarna. Anda bisa menerima saran tersebut dengan klik tanda centang (Accept), atau menolaknya (Reject).</p>
                `,
                quiz: {
                    question: "Mode yang memungkinkan guru merevisi tanpa menghapus teks asli kita adalah...",
                    options: ["Editing Mode", "Viewing Mode", "Suggestion Mode", "Delete Mode"],
                    correct: 2
                }
            },
            {
                title: 'Riwayat Versi (Version History)',
                content: `
                    <p class="mb-4">Pernah tidak sengaja menghapus seluruh tugas teman Anda? Tenang!</p>
                    <p class="mb-4">Buka <b>File > Version history > See version history</b>. Anda bisa melihat rekaman dokumen dari awal dibuat, siapa yang mengubahnya, dan bisa mengembalikan (restore) ke versi sebelumnya.</p>
                `,
                quiz: {
                    question: "Fitur untuk melihat rekaman perubahan dan mengembalikan dokumen ke versi sebelumnya adalah...",
                    options: ["Track Changes", "Version History", "Time Machine", "Undo History"],
                    correct: 1
                }
            }
        ]
    },
    {
        id: 'gsheets',
        title: 'Google Sheets',
        icon: 'fa-solid fa-table',
        color: 'emerald',
        desc: 'Analisis Data Kolaboratif di Cloud',
        slides: [
            {
                title: 'Konsep Dasar Google Sheets',
                content: `
                    <p class="mb-4">Google Sheets memiliki antarmuka dan rumus yang sangat mirip dengan Microsoft Excel.</p>
                    <p class="mb-4">Jika Anda sudah paham rumus <code>=SUM()</code>, <code>=AVERAGE()</code>, atau <code>=VLOOKUP()</code> di Excel, Anda bisa langsung menggunakannya di sini tanpa mengubah format.</p>
                `,
                quiz: {
                    question: "Apakah sintaks rumus SUM() di Google Sheets sama dengan di Excel?",
                    options: ["Sama sekali berbeda", "Bisa digunakan dengan format yang sama", "Hanya bisa di PC", "Harus pakai bahasa Indonesia"],
                    correct: 1
                }
            },
            {
                title: 'Berbagi & Kolaborasi Data',
                content: `
                    <p class="mb-4">Sama seperti Docs, Anda bisa mengerjakan laporan keuangan atau tabel data secara bersamaan dengan teman kelompok.</p>
                    <p class="mb-4">Setiap perubahan sel akan langsung terlihat oleh orang lain yang memiliki akses.</p>
                `,
                quiz: {
                    question: "Salah satu keunggulan Google Sheets untuk kerja kelompok adalah...",
                    options: ["Bisa memutar video", "Bisa diedit beramai-ramai secara real-time", "Tidak butuh akun Google", "File berukuran sangat besar"],
                    correct: 1
                }
            },
            {
                title: 'Grafik Otomatis (Chart)',
                content: `
                    <p class="mb-4">Untuk membuat grafik dari data Anda:</p>
                    <ol class="list-decimal pl-5 space-y-2 text-slate-600 mb-4">
                        <li>Blok data yang ingin dibuat grafik.</li>
                        <li>Klik menu <b>Insert > Chart</b>.</li>
                        <li>Google Sheets akan otomatis merekomendasikan jenis grafik yang paling cocok dengan data Anda.</li>
                    </ol>
                `,
                quiz: {
                    question: "Menu yang digunakan untuk menyisipkan grafik di Google Sheets adalah...",
                    options: ["Format > Chart", "Insert > Chart", "Data > Chart", "View > Chart"],
                    correct: 1
                }
            },
            {
                title: 'Menu Explore (Analisis Cepat)',
                content: `
                    <p class="mb-4">Jika Anda malas membuat rumus manual, gunakan fitur <b>Explore</b> (ikon bintang di pojok kanan bawah).</p>
                    <p class="mb-4">Ketikan pertanyaan seperti <i>"Berapa total penjualan?"</i> atau <i>"Grafik rata-rata nilai"</i>, dan Sheets akan membuatkan rumus atau grafiknya untuk Anda secara otomatis.</p>
                `,
                quiz: {
                    question: "Fitur pintar yang bisa membuat rumus atau grafik otomatis hanya dengan mengetik pertanyaan adalah...",
                    options: ["Macro", "Explore", "Pivot Table", "Script Editor"],
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
        desc: 'Presentasi Kolaboratif & Integrasi Google Meet',
        slides: [
            {
                title: 'Kolaborasi Presentasi',
                content: `
                    <p class="mb-4">Sama seperti Docs dan Sheets, Google Slides memungkinkan Anda membuat presentasi secara berkelompok dari laptop masing-masing secara bersamaan.</p>
                    <p class="mb-4">Fitur ini sangat menghemat waktu dibandingkan PowerPoint yang mengharuskan menyatukan file dari flashdisk.</p>
                `,
                quiz: {
                    question: "Keunggulan utama membuat presentasi di Google Slides secara berkelompok adalah...",
                    options: ["Bisa edit bersamaan (real-time)", "File lebih besar", "Bisa tanpa internet", "Bisa diputar di bioskop"],
                    correct: 0
                }
            },
            {
                title: 'Menyisipkan Video YouTube',
                content: `
                    <p class="mb-4">Anda bisa menyisipkan video YouTube langsung ke dalam slide tanpa harus mengunduhnya.</p>
                    <p class="mb-4">Caranya: Menu <b>Insert > Video</b>, lalu pastekan link YouTube-nya. Video akan tampil dan bisa diputar saat presentasi.</p>
                `,
                quiz: {
                    question: "Untuk menyisipkan video dari YouTube ke Google Slides, kita menggunakan menu...",
                    options: ["Insert > Image", "Insert > Video", "Insert > Audio", "Insert > Link"],
                    correct: 1
                }
            },
            {
                title: 'Presentasi via Google Meet',
                content: `
                    <p class="mb-4">Jika Anda presentasi online, Google Slides terintegrasi langsung dengan <b>Google Meet</b>.</p>
                    <p class="mb-4">Saat mengklik tombol <i>Present</i>, Anda bisa memilih opsi presentasi ke dalam *Meeting* (Google Meet), sehingga audiens bisa melihat wajah Anda dan slide secara bersamaan.</p>
                `,
                quiz: {
                    question: "Aplikasi video conference yang terintegrasi langsung saat kita melakukan presentasi di Google Slides adalah...",
                    options: ["Zoom", "Microsoft Teams", "Google Meet", "WhatsApp"],
                    correct: 2
                }
            }
        ]
    }
];
