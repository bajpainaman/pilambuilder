import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";

const Login = () => {
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  
  // UI states
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [activeTab, setActiveTab] = useState("email");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Auth context and navigation
  const { 
    currentUser, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithPhone, 
    error: authError 
  } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  // Handle form validation
  const validateForm = () => {
    const errors = {};
    
    if (activeTab === "email") {
      if (!email.trim()) errors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";
      
      if (!password) errors.password = "Password is required";
      else if (password.length < 6) errors.password = "Password must be at least 6 characters";
    } else if (activeTab === "phone") {
      if (!phone.trim()) errors.phone = "Phone number is required";
      else if (!/^\+\d{10,15}$/.test(phone)) {
        errors.phone = "Phone number must be in E.164 format (e.g., +11234567890)";
      }
      
      if (confirmationResult && !otp.trim()) {
        errors.otp = "OTP is required";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setFormErrors({ general: "Google sign-in failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Login/Signup
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Email Auth Error:", error);
      setFormErrors({ 
        general: isSignUp 
          ? "Signup failed. Email may already be in use." 
          : "Login failed. Invalid email or password." 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Phone Login - Send OTP
  const handlePhoneLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const result = await signInWithPhone(phone);
      setConfirmationResult(result);
    } catch (error) {
      console.error("Phone Login Error:", error);
      setFormErrors({ general: "Failed to send OTP. Please check the phone number." });
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification
  const handleOtpVerification = async () => {
    if (!otp.trim()) {
      setFormErrors({ otp: "OTP is required" });
      return;
    }
    
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      navigate("/dashboard");
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setFormErrors({ otp: "Invalid OTP. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Container styles
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f5f5f5',
  };

  // Tab styles
  const tabContainerStyles = {
    display: 'flex',
    width: '100%',
    marginBottom: '20px',
    borderBottom: '1px solid #e0e0e0',
  };
  
  const tabStyles = (isActive) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal',
    borderBottom: isActive ? '2px solid #2196F3' : 'none',
    color: isActive ? '#2196F3' : '#757575',
  });

  return (
    <div style={containerStyles}>
      <Card title="Pi Lambda Phi" elevation={3} padding="30px" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 20px' }}>
          {isSignUp ? 'Create an Account' : 'Welcome Back'}
        </h2>
        
        {formErrors.general && (
          <div style={{ color: '#F44336', textAlign: 'center', marginBottom: '15px' }}>
            {formErrors.general}
          </div>
        )}
        
        {authError && (
          <div style={{ color: '#F44336', textAlign: 'center', marginBottom: '15px' }}>
            {authError}
          </div>
        )}

        <Button 
          onClick={handleGoogleSignIn} 
          fullWidth 
          disabled={loading}
          variant="primary"
          style={{ marginBottom: '20px' }}
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>

        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <span style={{ color: '#757575' }}>Or continue with</span>
        </div>

        <div style={tabContainerStyles}>
          <div 
            style={tabStyles(activeTab === 'email')}
            onClick={() => setActiveTab('email')}
          >
            Email
          </div>
          <div 
            style={tabStyles(activeTab === 'phone')}
            onClick={() => setActiveTab('phone')}
          >
            Phone
          </div>
        </div>

        {activeTab === 'email' ? (
          <form onSubmit={handleEmailSubmit}>
            <Input 
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={formErrors.email}
              placeholder="Enter your email"
              required
            />
            <Input 
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={formErrors.password}
              placeholder="Enter your password"
              required
            />
            <Button 
              type="submit" 
              fullWidth 
              disabled={loading}
              variant={isSignUp ? 'success' : 'primary'}
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
            </Button>
            
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <button 
                type="button" 
                onClick={() => setIsSignUp(!isSignUp)} 
                style={{ background: 'none', border: 'none', color: '#2196F3', cursor: 'pointer' }}
              >
                {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <Input 
              type="tel"
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={formErrors.phone}
              placeholder="e.g., +11234567890"
              required
            />
            
            {!confirmationResult ? (
              <Button 
                onClick={handlePhoneLogin} 
                fullWidth 
                disabled={loading}
                variant="primary"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            ) : (
              <>
                <Input 
                  type="text"
                  label="One-Time Password"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  error={formErrors.otp}
                  placeholder="Enter the OTP sent to your phone"
                  required
                />
                <Button 
                  onClick={handleOtpVerification} 
                  fullWidth 
                  disabled={loading}
                  variant="success"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </>
            )}
          </div>
        )}
      </Card>
      
      <div id="recaptcha-container" style={{ marginTop: '20px' }}></div>
    </div>
  );
};

export default Login;
