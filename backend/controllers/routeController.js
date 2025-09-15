// const Route = require('../models/Route');

// // Get all routes
// exports.getAllRoutes = async (req, res) => {
//   try {
//     const routes = await Route.find({ isActive: true });
//     res.json({ routes });
//   } catch (error) {
//     console.error('Get routes error:', error);
//     res.status(500).json({ error: 'Failed to fetch routes' });
//   }
// };

// // Get route by number
// exports.getRouteByNumber = async (req, res) => {
//   try {
//     const { routeNumber } = req.params;
//     const route = await Route.findOne({ routeNumber, isActive: true });
    
//     if (!route) {
//       return res.status(404).json({ error: 'Route not found' });
//     }

//     res.json({ route });
//   } catch (error) {
//     console.error('Get route error:', error);
//     res.status(500).json({ error: 'Failed to fetch route' });
//   }
// };

// // Create new route
// exports.createRoute = async (req, res) => {
//   try {
//     const { routeNumber, routeName, stops } = req.body;

//     // Check if route already exists
//     const existingRoute = await Route.findOne({ routeNumber });
//     if (existingRoute) {
//       return res.status(400).json({ error: 'Route already exists' });
//     }

//     const route = new Route({
//       routeNumber,
//       routeName,
//       stops
//     });
   
//     await route.save();
//     res.status(201).json({ message: 'Route created successfully', route });
//   } catch (error) {
//     console.error('Create route error:', error);
//     res.status(500).json({ error: 'Failed to create route' });
//   }
// };

// // Update route
// exports.updateRoute = async (req, res) => {
//   try {
//     const { routeId } = req.params;
//     const updates = req.body;

//     const route = await Route.findByIdAndUpdate(routeId, updates, { new: true });
    
//     if (!route) {
//       return res.status(404).json({ error: 'Route not found' });
//     }

//     res.json({ message: 'Route updated successfully', route });
//   } catch (error) {
//     console.error('Update route error:', error);
//     res.status(500).json({ error: 'Failed to update route' });
//   }
// };

// // Delete route
// exports.deleteRoute = async (req, res) => {
//   try {
//     const { routeId } = req.params;

//     const route = await Route.findByIdAndUpdate(
//       routeId,
//       { isActive: false },
//       { new: true }
//     );
    
//     if (!route) {
//       return res.status(404).json({ error: 'Route not found' });
//     }

//     res.json({ message: 'Route deactivated successfully' });
//   } catch (error) {
//     console.error('Delete route error:', error);
//     res.status(500).json({ error: 'Failed to delete route' });
//   }
// };
const Route = require('../models/Route');

// Get all routes
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find({ isActive: true });
    res.json({ routes });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
};

// Get route by number
exports.getRouteByNumber = async (req, res) => {
  try {
    const { routeNumber } = req.params;
    const route = await Route.findOne({ routeNumber, isActive: true });
    
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json({ route });
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({ error: 'Failed to fetch route' });
  }
};

// Create new route
exports.createRoute = async (req, res) => {
  try {
    const { routeNumber, from, to, stops } = req.body;

    // Check if route already exists
    const existingRoute = await Route.findOne({ routeNumber });
    if (existingRoute) {
      return res.status(400).json({ error: 'Route already exists' });
    }

    const route = new Route({
      routeNumber,
      from,
      to,
      stops
    });
   
    await route.save();
    res.status(201).json({ message: 'Route created successfully', route });
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({ error: 'Failed to create route' });
  }
};

// Update route
exports.updateRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const updates = req.body;

    const route = await Route.findByIdAndUpdate(routeId, updates, { new: true });
    
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json({ message: 'Route updated successfully', route });
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({ error: 'Failed to update route' });
  }
};

// Delete route
exports.deleteRoute = async (req, res) => {
  try {
    const { routeId } = req.params;

    const route = await Route.findByIdAndUpdate(
      routeId,
      { isActive: false },
      { new: true }
    );
    
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json({ message: 'Route deactivated successfully' });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({ error: 'Failed to delete route' });
  }
};
