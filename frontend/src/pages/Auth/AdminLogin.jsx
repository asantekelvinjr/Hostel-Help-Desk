import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

const AdminLogin = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const sessionExpired = location.state?.sessionExpired;

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (fields = formData) => {
    const errs = {};
    if (!fields.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      errs.email = "Enter a valid email.";
    if (!fields.password) errs.password = "Password is required.";
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
    setTouched({ email: true, password: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const result = await adminLogin({ email: formData.email, password: formData.password });
    setLoading(false);

    if (result.success) {
      navigate("/admin");
    } else {
      setServerError(result.error);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 transition ${
      errors[field] && touched[field]
        ? "border-red-500 focus:ring-red-300"
        : "border-gray-300 focus:ring-[var(--color-primary)]"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="bg-white shadow-lg rounded-xl max-w-md w-full p-8">

        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src={logo} alt="logo" className="h-9 w-auto" />
          <h1 className="text-[var(--color-text-heading)] font-bold text-2xl">Hostel Help Desk</h1>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6 text-[var(--color-primary)]">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-sm font-semibold">Admin Portal</span>
        </div>

        {/* Session expired banner */}
        {sessionExpired && (
          <div className="mb-4 px-4 py-3 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-700 text-sm">
            Your session expired due to inactivity. Please log in again.
          </div>
        )}

        {/* Server error */}
        {serverError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm">
            {serverError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Email</label>
            <input
              type="email" name="email" placeholder="admin@hostel.com"
              value={formData.email} onChange={handleChange} onBlur={handleBlur}
              className={inputClass("email")}
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} name="password" placeholder="••••••••"
                value={formData.password} onChange={handleChange} onBlur={handleBlur}
                className={`${inputClass("password")} pr-10`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Not an admin?{" "}
          <a href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">
            User Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
