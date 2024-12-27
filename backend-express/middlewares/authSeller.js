const jwt = require("jsonwebtoken");

const authenticateSeller = (req, res, next) => {
  const token = req.headers.authorization; // Ambil token dari header

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token
    req.sellerId = decoded.id; // Simpan sellerId di request
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

module.exports = authenticateSeller;
