import React, { useState } from "react";
import NavBar from "../navbar/NavBar";
import { Outlet } from "react-router-dom";
import Footer from "../footer/Footer";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed((c) => !c);

  return (
    <div className={`app-layout ${collapsed ? "collapsed" : ""}`}>
      <aside className="sidebar">
        <NavBar collapsed={collapsed} onToggle={toggle} />
      </aside>

      <div className="main-area">
        <main className="content-wrapper">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
