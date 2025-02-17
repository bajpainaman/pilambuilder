import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Referral from "./pages/Referral"; // ✅ Import Referral component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/referral" element={<Referral />} />  {/* ✅ Fixed closing tag */}
      </Routes>
    </Router>
  );
};

export default App;
