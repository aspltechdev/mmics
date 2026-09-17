// client/src/components/layout/PublicLayout.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./PublicLayout.css";

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <Navbar />

      <main className="public-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;