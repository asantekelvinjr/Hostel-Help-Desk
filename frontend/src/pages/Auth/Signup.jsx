import React from 'react';
import logo from '../../assets/logo.png'; // adjust path if needed

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 space-y-2">
          <img src={logo} alt="Hostel Help Desk Logo" className="h-12 w-auto" />
          <h1 className="text-[var(--color-text-heading)] font-bold text-2xl">
            Hostel Help Desk
          </h1>
        </div>

        {/* Login / Report Links */}
        <div className="flex justify-center space-x-2 mb-6 text-[var(--color-text)]">
          <a href="/login" className="hover:text-[var(--color-primary)]">
            Login
          </a>
          <span>|</span>
          <a href="/report" className="text-[var(--color-primary)] font-semibold">
            Report Issues
          </a>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border border-[var(--color-text)] rounded-md p-3 placeholder-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-[var(--color-text)] rounded-md p-3 placeholder-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="text"
            placeholder="Room Number"
            className="w-full border border-[var(--color-text)] rounded-md p-3 placeholder-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full border border-[var(--color-text)] rounded-md p-3 placeholder-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-[var(--color-text)] rounded-md p-3 placeholder-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border border-[var(--color-text)] rounded-md p-3 placeholder-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />

          <button
            type="submit"
            className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        {/* Already have account */}
        <div className="mt-6 text-center text-[var(--color-text)]">
          Have an existing account?{' '}
          <a href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;