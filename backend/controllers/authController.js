const User = require('../models/User');
const Access = require('../models/access');
const crypto = require('crypto');

// Generate OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Send OTP (simulated)
const sendOTP = async (phoneNumber, otp) => {
  // In a real application, this would integrate with SMS service
  console.log(`OTP for ${phoneNumber}: ${otp}`);
};

// Send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Validate phone number
    if (!phoneNumber || phoneNumber.length !== 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit phone number' });
    }

    // Determine effective role based on Access mapping
    // Access roles are capitalized ("Admin" | "Conductor")
    // User model expects lowercase ('admin' | 'conductor' | 'passenger')
    const accessEntry = await Access.findOne({ phoneNumber });
    const effectiveRole = accessEntry
      ? (accessEntry.role === 'Admin' ? 'admin' : 'conductor')
      : 'passenger';
    const effectiveName = accessEntry?.name || `${effectiveRole.charAt(0).toUpperCase()}${effectiveRole.slice(1)} User`;
    const effectiveConductorId = accessEntry && accessEntry.role === 'Conductor' ? accessEntry.conductorId : undefined;

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if user exists
    let user = await User.findOne({ phoneNumber });
    
    if (user) {
      // Update OTP
      user.otp = { code: otp, expiresAt };
      // Sync role/name/conductorId from Access mapping
      user.role = effectiveRole;
      user.name = effectiveName;
      if (effectiveRole === 'conductor') {
        user.conductorId = effectiveConductorId;
      } else {
        user.conductorId = undefined;
      }
      await user.save();
    } else {
      // Create new user
      user = new User({
        phoneNumber,
        role: effectiveRole,
        conductorId: effectiveRole === 'conductor' ? effectiveConductorId : undefined,
        name: effectiveName,
        otp: { code: otp, expiresAt }
      });
      await user.save();
    }

    // Send OTP (simulated)
    await sendOTP(phoneNumber, otp);

    res.json({ 
      message: 'OTP sent successfully',
      // For demo purposes, return OTP in development
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if OTP exists and is valid
    if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
      return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
    }

    // Check if OTP is expired
    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
    }

    // Verify OTP
    if (user.otp.code !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Update user as verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    // Return user data (excluding sensitive information)
    // Also include assignedRouteNumber for conductors if present in Access mapping
    const accessEntry = await (await require('../models/access').findOne({ phoneNumber })).populate('assignedRoute', 'routeNumber');
    const userData = {
      id: user._id,
      phoneNumber: user.phoneNumber,
      role: user.role,
      name: user.name,
      conductorId: user.conductorId,
      isVerified: user.isVerified,
      assignedRouteNumber: accessEntry?.assignedRoute?.routeNumber || undefined
    };

    res.json({ 
      message: 'OTP verified successfully',
      user: userData
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = {
      id: user._id,
      phoneNumber: user.phoneNumber,
      role: user.role,
      name: user.name,
      conductorId: user.conductorId,
      isVerified: user.isVerified
    };

    res.json({ user: userData });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};
