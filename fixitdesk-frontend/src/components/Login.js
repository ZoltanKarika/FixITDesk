import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./config"; // Make sure you have the API_URL set correctly

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

      // Send login request to backend
      const response = await fetch(`${API_URL}/api/accounts/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
        credentials: "include", // <-- This is crucial for cookie-based auth
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Save the access token from the response
      setToken(data.access); // You may choose to store it in cookies/localStorage
      setError("");  // Clear any previous error

      // You can redirect the user to the desired page after successful login
      navigate("/tickets");  // Or wherever you'd like to redirect

    } catch (error) {
      setError("Error logging in");
      setToken(""); // Clear any previous token if login fails
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
