const Access = require("../models/Access");

// Get all access users
const getAccessUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (role) query.role = role;

    const users = await Access.find(query).populate("assignedBus", "routeNumber");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch access users" });
  }
};

// Create new access user
const createAccess = async (req, res) => {
  try {
    const { name, phoneNumber, conductorId, role, assignedBus } = req.body;

    if (role === "Conductor" && !assignedBus) {
      return res.status(400).json({ error: "Conductor must be assigned to a bus" });
    }

    const exists = await Access.findOne({ phoneNumber });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const newUser = await Access.create({
      name,
      phoneNumber,
      conductorId,
      role,
      assignedBus: role === "Conductor" ? assignedBus : null,
    });

    const populated = await newUser.populate("assignedBus", "routeNumber");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: "Failed to create access user" });
  }
};

// Update access user
const updateAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, assignedBus } = req.body;

    if (role === "Conductor" && !assignedBus) {
      return res.status(400).json({ error: "Conductor must be assigned to a bus" });
    }

    const updated = await Access.findByIdAndUpdate(
      id,
      {
        ...req.body,
        assignedBus: role === "Conductor" ? assignedBus : null,
      },
      { new: true }
    ).populate("assignedBus", "routeNumber");

    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (error) {
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
    res.status(500).json({ error: "Failed to delete access user" });
  }
};

module.exports = {
  getAccessUsers,
  createAccess,
  updateAccess,
  deleteAccess,
};
