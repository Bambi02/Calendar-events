const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  day: Number,
  month: Number,
  year: Number,
});

module.exports = mongoose.model('Task', TaskSchema);
