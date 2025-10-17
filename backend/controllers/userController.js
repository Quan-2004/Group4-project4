// backend/controllers/userController.js
let users = [
]; // Mảng tạm để lưu dữ liệu

// Lấy tất cả user
exports.getUsers = (req, res) => {
    res.status(200).json(users);
};

// Tạo user mới
exports.createUser = (req, res) => {
    // Kiểm tra xem body có dữ liệu không
    if (!req.body || !req.body.name || !req.body.email) {
        return res.status(400).json({ 
            message: 'Bad Request: name và email là bắt buộc. Vui lòng gửi Content-Type: application/json với body chứa name và email.' 
        });
    }

    const newUser = {
        id: Date.now(), // Tạo id đơn giản
        name: req.body.name,
        email: req.body.email
    };
    users.push(newUser);
    res.status(201).json(newUser);
};

// Cập nhật user theo ID
exports.updateUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    // Kiểm tra dữ liệu đầu vào
    if (!req.body.name || !req.body.email) {
        return res.status(400).json({ 
            message: 'Bad Request: name và email là bắt buộc' 
        });
    }

    // Cập nhật user
    users[userIndex] = {
        ...users[userIndex],
        name: req.body.name,
        email: req.body.email
    };

    res.status(200).json(users[userIndex]);
};

// Xóa user theo ID
exports.deleteUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    // Xóa user khỏi mảng
    const deletedUser = users.splice(userIndex, 1);
    
    res.status(200).json({ 
        message: 'Đã xóa user thành công',
        user: deletedUser[0]
    });
};