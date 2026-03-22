import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from './api';
import '../css/rootpage.css';
import '../css/animations.css';

import { useUserHandler } from "./UserHandler";


const Rootpage = () => {
  const { loginHandler } = useUserHandler();
  const [rightActive, setRightActive] = useState(false);
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
      console.log("Login successful:", response.data); // undefined lesz?

      const whoami = await api.get('/api/accounts/whoami/');
      loginHandler(whoami.data);

      navigate('/');
    } catch (loginError) {
      console.error(loginError);
      setLoginError("Error logging in");
      setLoginFormData({ username: "", password: "" });
    }
  };


  const handleRegChange = (e) => {
    setRegFormData({ ...regFormData, [e.target.name]: e.target.value });
  };

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending form data:", regFormData);
      let response = await api.post('/api/accounts/register/', regFormData);
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      const data = await response.json();
      console.log("User registered:", data);
      setRegFormData({
        username: "",
        email: "",
        password: "",
        department: "",
        is_support_staff: false,
      });
      navigate('/');
    } catch (regError) {
      setRegFormData({
        username: "",
        email: "",
        password: "",
        department: "",
        is_support_staff: false,
      });
      setRegError("Error registering user");
    }
  };

  return (
    <>
      <div className="root-wrap">
        <div className={`container ${rightActive ? "right-panel-active" : ""}`}>
          <div className="form-cont log-in-cont">
            <form onSubmit={handleLoginSubmit}>
              <h1>Login</h1>
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
              {loginError && <div style={{ color: "red" }}>{loginError}</div>}
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
              {regError && <div style={{ color: "red" }}>{regError}</div>}
              <button type="submit">Register</button>
            </form>

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