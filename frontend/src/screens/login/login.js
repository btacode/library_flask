import React, { useState } from "react";
import "./login.css";
import api from "../../config/APIs";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authActions from "../../redux/Actions/authActions";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await api.login(username, password);
      localStorage.setItem("user", JSON.stringify(data));
      dispatch(authActions.setUserData(data));
      navigate("/");
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      const errorMessage = error?.response?.data?.error || "Login failed. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div>
      <div className="login-container">
        <h1>Welcome to the Login Page</h1>
        <div className="card">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                required 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;