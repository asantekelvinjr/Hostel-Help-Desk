const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ["verify", "reset"],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // MongoDB TTL — auto-deletes expired docs
  },
  used: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("OTP", otpSchema);
