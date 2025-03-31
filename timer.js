import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const timerRef = doc(db, "settings", "gameTimer");
const resultsRef = collection(db, "gameResults"); // 🔥 Result Collection

const colors = ["Green", "Violet", "Red"]; // 🎨 Available Colors

// **Firebase से Timer Load करना**
async function loadTimer() {
    const docSnap = await getDoc(timerRef);
    if (docSnap.exists()) {
        return docSnap.data().timeLeft;
    } else {
        await setDoc(timerRef, { timeLeft: 30, lastUpdated: Date.now() });
        return 30;
    }
}

// **Firebase में Timer Update करना**
async function updateTimer(timeLeft) {
    await updateDoc(timerRef, { timeLeft: timeLeft, lastUpdated: Date.now() });
}

// **Firebase से Real-Time Timer Listen करना**
onSnapshot(timerRef, (docSnap) => {
    if (docSnap.exists()) {
        const timeLeft = docSnap.data().timeLeft;
        document.getElementById("timer").innerText = `⏳ Time Left: ${timeLeft} sec`;
    }
});

// **Result को Firebase में Save करना**
async function saveResult(color) {
    await addDoc(resultsRef, {
        color: color,
        timestamp: Date.now()
    });
}

// **Result Firebase से Load करें और Page पर Show करें**
onSnapshot(resultsRef, (snapshot) => {
    let resultsHTML = "";
    snapshot.docs.forEach(doc => {
        const data = doc.data();
        resultsHTML += `<p>🎨 Result: <strong>${data.color}</strong> (⏰ ${new Date(data.timestamp).toLocaleTimeString()})</p>`;
    });
    document.getElementById("results").innerHTML = resultsHTML;
});

// **Timer Start करने का Function**
async function startTimer() {
    let timeLeft = await loadTimer();
    document.getElementById("timer").innerText = `⏳ Time Left: ${timeLeft} sec`;

    const interval = setInterval(async () => {
        if (timeLeft > 0) {
            timeLeft--;
            await updateTimer(timeLeft);
        } else {
            clearInterval(interval);
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            alert(`🎉 Result: ${randomColor}`);
            await saveResult(randomColor); // **Firebase में Save करें**
            await updateTimer(30); // **Next Round के लिए Reset करें**
            startTimer(); // **Next Round Start करें**
        }
    }, 1000);
}

// **🔥 Page Load होते ही Timer Start करें**
startTimer();
