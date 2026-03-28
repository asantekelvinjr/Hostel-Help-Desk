import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser } from "../../api/api";

const ITEMS_PER_PAGE = 8;

const getRoleStyle = (role) => {
  switch (role) {
    case "admin": return "text-blue-700 font-bold";
    default: return "text-gray-700 font-semibold";
  }
};

const getInitial = (name) => name?.charAt(0).toUpperCase() || "?";

const getAvatarColor = (name = "") => {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-green-100 text-green-700",
    "bg-orange-100 text-orange-700",
    "bg-red-100 text-red-700",
    "bg-teal-100 text-teal-700",
  ];
  return colors[name.charCodeAt(0) % colors.length];
};

const DeleteModal = ({ user, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
    <div className="bg-white w-full sm:max-w-sm sm:mx-4 rounded-t-2xl sm:rounded-xl shadow-xl p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-1">Delete User?</h3>
      <p className="text-sm text-gray-500 text-center mb-1">You're about to delete:</p>
      <p className="text-sm font-semibold text-gray-700 text-center mb-2">"{user.name}"</p>
      <p className="text-xs text-gray-400 text-center mb-6">This will also delete all their reports.</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-2.5 text-sm rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition flex items-center justify-center gap-1.5">
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  </div>
);

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await getAllUsers();
        setUsers(data.users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const showingFrom = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(deleteTarget._id);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteTarget(null);
      setDeleting(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">

      {deleteTarget && (
        <DeleteModal user={deleteTarget} onConfirm={handleConfirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}

      {/* Title + Stats */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">Users</h2>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500">
          <span className="font-semibold text-gray-700">Total Users: {users.length}</span>
          <span className="text-gray-300">|</span>
          <span>Active: {users.filter((u) => u.isActive).length}</span>
          <span className="text-gray-300">|</span>
          <span>Inactive: {users.filter((u) => !u.isActive).length}</span>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          <input type="text" placeholder="Search users..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading users...</span>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-14 text-center text-gray-400 text-sm">
          No users found.
        </div>
      )}

      {/* Mobile Cards */}
      {!loading && paginated.length > 0 && (
        <div className="md:hidden space-y-3">
          {paginated.map((user) => (
            <div key={user._id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${getAvatarColor(user.name)}`}>
                  {getInitial(user.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <span className={`text-xs shrink-0 px-2 py-0.5 rounded-md ${user.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
                <span><span className="text-gray-400">Room: </span><span className="font-medium text-gray-700">{user.roomNumber || "—"}</span></span>
                <span><span className="text-gray-400">Joined: </span><span className="font-medium text-gray-700">{formatDate(user.createdAt)}</span></span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate("/admin/user-details", { state: { user } })}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-md transition">
                  View
                </button>
                <button onClick={() => setDeleteTarget(user)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-2 rounded-md transition flex items-center justify-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop Table */}
      {!loading && paginated.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-5 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
            <span className="col-span-2">User</span>
            <span>Room</span>
            <span>Status</span>
            <span>Joined</span>
          </div>

          <div className="divide-y divide-gray-100">
            {paginated.map((user) => (
              <div key={user._id}
                className="grid grid-cols-5 px-6 py-4 items-center text-sm text-gray-700 hover:bg-gray-50 transition">
                <div className="col-span-2 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${getAvatarColor(user.name)}`}>
                    {getInitial(user.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <span className="text-gray-600">{user.roomNumber || "—"}</span>
                <span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </span>
                <span className="flex items-center justify-between gap-2">
                  <span className="text-gray-500 text-xs">{formatDate(user.createdAt)}</span>
                  <span className="flex gap-2 shrink-0">
                    <button onClick={() => navigate("/admin/user-details", { state: { user } })}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md transition">
                      View
                    </button>
                    <button onClick={() => setDeleteTarget(user)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-md transition">
                      Delete
                    </button>
                  </span>
                </span>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 text-sm">
            <span className="mr-auto text-xs text-gray-400">Showing {showingFrom}–{showingTo} of {filtered.length}</span>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600">
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-md border text-sm transition ${page === currentPage ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-100 text-gray-600"}`}>
                {page}
              </button>
            ))}
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Mobile Pagination */}
      {!loading && totalPages > 1 && (
        <div className="md:hidden flex items-center justify-between gap-2 mt-4">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}
            className="flex-1 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 transition text-gray-600">
            ← Previous
          </button>
          <span className="text-xs text-gray-400 whitespace-nowrap">{currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}
            className="flex-1 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 transition text-gray-600">
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
