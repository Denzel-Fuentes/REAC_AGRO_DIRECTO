// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5AmbDAAGd_pNRtM0xZPG2jxtoHKC9mJs",
  authDomain: "agroindustria-2de6e.firebaseapp.com",
  projectId: "agroindustria-2de6e",
  storageBucket: "agroindustria-2de6e.firebasestorage.app",
  messagingSenderId: "866810946834",
  appId: "1:866810946834:web:f905ae926158259d6bbfcb",
  measurementId: "G-X34XXBEWS2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);