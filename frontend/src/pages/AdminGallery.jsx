import React, { useEffect, useState, useRef } from 'react';
import API from '../api/axios';
import './AdminGallery.css';

export default function AdminGallery() {
  const [gallery, setGallery] = useState([]);
  const [form, setForm] = useState({ category: 'christian' });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef();

  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await API.get('/gallery', { headers });
      setGallery(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => setImageFile(e.target.files[0]);
  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddGallery = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!imageFile) {
      setError('Please select an image file to upload.');
      return;
    }

    try {
      const data = new FormData();
      data.append('image', imageFile);

      const uploadRes = await API.post('/gallery/upload', data, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = uploadRes.data.imageUrl;

      const res = await API.post(
        '/gallery',
        { imageUrl, category: form.category },
        { headers }
      );

      setGallery([...gallery, res.data.gallery]);
      setForm({ category: 'christian' });
      setImageFile(null);
      fileInputRef.current.value = null;
      setSuccess('Gallery item added!');
    } catch (err) {
      console.error(err);
      setError('Failed to add gallery item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await API.delete(`/gallery/${id}`, { headers });
      setGallery(gallery.filter((item) => item._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="admin-gallery-container">
      <h2>Gallery Management</h2>

      <form onSubmit={handleAddGallery} className="admin-gallery-form">
        <label>Upload Image (File):</label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          required
        />

        <label>Category:</label>
        <select
          name="category"
          value={form.category}
          onChange={handleInputChange}
          required
        >
          <option value="christian">Christian</option>
          <option value="hindu">Hindu</option>
          <option value="muslim">Muslim</option>
          <option value="pre-wedding">Pre-wedding</option>
          <option value="other">Other</option>
        </select>

        <button type="submit">Add Gallery Item</button>
      </form>

      {error && <p className="admin-gallery-message error">{error}</p>}
      {success && <p className="admin-gallery-message success">{success}</p>}

      <h3>Gallery Items</h3>
      {gallery.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul className="admin-gallery-list">
          {gallery.map((item) => (
            <li key={item._id} className="admin-gallery-card">
              <img
                src={`http://localhost:5000${item.imageUrl}`}
                alt="Gallery"
              />
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Uploaded:</strong> {new Date(item.createdAt).toLocaleString()}</p>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
