import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "your-actual-value",
  authDomain: "your-actual-value",
  projectId: "your-actual-value",
  storageBucket: "your-actual-value",
  messagingSenderId: "your-actual-value",
  appId: "your-actual-value"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)