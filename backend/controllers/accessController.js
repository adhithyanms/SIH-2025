const Access = require("../models/access");
const Route = require("../models/Route");
const mongoose = require("mongoose");

// Get all access users
const getAccessUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (role) query.role = role;

    const users = await Access.find(query).populate("assignedRoute", "routeNumber");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch access users" });
  }
};

// Create new access user
const createAccess = async (req, res) => {
  try {
    const { name, phoneNumber, conductorId, role, assignedRoute } = req.body;

    // Validate required fields
    if (!name || !phoneNumber || !role) {
      return res.status(400).json({ error: "Name, phone and role are required" });
    }

    if (role === "Conductor") {
      // Normalize assigned route: accept string id or object { _id }
      const normalizedAssignedRouteId = assignedRoute && typeof assignedRoute === "object" ? assignedRoute._id : assignedRoute;

      if (!normalizedAssignedRouteId) {
        return res.status(400).json({ error: "Conductor must be assigned to a route" });
      }

      // Check if assignedRoute is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(normalizedAssignedRouteId)) {
        return res.status(400).json({ error: "Invalid route selected" });
      }

      // Check if route exists
      const routeExists = await Route.findById(normalizedAssignedRouteId);
      if (!routeExists) {
        return res.status(404).json({ error: "Assigned route does not exist" });
      }

      // Create user with normalized route id
      const exists = await Access.findOne({ phoneNumber });
      if (exists) return res.status(400).json({ error: "User already exists" });

      const newUser = await Access.create({
        name,
        phoneNumber,
        conductorId: conductorId || null,
        role,
        assignedRoute: new mongoose.Types.ObjectId(normalizedAssignedRouteId),
      });

      const populated = await newUser.populate("assignedRoute", "routeNumber");
      return res.status(201).json(populated);
    }

    // Role is Admin
    const exists = await Access.findOne({ phoneNumber });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const newUser = await Access.create({
      name,
      phoneNumber,
      conductorId: conductorId || null,
      role,
      assignedRoute: null,
    });

    const populated = await newUser.populate("assignedRoute", "routeNumber");
    res.status(201).json(populated);
  } catch (error) {
    if (error && error.code === 11000 && error.keyPattern && error.keyPattern.phoneNumber) {
      return res.status(400).json({ error: "Phone number already exists" });
    }
    console.error("Create access error:", error);
    res.status(500).json({ error: "Failed to create access user" });
  }
};

// Update access user
const updateAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, assignedRoute } = req.body;

    // Determine effective role (use existing if not provided)
    const existing = await Access.findById(id);
    if (!existing) return res.status(404).json({ error: "User not found" });
    const effectiveRole = role ?? existing.role;

    // Validate conductor route
    let normalizedAssignedRouteId = null;
    if (effectiveRole === "Conductor") {
      const raw = assignedRoute ?? existing.assignedRoute;
      normalizedAssignedRouteId = raw && typeof raw === "object" ? raw._id?.toString?.() : raw;
      if (!normalizedAssignedRouteId) {
        return res.status(400).json({ error: "Conductor must be assigned to a route" });
      }
      if (!mongoose.Types.ObjectId.isValid(normalizedAssignedRouteId)) {
        return res.status(400).json({ error: "Invalid route selected" });
      }
      const routeExists = await Route.findById(normalizedAssignedRouteId);
      if (!routeExists) return res.status(404).json({ error: "Assigned route does not exist" });
    }

    const updated = await Access.findByIdAndUpdate(
      id,
      {
        ...req.body,
        role: effectiveRole,
        assignedRoute:
          effectiveRole === "Conductor" && normalizedAssignedRouteId
            ? new mongoose.Types.ObjectId(normalizedAssignedRouteId)
            : null,
      },
      { new: true }
    ).populate("assignedRoute", "routeNumber");

    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (error) {
    if (error && error.code === 11000 && error.keyPattern && error.keyPattern.phoneNumber) {
      return res.status(400).json({ error: "Phone number already exists" });
    }
    console.error("Update access error:", error);
    res.status(500).json({ error: "Failed to update access user" });
  }
};

// Delete access user
const deleteAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Access.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Access user deleted" });
  } catch (error) {
    console.error("Delete access error:", error);
    res.status(500).json({ error: "Failed to delete access user" });
  }
};

module.exports = {
  getAccessUsers,
  createAccess,
  updateAccess,
  deleteAccess,
};
