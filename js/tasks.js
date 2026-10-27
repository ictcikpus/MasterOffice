// ==========================================
// TASKS SYSTEM (Anti-Crash & Clear UI States)
// ==========================================

const GAS_URL = "https://script.google.com/macros/s/AKfycbxu2pRUrXHIex2xABFFANCxvrhWHialnwst3e3VPHZBl9arG8WAWRmcj_U_eFAGWOEZCA/exec";

// ⚠️ GANTI DENGAN ID FOLDER GOOGLE DRIVE ANDA ⚠️
// Cara mendapatkan: Buka folder di Drive, lihat URL-nya:
// https://drive.google.com/drive/folders/1ABC...XYZ
// ID Folder adalah bagian setelah /folders/ (contoh: 1ABC...XYZ)
const FOLDER_ID = "1_K4XXQc4umLJPpKmnpwEUcIGX9ed7m6e";

let allTasks = [];
let allSubmissionsData = {}; 
let allAttendanceToday = {}; 

const todayStr = new Date().toISOString().split('T')[0];

document.addEventListener("DOMContentLoaded", () => {
    const isTeacher = sessionStorage.getItem('is_teacher') === 'true';

    db.ref('tasks').on('value', snap => {
        allTasks = [];
        snap.forEach(child => allTasks.push({ id: child.key, ...child.val() }));
        allTasks.reverse();
        
        if (isTeacher) {
            const statTugas = document.getElementById('stat-tugas');
            if(statTugas) statTugas.innerText = allTasks.length;
            if (!document.getElementById('view-guru-tugas').classList.contains('hidden')) {
                renderRekapTugasGuru();
            }
        } else {
            renderSiswaTugas();
        }
    });

    db.ref('submissions').on('value', snap => {
        allSubmissionsData = snap.val() || {};
        if (isTeacher && !document.getElementById('view-guru-tugas').classList.contains('hidden')) {
            renderRekapTugasGuru();
        } else if (!isTeacher) {
            renderSiswaTugas(); 
        }
    });

    if (isTeacher) {
        db.ref(`attendance/${todayStr}`).on('value', snap => {
            allAttendanceToday = snap.val() || {};
            let count = 0;
            for (const cls in allAttendanceToday) {
                count += Object.keys(allAttendanceToday[cls]).length;
            }
            const statHadir = document.getElementById('stat-hadir');
            if(statHadir) statHadir.innerText = count;
            if (!document.getElementById('view-guru-tugas').classList.contains('hidden')) {
                renderRekapTugasGuru();
            }
        });
    }
});

// ... (fungsi generateDefaultTasks, renderRekapTugasGuru, renderSiswaTugas, openKumpulTugasModal, closeKumpulTugasModal, prosesKumpulTugas, saveSubmissionToFirebase tetap sama seperti sebelumnya) ...

// ==========================================
// FUNGSI UPLOAD FILE (DIPERBAIKI DENGAN folderId)
// ==========================================
function uploadFileToDrive(file) {
    const btn = document.getElementById('btn-submit-tugas');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Mengunggah...';

    const reader = new FileReader();
    reader.onload = async function(e) {
        const base64Data = e.target.result.split(',')[1]; 
        const mimeType = file.type;
        const studentName = localStorage.getItem("student_name");
        const filename = `${studentName}_${Date.now()}_${file.name}`;

        // Validasi folderId sebelum mengirim
        if (FOLDER_ID === "GANTI_DENGAN_ID_FOLDER_DRIVE_ANDA") {
            alert("⚠️ ID Folder Google Drive belum diatur di tasks.js. Hubungi Guru.");
            btn.disabled = false;
            btn.innerHTML = originalText;
            return;
        }

        try {
            const response = await fetch(GAS_URL, {
                method: 'POST',
                // Kirim sebagai text/plain untuk menghindari preflight request yang rumit
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ 
                    file: base64Data, 
                    filename: filename, 
                    mimeType: mimeType,
                    folderId: FOLDER_ID // 🔑 KUNCI PERBAIKAN
                })
            });
            const result = await response.json();
            if (result.status === 'success' && result.url) {
                saveSubmissionToFirebase(result.url);
            } else {
                throw new Error(result.message || "Gagal mengunggah.");
            }
        } catch (error) {
            alert(`❌ Gagal mengunggah file.\n\nPesan Error: ${error.message}`);
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    };
    reader.readAsDataURL(file);
}
