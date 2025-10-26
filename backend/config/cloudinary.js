// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config(); // Để đọc .env

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình storage cho Multer (nơi lưu file)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'buoi5-avatars', // Tên thư mục trên Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'],
        // public_id sẽ là tên file (ở đây ta dùng userId + timestamp)
        public_id: (req, file) => `${req.user.id}_${Date.now()}`,
    },
});

// Tạo middleware 'upload'
const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };
