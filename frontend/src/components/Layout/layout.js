import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/header';
import Sidebar from '../sidebar/sidebar';
import Footer from '../footer/footer';
import './layout.css'; 

const Layout = () => {
  return (
    <div className="layout-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
