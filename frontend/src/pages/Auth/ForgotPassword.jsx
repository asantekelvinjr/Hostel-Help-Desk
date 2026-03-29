import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import api from "../../api/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Email is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address."); return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      // Go to OTP page — purpose "reset" so it routes to /reset-password after verify
      setTimeout(() => navigate("/otp", { state: { email, purpose: "reset" } }), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8 text-center">

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src={logo} alt="logo" className="h-7 w-auto" />
          <h1 className="text-[var(--color-text-heading)] font-bold text-2xl">
            Hostel Help Desk
          </h1>
        </div>

        <div className="flex justify-center space-x-2 mb-6 text-sm text-[var(--color-text)]">
          <a href="/login" className="text-[var(--color-primary)] font-semibold">Login</a>
          <span>|</span>
          <a href="/signup" className="hover:text-[var(--color-primary)]">Sign Up</a>
        </div>

        <h2 className="text-[var(--color-text-heading)] font-semibold text-lg mb-2">
          Forgot Password
        </h2>
        <p className="text-sm text-[var(--color-text)] mb-6">
          Enter your email and we'll send you a 4-digit reset code.
        </p>

        {sent && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">
            Code sent! Redirecting…
          </div>
        )}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4 text-left" onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <button type="submit" disabled={loading || sent}
            className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-60">
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <a href="/login"
            className="text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] flex items-center justify-center gap-1">
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
