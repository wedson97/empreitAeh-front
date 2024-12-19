import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyBMEnT-skejwukGPcu4vdGiO0g35yINuXo",
    authDomain: "empreitaeh.firebaseapp.com",
    projectId: "empreitaeh",
    storageBucket: "empreitaeh.firebasestorage.app",
    messagingSenderId: "1068232074858",
    appId: "1:1068232074858:web:59561b685f014a9d8fcc13",
    measurementId: "G-QD3TMD6DY4"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export { auth };