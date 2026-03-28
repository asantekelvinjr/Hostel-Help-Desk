import React, { useState, useEffect } from "react";
import { Plus, Search, Eye, Trash2, Filter, X, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCategories, createCategory, deleteCategory } from "../../api/api";

const ITEMS_PER_PAGE = 5;

const getStatusStyle = (status) => {
  switch (status) {
    case "Active":   return "bg-green-500 text-white";
    case "Inactive": return "bg-gray-400 text-white";
    default:         return "bg-gray-200 text-gray-600";
  }
};

const DeleteModal = ({ category, onConfirm, onCancel, deleting }) => (
  <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
    <div className="bg-white w-full sm:max-w-sm sm:mx-4 rounded-t-2xl sm:rounded-xl shadow-xl p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-1">Delete Category?</h3>
      <p className="text-sm text-gray-500 text-center mb-1">You're about to delete:</p>
      <p className="text-sm font-semibold text-gray-700 text-center mb-2">"{category.name}"</p>
      <p className="text-xs text-gray-400 text-center mb-6">This action cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onCancel}
          className="flex-1 py-2.5 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={deleting}
          className="flex-1 py-2.5 text-sm rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition flex items-center justify-center gap-1.5 disabled:opacity-60">
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Delete
        </button>
      </div>
    </div>
  </div>
);

const AdminCategories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterReports, setFilterReports] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "", status: "Active" });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await getCategories();
      setCategories(data.categories);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // Filter + sort
  let filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  if (filterStatus) filtered = filtered.filter((c) => c.status === filterStatus);
  if (filterReports === "asc")  filtered = [...filtered].sort((a, b) => (a.totalReports || 0) - (b.totalReports || 0));
  if (filterReports === "desc") filtered = [...filtered].sort((a, b) => (b.totalReports || 0) - (a.totalReports || 0));
  if (filterDate === "newest")  filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (filterDate === "oldest")  filtered = [...filtered].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const showingFrom = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) { setAddError("Category name is required."); return; }
    setAdding(true);
    setAddError("");
    try {
      const { data } = await createCategory(newCategory);
      setCategories((prev) => [data.category, ...prev]);
      setNewCategory({ name: "", description: "", status: "Active" });
      setShowModal(false);
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to create category.");
    } finally {
      setAdding(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget._id);
      setCategories((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
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

      {deleteTarget && (
        <DeleteModal
          category={deleteTarget}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      {/* Title */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">Categories</h2>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500">
          <span className="font-medium text-gray-700">Total: {categories.length}</span>
          <span className="text-gray-300">|</span>
          <span>Active: {categories.filter((c) => c.status === "Active").length}</span>
          <span className="text-gray-300">|</span>
          <span>Inactive: {categories.filter((c) => c.status === "Inactive").length}</span>
        </div>
      </div>

      {/* Top bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          <input type="text" placeholder="Search categories..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <button onClick={() => setShowFilters((v) => !v)}
          className="lg:hidden flex items-center gap-1.5 border border-gray-200 bg-white text-gray-600 text-sm px-3 py-2 rounded-md hover:bg-gray-50 transition shrink-0">
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
        <button onClick={() => { setShowModal(true); setAddError(""); }}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-md transition whitespace-nowrap shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Filters */}
      <div className={`${showFilters ? "flex" : "hidden"} lg:flex flex-wrap gap-2 mb-5`}>
        <select className="text-sm border border-gray-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[140px]"
          value={filterReports} onChange={(e) => { setFilterReports(e.target.value); setCurrentPage(1); }}>
          <option value="">Total Reports ▾</option>
          <option value="asc">Least Reports</option>
          <option value="desc">Most Reports</option>
        </select>
        <select className="text-sm border border-gray-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[140px]"
          value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
          <option value="">Status ▾</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select className="text-sm border border-gray-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[140px]"
          value={filterDate} onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}>
          <option value="">Date Created ▾</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading categories...</span>
        </div>
      )}

      {/* ── DESKTOP TABLE ── */}
      {!loading && (
        <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-5 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
            <span>Category Name</span>
            <span>Total Reports</span>
            <span>Status</span>
            <span>Date Created</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-gray-100">
            {paginated.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-gray-400">No categories found.</div>
            ) : (
              paginated.map((cat) => (
                <div key={cat._id}
                  className="grid grid-cols-5 px-6 py-4 items-center text-sm text-gray-700 hover:bg-gray-50 transition">
                  <span className="font-medium text-gray-800">{cat.name}</span>
                  <span className="text-gray-600">{cat.totalReports ?? 0}</span>
                  <span>
                    <span className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusStyle(cat.status)}`}>
                      {cat.status}
                    </span>
                  </span>
                  <span className="text-gray-500">{formatDate(cat.createdAt)}</span>
                  <span className="flex justify-end gap-2">
                    <button onClick={() => navigate("/admin/category-details", { state: { category: cat } })}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md transition">
                      <Eye className="w-3 h-3" /> View
                    </button>
                    <button onClick={() => setDeleteTarget(cat)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-md transition">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Desktop Pagination */}
          <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 text-sm text-gray-500">
            <span className="mr-auto text-xs text-gray-400">Showing {showingFrom}–{showingTo} of {filtered.length}</span>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
              Previous
            </button>
            {getPageNumbers().map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-md border text-sm transition ${page === currentPage ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 hover:bg-gray-100 text-gray-600"}`}>
                {page}
              </button>
            ))}
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
              Next
            </button>
          </div>
        </div>
      )}

      {/* ── MOBILE CARDS ── */}
      {!loading && (
        <div className="md:hidden space-y-3">
          {paginated.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-10 text-center text-sm text-gray-400">
              No categories found.
            </div>
          ) : (
            paginated.map((cat) => (
              <div key={cat._id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-semibold text-gray-800 text-sm">{cat.name}</span>
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${getStatusStyle(cat.status)}`}>
                    {cat.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
                  <span><span className="text-gray-400">Reports: </span><span className="font-medium text-gray-700">{cat.totalReports ?? 0}</span></span>
                  <span><span className="text-gray-400">Created: </span><span className="font-medium text-gray-700">{formatDate(cat.createdAt)}</span></span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate("/admin/category-details", { state: { category: cat } })}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-md transition">
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  <button onClick={() => setDeleteTarget(cat)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-2 rounded-md transition">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-2 pt-1">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}
                className="flex-1 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600">
                ← Previous
              </button>
              <span className="text-xs text-gray-400 whitespace-nowrap px-1">{currentPage} / {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}
                className="flex-1 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600">
                Next →
              </button>
            </div>
          )}
          <p className="text-xs text-center text-gray-400 pb-2">Showing {showingFrom}–{showingTo} of {filtered.length}</p>
        </div>
      )}

      {/* ── ADD CATEGORY MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:max-w-md sm:mx-4 rounded-t-2xl sm:rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-800">Add New Category</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {addError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name <span className="text-red-500">*</span></label>
                <input type="text" value={newCategory.name}
                  onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Maintenance"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={newCategory.description} rows={2}
                  onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this category"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={newCategory.status}
                  onChange={(e) => setNewCategory((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleAddCategory} disabled={adding}
                className="flex-1 py-2.5 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition flex items-center justify-center gap-2 disabled:opacity-60">
                {adding && <Loader2 className="w-4 h-4 animate-spin" />}
                {adding ? "Adding..." : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
