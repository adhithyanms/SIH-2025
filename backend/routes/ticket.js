const express = require('express');
const router = express.Router();
const {
  generateTicket,
  getTicketsByConductor,
  verifyTicket
} = require('../controllers/ticketController');

// Generate ticket
router.post('/generate', generateTicket);

// Get tickets by conductor
router.get('/conductor/:conductorId', getTicketsByConductor);

// Verify ticket
router.get('/verify/:qrCode', verifyTicket);

module.exports = router;
