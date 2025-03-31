import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Referral from "./pages/Referral";
import { AuthProvider } from "./contexts/AuthContext";
import { DatabaseProvider } from "./contexts/DatabaseContext";
import { useAuth } from "./contexts/AuthContext";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        flexDirection: "column", 
        backgroundColor: "#f5f5f5" 
      }}>
        <h2>Loading...</h2>
        <p>Please wait while we get things ready</p>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <DatabaseProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/referral"
              element={
                <ProtectedRoute>
                  <Referral />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </DatabaseProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
