import React from 'react';
import logo from '../../assets/logo.png'; // Adjust path if needed

const ResetPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8 text-center">
        {/* Header */}
        <div className="flex items-center justify-center mb-6 space-x-2">
          <img src={logo} alt="Hostel Help Desk Logo" className="h-7 w-auto" />
          <h1 className="text-[var(--color-text-heading)] font-bold text-2xl">
            Reset Password
          </h1>
        </div>

        {/* Subtext */}
        <p className="text-[var(--color-text)] mb-6">
          Enter your new password below.
        </p>

        {/* Form */}
        <form className="space-y-4 text-left">
          <input
            type="password"
            placeholder="New Password"
            className="w-full border border-[var(--color-text)] rounded-md p-3 placeholder-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full border border-[var(--color-text)] rounded-md p-3 placeholder-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />

          <button
            type="submit"
            className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>

        {/* Divider line */}
        <hr className="my-6 border-[var(--color-text)] border-opacity-30" />

        {/* Back to Login */}
        <div>
          <a
            href="/login"
            className="text-[var(--color-text)] hover:text-[var(--color-primary)] flex items-center justify-center space-x-1"
          >
            <span>←</span>
            <span>Back to Login</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;