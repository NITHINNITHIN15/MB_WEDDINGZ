import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [isTransparent, setIsTransparent] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const userToken = localStorage.getItem("userToken");
  const username = localStorage.getItem("userName") || "User";

  const sectionIds = [
    "home",
    "gallery",
    "services",
    "team",
    "booking",
    "contact",
    "testimonials",
  ];

  // Treat /user/dashboard as homepage for scrolling
  const isHomePage = location.pathname === "/" || location.pathname === "/user/dashboard";

  /* SCROLL + ACTIVE SECTION */
  useEffect(() => {
    const handleScroll = () => setIsTransparent(window.scrollY < 80);
    window.addEventListener("scroll", handleScroll);

    if (isHomePage) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { threshold: [0.5] }
      );

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      });

      return () => observer.disconnect();
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  /* SCROLL TO SECTION */
  const handleScrollClick = (e, id) => {
    e.preventDefault();

    if (!isHomePage) {
      navigate("/user/dashboard");
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        setActiveSection(id);
        setIsMobileMenuOpen(false);
      }
    }
  };

  /* LOGOUT */
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <nav className={`navbar ${isTransparent ? "navbar-transparent" : ""}`}>
      <div className="navbar-left">
        <img src="/MB[1].png" alt="logo" className="navbar-logo" />
        <div className="navbar-title-group">
          <span className="navbar-title">MB_WEDDINGS</span>
        </div>
      </div>

      <div className={`navbar-links ${isMobileMenuOpen ? "open" : ""}`}>
        {sectionIds.map((id) => (
          <a
            key={id}
            href={`/#${id}`}
            className={activeSection === id ? "active" : ""}
            onClick={(e) => handleScrollClick(e, id)}
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}

        {localStorage.getItem("userRole") === "admin" && (
          <a href="/admin/dashboard">Admin</a>
        )}

        {userToken && (
          <div className="profile-container">
            <FaUserCircle
              className="profile-icon"
              onClick={() => setOpenProfile(!openProfile)}
            />
            {openProfile && (
              <div className="profile-dropdown">
                <p className="profile-name">{username}</p>
                <button className="dropdown-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="menu-icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>
    </nav>
  );
}
