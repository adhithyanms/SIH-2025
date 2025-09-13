const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: true
  },
  fromStop: {
    type: String,
    required: true
  },
  toStop: {
    type: String,
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  passengerCount: {
    type: Number,
    default: 1,
    min: 1
  },
  qrCode: {
    type: String,
    required: true,
    unique: true
  },
  conductorId: {
    type: String,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);
