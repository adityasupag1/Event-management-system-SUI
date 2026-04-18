const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/db');
const { initAdmin } = require('./controllers/authController');
const { sessionSecretForExpress } = require('./config/secrets');

const app = express();

let expressSessionSecret;
try {
  expressSessionSecret = sessionSecretForExpress();
} catch (e) {
  console.error(e.message || e);
  process.exit(1);
}

// Middleware — always allow local dev + deployed Vercel app; CLIENT_URL / CLIENT_ORIGIN add more (comma-separated).
// If CLIENT_URL is only localhost (common on Render), production must still be allowed — do not replace defaults.
const corsOrigins = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'https://event-management-system-sui.vercel.app',
]);
(process.env.CLIENT_URL || process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)
  .forEach((o) => corsOrigins.add(o));
app.use(cors({
  origin: [...corsOrigins],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session (secret must be non-empty or express-session returns 500 on every request)
app.use(session({
  secret: expressSessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: false
  }
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Event Management System API is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  const status = typeof err.status === 'number' ? err.status : typeof err.statusCode === 'number' ? err.statusCode : 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => initAdmin())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Server failed to start:', err.message || err);
    process.exit(1);
  });
