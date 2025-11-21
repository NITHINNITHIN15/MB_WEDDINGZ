const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const Gallery = require('../models/Gallery');
const upload = require('../middleware/upload');
const sharp = require('sharp');


// POST /api/gallery/upload - Upload image file and return URL
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// POST /api/gallery - Create a gallery item (imageUrl and category)
router.post('/', [
  body('imageUrl').notEmpty().withMessage('Image URL is required'),
  body('category')
    .isIn(['christian', 'hindu', 'muslim', 'pre-wedding', 'other'])
    .withMessage('Valid category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const imagePath = path.join(__dirname, '..', req.body.imageUrl); // resolve full path

    let metadata;
    try {
      metadata = await sharp(imagePath).metadata();
    } catch (metaErr) {
      console.error('Error reading image metadata:', metaErr);
      return res.status(500).json({ message: 'Failed to read image dimensions' });
    }

    const galleryItem = new Gallery({
      imageUrl: req.body.imageUrl,
      category: req.body.category,
      width: metadata.width,
      height: metadata.height
    });

    const savedItem = await galleryItem.save();
    res.status(201).json({
      message: 'Gallery item added successfully!',
      gallery: savedItem
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// GET /api/gallery - Get all gallery items, optionally filtered by category
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    const galleryItems = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/gallery/:id - Delete a gallery item
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Gallery.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    // Delete image file from uploads folder
    const imagePath = path.join(__dirname, '..', deletedItem.imageUrl); // assuming imageUrl is like '/uploads/filename.jpg'
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting image file:', err.message);
        // Optional: Don't block deletion because of file error
      }
    });

    res.json({ message: 'Gallery item and image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/gallery/:id - Update only imageUrl and category
router.patch('/:id', [
  body('imageUrl').optional().notEmpty().withMessage('Image URL cannot be empty'),
  body('category')
    .optional()
    .isIn(['christian', 'hindu', 'muslim', 'pre-wedding', 'other'])
    .withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json({
      message: 'Gallery item updated successfully',
      gallery: updatedItem
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
