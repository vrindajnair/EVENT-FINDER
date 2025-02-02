// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  imageUrl: String,
});

module.exports = mongoose.model('Event', eventSchema);
