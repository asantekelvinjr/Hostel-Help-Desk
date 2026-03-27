import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const UserNavbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm px-4 md:px-10 py-4 relative">
      
      <div className="flex items-center justify-between">
        
        {/* Left */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="logo" className="h-6 w-auto" />
          <h1 className="font-semibold text-[var(--color-text-heading)]">
            Hostel Help Desk
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-sm">
          <Link
            to="/home"
            className={`${
              isActive("/home")
                ? "text-[var(--color-primary)] font-medium"
                : "text-[var(--color-text)] hover:text-[var(--color-primary)]"
            }`}
          >
            Home
          </Link>

          <Link
            to="/reports"
            className={`${
              isActive("/reports")
                ? "text-[var(--color-primary)] font-medium"
                : "text-[var(--color-text)] hover:text-[var(--color-primary)]"
            }`}
          >
            My Reports
          </Link>
        </nav>

        {/* Right */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-sm">
              N
            </div>
            <span className="hidden sm:block text-[var(--color-text)]">
              Name
            </span>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[var(--color-text-heading)]"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md mt-2 rounded-lg p-4 flex flex-col space-y-4 md:hidden z-50">
          <Link
            to="/home"
            className={`${
              isActive("/home")
                ? "text-[var(--color-primary)] font-medium"
                : "text-[var(--color-text)]"
            }`}
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/reports"
            className={`${
              isActive("/reports")
                ? "text-[var(--color-primary)] font-medium"
                : "text-[var(--color-text)]"
            }`}
            onClick={() => setOpen(false)}
          >
            My Reports
          </Link>
        </div>
      )}
    </header>
  );
};

export default UserNavbar;
