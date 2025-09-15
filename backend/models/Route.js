const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

const stopSchema = new mongoose.Schema({
  stopId: {
    type: String,
    required: true,
    unique: false 
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: locationSchema,
    required: true
  },
  order: {
    type: Number,
    required: false
  }
});

const routeSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: true,
    unique: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  stops: [stopSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Route', routeSchema);
