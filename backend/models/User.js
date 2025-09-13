const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/
  },
  role: {
    type: String,
    enum: ['conductor', 'passenger', 'admin'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  conductorId: {
    type: String,
    required: function() {
      return this.role === 'conductor';
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
