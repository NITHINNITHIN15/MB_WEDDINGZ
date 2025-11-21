import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Switch, Rating
} from '@mui/material';
import API from '../api/axios';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  const fetchTestimonials = async () => {
    const res = await API.get('/testimonials');
    setTestimonials(res.data);
  };

  const toggleActive = async (id, isActive) => {
    await API.put(`/testimonials/${id}`, { isActive });
    fetchTestimonials();
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <>
   
    <Container>
      <Typography variant="h4" gutterBottom>Manage Testimonials</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Wedding Type</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {testimonials.map((t) => (
            <TableRow key={t._id}>
              <TableCell>{t.name}</TableCell>
              <TableCell>{t.weddingType}</TableCell>
              <TableCell>
                <Rating value={t.rating} readOnly />
              </TableCell>
              <TableCell><img src={t.image} alt={t.name} width={60} /></TableCell>
              <TableCell>
                <Switch
                  checked={t.isActive}
                  onChange={(e) => toggleActive(t._id, e.target.checked)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
    </>
  );
};

export default AdminTestimonials;
