import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGYtrBrKgKtQAPpVKbMCm5RkyHgtV8Ma4",
  authDomain: "doctorhouse-19de3.firebaseapp.com",
  projectId: "doctorhouse-19de3",
  storageBucket: "doctorhouse-19de3.firebasestorage.app",
  messagingSenderId: "496789363194",
  appId: "1:496789363194:web:67e9a6b16998466aac2c43",
  measurementId: "G-CZ9EDKVCSV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const actionCodeSettings = {
  url: window.location.origin + "/login",
  handleCodeInApp: false,
}