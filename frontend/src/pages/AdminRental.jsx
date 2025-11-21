import React, { useEffect, useState, useRef  } from 'react';
import axios from '../api/axios';
import './AdminRental.css';

export default function AdminRental() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'Camera', description: '', imageUrl: '', pricePerDay: '' });
  const [editId, setEditId] = useState(null);
  const [file, setFile] = useState(null);

  const formRef = useRef();
  const fileInputRef = useRef();

  const fetchItems = () => {
    axios.get('/rentals')
      .then(res => setItems(res.data))
      .catch(err => console.error("Failed to load rentals", err));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = e => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('name', form.name);
  formData.append('type', form.type);
  formData.append('description', form.description);
  formData.append('pricePerDay', form.pricePerDay);
  if (file) {
    formData.append('image', file);
  } else if (!editId) {
    alert("Image file is required");
    return;
  }

  const request = editId
    ? axios.put(`/rentals/${editId}`, formData)
    : axios.post('/rentals', formData);

  request.then(() => {
    fetchItems();
    resetForm();
  }).catch(err => {
    console.error("Form submission failed:", err.response?.data || err.message);
  });
};

  const handleDelete = id => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
      axios.delete(`/rentals/${id}`)
    .then(() => {
      fetchItems();      // refresh the list
      alert('Item deleted successfully');   // ✅ success message
    })
    .catch(err => {
      console.error(err);
      alert('Failed to delete item');       // (optional) error message
    });
  };

  const handleEdit = item => {
    setForm({
      name: item.name,
      type: item.type,
      description: item.description,
      imageUrl: item.imageUrl,
      pricePerDay: item.pricePerDay,
    });
    setFile(null);
    setEditId(item._id);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setForm({ name: '', type: 'Camera', description: '', imageUrl: '', pricePerDay: '' });
    setEditId(null);
  };

  const handleFileChange = (e) => {
  setFile(e.target.files[0]);
};

const resetForm = () => {
  setForm({ name: '', type: 'Camera', description: '', imageUrl: '', pricePerDay: '' });
  setFile(null);
  setEditId(null);

   if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};

  return (
    <div className="admin-rental-page">
      <h2>{editId ? 'Edit Rental Item' : 'Add Rental Item'}</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="admin-rental-form">
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          required
        />
        <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option>Camera</option>
          <option>Lens</option>
          <option>Accessory</option>
        </select>
        <input
          type="number"
          value={form.pricePerDay}
          onChange={e => setForm({ ...form, pricePerDay: e.target.value })}
          placeholder="Price/Day"
          required
        />
        <input
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          required={!editId}
        />

        {/* Preview new image if selected */}
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            style={{ width: '100px', marginTop: '10px', borderRadius: '6px' }}
          />
        )}

        {/* Show existing image if editing and no new file selected */}
        {editId && form.imageUrl && !file && (
          <img
            src={`http://localhost:5000${form.imageUrl}`}
            alt="current"
            style={{ width: '100px', marginTop: '10px', borderRadius: '6px' }}
          />
        )}

        <div className="admin-rental-buttons">
          <button type="submit">{editId ? 'Update Item' : 'Add Item'}</button>
          {editId && (
            <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
          )}
        </div>
      </form>

      <ul className="admin-rental-list">
        {items.map(item => (
          <li key={item._id}>
            <div className="item-info">
              <img src={`http://localhost:5000${item.imageUrl}`} alt={item.name} />
              <div>
                <strong>{item.name}</strong><br />
                ₹{item.pricePerDay}/day ({item.type})
              </div>
            </div>
            <div className="item-actions">
              <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}