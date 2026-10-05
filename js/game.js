let userId = localStorage.getItem("student_id");
let userName = localStorage.getItem("student_name");

function initUser() {
    if (!userId) {
        userId = "user_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("student_id", userId);
    }
    if (!userName) {
        userName = prompt("Masukkan Nama Lengkap Anda:") || "Siswa " + Math.floor(1000 + Math.random() * 9000);
        localStorage.setItem("student_name", userName);
    }
    document.getElementById("player-name").innerText = userName;
}

function changeStudentName() {
    const newName = prompt("Masukkan nama baru Anda:", userName);
    if (newName && newName.trim() !== "") {
        userName = newName.trim();
        localStorage.setItem("student_name", userName);
        document.getElementById("player-name").innerText = userName;
        userRef.update({ name: userName });
    }
}

initUser();

let currentScore = 0;
let streakCount = 0;
const userRef = db.ref('leaderboard/' + userId);

userRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        currentScore = data.score || 0;
    } else {
        userRef.set({ name: userName, score: 0 });
    }
    document.getElementById("my-score").innerText = currentScore;
});

function updateScoreInFirebase(addedPoints) {
    currentScore += addedPoints;
    userRef.update({
        name: userName,
        score: currentScore,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
    });
}

// Logika Acak Kuis Office
let currentQuestionObj = null;

function getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * questionBank.length);
    return questionBank[randomIndex];
}

function renderQuestion() {
    currentQuestionObj = getRandomQuestion();

    // Badge Kategori
    const categoryBadge = document.getElementById("category-badge");
    categoryBadge.innerText = currentQuestionObj.category;

    if (currentQuestionObj.category === "MS Word") {
        categoryBadge.className = "text-xs px-3 py-1 rounded-full font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30";
    } else if (currentQuestionObj.category === "MS Excel") {
        categoryBadge.className = "text-xs px-3 py-1 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    } else {
        categoryBadge.className = "text-xs px-3 py-1 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30";
    }

    document.getElementById("question-text").innerText = currentQuestionObj.question;

    // Salin dan acak urutan pilihan jawaban
    let optionsWithIndex = currentQuestionObj.options.map((opt, idx) => ({
        text: opt,
        originalIndex: idx
    }));

    optionsWithIndex.sort(() => Math.random() - 0.5);

    const container = document.getElementById("options-container");
    container.innerHTML = "";

    const labels = ["A", "B", "C", "D"];

    optionsWithIndex.forEach((item, idx) => {
        const btn = document.createElement("button");
        btn.className = "w-full bg-slate-800 hover:bg-sky-600 active:scale-[0.99] border border-slate-700 text-slate-200 font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md text-sm";
        btn.innerHTML = `<span class="bg-slate-700 px-2 py-1 rounded-lg text-xs font-bold text-sky-400">${labels[idx]}</span> <span>${item.text}</span>`;
        btn.onclick = () => checkAnswer(item.originalIndex);
        container.appendChild(btn);
    });
}

function checkAnswer(selectedIndex) {
    const feedbackEl = document.getElementById("feedback");
    const streakBadge = document.getElementById("streak-badge");
    const streakCountEl = document.getElementById("streak-count");

    if (selectedIndex === currentQuestionObj.answer) {
        streakCount++;
        let pointsGained = 10;
        if (streakCount >= 3) pointsGained += 5; // Bonus streak

        feedbackEl.className = "min-h-[24px] text-sm font-semibold text-emerald-400 animate-bounce";
        feedbackEl.innerText = `✨ Jawaban Benar! +${pointsGained} Poin`;

        updateScoreInFirebase(pointsGained);
    } else {
        streakCount = 0;
        const correctAnswerText = currentQuestionObj.options[currentQuestionObj.answer];
        feedbackEl.className = "min-h-[24px] text-sm font-semibold text-rose-400";
        feedbackEl.innerText = `❌ Jawaban Salah! Jawaban Benar: ${correctAnswerText}`;
    }

    if (streakCount > 1) {
        streakBadge.classList.remove("hidden");
        streakCountEl.innerText = streakCount;
    } else {
        streakBadge.classList.add("hidden");
    }

    setTimeout(() => {
        feedbackEl.innerText = "";
        renderQuestion();
    }, 1200);
}

// Jalankan soal pertama saat dimuat
renderQuestion();
