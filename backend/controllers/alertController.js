const Alert = require('../models/Alert');

// Create alert
exports.createAlert = async (req, res) => {
  try {
    const { busId, type, message, conductorId } = req.body;

    const alert = new Alert({
      busId,
      type,
      message,
      conductorId
    });

    await alert.save();

    res.status(201).json({ 
      message: 'Alert created successfully', 
      alert: {
        id: alert._id,
        busId: alert.busId,
        type: alert.type,
        message: alert.message,
        isResolved: alert.isResolved,
        timestamp: alert.createdAt
      }
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
};

// Get all alerts
exports.getAllAlerts = async (req, res) => {
  try {
    const { resolved } = req.query;
    
    let query = {};
    if (resolved !== undefined) {
      query.isResolved = resolved === 'true';
    }

    const alerts = await Alert.find(query).sort({ createdAt: -1 });
    res.json({ alerts });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

// Get alerts by bus
exports.getAlertsByBus = async (req, res) => {
  try {
    const { busId } = req.params;
    const alerts = await Alert.find({ busId }).sort({ createdAt: -1 });
    res.json({ alerts });
  } catch (error) {
    console.error('Get alerts by bus error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

// Resolve alert
exports.resolveAlert = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await Alert.findByIdAndUpdate(
      alertId,
      { isResolved: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({ message: 'Alert resolved successfully', alert });
  } catch (error) {
    console.error('Resolve alert error:', error);
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
};
