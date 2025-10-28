import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGNFPmx1ioX5bgFjCm2_XvMm86j4siqFI",
  authDomain: "veridia-9bf07.firebaseapp.com",
  projectId: "veridia-9bf07",
  storageBucket: "veridia-9bf07.firebasestorage.app",
  messagingSenderId: "38373369324",
  appId: "1:38373369324:web:1560476bc3c3c68f6d4cc9",
  measurementId: "G-Y6Y32NJPH5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
auth.useDeviceLanguage();

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const actionCodeSettings = {
  url: typeof window !== "undefined" ? `${window.location.origin}/login` : "https://example.com/login",
  handleCodeInApp: false
};

export { app };