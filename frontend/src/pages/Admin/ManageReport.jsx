import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trash2, AlertTriangle } from "lucide-react";

const initialReports = [
  { id: 101, issue: "No Water in Bathroom", category: "Plumbing", priority: "High", status: "Pending", date: "Mar 4, 2026", assigned: "Unassigned" },
  { id: 102, issue: "Wi-Fi not working", category: "Internet", priority: "Medium", status: "In Progress", date: "Mar 1, 2026", assigned: "John" },
  { id: 103, issue: "Broken Bed Frame", category: "Furniture", priority: "High", status: "Resolved", date: "Feb 16, 2026", assigned: "Michael" },
  { id: 104, issue: "Noise Disturbance", category: "Social", priority: "Medium", status: "Resolved", date: "Feb 24, 2026", assigned: "Michael" },
  { id: 105, issue: "Light not working", category: "Electricity", priority: "High", status: "Pending", date: "Mar 5, 2026", assigned: "Unassigned" },
  { id: 106, issue: "Leaking Pipe", category: "Plumbing", priority: "High", status: "In Progress", date: "Mar 6, 2026", assigned: "James" },
  { id: 107, issue: "Broken Window", category: "Maintenance", priority: "Medium", status: "Pending", date: "Mar 7, 2026", assigned: "Unassigned" },
  { id: 108, issue: "Roach Infestation", category: "Sanitation", priority: "High", status: "Pending", date: "Mar 7, 2026", assigned: "Unassigned" },
  { id: 109, issue: "No Hot Water", category: "Plumbing", priority: "High", status: "In Progress", date: "Mar 3, 2026", assigned: "James" },
  { id: 110, issue: "Faulty Door Lock", category: "Security", priority: "High", status: "Resolved", date: "Feb 28, 2026", assigned: "Emma" },
  { id: 111, issue: "Blocked Drain", category: "Plumbing", priority: "Medium", status: "Resolved", date: "Feb 20, 2026", assigned: "James" },
  { id: 112, issue: "Broken Chair", category: "Furniture", priority: "Low", status: "Pending", date: "Mar 6, 2026", assigned: "Unassigned" },
  { id: 113, issue: "AC not cooling", category: "Electricity", priority: "High", status: "In Progress", date: "Mar 2, 2026", assigned: "John" },
  { id: 114, issue: "Missing Mattress", category: "Furniture", priority: "Medium", status: "Resolved", date: "Feb 10, 2026", assigned: "Emma" },
  { id: 115, issue: "Slow Internet", category: "Internet", priority: "Low", status: "In Progress", date: "Mar 5, 2026", assigned: "John" },
  { id: 116, issue: "Smoke Alarm Beeping", category: "Electricity", priority: "High", status: "Pending", date: "Mar 8, 2026", assigned: "Unassigned" },
  { id: 117, issue: "Dirty Common Area", category: "Sanitation", priority: "Medium", status: "Resolved", date: "Feb 22, 2026", assigned: "Emma" },
  { id: 118, issue: "Broken Wardrobe", category: "Furniture", priority: "Low", status: "Resolved", date: "Feb 14, 2026", assigned: "Michael" },
  { id: 119, issue: "Power Outage - Room 12", category: "Electricity", priority: "High", status: "Resolved", date: "Feb 18, 2026", assigned: "John" },
  { id: 120, issue: "Broken Shower Head", category: "Plumbing", priority: "Medium", status: "Pending", date: "Mar 8, 2026", assigned: "Unassigned" },
];

const CATEGORIES = ["All Categories", "Plumbing", "Internet", "Furniture", "Electricity", "Social", "Maintenance", "Sanitation", "Security"];
const PRIORITIES = ["All Priorities", "High", "Medium", "Low"];
const STATUSES = ["All Statuses", "Pending", "In Progress", "Resolved"];
const PAGE_SIZE = 8;

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending": return "bg-yellow-100 text-yellow-700";
    case "In Progress": return "bg-blue-100 text-blue-700";
    case "Resolved": return "bg-green-100 text-green-700";
    default: return "bg-gray-100 text-gray-600";
  }
};

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "High": return "bg-red-100 text-red-600";
    case "Medium": return "bg-orange-100 text-orange-600";
    case "Low": return "bg-gray-100 text-gray-500";
    default: return "bg-gray-100 text-gray-600";
  }
};

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
const DeleteModal = ({ report, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

    {/* Card */}
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
      {/* Warning icon */}
      <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>

      <h3 className="text-lg font-semibold text-gray-800 text-center mb-1">Delete Report?</h3>
      <p className="text-sm text-gray-500 text-center mb-1">You're about to delete:</p>
      <p className="text-sm font-semibold text-gray-700 text-center mb-2">"{report.issue}"</p>
      <p className="text-xs text-gray-400 text-center mb-6">This action cannot be undone.</p>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const ManageReport = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [reports, setReports] = useState(initialReports);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [priority, setPriority] = useState("All Priorities");
  const [status, setStatus] = useState("All Statuses");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Pre-apply filter when navigating from dashboard cards
  useEffect(() => {
    const incoming = location.state?.filter;
    if (incoming !== undefined) {
      setStatus(incoming === "" ? "All Statuses" : incoming);
    }
  }, [location.state]);

  const filtered = reports.filter((r) => {
    const matchSearch = r.issue.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All Categories" || r.category === category;
    const matchPriority = priority === "All Priorities" || r.priority === priority;
    const matchStatus = status === "All Statuses" || r.status === status;
    return matchSearch && matchCategory && matchPriority && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilter = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const handleConfirmDelete = () => {
    setReports((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
    if (paginated.length === 1 && page > 1) setPage((p) => p - 1);
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          report={deleteTarget}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Reports</h2>
        <p className="text-gray-400 text-sm mt-1">
          {filtered.length} report{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search reports..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={handleFilter(setSearch)}
        />
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          value={category}
          onChange={handleFilter(setCategory)}
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          value={priority}
          onChange={handleFilter(setPriority)}
        >
          {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          value={status}
          onChange={handleFilter(setStatus)}
        >
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        {(search || category !== "All Categories" || priority !== "All Priorities" || status !== "All Statuses") && (
          <button
            onClick={() => { setSearch(""); setCategory("All Categories"); setPriority("All Priorities"); setStatus("All Statuses"); setPage(1); }}
            className="border border-gray-200 text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-6 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
          <span>Issue</span>
          <span>Category</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Assigned To</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-gray-50">
          {paginated.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">No reports match your filters.</div>
          ) : (
            paginated.map((report) => (
              <div
                key={report.id}
                className="grid grid-cols-6 px-6 py-4 text-sm items-center hover:bg-gray-50 transition"
              >
                <span className="font-medium text-gray-800 truncate pr-2">{report.issue}</span>
                <span className="text-gray-500">{report.category}</span>
                <span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyle(report.priority)}`}>
                    {report.priority}
                  </span>
                </span>
                <span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(report.status)}`}>
                    {report.status}
                  </span>
                </span>
                <span className="text-gray-500 text-xs">{report.assigned}</span>
                <div className="flex gap-2">
                  {/* View → navigate to ViewReport, passing the full report object */}
                  <button
                    onClick={() => navigate("/admin/view-report", { state: { report } })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs transition"
                  >
                    View
                  </button>
                  {/* Delete → open confirmation modal */}
                  <button
                    onClick={() => setDeleteTarget(report)}
                    className="bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1.5 rounded-lg text-xs transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-6 gap-1 text-sm">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition text-gray-600"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1.5 border rounded-lg transition ${
              p === page ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-100 text-gray-600"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition text-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageReport;