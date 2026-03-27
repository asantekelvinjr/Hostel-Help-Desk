import React from 'react';
import logo from '../../assets/logo.png'; // Adjust path as needed

const OTP = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8 text-center">
        {/* Header */}
        <div className="flex items-center justify-center mb-6 space-x-2">
          <img src={logo} alt="Hostel Help Desk Logo" className="h-7 w-auto text-[var(--color-primary)]" />
          <h1 className="text-[var(--color-text-heading)] font-bold text-2xl">
            Hostel Help Desk
          </h1>
        </div>

        {/* Title */}
        <h2 className="text-[var(--color-text-heading)] font-semibold text-lg mb-2">
          Verify Your Email
        </h2>

        {/* Description */}
        <p className="text-[var(--color-text)] mb-6">
          We’ve sent a 4-digit verification code to{' '}
          <span className="text-[var(--color-primary)] font-semibold">youremail@example.com</span>
          <br />
          Enter the code below to continue.
        </p>

        {/* OTP Inputs */}
        <form className="flex justify-center space-x-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="w-14 h-14 text-center border border-[var(--color-text)] rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder=""
            />
          ))}
        </form>

        {/* Timer */}
        <div className="flex items-center justify-center space-x-2 text-[var(--color-text)] mb-6">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span>Code expires in 01 : 59</span>
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition mb-6"
        >
          Verify
        </button>

        {/* Resend */}
        <div className="text-[var(--color-text)]">
          Didn’t receive code?{' '}
          <a href="/resend" className="text-[var(--color-primary)] font-semibold hover:underline">
            Resend
          </a>
        </div>
      </div>
    </div>
  );
};

export default OTP;