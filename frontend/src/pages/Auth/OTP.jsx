import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import api from "../../api/api";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const updated = [...digits];
    updated[index] = digit;
    setDigits(updated);
    setError("");
    if (digit && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    const updated = ["", "", "", ""];
    pasted.split("").forEach((d, i) => { updated[i] = d; });
    setDigits(updated);
    inputRefs.current[Math.min(pasted.length, 3)]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 4) { setError("Please enter the full 4-digit code."); return; }
    if (!email) { setError("Session expired. Please start over."); return; }

    setLoading(true);
    setError("");
    try {
      // Verify reset OTP → get resetToken → go to reset password page
      const { data } = await api.post("/auth/verify-reset-otp", { email, code });
      navigate("/reset-password", { state: { resetToken: data.resetToken, email }, replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code.");
      setDigits(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending || !email) return;
    setResending(true);
    setError("");
    try {
      await api.post("/auth/resend-otp", { email });
      setSecondsLeft(10 * 60);
      setDigits(["", "", "", ""]);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
        <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8 text-center space-y-4">
          <p className="text-gray-600">Session expired. Please start again.</p>
          <a href="/forgot-password"
            className="inline-block text-[var(--color-primary)] font-semibold hover:underline">
            ← Go back
          </a>
        </div>
      </div>
    );
  }

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

        <h2 className="text-[var(--color-text-heading)] font-semibold text-lg mb-2">
          Enter Reset Code
        </h2>
        <p className="text-sm text-[var(--color-text)] mb-6">
          We sent a 4-digit code to{" "}
          <span className="text-[var(--color-primary)] font-semibold">{email}</span>.
          <br />Enter it below to continue.
        </p>

        {resent && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">
            A new code has been sent to your email.
          </div>
        )}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="flex justify-center gap-3 sm:gap-4 mb-5">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none transition
                  ${d
                    ? "border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]"
                    : "border-gray-300 focus:border-[var(--color-primary)]"
                  }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text)] mb-5">
            <span className={`w-2 h-2 rounded-full ${secondsLeft > 60 ? "bg-green-400" : secondsLeft > 0 ? "bg-yellow-400" : "bg-red-400"}`} />
            {secondsLeft > 0
              ? <span>Expires in <span className="font-semibold">{formatTime(secondsLeft)}</span></span>
              : <span className="text-red-500 font-medium">Code expired</span>}
          </div>

          <button type="submit"
            disabled={loading || digits.join("").length < 4 || secondsLeft === 0}
            className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-60 mb-4">
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <p className="text-sm text-[var(--color-text)]">
          Didn't receive it?{" "}
          <button onClick={handleResend}
            disabled={resending || secondsLeft > 9 * 60}
            className="text-[var(--color-primary)] font-semibold hover:underline disabled:opacity-40 disabled:cursor-not-allowed">
            {resending ? "Sending..." : "Resend Code"}
          </button>
        </p>

        <div className="mt-5 pt-4 border-t border-gray-100">
          <a href="/forgot-password"
            className="text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] flex items-center justify-center gap-1">
            ← Back
          </a>
        </div>
      </div>
    </div>
  );
};

export default OTP;
