const Report = require("../models/Report");
const { cloudinary } = require("../middleware/upload");

// @desc    Submit a new report
// @route   POST /api/reports
// @access  Private (user)
const createReport = async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ message: "Title, category and description are required." });
    }

    const reportData = {
      title,
      category,
      description,
      submittedBy: req.user._id,
    };

    // If an image was uploaded via multer/cloudinary
    if (req.file) {
      reportData.image = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    const report = await Report.create(reportData);

    res.status(201).json({
      message: "Report submitted successfully.",
      report,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports submitted by the logged-in user
// @route   GET /api/reports
// @access  Private (user)
const getMyReports = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { submittedBy: req.user._id };
    if (status) query.status = status;

    const reports = await Report.find(query).sort({ createdAt: -1 });
    res.json({ count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single report by ID (must belong to user)
// @route   GET /api/reports/:id
// @access  Private (user)
const getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      submittedBy: req.user._id,
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }

    res.json({ report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete own report (only if still Pending)
// @route   DELETE /api/reports/:id
// @access  Private (user)
const deleteMyReport = async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      submittedBy: req.user._id,
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }

    if (report.status !== "Pending") {
      return res.status(403).json({
        message: "You can only delete reports that are still Pending.",
      });
    }

    if (report.image?.publicId) {
      await cloudinary.uploader.destroy(report.image.publicId);
    }

    await report.deleteOne();
    res.json({ message: "Report deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReport, getMyReports, getReportById, deleteMyReport };
