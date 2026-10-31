const express = require("express");

const {
  register,
  login,
  getCurrentUser,
  logout,
  bootstrapAdmin,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const requireAdminBootstrapKey = require("../middleware/adminBootstrapMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getCurrentUser);
router.post("/logout", logout);
router.post("/admin/bootstrap", requireAdminBootstrapKey, bootstrapAdmin);

module.exports = router;
