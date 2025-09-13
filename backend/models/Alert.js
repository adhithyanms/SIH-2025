const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  busId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['emergency', 'breakdown', 'delay', 'info'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  conductorId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alert', alertSchema);
