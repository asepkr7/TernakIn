const { body } = require("express-validator");
const prisma = require("../../prisma/client");

const validateField = [
  body("name").notEmpty().withMessage("Name is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("type").notEmpty().withMessage("Type is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("wide")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("sellerId")
    .notEmpty()
    .withMessage("Seller ID is required")
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: { id: Number(value) },
      });
      if (!user || user.role !== "seller") {
        throw new Error("Seller ID is invalid or not a seller");
      }
      return true;
    }),
];

module.exports = { validateField };
