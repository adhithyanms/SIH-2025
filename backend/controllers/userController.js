const User = require("../models/User");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Verify a user
exports.verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User verified", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to verify user" });
  }
};

// Suspend/Activate user
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: "User status updated", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
};
