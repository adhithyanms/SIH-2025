// const express = require('express');
// const router = express.Router();
// const {
//   getAllBuses,
//   getBusesByRoute,
//   updateBusLocation,
//   updateCrowdLevel,
//   updatePassengerCount,
//   getConductorBus
// } = require('../controllers/busController');

// // Get all buses
// router.get('/', getAllBuses);

// // Get buses by route
// router.get('/route/:routeNumber', getBusesByRoute);

// // Get conductor's bus
// router.get('/conductor/:conductorId', getConductorBus);

// // Update bus location
// router.put('/:busId/location', updateBusLocation);

// // Update crowd level
// router.put('/:busId/crowd-level', updateCrowdLevel);

// // Update passenger count
// router.put('/:busId/passenger-count', updatePassengerCount);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllBuses,
  getBusesByRoute,
  updateBusLocation,
  updateCrowdLevel,
  updatePassengerCount,
  getConductorBus,
  getBusesByStop // ✅ new import
} = require('../controllers/busController');

// Get all buses
router.get('/', getAllBuses);

// Get buses by route
router.get('/route/:routeNumber', getBusesByRoute);

// Get conductor's bus
router.get('/conductor/:conductorId', getConductorBus);

// ✅ New route to get buses by stop
router.get('/stop/:stopName', getBusesByStop);

// Update bus location
router.put('/:busId/location', updateBusLocation);

// Update crowd level
router.put('/:busId/crowd-level', updateCrowdLevel);

// Update passenger count
router.put('/:busId/passenger-count', updatePassengerCount);

module.exports = router;