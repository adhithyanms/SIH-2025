// const mongoose = require('mongoose');

// const locationSchema = new mongoose.Schema({
//   lat: { type: Number, required: true },
//   lng: { type: Number, required: true }
// });

// const busSchema = new mongoose.Schema({
//   routeNumber: {
//     type: String,
//     required: true
//   },
//   currentStop: {
//     type: String,
//     required: true
//   },
//   nextStop: {
//     type: String,
//     required: true
//   },
//   currentLocation: {
//     type: locationSchema,
//     required: true
//   },
//   crowdLevel: {
//     type: String,
//     enum: ['low', 'medium', 'high'],
//     default: 'low'
//   },
//   conductorId: {
//     type: String,
//     required: true
//   },
//   passengerCount: {
//     type: Number,
//     default: 0,
//     min: 0
//   },
//   maxCapacity: {
//     type: Number,
//     default: 50
//   },
//   estimatedArrival: {
//     type: String,
//     default: '5 mins'
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Bus', busSchema);
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

