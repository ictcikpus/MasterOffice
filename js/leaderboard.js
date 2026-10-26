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
    db.ref('leaderboard/' + userId).set({
        name: name,
        class: className,
        score: newScore,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).catch(error => {
        console.error("Gagal menyimpan skor:", error);
    });
};

const leaderboardRef = db.ref('leaderboard').orderByChild('score').limitToLast(5); // Cukup 5 untuk home

leaderboardRef.on('value', (snapshot) => {
    const listElement = document.getElementById("leaderboard-list");
    if (!listElement) return;

    listElement.innerHTML = "";

    let players = [];
    snapshot.forEach((childSnapshot) => {
        players.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
        });
    });

    players.reverse(); // Urutkan tertinggi ke terendah

    if (players.length === 0) {
        listElement.innerHTML = `<p class="text-center text-slate-400 py-6 text-sm italic">Belum ada data nilai. Jadilah yang pertama!</p>`;
        return;
    }

    players.forEach((player, index) => {
        const rank = index + 1;
        const isCurrentUser = player.id === userId;

        // Desain khusus Light Mode (Putih & Terang)
        let rankBadge = `<span class="w-8 h-8 flex items-center justify-center font-bold text-sm text-slate-500 bg-slate-100 rounded-lg">${rank}</span>`;
        
        // Juara 1, 2, 3 pakai warna emas, silver, perunggu
        if (rank === 1) rankBadge = `<span class="w-8 h-8 flex items-center justify-center text-amber-600 bg-amber-100 rounded-lg text-sm font-bold shadow-sm"><i class="fa-solid fa-crown"></i></span>`;
        if (rank === 2) rankBadge = `<span class="w-8 h-8 flex items-center justify-center text-slate-500 bg-slate-200 rounded-lg text-sm font-bold"><i class="fa-solid fa-medal"></i></span>`;
        if (rank === 3) rankBadge = `<span class="w-8 h-8 flex items-center justify-center text-orange-600 bg-orange-100 rounded-lg text-sm font-bold"><i class="fa-solid fa-award"></i></span>`;

        const itemHTML = `
            <div class="flex items-center justify-between p-3 rounded-xl transition-all ${isCurrentUser ? 'bg-emerald-50 border border-emerald-200' : 'bg-white border border-slate-100 hover:bg-slate-50'}">
                <div class="flex items-center gap-3 overflow-hidden">
                    ${rankBadge}
                    <span class="font-semibold text-sm text-slate-700 truncate ${isCurrentUser ? 'text-emerald-700' : ''}">
                        ${player.name} ${isCurrentUser ? '<span class="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full ml-1">Kamu</span>' : ''}
                    </span>
                </div>
                <span class="font-extrabold text-emerald-600 text-sm whitespace-nowrap ml-2">
                    ${player.score} <span class="text-[10px] text-slate-400 font-normal">pt</span>
                </span>
            </div>
        `;
        listElement.innerHTML += itemHTML;
    });
}, (error) => {
    console.error("Kesalahan Leaderboard:", error);
    const el = document.getElementById("leaderboard-list");
    if(el) el.innerHTML = `<p class="text-center text-rose-500 text-xs py-4">Gagal memuat peringkat.</p>`;
});
