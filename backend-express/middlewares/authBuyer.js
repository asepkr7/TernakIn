const prisma = require("../prisma/client");

const authBuyer = async (req, res, next) => {
  const userId = req.userId; // Ambil userId dari token middleware

  try {
    // Periksa apakah user dengan role buyer
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "buyer") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Only buyers are allowed to perform this action.",
      });
    }

    next(); // Jika role adalah buyer, lanjutkan
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = authBuyer;
