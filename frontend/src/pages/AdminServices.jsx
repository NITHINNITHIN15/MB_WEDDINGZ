import React, { useEffect, useState, useRef} from 'react';
import axios from '../api/axios';
import {
  FaCamera,
  FaHeart,
  FaUserFriends,
  FaChurch,
  FaRing,
  FaGift,
  FaCalendarAlt,
  FaImages,
  FaFilm,
  FaStar,
  FaMusic,
  FaGlassCheers,
  FaCar,
  FaMapMarkerAlt,
  FaSuitcaseRolling,
  FaBell,
  FaCrown,
  FaMicrophoneAlt,
  FaPalette,
  FaHandsHelping,
} from 'react-icons/fa';
import './AdminServices.css';

const iconOptions = [
  { name: 'Camera', icon: <FaCamera />, value: 'FaCamera' },
  { name: 'Heart', icon: <FaHeart />, value: 'FaHeart' },
  { name: 'Users / Couples', icon: <FaUserFriends />, value: 'FaUserFriends' },
  { name: 'Church / Ceremony', icon: <FaChurch />, value: 'FaChurch' },
  { name: 'Ring', icon: <FaRing />, value: 'FaRing' },
  { name: 'Gift', icon: <FaGift />, value: 'FaGift' },
  { name: 'Calendar / Booking', icon: <FaCalendarAlt />, value: 'FaCalendarAlt' },
  { name: 'Image / Gallery', icon: <FaImages />, value: 'FaImages' },
  { name: 'Film / Videography', icon: <FaFilm />, value: 'FaFilm' },
  { name: 'Star / Testimonials', icon: <FaStar />, value: 'FaStar' },
  { name: 'Music / DJ', icon: <FaMusic />, value: 'FaMusic' },
  { name: 'Reception / Toast', icon: <FaGlassCheers />, value: 'FaGlassCheers' },
  { name: 'Car / Transportation', icon: <FaCar />, value: 'FaCar' },
  { name: 'Venue / Location', icon: <FaMapMarkerAlt />, value: 'FaMapMarkerAlt' },
  { name: 'Travel / Destination Wedding', icon: <FaSuitcaseRolling />, value: 'FaSuitcaseRolling' },
  { name: 'Reminders / Notifications', icon: <FaBell />, value: 'FaBell' },
  { name: 'Crown / Bride & Groom', icon: <FaCrown />, value: 'FaCrown' },
  { name: 'Emcee / Announcer', icon: <FaMicrophoneAlt />, value: 'FaMicrophoneAlt' },
  { name: 'Decoration / Styling', icon: <FaPalette />, value: 'FaPalette' },
  { name: 'Helpers / Assistance', icon: <FaHandsHelping />, value: 'FaHandsHelping' },
];

const iconMap = {
  FaCamera, FaHeart, FaUserFriends, FaChurch, FaRing, FaGift, FaCalendarAlt,
  FaImages, FaFilm, FaStar, FaMusic, FaGlassCheers, FaCar, FaMapMarkerAlt,
  FaSuitcaseRolling, FaBell, FaCrown, FaMicrophoneAlt, FaPalette, FaHandsHelping
};


export default function AdminServices() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    icon: 'FaCamera',
    features: [''],
  });

  const [services, setServices] = useState([]);
  const [editId, setEditId] = useState(null);
  const formRef = useRef(null);


  const fetchServices = () => {
    axios.get('/services')
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e, index) => {
    if (e.target.name === 'features') {
      const updated = [...form.features];
      updated[index] = e.target.value;
      setForm({ ...form, features: updated });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addFeature = () => {
    setForm({ ...form, features: [...form.features, ''] });
  };

  const resetForm = () => {
    setForm({ title: '', description: '', icon: 'FaCamera', features: [''] });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/services/${editId}`, form);
        alert('Service updated!');
      } else {
        await axios.post('/services', form);
        alert('Service added!');
      }
      resetForm();
      fetchServices();
    } catch (err) {
      console.error(err);
      alert('Failed to submit service.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await axios.delete(`/services/${id}`);
      fetchServices();
    } catch (err) {
      alert('Error deleting');
    }
  };

  const handleEdit = (service) => {
    setForm({
      title: service.title,
      description: service.description,
      icon: service.icon,
      features: service.features,
    });
    setEditId(service._id);
    if (formRef.current) {
    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  };

  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent color="goldenrod" size={24} /> : null;
  };

  return (
    <div className="admin-services-form">
      <h2>{editId ? 'Edit Service' : 'Add a New Service'}</h2>
      <div className="admin-services-content">
      <form ref={formRef} onSubmit={handleSubmit} className="form-section">
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} required />

        <label>Choose an Icon</label>
        <select name="icon" value={form.icon} onChange={handleChange}>
          {iconOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.name}</option>
          ))}
        </select>

       <label>Features</label>
{form.features.map((feature, index) => (
  <div key={index} className="feature-input-row">
    <input
      type="text"
      name="features"
      value={feature}
      onChange={(e) => handleChange(e, index)}
      placeholder={`Feature ${index + 1}`}
    />
    <button
      type="button"
      className="delete-feature-btn"
      onClick={() => {
        const updated = form.features.filter((_, i) => i !== index);
        setForm({ ...form, features: updated });
      }}
      title="Remove this feature"
    >
      Remove
    </button>
  </div>
))}
<button type="button" onClick={addFeature}>Add More Features</button>



        <button type="submit">{editId ? 'Update' : 'Add'} Service</button>
        {editId && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <div className="list-section">
      <h3>Existing Services</h3>
      <ul className="services-list">
        {services.map(service => (
          <li key={service._id}>
            {renderIcon(service.icon)} <strong>{service.title}</strong>: {service.description}
            <button onClick={() => handleEdit(service)}>Edit</button>
            <button className='deletebutton' onClick={() => handleDelete(service._id)}>Delete</button>
          </li>
        ))}
      </ul>
      </div>
      </div>
    </div>
  );
}
