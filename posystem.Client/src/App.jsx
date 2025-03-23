import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Marketplace from "./Pages/Marketplace";
import ReportsPage from './Pages/Reports';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Router>
  );
}
