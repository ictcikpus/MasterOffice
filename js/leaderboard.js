// ==========================================
// LEADERBOARD LOGIC (Firebase Realtime Database)
// ==========================================

// Buat atau ambil User ID unik untuk pemain dari localStorage
let userId = localStorage.getItem("office_player_id");
if (!userId) {
    userId = "player_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("office_player_id", userId);
}

// Fungsi untuk menyinkronkan skor dan KELAS ke database
window.syncScoreToDatabase = function(name, className, newScore) {
    if (newScore === 0) return; 

    // Pastikan className tidak kosong
    const finalClass = className || "Kelas Umum";

    db.ref('leaderboard/' + userId).set({
        name: name,
        class: finalClass, // <-- Menyimpan kelas ke database
        score: newScore,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).catch(error => {
        console.error("Gagal menyimpan skor:", error);
    });
};

// Mengambil 10 besar peringkat
const leaderboardRef = db.ref('leaderboard').orderByChild('score').limitToLast(10);

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

    // Urutkan dari poin tertinggi ke terendah
    players.reverse();

    if (players.length === 0) {
        listElement.innerHTML = `<p class="text-center text-slate-400 py-6 text-sm italic">Belum ada data nilai. Jadilah yang pertama!</p>`;
        return;
    }

    players.forEach((player, index) => {
        const rank = index + 1;
        const isCurrentUser = player.id === userId;
        const playerClass = player.class || "Kelas Umum"; // Fallback jika kelas tidak ada

        // Desain Badge Peringkat (Emas, Perak, Perunggu)
        let rankBadge = `<span class="w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold text-sm text-slate-500 bg-slate-100 rounded-lg">${rank}</span>`;
        if (rank === 1) rankBadge = `<span class="w-8 h-8 flex-shrink-0 flex items-center justify-center text-amber-600 bg-amber-100 rounded-lg text-sm font-bold shadow-sm"><i class="fa-solid fa-crown"></i></span>`;
        if (rank === 2) rankBadge = `<span class="w-8 h-8 flex-shrink-0 flex items-center justify-center text-slate-500 bg-slate-200 rounded-lg text-sm font-bold"><i class="fa-solid fa-medal"></i></span>`;
        if (rank === 3) rankBadge = `<span class="w-8 h-8 flex-shrink-0 flex items-center justify-center text-orange-600 bg-orange-100 rounded-lg text-sm font-bold"><i class="fa-solid fa-award"></i></span>`;

        // Tampilan Baris Leaderboard dengan Nama dan Kelas
        const itemHTML = `
            <div class="flex items-center justify-between p-3 rounded-xl transition-all ${isCurrentUser ? 'bg-emerald-50 border border-emerald-200' : 'bg-white border border-slate-100 hover:bg-slate-50'}">
                
                <!-- Bagian Kiri: Badge & Identitas -->
                <div class="flex items-center gap-3 overflow-hidden">
                    ${rankBadge}
                    <div class="flex flex-col overflow-hidden">
                        <span class="font-bold text-sm text-slate-700 truncate ${isCurrentUser ? 'text-emerald-700' : ''}">
                            ${player.name} ${isCurrentUser ? '<span class="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full ml-1 align-middle">Kamu</span>' : ''}
                        </span>
                        <span class="text-[11px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wide">
                            <i class="fa-solid fa-school text-[9px] mr-1"></i>${playerClass}
                        </span>
                    </div>
                </div>
                
                <!-- Bagian Kanan: Skor -->
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
