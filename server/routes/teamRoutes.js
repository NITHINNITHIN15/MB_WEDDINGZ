const express = require('express');
const multer = require('multer');
const path = require('path');
const TeamMember = require('../models/TeamMember');

const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // store in /uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST: Add new team member
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, role, bio, instagram, facebook} = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newMember = new TeamMember({
      name,
      role,
      bio,
      imageUrl,
      socials: {
    instagram,
    facebook,
   
  }
    });

    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Fetch all team members
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update team member
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, role, bio, instagram, facebook} = req.body;
    const updateData = { name, role, bio, socials: {
    instagram,
    facebook,
  } };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await TeamMember.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove team member
router.delete('/:id', async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team member deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
