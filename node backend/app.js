const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const eventRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 8001;  // Changed to 8001
const MONGODB_URI ="mongodb+srv://dbuser:dbuser@cluster0.hxaza.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" ;


mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.json());
app.use('/events', eventRoutes);
app.use(express.static('public'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));