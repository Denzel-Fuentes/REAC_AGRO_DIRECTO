import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5AmbDAAGd_pNRtM0xZPG2jxtoHKC9mJs",
  authDomain: "agroindustria-2de6e.firebaseapp.com",
  projectId: "agroindustria-2de6e",
  storageBucket: "agroindustria-2de6e.firebasestorage.app",
  messagingSenderId: "866810946834",
  appId: "1:866810946834:web:f905ae926158259d6bbfcb",
  measurementId: "G-X34XXBEWS2",
};

const app = initializeApp(firebaseConfig);

isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});

export const db = getFirestore(app);
export const auth = getAuth(app);
