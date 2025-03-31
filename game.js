import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const resultContainer = document.getElementById("resultContainer");
const timerDisplay = document.getElementById("timer");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let timer = 30;
let interval;
let results = [];
let showLimit = 10;

// ⏳ Timer Function
async function startTimer() {
    timerDisplay.innerText = "Loading...";
    const timerDocRef = doc(db, "settings", "timer");
    const docSnap = await getDoc(timerDocRef);

    if (docSnap.exists()) {
        timer = docSnap.data().timeLeft;
    } else {
        timer = 30;
    }

    timerDisplay.innerText = `Time Left: ${timer}s`;
    interval = setInterval(async () => {
        if (timer === 0) {
            await announceResult();
            timer = 30;
        } else {
            timer--;
            timerDisplay.innerText = `Time Left: ${timer}s`;
            await setDoc(timerDocRef, { timeLeft: timer });
        }
    }, 1000);
}

// 🎯 Result Generate Function
async function announceResult() {
    const colors = ["Green", "Red", "Violet"];
    const winningColor = colors[Math.floor(Math.random() * colors.length)];

    const resultData = {
        color: winningColor,
        timestamp: Date.now()
    };

    await addDoc(collection(db, "gameResults"), resultData);
    displayResults();
}

// 📜 Show Results
async function displayResults() {
    const querySnapshot = await getDocs(collection(db, "gameResults"));
    results = querySnapshot.docs.map(doc => doc.data());
    updateResults();
}

// 🔄 Update Results UI
function updateResults() {
    resultContainer.innerHTML = "";
    results.slice(0, showLimit).forEach(result => {
        const resultElement = document.createElement("p");
        resultElement.innerText = `🎨 Result: ${result.color} (⏰ ${new Date(result.timestamp).toLocaleTimeString()})`;
        resultContainer.appendChild(resultElement);
    });
    loadMoreBtn.style.display = results.length > showLimit ? "block" : "none";
}

// 🔽 Load More Results
function loadMoreResults() {
    showLimit += 10;
    updateResults();
}

// 🚀 Initialize Game
startTimer();
displayResults();
