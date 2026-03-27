import React, { useState } from "react";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const CATEGORIES = ["Plumbing", "Internet", "Furniture", "Electricity", "Social", "Maintenance", "Sanitation", "Security"];
const STAFF = ["- Select Staff -", "John", "Michael", "James", "Emma"];

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending": return "bg-yellow-100 text-yellow-700";
    case "In Progress": return "bg-blue-100 text-blue-700";
    case "Resolved": return "bg-green-100 text-green-700";
    default: return "bg-gray-100 text-gray-600";
  }
};

const ViewReport = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Pull the report passed from ManageReport; fall back to a default so the page never crashes
  const incoming = location.state?.report ?? {
    id: 125,
    issue: "No Water in Bathroom",
    category: "Plumbing",
    priority: "High",
    status: "Pending",
    date: "Mar 4, 2026",
    assigned: "Unassigned",
    description: "There's no running water in the bathroom. Can't flush the toilet or use the sink.",
  };

  // Local editable state
  const [category, setCategory] = useState(incoming.category);
  const [priority, setPriority] = useState(incoming.priority);
  const [status, setStatus] = useState(incoming.status);
  const [assigned, setAssigned] = useState(
    STAFF.includes(incoming.assigned) ? incoming.assigned : "- Select Staff -"
  );

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 mb-4 hover:text-gray-700 transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Manage Reports</span>
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-1">View Report</h2>

        {/* Meta */}
        <p className="text-sm text-gray-400 mb-6">
          Report ID: #{incoming.id} &nbsp;|&nbsp; Created on: {incoming.date}
        </p>

        {/* Status badge */}
        <div className="mb-6">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(status)}`}>
            {status}
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">

            {/* LEFT — issue details */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Issue</p>

              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-800 mb-2">{incoming.issue}</h3>
                <p className="text-sm text-gray-500">
                  {incoming.description ?? "No additional description provided."}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="mt-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Quick Actions</p>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-600 transition shadow-sm">
                    <Phone size={14} />
                    Call Room 204
                  </button>
                  <button className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-600 transition shadow-sm">
                    <Mail size={14} />
                    Email User
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT — editable fields */}
            <div className="space-y-5">

              {/* Category */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Category</p>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Priority + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Priority</p>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Status</p>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </div>
              </div>

              {/* Assign To */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Assign To</p>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  value={assigned}
                  onChange={(e) => setAssigned(e.target.value)}
                >
                  {STAFF.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center mt-6">
          <button className="border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-lg text-sm font-medium transition">
            Delete Report
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Close
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-sm">
              Update Report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewReport;