import React, { useState } from "react";
import { ChevronLeft, Eye, Pencil, Trash2, X, Check, AlertTriangle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// ── Mock reports per category (keyed by category name) ────────────────────────
const reportsByCategory = {
  Plumbing: [
    { id: 101, issue: "No Water in Bathroom", priority: "High", status: "Pending", dateSubmitted: "Mar 4, 2026", assignedTo: "Unassigned" },
    { id: 102, issue: "Water leak in Room 12", priority: "High", status: "In Progress", dateSubmitted: "Mar 1, 2026", assignedTo: "John" },
    { id: 103, issue: "Broken Sink Pipe", priority: "Medium", status: "Resolved", dateSubmitted: "Feb 16, 2026", assignedTo: "Unassigned" },
    { id: 104, issue: "Water leak in Room 203", priority: "Medium", status: "Resolved", dateSubmitted: "Feb 24, 2026", assignedTo: "Michael" },
    { id: 105, issue: "Burst Pipe in Kitchen", priority: "High", status: "Pending", dateSubmitted: "Feb 20, 2026", assignedTo: "Unassigned" },
    { id: 106, issue: "Low Water Pressure", priority: "Medium", status: "In Progress", dateSubmitted: "Feb 18, 2026", assignedTo: "Sarah" },
  ],
  Electrical: [
    { id: 201, issue: "Light not working", priority: "High", status: "Pending", dateSubmitted: "Mar 5, 2026", assignedTo: "Unassigned" },
    { id: 202, issue: "AC not cooling", priority: "High", status: "In Progress", dateSubmitted: "Mar 2, 2026", assignedTo: "John" },
    { id: 203, issue: "Smoke Alarm Beeping", priority: "High", status: "Pending", dateSubmitted: "Mar 8, 2026", assignedTo: "Unassigned" },
    { id: 204, issue: "Power Outage - Room 12", priority: "High", status: "Resolved", dateSubmitted: "Feb 18, 2026", assignedTo: "John" },
  ],
  Internet: [
    { id: 301, issue: "Wi-Fi not working", priority: "Medium", status: "In Progress", dateSubmitted: "Mar 1, 2026", assignedTo: "John" },
    { id: 302, issue: "Slow Internet", priority: "Low", status: "In Progress", dateSubmitted: "Mar 5, 2026", assignedTo: "John" },
  ],
  Furniture: [
    { id: 401, issue: "Broken Bed Frame", priority: "High", status: "Resolved", dateSubmitted: "Feb 16, 2026", assignedTo: "Michael" },
    { id: 402, issue: "Broken Chair", priority: "Low", status: "Pending", dateSubmitted: "Mar 6, 2026", assignedTo: "Unassigned" },
    { id: 403, issue: "Missing Mattress", priority: "Medium", status: "Resolved", dateSubmitted: "Feb 10, 2026", assignedTo: "Emma" },
    { id: 404, issue: "Broken Wardrobe", priority: "Low", status: "Resolved", dateSubmitted: "Feb 14, 2026", assignedTo: "Michael" },
  ],
};

// Fallback reports for categories without specific data
const defaultReports = [
  { id: 901, issue: "General Issue #1", priority: "Medium", status: "Pending", dateSubmitted: "Mar 1, 2026", assignedTo: "Unassigned" },
  { id: 902, issue: "General Issue #2", priority: "Low", status: "Resolved", dateSubmitted: "Feb 20, 2026", assignedTo: "Emma" },
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

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "High":   return "bg-red-500 text-white";
    case "Medium": return "bg-orange-400 text-white";
    case "Low":    return "bg-gray-400 text-white";
    default:       return "bg-gray-200 text-gray-600";
  }
};

