import React, { useState } from "react";
import { FileText, Clock, RefreshCw, CheckCircle, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const reportsData = [
  { issue: "No Water in Bathroom", category: "Plumbing", priority: "High", status: "Pending", date: "Mar 4, 2026" },
  { issue: "Wi-Fi not working", category: "Internet", priority: "Medium", status: "In Progress", date: "Mar 1, 2026" },
  { issue: "Broken Bed Frame", category: "Furniture", priority: "High", status: "Resolved", date: "Feb 16, 2026" },
  { issue: "Noise Disturbance", category: "Social", priority: "Medium", status: "Resolved", date: "Feb 24, 2026" },
  { issue: "Light not working", category: "Electricity", priority: "High", status: "Pending", date: "Mar 5, 2026" },
];

const activityData = [
  { name: "Kelvin", action: "reported Wi-Fi Not Working", time: "2 mins ago" },
  { name: "John", action: "assigned Wi-Fi Not Working to technician", time: "10 mins ago" },
  { name: "Emma", action: "marked Broken Light in Room as resolved", time: "30 mins ago" },
  { name: "Michael", action: "resolved Broken Bed Frame", time: "1 hour ago" },
];

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
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  const filteredReports = filterStatus
    ? reportsData.filter((r) => r.status === filterStatus)
    : reportsData;

  const cards = [
    { title: "Total Reports", value: 128, icon: FileText, color: "blue", filter: "" },
    { title: "Pending", value: 35, icon: Clock, color: "yellow", filter: "Pending" },
    { title: "In Progress", value: 18, icon: RefreshCw, color: "blue", filter: "In Progress" },
    { title: "Resolved", value: 75, icon: CheckCircle, color: "green", filter: "Resolved" },
  ];

  const colorMap = {
    blue: { bg: "bg-blue-50", icon: "text-blue-500", border: "border-blue-100", val: "text-blue-700" },
    yellow: { bg: "bg-yellow-50", icon: "text-yellow-500", border: "border-yellow-100", val: "text-yellow-700" },
    green: { bg: "bg-green-50", icon: "text-green-500", border: "border-green-100", val: "text-green-700" },
    red: { bg: "bg-red-50", icon: "text-red-500", border: "border-red-100", val: "text-red-700" },
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, <span className="text-blue-600">Admin</span> 👋
        </h2>
        <p className="text-gray-400 text-sm mt-1">Here's what's happening in the hostel today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          const c = colorMap[card.color];
          return (
            <div
              key={i}
              onClick={() => navigate("/admin/reports", { state: { filter: card.filter } })}
              className={`bg-white rounded-xl border ${c.border} p-5 flex flex-col gap-3 cursor-pointer
                shadow-sm hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-sm
                transition-all duration-200 ease-out group`}
            >
              <div className="flex items-center justify-between">
                <div className={`${c.bg} p-2.5 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${c.icon}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${c.val}`}>{card.value}</p>
                <p className="text-gray-500 text-sm">{card.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Latest Reports */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Latest Reports</h3>
            <div className="flex items-center gap-3">
              <select
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <button
                onClick={() => navigate("/admin/reports")}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                View all
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-5 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
            <span>Issue</span>
            <span>Category</span>
            <span>Priority</span>
            <span>Status</span>
            <span className="text-right">Date</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-50">
            {filteredReports.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400 text-sm">No reports found.</div>
            ) : (
              filteredReports.map((report, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 px-6 py-4 items-center text-sm text-gray-700 hover:bg-gray-50 transition"
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
                  <span className="text-right text-gray-400 text-xs">{report.date}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-semibold text-gray-800">Recent Activity</h3>
            <button className="text-blue-600 text-xs font-medium hover:underline">View All</button>
          </div>

          <div className="space-y-5">
            {activityData.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <img
                  src={`https://i.pravatar.cc/40?img=${index + 1}`}
                  className="w-8 h-8 rounded-full flex-shrink-0 border border-gray-100"
                  alt={activity.name}
                />
                <div className="text-sm min-w-0">
                  <p className="text-gray-700 leading-snug">
                    <span className="font-semibold text-gray-800">{activity.name}</span>{" "}
                    <span className="text-gray-500">{activity.action}</span>
                  </p>
                  <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">Showing last 4 activities</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;