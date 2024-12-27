const express = require("express");
const verifyToken = require("../middlewares/auth");
const registerController = require("../controllers/RegisterController");
const loginController = require("../controllers/LoginController.js");
const fieldController = require("../controllers/FieldController.js");
const userController = require("../controllers/UserController.js");
const profileController = require("../controllers/ProfileController");
const { validateRegister, validateLogin } = require("../utils/validators/auth");
const { validateUser } = require("../utils/validators/user.js");
const { validateField } = require("../utils/validators/field.js");
const { validateProfile } = require("../utils/validators/profile");
const { upload } = require("../middlewares/multer");
const authenticateSeller = require("../middlewares/authSeller");
const transactionController = require("../controllers/TransactionController");
const { validateTransaction } = require("../utils/validators/transactions");
const {
  validateTransactionUpdate,
} = require("../utils/validators/transactionsStatus");
const authBuyer = require("../middlewares/authBuyer");
// init express router
const router = express.Router();
// Auth Routes
router.post(
  "/register",
  upload.none(), // Mendukung form-data
  validateRegister,
  registerController.register
);

router.post(
  "/login",
  upload.none(), // Mendukung form-data
  validateLogin,
  loginController.login
);

// User Routes
router.get("/admin/users", verifyToken, userController.findUsers);
router.post(
  "/admin/users",
  verifyToken,
  validateUser,
  userController.createUser
);
router.get("/admin/users/:id", verifyToken, userController.findUserByid);
router.put(
  "/admin/users/:id",
  verifyToken,
  validateUser,
  userController.updateUser
);
router.delete(
  "/admin/users/:id",
  verifyToken,
  validateUser,
  userController.deleteUser
);

// Field Routes
router.get("/fields", verifyToken, fieldController.findFields);
router.get("/fields/:id", verifyToken, fieldController.findFieldById);

router.get(
  "/seller-fields",
  verifyToken,
  authenticateSeller,
  fieldController.findFieldsByLoggedInSeller
);
router.post(
  "/fields",
  verifyToken,
  upload.single("image"), // Untuk upload file image
  validateField,
  fieldController.createField
);
// Tambahkan endpoint baru

router.put(
  "/fields/:id",
  verifyToken,
  upload.single("image"), // Untuk upload file image baru
  validateField,
  fieldController.updateField
);
router.delete("/fields/:id", verifyToken, fieldController.deleteField);

// Profile Routes
router.get(
  "/profiles/:userId",
  verifyToken,
  profileController.findProfileByUserId
);
router.post(
  "/profiles/:userId",
  verifyToken,
  upload.single("image"), // Untuk upload file image
  validateProfile,
  profileController.upsertProfile
);
router.put(
  "/profiles/:userId",
  verifyToken,
  upload.single("image"), // Untuk upload file image baru
  validateProfile,
  profileController.upsertProfile
);
router.delete(
  "/profiles/:userId",
  verifyToken,
  profileController.deleteProfile
);

// Transaction Routes
// router.post(
//   "/transactions",
//   verifyToken,
//   upload.none(),
//   authBuyer,
//   validateTransaction,
//   transactionController.createTransaction
// );
router.post(
  "/transactions",
  verifyToken,
  upload.none(),
  authBuyer,
  validateTransaction,
  transactionController.createTransaction
);

router.get(
  "/transactions",
  verifyToken,
  upload.none(),
  authBuyer, // Hanya buyer yang boleh melihat transaksinya
  transactionController.findTransactionsByBuyer
);

router.put(
  "/transactions/:id/cancel",
  verifyToken,
  authBuyer,
  transactionController.cancelTransaction
);
router.put(
  "/transaction/update-detail/:transactionDetailId",
  validateTransactionUpdate,
  transactionController.updateTransactionDetail
);

router.get(
  "/transactions/with-details",
  verifyToken,
  upload.none(),
  transactionController.getTransactionsWithDetails
);

module.exports = router;
