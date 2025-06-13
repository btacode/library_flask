import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header style={{ backgroundColor: "#333", color: "#fff", padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Library Management System</h1>
        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#555",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
          onClick={() => {
            navigate("/login");
            // Add your logout logic here
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
