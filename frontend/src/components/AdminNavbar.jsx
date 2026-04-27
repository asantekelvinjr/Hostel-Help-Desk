import React, { useRef, useState, useEffect } from "react";
import { Bell, Menu, Camera, CheckCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Shared mock notifications — in production this would come from your API
export const NOTIFICATIONS = [
  { id: 1, type: "report",   title: "New report submitted",         body: "Kelvin reported: Wi-Fi not working",          time: "2 mins ago",  read: false },
  { id: 2, type: "update",   title: "Report status updated",        body: "Water leak in Room 12 marked In Progress",    time: "10 mins ago", read: false },
  { id: 3, type: "resolved", title: "Report resolved",              body: "Broken Bed Frame has been resolved",          time: "30 mins ago", read: false },
  { id: 4, type: "report",   title: "New report submitted",         body: "Emma reported: Light not working in Room 7",  time: "1 hour ago",  read: true  },
  { id: 5, type: "update",   title: "Report assigned",              body: "AC not cooling assigned to Tech Team",        time: "2 hours ago", read: true  },
];

const typeIcon = (type) => {
  switch (type) {
    case "report":   return "🆕";
    case "update":   return "🔄";
    case "resolved": return "✅";
    default:         return "📌";
  }
};

const AdminNavbar = ({ setSidebarOpen, avatar, setAvatar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        bellRef.current && !bellRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const markAllRead = (e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleViewAll = () => {
    setShowDropdown(false);
    navigate("/admin/notifications");
  };

  const handleNotificationClick = (n) => {
    markOneRead(n.id);
    setShowDropdown(false);
    navigate("/admin/notifications");
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

        {/* Bell + Dropdown */}
        <div className="relative">
          <button
            ref={bellRef}
            onClick={() => setShowDropdown((v) => !v)}
            className="relative p-1.5 rounded-md hover:bg-gray-100 transition focus:outline-none">
            <Bell className="w-5 h-5 text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-10 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition">
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification list — latest 4 */}
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {notifications.slice(0, 4).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-start gap-3 ${!n.read ? "bg-blue-50/40" : ""}`}>
                    <span className="text-lg shrink-0 mt-0.5">{typeIcon(n.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm truncate ${!n.read ? "font-semibold text-gray-800" : "font-medium text-gray-600"}`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{n.body}</p>
                      <p className="text-xs text-gray-300 mt-1">{n.time}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-4 py-2.5">
                <button
                  onClick={handleViewAll}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition">
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Change profile photo"
          className="flex items-center gap-2 focus:outline-none group cursor-pointer">
          <div className="relative w-8 h-8 shrink-0">
            {avatar ? (
              <img src={avatar} alt="Admin"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500 ring-offset-1" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                {initials}
              </div>
            )}
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
