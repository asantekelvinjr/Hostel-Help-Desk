const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protectAdmin } = require("../middleware/authMiddleware");

router.get("/", protectAdmin, getCategories);
router.get("/:id", protectAdmin, getCategoryById);
router.post("/", protectAdmin, createCategory);
router.patch("/:id", protectAdmin, updateCategory);
router.delete("/:id", protectAdmin, deleteCategory);

module.exports = router;
