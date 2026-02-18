// ===== FIREBASE AUTH LOGIC =====
import { auth, googleProvider } from './firebase-config.js';
import { createUserProfile } from './db.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    onAuthStateChanged as _onAuthStateChanged,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ── Sign Up ───────────────────────────────────────────────────

export async function signUpWithEmail(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await createUserProfile(cred.user.uid, { displayName, email });
    return cred.user;
}

// ── Login ─────────────────────────────────────────────────────

export async function loginWithEmail(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
}

// ── Google Sign-In ────────────────────────────────────────────

export async function loginWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);
    // Create profile if first time
    await createUserProfile(cred.user.uid, {
        displayName: cred.user.displayName,
        email: cred.user.email
    });
    return cred.user;
}

// ── Logout ────────────────────────────────────────────────────

export async function logout() {
    await signOut(auth);
    window.location.href = '/login.html';
}

// ── Password Reset ────────────────────────────────────────────

export async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
}

// ── Auth State ────────────────────────────────────────────────

export function onAuthStateChanged(callback) {
    return _onAuthStateChanged(auth, callback);
}

// ── Require Auth Guard ────────────────────────────────────────
// Call this at the top of every protected page.
// Redirects to login if not signed in, resolves with user if signed in.

export function requireAuth() {
    return new Promise((resolve) => {
        const unsub = _onAuthStateChanged(auth, (user) => {
            unsub();
            if (!user) {
                window.location.href = '/login.html';
            } else {
                resolve(user);
            }
        });
    });
}

// ── Get Current User ──────────────────────────────────────────

export function getCurrentUser() {
    return auth.currentUser;
}
