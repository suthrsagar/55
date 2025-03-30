// Firebase SDK इंपोर्ट करें
import { db, auth } from "./firebase-config.js";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// 💰 वॉलेट बैलेंस लोड करने का फंक्शन
async function getWalletBalance(userId) {
    const userRef = doc(db, "wallets", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data().balance;
    } else {
        await setDoc(userRef, { balance: 100 });
        return 100;
    }
}

// 💵 बैलेंस अपडेट करने का फंक्शन
async function updateWalletBalance(userId, amount) {
    const userRef = doc(db, "wallets", userId);
    await updateDoc(userRef, { balance: amount });
}

// 🎲 बेट लगाने का फंक्शन (डेटा Firestore में सेव होगा)
async function placeBet(amount, betType) {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in first!");
        return;
    }

    const balance = await getWalletBalance(user.uid);
    if (balance < amount) {
        alert("Insufficient balance!");
        return;
    }

    // 🔥 बैलेंस अपडेट करें
    await updateWalletBalance(user.uid, balance - amount);

    // 🔥 Firestore में बेटिंग डाटा स्टोर करें
    await addDoc(collection(db, "bets"), {
        userId: user.uid,
        amount: amount,
        betType: betType,
        timestamp: new Date()
    });

    document.getElementById("walletBalance").innerText = `₹${balance - amount}`;
    alert("Bet placed successfully!");
}

// 🏆 पिछले सभी बेट्स को लोड करने का फंक्शन
async function loadUserBets(userId) {
    const betsRef = collection(db, "bets");
    const betsSnap = await getDocs(betsRef);
    
    let betsHTML = "";
    betsSnap.forEach(doc => {
        if (doc.data().userId === userId) {
            betsHTML += `<p>Amount: ₹${doc.data().amount} | Type: ${doc.data().betType}</p>`;
        }
    });

    document.getElementById("betHistory").innerHTML = betsHTML;
}

export { getWalletBalance, updateWalletBalance, placeBet, loadUserBets };
