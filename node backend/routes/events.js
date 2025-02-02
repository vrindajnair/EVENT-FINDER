
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');


router.get('/get-all-events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/search', async (req, res) => {
  const { location } = req.query;
  try {
    const events = await Event.find({
      location: { $regex: location, $options: 'i' },
    });
    if (events.length === 0) {
      return res.status(404).json({ message: 'No events found for the specified location' });
    }
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/addevent', async (req, res) => {
  const event = new Event({
    name: req.body.name,
    description: req.body.description,
    date: req.body.date,
    time: req.body.time,
    location: req.body.location,
    imageUrl: req.body.imageUrl,
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
