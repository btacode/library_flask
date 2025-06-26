import React, { useEffect, useState } from "react";
import api from "../../config/APIs";
import "./home.css";
import { useSelector } from "react-redux";

function Home() {
  const [stats, setStats] = useState({ users: 0, books: 0, borrowed: 0 });

  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const books = await api.getBooks();
      const booksCount = books?.length || 0;

      let totalUsers = 0;
      let borrowedCount = 0;

      const borrowedData = await api.getBorrowedBooks();

      if (userData?.role === "admin") {
        const users = await api.users();
        totalUsers = users?.length || 0;
        borrowedCount = borrowedData?.total_borrowed_count || 0;
      } else {
        borrowedCount = borrowedData?.borrowed_count || 0;
      }

      setStats({
        books: booksCount,
        users: totalUsers,
        borrowed: borrowedCount,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">📖 Library Dashboard</h2>
      <p className="welcome-text">
        Welcome, <strong>{userData?.username || "User"}</strong> 👋
      </p>

      <div className="card-grid">
        <div className="stat-card books">
          <h3>📚 Total Books</h3>
          <p>{stats.books}</p>
        </div>

        {userData?.role === "admin" && (
          <div className="stat-card users">
            <h3>👤 Registered Users</h3>
            <p>{stats.users}</p>
          </div>
        )}

        <div className="stat-card borrowed">
          <h3>✅ Borrowed Books</h3>
          <p>{stats.borrowed}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;