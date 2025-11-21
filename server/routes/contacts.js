const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

// ✅ POST /api/contacts - Submit a new contact message
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, subject, message } = req.body;

      const contact = new Contact({
        name,
        email,
        subject,
        message,
        status: 'unread'
      });

      const saved = await contact.save();
      res.status(201).json({ message: 'Message sent successfully!', contact: saved });
    } catch (error) {
      console.error('Error saving contact:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// ✅ GET /api/contacts - Get all contact messages
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ PATCH /api/contacts/:id - Update contact status
router.patch(
  '/:id',
  [
    body('status')
      .isIn(['unread', 'read', 'replied'])
      .withMessage("Status must be one of 'unread', 'read', or 'replied'")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );

      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      res.json({ message: 'Status updated successfully', contact });
    } catch (error) {
      console.error('Error updating contact status:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// ✅ DELETE /api/contacts/:id - Delete a contact message
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
