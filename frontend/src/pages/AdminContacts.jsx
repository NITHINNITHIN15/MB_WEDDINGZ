// AdminContacts.jsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import API from '../api/axios';
import './AdminContact.css';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await API.patch(`/contacts/${id}`, { status });
      fetchContacts();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await API.delete(`/contacts/${id}`);
        fetchContacts();
      } catch (err) {
        console.error('Error deleting contact:', err);
      }
    }
  };

  return (
    <Container className="admin-contacts-container">
      <Typography variant="h5" gutterBottom>
        Manage Contact Messages
      </Typography>

      {loading ? (
        <div className="admin-contacts-loading">
          <CircularProgress />
        </div>
      ) : contacts.length === 0 ? (
        <Typography className="admin-contacts-empty">
          No contact messages found.
        </Typography>
      ) : (
        <Paper className="admin-contacts-table-wrapper">
          <Table className="admin-contacts-table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((c) => (
                <TableRow key={c._id}>
                  <TableCell data-label="Name">{c.name}</TableCell>
                  <TableCell data-label="Email">{c.email}</TableCell>
                  <TableCell data-label="Subject">{c.subject}</TableCell>
                  <TableCell data-label="Message">{c.message}</TableCell>
                  <TableCell data-label="Status">
                    <FormControl
                      size="small"
                      fullWidth
                      className="admin-contacts-select"
                    >
                      <Select
                        value={c.status}
                        onChange={(e) =>
                          handleStatusChange(c._id, e.target.value)
                        }
                      >
                        <MenuItem value="unread">Unread</MenuItem>
                        <MenuItem value="read">Read</MenuItem>
                        <MenuItem value="replied">Replied</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell data-label="Actions">
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(c._id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                    {/* Optional refresh button
                    <Tooltip title="Refresh">
                      <IconButton onClick={fetchContacts}>
                        <ReplayIcon />
                      </IconButton>
                    </Tooltip>
                    */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default AdminContacts;
