const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  verifyUser,
  toggleUserStatus,
} = require("../controllers/userController");

// Get all users
router.get("/", getAllUsers);

// Verify user
router.put("/:userId/verify", verifyUser);

// Suspend/Activate user
router.put("/:userId/status", toggleUserStatus);

module.exports = router;
