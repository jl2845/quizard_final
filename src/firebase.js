import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getPerformance } from "firebase/performance"

const firebaseConfig = {
  apiKey: "AIzaSyD3Q-fOYuKWURU3pgzQmNRurGGjolqJt2Q",
  authDomain: "quizard-final.firebaseapp.com",
  projectId: "quizard-final",
  storageBucket: "quizard-final.appspot.com",
  messagingSenderId: "1090897794780",
  appId: "1:1090897794780:web:e08a3b7b0b225db4670619",
  measurementId: "G-1YGWTQ98D4"
}

const app = initializeApp(firebaseConfig)

const perf = getPerformance(app)

export const db = getFirestore(app)

export const auth = getAuth(app)




