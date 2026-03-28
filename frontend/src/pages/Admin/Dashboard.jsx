import React, { useState, useEffect } from "react";
import { FileText, Clock, RefreshCw, CheckCircle, ArrowUpRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllReports, getAllUsers } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

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
    default: return "bg-gray-100 text-gray-600";
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await getAllReports({});
        const all = data.reports;
        setReports(all.slice(0, 10)); // show latest 10 in dashboard table
        setStats({
          total: all.length,
          pending: all.filter((r) => r.status === "Pending").length,
          inProgress: all.filter((r) => r.status === "In Progress").length,
          resolved: all.filter((r) => r.status === "Resolved").length,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredReports = filterStatus
    ? reports.filter((r) => r.status === filterStatus)
    : reports;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const cards = [
    { title: "Total Reports", value: stats.total, icon: FileText, color: "blue", filter: "" },
    { title: "Pending", value: stats.pending, icon: Clock, color: "yellow", filter: "Pending" },
    { title: "In Progress", value: stats.inProgress, icon: RefreshCw, color: "blue", filter: "In Progress" },
    { title: "Resolved", value: stats.resolved, icon: CheckCircle, color: "green", filter: "Resolved" },
  ];

  const colorMap = {
    blue:   { bg: "bg-blue-50",   icon: "text-blue-500",   border: "border-blue-100",   val: "text-blue-700" },
    yellow: { bg: "bg-yellow-50", icon: "text-yellow-500", border: "border-yellow-100", val: "text-yellow-700" },
    green:  { bg: "bg-green-50",  icon: "text-green-500",  border: "border-green-100",  val: "text-green-700" },
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Welcome back, <span className="text-blue-600">{user?.name || "Admin"}</span> 👋
        </h2>
        <p className="text-gray-400 text-sm mt-1">Here's what's happening in the hostel today.</p>
      </div>

      {/* Stats Cards — 2 cols on mobile, 4 on md+ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          const c = colorMap[card.color];
          return (
            <div
              key={i}
              onClick={() => navigate("/admin/reports", { state: { filter: card.filter } })}
              className={`bg-white rounded-xl border ${c.border} p-4 sm:p-5 flex flex-col gap-3 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group`}
            >
              <div className="flex items-center justify-between">
                <div className={`${c.bg} p-2 sm:p-2.5 rounded-lg`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${c.icon}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition" />
              </div>
              <div>
                {loading ? (
                  <div className="h-7 w-12 bg-gray-100 rounded animate-pulse mb-1" />
                ) : (
                  <p className={`text-xl sm:text-2xl font-bold ${c.val}`}>{card.value}</p>
                )}
                <p className="text-gray-500 text-xs sm:text-sm">{card.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom section — stacks on mobile, side-by-side on lg */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">

        {/* Latest Reports — full width on mobile/tablet, 2/3 on lg */}
        <div className="w-full lg:flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Latest Reports</h3>
            <div className="flex items-center gap-2 sm:gap-3">
              <select
                className="border border-gray-200 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <button onClick={() => navigate("/admin/reports")}
                className="text-blue-600 text-xs sm:text-sm font-medium hover:underline whitespace-nowrap">
                View all
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">No reports found.</div>
          ) : (
            <>
              {/* Mobile cards (below sm) */}
              <div className="sm:hidden divide-y divide-gray-100">
                {filteredReports.slice(0, 5).map((report, i) => (
                  <div key={report._id || i} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-medium text-gray-800 text-sm leading-snug">{report.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${getStatusStyle(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-400">
                      <span>{report.category}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getPriorityStyle(report.priority)}`}>
                        {report.priority}
                      </span>
                      <span className="ml-auto">{formatDate(report.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tablet/Desktop table (sm+) */}
              <div className="hidden sm:block">
                {/* Table header */}
                <div className="grid grid-cols-5 px-4 sm:px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
                  <span className="col-span-2">Issue</span>
                  <span>Category</span>
                  <span>Status</span>
                  <span className="text-right">Date</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {filteredReports.map((report, i) => (
                    <div key={report._id || i}
                      className="grid grid-cols-5 px-4 sm:px-6 py-3 sm:py-4 items-center text-sm text-gray-700 hover:bg-gray-50 transition">
                      <span className="col-span-2 font-medium text-gray-800 truncate pr-2">{report.title}</span>
                      <span className="text-gray-500 text-xs sm:text-sm">{report.category}</span>
                      <span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(report.status)}`}>
                          {report.status}
                        </span>
                      </span>
                      <span className="text-right text-gray-400 text-xs">{formatDate(report.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Stats sidebar — horizontal on tablet, vertical on lg */}
        <div className="w-full lg:w-72 bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Overview</h3>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {[
              { label: "Total Reports", value: stats.total, color: "text-blue-600" },
              { label: "Pending", value: stats.pending, color: "text-yellow-600" },
              { label: "In Progress", value: stats.inProgress, color: "text-blue-500" },
              { label: "Resolved", value: stats.resolved, color: "text-green-600" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-3">
                <span className="text-sm text-gray-500">{stat.label}</span>
                {loading ? (
                  <div className="h-5 w-8 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/admin/reports")}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition">
            Manage All Reports
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
