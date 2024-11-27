const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {getUserByNik, createUser} = require('../models/userModel.js');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; 

// Register User
exports.register = async (req, res) => {
  const { nik, name, email, password, position } = req.body;

  if (!nik || !name || !email || !password || !position) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser(nik, name, email, hashedPassword, position);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'An error occurred while registering the user' });
  }
};

// Login User
exports.login = async (req, res) => {
  const { nik, password } = req.body;

  if (!nik || !password) {
    return res.status(400).json({ message: 'NIK and Password are required' });
  }

  try {
    const user = await getUserByNik(nik);

    if (!user) {
      return res.status(400).json({ message: 'Invalid NIK or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid NIK or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, nik: user.nik }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};
