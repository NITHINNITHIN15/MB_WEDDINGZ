const express = require('express');
const multer = require('multer');
const path = require('path');
const RentalItem = require('../models/RentalItem');
const router = express.Router();

// Setup Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/rentals/');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.use('/images', express.static(path.join(__dirname, '..', 'uploads', 'rentals')));

// GET all items
router.get('/', async (req, res) => {
  try {
    const items = await RentalItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rental items.' });
  }
});

// POST new item (Admin only)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required.' });
    }

    const imageUrl = `/uploads/rentals/${req.file.filename}`;
    const newItem = new RentalItem({
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      pricePerDay: req.body.pricePerDay,
      imageUrl,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("❌ Rental creation error:", err.message);
    res.status(400).json({ error: 'Failed to add item.' });
  }
});
// PUT to update item (Admin only)


router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.imageUrl = `/api/rentals/images/${req.file.filename}`;
    }
    const updated = await RentalItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update item.' });
  }
});

// DELETE item (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    await RentalItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete item.' });
  }
});

module.exports = router;
