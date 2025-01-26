// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBhB8lir8lahLONcWPW9fnyd611DlDay7w",
  authDomain: "readme-bc6b0.firebaseapp.com",
  projectId: "readme-bc6b0",
  storageBucket: "readme-bc6b0.firebasestorage.app",
  messagingSenderId: "326539962477",
  appId: "1:326539962477:web:8790212c3a9a80affd7764",
  measurementId: "G-99F0CLKCRH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
