import React, { useState, useEffect } from "react";
import UserNavbar from "../../components/UserNavbar";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getMyReports } from "../../api/api";

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending": return "bg-yellow-500 text-white";
    case "In Progress": return "bg-blue-600 text-white";
    case "Resolved": return "bg-green-500 text-white";
    default: return "bg-gray-400 text-white";
  }
};

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 8;

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const params = filterStatus ? { status: filterStatus } : {};
        const { data } = await getMyReports(params);
        setReports(data.reports);
      } catch (err) {
        setError("Failed to load reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [filterStatus]);

  const totalPages = Math.ceil(reports.length / reportsPerPage);
  const paginatedReports = reports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleRowClick = (report) => {
    navigate("/report-details", { state: { report } });
  };

  // Normalize report fields (backend uses title, frontend was using title too — aligned)
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <UserNavbar />

      <main className="flex-1 px-4 md:px-10 py-8 flex justify-center">
        <div className="w-full max-w-4xl">

          {/* Header + Filter */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-text-heading)]">
              My Reports
            </h2>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              value={filterStatus}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading reports...</span>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm mb-4">
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && reports.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center text-gray-400 text-sm">
              No reports found. Submit your first issue from the Home page.
            </div>
          )}

          {/* Mobile View */}
          {!loading && reports.length > 0 && (
            <div className="md:hidden space-y-4">
              {paginatedReports.map((report) => (
                <div
                  key={report._id}
                  onClick={() => handleRowClick(report)}
                  className="bg-white rounded-xl shadow-md p-4 space-y-3 cursor-pointer hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-[var(--color-text-heading)]">{report.title}</h3>
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusStyle(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--color-text)]">
                    <p><span className="font-medium">Category:</span> {report.category}</p>
                    <p><span className="font-medium">Date:</span> {formatDate(report.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Desktop Table */}
          {!loading && reports.length > 0 && (
            <div className="hidden md:block">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-4 px-8 py-4 text-sm font-semibold text-gray-500 border-b border-gray-100">
                  <span>Issue</span>
                  <span>Category</span>
                  <span>Status</span>
                  <span className="text-right">Date Submitted</span>
                </div>

                {paginatedReports.map((report) => (
                  <div
                    key={report._id}
                    onClick={() => handleRowClick(report)}
                    className="grid grid-cols-4 px-8 py-5 items-center text-sm border-b border-gray-100 last:border-none hover:bg-gray-50 cursor-pointer transition"
                  >
                    <span className="font-medium text-[var(--color-text-heading)]">{report.title}</span>
                    <span className="text-gray-500">{report.category}</span>
                    <span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(report.status)}`}>
                        {report.status}
                      </span>
                    </span>
                    <span className="text-right text-gray-500">{formatDate(report.createdAt)}</span>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-6 space-x-2 text-sm">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}
                    className={`px-3 py-1.5 rounded-md border border-gray-200 text-gray-500 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}>
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-md border ${page === currentPage ? "bg-[var(--color-primary)] text-white border-none" : "border-gray-200 hover:bg-gray-100"}`}>
                      {page}
                    </button>
                  ))}
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}
                    className={`px-3 py-1.5 rounded-md border border-gray-200 text-gray-500 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}>
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Reports;
