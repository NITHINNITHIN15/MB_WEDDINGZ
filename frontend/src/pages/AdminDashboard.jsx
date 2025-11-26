// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../api/axios'; // axios instance with baseURL
// import {
//   Container,
//   Typography,
//   Grid,
//   Paper,
//   Box,
//   CircularProgress,
//   Alert,
// } from '@mui/material';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import './AdminDashboard.css';

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem('adminToken');

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [stats, setStats] = useState({
//     bookingsCount: 0,
//     rentalBookingsCount: 0,
//     galleryCount: 0,
//     contactsCount: 0,
//     testimonialsCount: 0,
//   });

//   useEffect(() => {
//     if (!token) {
//       navigate('/admin/login');
//       return;
//     }
//     fetchStats();
//     // eslint-disable-next-line
//   }, []);

//   const fetchStats = async () => {
//     try {
//       setLoading(true);
//       const headers = { Authorization: `Bearer ${token}` };
//       const [bookingsRes, rentalBookingsRes, galleryRes, contactsRes, testimonialsRes] = await Promise.all([
//         API.get('/bookings', { headers }),
//         API.get('/rental-bookings', { headers }),
//         API.get('/gallery', { headers }),
//         API.get('/contacts', { headers }),
//         API.get('/testimonials', { headers }),
//       ]);
//       setStats({
//         bookingsCount: bookingsRes.data.length,
//         rentalBookingsCount: rentalBookingsRes.data.length,
//         galleryCount: galleryRes.data.length,
//         contactsCount: contactsRes.data.length,
//         testimonialsCount: testimonialsRes.data.length,
//       });
//       setError('');
//     } catch (err) {
//       setError('Failed to fetch admin data. Please login again.');
//       localStorage.removeItem('adminToken');
//       navigate('/admin/login');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Prepare chart data
//   const chartData = [
//     { name: 'Bookings', count: stats.bookingsCount },
//     { name: 'Rental Bookings', count: stats.rentalBookingsCount },
//     { name: 'Gallery', count: stats.galleryCount },
//     { name: 'Contacts', count: stats.contactsCount },
//     { name: 'Testimonials', count: stats.testimonialsCount },
//   ];

//   return (
//     <Container className="admin-container">
      

//       {loading ? (
//         <Box display="flex" justifyContent="center" mt={5}>
//           <CircularProgress />
//         </Box>
//       ) : error ? (
//         <Alert severity="error">{error}</Alert>
//       ) : (
//         <>
//           <Grid container spacing={4} mb={4}>
//             <Grid item xs={12} sm={6} md={3}>
//               <Paper elevation={3} className="admin-card">
//                 <Typography variant="h6" gutterBottom>
//                   Bookings
//                 </Typography>
//                 <Box className="admin-count">{stats.bookingsCount}</Box>
//               </Paper>
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <Paper elevation={3} className="admin-card">
//                 <Typography variant="h6" gutterBottom>
//                   Rental Items
//                 </Typography>
//                 <Box className="admin-count">{stats.rentalBookingsCount}</Box>
//               </Paper>
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <Paper elevation={3} className="admin-card">
//                 <Typography variant="h6" gutterBottom>
//                   Gallery Items
//                 </Typography>
//                 <Box className="admin-count">{stats.galleryCount}</Box>
//               </Paper>
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <Paper elevation={3} className="admin-card">
//                 <Typography variant="h6" gutterBottom>
//                   Contacts
//                 </Typography>
//                 <Box className="admin-count">{stats.contactsCount}</Box>
//               </Paper>
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <Paper elevation={3} className="admin-card">
//                 <Typography variant="h6" gutterBottom>
//                   Testimonials
//                 </Typography>
//                 <Box className="admin-count">{stats.testimonialsCount}</Box>
//               </Paper>
//             </Grid>
//           </Grid>

//           {/* Graphical Representation */}
//           <Paper elevation={3} style={{ padding: '24px', borderRadius: '12px' }}>
//             <Typography variant="h6" gutterBottom>
//               Tracking
//             </Typography>
//             <ResponsiveContainer width="100%" height={280}>
//               <BarChart data={chartData}>
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="count" fill="#e2b108" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Paper>
//         </>
//       )}
//     </Container>
//   );
// }


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken'); // ✅ Changed from 'adminToken'
  const role = localStorage.getItem('userRole');   // ✅ Added role check

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    bookingsCount: 0,
    rentalBookingsCount: 0,
    galleryCount: 0,
    contactsCount: 0,
    testimonialsCount: 0,
  });

  useEffect(() => {
    console.log('🔍 AdminDashboard - Token:', token ? 'exists' : 'missing');
    console.log('🔍 AdminDashboard - Role:', role);

    if (!token || role !== 'admin') {
      console.log('❌ Not authorized, redirecting to /login');
      navigate('/login');
      return;
    }
    fetchStats();
    // eslint-disable-next-line
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching admin stats...');
      
      const [bookingsRes, rentalBookingsRes, galleryRes, contactsRes, testimonialsRes] = await Promise.all([
        API.get('/bookings'),
        API.get('/rental-bookings'),
        API.get('/gallery'),
        API.get('/contacts'),
        API.get('/testimonials'),
      ]);

      setStats({
        bookingsCount: bookingsRes.data.length,
        rentalBookingsCount: rentalBookingsRes.data.length,
        galleryCount: galleryRes.data.length,
        contactsCount: contactsRes.data.length,
        testimonialsCount: testimonialsRes.data.length,
      });

      console.log('✅ Stats loaded:', {
        bookings: bookingsRes.data.length,
        rentalBookings: rentalBookingsRes.data.length,
        gallery: galleryRes.data.length,
        contacts: contactsRes.data.length,
        testimonials: testimonialsRes.data.length,
      });

      setError('');
    } catch (err) {
      console.error('❌ Failed to fetch stats:', err);
      setError('Failed to fetch admin data. Please login again.');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = [
    { name: 'Bookings', count: stats.bookingsCount },
    { name: 'Rental Bookings', count: stats.rentalBookingsCount },
    { name: 'Gallery', count: stats.galleryCount },
    { name: 'Contacts', count: stats.contactsCount },
    { name: 'Testimonials', count: stats.testimonialsCount },
  ];

  return (
    <Container className="admin-container">
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Grid container spacing={4} mb={4}>
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
                  Rental Items
                </Typography>
                <Box className="admin-count">{stats.rentalBookingsCount}</Box>
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

          {/* Graphical Representation */}
          <Paper elevation={3} style={{ padding: '24px', borderRadius: '12px' }}>
            <Typography variant="h6" gutterBottom>
              Tracking
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#e2b108" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}
    </Container>
  );
}