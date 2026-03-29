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
  Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

const sendOTPEmail = async (email, name, code, purpose) => {
  const subject =
    purpose === "verify"
      ? "Verify your Hostel Help Desk account"
      : "Reset your Hostel Help Desk password";

  const action =
    purpose === "verify"
      ? "verify your email address and activate your account"
      : "reset your password";

  await sendEmail({
    to: email,
    subject,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1d4ed8;">Hostel Help Desk</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Use the code below to ${action}. It expires in <strong>10 minutes</strong>.</p>
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
};

// ── Register ─────────────────────────────────────────────────
// @route  POST /api/auth/register
// Creates the user (unverified) and sends an OTP to their email
const register = async (req, res) => {
  try {
    const { name, email, password, roomNumber } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required." });

    const existing = await User.findOne({ email });
    if (existing) {
      // If they registered but never verified, resend OTP
      if (!existing.isVerified) {
        await OTPModel.deleteMany({ email: existing.email, purpose: "verify" });
        const code = generateOTP();
        await OTPModel.create({
          email: existing.email,
          code,
          purpose: "verify",
          expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
        });
        await sendOTPEmail(existing.email, existing.name, code, "verify");
        return res.status(200).json({
          message: "Account already exists but is unverified. A new code has been sent.",
          email: existing.email,
        });
      }
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({ name, email, password, roomNumber });

    // Send OTP
    const code = generateOTP();
    await OTPModel.create({
      email: user.email,
      code,
      purpose: "verify",
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    });
    await sendOTPEmail(user.email, user.name, code, "verify");

    res.status(201).json({
      message: "Account created. Please check your email for the verification code.",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Verify OTP (registration) ────────────────────────────────
// @route  POST /api/auth/verify-otp
// Verifies the code, marks user as verified, returns JWT → logs them in
const verifyOTP = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ message: "Email and code are required." });

    const record = await OTPModel.findOne({ email: email.toLowerCase(), code, purpose: "verify", used: false });

    if (!record || record.expiresAt < new Date())
      return res.status(400).json({ message: "Invalid or expired code." });

    // Mark OTP used
    record.used = true;
    await record.save();

    // Activate user
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isVerified: true },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found." });

    const token = generateToken(user._id, "user");

    res.json({
      message: "Email verified successfully.",
      token,
      user: { id: user._id, name: user.name, email: user.email, roomNumber: user.roomNumber },
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

    if (!user.isVerified)
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        unverified: true,
        email: user.email,
      });

    const token = generateToken(user._id, "user");
    res.json({
      message: "Login successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email, roomNumber: user.roomNumber },
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
// Sends a 4-digit OTP to the user's email for password reset
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email?.trim())
      return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return same message to prevent email enumeration
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

    await sendOTPEmail(user.email, user.name, code, "reset");

    res.json({ message: "If this email exists, a reset code has been sent." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Verify Reset OTP ─────────────────────────────────────────
// @route  POST /api/auth/verify-reset-otp
// Returns a short-lived resetToken if code is valid
const verifyResetOTP = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ message: "Email and code are required." });

    const record = await OTPModel.findOne({ email: email.toLowerCase(), code, purpose: "reset", used: false });

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
// Sets new password, returns JWT → logs user in directly
// const resetPassword = async (req, res) => {
//   try {
//     const { resetToken, password, confirmPassword } = req.body;

//     if (!resetToken || !password)
//       return res.status(400).json({ message: "Reset token and new password are required." });

//     if (password !== confirmPassword)
//       return res.status(400).json({ message: "Passwords do not match." });

//     if (password.length < 6)
//       return res.status(400).json({ message: "Password must be at least 6 characters." });

//     let decoded;
//     try {
//       decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
//     } catch {
//       return res.status(400).json({ message: "Reset link has expired. Please start over." });
//     }

//     if (decoded.purpose !== "reset")
//       return res.status(400).json({ message: "Invalid reset token." });

//     const user = await User.findOne({ email: decoded.email });
//     if (!user) return res.status(404).json({ message: "User not found." });

//     user.password = password; // pre-save hook hashes it
//     await user.save();

//     // Log them in immediately
//     const token = generateToken(user._id, "user");

//     res.json({
//       message: "Password reset successfully.",
//       token,
//       user: { id: user._id, name: user.name, email: user.email, roomNumber: user.roomNumber },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const resetPassword = async (req, res) => {
  try {
    const { resetToken, password, confirmPassword } = req.body;
    console.log("Received resetToken:", resetToken);

    if (!resetToken || !password)
      return res.status(400).json({ message: "Reset token and new password are required." });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match." });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters." });

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verify error:", err);
      return res.status(400).json({ message: "Reset link has expired or is invalid." });
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
      user: { id: user._id, name: user.name, email: user.email, roomNumber: user.roomNumber },
    });
  } catch (error) {
    console.error("ResetPassword error:", error); // <--- HERE
    res.status(500).json({ message: error.message });
  }
};

// ── Resend OTP ───────────────────────────────────────────────
// @route  POST /api/auth/resend-otp
const resendOTP = async (req, res) => {
  try {
    const { email, purpose } = req.body;
    if (!email || !purpose)
      return res.status(400).json({ message: "Email and purpose are required." });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found." });

    await OTPModel.deleteMany({ email: user.email, purpose });

    const code = generateOTP();
    await OTPModel.create({
      email: user.email,
      code,
      purpose,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    });

    await sendOTPEmail(user.email, user.name, code, purpose);

    res.json({ message: "A new code has been sent to your email." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  verifyOTP,
  login,
  getMe,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  resendOTP,
};
