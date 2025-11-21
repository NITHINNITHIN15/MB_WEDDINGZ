import React from 'react';
import './Footer.css';
import { FaInstagram, FaFacebookF, FaTwitter, FaCamera } from 'react-icons/fa';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and Description */}
        <div className="logo-section">
          <h3>
            <FaCamera className="footer-logo-icon" /> MB_WEDDINGS
          </h3>
          <p>
            Capturing timeless moments across cultures with artistry and elegance. 
            Specializing in Christian, Hindu, and Muslim wedding ceremonies.
          </p>
          <div className="social-icons">
            <FaInstagram />
            <FaFacebookF />
            <FaTwitter />
          </div>
        </div>

        {/* Quick Links */}
        <div className="links-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#team">Team</a></li>
            <li><a href="#booking">Book Now</a></li>
          </ul>
        </div>

        {/* Services */}
        <div className="services-section">
          <h4>Our Services</h4>
          <ul>
            <li>Wedding Photography</li>
            <li>Pre-Wedding Shoots</li>
            <li>Christian Ceremonies</li>
            <li>Hindu Ceremonies</li>
            <li>Muslim Ceremonies</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="contact-section">
          <h4>Contact Us</h4>
          <p><FiMapPin /> 123 Wedding Studio, Photography Lane, City, Country</p>
          <p><FiPhone /> +91 7589658947</p>
          <p><FiMail /> info@mbweddings.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 MB_WEDDINGS. All rights reserved.</p>
      </div>
    </footer>
  );
}
