import React, { useState, useEffect, useRef } from 'react';
import axios from '../api/axios';
import './AdminAddTeam.css';

export default function AdminAddTeam() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    instagram: '',
    facebook: '',
  });

  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchMembers = async () => {
    try {
      const res = await axios.get('/team');
      setMembers(res.data);
    } catch (err) {
      console.error('Failed to fetch members:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append('image', image);

    try {
      if (editingId) {
        await axios.put(`/team/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage('Team member updated!');
        setEditingId(null);
      } else {
        await axios.post('/team', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage('Team member added!');
      }

      setFormData({ name: '', role: '', bio: '', instagram: '', facebook: '' });
      setImage(null);
      fileInputRef.current.value = null;
      fetchMembers();
    } catch (err) {
      console.error(err);
      setMessage('Error saving team member.');
    }
  };

  const handleEdit = (member) => {
    setFormData({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      instagram: member.socials?.instagram || '',
      facebook: member.socials?.facebook || '',
    });
    setEditingId(member._id);
    setImage(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    try {
      await axios.delete(`/team/${id}`);
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="yellow-wrapper">
      <div className="admin-add-team-container">
        {/* Form Section */}
        <div className="form-section" ref={formRef}>
          <h2>{editingId ? 'Edit' : 'Add'} Team Member</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
              required
            />
            <textarea
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={handleChange}
              required
            />
            <input
              type="url"
              name="instagram"
              placeholder="Instagram URL"
              value={formData.instagram}
              onChange={handleChange}
            />
            <input
              type="url"
              name="facebook"
              placeholder="Facebook URL"
              value={formData.facebook}
              onChange={handleChange}
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <button type="submit">{editingId ? 'Update' : 'Submit'}</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>

        {/* Team Members Section */}
        <div className="members-section">
          <h3>Team Members</h3>
          {members.length === 0 && <p>No team members yet.</p>}
          {members.map(member => (
            <div key={member._id} className="team-member">
              <img src={`http://localhost:5000${member.imageUrl}`} alt={member.name} />
              <div className="team-member-content">
                <h4>{member.name}</h4>
                <p><strong>Role:</strong> {member.role}</p>
                <p><strong>Specialization:</strong> {member.specialization}</p>
                <p>{member.bio}</p>
                <div className="member-buttons">
                  <button onClick={() => handleEdit(member)}>Edit</button>
                  <button onClick={() => handleDelete(member._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
