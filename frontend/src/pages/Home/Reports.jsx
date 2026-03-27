import React, { useState } from "react";
import UserNavbar from "../../components/UserNavbar";
import { useNavigate } from "react-router-dom";
import { submittedReports } from "./Home";

const staticReports = [
  { title: "No Water in Bathroom", category: "Plumbing", status: "Pending", date: "Mar 4, 2026", description: "There has been no water supply in the bathroom on the second floor for two days now. Affects multiple residents." },
  { title: "Wi-Fi not working", category: "Internet", status: "In Progress", date: "Mar 1, 2026", description: "The Wi-Fi router in Block B is not broadcasting any signal. Students are unable to connect." },
  { title: "Broken Bed Frame", category: "Furniture", status: "Resolved", date: "Feb 16, 2026", description: "The bed frame in Room 14 is broken on one side and poses a safety risk." },
  { title: "Noise Disturbance", category: "Social", status: "Resolved", date: "Feb 24, 2026", description: "Loud music and noise from Room 22 late at night has been disturbing other residents." },
  { title: "Light not working", category: "Electricity", status: "Pending", date: "Mar 5, 2026", description: "The hallway light on the third floor has been flickering and is now completely off." },
  { title: "Leaky Faucet", category: "Plumbing", status: "Resolved", date: "Mar 2, 2026", description: "The faucet in the common kitchen area is leaking continuously, wasting water." },
  { title: "AC not cooling", category: "Electricity", status: "In Progress", date: "Mar 3, 2026", description: "The air conditioner in Room 7 is running but not producing cold air." },
  { title: "Window broken", category: "Furniture", status: "Pending", date: "Mar 6, 2026", description: "The window latch in Room 19 is broken and the window cannot be closed properly." },
  { title: "Internet speed slow", category: "Internet", status: "In Progress", date: "Mar 7, 2026", description: "Internet speeds across the hostel have been very slow, making it hard to study online." },
  { title: "Cleaning required", category: "Cleaning", status: "Resolved", date: "Mar 8, 2026", description: "The common bathrooms on the ground floor need urgent deep cleaning." },
];

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
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 8;

  const allReports = [...submittedReports, ...staticReports];

  const filteredReports = filterStatus
    ? allReports.filter((r) => r.status === filterStatus)
    : allReports;

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const paginatedReports = filteredReports.slice(
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
              <option value="">Filter by Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {paginatedReports.map((report, idx) => (
              <div
                key={idx}
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
                  <p><span className="font-medium">Date:</span> {report.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-4 px-8 py-4 text-sm font-semibold text-gray-500 border-b border-gray-100">
                <span>Issue</span>
                <span>Category</span>
                <span>Status</span>
                <span className="text-right">Date Submitted</span>
              </div>

              {paginatedReports.map((report, idx) => (
                <div
                  key={idx}
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
                  <span className="text-right text-gray-500">{report.date}</span>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center mt-6 space-x-2 text-sm">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`px-3 py-1.5 rounded-md border border-gray-200 text-gray-500 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-md border ${
                    page === currentPage
                      ? "bg-[var(--color-primary)] text-white border-none"
                      : "border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`px-3 py-1.5 rounded-md border border-gray-200 text-gray-500 ${
                  currentPage === totalPages || totalPages === 0
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Reports;
