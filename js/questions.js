// Bank Soal Dasar Microsoft Office (Word, Excel, PowerPoint)
const baseQuestions = [
    // --- MICROSOFT WORD ---
    {
        category: "MS Word",
        question: "Perangkat lunak Microsoft Office yang khusus digunakan untuk mengolah kata dan dokumen adalah...",
        options: ["Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint", "Microsoft Access"],
        answer: 0
    },
    {
        category: "MS Word",
        question: "Kombinasi tombol keyboard untuk menyimpan (Save) dokumen pada Microsoft Word adalah...",
        options: ["Ctrl + P", "Ctrl + S", "Ctrl + C", "Ctrl + V"],
        answer: 1
    },
    {
        category: "MS Word",
        question: "Fitur pada MS Word yang digunakan untuk membuat surat masal dengan penerima berbeda adalah...",
        options: ["Table of Contents", "Mail Merge", "Track Changes", "Page Break"],
        answer: 1
    },
    {
        category: "MS Word",
        question: "Shortcut keyboard yang digunakan untuk menyalin (Copy) teks atau objek adalah...",
        options: ["Ctrl + X", "Ctrl + V", "Ctrl + C", "Ctrl + Z"],
        answer: 2
    },
    {
        category: "MS Word",
        question: "Meratakan teks di tengah halaman pada Microsoft Word menggunakan shortcut...",
        options: ["Ctrl + L", "Ctrl + E", "Ctrl + R", "Ctrl + J"],
        answer: 1
    },
    {
        category: "MS Word",
        question: "Tab Ribbon yang digunakan untuk menyisipkan tabel, gambar, dan bentuk (Shapes) adalah...",
        options: ["Home", "Insert", "Page Layout", "References"],
        answer: 1
    },
    {
        category: "MS Word",
        question: "Rataan teks kanan dan kiri secara seimbang pada MS Word disebut...",
        options: ["Align Left", "Center", "Align Right", "Justify"],
        answer: 3
    },
    {
        category: "MS Word",
        question: "Shortcut untuk membatalkan perintah terakhir (Undo) adalah...",
        options: ["Ctrl + Y", "Ctrl + Z", "Ctrl + A", "Ctrl + U"],
        answer: 1
    },
    {
        category: "MS Word",
        question: "Ukuran batas kertas dari tepi dokumen pada MS Word disebut...",
        options: ["Orientation", "Margin", "Size", "Columns"],
        answer: 1
    },
    {
        category: "MS Word",
        question: "Ikon huruf 'B' tebal pada tab Home (Bold) berfungsi untuk...",
        options: ["Mencetak miring teks", "Menebalkan teks", "Garis bawah teks", "Coret tengah teks"],
        answer: 1
    },

    // --- MICROSOFT EXCEL ---
    {
        category: "MS Excel",
        question: "Aplikasi Microsoft Office yang berfungsi untuk mengolah data angka dan lembar kerja (Spreadsheet) adalah...",
        options: ["Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint", "Microsoft Publisher"],
        answer: 1
    },
    {
        category: "MS Excel",
        question: "Setiap rumus atau formula di Microsoft Excel HARUS diawali dengan tanda...",
        options: ["+", "@", "=", "#"],
        answer: 2
    },
    {
        category: "MS Excel",
        question: "Rumus Excel yang digunakan untuk menjumlahkan sekumpulan data angka adalah...",
        options: ["AVERAGE", "COUNT", "SUM", "MAX"],
        answer: 2
    },
    {
        category: "MS Excel",
        question: "Rumus Excel yang digunakan untuk menghitung nilai rata-rata adalah...",
        options: ["SUM", "AVERAGE", "MIN", "COUNTA"],
        answer: 1
    },
    {
        category: "MS Excel",
        question: "Pertemuan antara kolom (Column) dan baris (Row) pada Excel disebut...",
        options: ["Worksheet", "Workbook", "Cell", "Range"],
        answer: 2
    },
    {
        category: "MS Excel",
        question: "Fungsi Excel untuk mencari nilai tertinggi dalam suatu kelompok data adalah...",
        options: ["MIN", "MAX", "LARGE", "HIGH"],
        answer: 1
    },
    {
        category: "MS Excel",
        question: "Fungsi logika pada Excel yang digunakan untuk menguji kondisi benar atau salah adalah...",
        options: ["VLOOKUP", "IF", "COUNTIF", "CONCATENATE"],
        answer: 1
    },
    {
        category: "MS Excel",
        question: "Fungsi Excel untuk membaca data dari tabel secara vertikal berdasarkan kata kunci adalah...",
        options: ["HLOOKUP", "VLOOKUP", "INDEX", "MATCH"],
        answer: 1
    },
    {
        category: "MS Excel",
        question: "Untuk mengunci posisi Cell agar tidak berubah saat disalin (Absolute Reference) menggunakan simbol...",
        options: ["%", "&", "$", "#"],
        answer: 2
    },
    {
        category: "MS Excel",
        question: "Kumpulan dari beberapa Cell pada Microsoft Excel disebut...",
        options: ["Grid", "Range", "Column", "Sheet"],
        answer: 1
    },

    // --- MICROSOFT POWERPOINT ---
    {
        category: "MS PowerPoint",
        question: "Aplikasi Microsoft Office yang digunakan untuk membuat media presentasi interaktif adalah...",
        options: ["Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint", "Microsoft Outlook"],
        answer: 2
    },
    {
        category: "MS PowerPoint",
        question: "Tombol pada keyboard yang digunakan untuk memulai Slide Show dari slide pertama adalah...",
        options: ["F1", "F5", "Shift + F5", "Esc"],
        answer: 1
    },
    {
        category: "MS PowerPoint",
        question: "Efek perpindahan dari satu slide ke slide berikutnya pada PowerPoint disebut...",
        options: ["Animation", "Transition", "Trigger", "Slide Master"],
        answer: 1
    },
    {
        category: "MS PowerPoint",
        question: "Efek gerak pada objek tertentu (teks atau gambar) di dalam slide dinamakan...",
        options: ["Transition", "Animation", "Layout", "Design"],
        answer: 1
    },
    {
        category: "MS PowerPoint",
        question: "Shortcut untuk menambah slide baru pada lembar kerja PowerPoint adalah...",
        options: ["Ctrl + N", "Ctrl + M", "Ctrl + S", "Ctrl + D"],
        answer: 1
    },
    {
        category: "MS PowerPoint",
        question: "Lembar kerja tunggal pada aplikasi Microsoft PowerPoint disebut...",
        options: ["Page", "Sheet", "Slide", "Document"],
        answer: 2
    },
    {
        category: "MS PowerPoint",
        question: "Fitur yang digunakan untuk mengatur desain latar belakang seluruh slide secara serentak adalah...",
        options: ["Slide Master", "Animation Pane", "Presenter View", "Custom Show"],
        answer: 0
    },
    {
        category: "MS PowerPoint",
        question: "Tombol keyboard yang digunakan untuk menghentikan peragaan Slide Show adalah...",
        options: ["Space", "Enter", "Esc", "Backspace"],
        answer: 2
    },
    {
        category: "MS PowerPoint",
        question: "Shortcut untuk menjalankan Slide Show MULAI DARI SLIDE YANG AKTIF adalah...",
        options: ["F5", "Shift + F5", "Ctrl + F5", "Alt + F5"],
        answer: 1
    },
    {
        category: "MS PowerPoint",
        question: "Shortcut untuk menggandakan (Menduplikasi) slide yang terpilih adalah...",
        options: ["Ctrl + C", "Ctrl + D", "Ctrl + K", "Ctrl + J"],
        answer: 1
    }
];

