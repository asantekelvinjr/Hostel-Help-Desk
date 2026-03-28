import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import Sidebar from "../../components/Sidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Shared avatar state — both Navbar and Sidebar stay in sync
  const [avatar, setAvatar] = useState(null);

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        avatar={avatar}
        setAvatar={setAvatar}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar
          setSidebarOpen={setSidebarOpen}
          avatar={avatar}
          setAvatar={setAvatar}
        />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
