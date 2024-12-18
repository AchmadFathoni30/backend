const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByNik, createUser } = require('../models/userModel.js');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register User
exports.register = async (req, res) => {
  const { nik, name, email, password, position } = req.body;

  // Validate input
  if (!nik || !name || !email || !password || !position) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await getUserByNik(nik);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this NIK already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    await createUser(nik, name, email, hashedPassword, position);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'An error occurred while registering the user', error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  const { nik, password } = req.body;

  // Validate input
  if (!nik || !password) {
    return res.status(400).json({ message: 'NIK and Password are required' });
  }

  try {
    // Check if user exists
    const user = await getUserByNik(nik);
    if (!user) {
      return res.status(401).json({ message: 'Invalid NIK or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid NIK or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, nik: user.nik },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'An error occurred during login', error: error.message });
  }
};
