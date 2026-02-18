// ===== FIRESTORE DATABASE HELPERS =====
import { auth, db } from './firebase-config.js';
import {
    doc, getDoc, setDoc, updateDoc, deleteDoc,
    collection, getDocs, addDoc, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ── User Profile ──────────────────────────────────────────────

export async function createUserProfile(uid, data) {
    await setDoc(doc(db, 'users', uid), {
        displayName: data.displayName || 'Dropshipper',
        email: data.email || '',
        createdAt: serverTimestamp(),
        plan: 'free'
    }, { merge: true });
}

export async function getUserProfile(uid) {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid, data) {
    await updateDoc(doc(db, 'users', uid), data);
}

// ── Saved Products ────────────────────────────────────────────

export async function getSavedProducts(uid) {
    const snap = await getDocs(collection(db, 'users', uid, 'savedProducts'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveProduct(uid, product) {
    await setDoc(doc(db, 'users', uid, 'savedProducts', String(product.id)), {
        ...product,
        savedAt: serverTimestamp()
    });
}

export async function removeSavedProduct(uid, productId) {
    await deleteDoc(doc(db, 'users', uid, 'savedProducts', String(productId)));
}

export async function isProductSaved(uid, productId) {
    const snap = await getDoc(doc(db, 'users', uid, 'savedProducts', String(productId)));
    return snap.exists();
}

// ── Orders ────────────────────────────────────────────────────

export async function getOrders(uid) {
    const q = query(collection(db, 'users', uid, 'orders'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
}

export async function addOrder(uid, order) {
    const ref = await addDoc(collection(db, 'users', uid, 'orders'), {
        ...order,
        createdAt: serverTimestamp()
    });
    return ref.id;
}

export async function updateOrder(uid, firestoreId, data) {
    await updateDoc(doc(db, 'users', uid, 'orders', firestoreId), data);
}

// ── Connected Suppliers ───────────────────────────────────────

export async function getConnectedSuppliers(uid) {
    const snap = await getDoc(doc(db, 'users', uid, 'settings', 'suppliers'));
    return snap.exists() ? (snap.data().connected || []) : [];
}

export async function setConnectedSuppliers(uid, connectedArray) {
    await setDoc(doc(db, 'users', uid, 'settings', 'suppliers'), {
        connected: connectedArray,
        updatedAt: serverTimestamp()
    });
}

// ── Collected Ads ─────────────────────────────────────────────

export async function getAds(uid) {
    const snap = await getDocs(collection(db, 'users', uid, 'collectedAds'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveAd(uid, ad) {
    await setDoc(doc(db, 'users', uid, 'collectedAds', String(ad.id)), {
        ...ad,
        collectedAt: serverTimestamp()
    });
}
