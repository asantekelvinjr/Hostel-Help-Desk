import React, { useState } from "react";
import { ArrowLeft, Phone, Mail, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateReport, adminDeleteReport } from "../../api/api";

const CATEGORIES = ["Plumbing", "Internet", "Furniture", "Electricity", "Social", "Cleaning", "Maintenance", "Sanitation", "Security", "Other"];
const STAFF = ["Unassigned", "John", "Michael", "James", "Emma"];

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

  const incoming = location.state?.report ?? {
    _id: null,
    title: "No Water in Bathroom",
    category: "Plumbing",
    priority: "High",
    status: "Pending",
    createdAt: new Date().toISOString(),
    assignedTo: "Unassigned",
    description: "There's no running water in the bathroom.",
    submittedBy: { name: "Unknown", email: "" },
  };

  const [category, setCategory] = useState(incoming.category);
  const [priority, setPriority] = useState(incoming.priority || "Medium");
  const [status, setStatus] = useState(incoming.status);
  const [assignedTo, setAssignedTo] = useState(incoming.assignedTo || "Unassigned");
  const [adminNotes, setAdminNotes] = useState(incoming.adminNotes || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  const handleUpdate = async () => {
    if (!incoming._id) return;
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await updateReport(incoming._id, { category, priority, status, assignedTo, adminNotes });
      setSuccessMsg("Report updated successfully.");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!incoming._id) { navigate(-1); return; }
    setDeleting(true);
    try {
      await adminDeleteReport(incoming._id);
      navigate("/admin/reports");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Delete failed.");
      setDeleting(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 mb-4 hover:text-gray-700 transition">
          <ArrowLeft size={16} />
          Back to Manage Reports
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">View Report</h2>
        <p className="text-sm text-gray-400 mb-4">
          {incoming._id ? `Report ID: ${incoming._id}` : "Preview"} &nbsp;|&nbsp; Submitted: {formatDate(incoming.createdAt)}
        </p>

        {/* Status badge */}
        <div className="mb-6">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(status)}`}>
            {status}
          </span>
        </div>

        {/* Feedback messages */}
        {successMsg && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">

            {/* LEFT */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Issue</p>
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">{incoming.title}</h3>
                <p className="text-sm text-gray-500">{incoming.description || "No description provided."}</p>
              </div>

              {/* Submitted by */}
              {incoming.submittedBy && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Submitted By</p>
                  <p className="text-sm font-medium text-gray-700">{incoming.submittedBy.name}</p>
                  <p className="text-xs text-gray-400">{incoming.submittedBy.email}</p>
                </div>
              )}

              {/* Image */}
              {incoming.image?.url && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Attached Image</p>
                  <img src={incoming.image.url} alt="attachment"
                    className="w-full rounded-xl object-cover max-h-52 border border-gray-100" />
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Quick Actions</p>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-600 transition shadow-sm">
                    <Phone size={14} /> Call Room
                  </button>
                  <button className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-600 transition shadow-sm">
                    <Mail size={14} /> Email User
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT — editable fields */}
            <div className="space-y-5">

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Category</p>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Priority</p>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Status</p>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Assign To</p>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                  {STAFF.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Admin Notes</p>
                <textarea rows={3} placeholder="Add internal notes..."
                  value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 resize-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center mt-6">
          <button onClick={handleDelete} disabled={deleting}
            className="flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60">
            {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete Report
          </button>

          <div className="flex gap-3">
            <button onClick={() => navigate(-1)}
              className="border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition">
              Close
            </button>
            <button onClick={handleUpdate} disabled={saving || !incoming._id}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-sm disabled:opacity-60">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : "Update Report"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewReport;
