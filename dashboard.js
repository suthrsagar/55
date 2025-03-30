import { db, auth } from "./firebase-config.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// 🏦 वॉलेट बैलेंस को Firestore से लोड करें
async function getWalletBalance(userId) {
    const userRef = doc(db, "wallets", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data().balance; // 🔥 वॉलेट बैलेंस को रिटर्न करें
    } else {
        // अगर डेटा नहीं है तो 100₹ का डिफ़ॉल्ट बैलेंस सेट करें
        await setDoc(userRef, { balance: 100 });
        return 100;
    }
}

// 💰 वॉलेट बैलेंस अपडेट करने का फंक्शन
async function updateWalletBalance(userId, amount) {
    const userRef = doc(db, "wallets", userId);
    await updateDoc(userRef, { balance: amount });
}

// 🎯 जब यूजर लॉगिन करे, वॉलेट बैलेंस दिखाएं
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const balance = await getWalletBalance(user.uid);
        document.getElementById("walletBalance").innerText = `₹${balance}`;
    }
});

export { getWalletBalance, updateWalletBalance };
