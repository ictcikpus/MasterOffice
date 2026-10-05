// ==========================================
// DATABASE APLIKASI (Di-embed agar selalu jalan)
// ==========================================
const appData = {
  "modules": [
    {
      "id": "word", "name": "Microsoft Word", "icon": "fa-solid fa-file-word", "color": "#3b82f6",
      "levels": [
        {
          "id": 1, "name": "Dasar & Format Dokumen", "desc": "Fundamental penulisan & format dasar.",
          "material": "<h3>Tingkat Dasar (Basic)</h3><ul><li><b>Font Formatting:</b> Mengubah jenis huruf, Ukuran, Bold (Ctrl+B), Italic (Ctrl+I), Underline (Ctrl+U).</li><li><b>Paragraph Alignment:</b> Align Left (Kiri), Center (Tengah), Align Right (Kanan), Justify (Rata Kiri Kanan).</li><li><b>Save & Export:</b> Shortcut <b>Ctrl+S</b> untuk menyimpan dokumen.</li></ul>",
          "quizBank": [
            { "question": "Shortcut keyboard untuk menebalkan teks (Bold) adalah?", "options": ["Ctrl + B", "Ctrl + I", "Ctrl + U", "Ctrl + S"], "answer": 0 },
            { "question": "Untuk membuat teks rata kiri dan kanan secara bersamaan, kita menggunakan fitur...", "options": ["Align Center", "Align Left", "Justify", "Wrap Text"], "answer": 2 },
            { "question": "Format file default ketika menyimpan dokumen Microsoft Word generasi baru adalah...", "options": [".xls", ".docx", ".pptx", ".txt"], "answer": 1 },
            { "question": "Bagaimana cara cepat menyimpan dokumen yang sedang dikerjakan?", "options": ["Alt + F4", "Ctrl + S", "Ctrl + P", "Ctrl + X"], "answer": 1 },
            { "question": "Fungsi dari shortcut Ctrl+Z adalah untuk?", "options": ["Menyalin teks", "Membatalkan perintah terakhir (Undo)", "Menghapus dokumen", "Menyisipkan gambar"], "answer": 1 }
          ]
        },
        {
          "id": 2, "name": "Sisipan Objek & Tata Letak", "desc": "Menyisipkan Tabel, Gambar, dan Margins.",
          "material": "<h3>Tingkat Menengah (Intermediate)</h3><ul><li><b>Insert Table:</b> Menu Insert > Table untuk membuat struktur baris dan kolom.</li><li><b>Page Layout:</b> Margins adalah jarak batas tepi kertas. Orientation mengatur kertas berdiri (Portrait) atau memanjang (Landscape).</li><li><b>Header & Footer:</b> Area atas dan bawah dokumen yang berulang di setiap halaman.</li></ul>",
          "quizBank": [
            { "question": "Di tab menu manakah Anda dapat menyisipkan Tabel (Table)?", "options": ["Home", "Insert", "Design", "References"], "answer": 1 },
            { "question": "Pengaturan untuk mengubah kertas dari bentuk berdiri menjadi memanjang disebut...", "options": ["Margins", "Size", "Orientation (Landscape)", "Columns"], "answer": 2 },
            { "question": "Area di bagian paling atas halaman dokumen yang terus berulang disebut...", "options": ["Footer", "Margin", "Header", "Watermark"], "answer": 2 },
            { "question": "Fitur untuk mengatur jarak batas tepi teks dengan tepi kertas adalah...", "options": ["Spacing", "Indent", "Margins", "Line Space"], "answer": 2 },
            { "question": "Untuk memasukkan foto ke dalam dokumen, tombol yang diklik adalah...", "options": ["Insert > Picture", "Home > Image", "Design > Photo", "View > Insert"], "answer": 0 }
          ]
        },
        {
          "id": 3, "name": "Standar Industri Profesional", "desc": "Mail Merge, Daftar Isi Otomatis (TOC).",
          "material": "<h3>Tingkat Lanjut (Advanced)</h3><ul><li><b>Styles (Heading):</b> Digunakan untuk membuat struktur bab pada dokumen.</li><li><b>Table of Contents (TOC):</b> Membuat Daftar Isi secara OTOMATIS.</li><li><b>Mail Merge:</b> Fitur untuk mencetak ratusan surat dengan database dari Excel.</li></ul>",
          "quizBank": [
            { "question": "Fitur industri untuk mencetak ratusan surat undangan secara otomatis dengan data dari Excel adalah...", "options": ["Table of Contents", "Track Changes", "Mail Merge", "Macro"], "answer": 2 },
            { "question": "Syarat utama agar kita bisa membuat Daftar Isi otomatis adalah...", "options": ["Mengetik titik-titik manual", "Menggunakan fitur Styles (Heading 1, 2, dll)", "Memasukkan tabel", "Mengubah warna teks"], "answer": 1 },
            { "question": "Tab menu yang digunakan untuk mengakses fitur Mail Merge adalah...", "options": ["Insert", "Mailings", "Review", "View"], "answer": 1 },
            { "question": "Daftar isi otomatis (Table of Contents) dapat diakses melalui tab menu...", "options": ["References", "Home", "Design", "Layout"], "answer": 0 },
            { "question": "File ekstensi apa yang umumnya dihubungkan dengan Word untuk melakukan Mail Merge?", "options": [".pdf", ".xlsx (Excel)", ".pptx", ".jpg"], "answer": 1 }
          ]
        }
      ]
    },
    {
      "id": "excel", "name": "Microsoft Excel", "icon": "fa-solid fa-file-excel", "color": "#10b981",
      "levels": [
        {
          "id": 1, "name": "Fundamental Spreadsheet", "desc": "Sel, Baris, Kolom & Aritmatika.",
          "material": "<h3>Tingkat Dasar (Basic Excel)</h3><ul><li><b>Kolom:</b> Deret Vertikal (A, B). <b>Baris:</b> Deret Horizontal (1, 2).</li><li><b>Sel (Cell):</b> Titik temu kolom dan baris (Contoh: B5).</li><li><b>Aritmatika Dasar:</b> Rumus WAJIB diawali dengan sama dengan (=).</li></ul>",
          "quizBank": [
            { "question": "Semua rumus atau fungsi dalam Excel wajib diawali dengan tanda...", "options": ["+", "@", "=", "#"], "answer": 2 },
            { "question": "Pertemuan antara kolom C dan baris ke 5 disebut sebagai sel...", "options": ["5C", "C5", "Row C", "Col 5"], "answer": 1 },
            { "question": "Simbol matematika yang digunakan untuk operasi perkalian di Excel adalah...", "options": ["x", "*", "/", "+"], "answer": 1 },
            { "question": "Kolom dalam Excel direpresentasikan menggunakan...", "options": ["Angka (1,2,3...)", "Huruf (A,B,C...)", "Simbol", "Warna"], "answer": 1 }
          ]
        },
        {
          "id": 2, "name": "Fungsi Statistik & Logika", "desc": "SUM, AVERAGE & Logika IF.",
          "material": "<h3>Tingkat Menengah (Intermediate)</h3><ul><li><b>=SUM()</b>: Menjumlahkan angka.</li><li><b>=AVERAGE()</b>: Menghitung rata-rata.</li><li><b>Fungsi IF:</b> <code>=IF(kondisi, \"Benar\", \"Salah\")</code></li></ul>",
          "quizBank": [
            { "question": "Fungsi yang digunakan untuk menjumlahkan sekumpulan angka adalah...", "options": ["=COUNT()", "=AVERAGE()", "=SUM()", "=MAX()"], "answer": 2 },
            { "question": "Jika ingin mencari nilai rata-rata ujian siswa, kita menggunakan fungsi...", "options": ["=MEAN()", "=AVERAGE()", "=MEDIAN()", "=SUM()"], "answer": 1 },
            { "question": "Penulisan fungsi logika IF yang benar untuk kelulusan nilai 75 adalah...", "options": ["=IF(A1>75, Lulus, Gagal)", "=IF(A1>=75, \"Lulus\", \"Gagal\")", "=IF(A1=75, Lulus)", "=IF(Lulus, Gagal, 75)"], "answer": 1 },
            { "question": "Untuk mencari nilai tertinggi, fungsi yang digunakan adalah...", "options": ["=MAX()", "=MIN()", "=TOP()", "=HIGH()"], "answer": 0 }
          ]
        },
        {
          "id": 3, "name": "Analisis Data Industri", "desc": "VLOOKUP, Pivot Table.",
          "material": "<h3>Tingkat Lanjut (Advanced)</h3><ul><li><b>VLOOKUP:</b> Mencari data dari tabel referensi master secara Vertikal.</li><li><b>Referensi Absolut ($):</b> Mengunci posisi sel (Tekan F4).</li><li><b>Pivot Table:</b> Merangkum ribuan baris data otomatis.</li></ul>",
          "quizBank": [
            { "question": "Simbol yang digunakan untuk mengunci sel (Absolute Reference) agar tidak bergeser saat ditarik adalah...", "options": ["%", "&", "$", "#"], "answer": 2 },
            { "question": "Fungsi untuk mencari data dari tabel referensi master secara vertikal adalah...", "options": ["=HLOOKUP", "=VLOOKUP", "=SEARCH", "=MATCH"], "answer": 1 },
            { "question": "Tombol keyboard (shortcut) untuk mengunci sel dengan cepat (memberikan simbol $) adalah...", "options": ["F1", "F2", "F4", "F12"], "answer": 2 },
            { "question": "Fitur analisis data di Excel yang merangkum ribuan data tanpa rumus manual adalah...", "options": ["Conditional Formatting", "Pivot Table", "Chart", "Data Validation"], "answer": 1 }
          ]
        }
      ]
    },
    {
      "id": "powerpoint", "name": "PowerPoint", "icon": "fa-solid fa-file-powerpoint", "color": "#f97316",
      "levels": [
        {
          "id": 1, "name": "Desain Slide Dasar", "desc": "Layout presentasi efektif.",
          "material": "<h3>Tingkat Dasar (Basic)</h3><ul><li><b>Slide Layouts:</b> Menggunakan <i>Title Slide</i> atau <i>Title and Content</i>.</li><li><b>Tampilan Presentasi:</b> Shortcut meluncurkan layar penuh dari halaman pertama adalah <b>F5</b>.</li></ul>",
          "quizBank": [
            { "question": "Tombol shortcut keyboard untuk menjalankan presentasi dari slide PERTAMA adalah...", "options": ["F1", "F5", "Shift + F5", "Esc"], "answer": 1 },
            { "question": "Layout slide yang biasanya digunakan untuk halaman pertama presentasi adalah...", "options": ["Blank", "Title Slide", "Two Content", "Picture"], "answer": 1 },
            { "question": "Untuk mengakhiri tampilan Slide Show, kita menekan tombol...", "options": ["Enter", "Spacebar", "Esc", "Backspace"], "answer": 2 },
            { "question": "Tombol shortcut untuk menjalankan presentasi dimulai dari slide yang sedang aktif / dibuka saat ini adalah...", "options": ["F5", "Shift + F5", "Ctrl + P", "Alt + F4"], "answer": 1 }
          ]
        },
        {
          "id": 2, "name": "Dinamika Animasi", "desc": "Transisi & pergerakan objek.",
          "material": "<h3>Tingkat Menengah (Intermediate)</h3><ul><li><b>Transitions:</b> Efek pergerakan perpindahan antarahalaman slide.</li><li><b>Animations:</b> Efek pada objek di dalam satu slide (Entrance, Emphasis, Exit).</li></ul>",
          "quizBank": [
            { "question": "Efek visual yang muncul saat berpindah dari SATU SLIDE ke SLIDE LAINNYA disebut...", "options": ["Animations", "Transitions", "Design", "Slide Master"], "answer": 1 },
            { "question": "Animasi jenis 'Entrance' memiliki fungsi untuk...", "options": ["Membuat objek menghilang", "Membawa objek masuk ke dalam layar", "Mengubah warna objek", "Memindahkan slide"], "answer": 1 },
            { "question": "Jika kita ingin teks berputar-putar di tempat untuk menarik perhatian audiens, kita menggunakan animasi...", "options": ["Entrance", "Emphasis (Kuning)", "Exit", "Motion Paths"], "answer": 1 },
            { "question": "Di menu manakah kita bisa memasukkan file video ke dalam presentasi?", "options": ["Design > Video", "Transitions > Media", "Insert > Video", "Animations > Play"], "answer": 2 }
          ]
        },
        {
          "id": 3, "name": "Master & Ekspor", "desc": "Slide Master & Export Video.",
          "material": "<h3>Tingkat Lanjut (Advanced)</h3><ul><li><b>Slide Master:</b> Fitur mengatur master template. Logo di sini akan muncul di semua slide dan tak bisa terklik.</li><li><b>Export to Video:</b> Mengubah PPT menjadi Video MP4 (File > Export).</li></ul>",
          "quizBank": [
            { "question": "Fitur yang sangat tepat digunakan jika ingin meletakkan logo perusahaan agar otomatis muncul di semua slide dan tidak bisa terklik adalah...", "options": ["Copy Paste", "Slide Master", "Group Objects", "Transitions"], "answer": 1 },
            { "question": "Mode yang menampilkan catatan pembicara (Notes) dan Timer di layar laptop, namun audiens hanya melihat slide di proyektor disebut...", "options": ["Slide Sorter", "Presenter View", "Reading View", "Normal View"], "answer": 1 },
            { "question": "PowerPoint modern memungkinkan kita mengubah file presentasi (.pptx) menjadi file video (.mp4). Menu yang digunakan adalah...", "options": ["File > Save As Word", "File > Export > Create a Video", "Insert > Video", "Slide Show Record"], "answer": 1 },
            { "question": "Tampilan untuk melihat semua slide presentasi secara bersamaan dalam ukuran kecil (thumbnail) disebut...", "options": ["Normal", "Slide Sorter", "Notes Page", "Slide Master"], "answer": 1 }
          ]
        }
      ]
    }
  ]
};

