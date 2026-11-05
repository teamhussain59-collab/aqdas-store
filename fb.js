import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, getDocs, collection, deleteDoc, updateDoc, increment } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
export const app = initializeApp({"apiKey": "AIzaSyB9rz1enRbOYx_wgFhOc36mp9E6Cf3WJuE", "authDomain": "aqdas-hacker.firebaseapp.com", "projectId": "aqdas-hacker", "storageBucket": "aqdas-hacker.firebasestorage.app", "messagingSenderId": "1001962511749", "appId": "1:1001962511749:web:f4850d77a530a9576bb8ec"});
export const db = getFirestore(app); export const auth = getAuth(app);
export async function loadSite(){ const s = await getDoc(doc(db,'store','site')); return s.exists()? JSON.parse(s.data().json||'{}') : {}; }
export async function saveSite(d){ await setDoc(doc(db,'store','site'), { json: JSON.stringify(d) }); }
export { signInWithEmailAndPassword, onAuthStateChanged, signOut, doc, setDoc, getDocs, collection, deleteDoc, updateDoc, increment };
