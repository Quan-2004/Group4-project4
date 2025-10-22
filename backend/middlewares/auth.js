// middlewares/auth.js
const jwt = require('jsonwebtoken');
module.exports = (requiredRole) => (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if(!token) return res.status(401).json({message:'Thiếu token'});
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); // { uid, role }
    req.user = payload;
    if(requiredRole && payload.role !== requiredRole) return res.status(403).json({message:'Không đủ quyền'});
    next();
  } catch { return res.status(401).json({message:'Token không hợp lệ'}); }
};
