let userId = localStorage.getItem("student_id");
let userName = localStorage.getItem("student_name");
let userClass = localStorage.getItem("student_class");

function initUser() {
    if (!userId) {
        userId = "user_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("student_id", userId);
    }
    if (!userName) {
        userName = prompt("Masukkan Nama Lengkap Siswa:") || "Siswa Baru";
        localStorage.setItem("student_name", userName);
    }
    if (!userClass) {
        userClass = prompt("Masukkan Kelas (Contoh: X-RPL 1):") || "Kelas Umum";
        localStorage.setItem("student_class", userClass);
    }
    updateProfileUI();
}

function updateProfileUI() {
    document.getElementById("player-name").innerText = userName;
    document.getElementById("player-class").innerText = "Kelas: " + userClass;
}

function editProfile() {
    const newName = prompt("Edit Nama Lengkap:", userName);
    const newClass = prompt("Edit Kelas:", userClass);
    if (newName) {
        userName = newName.trim();
        localStorage.setItem("student_name", userName);
    }
    if (newClass) {
        userClass = newClass.trim();
        localStorage.setItem("student_class", userClass);
    }
    updateProfileUI();
    userRef.update({ name: userName, class: userClass });
}

initUser();

let currentScore = 0;
let questionsData = [];
let currentQuestion = null;

const userRef = db.ref('leaderboard/' + userId);

userRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        currentScore = data.score || 0;
    } else {
        userRef.set({ name: userName, class: userClass, score: 0 });
    }
    document.getElementById("my-score").innerText = currentScore;
    checkCertificateEligibility();
});

// Load Soal dari data/questions.json
fetch('data/questions.json')
    .then(response => response.json())
    .then(data => {
        questionsData = data;
        renderNextQuestion();
    })
    .catch(err => {
        document.getElementById("question-text").innerText = "Gagal memuat bank soal questions.json";
        console.error(err);
    });

function renderNextQuestion() {
    if (questionsData.length === 0) return;

    const randomIndex = Math.floor(Math.random() * questionsData.length);
    currentQuestion = questionsData[randomIndex];

    document.getElementById("module-badge").innerText = currentQuestion.module;
    document.getElementById("level-badge").innerText = "Level " + currentQuestion.level;
    document.getElementById("question-text").innerText = currentQuestion.question;

    const container = document.getElementById("options-container");
    container.innerHTML = "";

    currentQuestion.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "w-full bg-slate-800 hover:bg-sky-600 border border-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-xl text-left transition-all text-sm";
        btn.innerText = `${String.fromCharCode(65 + idx)}. ${opt}`;
        btn.onclick = () => checkAnswer(idx);
        container.appendChild(btn);
    });
}

function checkAnswer(selectedIdx) {
    const feedback = document.getElementById("feedback");
    if (selectedIdx === currentQuestion.answer) {
        feedback.className = "text-emerald-400 font-bold";
        feedback.innerText = "✨ Jawaban Benar! +10 Poin";
        currentScore += 10;
        userRef.update({ name: userName, class: userClass, score: currentScore });
    } else {
        feedback.className = "text-rose-400 font-bold";
        feedback.innerText = "❌ Jawaban Kurang Tepat!";
    }

    setTimeout(() => {
        feedback.innerText = "";
        renderNextQuestion();
    }, 1000);
}