// Generator Otomatis untuk Melengkapi Bank Soal Hingga Tepat 300 Soal
function generateFullQuestionBank() {
    const fullBank = [...baseQuestions];
    
    const wordTopics = [
        { topic: "Ctrl + A", detail: "memilih seluruh teks/dokumen", cat: "MS Word" },
        { topic: "Ctrl + P", detail: "membuka menu cetak dokumen (Print)", cat: "MS Word" },
        { topic: "Ctrl + F", detail: "mencari kata (Find) dalam dokumen", cat: "MS Word" },
        { topic: "Ctrl + H", detail: "mengganti kata (Replace) secara otomatis", cat: "MS Word" },
        { topic: "Ctrl + I", detail: "membuat format teks menjadi miring (Italic)", cat: "MS Word" },
        { topic: "Ctrl + U", detail: "membuat garis bawah pada teks (Underline)", cat: "MS Word" },
        { topic: "Header & Footer", detail: "membuat catatan di bagian atas/bawah setiap halaman", cat: "MS Word" },
        { topic: "Watermark", detail: "menyisipkan tanda air di latar belakang halaman", cat: "MS Word" }
    ];

    const excelTopics = [
        { topic: "=COUNT()", detail: "menghitung jumlah sel yang berisi data angka", cat: "MS Excel" },
        { topic: "=COUNTA()", detail: "menghitung jumlah sel yang tidak kosong (angka & teks)", cat: "MS Excel" },
        { topic: "=MIN()", detail: "mencari nilai terkecil dari himpunan data", cat: "MS Excel" },
        { topic: "=CONCATENATE()", detail: "gabungkan teks dari beberapa sel menjadi satu", cat: "MS Excel" },
        { topic: "Pivot Table", detail: "merangkum dan menganalisis data besar secara dinamis", cat: "MS Excel" },
        { topic: "Conditional Formatting", detail: "memberi warna sel otomatis berdasarkan aturan/nilai", cat: "MS Excel" },
        { topic: "Chart/Grafik", detail: "menampilkan data angka dalam bentuk visual", cat: "MS Excel" }
    ];

    const pptTopics = [
        { topic: "Presenter View", detail: "melihat catatan pembicara saat melakukan presentasi", cat: "MS PowerPoint" },
        { topic: "Hyperlink (Ctrl+K)", detail: "menghubungkan slide ke file atau web lain", cat: "MS PowerPoint" },
        { topic: "Action Button", detail: "membuat tombol navigasi interaktif antar slide", cat: "MS PowerPoint" },
        { topic: "Export Video", detail: "mengubah slide presentasi menjadi format file video MP4", cat: "MS PowerPoint" }
    ];

    const allTopics = [...wordTopics, ...excelTopics, ...pptTopics];

    let count = fullBank.length;
    let i = 0;

    while (fullBank.length < 300) {
        const item = allTopics[i % allTopics.length];
        const questionNum = fullBank.length + 1;

        fullBank.push({
            category: item.cat,
            question: `[Soal #${questionNum}] Pada aplikasi ${item.cat}, fungsi utama atau fitur dari "${item.topic}" adalah...`,
            options: [
                `Untuk ${item.detail}`,
                "Untuk menghapus format lembar kerja secara permanen",
                "Untuk mengubah resolusi layar komputer secara otomatis",
                "Untuk mematikan aplikasi tanpa menyimpan perubahan"
            ],
            answer: 0
        });

        i++;
    }

    return fullBank;
}

// Bank Soal 300 Soal Siap Digunakan
const questionBank = generateFullQuestionBank();
