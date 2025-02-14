import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Login.css';

const SignInProto = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signin-container">
      <div className="image-box">
        <img src="https://shorturl.at/woo7A" alt="jpeg" className="image" />
      </div>
      <div className="signin-box">
        <h1>Sign In To Your Account</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className="toggle-password" onClick={togglePasswordVisibility}>
              {showPassword ? '👁️' : '🙈'}
            </span>
          </div>

          <button type="submit" className="continue-button">
            Sign In
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? <Link to="/signup-proto">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default SignInProto;