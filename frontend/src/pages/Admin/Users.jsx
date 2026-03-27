import React, { useState } from "react";
import { Plus, Search, Filter, X, Check, Trash2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Mock Data ──────────────────────────────────────────────
const usersData = [
  { id: 1,  name: "Admin",          email: "admin@example.com",    role: "Admin",     reportsAssigned: 18, lastActive: "2 mins ago",   lastActiveDate: "2026-03-27" },
  { id: 2,  name: "Kezia Brown",    email: "alicebrown@gmail.com", role: "Moderator", reportsAssigned: 12, lastActive: "Mar 4, 2026",  lastActiveDate: "2026-03-04" },
  { id: 3,  name: "James Garner",   email: "jgarner@gmail.com",    role: "Student",   reportsAssigned: 9,  lastActive: "Feb 28, 2026", lastActiveDate: "2026-02-28" },
  { id: 4,  name: "Ronda Nimley",   email: "ronnimley@gmail.com",  role: "Student",   reportsAssigned: 4,  lastActive: "Feb 16, 2026", lastActiveDate: "2026-02-16" },
  { id: 5,  name: "Michael Asante", email: "m.asante@gmail.com",   role: "Student",   reportsAssigned: 7,  lastActive: "Mar 3, 2026",  lastActiveDate: "2026-03-03" },
  { id: 6,  name: "Sarah Osei",     email: "sarah.osei@gmail.com", role: "Moderator", reportsAssigned: 15, lastActive: "Mar 5, 2026",  lastActiveDate: "2026-03-05" },
  { id: 7,  name: "David Mensah",   email: "dmensah@gmail.com",    role: "Student",   reportsAssigned: 2,  lastActive: "Feb 10, 2026", lastActiveDate: "2026-02-10" },
  { id: 8,  name: "Linda Boateng",  email: "lboateng@gmail.com",   role: "Student",   reportsAssigned: 6,  lastActive: "Feb 22, 2026", lastActiveDate: "2026-02-22" },
  { id: 9,  name: "Ernest Kwame",   email: "ekwame@gmail.com",     role: "Moderator", reportsAssigned: 11, lastActive: "Mar 1, 2026",  lastActiveDate: "2026-03-01" },
  { id: 10, name: "Grace Adu",      email: "grace.adu@gmail.com",  role: "Student",   reportsAssigned: 3,  lastActive: "Jan 30, 2026", lastActiveDate: "2026-01-30" },
];

const ITEMS_PER_PAGE = 4;

const getRoleStyle = (role) => {
  switch (role) {
    case "Admin":     return "text-blue-700 font-bold";
    case "Moderator": return "text-purple-700 font-semibold";
    case "Student":   return "text-gray-700 font-semibold";
    default:          return "text-gray-600";
  }
};

const getInitial = (name) => name.charAt(0).toUpperCase();

const getAvatarColor = (name) => {
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

// ── Delete Confirmation Modal ──────────────────────────────
const DeleteModal = ({ user, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
    <div className="bg-white w-full sm:max-w-sm sm:mx-4 rounded-t-2xl sm:rounded-xl shadow-xl p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-1">Delete User?</h3>
      <p className="text-sm text-gray-500 text-center mb-1">You're about to delete:</p>
      <p className="text-sm font-semibold text-gray-700 text-center mb-2">"{user.name}"</p>
      <p className="text-xs text-gray-400 text-center mb-6">This action cannot be undone.</p>
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

// ── Add User Modal ─────────────────────────────────────────
const AddUserModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({ name: "", email: "", role: "Student" });

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.email.trim()) return;
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full sm:max-w-md sm:mx-4 rounded-t-2xl sm:rounded-xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-800">Add New User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. John Doe"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              placeholder="e.g. john@example.com"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
              <option value="Student">Student</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Component ──────────────────────────────────────────────
const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState(usersData);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterReports, setFilterReports] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Stats
  const totalUsers = users.length;
  const admins = users.filter((u) => u.role === "Admin").length;
  const moderators = users.filter((u) => u.role === "Moderator").length;
  const students = users.filter((u) => u.role === "Student").length;

  // Filter + sort
  let filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  if (filterRole) filtered = filtered.filter((u) => u.role === filterRole);
  if (filterReports === "asc")  filtered = [...filtered].sort((a, b) => a.reportsAssigned - b.reportsAssigned);
  if (filterReports === "desc") filtered = [...filtered].sort((a, b) => b.reportsAssigned - a.reportsAssigned);
  // Last Active sort — now actually works using the ISO lastActiveDate field
  if (filterActive === "recent") filtered = [...filtered].sort((a, b) => new Date(b.lastActiveDate) - new Date(a.lastActiveDate));
  if (filterActive === "oldest") filtered = [...filtered].sort((a, b) => new Date(a.lastActiveDate) - new Date(b.lastActiveDate));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const showingFrom = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  const handleAdd = (formData) => {
    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      reportsAssigned: 0,
      lastActive: "Just now",
      lastActiveDate: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [newUser, ...prev]);
    setShowAddModal(false);
    setCurrentPage(1);
  };

  const handleConfirmDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    setDeleteTarget(null);
    if (paginated.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, start + 2);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
      )}

      {/* ── Title + Stats ── */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">Users</h2>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500">
          <span className="font-semibold text-gray-700">Total Users: {totalUsers}</span>
          <span className="text-gray-300">|</span>
          <span>Admins: {admins}</span>
          <span className="text-gray-300">|</span>
          <span>Moderators: {moderators}</span>
          <span className="text-gray-300">|</span>
          <span>Students: {students}</span>
        </div>
      </div>

      {/* ── Top Bar ── */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search User..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className="lg:hidden flex items-center gap-1.5 border border-gray-200 bg-white text-gray-600 text-sm px-3 py-2 rounded-md hover:bg-gray-50 transition shrink-0"
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-md transition whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add User</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* ── Filters ── */}
      <div className={`${showFilters ? "flex" : "hidden"} lg:flex flex-wrap gap-2 mb-5`}>
        <select
          className="text-sm border border-gray-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[140px]"
          value={filterReports}
          onChange={(e) => { setFilterReports(e.target.value); setCurrentPage(1); }}
        >
          <option value="">Reports Assigned ▾</option>
          <option value="asc">Least First</option>
          <option value="desc">Most First</option>
        </select>
        <select
          className="text-sm border border-gray-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[140px]"
          value={filterRole}
          onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
        >
          <option value="">Role ▾</option>
          <option value="Admin">Admin</option>
          <option value="Moderator">Moderator</option>
          <option value="Student">Student</option>
        </select>
        <select
          className="text-sm border border-gray-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[140px]"
          value={filterActive}
          onChange={(e) => { setFilterActive(e.target.value); setCurrentPage(1); }}
        >
          <option value="">Last Active ▾</option>
          <option value="recent">Most Recent</option>
          <option value="oldest">Least Recent</option>
        </select>
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
          <span className="col-span-2">User</span>
          <span>Role</span>
          <span>Reports Assigned</span>
          <span>Last Active</span>
        </div>

        <div className="divide-y divide-gray-100">
          {paginated.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-400">No users found.</div>
          ) : (
            paginated.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-5 px-6 py-4 items-center text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                {/* User cell */}
                <div className="col-span-2 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${getAvatarColor(user.name)}`}>
                    {getInitial(user.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>

                <span className={getRoleStyle(user.role)}>{user.role}</span>
                <span className="text-gray-600">{user.reportsAssigned}</span>

                <span className="flex items-center justify-between gap-2">
                  <span className="text-gray-500 truncate">{user.lastActive}</span>
                  <span className="flex gap-2 shrink-0">
                    {/* View → navigate to UserDetails */}
                    <button
                      onClick={() => navigate("/admin/user-details", { state: { user } })}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setDeleteTarget(user)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-md transition"
                    >
                      Delete
                    </button>
                  </span>
                </span>
              </div>
            ))
          )}
        </div>

        {/* Desktop Pagination */}
        <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 text-sm">
          <span className="mr-auto text-xs text-gray-400">
            Showing {showingFrom}–{showingTo} of {filtered.length}
          </span>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600"
          >
            Previous
          </button>
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1.5 rounded-md border text-sm transition ${
                page === currentPage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 hover:bg-gray-100 text-gray-600"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600"
          >
            Next
          </button>
        </div>
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="md:hidden space-y-3">
        {paginated.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-10 text-center text-sm text-gray-400">
            No users found.
          </div>
        ) : (
          paginated.map((user) => (
            <div key={user.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${getAvatarColor(user.name)}`}>
                  {getInitial(user.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <span className={`text-xs shrink-0 ${getRoleStyle(user.role)}`}>{user.role}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
                <span><span className="text-gray-400">Reports: </span><span className="font-medium text-gray-700">{user.reportsAssigned}</span></span>
                <span><span className="text-gray-400">Last Active: </span><span className="font-medium text-gray-700">{user.lastActive}</span></span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/admin/user-details", { state: { user } })}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-md transition"
                >
                  View
                </button>
                <button
                  onClick={() => setDeleteTarget(user)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-2 rounded-md transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="flex-1 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600"
            >
              ← Previous
            </button>
            <span className="text-xs text-gray-400 whitespace-nowrap px-1">{currentPage} / {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="flex-1 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600"
            >
              Next →
            </button>
          </div>
        )}
        <p className="text-xs text-center text-gray-400 pb-2">
          Showing {showingFrom}–{showingTo} of {filtered.length}
        </p>
      </div>

    </div>
  );
};

export default AdminUsers;