import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios'; // axios instance with baseURL
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import './AdminDashboard.css';


export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    bookingsCount: 0,
    galleryCount: 0,
    contactsCount: 0,
    testimonialsCount: 0,
  });

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
    // eslint-disable-next-line
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const [bookingsRes, galleryRes, contactsRes, testimonialsRes] = await Promise.all([
        API.get('/bookings', { headers }),
        API.get('/gallery', { headers }),
        API.get('/contacts', { headers }),
        API.get('/testimonials', { headers }),
      ]);
      setStats({
        bookingsCount: bookingsRes.data.length,
        galleryCount: galleryRes.data.length,
        contactsCount: contactsRes.data.length,
        testimonialsCount: testimonialsRes.data.length,
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch admin data. Please login again.');
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  // const handleLogout = () => {
  //   localStorage.removeItem('adminToken');
  //   navigate('/admin/login');
  // };

  return (
    <>
  
    <Container className="admin-container">
  <Box className="admin-header">
    <Typography variant="h3">Admin Dashboard</Typography>
  </Box>

  {loading ? (
    <Box display="flex" justifyContent="center" mt={5}>
      <CircularProgress />
    </Box>
  ) : error ? (
    <Alert severity="error">{error}</Alert>
  ) : (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={3} className="admin-card">
          <Typography variant="h6" gutterBottom>
            Bookings
          </Typography>
          <Box className="admin-count">{stats.bookingsCount}</Box>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={3} className="admin-card">
          <Typography variant="h6" gutterBottom>
            Gallery Items
          </Typography>
          <Box className="admin-count">{stats.galleryCount}</Box>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={3} className="admin-card">
          <Typography variant="h6" gutterBottom>
            Contacts
          </Typography>
          <Box className="admin-count">{stats.contactsCount}</Box>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={3} className="admin-card">
          <Typography variant="h6" gutterBottom>
            Testimonials
          </Typography>
          <Box className="admin-count">{stats.testimonialsCount}</Box>
        </Paper>
      </Grid>
    </Grid>
  )}
</Container>

    </>
  );
}
