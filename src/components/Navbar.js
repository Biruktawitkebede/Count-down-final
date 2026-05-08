// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest(".navbar")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="navbar" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 25px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
      zIndex: 1100,
    }}>
      {/* Logo + Title */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={logo}
          alt="MINT Logo"
          style={{ width: "50px", height: "auto", objectFit: "contain" }}
        />
        <span style={{
          marginLeft: "10px",
          fontWeight: "700",
          fontSize: "clamp(16px, 4vw, 22px)",
          color: "#006400",
          letterSpacing: "0.5px",
        }}>
          MInT Events
        </span>
      </div>

      {/* Desktop Nav Links */}
      <div className="navbar-links-desktop" style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
      }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/about" style={linkStyle}>About Us</Link>
        {(!currentUser || currentUser.role !== "admin") && (
          <Link to="/contact" style={linkStyle}>Contact Us</Link>
        )}
        {!currentUser ? (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/signup" style={{ ...linkStyle, ...signupBtnStyle }}>Sign Up</Link>
          </>
        ) : (
          <>
            {currentUser.role === "user" && (
              <Link to="/user-dashboard" style={linkStyle}>My Dashboard</Link>
            )}
            {currentUser.role === "officer" && (
              <Link to="/officer" style={linkStyle}>Officer Dashboard</Link>
            )}
            {currentUser.role === "head" && (
              <Link to="/head" style={linkStyle}>Head Panel</Link>
            )}
            {currentUser.role === "admin" && (
              <Link to="/admin" style={linkStyle}>Admin Panel</Link>
            )}
            <button onClick={handleLogout} style={logoutBtnStyle}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f8f8f8")}
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Hamburger Button (mobile) */}
      <button
        className="navbar-hamburger"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        style={{
          display: "none",
          flexDirection: "column",
          justifyContent: "space-around",
          width: "30px",
          height: "24px",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          zIndex: 1200,
        }}
      >
        <span style={{ ...barStyle, transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
        <span style={{ ...barStyle, opacity: menuOpen ? 0 : 1, transform: menuOpen ? "scaleX(0)" : "none" }} />
        <span style={{ ...barStyle, transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
      </button>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="navbar-mobile-menu" style={{
          position: "fixed",
          top: "70px",
          left: 0,
          right: 0,
          backgroundColor: "#ffffff",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          zIndex: 1050,
          padding: "16px 24px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          borderTop: "2px solid #f0f0f0",
          animation: "slideDown 0.25s ease-out",
        }}>
          <MobileLink to="/" label="🏠 Home" />
          <MobileLink to="/about" label="ℹ️ About Us" />
          {(!currentUser || currentUser.role !== "admin") && (
            <MobileLink to="/contact" label="📞 Contact Us" />
          )}
          {!currentUser ? (
            <>
              <MobileLink to="/login" label="🔑 Login" />
              <MobileLink to="/signup" label="✍️ Sign Up" highlight />
            </>
          ) : (
            <>
              {currentUser.role === "user" && <MobileLink to="/user-dashboard" label="📋 My Dashboard" />}
              {currentUser.role === "officer" && <MobileLink to="/officer" label="🗂️ Officer Dashboard" />}
              {currentUser.role === "head" && <MobileLink to="/head" label="👤 Head Panel" />}
              {currentUser.role === "admin" && <MobileLink to="/admin" label="⚙️ Admin Panel" />}
              <button
                onClick={handleLogout}
                style={{
                  marginTop: "8px",
                  padding: "12px 16px",
                  textAlign: "left",
                  background: "#fff1f1",
                  border: "1px solid #fca5a5",
                  borderRadius: "10px",
                  color: "#dc2626",
                  fontWeight: "600",
                  fontSize: "15px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>
      )}

      {/* Embedded responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .navbar-links-desktop { display: none !important; }
          .navbar-hamburger { display: flex !important; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
};

const MobileLink = ({ to, label, highlight }) => (
  <Link
    to={to}
    style={{
      padding: "12px 16px",
      borderRadius: "10px",
      color: highlight ? "#0b6666" : "#333",
      fontWeight: highlight ? "700" : "500",
      fontSize: "15px",
      textDecoration: "none",
      background: highlight ? "rgba(11,102,102,0.08)" : "transparent",
      border: highlight ? "1px solid rgba(11,102,102,0.2)" : "1px solid transparent",
      transition: "background 0.2s",
      display: "block",
    }}
  >
    {label}
  </Link>
);

const linkStyle = {
  textDecoration: "none",
  color: "#333",
  fontWeight: "500",
  fontSize: "16px",
  transition: "color 0.2s",
};

const signupBtnStyle = {
  backgroundColor: "#0b6666",
  color: "#fff",
  padding: "7px 16px",
  borderRadius: "8px",
  fontWeight: "600",
};

const logoutBtnStyle = {
  padding: "6px 12px",
  cursor: "pointer",
  border: "1px solid #ccc",
  borderRadius: "5px",
  backgroundColor: "#f8f8f8",
  transition: "0.2s",
};

const barStyle = {
  display: "block",
  width: "100%",
  height: "3px",
  backgroundColor: "#333",
  borderRadius: "3px",
  transition: "all 0.3s ease",
};

export default Navbar;