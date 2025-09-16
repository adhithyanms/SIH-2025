
// const Bus = require('../models/Bus');
// const Route = require('../models/Route');

// // helper function to format bus for frontend
// const formatBus = (bus) => ({
//   id: bus._id.toString(),
//   routeNumber: bus.routeNumber,
//   conductorId: bus.conductorId,
//   currentStop: bus.currentStop,
//   nextStop: bus.nextStop,
//   currentLocation: {
//     lat: bus.currentLocation?.lat || 0,
//     lng: bus.currentLocation?.lng || 0,
//   },
//   crowdLevel: bus.crowdLevel,
//   passengerCount: bus.passengerCount,
//   maxCapacity: bus.maxCapacity || 50,         // ✅ added default
//   estimatedArrival: bus.estimatedArrival || '5 mins', // ✅ placeholder
//   isActive: bus.isActive,
// });

// // Get all buses
// exports.getAllBuses = async (req, res) => {
//   try {
//     let buses = await Bus.find({ isActive: true });

//     // If no buses exist, seed from routes
//     if (buses.length === 0) {
//       const routes = await Route.find({ isActive: true });

//       buses = routes.map((route, index) => ({
//         routeNumber: route.routeNumber,
//         conductorId: `C${100 + index}`,
//         currentStop: route.stops[0]?.name || '',
//         nextStop: route.stops[1]?.name || '',
//         currentLocation: route.stops[0]?.location || { lat: 0, lng: 0 },
//         crowdLevel: 'low',
//         passengerCount: 0,
//         isActive: route.isActive,
//       }));

//       await Bus.insertMany(buses);
//       buses = await Bus.find({ isActive: true }); // re-fetch after insert
//     }

//     res.json({ buses: buses.map(formatBus) });
//   } catch (err) {
//     console.error('Get buses error:', err);
//     res.status(500).json({ message: 'Server Error', error: err.message });
//   }
// };

// // Get buses by route
// exports.getBusesByRoute = async (req, res) => {
//   try {
//     const { routeNumber } = req.params;
//     const buses = await Bus.find({ routeNumber, isActive: true });
//     res.json({ buses: buses.map(formatBus) });
//   } catch (error) {
//     console.error('Get buses by route error:', error);
//     res.status(500).json({ error: 'Failed to fetch buses' });
//   }
// };

// // Update bus location
// exports.updateBusLocation = async (req, res) => {
//   try {
//     const { busId } = req.params;
//     const { lat, lng } = req.body;

//     const bus = await Bus.findByIdAndUpdate(
//       busId,
//       { currentLocation: { lat, lng }, updatedAt: new Date() },
//       { new: true }
//     );

//     if (!bus) return res.status(404).json({ error: 'Bus not found' });

//     res.json({ message: 'Location updated successfully', bus: formatBus(bus) });
//   } catch (error) {
//     console.error('Update bus location error:', error);
//     res.status(500).json({ error: 'Failed to update bus location' });
//   }
// };

// // Update crowd level
// exports.updateCrowdLevel = async (req, res) => {
//   try {
//     const { busId } = req.params;
//     const { crowdLevel } = req.body;

//     if (!['low', 'medium', 'high'].includes(crowdLevel)) {
//       return res.status(400).json({ error: 'Invalid crowd level' });
//     }

//     const bus = await Bus.findByIdAndUpdate(busId, { crowdLevel }, { new: true });
//     if (!bus) return res.status(404).json({ error: 'Bus not found' });

//     res.json({ message: 'Crowd level updated successfully', bus: formatBus(bus) });
//   } catch (error) {
//     console.error('Update crowd level error:', error);
//     res.status(500).json({ error: 'Failed to update crowd level' });
//   }
// };

// // Update passenger count
// exports.updatePassengerCount = async (req, res) => {
//   try {
//     const { busId } = req.params;
//     const { passengerCount } = req.body;

//     if (passengerCount < 0) {
//       return res.status(400).json({ error: 'Passenger count cannot be negative' });
//     }

//     const bus = await Bus.findByIdAndUpdate(busId, { passengerCount }, { new: true });
//     if (!bus) return res.status(404).json({ error: 'Bus not found' });

//     res.json({ message: 'Passenger count updated successfully', bus: formatBus(bus) });
//   } catch (error) {
//     console.error('Update passenger count error:', error);
//     res.status(500).json({ error: 'Failed to update passenger count' });
//   }
// };

// // Get conductor's bus
// exports.getConductorBus = async (req, res) => {
//   try {
//     const { conductorId } = req.params;
//     const bus = await Bus.findOne({ conductorId, isActive: true });
//     if (!bus) return res.status(404).json({ error: 'No active bus found for this conductor' });

//     res.json({ bus: formatBus(bus) });
//   } catch (error) {
//     console.error('Get conductor bus error:', error);
//     res.status(500).json({ error: 'Failed to fetch conductor bus' });
//   }
// };

