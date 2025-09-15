const mongoose = require("mongoose");

const accessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    conductorId: { type: String },
    role: { type: String, enum: ["Admin", "Conductor"], required: true },
    assignedRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Access", accessSchema);
