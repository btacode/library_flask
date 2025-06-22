import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/APIs";
import { useSelector, useDispatch } from 'react-redux';
import authActions from '../../redux/Actions/authActions';

const Header = () => {
  const { userData } = useSelector((state) => state.auth);
  console.log("🚀 ~ Header ~ userData:", userData)
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.logout();
      localStorage.removeItem("user");
      dispatch(authActions.setClearData());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <header style={{ backgroundColor: "#333", color: "#fff", padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Library Management System</h1>
        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#555",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
