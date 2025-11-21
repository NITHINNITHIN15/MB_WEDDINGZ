import React, { useEffect, useState,useRef } from 'react';
import API from '../api/axios';

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

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    <div style={{ padding: '2rem' }}>
      <h2>Gallery Management</h2>

      <form onSubmit={handleAddGallery} style={{ marginBottom: '2rem' }}>
        <label>Upload Image (File):</label><br />
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} required /><br />

        <label>Category:</label><br />
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
        </select><br />

        <button type="submit">Add Gallery Item</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <h3>Gallery Items</h3>
      {gallery.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {gallery.map((item) => (
            <li key={item._id}>
              <img
                src={`http://localhost:5000${item.imageUrl}`}
                alt="Gallery"
                style={{ width: '100px', borderRadius: '6px' }}
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
