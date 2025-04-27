import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./config";
import Cookies from "js-cookie"; // <-- You forgot to import it!

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const csrfToken = Cookies.get('csrftoken'); // ✅ Correctly get CSRF token

    try {
      console.log("Sending login request:", formData);

      const response = await fetch(`${API_URL}/api/accounts/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,  // ✅ Pass the CSRF token!
        },
        credentials: "include", // ✅ Important: send cookies too
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // ✅ No need to manually set document.cookie here!
      // Django already set access_token and refresh_token cookies for you.

     // Clear any error

    } catch (error) {
      console.error(error);
      setError("Error logging in");
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
