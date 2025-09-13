const Bus = require('../models/Bus');
const Route = require('../models/Route');

// Get all buses
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find({ isActive: true });
    res.json({ buses });
  } catch (error) {
    console.error('Get buses error:', error);
    res.status(500).json({ error: 'Failed to fetch buses' });
  }
};

// Get buses by route
exports.getBusesByRoute = async (req, res) => {
  try {
    const { routeNumber } = req.params;
    const buses = await Bus.find({ routeNumber, isActive: true });
    res.json({ buses });
  } catch (error) {
    console.error('Get buses by route error:', error);
    res.status(500).json({ error: 'Failed to fetch buses' });
  }
};

// Update bus location
exports.updateBusLocation = async (req, res) => {
  try {
    const { busId } = req.params;
    const { lat, lng } = req.body;

    const bus = await Bus.findByIdAndUpdate(
      busId,
      { 
        currentLocation: { lat, lng },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    res.json({ message: 'Location updated successfully', bus });
  } catch (error) {
    console.error('Update bus location error:', error);
    res.status(500).json({ error: 'Failed to update bus location' });
  }
};

// Update crowd level
exports.updateCrowdLevel = async (req, res) => {
  try {
    const { busId } = req.params;
    const { crowdLevel } = req.body;

    if (!['low', 'medium', 'high'].includes(crowdLevel)) {
      return res.status(400).json({ error: 'Invalid crowd level' });
    }

    const bus = await Bus.findByIdAndUpdate(
      busId,
      { crowdLevel },
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    res.json({ message: 'Crowd level updated successfully', bus });
  } catch (error) {
    console.error('Update crowd level error:', error);
    res.status(500).json({ error: 'Failed to update crowd level' });
  }
};

// Update passenger count
exports.updatePassengerCount = async (req, res) => {
  try {
    const { busId } = req.params;
    const { passengerCount } = req.body;

    if (passengerCount < 0) {
      return res.status(400).json({ error: 'Passenger count cannot be negative' });
    }

    const bus = await Bus.findByIdAndUpdate(
      busId,
      { passengerCount },
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    res.json({ message: 'Passenger count updated successfully', bus });
  } catch (error) {
    console.error('Update passenger count error:', error);
    res.status(500).json({ error: 'Failed to update passenger count' });
  }
};

// Get conductor's bus
exports.getConductorBus = async (req, res) => {
  try {
    const { conductorId } = req.params;
    const bus = await Bus.findOne({ conductorId, isActive: true });
    
    if (!bus) {
      return res.status(404).json({ error: 'No active bus found for this conductor' });
    }

    res.json({ bus });
  } catch (error) {
    console.error('Get conductor bus error:', error);
    res.status(500).json({ error: 'Failed to fetch conductor bus' });
  }
};
