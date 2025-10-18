// backend/server.js
const userRoutes = require('./routes/user');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose'); // ⟵ chỉ khai báo 1 lần

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Log request (debug)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api', userRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// ---- KẾT NỐI MONGODB + START SERVER (chỉ 1 lần) ----
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err.message));
