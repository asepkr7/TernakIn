const { body } = require("express-validator");

const validateTransactionUpdate = [
  body("transactionId")
    .isInt()
    .withMessage("Transaction ID must be an integer"),
  body("details").isArray().withMessage("Details must be an array"),
  body("details.*.health")
    .isInt({ min: 0 })
    .withMessage("Health must be a positive integer"),
  body("details.*.sick")
    .isInt({ min: 0 })
    .withMessage("Sick must be a positive integer"),
  body("details.*.death")
    .isInt({ min: 0 })
    .withMessage("Death must be a positive integer"),
];

module.exports = { validateTransactionUpdate };
