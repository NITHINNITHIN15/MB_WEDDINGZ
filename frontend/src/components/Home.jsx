import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Gallery from './Gallery';
import Services from './Services';
import Team from './Team';
import Booking from './BookingForm';
import Contact from './ContactForm';
import Scrollimg from './Scrollimg';
import Testimonials from './TestimonialCard';
import Footer from './Footer';
import './Home.css';

const imageList = [
  require('../assets/chriswedd.jpeg'),
  require('../assets/chriswedd02.jpeg'),
  require('../assets/chriswedd04.jpg'),
];

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-wrapper">
      <Navbar />
      <section
        className="home-container"
        id="home"
        style={{ backgroundImage: `url(${imageList[currentImageIndex]})` }}
      >
        <div className="hero-section">
          <div className="hero-content">
            <h1>Capturing Timeless Moments</h1>
            <p>
              Specializing in Christian, Hindu, and Muslim wedding ceremonies. <br />
              We preserve your precious memories with artistic elegance.
            </p>
            <a href="#booking" className="book-btn">Book Your Session</a>
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-section"><Gallery /></section>
      <section id="services" className="scroll-section"><Services /></section>
      <section id="team" className="scroll-section"><Team /></section>
      <section id="booking" className="scroll-section"><Booking /></section>
      <section id="scrollimg" className="scroll-section"><Scrollimg /></section>
      <section id="contact" className="scroll-section"><Contact /></section>
      <section id="testimonials" className="scroll-section"><Testimonials /></section>
      <Footer/>
    </div>
  );
};

export default Home;
