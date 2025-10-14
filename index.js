// --- 1. Imports ---
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');  // <-- NEW

// --- 2. Initialization ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- 3. Database Connection ---
connectDB();

// --- 4. Middleware ---

// ✅ Allow only your frontend origins (Vercel + localhost)
const allowedOrigins = [
  'https://mannkarepo-l4v3.vercel.app/', // 🔁 Replace this with your actual deployed Vercel URL
  'http://localhost:5173',                 // for local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// --- 5. API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/bookings', bookingRoutes); // <-- NEW

// --- 6. Default Route ---
app.get('/', (req, res) => {
  res.send('✨ Backend is live and connected successfully! ✨');
});

// --- 7. Start the Server ---
app.listen(PORT, () => {
  console.log(`✅ Server running with divine grace on port ${PORT}`);
});

