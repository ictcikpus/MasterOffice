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

let currentAnswer = 0;

function generateQuestion() {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let num1, num2;

    if (op === '+') {
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        currentAnswer = num1 + num2;
    } else if (op === '-') {
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * num1);
        currentAnswer = num1 - num2;
    } else {
        num1 = Math.floor(Math.random() * 12) + 2;
        num2 = Math.floor(Math.random() * 10) + 2;
        currentAnswer = num1 * num2;
    }

    document.getElementById("question-text").innerText = `${num1} ${op} ${num2} = ?`;

    let choices = [currentAnswer];
    while (choices.length < 4) {
        let wrong = currentAnswer + (Math.floor(Math.random() * 10) + 1) * (Math.random() < 0.5 ? 1 : -1);
        if (wrong >= 0 && !choices.includes(wrong)) choices.push(wrong);
    }
    choices.sort(() => Math.random() - 0.5);

    const container = document.getElementById("options-container");
    container.innerHTML = "";
    choices.forEach(val => {
        const btn = document.createElement("button");
        btn.className = "w-full bg-slate-800 hover:bg-sky-600 active:scale-95 border border-slate-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md text-lg";
        btn.innerText = val;
        btn.onclick = () => checkAnswer(val);
        container.appendChild(btn);
    });
}

function checkAnswer(selected) {
    const feedbackEl = document.getElementById("feedback");
    const streakBadge = document.getElementById("streak-badge");
    const streakCountEl = document.getElementById("streak-count");

    if (selected === currentAnswer) {
        streakCount++;
        let pointsGained = 10;
        if (streakCount >= 3) pointsGained += 5;

        feedbackEl.className = "min-h-[24px] text-sm font-semibold text-emerald-400 animate-bounce";
        feedbackEl.innerText = `✨ Benar! +${pointsGained} Poin`;

        updateScoreInFirebase(pointsGained);
    } else {
        streakCount = 0;
        feedbackEl.className = "min-h-[24px] text-sm font-semibold text-rose-400";
        feedbackEl.innerText = `❌ Kurang tepat! Jawaban benar: ${currentAnswer}`;
    }

    if (streakCount > 1) {
        streakBadge.classList.remove("hidden");
        streakCountEl.innerText = streakCount;
    } else {
        streakBadge.classList.add("hidden");
    }

    setTimeout(() => {
        feedbackEl.innerText = "";
        generateQuestion();
    }, 1000);
}

generateQuestion();
