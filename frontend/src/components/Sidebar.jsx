import React, { useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, Folder, Users, LogOut, Camera } from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen, avatar, setAvatar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const baseLink =
    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md mx-2 transition";

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
      // TODO: upload to backend when profile endpoint is ready
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed md:static z-50 top-0 left-0 min-h-screen w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* TOP */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Logo + Name side by side */}
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
            <img src={logo} alt="logo" className="h-7 w-auto shrink-0" />
            <h2 className="text-sm font-semibold text-gray-800 leading-tight">
              Hostel Help Desk
            </h2>
          </div>

          {/* Nav links */}
          <nav className="mt-5 space-y-1 px-2 flex-1 overflow-y-auto">
            <NavLink to="/admin" end
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink to="/admin/reports"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
              <FileText size={18} />
              Manage Reports
            </NavLink>

            <NavLink to="/admin/categories"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
              <Folder size={18} />
              Categories
            </NavLink>

            <NavLink to="/admin/users"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
              <Users size={18} />
              Users
            </NavLink>
          </nav>
        </div>

        {/* BOTTOM — Profile + Logout */}
        <div className="border-t border-gray-100 p-4 shrink-0">

          {/* Avatar + info */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Change profile photo"
              className="relative shrink-0 group focus:outline-none">
              {avatar ? (
                <img src={avatar} alt="Admin"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500 ring-offset-1" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                  {initials}
                </div>
              )}
              {/* Camera badge on hover */}
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center ring-1 ring-white opacity-0 group-hover:opacity-100 transition">
                <Camera className="w-2.5 h-2.5 text-white" />
              </span>
            </button>

            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "Administrator"}
              </p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition">
            <LogOut size={16} />
            Logout
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