// ==========================================
// STATE APLIKASI
// ==========================================
let studentName = "";
let studentClass = "";
let currentModule = null;
let currentLevelData = null;
let activeQuestions = [];
let currentQIndex = 0;
let score = 0;
const QUESTIONS_PER_SESSION = 4; // Menampilkan 4 soal secara acak tiap main

// ==========================================
// AUDIO SYSTEM
// ==========================================
let audioCtx;
function playSound(type) {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        const now = audioCtx.currentTime;
        
        if (type === 'click') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
            gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
        } else if (type === 'correct') {
            osc.type = 'triangle'; osc.frequency.setValueAtTime(600, now); osc.frequency.setValueAtTime(800, now + 0.1);
            gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now); osc.stop(now + 0.3);
        } else if (type === 'wrong') {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, now); osc.frequency.linearRampToValueAtTime(150, now + 0.2);
            gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now); osc.stop(now + 0.3);
        }
    } catch(e) { console.log("Audio not supported or blocked"); }
}

// ==========================================
// FUNGSI NAVIGASI LAYAR
// ==========================================
function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    window.scrollTo(0,0);
}

// ==========================================
// 1. LOGIN
// ==========================================
function masukSistem() {
    playSound('click');
    const nameInput = document.getElementById('input-name').value.trim();
    const classInput = document.getElementById('input-class').value.trim();

    if (nameInput === "" || classInput === "") {
        alert("Mohon isi Nama Lengkap dan Kelas Anda!");
        return;
    }

    studentName = nameInput;
    studentClass = classInput;
    
    // Update Badge Header
    document.getElementById('user-status-badge').innerHTML = `<span class="badge" style="background:rgba(16,185,129,0.2); color:#10b981; border:1px solid #10b981;"><i class="fa-solid fa-user-check"></i> ${studentName}</span>`;
    
    renderModules();
    switchView('dashboard');
}

