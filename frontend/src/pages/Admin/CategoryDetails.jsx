import React, { useState, useEffect } from "react";
import { ChevronLeft, Eye, Pencil, Trash2, X, Check, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCategoryById, updateCategory, deleteCategory } from "../../api/api";

const ITEMS_PER_PAGE = 5;

const getStatusStyle = (status) => {
  switch (status) {
    case "Active":      return "bg-green-500 text-white";
    case "Inactive":    return "bg-gray-400 text-white";
    case "Pending":     return "bg-yellow-100 text-yellow-700";
    case "In Progress": return "bg-blue-100 text-blue-700";
    case "Resolved":    return "bg-green-100 text-green-700";
    default:            return "bg-gray-200 text-gray-600";
  }
};

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "High":   return "bg-red-100 text-red-600";
    case "Medium": return "bg-orange-100 text-orange-600";
    case "Low":    return "bg-gray-100 text-gray-500";
    default:       return "bg-gray-100 text-gray-600";
  }
};

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
    <div className="text-sm font-medium text-gray-800">{value}</div>
  </div>
);

const CategoryDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingCategory = location.state?.category;

  const [category, setCategory] = useState(incomingCategory || null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: "", status: "Active" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!incomingCategory?._id) { setLoading(false); return; }
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await getCategoryById(incomingCategory._id);
        setCategory(data.category);
        setReports(data.reports || []);
      } catch (err) {
        console.error("Failed to fetch category:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [incomingCategory?._id]);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "Pending").length,
    inProgress: reports.filter((r) => r.status === "In Progress").length,
    resolved: reports.filter((r) => r.status === "Resolved").length,
  };

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const paginated = reports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleEditSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const { data } = await updateCategory(category._id, editForm);
      setCategory(data.category);
      setShowEditModal(false);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to update category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    setDeleting(true);
    try {
      await deleteCategory(category._id);
      navigate("/admin/categories");
    } catch (err) {
      console.error("Delete failed:", err);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <p className="text-gray-400">Category not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">

      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition mb-4">
        <ChevronLeft className="w-4 h-4" /> Back to Categories
      </button>

      {/* Title + Actions */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Categories / <span className="text-gray-900">{category.name}</span>
        </h2>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => { setEditForm({ name: category.name, description: category.description || "", status: category.status }); setShowEditModal(true); setSaveError(""); }}
            className="flex items-center gap-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium px-3 sm:px-4 py-2 rounded-md transition">
            <Pencil className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit Category</span>
            <span className="sm:hidden">Edit</span>
          </button>
          <button onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-md transition">
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete Category</span>
            <span className="sm:hidden">Delete</span>
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
            <InfoRow label="Category Name" value={category.name} />
            <InfoRow label="Status" value={
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusStyle(category.status)}`}>
                {category.status}
              </span>
            } />
            {category.description && (
              <div className="sm:col-span-2">
                <InfoRow label="Description" value={category.description} />
              </div>
            )}
            <InfoRow label="Total Reports" value={stats.total} />
            <InfoRow label="Date Created" value={formatDate(category.createdAt)} />
          </div>

          <div className="lg:border-l border-t lg:border-t-0 border-gray-100 lg:pl-6 pt-4 lg:pt-0">
            <p className="text-sm font-semibold text-gray-700 mb-3">Category Stats</p>
            <div className="space-y-2">
              {[
                { label: "Total",       value: stats.total },
                { label: "Pending",     value: stats.pending },
                { label: "In Progress", value: stats.inProgress },
                { label: "Resolved",    value: stats.resolved },
              ].map((s) => (
                <div key={s.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{s.label}:</span>
                  <span className="font-medium text-gray-800">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reports */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
        Reports under this category
      </h3>

      {reports.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-12 text-center text-gray-400 text-sm">
          No reports in this category yet.
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {paginated.map((report) => (
              <div key={report._id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-semibold text-gray-800 text-sm leading-snug">{report.title}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${getStatusStyle(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400">Priority:</span>
                    <span className={`px-1.5 py-0.5 rounded font-medium ${getPriorityStyle(report.priority)}`}>{report.priority}</span>
                  </span>
                  <span><span className="text-gray-400">Date: </span><span className="font-medium">{formatDate(report.createdAt)}</span></span>
                  <span>
                    <span className="text-gray-400">By: </span>
                    <span className="font-medium">{report.submittedBy?.name || "—"}</span>
                  </span>
                </div>
                <button onClick={() => navigate("/admin/view-report", { state: { report } })}
                  className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-md transition">
                  <Eye className="w-3.5 h-3.5" /> View Report
                </button>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-2 pt-1">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}
                  className="flex-1 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600">
                  ← Previous
                </button>
                <span className="text-xs text-gray-400 whitespace-nowrap">{currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}
                  className="flex-1 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600">
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-6 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <span className="col-span-2">Issue</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Date</span>
              <span>Submitted By</span>
            </div>
            <div className="divide-y divide-gray-100">
              {paginated.map((report) => (
                <div key={report._id}
                  className="grid grid-cols-6 px-6 py-4 items-center text-sm text-gray-700 hover:bg-gray-50 transition">
                  <span className="col-span-2 font-medium text-gray-800 pr-4 truncate">{report.title}</span>
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
                  <span className="text-gray-500 text-xs">{formatDate(report.createdAt)}</span>
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-gray-600 text-xs truncate">{report.submittedBy?.name || "—"}</span>
                    <button onClick={() => navigate("/admin/view-report", { state: { report } })}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md transition shrink-0">
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </span>
                </div>
              ))}
            </div>

            {/* Desktop pagination */}
            <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 text-sm">
              <span className="mr-auto text-xs text-gray-400">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, reports.length)} of {reports.length}
              </span>
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
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600">
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:max-w-md sm:mx-4 rounded-t-2xl sm:rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-800">Edit Category</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 transition p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveError && (
              <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{saveError}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input type="text" value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editForm.description} rows={3}
                  onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={editForm.status}
                  onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEditModal(false)}
                className="flex-1 py-2.5 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleEditSave} disabled={saving}
                className="flex-1 py-2.5 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition flex items-center justify-center gap-1.5 disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {showDeleteModal && (
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
              <button onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleDeleteCategory} disabled={deleting}
                className="flex-1 py-2.5 text-sm rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition flex items-center justify-center gap-1.5 disabled:opacity-60">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;
