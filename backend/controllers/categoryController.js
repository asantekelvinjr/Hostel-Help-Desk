const Category = require("../models/Category");
const Report = require("../models/Report");

// @desc    Get all categories with report counts
// @route   GET /api/admin/categories
// @access  Admin
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("totalReports")
      .sort({ createdAt: -1 });

    res.json({ count: categories.length, categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single category + its reports
// @route   GET /api/admin/categories/:id
// @access  Admin
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("totalReports");
    if (!category) return res.status(404).json({ message: "Category not found." });

    const reports = await Report.find({ category: category.name })
      .populate("submittedBy", "name email roomNumber")
      .sort({ createdAt: -1 });

    res.json({ category, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/admin/categories
// @access  Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Category name is required." });

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) return res.status(409).json({ message: "A category with this name already exists." });

    const category = await Category.create({ name: name.trim(), description, status });
    res.status(201).json({ message: "Category created successfully.", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a category (name, description, status)
// @route   PATCH /api/admin/categories/:id
// @access  Admin
const updateCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found." });

    // If name changes, update all reports that reference the old name
    if (name && name.trim() !== category.name) {
      await Report.updateMany({ category: category.name }, { category: name.trim() });
      category.name = name.trim();
    }
    if (description !== undefined) category.description = description;
    if (status) category.status = status;

    await category.save();
    res.json({ message: "Category updated successfully.", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a category (does NOT delete reports — just orphans them)
// @route   DELETE /api/admin/categories/:id
// @access  Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found." });

    await category.deleteOne();
    res.json({ message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
