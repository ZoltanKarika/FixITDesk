import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending login request:", formData);
      const response = await fetch(`${API_URL}/api/accounts/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);
      setToken(data.access);  // Store the JWT token
      setError("");  // Clear any previous error
    } catch (error) {
      setError("Error logging in");
      setToken(""); // Clear any previous token if login fails
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {error && <p>{error}</p>}
      {token && (
        <div>
          <h3>Logged in successfully!</h3>
          <p>Your token: {token}</p>
        </div>
      )}
    </div>
  );
};

export default Login;