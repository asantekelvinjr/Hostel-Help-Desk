import React, { useState, useEffect } from "react";
import { ChevronLeft, UserX, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserById, toggleUserStatus } from "../../api/api";

const getStatusStyle = (isActive) =>
  isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500";

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "High": return "bg-red-100 text-red-600";
    case "Medium": return "bg-orange-100 text-orange-600";
    case "Low": return "bg-gray-100 text-gray-500";
    default: return "bg-gray-100 text-gray-600";
  }
};

const getReportStatusStyle = (status) => {
  switch (status) {
    case "Pending": return "bg-yellow-100 text-yellow-700";
    case "In Progress": return "bg-blue-100 text-blue-700";
    case "Resolved": return "bg-green-100 text-green-700";
    default: return "bg-gray-100 text-gray-600";
  }
};

const getAvatarColor = (name = "") => {
  const colors = ["bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-green-100 text-green-700", "bg-orange-100 text-orange-700", "bg-red-100 text-red-700", "bg-teal-100 text-teal-700"];
  return colors[name.charCodeAt(0) % colors.length];
};

const ITEMS_PER_PAGE = 5;

const UserDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingUser = location.state?.user;

  const [user, setUser] = useState(incomingUser || null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!incomingUser?._id) { setLoading(false); return; }
    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await getUserById(incomingUser._id);
        setUser(data.user);
        setReports(data.reports || []);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [incomingUser?._id]);

  const handleToggle = async () => {
    if (!user?._id) return;
    setToggling(true);
    try {
      const { data } = await toggleUserStatus(user._id);
      setUser((prev) => ({ ...prev, isActive: data.isActive }));
    } catch (err) {
      console.error("Toggle failed:", err);
    } finally {
      setToggling(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const paginated = reports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const showingFrom = reports.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(currentPage * ITEMS_PER_PAGE, reports.length);

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "Pending").length,
    inProgress: reports.filter((r) => r.status === "In Progress").length,
    resolved: reports.filter((r) => r.status === "Resolved").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <p className="text-gray-400">User not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">

      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition mb-4">
        <ChevronLeft className="w-4 h-4" /> Back to Users
      </button>

      {/* Title + Actions */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Users / <span className="text-gray-900">{user.name}</span>
        </h2>
        <button onClick={handleToggle} disabled={toggling}
          className={`flex items-center gap-1.5 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-md transition disabled:opacity-60 ${user.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>
          {toggling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{user.isActive ? "Deactivate User" : "Activate User"}</span>
          <span className="sm:hidden">{user.isActive ? "Deactivate" : "Activate"}</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${getAvatarColor(user.name)}`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-base sm:text-lg">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusStyle(user.isActive)}`}>
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Room Number</p>
                <p className="text-sm font-medium text-gray-800">{user.roomNumber || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Date Joined</p>
                <p className="text-sm font-medium text-gray-800">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Total Reports</p>
                <p className="text-sm font-medium text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="lg:border-l border-t lg:border-t-0 border-gray-100 lg:pl-6 pt-4 lg:pt-0">
            <p className="text-sm font-semibold text-gray-700 mb-3">Report Stats</p>
            <div className="space-y-2.5">
              {[
                { label: "Total Reports", value: stats.total },
                { label: "Pending", value: stats.pending },
                { label: "In Progress", value: stats.inProgress },
                { label: "Resolved", value: stats.resolved },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{stat.label}:</span>
                  <span className="font-semibold text-gray-800">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reports */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Submitted Reports</h3>

      {reports.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-12 text-center text-gray-400 text-sm">
          This user has not submitted any reports yet.
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {paginated.map((report) => (
              <div key={report._id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-semibold text-gray-800 text-sm leading-snug">{report.title}</span>
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 ${getReportStatusStyle(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                  <span><span className="text-gray-400">Category: </span><span className="font-medium">{report.category}</span></span>
                  <span className="flex items-center gap-1">
                    <span className="text-gray-400">Priority: </span>
                    <span className={`px-1.5 py-0.5 rounded font-medium ${getPriorityStyle(report.priority)}`}>{report.priority}</span>
                  </span>
                  <span><span className="text-gray-400">Date: </span><span className="font-medium">{formatDate(report.createdAt)}</span></span>
                </div>
                <button onClick={() => navigate("/admin/view-report", { state: { report } })}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-md transition">
                  View Report
                </button>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-5 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <span className="col-span-2">Issue</span>
              <span>Category</span>
              <span>Priority</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-gray-100">
              {paginated.map((report) => (
                <div key={report._id}
                  className="grid grid-cols-5 px-6 py-4 items-center text-sm text-gray-700 hover:bg-gray-50 transition">
                  <span className="col-span-2 font-medium text-gray-800 pr-4 truncate">{report.title}</span>
                  <span className="text-gray-500">{report.category}</span>
                  <span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getPriorityStyle(report.priority)}`}>
                      {report.priority}
                    </span>
                  </span>
                  <span className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getReportStatusStyle(report.status)}`}>
                      {report.status}
                    </span>
                    <button onClick={() => navigate("/admin/view-report", { state: { report } })}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md transition shrink-0">
                      View
                    </button>
                  </span>
                </div>
              ))}
            </div>

            {/* Desktop pagination */}
            <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 text-sm">
              <span className="mr-auto text-xs text-gray-400">Showing {showingFrom}–{showingTo} of {reports.length}</span>
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

          {/* Mobile pagination */}
          {totalPages > 1 && (
            <div className="md:hidden flex items-center justify-between gap-2 mt-3">
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
        </>
      )}
    </div>
  );
};

export default UserDetails;
