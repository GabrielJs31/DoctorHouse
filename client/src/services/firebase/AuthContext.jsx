import { createContext, useContext, useState, useEffect } from "react";
import {
  getIdToken,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";
import {
  auth,
  googleProvider,
  githubProvider,
  facebookProvider,
  actionCodeSettings
} from "./firebaseConfig";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const getToken = () => {
    if (!auth.currentUser) return Promise.resolve(null);
    return getIdToken(auth.currentUser, false);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Social logins
  const loginWithGoogle  = () => signInWithPopup(auth, googleProvider);
  const loginWithGithub  = () => signInWithPopup(auth, githubProvider);
  const loginWithFacebook= () => signInWithPopup(auth, facebookProvider);

  // Email/Password
  const loginWithEmail    = (email, pass) =>
    signInWithEmailAndPassword(auth, email, pass);
  const registerWithEmail = (email, pass) =>
    createUserWithEmailAndPassword(auth, email, pass)
      .then(uc => sendEmailVerification(uc.user, actionCodeSettings));
  const resetPassword     = (email) =>
    sendPasswordResetEmail(auth, email, actionCodeSettings);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginWithGoogle,
      loginWithGithub,
      loginWithFacebook,
      loginWithEmail,
      registerWithEmail,
      resetPassword,
      logout,
      getToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}