// ==========================================
// 2. DASHBOARD MODUL
// ==========================================
function renderModules() {
    const grid = document.getElementById('module-grid');
    grid.innerHTML = '';
    
    appData.modules.forEach((mod) => {
        const card = document.createElement('div');
        card.className = 'level-card';
        card.style.setProperty('--card-color', mod.color);
        card.innerHTML = `
            <i class="${mod.icon} icon"></i>
            <h3 style="margin-bottom:5px;">${mod.name}</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem;">${mod.levels.length} Level Tersedia</p>
        `;
        card.onclick = () => { playSound('click'); openModule(mod); };
        grid.appendChild(card);
    });
}

// ==========================================
// 3. LEVEL & MATERI
// ==========================================
function openModule(mod) {
    currentModule = mod;
    document.documentElement.style.setProperty('--active-color', mod.color);
    document.getElementById('module-title-display').textContent = mod.name;
    
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';
    
    mod.levels.forEach((lvl) => {
        const card = document.createElement('div');
        card.className = 'level-card';
        card.style.setProperty('--card-color', mod.color);
        card.innerHTML = `
            <div class="level-tag">LVL ${lvl.id}</div>
            <h3 style="margin-top:10px; font-size:1.2rem;">${lvl.name}</h3>
            <p style="color: var(--text-muted); font-size:0.85rem; margin-top:10px;">${lvl.desc}</p>
        `;
        card.onclick = () => { playSound('click'); openMaterial(lvl); };
        grid.appendChild(card);
    });
    switchView('level-selection');
}

