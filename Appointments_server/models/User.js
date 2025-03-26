
const mongoose = require('mongoose'); // Importing Mongoose for creating MongoDB schemas and models
const bcrypt = require('bcryptjs'); // Importing bcryptjs for hashing passwords


// Defining the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,   // Email is stored as a string
    required: true,   // Email is required (cannot be empty)
    unique: true,    // Ensures email is unique in the database
    lowercase: true,   // Converts email to lowercase before storing
    trim: true,    // Removes leading and trailing spaces
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']  // Regular expression to validate email format
  },
  phone: {
    type: String,  // Phone number is stored as a string
    trim: true,   // Removes leading and trailing spaces
    match: [/^\+?[1-9]\d{1,14}$/, 'Please fill a valid phone number']  // Regular expression for international phone
  },
  password: {
    type: String,  // password is stored as a string
    required: true,  // Password is requred
    minlength: 6  // Password must be at least 6 characters long
  },
  created_Account: {
    type: Date,  // Stores the date when the user was created
    default: Date.now  // Automatically sets the current date/ time as default
  },
  verified: {
    type: Boolean,  // Stores whether the user's email is verified
    default: false // By default, the user is not verified
  }
});

// Middleware to Hash password before saving it to the database
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();  // If password is not modified, skip hashing
  
  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    this.password = await bcrypt.hash(this.password, salt); // Hash the password with the salt
    next(); // Proceed to the next middleware
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

// Method to compare entered passwords with stored hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);  // Compare provided password with stored hash
};

 // Exporting the User model based on the schema
module.exports = mongoose.model('User', userSchema);