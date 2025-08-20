// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add your Firebase project configuration details
const firebaseConfig = {
  apiKey: "AIzaSyCwEZaMrARY9aHpceRtP4dm0RNFsfZ5imQ",
  authDomain: "cosmotherapy2008.firebaseapp.com",
  projectId: "cosmotherapy2008",
  storageBucket: "cosmotherapy2008.firebasestorage.app",
  messagingSenderId: "140938356984",
  appId: "1:140938356984:web:0cff1fe5eb5ea4ed2af30d"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };