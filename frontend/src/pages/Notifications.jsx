import React, { useState } from "react";
import { CheckCheck, Trash2, Bell, Filter } from "lucide-react";
import { NOTIFICATIONS } from "../components/AdminNavbar";

const FILTERS = ["All", "Unread", "Reports", "Updates", "Resolved"];

const typeIcon = (type) => {
  switch (type) {
    case "report":   return "🆕";
    case "update":   return "🔄";
    case "resolved": return "✅";
    default:         return "📌";
  }
};

const typeBadge = (type) => {
  switch (type) {
    case "report":   return "bg-blue-100 text-blue-700";
    case "update":   return "bg-orange-100 text-orange-700";
    case "resolved": return "bg-green-100 text-green-700";
    default:         return "bg-gray-100 text-gray-600";
  }
};

const typeLabel = (type) => {
  switch (type) {
    case "report":   return "New Report";
    case "update":   return "Update";
    case "resolved": return "Resolved";
    default:         return "General";
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState("All");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (activeFilter === "All")      return true;
    if (activeFilter === "Unread")   return !n.read;
    if (activeFilter === "Reports")  return n.type === "report";
    if (activeFilter === "Updates")  return n.type === "update";
    if (activeFilter === "Resolved") return n.type === "resolved";
    return true;
  });

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markOneRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, read: true } : n)
    );

  const deleteOne = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const clearAll = () => setNotifications([]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Notifications</h2>
          <p className="text-sm text-gray-400 mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 text-sm font-medium px-3 py-2 rounded-lg transition">
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Mark all read</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium px-3 py-2 rounded-lg transition">
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear all</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              activeFilter === f
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}>
            {f}
            {f === "Unread" && unreadCount > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 flex flex-col items-center justify-center gap-3 text-gray-400">
          <Bell className="w-10 h-10 text-gray-200" />
          <p className="text-sm font-medium">No notifications here</p>
          <p className="text-xs text-gray-300">
            {activeFilter !== "All" ? "Try switching to All" : "You're all caught up!"}
          </p>
        </div>
      )}

      {/* Notification list */}
      {filtered.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 transition group ${
                  !n.read ? "bg-blue-50/30" : ""
                }`}>

                {/* Icon */}
                <div className="text-2xl shrink-0 mt-0.5">{typeIcon(n.type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeBadge(n.type)}`}>
                      {typeLabel(n.type)}
                    </span>
                    {!n.read && (
                      <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${!n.read ? "font-semibold text-gray-800" : "font-medium text-gray-600"}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.body}</p>
                  <p className="text-xs text-gray-300 mt-1">{n.time}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                  {!n.read && (
                    <button
                      onClick={() => markOneRead(n.id)}
                      title="Mark as read"
                      className="p-1.5 rounded-md hover:bg-blue-100 text-blue-500 transition">
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteOne(n.id)}
                    title="Delete"
                    className="p-1.5 rounded-md hover:bg-red-100 text-red-400 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Count */}
      {filtered.length > 0 && (
        <p className="text-xs text-center text-gray-300 mt-4">
          Showing {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

export default Notifications;
