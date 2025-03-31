import { db } from "./firebase-config.js";
import { collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const resultContainer = document.getElementById("resultContainer");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let lastVisible = null;

// 🏆 Fetch Latest Results (सिर्फ 1 Result सबसे ऊपर दिखेगा)
async function loadLatestResults() {
    resultContainer.innerHTML = ""; // Purane Results हटाएं
    const q = query(collection(db, "gameResults"), orderBy("timestamp", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const result = doc.data();
        resultContainer.innerHTML += `<p>🎨 Result: ${result.color} (⏰ ${new Date(result.timestamp.toDate()).toLocaleTimeString()})</p>`;
    });

    loadMoreBtn.style.display = "block"; // "More Results" बटन दिखाएं
}

// 🔻 Load More Results (पुराने 10 Results दिखाएं)
async function loadMoreResults() {
    const q = query(collection(db, "gameResults"), orderBy("timestamp", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const result = doc.data();
        resultContainer.innerHTML += `<p>🎨 Result: ${result.color} (⏰ ${new Date(result.timestamp.toDate()).toLocaleTimeString()})</p>`;
    });
}

// Load Latest Results on Page Load
loadLatestResults();
loadMoreBtn.addEventListener("click", loadMoreResults);
