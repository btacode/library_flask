import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../src/components/Layout/layout";
import Home from "../src/screens/home/home";
import Books from "../src/screens/books/books";
import Login from "../src/screens/login/login";
import Users from "../src/screens/users/users";
import ProtectedRoute from "../src/components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="books" element={<Books />} />
        <Route path="users" element={<Users />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
