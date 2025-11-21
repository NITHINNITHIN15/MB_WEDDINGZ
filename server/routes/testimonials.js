const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Testimonial = require('../models/Testimonial');
const upload = require('../middleware/upload');

// POST /api/testimonials/upload - Upload image file
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// POST /api/testimonials - Add new testimonial
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('weddingType').notEmpty().withMessage('Wedding type is required'),
  body('testimonial').notEmpty().withMessage('Testimonial is required'),
  body('image').isURL().withMessage('Valid image URL is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const testimonial = new Testimonial({
      name: req.body.name,
      weddingType: req.body.weddingType,
      testimonial: req.body.testimonial,
      image: req.body.image,
      rating: req.body.rating
    });

    const saved = await testimonial.save();
    res.status(201).json({ message: 'Testimonial added successfully!', testimonial: saved });
  } catch (error) {
    console.error('Error adding testimonial:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/testimonials - Get all active testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/testimonials/:id - Delete a testimonial
router.delete('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/testimonials/:id - Update an existing testimonial
router.patch('/:id', [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('weddingType').optional().notEmpty().withMessage('Wedding type cannot be empty'),
  body('testimonial').optional().notEmpty().withMessage('Testimonial cannot be empty'),
  body('image').optional().isURL().withMessage('Valid image URL is required'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial updated successfully!', testimonial: updatedTestimonial });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
