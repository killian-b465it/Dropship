import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCPG9QH6om6aCvupd4vlIDJE8p8Q1M9Wb8",
    authDomain: "dropship-c3ef0.firebaseapp.com",
    projectId: "dropship-c3ef0",
    storageBucket: "dropship-c3ef0.firebasestorage.app",
    messagingSenderId: "23435019312",
    appId: "1:23435019312:web:f644602da42f9a1eb119f5",
    measurementId: "G-RV3NN2HN9S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
