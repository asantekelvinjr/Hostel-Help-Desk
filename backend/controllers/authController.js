const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OTPModel = require("../models/OTP");
const { sendEmail } = require("../utils/mailer");

// ── Helpers ──────────────────────────────────────────────────
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const generateOTP = () =>
  Math.floor(1000 + Math.random() * 9000).toString();

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

// ── Register ─────────────────────────────────────────────────
// @route  POST /api/auth/register
// Creates user and returns JWT immediately — no OTP needed
const register = async (req, res) => {
  try {
    const { name, email, password, roomNumber } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required." });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "An account with this email already exists." });

    const user = await User.create({ name, email, password, roomNumber });
    const token = generateToken(user._id, "user");

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roomNumber: user.roomNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Login ────────────────────────────────────────────────────
// @route  POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid email or password." });

    if (!user.isActive)
      return res.status(403).json({ message: "Your account has been deactivated. Contact admin." });

    const token = generateToken(user._id, "user");

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roomNumber: user.roomNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get Me ───────────────────────────────────────────────────
// @route  GET /api/auth/me
const getMe = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        roomNumber: req.user.roomNumber,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Forgot Password ──────────────────────────────────────────
// @route  POST /api/auth/forgot-password
// Sends a 4-digit OTP to the user's email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email?.trim())
      return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always respond same way to prevent email enumeration
    if (!user)
      return res.json({ message: "If this email exists, a reset code has been sent." });

    await OTPModel.deleteMany({ email: user.email, purpose: "reset" });

    const code = generateOTP();
    await OTPModel.create({
      email: user.email,
      code,
      purpose: "reset",
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    });

    await sendEmail({
      to: user.email,
      subject: "Your Hostel Help Desk Password Reset Code",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1d4ed8;">Hostel Help Desk</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Use the code below to reset your password. It expires in <strong>10 minutes</strong>.</p>
          <div style="font-size: 40px; font-weight: bold; letter-spacing: 14px; text-align: center;
                      padding: 24px; background: #eff6ff; border-radius: 10px;
                      margin: 24px 0; color: #1d4ed8; border: 2px dashed #bfdbfe;">
            ${code}
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    res.json({ message: "If this email exists, a reset code has been sent." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Verify Reset OTP ─────────────────────────────────────────
// @route  POST /api/auth/verify-reset-otp
const verifyResetOTP = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ message: "Email and code are required." });

    const record = await OTPModel.findOne({
      email: email.toLowerCase(),
      code,
      purpose: "reset",
      used: false,
    });

    if (!record || record.expiresAt < new Date())
      return res.status(400).json({ message: "Invalid or expired code." });

    record.used = true;
    await record.save();

    // Short-lived reset token (5 min)
    const resetToken = jwt.sign(
      { email: record.email, purpose: "reset" },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    res.json({ message: "Code verified.", resetToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Reset Password ───────────────────────────────────────────
// @route  POST /api/auth/reset-password
// Resets password and returns JWT → logs user in directly
const resetPassword = async (req, res) => {
  try {
    const { resetToken, password, confirmPassword } = req.body;

    if (!resetToken || !password)
      return res.status(400).json({ message: "Reset token and new password are required." });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match." });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters." });

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ message: "Reset link has expired. Please start over." });
    }

    if (decoded.purpose !== "reset")
      return res.status(400).json({ message: "Invalid reset token." });

    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found." });

    user.password = password;
    await user.save();

    const token = generateToken(user._id, "user");

    res.json({
      message: "Password reset successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roomNumber: user.roomNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Resend OTP ───────────────────────────────────────────────
// @route  POST /api/auth/resend-otp
// Only used for forgot-password flow now
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found." });

    await OTPModel.deleteMany({ email: user.email, purpose: "reset" });

    const code = generateOTP();
    await OTPModel.create({
      email: user.email,
      code,
      purpose: "reset",
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    });

    await sendEmail({
      to: user.email,
      subject: "Your new Hostel Help Desk reset code",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1d4ed8;">Hostel Help Desk</h2>
          <p>Hi <strong>${user.name}</strong>, here is your new reset code:</p>
          <div style="font-size: 40px; font-weight: bold; letter-spacing: 14px; text-align: center;
                      padding: 24px; background: #eff6ff; border-radius: 10px;
                      margin: 24px 0; color: #1d4ed8; border: 2px dashed #bfdbfe;">
            ${code}
          </div>
          <p style="color: #6b7280; font-size: 14px;">Expires in 10 minutes.</p>
        </div>
      `,
    });

    res.json({ message: "A new code has been sent." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  resendOTP,
};
