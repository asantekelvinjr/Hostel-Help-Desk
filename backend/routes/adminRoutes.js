const express = require("express");
const router = express.Router();
const {
  adminLogin,
  getAllUsers,
  getUserById,
  toggleUserStatus,
  deleteUser,
  getAllReports,
  updateReport,
  deleteReport,
} = require("../controllers/adminController");
const { protectAdmin } = require("../middleware/authMiddleware");

// Auth
router.post("/login", adminLogin);

// User management
router.get("/users", protectAdmin, getAllUsers);
router.get("/users/:id", protectAdmin, getUserById);
router.patch("/users/:id/toggle", protectAdmin, toggleUserStatus);
router.delete("/users/:id", protectAdmin, deleteUser);

// Report management
router.get("/reports", protectAdmin, getAllReports);
router.patch("/reports/:id", protectAdmin, updateReport);
router.delete("/reports/:id", protectAdmin, deleteReport);

module.exports = router;
