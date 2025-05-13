
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

// Add services collection reference
let servicesCollection;

// Add orders collection reference
let ordersCollection;

// Add discounts collection reference
let discountsCollection;

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

    // Create new order document
    const newOrder = {
      ...req.body,
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
      { _id: result.insertedId },
   //   { projection: { _id: 0, id: '$_id' } } // Rename _id to id for frontend
    );
    // Convert _id to id and remove _id field
    const { _id, ...orderWithoutId } = createdOrder;
    const responseOrder = {
      ...orderWithoutId,
      id: _id.toString()
    };

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: responseOrder  // Ensure this matches frontend expectation
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

    // Convert string ID to ObjectId
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Return updated order
    const updatedOrder = await ordersCollection.findOne(
      { _id: new ObjectId(req.params.id) }
    );

    res.json({
      success: true,
      order: {
        ...updatedOrder,
        id: updatedOrder._id.toString()
      }
    });

  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ 
      error: 'Internal server error. Please try again later.' 
    });
  }
});

// DELETE /api/orders/:id - Delete order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const result = await ordersCollection.deleteOne(
      { _id: new ObjectId(req.params.id) }
    );

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


// Basic route
app.get('/', (req, res) => {
  res.send('Hello Developer!----my name is NIRANJAN CHAUDHARY.');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});