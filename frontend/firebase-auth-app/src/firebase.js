import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Firebase config (Replace with your own)
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ✅ Ensure RecaptchaVerifier is only initialized once
let recaptchaVerifier;

const initializeRecaptcha = () => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => console.log("reCAPTCHA Verified!"),
      "expired-callback": () => console.log("reCAPTCHA Expired. Try again."),
    });
  }
};

// ✅ Sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Store user in Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        firstName: user.displayName?.split(" ")[0] || "N/A",
        lastName: user.displayName?.split(" ")[1] || "N/A",
        email: user.email,
        role: "Brother",
        firstLogin: new Date(),
        lastLogin: new Date(),
        isActive: true
      });
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

// ✅ Sign in with Phone (with Recaptcha Fix)
const signInWithPhone = async (phoneNumber) => {
    try {
      initializeRecaptcha(); // Ensure reCAPTCHA is initialized only once
  
      // ✅ Format phone number correctly
      if (!/^\+\d{10,15}$/.test(phoneNumber)) {
        throw new Error("Invalid phone number format. Use E.164 format, e.g., +1234567890");
      }
  
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      return confirmationResult;
    } catch (error) {
      console.error("Phone Auth Error:", error.message);
      alert(error.message); // Show error to user
    }
  };
  

export { auth, db, signInWithGoogle, signInWithPhone };
