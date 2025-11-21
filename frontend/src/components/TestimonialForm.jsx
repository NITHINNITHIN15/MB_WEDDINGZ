import React, { useState } from 'react';
import API from '../api/axios';
import './TestimonialForm.css';

export default function TestimonialForm() {
  const [formData, setFormData] = useState({
    name: '',
    weddingType: '',
    testimonial: '',
    rating: 5,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) return '';

    const data = new FormData();
    data.append('image', imageFile);

    try {
      const res = await API.post('/testimonials/upload', data);
      return res.data.imageUrl;
    } catch (err) {
      setMessage('Image upload failed');
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const uploadedImageUrl = await uploadImage();
      const res = await API.post('/testimonials', {
        ...formData,
        image: uploadedImageUrl,
      });
      setMessage('Testimonial submitted successfully!');
      setFormData({ name: '', weddingType: '', testimonial: '', rating: 5 });
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setMessage('Failed to submit testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="testimonial-form-container">
      <h2>Submit Your Testimonial 💬</h2>
      <form onSubmit={handleSubmit} className="testimonial-form">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="weddingType"
          placeholder="Wedding Type (e.g. Hindu, Christian)"
          value={formData.weddingType}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="testimonial"
          placeholder="Write your feedback"
          value={formData.testimonial}
          onChange={handleInputChange}
          required
          rows="4"
        />
        <select
          name="rating"
          value={formData.rating}
          onChange={handleInputChange}
        >
          <option value={5}>5 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={2}>2 Stars</option>
          <option value={1}>1 Star</option>
        </select>

        <input type="file" accept="image/*" onChange={handleFileChange} required />
        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Testimonial'}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
