import { initializeApp, type FirebaseOptions } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const requiredEnv = (value: string | undefined, name: string): string => {
    if (!value) {
        throw new Error(`${name} is not defined`)
    }
    return value
}

const firebaseConfig: FirebaseOptions = {
    apiKey: requiredEnv(import.meta.env.VITE_FIREBASE_API_KEY, "VITE_FIREBASE_API_KEY"),
    authDomain: requiredEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, "VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: requiredEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID, "VITE_FIREBASE_PROJECT_ID"),
    storageBucket: requiredEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, "VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: requiredEnv(
        import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        "VITE_FIREBASE_MESSAGING_SENDER_ID"
    ),
    appId: requiredEnv(import.meta.env.VITE_FIREBASE_APP_ID, "VITE_FIREBASE_APP_ID"),
    measurementId: requiredEnv(
        import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
        "VITE_FIREBASE_MEASUREMENT_ID"
    ),
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)

export { app }