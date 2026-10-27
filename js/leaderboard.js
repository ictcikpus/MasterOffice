// ==========================================
// LEADERBOARD LOGIC (Firebase Realtime Database)
// ==========================================

let userId = localStorage.getItem("office_player_id");
if (!userId) {
    userId = "player_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("office_player_id", userId);
}

window.syncScoreToDatabase = function(name, className, newScore) {
    if (newScore === 0) return; 
    const finalClass = className || "Kelas Umum";

    db.ref('leaderboard/' + userId).set({
        name: name,
        class: finalClass, 
        score: newScore,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).catch(error => {
        console.error("Gagal menyimpan skor:", error);
    });
};

const leaderboardRef = db.ref('leaderboard').orderByChild('score').limitToLast(10);

leaderboardRef.on('value', (snapshot) => {
    // Ambil kedua elemen wadah (Siswa dan Guru)
    const listElementSiswa = document.getElementById("leaderboard-list");
    const listElementGuru = document.getElementById("teacher-leaderboard-list");

    let players = [];
    snapshot.forEach((childSnapshot) => {
        players.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
        });
    });

    players.reverse(); // Urutkan tertinggi ke terendah

    // Fungsi pembantu untuk membuat HTML
    const buildHTML = (isTeacherView) => {
        if (players.length === 0) {
            return `<p class="text-center text-slate-400 py-6 text-sm italic">Belum ada data nilai. Jadilah yang pertama!</p>`;
        }
        
        let html = "";
        players.forEach((player, index) => {
            const rank = index + 1;
            const isCurrentUser = player.id === userId;
            const playerClass = player.class || "Kelas Umum"; 

            let rankBadge = `<span class="w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold text-sm text-slate-500 bg-slate-100 rounded-lg">${rank}</span>`;
            if (rank === 1) rankBadge = `<span class="w-8 h-8 flex-shrink-0 flex items-center justify-center text-amber-600 bg-amber-100 rounded-lg text-sm font-bold shadow-sm"><i class="fa-solid fa-crown"></i></span>`;
            if (rank === 2) rankBadge = `<span class="w-8 h-8 flex-shrink-0 flex items-center justify-center text-slate-500 bg-slate-200 rounded-lg text-sm font-bold"><i class="fa-solid fa-medal"></i></span>`;
            if (rank === 3) rankBadge = `<span class="w-8 h-8 flex-shrink-0 flex items-center justify-center text-orange-600 bg-orange-100 rounded-lg text-sm font-bold"><i class="fa-solid fa-award"></i></span>`;

            // Jika tampilan guru, sorot nama. Jika tampilan siswa, sorot jika itu dirinya sendiri.
            const highlightClass = (!isTeacherView && isCurrentUser) ? 'bg-emerald-50 border border-emerald-200' : 'bg-white border border-slate-100 hover:bg-slate-50';

            html += `
                <div class="flex items-center justify-between p-3 rounded-xl transition-all ${highlightClass}">
                    <div class="flex items-center gap-3 overflow-hidden">
                        ${rankBadge}
                        <div class="flex flex-col overflow-hidden">
                            <span class="font-bold text-sm text-slate-700 truncate ${(!isTeacherView && isCurrentUser) ? 'text-emerald-700' : ''}">
                                ${player.name} ${(!isTeacherView && isCurrentUser) ? '<span class="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full ml-1 align-middle">Kamu</span>' : ''}
                            </span>
                            <span class="text-[11px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wide">
                                <i class="fa-solid fa-school text-[9px] mr-1"></i>${playerClass}
                            </span>
                        </div>
                    </div>
                    <span class="font-extrabold text-emerald-600 text-sm whitespace-nowrap ml-2">
                        ${player.score} <span class="text-[10px] text-slate-400 font-normal">pt</span>
                    </span>
                </div>
            `;
        });
        return html;
    };

    // Render ke tampilan Siswa jika ada
    if (listElementSiswa) {
        listElementSiswa.innerHTML = buildHTML(false);
    }
    
    // Render ke tampilan Guru jika ada
    if (listElementGuru) {
        listElementGuru.innerHTML = buildHTML(true);
    }

}, (error) => {
    console.error("Kesalahan Leaderboard:", error);
});
