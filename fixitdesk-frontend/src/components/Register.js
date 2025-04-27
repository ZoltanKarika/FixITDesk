import React, { useState } from "react";

const API_URL = "https://localhost:8000";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    department: "",
    is_support_staff: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const registerPath =  `${API_URL}/api/accounts/register/`
    console.log("RegisterPath ", registerPath)
    try {
      console.log("Sending form data:", formData);
      const response = await fetch(registerPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log("User registered:", data);
    } catch (error) {
      setError("Error registering user");
    }
  };

  // 👇 ADD THIS RETURN!
  return (
    <div>
      <h2>Register</h2>
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
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
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
        <div>
          <label>Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Support Staff:</label>
          <input
            type="checkbox"
            name="is_support_staff"
            checked={formData.is_support_staff}
            onChange={() =>
              setFormData({ ...formData, is_support_staff: !formData.is_support_staff })
            }
          />
        </div>
        <button type="submit">Register</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
