// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA44EFKpoewdA-pLS2zv-w_eKv8EXBz0_8",
    authDomain: "inventoryadd-7b7cf.firebaseapp.com",
    projectId: "inventoryadd-7b7cf",
    storageBucket: "inventoryadd-7b7cf.firebasestorage.app",
    messagingSenderId: "248126878690",
    appId: "1:248126878690:web:ded3f4f3da84f32f97bfbb",
    measurementId: "G-MC5HJ23446"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);