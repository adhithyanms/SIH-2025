const express = require("express");
const router = express.Router();
const {
  getAccessUsers,
  createAccess,
  updateAccess,
  deleteAccess,
} = require("../controllers/accessController");

// Get all users
router.get("/", getAccessUsers);

// Create user
router.post("/", createAccess);

// Update user
router.put("/:id", updateAccess);

// Delete user
router.delete("/:id", deleteAccess);

module.exports = router;
