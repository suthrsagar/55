import { db } from "./firebase-config.js";
import { doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const walletBalanceElement = document.getElementById("walletBalance");
const userWalletRef = doc(db, "users", "user1");

// ✅ Wallet Load Function
async function loadWallet() {
    const walletSnap = await getDoc(userWalletRef);
    if (walletSnap.exists()) {
        walletBalanceElement.innerText = walletSnap.data().balance;
    } else {
        await setDoc(userWalletRef, { balance: 1000 }); // Default ₹1000
        walletBalanceElement.innerText = 1000;
    }
}

// 🎲 Bet Place Function
async function placeBet(color) {
    const amount = 100; // Fixed Bet ₹100
    const walletSnap = await getDoc(userWalletRef);

    if (walletSnap.exists()) {
        let currentBalance = walletSnap.data().balance;

        if (currentBalance >= amount) {
            let newBalance = currentBalance - amount;
            await updateDoc(userWalletRef, { balance: newBalance });
            walletBalanceElement.innerText = newBalance;
            alert(`✅ Bet placed on ${color} for ₹${amount}. New Balance: ₹${newBalance}`);
        } else {
            alert("❌ Insufficient balance! Please add money.");
        }
    }
}

// ➕ Add ₹500 to Wallet
async function addMoney() {
    const walletSnap = await getDoc(userWalletRef);
    if (walletSnap.exists()) {
        let newBalance = walletSnap.data().balance + 500;
        await updateDoc(userWalletRef, { balance: newBalance });
        walletBalanceElement.innerText = newBalance;
        alert("✅ ₹500 Added to Wallet!");
    }
}

// ➖ Withdraw ₹500 from Wallet
async function withdrawMoney() {
    const walletSnap = await getDoc(userWalletRef);
    if (walletSnap.exists()) {
        let currentBalance = walletSnap.data().balance;
        if (currentBalance >= 500) {
            let newBalance = currentBalance - 500;
            await updateDoc(userWalletRef, { balance: newBalance });
            walletBalanceElement.innerText = newBalance;
            alert("✅ ₹500 Withdrawn from Wallet!");
        } else {
            alert("❌ Insufficient Balance!");
        }
    }
}

// 🚀 Load Wallet on Page Load
loadWallet();
