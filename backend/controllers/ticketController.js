const Ticket = require('../models/Ticket');
const Route = require('../models/Route');
const crypto = require('crypto');

// Generate QR code
const generateQRCode = () => {
  return `TICKET-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
};

// Calculate fare based on stops
const calculateFare = (fromStop, toStop, stops) => {
  const fromIndex = stops.findIndex(stop => stop.name === fromStop);
  const toIndex = stops.findIndex(stop => stop.name === toStop);
  
  if (fromIndex === -1 || toIndex === -1) {
    throw new Error('Invalid stop names');
  }
  
  const distance = Math.abs(toIndex - fromIndex);
  return Math.max(10, distance * 5); // Base fare per passenger
};

// Generate ticket
exports.generateTicket = async (req, res) => {
  try {
    const { routeNumber, fromStop, toStop, passengerCount, conductorId } = req.body;

    // Get route details
    const route = await Route.findOne({ routeNumber, isActive: true });
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    // Calculate fare
    const farePerPassenger = calculateFare(fromStop, toStop, route.stops);
    const totalFare = farePerPassenger * passengerCount;

    // Generate ticket
    const ticket = new Ticket({
      routeNumber,
      fromStop,
      toStop,
      fare: totalFare,
      passengerCount,
      qrCode: generateQRCode(),
      conductorId
    });

    await ticket.save();

    res.status(201).json({ 
      message: 'Ticket generated successfully', 
      ticket: {
        id: ticket._id,
        routeNumber: ticket.routeNumber,
        fromStop: ticket.fromStop,
        toStop: ticket.toStop,
        fare: ticket.fare,
        passengerCount: ticket.passengerCount,
        qrCode: ticket.qrCode,
        timestamp: ticket.createdAt
      }
    });
  } catch (error) {
    console.error('Generate ticket error:', error);
    res.status(500).json({ error: 'Failed to generate ticket' });
  }
};

// Get tickets by conductor
exports.getTicketsByConductor = async (req, res) => {
  try {
    const { conductorId } = req.params;
    const { startDate, endDate } = req.query;

    let query = { conductorId };
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    res.json({ tickets });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

// Verify ticket
exports.verifyTicket = async (req, res) => {
  try {
    const { qrCode } = req.params;
    
    const ticket = await Ticket.findOne({ qrCode });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.isUsed) {
      return res.status(400).json({ error: 'Ticket already used' });
    }

    // Mark ticket as used
    ticket.isUsed = true;
    await ticket.save();

    res.json({ 
      message: 'Ticket verified successfully',
      ticket: {
        id: ticket._id,
        routeNumber: ticket.routeNumber,
        fromStop: ticket.fromStop,
        toStop: ticket.toStop,
        fare: ticket.fare,
        passengerCount: ticket.passengerCount,
        timestamp: ticket.createdAt
      }
    });
  } catch (error) {
    console.error('Verify ticket error:', error);
    res.status(500).json({ error: 'Failed to verify ticket' });
  }
};

// Get ticket summary by destination stop for a conductor and route (today)
exports.getStopSummary = async (req, res) => {
  try {
    const { conductorId, routeNumber } = req.params;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const match = {
      conductorId,
      routeNumber,
      isUsed: false,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    };

    const aggregation = await Ticket.aggregate([
      { $match: match },
      { $group: { _id: "$toStop", count: { $sum: "$passengerCount" } } },
      { $project: { _id: 0, toStop: "$_id", count: 1 } },
      { $sort: { toStop: 1 } }
    ]);

    const total = aggregation.reduce((sum, item) => sum + item.count, 0);
    res.json({ total, byStop: aggregation });
  } catch (error) {
    console.error('Get stop summary error:', error);
    res.status(500).json({ error: 'Failed to fetch stop summary' });
  }
};

// Mark tickets to a stop as completed (used) for a conductor and route (today)
exports.completeStopTickets = async (req, res) => {
  try {
    const { conductorId, routeNumber, stopName } = req.body;
    if (!conductorId || !routeNumber || !stopName) {
      return res.status(400).json({ error: 'conductorId, routeNumber and stopName are required' });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Count affected first
    const toUpdate = await Ticket.find({
      conductorId,
      routeNumber,
      toStop: stopName,
      isUsed: false,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const impactedCount = toUpdate.reduce((sum, t) => sum + (t.passengerCount || 0), 0);

    const result = await Ticket.updateMany(
      {
        conductorId,
        routeNumber,
        toStop: stopName,
        isUsed: false,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      },
      { $set: { isUsed: true } }
    );

    res.json({ message: 'Stop tickets completed', modified: result.modifiedCount || 0, impactedCount });
  } catch (error) {
    console.error('Complete stop tickets error:', error);
    res.status(500).json({ error: 'Failed to complete stop tickets' });
  }
};