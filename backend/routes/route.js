const express = require('express');
const router = express.Router();
const {
  getAllRoutes,
  getRouteByNumber,
  createRoute,
  updateRoute,
  deleteRoute
} = require('../controllers/routeController');

// Get all routes
router.get('/', getAllRoutes);

// Get route by number
router.get('/:routeNumber', getRouteByNumber);

// Create new route
router.post('/', createRoute);

// Update route
router.put('/:routeId', updateRoute);

// Delete route
router.delete('/:routeId', deleteRoute);

module.exports = router;
