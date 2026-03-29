import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { registerUser } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "", email: "", roomNumber: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (fields = formData) => {
    const errs = {};
    if (!fields.name.trim()) errs.name = "Name is required.";
    if (!fields.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      errs.email = "Enter a valid email address.";
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
    const allTouched = Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const { data } = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roomNumber: formData.roomNumber,
      });

      // Backend returns token + user — store in session and go straight to /home
      sessionStorage.setItem("hd_user", JSON.stringify({ ...data.user, role: "user" }));
      sessionStorage.setItem("hd_token", data.token);
      navigate("/home", { replace: true });

    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-md p-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
      errors[field] && touched[field]
        ? "border-red-500 focus:ring-red-300"
        : "border-gray-300 focus:ring-[var(--color-primary)]"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">

        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src={logo} alt="logo" className="h-10 w-auto" />
          <h1 className="text-[var(--color-text-heading)] font-bold text-2xl leading-tight">
            Hostel Help Desk
          </h1>
        </div>

        <div className="flex justify-center space-x-2 mb-6 text-sm text-[var(--color-text)]">
          <a href="/login" className="hover:text-[var(--color-primary)]">Login</a>
          <span>|</span>
          <a href="/signup" className="text-[var(--color-primary)] font-semibold">Sign Up</a>
        </div>

        {serverError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm">
            {serverError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <input type="text" name="name" placeholder="Full Name"
              value={formData.name} onChange={handleChange} onBlur={handleBlur}
              className={inputClass("name")} />
            {errors.name && touched.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <input type="email" name="email" placeholder="Email"
              value={formData.email} onChange={handleChange} onBlur={handleBlur}
              className={inputClass("email")} />
            {errors.email && touched.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <input type="text" name="roomNumber" placeholder="Room Number (optional)"
              value={formData.roomNumber} onChange={handleChange} onBlur={handleBlur}
              className={inputClass("roomNumber")} />
          </div>
          <div>
            <input type="password" name="password" placeholder="Password"
              value={formData.password} onChange={handleChange} onBlur={handleBlur}
              className={inputClass("password")} />
            {errors.password && touched.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <input type="password" name="confirmPassword" placeholder="Confirm Password"
              value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur}
              className={inputClass("confirmPassword")} />
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-60">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--color-text)]">
          Have an account?{" "}
          <a href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
