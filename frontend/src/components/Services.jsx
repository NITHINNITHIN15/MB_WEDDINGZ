import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import './Services.css';
import * as FaIcons from 'react-icons/fa';

export default function Services() {
  const [services, setServices] = useState([]);
  useEffect(() => {
    axios.get('/services')
      .then(res => setServices(res.data))
      .catch(err => console.error('Failed to load services:', err));
  }, []);

function getIconComponent(iconName) {
  const Icon = FaIcons[iconName];
  return Icon ? <Icon size={32} color="goldenrod" /> : <FaIcons.FaCamera size={32} />;
}

  return (
    <section className="services-section">
      <h2 className="services-title">Our Services</h2>
      <p className="services-subtitle">
        We offer a range of photography services tailored to capture your special day with
        elegance and authenticity, regardless of cultural background.
      </p>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-icon">
  {getIconComponent(service.icon)}
</div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
            <ul className="service-features">
              {service.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <a href="#booking" className="learn-more">Learn More</a>
          </div>
        ))}
      </div>
    </section>
  );
}
