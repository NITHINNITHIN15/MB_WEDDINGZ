import React from 'react';
import './Scrollimg.css';
import bgImage from '../assets/photogroup.jpg';

export default function Hero() {
  return (
    <section
      className="scroll-highlight-section"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      }}
    >
      <div className="overlay">
       <h2>Top-Quality Cameras & Gear for Every Shoot</h2>
<p>Rent premium cameras, lenses, and accessories at unbeatable rates — ready when you are.</p>


        {/* Banner directing to rental section */}
        <a href="/rental" className="rental-banner">
          Check Out Our Camera & Accessory Rentals →
        </a>
      </div>
    </section>
  );
}
