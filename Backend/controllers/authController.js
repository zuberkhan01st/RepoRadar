const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // ✅ Proper import

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("User already exists");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).send({message: "Signup Successfull", user, token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("Something went wrong");
  }
};

// Login an existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send("Please provide email and password");

    const user = await User.findOne({ email });

    if (!user) return res.status(400).send("No user found with this email");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid password");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Remove password before sending user
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).send({
      message: "Login successful",
      user: userWithoutPassword,
      token
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Something went wrong");
  }

};
