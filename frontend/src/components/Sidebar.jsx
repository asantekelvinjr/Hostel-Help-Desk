import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Folder,
  Users,
  LogOut,
} from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const baseLink =
    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md mx-2 transition";

  return (
    <>
      {/* Mobile Overlay */}
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
        {/* TOP SECTION */}
        <div className="flex flex-col flex-1">
          
          {/* Logo */}
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800 tracking-tight">
              Hostel Help Desk
            </h2>
          </div>

          {/* Navigation */}
          <nav className="mt-6 space-y-3 px-2 overflow-y-auto">
            
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `${baseLink} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/reports"
              className={({ isActive }) =>
                `${baseLink} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <FileText size={18} />
              Manage Reports
            </NavLink>

            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `${baseLink} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Folder size={18} />
              Categories
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `${baseLink} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Users size={18} />
              Users
            </NavLink>

          </nav>
        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t border-gray-100 p-4">
          
          <div className="flex items-center gap-3 mb-4">
            <img
              src="https://i.pravatar.cc/40"
              alt="Admin"
              className="w-9 h-9 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">Admin</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition">
            <LogOut size={16} />
            Logout
          </button>

        </div>
      </div>
    </>
  );
};

export default Sidebar;