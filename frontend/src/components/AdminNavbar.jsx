import React, { useRef } from "react";
import { Bell, Menu, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminNavbar = ({ setSidebarOpen, avatar, setAvatar }) => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
      // TODO: upload to backend when profile endpoint is ready
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  return (
    <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">

      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-1 rounded-md hover:bg-gray-100 transition">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-base sm:text-lg font-semibold text-gray-700">
          Admin Dashboard
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 sm:gap-5">

        {/* Bell */}
        <button className="relative p-1 rounded-md hover:bg-gray-100 transition">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar — click to upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Change profile photo"
          className="flex items-center gap-2 focus:outline-none group">
          <div className="relative w-8 h-8 shrink-0">
            {avatar ? (
              <img src={avatar} alt="Admin"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500 ring-offset-1" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                {initials}
              </div>
            )}
            {/* Camera badge on hover */}
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center ring-1 ring-white opacity-0 group-hover:opacity-100 transition">
              <Camera className="w-2.5 h-2.5 text-white" />
            </span>
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-600">
            {user?.name || "Admin"}
          </span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>
    </div>
  );
};

export default AdminNavbar;
