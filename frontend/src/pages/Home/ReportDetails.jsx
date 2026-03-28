import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Tag, Calendar, Layers, AlertCircle, ImageOff } from "lucide-react";
import UserNavbar from "../../components/UserNavbar";

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending": return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    case "In Progress": return "bg-blue-100 text-blue-700 border border-blue-500";
    case "Resolved": return "bg-green-100 text-green-700 border border-green-300";
    default: return "bg-gray-100 text-gray-600 border border-gray-300";
  }
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-4 border-b border-gray-100 last:border-none">
    <div className="mt-0.5 p-2 bg-[var(--color-bg)] rounded-lg">
      <Icon className="w-4 h-4 text-[var(--color-primary)]" />
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-medium text-[var(--color-text-heading)]">{value}</p>
    </div>
  </div>
);

const ReportDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const report = state?.report;

  if (!report) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
        <UserNavbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[var(--color-text)]">
          <AlertCircle className="w-10 h-10 text-gray-400" />
          <p className="text-lg font-medium">No report found.</p>
          <button onClick={() => navigate("/reports")}
            className="text-sm text-[var(--color-primary)] hover:underline">
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "—";

  // Support both backend shape (createdAt, image.url) and any legacy local shape
  const imageUrl = report.image?.url || report.image || null;
  const date = report.createdAt ? formatDate(report.createdAt) : report.date || "—";

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <UserNavbar />

      <main className="flex-1 px-4 md:px-10 py-8 flex justify-center">
        <div className="w-full max-w-2xl">

          <button onClick={() => navigate("/reports")}
            className="flex items-center gap-2 text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </button>

          <div className="bg-white shadow-md rounded-xl overflow-hidden">

            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Issue Title</p>
                <h2 className="text-lg font-bold text-[var(--color-text-heading)]">{report.title}</h2>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusStyle(report.status)}`}>
                {report.status}
              </span>
            </div>

            {/* Details */}
            <div className="px-6 divide-y divide-gray-100">
              <DetailRow icon={Tag} label="Category" value={report.category} />
              <DetailRow icon={Calendar} label="Date Submitted" value={date} />
              {report.description && (
                <DetailRow icon={Layers} label="Description" value={report.description} />
              )}
            </div>

            {/* Image */}
            <div className="px-6 py-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">
                Attached Image
              </p>
              {imageUrl ? (
                <img src={imageUrl} alt="Report attachment"
                  className="w-full rounded-xl object-cover max-h-72 border border-gray-100" />
              ) : (
                <div className="w-full rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
                  <ImageOff className="w-8 h-8" />
                  <p className="text-sm">No image attached</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportDetails;
