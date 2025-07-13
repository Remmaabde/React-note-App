// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBx7KM4kSeksRMnalqOH2bQFDSL1CcJDr4",
  authDomain: "react-notes-4eaa4.firebaseapp.com",
  projectId: "react-notes-4eaa4",
  storageBucket: "react-notes-4eaa4.firebasestorage.app",
  messagingSenderId: "103566792745",
  appId: "1:103566792745:web:46bdd2465b0e662a0de438"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");
