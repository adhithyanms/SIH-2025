const express = require('express');
const router = express.Router();
const {
  generateTicket,
  getTicketsByConductor,
  verifyTicket,
  getStopSummary,
  completeStopTickets
} = require('../controllers/ticketController');

// Generate ticket
router.post('/generate', generateTicket);

// Get tickets by conductor
router.get('/conductor/:conductorId', getTicketsByConductor);

// Verify ticket
router.get('/verify/:qrCode', verifyTicket);

// Get per-stop summary for today
router.get('/summary/:conductorId/:routeNumber', getStopSummary);

// Complete tickets when crossing a stop
router.post('/complete-stop', completeStopTickets);

module.exports = router;
