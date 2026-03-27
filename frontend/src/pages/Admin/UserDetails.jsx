import React, { useState } from "react";
import { ChevronLeft, X, Check, Pencil, UserX, Eye } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// ── Reports per user (keyed by user id) ───────────────────
const reportsByUser = {
  1: [
    { id: 1, issue: "No Water in Bathroom",   category: "Plumbing",  priority: "High",   status: "Pending",     dateAssigned: "Mar 4, 2026" },
    { id: 2, issue: "Wi-Fi Not Working",      category: "Internet",  priority: "Medium", status: "In Progress", dateAssigned: "Mar 1, 2026" },
    { id: 3, issue: "AC not cooling",         category: "Electrical",priority: "High",   status: "In Progress", dateAssigned: "Mar 2, 2026" },
  ],
  2: [
    { id: 1, issue: "No Water in Bathroom",   category: "Plumbing",  priority: "High",   status: "Pending",     dateAssigned: "Mar 4, 2026" },
    { id: 2, issue: "Water leak in Room 12",  category: "Plumbing",  priority: "Medium", status: "In Progress", dateAssigned: "Mar 1, 2026" },
    { id: 3, issue: "Broken Bed Frame",       category: "Furniture", priority: "High",   status: "Resolved",    dateAssigned: "Feb 16, 2026" },
    { id: 4, issue: "Noise Disturbance",      category: "Social",    priority: "Low",    status: "Resolved",    dateAssigned: "Feb 24, 2026" },
    { id: 5, issue: "Wi-Fi Not Working",      category: "Internet",  priority: "Medium", status: "Pending",     dateAssigned: "Feb 20, 2026" },
    { id: 6, issue: "Broken Sink Pipe",       category: "Plumbing",  priority: "High",   status: "In Progress", dateAssigned: "Feb 18, 2026" },
    { id: 7, issue: "Pest in Room 5",         category: "Pest Control",priority: "Medium",status: "In Progress",dateAssigned: "Feb 10, 2026" },
    { id: 8, issue: "Light Flickering",       category: "Electrical",priority: "Low",    status: "Resolved",    dateAssigned: "Feb 5, 2026" },
  ],
  3: [
    { id: 1, issue: "Broken Window",          category: "Maintenance",priority: "Medium",status: "Pending",     dateAssigned: "Mar 7, 2026" },
    { id: 2, issue: "Faulty Door Lock",       category: "Security",  priority: "High",   status: "Resolved",    dateAssigned: "Feb 28, 2026" },
    { id: 3, issue: "Blocked Drain",          category: "Plumbing",  priority: "Medium", status: "Resolved",    dateAssigned: "Feb 20, 2026" },
  ],
};

const defaultReports = [
  { id: 1, issue: "General Issue #1", category: "Maintenance", priority: "Medium", status: "Pending",  dateAssigned: "Mar 1, 2026" },
  { id: 2, issue: "General Issue #2", category: "Social",      priority: "Low",    status: "Resolved", dateAssigned: "Feb 20, 2026" },
];

const ITEMS_PER_PAGE = 4;

// ── Style Helpers ──────────────────────────────────────────
const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":     return "bg-orange-400 text-white";
    case "In Progress": return "bg-blue-500 text-white";
    case "Resolved":    return "bg-green-500 text-white";
    case "Active":      return "bg-green-500 text-white";
    case "Inactive":    return "bg-gray-400 text-white";
    default:            return "bg-gray-200 text-gray-600";
  }
};

const getRoleBadgeStyle = (role) => {
  switch (role) {
    case "Admin":     return "bg-blue-600 text-white";
    case "Moderator": return "bg-gray-700 text-white";
    case "Student":   return "bg-teal-500 text-white";
    default:          return "bg-gray-200 text-gray-600";
  }
};

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "High":   return "bg-red-500 text-white";
    case "Medium": return "bg-orange-400 text-white";
    case "Low":    return "bg-blue-400 text-white";
    default:       return "bg-gray-200 text-gray-600";
  }
};

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

