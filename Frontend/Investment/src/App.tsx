// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import TokenPurchase from "./Components/UserSide/TokenPurchase";
import AdminLogin from "./Components/AdminDashboard/AdminLogin";
import AdminSignUp from "./Components/AdminDashboard/AdminSignup";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/purchase" element={<TokenPurchase />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<AdminSignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
