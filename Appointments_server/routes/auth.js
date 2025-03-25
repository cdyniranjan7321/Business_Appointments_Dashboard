const express = require('express');  // Importing Express framework
const router = express.Router();   // Creating an Express router instance
const User = require('../models/User');   // Importing the user model to interact with the database
const { check, validationResult } = require('express-validator');  // Importing express-validator for input validation

// @route   POST api/auth/signup
// @desc    Register a user
// @access  Public
router.post('/signup', [
  check('emailOrPhone', 'Please include a valid email or phone').isLength({ min: 5 }), // Validating email or phone input (minimum length of 5 characters)
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }) //  Validating password (must be at least 6 characters long)
], async (req, res) => {
   // Checking for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Returning validation errors if any
  }

  const { emailOrPhone, password } = req.body;  // Extracting email/phone and password from request body

  try {
    // Determine if the input is an email (contains '@') or a phone number
    const isEmail = emailOrPhone.includes('@');
    
    let user;
    if (isEmail) {
      // Checking if a user already exists with the given email
      user = await User.findOne({ email: emailOrPhone.toLowerCase().trim() });
    } else {
      //  Checking if a user already exists with the given phone number
      user = await User.findOne({ phone: emailOrPhone.trim() });
    }

    if (user) {
      return res.status(400).json({ 
        errors: [{ msg: 'User already exists with this email or phone Please signin! ' }]  // Error response if user exixts
      });
    }

    // Creating a new user instance with email/phone and password
    const newUser = new User({
      [isEmail ? 'email' : 'phone']: emailOrPhone.toLowerCase().trim(),  // Assigning to correct field dynamically
      password  //  Password will be hashed in the User model before saving
    });

    await newUser.save();  // Saving the new user in the datebase

    // In a real-world app, you would send a verification email here

    res.status(201).json({ 
      message: 'User registered successfully. Please verify your email.',
      userId: newUser._id   // Sending the newly created user ID as a response
    });

  } catch (err) {
    console.error(err.message);  // Logging error for debugging
    res.status(500).send('Server error'); // Sending a generic server error response
  }
});

module.exports = router;   // Exporting the router to be used in other parts of the application