import React from 'react';
import logo from '../../assets/logo.png'; // Adjust path if needed

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8 text-center">
        {/* Header */}
        <div className="flex items-center justify-center mb-6 space-x-2">
          <img src={logo} alt="Hostel Help Desk Logo" className="h-7 w-auto" />
          <h1 className="text-[var(--color-text-heading)] font-bold text-2xl">
            Hostel Help Desk
          </h1>
        </div>

        {/* Login / Report Links */}
        <div className="flex justify-center space-x-2 mb-6 text-[var(--color-text)]">
          <a href="/login" className="text-[var(--color-primary)] font-semibold">
            Login
          </a>
          <span>|</span>
          <a href="/report" className="hover:text-[var(--color-primary)]">
            Report Issues
          </a>
        </div>

        {/* Title */}
        <h2 className="text-[var(--color-text-heading)] font-semibold text-lg mb-2">
          Forgot Password
        </h2>

        {/* Description */}
        <p className="text-[var(--color-text)] mb-6">
          Enter your email address and we’ll send you instructions to reset your password
        </p>

        {/* Form */}
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-[var(--color-text)] rounded-md p-3 placeholder-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />

          <button
            type="submit"
            className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 pt-4 border-t text-[var(--color-text)]">
          <a href="/login" className="hover:text-[var(--color-primary)] flex items-center justify-center space-x-1">
            <span>←</span>
            <span>Back to Login</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;