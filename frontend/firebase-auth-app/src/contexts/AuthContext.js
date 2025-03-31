import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  signInWithGoogle, 
  signInWithPhone, 
  emailSignIn, 
  emailSignUp, 
  logout 
} from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Create auth context
const AuthContext = createContext();

// Hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign in with Google
  const handleGoogleSignIn = async () => {
    setError('');
    try {
      return await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
      throw err;
    }
  };

  // Sign in with email and password
  const handleEmailSignIn = async (email, password) => {
    setError('');
    try {
      return await emailSignIn(email, password);
    } catch (err) {
      setError(err.message || 'Failed to sign in with email and password');
      throw err;
    }
  };

  // Sign up with email and password
  const handleEmailSignUp = async (email, password, firstName, lastName) => {
    setError('');
    try {
      return await emailSignUp(email, password, firstName, lastName);
    } catch (err) {
      setError(err.message || 'Failed to create account');
      throw err;
    }
  };

  // Sign in with phone
  const handlePhoneSignIn = async (phoneNumber) => {
    setError('');
    try {
      return await signInWithPhone(phoneNumber);
    } catch (err) {
      setError(err.message || 'Failed to sign in with phone');
      throw err;
    }
  };

  // Sign out
  const handleLogout = async () => {
    setError('');
    try {
      await logout();
    } catch (err) {
      setError(err.message || 'Failed to log out');
      throw err;
    }
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    signInWithGoogle: handleGoogleSignIn,
    signInWithEmail: handleEmailSignIn,
    signUpWithEmail: handleEmailSignUp,
    signInWithPhone: handlePhoneSignIn,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};