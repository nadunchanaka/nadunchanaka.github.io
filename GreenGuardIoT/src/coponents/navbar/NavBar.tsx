// import React from "react";
// import "./NavBar.css";
// import { Link } from "react-router-dom";
// import logo from "../../assets/logo.png";

// export default function NavBar() {
//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <div className="navbar-brand">
//           <i className="fas fa-leaf navbar-icon"></i>
//           {/* <span className="navbar-title">Green House IoT</span> */}
//           <img src={logo} className="navbar-logo" />
//         </div>

//         <div className="navbar-links">
//           <Link to="/" className="nav-link">
//             Home
//           </Link>
//           <Link to="/ourProduc" className="nav-link">
//             Product
//           </Link>
//           <Link to="/dashboard" className="nav-link">
//             Dashboard
//           </Link>
//           <Link to="/contact" className="nav-link">
//             Contact
//           </Link>
//         </div>

//         <Link to="/dashboard" className="navbar-button">
//           Login
//         </Link>
//       </div>
//     </nav>
//   );
// }

import React from "react";
import "./NavBar.css";
import { Link, useLocation } from "react-router-dom";
import dashbor from "../../assets/Dashboard-img.png";
import home from "../../assets/Home.png";
import contact from "../../assets/Contact.png";
import productImg from "../../assets/Products.png";
import logo from "../../assets/logo.png";

type Props = {
  collapsed?: boolean;
  onToggle?: () => void;
};

// export default function NavBar({ collapsed, onToggle }: Props) {
export default function NavBar({}: Props) {
  const location = useLocation();

  return (
    <nav className="navbar" aria-label="Primary">
      <div className="navbar-container">
        {/* <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-pressed={!!collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "☰" : "«"}
        </button> */}

        <img src={logo} alt="logo" className="logo-image" />

        <div className="navbar-brand">
          <span className="navbar-logo">🌿</span>
          <span className="navbar-title">Green Guard IoT</span>
        </div>

        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            {/* <span className="link-icon">📊</span> */}
            <img src={dashbor} alt="dashboard" className="nav-img" />
            <span className="link-label">Dashboard</span>
          </Link>
          <Link
            to="/home"
            className={`nav-link ${
              location.pathname === "/home" ? "active" : ""
            }`}
          >
            {/* <span className="link-icon">🏠</span> */}
            <img src={home} alt="home" className="nav-img" />
            <span className="link-label">Home</span>
          </Link>

          <Link
            to="/ourProduc"
            className={`nav-link ${
              location.pathname === "/ourProduc" ? "active" : ""
            }`}
          >
            <img src={productImg} alt="product" className="nav-img" />
            <span className="link-label">Product</span>
          </Link>

          <Link
            to="/contact"
            className={`nav-link ${
              location.pathname === "/contact" ? "active" : ""
            }`}
          >
            <img src={contact} alt="contact" className="nav-img" />
            <span className="link-label">Contact</span>
          </Link>
        </div>

        <Link to="/" className="navbar-button">
          Login
        </Link>
      </div>
    </nav>
  );
}
