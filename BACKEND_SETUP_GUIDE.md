# Backend API Implementation Guide for SheRide

This guide will help you set up the backend API endpoints required for the SheRide platform.

## Technology Stack (Recommended)

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB or PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer or similar
- **Environment:** .env configuration

---

## Project Setup

### 1. Initialize Node.js Project

```bash
mkdir sheride-backend
cd sheride-backend
npm init -y
npm install express cors dotenv mongodb mongoose jsonwebtoken bcryptjs multer
npm install -D nodemon
```

### 2. Project Structure

```
sheride-backend/
├── config/
│   └── database.js
├── controllers/
│   ├── auth.js
│   ├── profiles.js
│   ├── crimes.js
│   └── rides.js
├── models/
│   ├── User.js
│   ├── Profile.js
│   ├── CrimeHotspot.js
│   └── Ride.js
├── routes/
│   ├── auth.js
│   ├── profiles.js
│   ├── crimes.js
│   └── rides.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── uploads/
├── .env
├── .gitignore
└── server.js
```

---

## Step 1: Environment Setup

Create `.env` file:

```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/sheride
# OR for PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/sheride

# JWT
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## Step 2: Core Server Setup

Create `server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/crimes', require('./routes/crimes'));
app.use('/api/rides', require('./routes/rides'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## Step 3: Models

### User Model

Create `models/User.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['passenger', 'driver', 'admin'],
    required: true,
  },
  profile: {
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    profilePhoto: String,
    idNumber: String,
    licenseNumber: String,
    vehicleModel: String,
    vehicleNumber: String,
    emergencyContact: String,
    emergencyPhone: String,
    homeLocation: {
      lat: Number,
      lng: Number,
      address: String,
    },
    workLocation: {
      lat: Number,
      lng: Number,
      address: String,
    },
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Crime Hotspot Model

Create `models/CrimeHotspot.js`:

```javascript
const mongoose = require('mongoose');

const crimeHotspotSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  lat: Number,
  lng: Number,
  intensity: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  safetyRating: {
    type: String,
    enum: ['safe', 'caution', 'high-risk'],
    required: true,
  },
  incidentsLastMonth: {
    type: Number,
    default: 0,
  },
  description: String,
  source: {
    type: String,
    enum: ['police', 'community', 'news'],
  },
  verifie: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create geospatial index for location queries
crimeHotspotSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('CrimeHotspot', crimeHotspotSchema);
```

### Ride Model

Create `models/Ride.js`:

```javascript
const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  pickupLocation: {
    lat: Number,
    lng: Number,
    address: String,
  },
  dropLocation: {
    lat: Number,
    lng: Number,
    address: String,
  },
  rideType: {
    type: String,
    enum: ['regular', 'girls-only'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  fare: Number,
  distance: Number,
  estimatedTime: Number,
  actualTime: Number,
  rating: Number,
  review: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Ride', rideSchema);
```

---

## Step 4: Authentication Middleware

Create `middleware/auth.js`:

```javascript
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'No authentication token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized for this action',
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
```

---

## Step 5: API Routes & Controllers

### Auth Routes

Create `routes/auth.js`:

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during login',
    });
  }
});

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use',
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token,
        },
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during signup',
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  // Token invalidation happens on client side by removing from localStorage
  res.json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

module.exports = router;
```

### Profiles Routes

Create `routes/profiles.js`:

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Get profile
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.json({
      status: 'success',
      data: {
        id: user._id,
        profile: user.profile,
        verificationStatus: user.verificationStatus,
        isProfileComplete: user.isProfileComplete,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Complete profile
router.post('/:userId/complete', authenticate, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        profile: req.body,
        isProfileComplete: true,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.json({
      status: 'success',
      data: {
        id: user._id,
        profile: user.profile,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Upload documents
router.post('/:userId/documents', authenticate, upload.single('file'), async (req, res) => {
  try {
    const { docType } = req.body;

    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded',
      });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Update user with document path
    user.profile = user.profile || {};
    user.profile[docType] = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({
      status: 'success',
      data: {
        url: `/uploads/${req.file.filename}`,
        verified: false,
        documentType: docType,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

module.exports = router;
```

### Crimes Routes

Create `routes/crimes.js`:

```javascript
const express = require('express');
const CrimeHotspot = require('../models/CrimeHotspot');

const router = express.Router();

// Get all hotspots
router.get('/hotspots', async (req, res) => {
  try {
    const hotspots = await CrimeHotspot.find();
    res.json({
      status: 'success',
      data: hotspots,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Get nearby hotspots
router.get('/hotspots/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    const hotspots = await CrimeHotspot.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      },
    });

    res.json({
      status: 'success',
      data: hotspots,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Get statistics
router.get('/statistics', async (req, res) => {
  try {
    const { lat, lng } = req.query;

    const nearbyHotspots = await CrimeHotspot.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: 5000,
        },
      },
    });

    const avgIntensity = nearbyHotspots.length > 0
      ? nearbyHotspots.reduce((sum, h) => sum + h.intensity, 0) / nearbyHotspots.length
      : 0;

    res.json({
      status: 'success',
      data: {
        safetyRating: Math.round(100 - avgIntensity),
        incidentsLastMonth: nearbyHotspots.reduce((sum, h) => sum + h.incidentsLastMonth, 0),
        trend: 'stable',
        averageIncidentRate: Math.round(avgIntensity),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

module.exports = router;
```

### Rides Routes

Create `routes/rides.js`:

```javascript
const express = require('express');
const Ride = require('../models/Ride');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create ride
router.post('/', authenticate, async (req, res) => {
  try {
    const ride = new Ride({
      ...req.body,
      passengerId: req.user.id,
      status: 'pending',
    });

    await ride.save();

    res.status(201).json({
      status: 'success',
      data: ride,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Get ride
router.get('/:rideId', authenticate, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId)
      .populate('passengerId')
      .populate('driverId');

    if (!ride) {
      return res.status(404).json({
        status: 'error',
        message: 'Ride not found',
      });
    }

    res.json({
      status: 'success',
      data: ride,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Get ride history
router.get('/history', authenticate, async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const rides = await Ride.find({ passengerId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Ride.countDocuments({ passengerId: req.user.id });

    res.json({
      status: 'success',
      data: {
        total,
        rides,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Cancel ride
router.post('/:rideId/cancel', authenticate, async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(
      req.params.rideId,
      { status: 'cancelled', updatedAt: new Date() },
      { new: true }
    );

    res.json({
      status: 'success',
      data: ride,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

module.exports = router;
```

---

## Step 6: Running the Backend

### 1. Install Dependencies

```bash
npm install
```

### 2. Create .env file with required variables

### 3. Start Server

```bash
npm start
```

Or with auto-reload:

```bash
npx nodemon server.js
```

---

## Testing APIs with Postman

### Import Collection:

```json
{
  "info": {
    "name": "SheRide API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth - Login",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
        },
        "url": {"raw": "http://localhost:5000/api/auth/login"}
      }
    },
    {
      "name": "Profiles - Complete",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Content-Type", "value": "application/json"},
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"age\":25,\"gender\":\"female\"}"
        },
        "url": {"raw": "http://localhost:5000/api/profiles/{{userId}}/complete"}
      }
    }
  ]
}
```

---

## Deployment Checklist

- [ ] Set up MongoDB/PostgreSQL database
- [ ] Configure environment variables (.env)
- [ ] Implement proper error handling
- [ ] Add input validation
- [ ] Set up CORS correctly
- [ ] Add rate limiting
- [ ] Implement logging
- [ ] Set up HTTPS
- [ ] Deploy to production server (Heroku/AWS/DigitalOcean)

---

**Next Step:** Test all APIs locally before connecting to frontend!
