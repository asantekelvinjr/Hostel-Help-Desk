const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  resendOTP,
} = require("../controllers/authController");
const { protectUser } = require("../middleware/authMiddleware");

// Auth
router.post("/register", register);
router.post("/login", login);
router.get("/me", protectUser, getMe);

// Password reset flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOTP);

module.exports = router;
