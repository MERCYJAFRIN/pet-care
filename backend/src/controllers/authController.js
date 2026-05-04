const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: req.body.role || 'user',
      certificateNumber: req.body.role === 'doctor' ? req.body.certificateNumber : null,
      verificationCode: req.body.role === 'doctor' ? Math.floor(100000 + Math.random() * 900000).toString() : null,
      isVerified: req.body.role === 'user', // Default to verified for users
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Notify all verified doctors about new client
    if (user.role === 'user') {
      try {
        const { Notification } = require('../models');
        const doctors = await User.findAll({ where: { role: 'doctor', isVerified: true } });
        for (const doctor of doctors) {
          await Notification.create({
            userId: doctor.id,
            notificationType: 'info',
            title: 'New Client Registered',
            message: `${user.firstName} ${user.lastName} has joined Pet Care.`,
            status: 'unread'
          });
        }
      } catch (err) {
        console.error('Error notifying doctors of new client:', err);
        // Don't fail registration if notification fails
      }
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

exports.verifyDoctor = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ where: { email, role: 'doctor' } });
    if (!user) {
      return res.status(404).json({ message: 'Doctor account not found' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    await user.update({
      isVerified: true,
      verificationCode: null, // Clear code after verification
    });

    res.json({
      message: 'Professional account verified successfully',
      isVerified: true,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying account', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, city, state, zipCode } = req.body;

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user profile
    await user.update({
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zipCode,
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};
