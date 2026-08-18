const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
require('dotenv').config();

const sequelize = require('./config/database');
const setupSocket = require('./socket/chat');
const RentalCronService = require('./services/rentalCronService');
const LeisureLeaseCronService = require('./services/leisureLeaseCronService');

// Import models to register associations
require('./models/User');
require('./models/Listing');
require('./models/Message');
require('./models/Review');
require('./models/Wishlist');
require('./models/Subscription');
require('./models/VisitBooking');
require('./models/PropertyRental');
require('./models/MonthlyPayment');
require('./models/Purchase');
require('./models/KYC');
require('./models/BuyRequest');
require('./models/RentalAgreement');
require('./models/RentPayment');
require('./models/RentNotification');
require('./models/Vendor');
require('./models/ServiceRequest');
require('./models/LeisureLease');
require('./models/PropertyRequest');

// Import associations to ensure they are loaded
require('./models/associations');

const app = express();
const server = http.createServer(app);

// Configure CORS to allow Vercel preview URLs
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  /https:\/\/infrall-frontend.*\.vercel\.app$/  // Allow all Vercel preview URLs
].filter(Boolean);

const io = new Server(server, {
  cors: { 
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list or matches Vercel pattern
      const isAllowed = allowedOrigins.some(allowed => {
        if (allowed instanceof RegExp) return allowed.test(origin);
        return allowed === origin;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  },
});

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches Vercel pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) return allowed.test(origin);
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Session middleware for OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'infraall_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Disable caching for API responses
app.use('/api', (req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/visit-bookings', require('./routes/visitBooking'));
app.use('/api/property-rentals', require('./routes/propertyRental'));
app.use('/api/purchase', require('./routes/purchase'));
app.use('/api/buy-requests', require('./routes/buyRequest'));
app.use('/api/kyc', require('./routes/kyc'));
app.use('/api/rental', require('./routes/rental'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/leisure-lease', require('./routes/leisureLease'));
app.use('/api/service-requests', require('./routes/serviceRequest'));
app.use('/api/vendor', require('./routes/vendor'));
app.use('/api/owner', require('./routes/owner'));
app.use('/api/account-management', require('./routes/accountManagement'));
app.use('/api/property-requests', require('./routes/propertyRequest'));

app.get('/', (req, res) => res.json({ message: 'INFRAALL API running' }));

setupSocket(io);

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    server.listen(PORT, () => {
      console.log(`🚀 INFRAALL server running on port ${PORT}`);
      
      // Start rental management cron jobs
      RentalCronService.start();
      
      // Start leisure lease expiry check
      LeisureLeaseCronService.start();
    });
  })
  .catch((err) => {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  });

