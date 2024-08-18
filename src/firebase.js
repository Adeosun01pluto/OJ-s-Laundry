const firebaApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: firebaApiKey,
  authDomain: "oj-laundry.firebaseapp.com",
  projectId: "oj-laundry",
  storageBucket: "oj-laundry.appspot.com",
  messagingSenderId: "863473199065",
  appId: "1:863473199065:web:f756ad2b4ce37242b9dbc8",
  measurementId: "G-4NTS9TYRJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

export { auth, db, googleProvider, facebookProvider, twitterProvider };