// ── Delete Report Modal ───────────────────────────────────────────────────────
const DeleteReportModal = ({ report, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
    <div className="bg-white w-full sm:max-w-sm sm:mx-4 rounded-t-2xl sm:rounded-xl shadow-xl p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-1">Delete Report?</h3>
      <p className="text-sm text-gray-500 text-center mb-1">You're about to delete:</p>
      <p className="text-sm font-semibold text-gray-700 text-center mb-2">"{report.issue}"</p>
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

// ── Component ──────────────────────────────────────────────
const CategoryDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read category passed from AdminCategories; fall back to Plumbing default
  const incoming = location.state?.category ?? {
    name: "Plumbing",
    totalReports: 18,
    status: "Active",
    dateCreated: "Feb 10, 2026",
  };

  const initialReports = reportsByCategory[incoming.name] ?? defaultReports;

  const [category, setCategory] = useState({
    name: incoming.name,
    description: `Issues related to ${incoming.name.toLowerCase()} in the hostel.`,
    status: incoming.status === "Pending" || incoming.status === "In Progress" ? "Active" : incoming.status === "Active" ? "Active" : "Inactive",
    totalReports: incoming.totalReports,
    dateCreated: incoming.dateCreated,
    stats: {
      reports: incoming.totalReports,
      pending: initialReports.filter((r) => r.status === "Pending").length,
      inProgress: initialReports.filter((r) => r.status === "In Progress").length,
      resolved: initialReports.filter((r) => r.status === "Resolved").length,
    },
  });

  const [reports, setReports] = useState(initialReports);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [deleteReportTarget, setDeleteReportTarget] = useState(null);
  const [editForm, setEditForm] = useState({
    name: category.name,
    description: category.description,
    status: category.status,
  });

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const paginated = reports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEditSave = () => {
    setCategory((prev) => ({ ...prev, ...editForm }));
    setShowEditModal(false);
  };

  const handleConfirmDeleteReport = () => {
    setReports((prev) => prev.filter((r) => r.id !== deleteReportTarget.id));
    setDeleteReportTarget(null);
    if (paginated.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">

      {/* Delete Report Modal */}
      {deleteReportTarget && (
        <DeleteReportModal
          report={deleteReportTarget}
          onConfirm={handleConfirmDeleteReport}
          onCancel={() => setDeleteReportTarget(null)}
        />
      )}

      {/* ── Back Link ── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Categories
      </button>

      {/* ── Title + Actions ── */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Categories / <span className="text-gray-900">{category.name}</span>
        </h2>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => { setEditForm({ name: category.name, description: category.description, status: category.status }); setShowEditModal(true); }}
            className="flex items-center gap-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium px-3 sm:px-4 py-2 rounded-md transition"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit Category</span>
            <span className="sm:hidden">Edit</span>
          </button>
          <button
            onClick={() => setShowDeleteCategoryModal(true)}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-md transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete Category</span>
            <span className="sm:hidden">Delete</span>
          </button>
        </div>
      </div>

      {/* ── Category Info Card ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
            <InfoRow label="Category Name" value={category.name} />
            <InfoRow label="Status" value={
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusStyle(category.status)}`}>
                {category.status}
              </span>
            } />
            <div className="sm:col-span-2">
              <InfoRow label="Description" value={category.description} />
            </div>
            <InfoRow label="Total Reports" value={category.totalReports} />
            <InfoRow label="Date Created" value={category.dateCreated} />
          </div>

          <div className="lg:border-l border-t lg:border-t-0 border-gray-100 lg:pl-6 pt-4 lg:pt-0">
            <p className="text-sm font-semibold text-gray-700 mb-3">Category Stats</p>
            <div className="space-y-2">
              {[
                { label: "Reports", value: category.stats.reports },
                { label: "Pending", value: category.stats.pending },
                { label: "In Progress", value: category.stats.inProgress },
                { label: "Resolved", value: category.stats.resolved },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{stat.label} :</span>
                  <span className="font-medium text-gray-800">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Reports Section ── */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
        Reports under this category
      </h3>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-6 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
          <span className="col-span-2">Issue</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Date Submitted</span>
          <span>Assigned To</span>
        </div>

        <div className="divide-y divide-gray-100">
          {paginated.map((report) => (
            <div
              key={report.id}
              className="grid grid-cols-6 px-6 py-4 items-center text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <span className="col-span-2 font-medium text-gray-800 pr-4">{report.issue}</span>
              <span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getPriorityStyle(report.priority)}`}>
                  {report.priority}
                </span>
              </span>
              <span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getStatusStyle(report.status)}`}>
                  {report.status}
                </span>
              </span>
              <span className="text-gray-500">{report.dateSubmitted}</span>
              <span className="flex items-center justify-between gap-2">
                <span className={report.assignedTo === "Unassigned" ? "text-gray-400 italic" : "text-gray-700"}>
                  {report.assignedTo}
                </span>
                <button
                  onClick={() => navigate("/admin/view-report", { state: { report } })}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md transition shrink-0"
                >
                  <Eye className="w-3 h-3" /> View
                </button>
              </span>
            </div>
          ))}
        </div>

        {/* Desktop Pagination */}
        <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 text-sm">
          <span className="mr-auto text-xs text-gray-400">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, reports.length)} of {reports.length}
          </span>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              <span className="flex items-center gap-1.5">
                <span className="text-gray-400">Priority:</span>
                <span className={`px-2 py-0.5 rounded-md font-medium ${getPriorityStyle(report.priority)}`}>
                  {report.priority}
                </span>
              </span>
              <span><span className="text-gray-400">Date: </span><span className="font-medium text-gray-700">{report.dateSubmitted}</span></span>
              <span><span className="text-gray-400">Assigned: </span>
                <span className={report.assignedTo === "Unassigned" ? "italic text-gray-400" : "font-medium text-gray-700"}>
                  {report.assignedTo}
                </span>
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
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, reports.length)} of {reports.length}
        </p>
      </div>

      {/* ── EDIT MODAL ── */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:max-w-md sm:mx-4 rounded-t-2xl sm:rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-800">Edit Category</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 transition p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
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

      {/* ── DELETE CATEGORY MODAL ── */}
      {showDeleteCategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:max-w-sm sm:mx-4 rounded-t-2xl sm:rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-1">Delete Category?</h3>
            <p className="text-sm text-gray-500 text-center mb-2">
              Are you sure you want to delete <span className="font-semibold text-gray-800">{category.name}</span>?
            </p>
            <p className="text-xs text-gray-400 text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteCategoryModal(false)} className="flex-1 py-2.5 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                onClick={() => { setShowDeleteCategoryModal(false); navigate(-1); }}
                className="flex-1 py-2.5 text-sm rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// ── Small helper ──
const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
    <div className="text-sm font-medium text-gray-800">{value}</div>
  </div>
);

export default CategoryDetails;