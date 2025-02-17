import React, { useState } from "react";
import { auth, signInWithGoogle, signInWithPhone } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle Google Sign-In and redirect to Dashboard
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError("Google sign-in failed. Try again.");
    }
  };

  // Handle Email Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Email Login Error:", error);
      setError("Invalid email or password.");
    }
  };

  // Handle Email Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup Error:", error);
      setError("Signup failed. Try a different email.");
    }
  };

  const handlePhoneLogin = async () => {
    if (!phone.startsWith("+")) {
      alert("Phone number must start with '+' followed by the country code. Example: +11234567890");
      return;
    }
    setError("");
    try {
      const result = await signInWithPhone(phone);
      setConfirmationResult(result);
    } catch (error) {
      setError("Failed to send OTP. Ensure the phone number is correct.");
    }
  };
  

  // Handle OTP Verification
  const handleOtpVerification = async () => {
    setError("");
    try {
      await confirmationResult.confirm(otp);
      navigate("/dashboard");
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Login / Sign Up</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleGoogleSignIn} style={styles.button}>
        Sign in with Google
      </button>

      <h3>Or use Email</h3>
      <form onSubmit={handleEmailLogin} style={styles.form}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
        <button type="submit" style={styles.button}>Login</button>
        <button onClick={handleSignup} style={{ ...styles.button, backgroundColor: "#34a853" }}>Sign Up</button>
      </form>

      <h3>Or use Phone</h3>
      <div>
        <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} style={styles.input} />
        <button onClick={handlePhoneLogin} style={styles.button}>Send OTP</button>
      </div>

      {confirmationResult && (
        <div>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} style={styles.input} />
          <button onClick={handleOtpVerification} style={styles.button}>Verify OTP</button>
        </div>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
};

// Simple inline styles for better UI
const styles = {
  button: {
    display: "block",
    width: "200px",
    margin: "10px auto",
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#4285F4",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px"
  },
  input: {
    width: "250px",
    padding: "8px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  }
};

export default Login;