// ── Component ──────────────────────────────────────────────
const UserDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read user passed from AdminUsers; fall back to a default
  const incoming = location.state?.user ?? {
    id: 2,
    name: "Kezia Brown",
    email: "keziabrown@gmail.com",
    role: "Moderator",
    reportsAssigned: 12,
    lastActive: "Mar 4, 2026",
  };

  const assignedReports = reportsByUser[incoming.id] ?? defaultReports;

  const [user, setUser] = useState({
    ...incoming,
    avatar: null,
    status: "Active",
    dateCreated: "Feb 10, 2026",
    totalTickets: assignedReports.length,
    stats: {
      reportsAssigned: assignedReports.length,
      pending:    assignedReports.filter((r) => r.status === "Pending").length,
      inProgress: assignedReports.filter((r) => r.status === "In Progress").length,
      resolved:   assignedReports.filter((r) => r.status === "Resolved").length,
    },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: user.name, email: user.email, role: user.role });

  const totalPages = Math.ceil(assignedReports.length / ITEMS_PER_PAGE);
  const paginated = assignedReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const showingFrom = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(currentPage * ITEMS_PER_PAGE, assignedReports.length);

  const handleEditSave = () => {
    setUser((prev) => ({ ...prev, ...editForm }));
    setShowEditModal(false);
  };

  const handleDeactivate = () => {
    setUser((prev) => ({
      ...prev,
      status: prev.status === "Active" ? "Inactive" : "Active",
    }));
    setShowDeactivateModal(false);
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

      {/* ── Back ── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Users
      </button>

      {/* ── Title + Actions ── */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Users / <span className="text-gray-900">{user.name}</span>
        </h2>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => {
              setEditForm({ name: user.name, email: user.email, role: user.role });
              setShowEditModal(true);
            }}
            className="flex items-center gap-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium px-3 sm:px-4 py-2 rounded-md transition"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit User</span>
            <span className="sm:hidden">Edit</span>
          </button>
          <button
            onClick={() => setShowDeactivateModal(true)}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-md transition"
          >
            <UserX className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{user.status === "Active" ? "Deactivate User" : "Activate User"}</span>
            <span className="sm:hidden">{user.status === "Active" ? "Deactivate" : "Activate"}</span>
          </button>
        </div>
      </div>

      {/* ── Profile Card ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Profile info */}
          <div className="lg:col-span-2">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${getAvatarColor(user.name)}`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-base sm:text-lg">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>

            {/* Fields grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-xs text-gray-400 mb-1">Role</p>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${getRoleBadgeStyle(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Date Created</p>
                <p className="text-sm font-medium text-gray-800">{user.dateCreated}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusStyle(user.status)}`}>
                  {user.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Total Tickets</p>
                <p className="text-sm font-medium text-gray-800">{user.totalTickets}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Last Active</p>
                <p className="text-sm font-medium text-gray-800">{user.lastActive}</p>
              </div>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="lg:border-l border-t lg:border-t-0 border-gray-100 lg:pl-6 pt-4 lg:pt-0">
            <p className="text-sm font-semibold text-gray-700 mb-3">User Stats</p>
            <div className="space-y-2.5">
              {[
                { label: "Reports Assigned", value: user.stats.reportsAssigned },
                { label: "Pending",           value: user.stats.pending },
                { label: "In Progress",       value: user.stats.inProgress },
                { label: "Resolved",          value: user.stats.resolved },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{stat.label} :</span>
                  <span className="font-semibold text-gray-800">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Assigned Reports ── */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Assigned Reports</h3>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
          <span className="col-span-2">Issue</span>
          <span>Category</span>
          <span>Priority</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-gray-100">
          {paginated.map((report) => (
            <div
              key={report.id}
              className="grid grid-cols-5 px-6 py-4 items-center text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <span className="col-span-2 font-medium text-gray-800 pr-4 leading-snug">{report.issue}</span>
              <span className="text-blue-500 font-medium">{report.category}</span>
              <span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getPriorityStyle(report.priority)}`}>
                  {report.priority}
                </span>
              </span>
              <span className="flex items-center justify-between gap-2">
                <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getStatusStyle(report.status)}`}>
                  {report.status}
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="text-gray-400 text-xs whitespace-nowrap">{report.dateAssigned}</span>
                  <button
                    onClick={() => navigate("/admin/view-report", { state: { report } })}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md transition"
                  >
                    <Eye className="w-3 h-3" /> View
                  </button>
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Desktop Pagination */}
        <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 text-sm">
          <span className="mr-auto text-xs text-gray-400">
            Showing {showingFrom}–{showingTo} of {assignedReports.length}
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
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600"
          >
            Next
          </button>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {paginated.map((report) => (
          <div key={report.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="font-semibold text-gray-800 text-sm leading-snug">{report.issue}</span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${getStatusStyle(report.status)}`}>
                {report.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 mb-4">
              <span>
                <span className="text-gray-400">Category: </span>
                <span className="text-blue-500 font-medium">{report.category}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-gray-400">Priority:</span>
                <span className={`px-2 py-0.5 rounded-md font-medium ${getPriorityStyle(report.priority)}`}>
                  {report.priority}
                </span>
              </span>
              <span>
                <span className="text-gray-400">Date: </span>
                <span className="font-medium text-gray-700">{report.dateAssigned}</span>
              </span>
            </div>
            <button
              onClick={() => navigate("/admin/view-report", { state: { report } })}
              className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-md transition"
            >
              <Eye className="w-3.5 h-3.5" /> View Report
            </button>
          </div>
        ))}

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
          Showing {showingFrom}–{showingTo} of {assignedReports.length}
        </p>
      </div>

      {/* ── EDIT MODAL ── */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:max-w-md sm:mx-4 rounded-t-2xl sm:rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-800">Edit User</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 transition p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Student">Student</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleEditSave} className="flex-1 py-2.5 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DEACTIVATE CONFIRM MODAL ── */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:max-w-sm sm:mx-4 rounded-t-2xl sm:rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {user.status === "Active" ? "Deactivate User" : "Activate User"}
              </h3>
              <button onClick={() => setShowDeactivateModal(false)} className="text-gray-400 hover:text-gray-600 transition p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to{" "}
              <span className="font-semibold text-gray-800">
                {user.status === "Active" ? "deactivate" : "activate"}
              </span>{" "}
              <span className="font-semibold text-gray-800">{user.name}</span>?
              {user.status === "Active" && " They will lose access to the system."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeactivateModal(false)} className="flex-1 py-2.5 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                className={`flex-1 py-2.5 text-sm rounded-md font-medium transition flex items-center justify-center gap-1.5 text-white ${
                  user.status === "Active" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                <UserX className="w-4 h-4" />
                {user.status === "Active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDetails;