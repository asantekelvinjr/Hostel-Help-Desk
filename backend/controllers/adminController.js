const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Report = require("../models/Report");
const { cloudinary } = require("../middleware/upload");

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(admin._id, "admin");

    res.json({
      message: "Admin login successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user with their reports
// @route   GET /api/admin/users/:id
// @access  Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const reports = await Report.find({ submittedBy: user._id }).sort({ createdAt: -1 });

    res.json({ user, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Deactivate / reactivate a user
// @route   PATCH /api/admin/users/:id/toggle
// @access  Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully.`,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user and their reports
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Delete all their reports + cloudinary images
    const reports = await Report.find({ submittedBy: user._id });
    for (const report of reports) {
      if (report.image?.publicId) {
        await cloudinary.uploader.destroy(report.image.publicId);
      }
    }
    await Report.deleteMany({ submittedBy: user._id });
    await user.deleteOne();

    res.json({ message: "User and all their reports deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports (with filters)
// @route   GET /api/admin/reports
// @access  Admin
const getAllReports = async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (search) query.title = { $regex: search, $options: "i" };

    const reports = await Report.find(query)
      .populate("submittedBy", "name email roomNumber")
      .sort({ createdAt: -1 });

    res.json({ count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report status, priority, assigned, notes
// @route   PATCH /api/admin/reports/:id
// @access  Admin
const updateReport = async (req, res) => {
  try {
    const { status, priority, assignedTo, adminNotes } = req.body;

    const report = await Report.findById(req.params.id).populate("submittedBy", "name email");
    if (!report) return res.status(404).json({ message: "Report not found." });

    if (status) report.status = status;
    if (priority) report.priority = priority;
    if (assignedTo !== undefined) report.assignedTo = assignedTo;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;

    await report.save();
    res.json({ message: "Report updated successfully.", report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a report
// @route   DELETE /api/admin/reports/:id
// @access  Admin
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found." });

    // Remove image from Cloudinary if it exists
    if (report.image?.publicId) {
      await cloudinary.uploader.destroy(report.image.publicId);
    }

    await report.deleteOne();
    res.json({ message: "Report deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  adminLogin,
  getAllUsers,
  getUserById,
  toggleUserStatus,
  deleteUser,
  getAllReports,
  updateReport,
  deleteReport,
};
