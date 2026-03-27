import React from "react";
import { Bell, Menu } from "lucide-react";

const AdminNavbar = ({ setSidebarOpen }) => {
  return (
    <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Menu
          className="md:hidden cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        />

        <h1 className="text-lg font-semibold text-gray-700">
          Admin Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />

        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium text-gray-600">Admin</span>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;