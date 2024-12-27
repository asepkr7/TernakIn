const { body } = require("express-validator");

const validateTransaction = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items must be an array and cannot be empty"),
  body("items.*.fieldId")
    .notEmpty()
    .withMessage("Field ID is required")
    .isInt({ min: 1 })
    .withMessage("Field ID must be a valid integer"),
  body("items.*.qty")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("items.*.duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 1 })
    .withMessage("Duration must be at least 1"),
  body("items.*.totalPrice")
    .notEmpty()
    .withMessage("Total price is required")
    .isFloat({ min: 0 })
    .withMessage("Total price must be a positive number"),
  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isString()
    .withMessage("Payment method must be a valid string"),
];

module.exports = { validateTransaction };
