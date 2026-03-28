import React, { useState, useRef } from "react";
import logo from "../assets/logo.png";
import { Menu, X, Camera, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserNavbar = () => {
  const [open, setOpen] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
      setShowAvatarMenu(false);
      // TODO: upload to backend when profile endpoint is ready
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get initials from real user name
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="bg-white shadow-sm px-4 md:px-10 py-4 relative z-30">
      <div className="flex items-center justify-between">

        {/* Logo + Name */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="logo" className="h-6 w-auto" />
          <h1 className="font-semibold text-[var(--color-text-heading)]">
            Hostel Help Desk
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-sm">
          <Link to="/home"
            className={isActive("/home")
              ? "text-[var(--color-primary)] font-medium"
              : "text-[var(--color-text)] hover:text-[var(--color-primary)]"}>
            Home
          </Link>
          <Link to="/reports"
            className={isActive("/reports")
              ? "text-[var(--color-primary)] font-medium"
              : "text-[var(--color-text)] hover:text-[var(--color-primary)]"}>
            My Reports
          </Link>
        </nav>

        {/* Right — Avatar + Hamburger */}
        <div className="flex items-center space-x-3">

          {/* Avatar button */}
          <div className="relative">
            <button
              onClick={() => setShowAvatarMenu((v) => !v)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="relative w-8 h-8 shrink-0">
                {avatar ? (
                  <img src={avatar} alt="avatar"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--color-primary)] ring-offset-1" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-semibold">
                    {initials}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[var(--color-primary)] rounded-full flex items-center justify-center ring-1 ring-white">
                  <Camera className="w-2.5 h-2.5 text-white" />
                </span>
              </div>
              {/* Real name from backend */}
              <span className="hidden sm:block text-sm text-[var(--color-text)]">
                {user?.name || "User"}
              </span>
            </button>

            {/* Dropdown menu */}
            {showAvatarMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowAvatarMenu(false)} />
                <div className="absolute right-0 top-11 z-20 bg-white rounded-xl shadow-lg border border-gray-100 w-52 overflow-hidden">

                  {/* Profile preview */}
                  <div className="px-4 pt-4 pb-3 flex flex-col items-center border-b border-gray-100">
                    {avatar ? (
                      <img src={avatar} alt="avatar"
                        className="w-14 h-14 rounded-full object-cover mb-2" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-orange-400 flex items-center justify-center text-white text-xl font-bold mb-2">
                        {initials}
                      </div>
                    )}
                    <p className="text-sm font-semibold text-gray-800">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-400 truncate max-w-full">{user?.email || ""}</p>
                    {user?.roomNumber && (
                      <p className="text-xs text-gray-400 mt-0.5">Room {user.roomNumber}</p>
                    )}
                  </div>

                  {/* Change photo */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                    <Camera className="w-4 h-4 text-[var(--color-primary)]" />
                    Change Photo
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition border-t border-gray-100">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[var(--color-text-heading)]">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md mt-1 rounded-b-lg p-4 flex flex-col space-y-3 md:hidden z-20">
          <Link to="/home"
            className={`text-sm ${isActive("/home") ? "text-[var(--color-primary)] font-medium" : "text-[var(--color-text)]"}`}
            onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/reports"
            className={`text-sm ${isActive("/reports") ? "text-[var(--color-primary)] font-medium" : "text-[var(--color-text)]"}`}
            onClick={() => setOpen(false)}>
            My Reports
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-500 pt-2 border-t border-gray-100">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default UserNavbar;
