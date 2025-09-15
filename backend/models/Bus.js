const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  routeNumber: { type: String, required: true },
  conductorId: { type: String, required: true },
  currentStop: { type: String },
  nextStop: { type: String },
  currentLocation: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
  },
  crowdLevel: { type: String, default: 'low' },
  passengerCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);

