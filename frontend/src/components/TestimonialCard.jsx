import React, { useEffect, useState, useRef } from 'react';
import API from '../api/axios';
import './Testimonials.css';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!paused && testimonials.length > 1) {
      intervalRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % testimonials.length);
      }, 4000);
    }

    return () => clearInterval(intervalRef.current);
  }, [paused, testimonials]);

  const fetchTestimonials = async () => {
    try {
      const res = await API.get('/testimonials');
      setTestimonials(res.data);
    } catch (err) {
      console.error('Error fetching testimonials');
    }
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="testimonial-section">
      <h2 className="testimonial-heading">What Our Clients Say !</h2>

      <div
        className="horizontal-container"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="horizontal-inner"
          style={{
            transform: `translateX(-${index * 100}%)`,
            width: `${testimonials.length * 100}%`,
          }}
        >
          {testimonials.map((t) => (
            <div className="testimonial-slide" key={t._id}>
              <img src={t.image} alt={t.name} className="testimonial-avatar" />
              <div className="testimonial-content">
                <h3>{t.name}</h3>
                <p className="wedding-type">{t.weddingType}</p>
                <p className="testimonial-text">“{t.testimonial}”</p>
                <div className="stars">
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="nav-button left" onClick={handlePrev}>‹</button>
        <button className="nav-button right" onClick={handleNext}>›</button>
      </div>
    </div>
  );
}
