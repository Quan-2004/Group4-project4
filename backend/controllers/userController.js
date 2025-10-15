// backend/controllers/userController.js
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
]; // Mảng tạm để lưu dữ liệu

// Lấy tất cả user
exports.getUsers = (req, res) => {
    res.status(200).json(users);
};

// Tạo user mới
exports.createUser = (req, res) => {
    const newUser = {
        id: Date.now(), // Tạo id đơn giản
        name: req.body.name,
        email: req.body.email
    };
    users.push(newUser);
    res.status(201).json(newUser);
};