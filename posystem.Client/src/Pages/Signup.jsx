import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/SignUp.css';

const SignUpProto = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Future implementation: Handle form submission
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
    <div className="signup-container">
      <div className="image-box">
        <img src="https://shorturl.at/woo7A" alt="jpeg" className="image" />
      </div>
      <div className="signup-box">
        <h1>Create account</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="name-group">
            <div className="form-group half">
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group half">
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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
            <div className="password-hint">
              Passwords must be at least 6 characters.
            </div>
          </div>

          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="continue-button">
            Create account
          </button>
        </form>

        <div className="signin-link">
          Already have an account? <Link to="/signin-proto">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpProto;