const express = require('express');
const router = express.Router();
const {
  createAlert,
  getAllAlerts,
  getAlertsByBus,
  resolveAlert
} = require('../controllers/alertController');

// Create alert
router.post('/', createAlert);

// Get all alerts
router.get('/', getAllAlerts);

// Get alerts by bus
router.get('/bus/:busId', getAlertsByBus);

// Resolve alert
router.put('/:alertId/resolve', resolveAlert);

module.exports = router;
