import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Login from "./Pages/Login";
import CredentialsSignInPage from "./Pages/Signup";
import Marketplace from "./Pages/Marketplace";
import AccountDetailsPage from "./Pages/CreateCustomerAccount";
import AccountDetails from './Pages/CustomerAccountDetails';
import ShoppingCart from './Pages/ShoppingCart';
import ManagementPage from "./Pages/ManagementPage/index";

// PrivateRoute component that checks if the user is logged in
const PrivateRoute = ({ element }) => {
  const isLoggedIn = Boolean(localStorage.getItem('authToken')); // Check if token is in localStorage

  // If the user is not logged in, redirect to login page
  if (!isLoggedIn) {
    alert('Please log in to access this page');
    return <Navigate to="/login" />;
  }

  // If logged in, render the requested page
  return element;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Marketplace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<CredentialsSignInPage />} />
        <Route path="/create-account" element={<AccountDetailsPage />} />
        <Route path="/EmployeePortal" element={<ManagementPage />} />

        {/* Protected Routes */}
        <Route path="/account" element={<PrivateRoute element={<AccountDetails />} />} />
        <Route path="/cart" element={<PrivateRoute element={<ShoppingCart />} />} />
      </Routes>
    </Router>
  );
}
