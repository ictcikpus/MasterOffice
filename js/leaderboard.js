const leaderboardRef = db.ref('leaderboard').orderByChild('score').limitToLast(10);

leaderboardRef.on('value', (snapshot) => {
    const listElement = document.getElementById("leaderboard-list");
    listElement.innerHTML = "";

    let players = [];
    snapshot.forEach((childSnapshot) => {
        players.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
        });
    });

    // Urutkan dari poin tertinggi ke terendah
    players.reverse();

    if (players.length === 0) {
        listElement.innerHTML = `<p class="text-center text-slate-500 py-6 text-sm">Belum ada data skor siswa.</p>`;
        return;
    }

    players.forEach((player, index) => {
        const rank = index + 1;
        const isCurrentUser = player.id === userId;

        let rankBadge = `<span class="w-7 h-7 flex items-center justify-center font-bold text-sm text-slate-400 bg-slate-800 rounded-lg">${rank}</span>`;
        if (rank === 1) rankBadge = `<span class="w-7 h-7 flex items-center justify-center text-amber-300 bg-amber-500/20 border border-amber-500/40 rounded-lg text-sm font-bold shadow"><i class="fa-solid fa-trophy"></i></span>`;
        if (rank === 2) rankBadge = `<span class="w-7 h-7 flex items-center justify-center text-slate-200 bg-slate-300/20 border border-slate-300/40 rounded-lg text-sm font-bold"><i class="fa-solid fa-medal"></i></span>`;
        if (rank === 3) rankBadge = `<span class="w-7 h-7 flex items-center justify-center text-amber-600 bg-amber-700/20 border border-amber-700/40 rounded-lg text-sm font-bold"><i class="fa-solid fa-award"></i></span>`;

        const itemHTML = `
            <div class="flex items-center justify-between p-3 rounded-xl transition-all ${isCurrentUser ? 'bg-sky-500/20 border border-sky-500/50 shadow-md' : 'bg-slate-900/60 border border-slate-700/50 hover:bg-slate-700/40'}">
                <div class="flex items-center gap-3 overflow-hidden">
                    ${rankBadge}
                    <span class="font-medium text-sm text-slate-200 truncate ${isCurrentUser ? 'font-bold text-sky-300' : ''}">
                        ${player.name} ${isCurrentUser ? '<span class="text-xs text-sky-400 font-normal">(Kamu)</span>' : ''}
                    </span>
                </div>
                <span class="font-extrabold text-amber-400 text-sm whitespace-nowrap ml-2">
                    ${player.score} <span class="text-[10px] text-slate-400 font-normal">pt</span>
                </span>
            </div>
        `;
        listElement.innerHTML += itemHTML;
    });
}, (error) => {
    console.error("Kesalahan Leaderboard:", error);
    document.getElementById("leaderboard-list").innerHTML = `<p class="text-center text-rose-400 text-xs py-4">Gagal memuat papan peringkat. Pastikan Rules Firebase sudah di-Publish.</p>`;
});
