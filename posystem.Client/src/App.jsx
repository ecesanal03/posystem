import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from "./Pages/Login";
import CredentialsSignInPage from "./Pages/Signup";
import Marketplace from "./Pages/Marketplace";
import AccountDetailsPage from "./Pages/CreateCustomerAccount";
import AccountDetails from './Pages/CustomerAccountDetails';
import ShoppingCart from './Pages/ShoppingCart';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<CredentialsSignInPage />} />
        <Route path="/create-account" element={<AccountDetailsPage />} />
        <Route path="/account" element={<AccountDetails />} />
        <Route path="/cart" element={<ShoppingCart />} />
      </Routes>
    </Router>
  );
}
