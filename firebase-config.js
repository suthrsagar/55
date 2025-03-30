import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js"; // 🔥 Firestore SDK

const firebaseConfig = {
  apiKey: "AIzaSyC-8ve3ncXbjfB4msv_6lI3LLuCsTlNrIo",
  authDomain: "sagar-65b58.firebaseapp.com",
  projectId: "sagar-65b58",
  storageBucket: "sagar-65b58.appspot.com",
  messagingSenderId: "123248971317",
  appId: "1:123248971317:web:8a33e55d4c2b436da76b7c",
  measurementId: "G-W619EV6LN9"
};

// Firebase Initialize करें
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Firestore को इनेबल करें

export { auth, db }; // अब इसे बाकी फाइल्स में इम्पोर्ट कर सकते हैं
