const express = require("express");
const router = express.Router();
const {
  register,
  verifyOTP,
  login,
  getMe,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  resendOTP,
} = require("../controllers/authController");
const { protectUser } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/verify-otp", verifyOTP);         // registration OTP
router.post("/login", login);
router.get("/me", protectUser, getMe);

// Password reset flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP); // forgot-password OTP
router.post("/reset-password", resetPassword);

// Shared resend
router.post("/resend-otp", resendOTP);

module.exports = router;
