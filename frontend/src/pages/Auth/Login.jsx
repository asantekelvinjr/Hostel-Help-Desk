import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { login } = useAuth()

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (fields = formData) => {
    const errs = {};
    if (!fields.name.trim()) {
      errs.name = 'Name is required.';
    }
    if (!fields.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!fields.password) {
      errs.password = 'Password is required.';
    } else if (fields.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (touched[name]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate());
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const allTouched = { name: true, email: true, password: true };
  //   setTouched(allTouched);
  //   const errs = validate();
  //   setErrors(errs);
  //   if (Object.keys(errs).length === 0) {
  //     navigate('/home');
  //   }
  // };

  const handleSubmit = (e) => {
  e.preventDefault();

  const allTouched = { name: true, email: true, password: true };
  setTouched(allTouched);

  const errs = validate();
  setErrors(errs);

  if (Object.keys(errs).length === 0) {
    const result = login({
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      navigate("/home");
    } else {
      setErrors({ general: result.error });
    }
  }
};

  const inputClass = (field) =>
    `w-full border rounded-md p-3 placeholder-[var(--color-text)] focus:outline-none focus:ring-2 transition ${
      errors[field] && touched[field]
        ? 'border-red-500 focus:ring-red-300'
        : 'border-[var(--color-text)] focus:ring-[var(--color-primary)]'
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">

        {/* Header — logo beside name */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src={logo} alt="Hostel Help Desk Logo" className="h-10 w-auto" />
          <h1 className="text-[var(--color-text-heading)] font-bold text-2xl leading-tight">
            Hostel Help Desk
          </h1>
        </div>

        {/* Login / Report Links */}
        <div className="flex justify-center space-x-2 mb-6 text-[var(--color-text)]">
          <a href="/login" className="text-[var(--color-primary)] font-semibold">
            Login
          </a>
          <span>|</span>
          <a href="/report" className="hover:text-[var(--color-primary)] transition">
            Report Issues
          </a>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('name')}
            />
            {errors.name && touched.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('email')}
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('password')}
            />
            {errors.password && touched.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-primary)] text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Forgot Password */}
        <div className="text-center mt-4 text-[var(--color-text)]">
          <a href="/forgot-password" className="hover:text-[var(--color-primary)] transition">
            Forgot Password?
          </a>
        </div>

        {/* Sign Up */}
        <div className="mt-6 text-center text-[var(--color-text)]">
          Don't have an account?{' '}
          <a href="/signup" className="text-[var(--color-primary)] font-semibold hover:underline">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
