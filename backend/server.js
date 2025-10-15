// Trong file backend/server.js
const userRoutes = require('./routes/user');

// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Chạy cấu hình để đọc file .env
dotenv.config();

const app = express();

// Kích hoạt middleware
app.use(cors()); // Cho phép các nguồn khác truy cập API
app.use(express.json()); // Giúp server hiểu được dữ liệu JSON client gửi lên

// Middleware để log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    next();
});

// Route gốc để kiểm tra server có hoạt động không
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Sử dụng route
app.use('/api', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));