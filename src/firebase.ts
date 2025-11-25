// src/firebase.ts
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyA44EFKpoewdA-pLS2zv-w_eKv8EXBz0_8",
    authDomain: "inventoryadd-7b7cf.firebaseapp.com",
    projectId: "inventoryadd-7b7cf",
    storageBucket: "inventoryadd-7b7cf.firebasestorage.app",
    messagingSenderId: "248126878690",
    appId: "1:248126878690:web:ded3f4f3da84f32f97bfbb",
    measurementId: "G-MC5HJ23446",
}

// Firebase 初期化
const app = initializeApp(firebaseConfig)

// Firestore のインスタンス
export const db = getFirestore(app)

// app を使いたい場合用（今は使ってなくてもOK）
export { app }
