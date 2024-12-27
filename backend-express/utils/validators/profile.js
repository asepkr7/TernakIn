const { body } = require("express-validator");

const validateProfile = [
  body("address").notEmpty().withMessage("Address is required"),
  body("postalCode")
    .notEmpty()
    .withMessage("Postal Code is required")
    .isLength({ min: 5, max: 10 })
    .withMessage("Postal Code must be between 5 and 10 characters"),
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female"])
    .withMessage("Gender must be either 'male' or 'female'"),
  body("city").notEmpty().withMessage("City is required"),
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone Number is required")
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone Number must be between 10 and 15 characters"),
];

module.exports = { validateProfile };
