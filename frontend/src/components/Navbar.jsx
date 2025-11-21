import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [isTransparent, setIsTransparent] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsTransparent(window.scrollY < 80);
    };

    window.addEventListener('scroll', handleScroll);

    const sectionIds = ['home', 'gallery', 'services', 'team', 'booking', 'contact', 'testimonials'];
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    if (location.pathname === '/') {
      sectionIds.forEach(id => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [location.pathname]);

  const handleScrollClick = (e, id) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      // Go to home page with hash
      navigate(`/#${id}`);
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <nav className={`navbar ${isTransparent ? 'navbar-transparent' : ''}`}>
      <div className="navbar-left">
        <img src="/MB[1].png" alt="logo" className="navbar-logo" />
        <span className="navbar-title">MB_WEDDINGS</span>
      </div>

      <div className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`}>
        {['home', 'gallery', 'services', 'team', 'booking', 'contact', 'testimonials'].map((id) => (
          <a
            key={id}
            href={`/#${id}`}
            className={activeSection === id ? 'active' : ''}
            onClick={(e) => handleScrollClick(e, id)}
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}
        <a href="/admin/dashboard">Admin</a>
      </div>

      <div className="menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>
    </nav>
  );
}
