
const express = require('express');
const app = express();
const port = process.env.PORT || 6001;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// Middleware
app.use(cors()); // enable CORS for all routes
app.use(express.json());  //Parse JSON bodies in requests

// MongoDB Config
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@business-dashboard-clus.rhao9.mongodb.net/?retryWrites=true&w=majority&appName=Business-Dashboard-Cluster`;

// Create a MongoClient with a MongoClientOptions object
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,  // Use stable API version
    strict: true,                  // Enable strict mode
    deprecationErrors: true,        // Throw errors for deprecated features
  }
});

// Global variable to hold Database and Collection references
let usersCollection;

// ========== DATABASE CONNECTION ========== //
async function run() {
  try {
    // Connect the client to the server(Connect to MongoDB cluster)
    await client.connect();
    
    // Get references to database and collection
    const database = client.db("Business_Dashboard_DB"); // Replace with your database name
    usersCollection = database.collection("users");      // User collection
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);  // Exit process on connection failure
  }
}

// Start database connection and log any errors
run().catch(console.dir);

// POST /api/auth/signup - User Registration Endpoint
app.post('/api/auth/signup', [
  check('emailOrPhone', 'Please include a valid email or phone').isLength({ min: 5 }),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

   // Destructure request body
  const { emailOrPhone, password } = req.body;

  try {
    // Determine if input is email or phone
    const isEmail = emailOrPhone.includes('@');
    const field = isEmail ? 'email' : 'phone';
    const value = emailOrPhone.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ [field]: value });
    if (existingUser) {
      return res.status(400).json({ 
        errors: [{ msg: 'User already exists with this email or phone Please Sign in!' }] 
      });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user document
    const newUser = {
      [field]: value,               // Email or Phone feild
      password: hashedPassword,     // Hashed password
      createdAt: new Date(),        // Current timestamp
      verified: false               // Default verification status
    };

    // Insert new user into database
    const result = await usersCollection.insertOne(newUser);

    // Return success response
    res.status(201).json({ 
      message: 'User registered successfully. Please verify your email.',
      userId: result.insertedId        // Return MngoDB-generated ID
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/auth/user/:id - Get User by ID
app.get('/api/auth/user/:id', async (req, res) => {
  try {
    // Find user by ID, excluding password field
    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.params.id) },             // Convert string ID to ObjectId
      { projection: { password: 0 } }                  // Exclude password from results
    );
    
    // Handle user not found
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Return user data
    res.json(user);
  } catch (err) {
    console.error(err.message);
    // Hnadle invalid ObjectId format
    if (err.message.includes('hex string')) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

// PUT /api/auth/user/:id - Update User
app.put('/api/auth/user/:id', [
  // Optional email validation
  check('email', 'Please include a valid email').optional().isEmail(),
  check('phone', 'Please include a valid phone number').optional().isMobilePhone()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Destructure request body
  const { email, phone, password } = req.body;
  const updateFields = {};      // Object to hold fields to update
  
  // Add fields to update if provided
  if (email) updateFields.email = email.toLowerCase().trim();
  if (phone) updateFields.phone = phone.trim();
  
  try {
    // If updating password, hash it first
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Check for duplicate email/phone (excluding current user)
    if (email) {
      const existingUser = await usersCollection.findOne({ 
        email: email.toLowerCase().trim(),
        _id: { $ne: new ObjectId(req.params.id) }   //$ne = not equal
      });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
    }

     // Check for duplicate phone (excluding current user)
    if (phone) {
      const existingUser = await usersCollection.findOne({ 
        phone: phone.trim(),
        _id: { $ne: new ObjectId(req.params.id) }
      });
      if (existingUser) {
        return res.status(400).json({ msg: 'Phone number already in use' });
      }
    }

     // Perform update operation
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(req.params.id) },        // Filter by ID
      { $set: updateFields }                      // Update specified fields
    );

    // Handle user not found
    if (result.matchedCount === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get updated user (excluding password)
    const updatedUser = await usersCollection.findOne(
      { _id: new ObjectId(req.params.id) },
      { projection: { password: 0 } }
    );

     // Return updated user data
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/auth/user/:id - Delete User
app.delete('/api/auth/user/:id', async (req, res) => {
  try {
    // Delete user by ID
    const result = await usersCollection.deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    // Handle user not found
    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

     // Return success message
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    // Handle invalid ObjectId format
    if (err.message.includes('hex string')) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

  // Login endpoint
app.post('/api/auth/login', [
  check('emailOrPhone').isLength({ min: 5 }),
  check('password').isLength({ min: 6 })
], async (req, res) => {
  console.log('\n📥 Login Request:', req.body);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { emailOrPhone, password } = req.body;
    const isEmail = emailOrPhone.includes('@');
    const field = isEmail ? 'email' : 'phone';
    const value = emailOrPhone.toLowerCase().trim();

    // Find user
    const user = await usersCollection.findOne({ [field]: value });
    if (!user) {
      return res.status(401).json({ error: 'Invalid Email or Phone' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid Password' });
    }

    console.log('✅ Login successful for:', user._id);
    res.json({ 
      success: true,
      userId: user._id,
      isVerified: user.verified 
    });

  } catch (error) {
    console.error('🔥 Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Business Registration Endpoint
app.post('/api/business/signup', [
  check('businessName', 'Business name is required').not().isEmpty(),
  check('panNumber', 'PAN number is required').not().isEmpty(),
  check('contactNumber', 'Valid contact number is required').isLength({ min: 10, max: 10 }),
  check('FullName', 'Full name is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db("Business_Dashboard_DB");
    const businessesCollection = database.collection("businesses");

    // Check if business already exists with this PAN or contact number
    const existingBusiness = await businessesCollection.findOne({
      $or: [
        { panNumber: req.body.panNumber },
        { contactNumber: req.body.contactNumber }
      ]
    });

    if (existingBusiness) {
      return res.status(400).json({ 
        error: 'Business with this PAN or contact number already exists' 
      });
    }

    // Create new business document
    const newBusiness = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    };

    // Insert into database
    const result = await businessesCollection.insertOne(newBusiness);

    res.status(201).json({
      success: true,
      message: 'Business registered successfully',
      businessId: result.insertedId
    });

  } catch (err) {
    console.error('Business registration error:', err);
    res.status(500).json({ 
      error: 'Internal server error. Please try again later.' 
    });
  }
});


// Basic route
app.get('/', (req, res) => {
  res.send('Hello Developer!----my name is NIRANJAN CHAUDHARY.');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});