function openMaterial(level) {
    currentLevelData = level;
    document.getElementById('level-badge').textContent = `LEVEL ${level.id}`;
    document.getElementById('level-badge').style.background = currentModule.color;
    
    document.getElementById('materi-title').textContent = level.name;
    document.getElementById('materi-icon').className = `${currentModule.icon}`;
    document.getElementById('materi-icon').style.color = currentModule.color;
    document.getElementById('materi-text').innerHTML = level.material;
    
    switchView('reader');
}

function showDashboard() { playSound('click'); switchView('dashboard'); }
function goBackToLevels() { playSound('click'); switchView('level-selection'); }

// ==========================================
// 4. KUIS INTERAKTIF (FISHER-YATES SHUFFLE)
// ==========================================
function shuffleArray(array) {
    let newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

function startQuiz() {
    playSound('click');
    score = 0; currentQIndex = 0;
    document.getElementById('live-score').textContent = score;
    
    // Acak soal
    let bankSoal = shuffleArray(currentLevelData.quizBank); 
    let totalQ = Math.min(QUESTIONS_PER_SESSION, bankSoal.length);
    activeQuestions = bankSoal.slice(0, totalQ); // Ambil sejumlah totalQ
    
    document.getElementById('total-q-num').textContent = totalQ;
    updateProgress();
    renderQuestion();
    switchView('quiz-area');
}

function updateProgress() {
    const percentage = ((currentQIndex) / activeQuestions.length) * 100;
    document.getElementById('quiz-progress').style.width = `${percentage}%`;
}

function renderQuestion() {
    const q = activeQuestions[currentQIndex];
    document.getElementById('current-q-num').textContent = currentQIndex + 1;
    document.getElementById('question-text').innerHTML = q.question;
    
    const optionsGrid = document.getElementById('options-container');
    optionsGrid.innerHTML = '';
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span style="color:var(--active-color); font-weight:800; font-size:1.1rem;">${String.fromCharCode(65 + index)}</span> <span>${opt}</span>`;
        btn.onclick = () => checkAnswer(index, btn);
        optionsGrid.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, btnElement) {
    const correctIndex = activeQuestions[currentQIndex].answer;
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(btn => btn.disabled = true); 
    
    if (selectedIndex === correctIndex) {
        playSound('correct'); 
        btnElement.classList.add('correct');
        score += (100 / activeQuestions.length); 
        document.getElementById('live-score').textContent = Math.round(score);
    } else {
        playSound('wrong'); 
        btnElement.classList.add('wrong');
        allBtns[correctIndex].classList.add('correct'); // Tunjukkan jawaban benar
    }
    
    currentQIndex++;
    updateProgress();
    
    setTimeout(() => {
        if (currentQIndex < activeQuestions.length) {
            renderQuestion();
        } else {
            finishQuiz();
        }
    }, 1500); 
}

// ==========================================
// 5. HASIL & SERTIFIKAT
// ==========================================
function finishQuiz() {
    let finalScore = Math.round(score);
    document.getElementById('final-score').textContent = finalScore;
    document.getElementById('final-score').style.color = currentModule.color;
    
    const btnDownload = document.getElementById('btn-download-cert');
    const msg = document.getElementById('result-message');
    
    if(finalScore >= 70) {
        playSound('correct'); // Bunyi menang
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        msg.textContent = "Luar biasa! Anda berhak mendapatkan Sertifikat.";
        msg.style.color = "var(--success)";
        btnDownload.style.display = "flex";
    } else {
        msg.textContent = "Tetap semangat! Coba pelajari materi lagi dan ulang ujiannya.";
        msg.style.color = "var(--danger)";
        btnDownload.style.display = "none";
    }
    
    switchView('result-area');
}

function downloadCertificate() {
    playSound('click');
    const btn = document.getElementById('btn-download-cert');
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> MEMPROSES...`;
    
    // Siapkan Data
    document.getElementById('cert-name').textContent = studentName;
    document.getElementById('cert-class').textContent = studentClass;
    document.getElementById('cert-module').textContent = currentModule.name + " - Level " + currentLevelData.id;
    
    let predikat = "KOMPETEN";
    if(score >= 90) predikat = "SANGAT MEMUASKAN";
    else if(score >= 80) predikat = "MEMUASKAN";
    document.getElementById('cert-predikat').textContent = predikat;
    
    const element = document.getElementById('certificate-template');
    element.style.display = 'block';

    const opt = {
        margin:       0,
        filename:     `Sertifikat_${studentName.replace(/\s+/g, '_')}_${currentModule.id}.pdf`,
        image:        { type: 'jpeg', quality: 1 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'px', format: [1122, 793], orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        element.style.display = 'none';
        btn.innerHTML = `<i class="fa-solid fa-check"></i> BERHASIL DIUNDUH`;
        setTimeout(() => {
            btn.innerHTML = `<i class="fa-solid fa-file-pdf"></i> UNDUH SERTIFIKAT`;
        }, 3000);
    });
}
