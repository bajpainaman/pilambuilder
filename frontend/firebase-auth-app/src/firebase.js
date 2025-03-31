import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  setPersistence, 
  browserLocalPersistence
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCRZ2_v8J2zq8k7Ihc2A4I3Wj-CMsyF4_g",
  authDomain: "pilambdaphi-1.firebaseapp.com",
  databaseURL: "https://pilambdaphi-1-default-rtdb.firebaseio.com",
  projectId: "pilambdaphi-1",
  storageBucket: "pilambdaphi-1.firebasestorage.app",
  messagingSenderId: "427337737275",
  appId: "1:427337737275:web:8d699c98a2297df9b4681e",
  measurementId: "G-Y4VN3YN7TN"
};

// Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence to LOCAL for better mobile experience
// This keeps the user signed in even if they close the browser
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

const firestore = getFirestore(app);
const realtimeDB = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

// RecaptchaVerifier singleton
let recaptchaVerifier;

/**
 * Initialize reCAPTCHA verifier
 */
const initializeRecaptcha = () => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => console.log("reCAPTCHA verified"),
      "expired-callback": () => console.log("reCAPTCHA expired"),
    });
  }
  return recaptchaVerifier;
};

/**
 * Sign in with Google and store user data
 * @returns {Promise<Object>} User data
 */
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await storeUserData(user);
    return user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

/**
 * Sign in with email and password
 * @param {string} email User email
 * @param {string} password User password
 * @returns {Promise<Object>} User data
 */
const emailSignIn = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Email Sign-In Error:", error);
    throw error;
  }
};

/**
 * Create new user with email and password
 * @param {string} email User email
 * @param {string} password User password
 * @param {string} firstName First name
 * @param {string} lastName Last name
 * @returns {Promise<Object>} User data
 */
const emailSignUp = async (email, password, firstName = "", lastName = "") => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Store additional user data
    await storeUserData(user, { firstName, lastName });
    return user;
  } catch (error) {
    console.error("Email Sign-Up Error:", error);
    throw error;
  }
};

/**
 * Sign in with phone number
 * @param {string} phoneNumber Phone number in E.164 format
 * @returns {Promise<Object>} Confirmation result for OTP verification
 */
const signInWithPhone = async (phoneNumber) => {
  try {
    const recaptcha = initializeRecaptcha();
    
    // Validate phone number format
    if (!/^\+\d{10,15}$/.test(phoneNumber)) {
      throw new Error("Invalid phone number format. Use E.164 format (+1234567890)");
    }
    
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
    return confirmationResult;
  } catch (error) {
    console.error("Phone Auth Error:", error);
    throw error;
  }
};

/**
 * Store user data in Firestore
 * @param {Object} user Auth user object
 * @param {Object} additionalData Additional data to store
 * @returns {Promise<void>}
 */
const storeUserData = async (user, additionalData = {}) => {
  if (!user) return;
  
  const userRef = doc(firestore, "users", user.uid);
  const userSnap = await getDoc(userRef);
  
  const userData = {
    firstName: additionalData.firstName || user.displayName?.split(" ")[0] || "N/A",
    lastName: additionalData.lastName || user.displayName?.split(" ")[1] || "N/A",
    email: user.email,
    phoneNumber: user.phoneNumber || null,
    photoURL: user.photoURL || null,
    role: "Brother", // Default role
    lastLogin: new Date().toISOString()
  };
  
  if (!userSnap.exists()) {
    // New user - store creation date
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date().toISOString(),
      isActive: true
    });
  } else {
    // Existing user - update login time
    await updateDoc(userRef, {
      ...userData
    });
  }
};

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};

// Export Firebase services and methods
export { 
  app,
  auth, 
  firestore,
  realtimeDB,
  signInWithGoogle, 
  signInWithPhone, 
  emailSignIn,
  emailSignUp,
  logout,
  storeUserData
};