const Bus = require('../models/Bus');
const Route = require('../models/Route');

// helper function to format bus for frontend
const formatBus = (bus, route) => ({
  id: bus._id.toString(),
  routeNumber: bus.routeNumber,
  routeName: route ? route.routeName : 'Unknown Route',
  currentStop: bus.currentStop,
  nextStop: bus.nextStop,
  currentLocation: {
    lat: bus.currentLocation?.lat || 0,
    lng: bus.currentLocation?.lng || 0,
  },
  crowdLevel: bus.crowdLevel,
  passengerCount: bus.passengerCount,
  maxCapacity: bus.maxCapacity || 50,
  estimatedArrival: bus.estimatedArrival || '5 mins',
  isActive: bus.isActive,
});

// Get all buses
exports.getAllBuses = async (req, res) => {
  try {
    let buses = await Bus.find({ isActive: true });

    if (buses.length === 0) {
      const routes = await Route.find({ isActive: true });

      buses = routes.map((route, index) => ({
        routeNumber: route.routeNumber,
        conductorId: `C${100 + index}`,
        currentStop: route.stops[0]?.name || '',
        nextStop: route.stops[1]?.name || '',
        currentLocation: route.stops[0]?.location || { lat: 0, lng: 0 },
        crowdLevel: 'low',
        passengerCount: 0,
        isActive: route.isActive,
      }));

      await Bus.insertMany(buses);
      buses = await Bus.find({ isActive: true });
    }

    const routes = await Route.find({ isActive: true });
    const routeMap = {};
    routes.forEach(route => {
      routeMap[route.routeNumber] = route;
    });

    res.json({ buses: buses.map(bus => formatBus(bus, routeMap[bus.routeNumber])) });
  } catch (err) {
    console.error('Get buses error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get buses by route
exports.getBusesByRoute = async (req, res) => {
  try {
    const { routeNumber } = req.params;
    const buses = await Bus.find({ routeNumber, isActive: true });
    const route = await Route.findOne({ routeNumber, isActive: true });
    res.json({ buses: buses.map(bus => formatBus(bus, route)) });
  } catch (error) {
    console.error('Get buses by route error:', error);
    res.status(500).json({ error: 'Failed to fetch buses' });
  }
};

// Get conductor's bus
exports.getConductorBus = async (req, res) => {
  try {
    const { conductorId } = req.params;
    const bus = await Bus.findOne({ conductorId, isActive: true });
    if (!bus) return res.status(404).json({ error: 'No active bus found for this conductor' });

    const route = await Route.findOne({ routeNumber: bus.routeNumber, isActive: true });
    res.json({ bus: formatBus(bus, route) });
  } catch (error) {
    console.error('Get conductor bus error:', error);
    res.status(500).json({ error: 'Failed to fetch conductor bus' });
  }
};

// Update bus location
exports.updateBusLocation = async (req, res) => {
  try {
    const { busId } = req.params;
    const { lat, lng } = req.body;

    const bus = await Bus.findByIdAndUpdate(
      busId,
      { currentLocation: { lat, lng }, updatedAt: new Date() },
      { new: true }
    );

    if (!bus) return res.status(404).json({ error: 'Bus not found' });

    const route = await Route.findOne({ routeNumber: bus.routeNumber, isActive: true });
    res.json({ message: 'Location updated successfully', bus: formatBus(bus, route) });
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

    const bus = await Bus.findByIdAndUpdate(busId, { crowdLevel }, { new: true });
    if (!bus) return res.status(404).json({ error: 'Bus not found' });

    const route = await Route.findOne({ routeNumber: bus.routeNumber, isActive: true });
    res.json({ message: 'Crowd level updated successfully', bus: formatBus(bus, route) });
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

    const bus = await Bus.findByIdAndUpdate(busId, { passengerCount }, { new: true });
    if (!bus) return res.status(404).json({ error: 'Bus not found' });

    const route = await Route.findOne({ routeNumber: bus.routeNumber, isActive: true });
    res.json({ message: 'Passenger count updated successfully', bus: formatBus(bus, route) });
  } catch (error) {
    console.error('Update passenger count error:', error);
    res.status(500).json({ error: 'Failed to update passenger count' });
  }
};

// ✅ New Feature: Get Buses by Stop
exports.getBusesByStop = async (req, res) => {
  try {
    const { stopName } = req.params;

    const buses = await Bus.find({
      isActive: true,
      $or: [
        { currentStop: stopName },
        { nextStop: stopName }
      ]
    });

    const routes = await Route.find({ isActive: true });
    const routeMap = {};
    routes.forEach(route => {
      routeMap[route.routeNumber] = route;
    });

    const result = buses.map(bus => formatBus(bus, routeMap[bus.routeNumber]));

    res.json({ stopName, buses: result });
  } catch (error) {
    console.error('Get buses by stop error:', error);
    res.status(500).json({ error: 'Failed to fetch buses by stop' });
  }
};