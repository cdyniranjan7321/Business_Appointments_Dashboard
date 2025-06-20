const express = require('express');
const app = express();
const port = process.env.PORT || 6001;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// Middleware
// Configure CORS
const corsOptions = {
  origin: [
    'https://www.niranjanchaudhary.com.np', // Your custom domain
    'https://business-appointments-dashboard-f6e1.vercel.app', // Your Vercel default domain
    // Add any other domains that need to access your backend
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // If you're sending cookies/tokens
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions)) // enable CORS for all routes
//app.use(express.json());  //Parse JSON bodies in requests

// Increase payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

// Add services collection reference
let servicesCollection;

// Add orders collection reference
let ordersCollection;

// Add discounts collection reference
let discountsCollection;

// Create staff collection reference
let staffCollection;

// Add products collection reference
let productsCollection;

// Add bookings collection reference
let bookingsCollection;

// ========== DATABASE CONNECTION ========== //
async function run() {
  try {
    // Connect the client to the server(Connect to MongoDB cluster)
    await client.connect();
   
    // Get references to database and collection
    const database = client.db("Business_Dashboard_DB"); // Replace with your database name
    usersCollection = database.collection("users");      // User collection
    servicesCollection = database.collection("services");
    ordersCollection = database.collection("orders");    // Orders collection
    discountsCollection = database.collection("discounts");
    staffCollection = database.collection("staff");
    productsCollection = database.collection("products");
    bookingsCollection = database.collection("bookings");
   
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

// POST /api/services - Create new service
app.post('/api/services', [
  check('name', 'Service name is required').not().isEmpty(),
  check('price', 'Price must be a positive number').isFloat({ min: 0 }),
  check('category', 'Category is required').optional().not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Create new service document
    const newService = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      active: req.body.active || true
    };

    // Insert into database
    const result = await servicesCollection.insertOne(newService);

    // Return success response with the created service
    const createdService = await servicesCollection.findOne(
      { _id: result.insertedId },
      { projection: { _id: 0, id: '$_id' } } // Rename _id to id for frontend
    );

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service: createdService
    });

  } catch (err) {
    console.error('Service creation error:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

// GET /api/services - Get all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await servicesCollection.find({}).toArray();
   
    // Convert _id to id for frontend consistency
    const formattedServices = services.map(service => ({
      ...service,
      id: service._id
    }));

    res.json({
      success: true,
      services: formattedServices
    });
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

// PUT /api/services/:id - Update service
app.put('/api/services/:id', [
  check('name', 'Service name is required').optional().not().isEmpty(),
  check('price', 'Price must be a positive number').optional().isFloat({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updates = {
      ...req.body,
      updatedAt: new Date()
    };

    // Convert string ID to ObjectId
    const result = await servicesCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Return updated service
    const updatedService = await servicesCollection.findOne(
      { _id: new ObjectId(req.params.id) }
    );

    res.json({
      success: true,
      service: {
        ...updatedService,
        id: updatedService._id
      }
    });
   

  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

// DELETE /api/services/:id - Delete service
app.delete('/api/services/:id', async (req, res) => {
  try {
    const result = await servicesCollection.deleteOne(
      { _id: new ObjectId(req.params.id) }
    );

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });

   
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

// GET /api/orders - Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await ordersCollection.find({}).toArray();
   
    // Convert _id to id for frontend consistency
    const formattedOrders = orders.map(order => ({
      ...order,
      id: order._id.toString()
    }));

    res.json({
      success: true,
      orders: formattedOrders
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

// POST /api/orders - Create new order
app.post('/api/orders', [
  check('customer', 'Customer name is required').not().isEmpty(),
  check('items', 'At least one item is required').isArray({ min: 1 }),
  check('items.*.name', 'Item name is required').not().isEmpty(),
  check('items.*.quantity', 'Item quantity must be at least 1').isInt({ min: 1 }),
  check('items.*.price', 'Item price must be positive').isFloat({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    // Calculate total
    const total = req.body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Generate short ID (6 characters)
    const shortId = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create new order document
    const newOrder = {
      ...req.body,
      shortId, // Add the short ID
      total,
      date: new Date().toISOString().split('T')[0],
      paymentStatus: req.body.paymentStatus || 'Pending',
      fulfillmentStatus: 'Unfulfilled',
      deliveryStatus: 'Processing',
      labelStatus: 'Not Printed',
      returnStatus: 'None',
      tags: ['Manual'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into database
    const result = await ordersCollection.insertOne(newOrder);

    // Return success response with the created order
    const createdOrder = await ordersCollection.findOne(
      { _id: result.insertedId }
    );
   
    // Format the response with both MongoDB _id and our shortId
    const responseOrder = {
      ...createdOrder,
      id: createdOrder._id.toString(),
      shortId: createdOrder.shortId
    };

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: responseOrder
    });

  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

// PUT /api/orders/:id - Update order
app.put('/api/orders/:id', [
  check('customer', 'Customer name is required').optional().not().isEmpty(),
  check('items', 'At least one item is required').optional().isArray({ min: 1 }),
  check('items.*.name', 'Item name is required').optional().not().isEmpty(),
  check('items.*.quantity', 'Item quantity must be at least 1').optional().isInt({ min: 1 }),
  check('items.*.price', 'Item price must be positive').optional().isFloat({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Calculate total if items are being updated
    const updates = { ...req.body, updatedAt: new Date() };
    if (req.body.items) {
      updates.total = req.body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Try to find by shortId first, then fall back to _id
    let query;
    if (ObjectId.isValid(req.params.id)) {
      query = { _id: new ObjectId(req.params.id) };
    } else {
      query = { shortId: req.params.id };
    }

    const result = await ordersCollection.updateOne(
      query,
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Return updated order
    const updatedOrder = await ordersCollection.findOne(query);

    res.json({
      success: true,
      message: 'Order updated successfully',
      order: {
        ...updatedOrder,
        id: updatedOrder._id.toString(),
        shortId: updatedOrder.shortId
      }
    });

  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.'
    });
  }
});

// DELETE /api/orders/:id - Delete order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    // Try to find by shortId first, then fall back to _id
    let query;
    if (ObjectId.isValid(req.params.id)) {
      query = { _id: new ObjectId(req.params.id) };
    } else {
      query = { shortId: req.params.id };
    }

    const result = await ordersCollection.deleteOne(query);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * @api {get} /api/discounts Get all discounts
 * @apiName GetDiscounts
 * @apiGroup Discounts
 */
app.get('/api/discounts', async (req, res) => {
  try {
    const discounts = await discountsCollection.find({}).toArray();
   
    // Convert _id to id and format dates for frontend
    const formattedDiscounts = discounts.map(discount => ({
      ...discount,
      id: discount._id.toString(),
      startDate: formatDateForFrontend(discount.startDate),
      endDate: formatDateForFrontend(discount.endDate)
    }));

    res.json({
      success: true,
      discounts: formattedDiscounts
    });
  } catch (err) {
    console.error('Error fetching discounts:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

// Helper function to format dates
function formatDateForFrontend(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * @api {post} /api/discounts Create a new discount
 * @apiName CreateDiscount
 * @apiGroup Discounts
 *
 * @apiParam {String} code Discount code (required)
 * @apiParam {String="percentage","fixed"} type Discount type (required)
 * @apiParam {Number} value Discount value (required)
 * @apiParam {Number} [minOrder=0] Minimum order amount
 * @apiParam {String} startDate Start date (YYYY-MM-DD) (required)
 * @apiParam {String} endDate End date (YYYY-MM-DD) (required)
 * @apiParam {Number} [usageLimit] Maximum usage limit
 * @apiParam {Boolean} [active=true] Whether discount is active
 */
app.post('/api/discounts', [
  check('code', 'Discount code is required').not().isEmpty(),
  check('type', 'Discount type must be "percentage" or "fixed"').isIn(['percentage', 'fixed']),
  check('value', 'Discount value must be a positive number').isFloat({ min: 0 }),
  check('minOrder', 'Minimum order must be a positive number').optional().isFloat({ min: 0 }),
  check('startDate', 'Start date is required').isISO8601(),
  check('endDate', 'End date is required').isISO8601(),
  check('usageLimit', 'Usage limit must be a positive integer').optional().isInt({ min: 1 }),
  check('active', 'Active status must be a boolean').optional().isBoolean()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if discount code already exists
    const existingDiscount = await discountsCollection.findOne({
      code: req.body.code.toUpperCase()
    });
   
    if (existingDiscount) {
      return res.status(400).json({
        error: 'Discount code already exists'
      });
    }

    // Create new discount document
    const newDiscount = {
      code: req.body.code.toUpperCase(),
      type: req.body.type,
      value: parseFloat(req.body.value),
      minOrder: req.body.minOrder ? parseFloat(req.body.minOrder) : 0,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      usageLimit: req.body.usageLimit ? parseInt(req.body.usageLimit) : null,
      used: 0,
      active: req.body.active !== undefined ? req.body.active : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into database
    const result = await discountsCollection.insertOne(newDiscount);

    // Return success response with the created discount
    const createdDiscount = await discountsCollection.findOne(
      { _id: result.insertedId }
    );

    res.status(201).json({
      success: true,
      message: 'Discount created successfully',
      discount: {
        ...createdDiscount,
        id: createdDiscount._id.toString(),
        startDate: formatDateForFrontend(createdDiscount.startDate),
        endDate: formatDateForFrontend(createdDiscount.endDate)
      }
    });

  } catch (err) {
    console.error('Discount creation error:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * @api {put} /api/discounts/:id Update a discount
 * @apiName UpdateDiscount
 * @apiGroup Discounts
 *
 * @apiParam {String} id Discount ID (required)
 * @apiParam {String} [code] Discount code
 * @apiParam {String="percentage","fixed"} [type] Discount type
 * @apiParam {Number} [value] Discount value
 * @apiParam {Number} [minOrder] Minimum order amount
 * @apiParam {String} [startDate] Start date (YYYY-MM-DD)
 * @apiParam {String} [endDate] End date (YYYY-MM-DD)
 * @apiParam {Number} [usageLimit] Maximum usage limit
 * @apiParam {Boolean} [active] Whether discount is active
 */
app.put('/api/discounts/:id', [
  check('code', 'Discount code must be unique').optional().not().isEmpty(),
  check('type', 'Discount type must be "percentage" or "fixed"').optional().isIn(['percentage', 'fixed']),
  check('value', 'Discount value must be a positive number').optional().isFloat({ min: 0 }),
  check('minOrder', 'Minimum order must be a positive number').optional().isFloat({ min: 0 }),
  check('startDate', 'Start date must be valid').optional().isISO8601(),
  check('endDate', 'End date must be valid').optional().isISO8601(),
  check('usageLimit', 'Usage limit must be a positive integer').optional().isInt({ min: 1 }),
  check('active', 'Active status must be a boolean').optional().isBoolean()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if discount exists
    const existingDiscount = await discountsCollection.findOne({
      _id: new ObjectId(req.params.id)
    });
   
    if (!existingDiscount) {
      return res.status(404).json({
        error: 'Discount not found'
      });
    }

    // Check if new code already exists (if being updated)
    if (req.body.code && req.body.code !== existingDiscount.code) {
      const codeExists = await discountsCollection.findOne({
        code: req.body.code.toUpperCase(),
        _id: { $ne: new ObjectId(req.params.id) }
      });
     
      if (codeExists) {
        return res.status(400).json({
          error: 'Discount code already exists'
        });
      }
    }

    // Prepare update object
    const updates = {
      updatedAt: new Date()
    };

    // Add fields to update if provided
    if (req.body.code) updates.code = req.body.code.toUpperCase();
    if (req.body.type) updates.type = req.body.type;
    if (req.body.value) updates.value = parseFloat(req.body.value);
    if (req.body.minOrder !== undefined) updates.minOrder = parseFloat(req.body.minOrder) || 0;
    if (req.body.startDate) updates.startDate = new Date(req.body.startDate);
    if (req.body.endDate) updates.endDate = new Date(req.body.endDate);
    if (req.body.usageLimit !== undefined) {
      updates.usageLimit = req.body.usageLimit ? parseInt(req.body.usageLimit) : null;
    }
    if (req.body.active !== undefined) updates.active = req.body.active;

    // Update in database
    const result = await discountsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );

    // Return updated discount
    const updatedDiscount = await discountsCollection.findOne(
      { _id: new ObjectId(req.params.id) }
    );

    res.json({
      success: true,
      message: 'Discount updated successfully',
      discount: {
        ...updatedDiscount,
        id: updatedDiscount._id.toString(),
        startDate: formatDateForFrontend(updatedDiscount.startDate),
        endDate: formatDateForFrontend(updatedDiscount.endDate)
      }
    });

  } catch (err) {
    console.error('Discount update error:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * @api {delete} /api/discounts/:id Delete a discount
 * @apiName DeleteDiscount
 * @apiGroup Discounts
 *
 * @apiParam {String} id Discount ID (required)
 */
app.delete('/api/discounts/:id', async (req, res) => {
  try {
    // Check if discount exists
    const existingDiscount = await discountsCollection.findOne({
      _id: new ObjectId(req.params.id)
    });
   
    if (!existingDiscount) {
      return res.status(404).json({
        error: 'Discount not found'
      });
    }

    // Delete from database
    const result = await discountsCollection.deleteOne(
      { _id: new ObjectId(req.params.id) }
    );

    res.json({
      success: true,
      message: 'Discount deleted successfully'
    });

  } catch (err) {
    console.error('Discount deletion error:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * @api {put} /api/discounts/:id/toggle Toggle discount status
 * @apiName ToggleDiscount
 * @apiGroup Discounts
 *
 * @apiParam {String} id Discount ID (required)
 */
app.put('/api/discounts/:id/toggle', async (req, res) => {
  try {
    // Check if discount exists
    const existingDiscount = await discountsCollection.findOne({
      _id: new ObjectId(req.params.id)
    });
   
    if (!existingDiscount) {
      return res.status(404).json({
        error: 'Discount not found'
      });
    }

    // Toggle active status
    const newStatus = !existingDiscount.active;

    // Update in database
    const result = await discountsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          active: newStatus,
          updatedAt: new Date()
        }
      }
    );

    res.json({
      success: true,
      message: `Discount ${newStatus ? 'activated' : 'deactivated'} successfully`,
      active: newStatus
    });

  } catch (err) {
    console.error('Discount toggle error:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

// POST /api/staff - Create new staff member
app.post('/api/staff', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Valid email is required').isEmail(),
  check('phone', 'Valid phone number is required').isMobilePhone(),
  check('position', 'Position is required').not().isEmpty(),
  check('role', 'Valid role is required').isIn(['admin', 'manager', 'staff', 'developer']),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if staff already exists
    const existingStaff = await staffCollection.findOne({
      $or: [
        { email: req.body.email },
        { phone: req.body.phone }
      ]
    });

    if (existingStaff) {
      return res.status(400).json({ error: 'Staff with this email or phone already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new staff
    const newStaff = {
      ...req.body,
      password: hashedPassword,
      pin: req.body.pin || null,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await staffCollection.insertOne(newStaff);
    const createdStaff = await staffCollection.findOne({ _id: result.insertedId });

    res.status(201).json({
      success: true,
      staff: {
        ...createdStaff,
        id: createdStaff._id.toString()
      }
    });
  } catch (err) {
    console.error('Staff creation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/staff - Get all staff members
app.get('/api/staff', async (req, res) => {
  try {
    const staff = await staffCollection.find({}).toArray();
    const formattedStaff = staff.map(member => ({
      ...member,
      id: member._id.toString()
    }));
    res.json({ success: true, staff: formattedStaff });
  } catch (err) {
    console.error('Error fetching staff:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/staff/:id - Update staff member
app.put('/api/staff/:id', [
  check('name', 'Name is required').optional().not().isEmpty(),
  check('email', 'Valid email is required').optional().isEmail(),
  check('phone', 'Valid phone number is required').optional().isMobilePhone(),
  check('position', 'Position is required').optional().not().isEmpty(),
  check('role', 'Valid role is required').optional().isIn(['admin', 'manager', 'staff', 'developer'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updates = {
      ...req.body,
      updatedAt: new Date()
    };

    // If password is being updated, hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(req.body.password, salt);
    }

    const result = await staffCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    const updatedStaff = await staffCollection.findOne({ _id: new ObjectId(req.params.id) });
    res.json({
      success: true,
      staff: {
        ...updatedStaff,
        id: updatedStaff._id.toString()
      }
    });
  } catch (err) {
    console.error('Staff update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/staff/:id - Delete staff member
app.delete('/api/staff/:id', async (req, res) => {
  try {
    const result = await staffCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.json({ success: true, message: 'Staff member deleted' });
  } catch (err) {
    console.error('Staff deletion error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/staff/login - Staff login
app.post('/api/staff/login', [
  check('email', 'Valid email is required').isEmail(),
  check('password', 'Password is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const staff = await staffCollection.findOne({ email: req.body.email });
    if (!staff) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(req.body.password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await staffCollection.updateOne(
      { _id: staff._id },
      { $set: { lastLogin: new Date() } }
    );

    res.json({
      success: true,
      staff: {
        id: staff._id.toString(),
        name: staff.name,
        email: staff.email,
        role: staff.role
      }
    });
  } catch (err) {
    console.error('Staff login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/staff/attendance - Record attendance
app.post('/api/staff/attendance', [
  check('staffId', 'Staff ID is required').not().isEmpty(),
  check('action', 'Action must be "clockIn" or "clockOut"').isIn(['clockIn', 'clockOut'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().substring(0, 5);
   
    if (req.body.action === 'clockIn') {
      // Check if already clocked in today
      const existingRecord = await staffCollection.findOne({
        staffId: req.body.staffId,
        date: today
      });
     
      if (existingRecord) {
        return res.status(400).json({ error: 'Already clocked in today' });
      }

      // Create new attendance record
      const staff = await staffCollection.findOne({ _id: new ObjectId(req.body.staffId) });
      if (!staff) {
        return res.status(404).json({ error: 'Staff member not found' });
      }

      const newRecord = {
        staffId: req.body.staffId,
        name: staff.name,
        date: today,
        clockIn: time,
        clockOut: null,
        status: getAttendanceStatus(time),
        createdAt: new Date()
      };

      await staffCollection.insertOne(newRecord);
      res.json({ success: true, message: 'Clocked in successfully' });
    } else {
      // Clock out
      const result = await staffCollection.updateOne(
        {
          staffId: req.body.staffId,
          date: today,
          clockOut: null
        },
        { $set: { clockOut: time } }
      );

      if (result.matchedCount === 0) {
        return res.status(400).json({ error: 'No active clock-in found' });
      }

      res.json({ success: true, message: 'Clocked out successfully' });
    }
  } catch (err) {
    console.error('Attendance error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to determine attendance status
function getAttendanceStatus(clockInTime) {
  const [hours, minutes] = clockInTime.split(':').map(Number);
  if (hours > 8 || (hours === 8 && minutes > 0)) return 'late';
  return 'present';
}

/**
 * @api {get} /api/products Get products with filtering and sorting
 * @apiName GetProducts
 * @apiGroup Products
 *
 * @apiParam {String} [status] Filter by status (active/draft/archived)
 * @apiParam {String} [search] Search query
 * @apiParam {String} [sort] Sort field (name/status/inventory)
 * @apiParam {String} [direction] Sort direction (asc/desc)
 */
app.get('/api/products', async (req, res) => {
  try {
    const { status, search, sort, direction } = req.query;
   
    // Build query
    const query = {};
   
    // Status filter
    if (status && ['active', 'draft', 'archived'].includes(status)) {
      query.status = status;
    }
   
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }
   
    // Build sort object
    const sortOptions = {};
    if (sort && ['name', 'status', 'inventory'].includes(sort)) {
      sortOptions[sort] = direction === 'desc' ? -1 : 1;
    } else {
      sortOptions.name = 1; // Default sort by name ascending
    }
   
    const products = await productsCollection.find(query)
      .sort(sortOptions)
      .toArray();
   
    // Format for frontend
    const formattedProducts = products.map(product => ({
      ...product,
      id: product._id.toString(),
      size: product.size || (product.variants && product.variants.length > 0
        ? product.variants[0].values.join(', ')
        : ''),
      quantity: product.quantity || product.inventory || 0,
      variants: product.variants || []
    }));
   
    res.json({
      success: true,
      products: formattedProducts
    });
   
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * @api {get} /api/products/:id Get single product
 * @apiName GetProduct
 * @apiGroup Products
 */
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await productsCollection.findOne(
      { _id: new ObjectId(req.params.id) }
    );
   
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
   
    res.json({
      success: true,
      product: {
        ...product,
        id: product._id.toString()
      }
    });
   
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * @api {post} /api/products Create new product
 * @apiName CreateProduct
 * @apiGroup Products
 *
 * @apiParam {String} name Product name (required)
 * @apiParam {String} [description] Product description
 * @apiParam {String} [status=active] Product status (active/draft/archived)
 * @apiParam {Number} [price=0] Product price
 * @apiParam {Number} [compareAtPrice=0] Compare-at price
 * @apiParam {Number} [costPerItem=0] Cost per item
 * @apiParam {Boolean} [trackQuantity=true] Track inventory
 * @apiParam {Number} [inventory=0] Inventory quantity
 * @apiParam {Boolean} [continueSelling=false] Continue selling when out of stock
 * @apiParam {String} [sku] SKU
 * @apiParam {String} [barcode] Barcode
 * @apiParam {String} [category] Product category
 * @apiParam {String} [type] Product type
 * @apiParam {String} [vendor] Vendor
 * @apiParam {String} [collections] Collections
 * @apiParam {String} [tags] Tags (comma-separated)
 * @apiParam {Array} [variants] Product variants
 * @apiParam {String} [image] Base64 encoded image
 */
// POST /api/products - Create new product (updated version)
app.post('/api/products', [
  check('name', 'Product name is required').not().isEmpty(),
  check('status', 'Status must be active, draft or archived').optional().isIn(['active', 'draft', 'archived']),
  check('price', 'Price must be a positive number').optional().isFloat({ min: 0 }),
  check('compareAtPrice', 'Compare-at price must be a positive number').optional().isFloat({ min: 0 }),
  check('costPerItem', 'Cost per item must be a positive number').optional().isFloat({ min: 0 }),
  check('inventory', 'Inventory must be a positive integer').optional().isInt({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    // Create new product document with all required fields
    const newProduct = {
      name: req.body.name || req.body.title || '', // Handle both 'name' and 'title'
      description: req.body.description || '',
      status: req.body.status || 'active',
      price: parseFloat(req.body.price) || 0,
      compareAtPrice: parseFloat(req.body.compareAtPrice) || 0,
      costPerItem: parseFloat(req.body.costPerItem) || 0,
      trackQuantity: req.body.trackQuantity !== false, // default true
      inventory: parseInt(req.body.inventory || req.body.quantity || 0), // Handle both 'inventory' and 'quantity'
      continueSelling: req.body.continueSelling || false,
      sku: req.body.sku || '',
      barcode: req.body.barcode || '',
      category: req.body.category || '',
      type: req.body.type || '',
      vendor: req.body.vendor || '',
      collections: req.body.collections || '',
      tags: req.body.tags
        ? (Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',').map(tag => tag.trim()))
        : [],
      variants: req.body.variants || [],
      image: req.body.image || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into database
    const result = await productsCollection.insertOne(newProduct);

    // Return success response with the created product
    const createdProduct = await productsCollection.findOne(
      { _id: result.insertedId },
      { projection: { _id: 0, id: '$_id' } } // Rename _id to id for frontend
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: createdProduct
    });

  } catch (err) {
    console.error('Product creation error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * @api {put} /api/products/:id Update product
 * @apiName UpdateProduct
 * @apiGroup Products
 */
app.put('/api/products/:id', [
  check('name', 'Product name is required').optional().not().isEmpty(),
  check('status', 'Status must be active, draft or archived').optional().isIn(['active', 'draft', 'archived']),
  check('price', 'Price must be a positive number').optional().isFloat({ min: 0 }),
  check('compareAtPrice', 'Compare-at price must be a positive number').optional().isFloat({ min: 0 }),
  check('costPerItem', 'Cost per item must be a positive number').optional().isFloat({ min: 0 }),
  check('inventory', 'Inventory must be a positive integer').optional().isInt({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if product exists
    const existingProduct = await productsCollection.findOne(
      { _id: new ObjectId(req.params.id) }
    );
   
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Prepare updates
    const updates = {
      updatedAt: new Date()
    };

    // Add fields to update if provided
    if (req.body.name) updates.name = req.body.name;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.status) updates.status = req.body.status;
    if (req.body.price !== undefined) updates.price = parseFloat(req.body.price);
    if (req.body.compareAtPrice !== undefined) updates.compareAtPrice = parseFloat(req.body.compareAtPrice);
    if (req.body.costPerItem !== undefined) updates.costPerItem = parseFloat(req.body.costPerItem);
    if (req.body.trackQuantity !== undefined) updates.trackQuantity = req.body.trackQuantity;
    if (req.body.inventory !== undefined) updates.inventory = parseInt(req.body.inventory);
    if (req.body.continueSelling !== undefined) updates.continueSelling = req.body.continueSelling;
    if (req.body.sku !== undefined) updates.sku = req.body.sku;
    if (req.body.barcode !== undefined) updates.barcode = req.body.barcode;
    if (req.body.category !== undefined) updates.category = req.body.category;
    if (req.body.type !== undefined) updates.type = req.body.type;
    if (req.body.vendor !== undefined) updates.vendor = req.body.vendor;
    if (req.body.collections !== undefined) updates.collections = req.body.collections;
    if (req.body.tags !== undefined) {
      updates.tags = Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',').map(tag => tag.trim());
    }
    if (req.body.variants !== undefined) updates.variants = req.body.variants;
    if (req.body.image !== undefined) updates.image = req.body.image;

    // Update size and quantity from variants if they exist
    if (req.body.variants && req.body.variants.length > 0) {
      updates.size = req.body.variants[0].values.join(', ');
      updates.quantity = req.body.inventory || existingProduct.inventory;
    }

    // Update in database
    await productsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );

    // Return updated product
    const updatedProduct = await productsCollection.findOne(
      { _id: new ObjectId(req.params.id) }
    );

    res.json({
      success: true,
      product: {
        ...updatedProduct,
        id: updatedProduct._id.toString(),
        size: updatedProduct.size || (updatedProduct.variants && updatedProduct.variants.length > 0
          ? updatedProduct.variants[0].values.join(', ')
          : ''),
        quantity: updatedProduct.quantity || updatedProduct.inventory || 0
      }
    });

  } catch (err) {
    console.error('Product update error:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * @api {delete} /api/products/:id Delete product
 * @apiName DeleteProduct
 * @apiGroup Products
 */
app.delete('/api/products/:id', async (req, res) => {
  try {
    // Check if product exists
    const existingProduct = await productsCollection.findOne(
      { _id: new ObjectId(req.params.id) }
    );
   
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete product
    await productsCollection.deleteOne(
      { _id: new ObjectId(req.params.id) }
    );

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (err) {
    console.error('Product deletion error:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * @api {post} /api/products/bulk-delete Bulk delete products
 * @apiName BulkDeleteProducts
 * @apiGroup Products
 *
 * @apiParam {Array} productIds Array of product IDs to delete
 */
app.post('/api/products/bulk-delete', [
  check('productIds', 'Product IDs are required').isArray({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Convert string IDs to ObjectIds
    const productIds = req.body.productIds.map(id => new ObjectId(id));

    // Delete products
    const result = await productsCollection.deleteMany({
      _id: { $in: productIds }
    });

    res.json({
      success: true,
      message: `${result.deletedCount} products deleted successfully`
    });

  } catch (err) {
    console.error('Bulk delete error:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * @api {post} /api/products/bulk-duplicate Bulk duplicate products
 * @apiName BulkDuplicateProducts
 * @apiGroup Products
 *
 * @apiParam {Array} productIds Array of product IDs to duplicate
 */
app.post('/api/products/bulk-duplicate', [
  check('productIds', 'Product IDs are required').isArray({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Convert string IDs to ObjectIds
    const productIds = req.body.productIds.map(id => new ObjectId(id));

    // Find products to duplicate
    const productsToDuplicate = await productsCollection.find({
      _id: { $in: productIds }
    }).toArray();

    if (productsToDuplicate.length === 0) {
      return res.status(404).json({ error: 'No products found to duplicate' });
    }

    // Prepare duplicated products
    const duplicatedProducts = productsToDuplicate.map(product => ({
      ...product,
      _id: new ObjectId(),
      name: `${product.name} (Copy)`,
      inventory: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Insert duplicated products
    await productsCollection.insertMany(duplicatedProducts);

    res.json({
      success: true,
      message: `${duplicatedProducts.length} products duplicated successfully`
    });

  } catch (err) {
    console.error('Bulk duplicate error:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * @api {post} /api/products/export Export products to PDF
 * @apiName ExportProducts
 * @apiGroup Products
 *
 * @apiParam {Array} [productIds] Array of product IDs to export (empty for all)
 */
app.post('/api/products/export', async (req, res) => {
  try {
    let products;
   
    if (req.body.productIds && req.body.productIds.length > 0) {
      // Export selected products
      const productIds = req.body.productIds.map(id => new ObjectId(id));
      products = await productsCollection.find({
        _id: { $in: productIds }
      }).toArray();
    } else {
      // Export all products
      products = await productsCollection.find({}).toArray();
    }

    if (products.length === 0) {
      return res.status(404).json({ error: 'No products found to export' });
    }

    // Create PDF
    const doc = new jsPDF();
   
    // Add title
    doc.text('Products Export', 14, 15);
   
    // Prepare data for the table
    const tableData = products.map(product => [
      product.name || 'N/A',
      product.status || 'N/A',
      product.trackQuantity ? (product.inventory || 0) : 'N/A',
      product.category || 'N/A',
      product.type || 'N/A',
      product.vendor || 'N/A'
    ]);

    // Add the table
    autoTable(doc, {
      head: [['Product', 'Status', 'Inventory', 'Category', 'Type', 'Vendor']],
      body: tableData,
      startY: 20,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [34, 139, 34],
        textColor: 255
      }
    });

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
   
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=products_export.pdf');
   
    // Send PDF
    res.send(pdfBuffer);

  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * @api {get} /api/bookings Get all bookings
 * @apiName GetBookings
 * @apiGroup Bookings
 * 
 * @apiParam {Number} [year] Filter by year
 * @apiParam {Number} [month] Filter by month (0-11)
 * @apiParam {Number} [date] Filter by date
 */
app.get('/api/bookings', async (req, res) => {
  try {
    const { year, month, date } = req.query;
    
    // Build query
    const query = {};
    if (year) query.year = parseInt(year);
    if (month) query.month = parseInt(month);
    if (date) query.date = parseInt(date);
    
    const bookings = await bookingsCollection.find(query).toArray();
    
    // Format for frontend
    const formattedBookings = bookings.map(booking => ({
      ...booking,
      id: booking._id.toString()
    }));
    
    res.json({
      success: true,
      bookings: formattedBookings
    });
    
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * @api {post} /api/bookings Create a new booking
 * @apiName CreateBooking
 * @apiGroup Bookings
 * 
 * @apiParam {String} customer Customer name (required)
 * @apiParam {String} service Service name (required)
 * @apiParam {String} start Start time (required, format: "HH:MM AM/PM")
 * @apiParam {String} end End time (required, format: "HH:MM AM/PM")
 * @apiParam {Number} date Date (1-31) (required)
 * @apiParam {Number} month Month (0-11) (required)
 * @apiParam {Number} year Year (required)
 */
app.post('/api/bookings', [
  check('customer', 'Customer name is required').not().isEmpty(),
  check('service', 'Service name is required').not().isEmpty(),
  check('start', 'Start time is required').not().isEmpty(),
  check('end', 'End time is required').not().isEmpty(),
  check('date', 'Date is required and must be between 1-31').isInt({ min: 1, max: 31 }),
  check('month', 'Month is required and must be between 0-11').isInt({ min: 0, max: 11 }),
  check('year', 'Year is required').isInt()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Determine time of day for color coding
    const timeOfDay = getTimeOfDay(req.body.start);
    const color = timeColors[timeOfDay] || 'bg-gray-600';
    
    // Create new booking
    const newBooking = {
      customer: req.body.customer,
      service: req.body.service,
      start: req.body.start,
      end: req.body.end,
      date: parseInt(req.body.date),
      month: parseInt(req.body.month),
      year: parseInt(req.body.year),
      color,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into database
    const result = await bookingsCollection.insertOne(newBooking);
    
    // Return created booking
    const createdBooking = await bookingsCollection.findOne(
      { _id: result.insertedId }
    );
    
    res.status(201).json({
      success: true,
      booking: {
        ...createdBooking,
        id: createdBooking._id.toString()
      }
    });
    
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * @api {put} /api/bookings/:id Update a booking
 * @apiName UpdateBooking
 * @apiGroup Bookings
 * 
 * @apiParam {String} id Booking ID (required)
 * @apiParam {String} [customer] Customer name
 * @apiParam {String} [service] Service name
 * @apiParam {String} [start] Start time
 * @apiParam {String} [end] End time
 * @apiParam {Number} [date] Date
 * @apiParam {Number} [month] Month
 * @apiParam {Number} [year] Year
 */
app.put('/api/bookings/:id', [
  check('customer', 'Customer name is required').optional().not().isEmpty(),
  check('service', 'Service name is required').optional().not().isEmpty(),
  check('start', 'Start time is required').optional().not().isEmpty(),
  check('end', 'End time is required').optional().not().isEmpty(),
  check('date', 'Date must be between 1-31').optional().isInt({ min: 1, max: 31 }),
  check('month', 'Month must be between 0-11').optional().isInt({ min: 0, max: 11 }),
  check('year', 'Year is required').optional().isInt()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if booking exists
    const existingBooking = await bookingsCollection.findOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Prepare updates
    const updates = {
      updatedAt: new Date()
    };

    // Add fields to update if provided
    if (req.body.customer) updates.customer = req.body.customer;
    if (req.body.service) updates.service = req.body.service;
    if (req.body.start) {
      updates.start = req.body.start;
      // Update color if start time changes
      const timeOfDay = getTimeOfDay(req.body.start);
      updates.color = timeColors[timeOfDay] || 'bg-gray-600';
    }
    if (req.body.end) updates.end = req.body.end;
    if (req.body.date) updates.date = parseInt(req.body.date);
    if (req.body.month) updates.month = parseInt(req.body.month);
    if (req.body.year) updates.year = parseInt(req.body.year);

    // Update in database
    await bookingsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );

    // Return updated booking
    const updatedBooking = await bookingsCollection.findOne(
      { _id: new ObjectId(req.params.id) }
    );
    
    res.json({
      success: true,
      booking: {
        ...updatedBooking,
        id: updatedBooking._id.toString()
      }
    });
    
  } catch (err) {
    console.error('Booking update error:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * @api {delete} /api/bookings/:id Delete a booking
 * @apiName DeleteBooking
 * @apiGroup Bookings
 * 
 * @apiParam {String} id Booking ID (required)
 */
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    // Check if booking exists
    const existingBooking = await bookingsCollection.findOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Delete booking
    await bookingsCollection.deleteOne(
      { _id: new ObjectId(req.params.id) }
    );

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
    
  } catch (err) {
    console.error('Booking deletion error:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * @api {get} /api/bookings/date/:year/:month/:date Get bookings for a specific date
 * @apiName GetBookingsByDate
 * @apiGroup Bookings
 * 
 * @apiParam {Number} year Year (required)
 * @apiParam {Number} month Month (0-11) (required)
 * @apiParam {Number} date Date (1-31) (required)
 */
app.get('/api/bookings/date/:year/:month/:date', async (req, res) => {
  try {
    const { year, month, date } = req.params;
    
    const bookings = await bookingsCollection.find({
      year: parseInt(year),
      month: parseInt(month),
      date: parseInt(date)
    }).toArray();
    
    // Format for frontend
    const formattedBookings = bookings.map(booking => ({
      ...booking,
      id: booking._id.toString()
    }));
    
    res.json({
      success: true,
      bookings: formattedBookings
    });
    
  } catch (err) {
    console.error('Error fetching bookings by date:', err);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

// Time-based colors
const timeColors = {
  morning: 'bg-blue-600',
  day: 'bg-green-600',
  evening: 'bg-purple-600'
};

// Helper function to determine time of day
const getTimeOfDay = (timeStr) => {
  const time = timeStr.toLowerCase();
  const hour = parseInt(time.split(':')[0]) + (time.includes('pm') && !time.includes('12:') ? 12 : 0);
  
  if (hour < 12) return 'morning';
  if (hour < 17) return 'day';
  return 'evening';
};

// Basic route
app.get('/', (req, res) => {
  res.send('Hello Developer!----my name is NIRANJAN CHAUDHARY.');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});