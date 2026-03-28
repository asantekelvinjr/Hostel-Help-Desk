import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trash2, AlertTriangle, Loader2, Search } from "lucide-react";
import { getAllReports, adminDeleteReport } from "../../api/api";

const CATEGORIES = ["All Categories", "Plumbing", "Internet", "Furniture", "Electricity", "Social", "Cleaning", "Maintenance", "Sanitation", "Security", "Other"];
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

const DeleteModal = ({ report, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white w-full sm:max-w-sm sm:mx-4 rounded-t-2xl sm:rounded-2xl shadow-2xl p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-1">Delete Report?</h3>
      <p className="text-sm text-gray-500 text-center mb-1">You're about to delete:</p>
      <p className="text-sm font-semibold text-gray-700 text-center mb-2">"{report.title}"</p>
      <p className="text-xs text-gray-400 text-center mb-6">This action cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onCancel}
          className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
          Cancel
        </button>
        <button onClick={onConfirm}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2">
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  </div>
);

const ManageReport = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [priority, setPriority] = useState("All Priorities");
  const [status, setStatus] = useState("All Statuses");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const incoming = location.state?.filter;
    if (incoming !== undefined) {
      setStatus(incoming === "" ? "All Statuses" : incoming);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const params = {};
        if (status !== "All Statuses") params.status = status;
        if (category !== "All Categories") params.category = category;
        if (priority !== "All Priorities") params.priority = priority;
        if (search.trim()) params.search = search.trim();
        const { data } = await getAllReports(params);
        setReports(data.reports);
        setPage(1);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [status, category, priority, search]);

  const totalPages = Math.max(1, Math.ceil(reports.length / PAGE_SIZE));
  const paginated = reports.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleConfirmDelete = async () => {
    try {
      await adminDeleteReport(deleteTarget._id);
      setReports((prev) => prev.filter((r) => r._id !== deleteTarget._id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">

      {deleteTarget && (
        <DeleteModal report={deleteTarget} onConfirm={handleConfirmDelete} onCancel={() => setDeleteTarget(null)} />
      )}

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Reports</h2>
        <p className="text-gray-400 text-sm mt-1">
          {loading ? "Loading..." : `${reports.length} report${reports.length !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search — full width on mobile */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search reports..."
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {/* Dropdowns — wrap on mobile, inline on sm+ */}
          <div className="flex flex-wrap gap-2">
            <select className="flex-1 min-w-[120px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
              value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className="flex-1 min-w-[120px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
              value={priority} onChange={(e) => setPriority(e.target.value)}>
              {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
            <select className="flex-1 min-w-[120px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
              value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Active filter pill */}
        {status !== "All Statuses" && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-400">Filtering by:</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(status)}`}>
              {status}
            </span>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading reports...</span>
        </div>
      )}

      {/* Empty */}
      {!loading && paginated.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-14 text-center text-gray-400 text-sm">
          No reports match your filters.
        </div>
      )}

      {/* ── MOBILE CARDS (below md) ── */}
      {!loading && paginated.length > 0 && (
        <div className="md:hidden space-y-3">
          {paginated.map((report) => (
            <div key={report._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              {/* Title + Status */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-gray-800 text-sm leading-snug">{report.title}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${getStatusStyle(report.status)}`}>
                  {report.status}
                </span>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 mb-4">
                <span>
                  <span className="text-gray-400">Category: </span>
                  <span className="font-medium text-gray-700">{report.category}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-gray-400">Priority: </span>
                  <span className={`px-2 py-0.5 rounded-full font-medium ${getPriorityStyle(report.priority)}`}>
                    {report.priority}
                  </span>
                </span>
                <span>
                  <span className="text-gray-400">Date: </span>
                  <span className="font-medium text-gray-700">{formatDate(report.createdAt)}</span>
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/admin/view-report", { state: { report } })}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-medium transition">
                  View
                </button>
                <button
                  onClick={() => setDeleteTarget(report)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 py-2 rounded-lg text-xs font-medium transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── DESKTOP TABLE (md+) ── */}
      {!loading && paginated.length > 0 && (
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-6 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
            <span className="col-span-2">Issue</span>
            <span>Category</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-gray-50">
            {paginated.map((report) => (
              <div key={report._id}
                className="grid grid-cols-6 px-6 py-4 text-sm items-center hover:bg-gray-50 transition">
                <span className="col-span-2 font-medium text-gray-800 truncate pr-4">{report.title}</span>
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
                <div className="flex gap-2">
                  <button onClick={() => navigate("/admin/view-report", { state: { report } })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs transition">
                    View
                  </button>
                  <button onClick={() => setDeleteTarget(report)}
                    className="bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1.5 rounded-lg text-xs transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center mt-5 gap-1 text-sm">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition text-gray-600">
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`px-3 py-1.5 border rounded-lg transition ${p === page ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-100 text-gray-600"}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition text-gray-600">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageReport;
