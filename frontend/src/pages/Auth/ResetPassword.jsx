import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo.png";
import api from "../../api/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = location.state?.resetToken || "";
  const email = location.state?.email || "";

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = (fields = formData) => {
    const errs = {};
    if (!fields.password) errs.password = "Password is required.";
    else if (fields.password.length < 6) errs.password = "Must be at least 6 characters.";
    if (!fields.confirmPassword) errs.confirmPassword = "Please confirm your password.";
    else if (fields.password !== fields.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    setServerError("");
    if (touched[name]) setErrors(validate(updated));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (!resetToken) {
      setServerError("Reset session expired. Please start over.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/reset-password", {
        resetToken,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Backend returns a JWT — log user in directly and go to /home
      sessionStorage.setItem("hd_user", JSON.stringify({ ...data.user, role: "user" }));
      sessionStorage.setItem("hd_token", data.token);
      navigate("/home", { replace: true });

    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-md p-3 pr-10 text-sm focus:outline-none focus:ring-2 transition ${
      errors[field] && touched[field]
        ? "border-red-500 focus:ring-red-300"
        : "border-gray-300 focus:ring-[var(--color-primary)]"
    }`;

  // Guard — no token means they didn't go through OTP
  if (!resetToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
        <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8 text-center space-y-4">
          <p className="text-gray-600">Reset session invalid or expired.</p>
          <a href="/forgot-password"
            className="inline-block text-[var(--color-primary)] font-semibold hover:underline">
            ← Start over
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
            Reset Password
          </h1>
        </div>

        {email && (
          <p className="text-sm text-gray-400 mb-6">
            Creating new password for{" "}
            <span className="font-medium text-gray-600">{email}</span>
          </p>
        )}

        {serverError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm">
            {serverError}
          </div>
        )}

        <form className="space-y-4 text-left" onSubmit={handleSubmit} noValidate>

          {/* New password */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass("password")}
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass("confirmPassword")}
              />
              <button type="button" onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-60">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <hr className="my-6 border-gray-100" />
        <a href="/login"
          className="text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] flex items-center justify-center gap-1">
          ← Back to Login
        </a>
      </div>
    </div>
  );
};

export default ResetPassword;
