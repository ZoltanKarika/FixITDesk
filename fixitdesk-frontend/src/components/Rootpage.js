import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from './api';
import { API_URL } from "./config";
import '../css/rootpage.css';

const Rootpage = () => {
  const [rightActive, setRightActive] = useState(false);// for Design
  const [loginFormData, setLoginFormData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const [regFormData, setRegFormData] = useState({
    username: "",
    email: "",
    password: "",
    department: "",
    is_support_staff: false,
  });

  const [regError, setRegError] = useState("");

  const handleLoginChange = (e) => {
    setLoginFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      console.log("Sending login request:", loginFormData);

      const response = await api.post(
        `/api/accounts/login/`,
        {
          username: loginFormData.username,
          password: loginFormData.password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Login successful:", response.data);
      navigate('/dashboard');
    } catch (loginError) {
      console.error(loginError);
      setLoginError("Error logging in");
    }
  };


  const handleRegChange = (e) => {
    setRegFormData({ ...regFormData, [e.target.name]: e.target.value });
  };

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    const registerPath = `${API_URL}/api/accounts/register/`
    console.log("RegisterPath ", registerPath)
    try {
      console.log("Sending form data:", regFormData);
      const response = await fetch(registerPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(regFormData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log("User registered:", data);

      navigate('/login')
    } catch (regError) {
      setRegError("Error registering user");
    }
  };

  return (
    <>
      <div className="root-wrap">
        <div className="logo"></div>
        <div className={`container ${rightActive ? "right-panel-active" : ""}`}>
          <div className="form-cont log-in-cont">
            <form onSubmit={handleLoginSubmit}>
              <h1>Login</h1>
              {loginError && <p style={{ color: "red" }}>{loginError}</p>}
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={loginFormData.username}
                  onChange={handleLoginChange}
                />
              </label>
              <br />
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={loginFormData.password}
                  onChange={handleLoginChange}
                />
              </label>
              <br />
              <button type="submit">Login</button>
            </form>
          </div>
          <div className="form-cont reg-cont">
            <form onSubmit={handleRegSubmit}>
              <h1>Register</h1>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={regFormData.username}
                onChange={handleRegChange}
                required
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={regFormData.email}
                onChange={handleRegChange}
                required
              />
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={regFormData.password}
                onChange={handleRegChange}
                required
              />
              <label>Department:</label>
              <input
                type="text"
                name="department"
                value={regFormData.department}
                onChange={handleRegChange}
                required
              />
              <label>Support Staff:</label>
              <input
                type="checkbox"
                name="is_support_staff"
                checked={regFormData.is_support_staff}
                onChange={() =>
                  setRegFormData({ ...regFormData, is_support_staff: !regFormData.is_support_staff })
                }
              />
              <button type="submit">Register</button>
            </form>

            {regError && <p>{regError}</p>}
          </div>

          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Ready to begin?</h1>
                <p>Just log in first!</p>
                <button className="slide-but" onClick={() => setRightActive(false)}>
                  Sign In
                </button>
              </div>

              <div className="overlay-panel overlay-right">
                <h1>New Here?</h1>
                <p>Please register to get started.</p>
                <button className="slide-but" onClick={() => setRightActive(true)}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rootpage