const express = require("express");
const router = express.Router();
const {
  createReport,
  getMyReports,
  getReportById,
  deleteMyReport,
} = require("../controllers/reportController");
const { protectUser } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/upload");

router.post("/", protectUser, upload.single("image"), createReport);
router.get("/", protectUser, getMyReports);
router.get("/:id", protectUser, getReportById);
router.delete("/:id", protectUser, deleteMyReport);

module.exports = router;
