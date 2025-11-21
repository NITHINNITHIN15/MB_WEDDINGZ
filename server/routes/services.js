const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// GET all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services', error: err.message });
  }
});

// POST a new service (for admin use)
router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ message: 'Service created successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error creating service', error: err.message });
  }
});

// PUT update service
router.put('/:id', async (req, res) => {
  try {
    await Service.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Service updated successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
});

// DELETE service
router.delete('/:id', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err.message });
  }
});


module.exports = router;
