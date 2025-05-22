/** @format */

const Category = require("../models/category.model");

const createCategory = async (req, res) => {
  try {
    const {workspace_id, category_name} = req.body;

    if (!workspace_id || !category_name) {
      return res.status(400).json({
        success: false,
        message: "workspace_id and category_name are required",
      });
    }

    const category = await Category.create({
      workspace_id,
      category_name,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: err.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const {category_id} = req.params;

    const category = await Category.findByPk(category_id);

    if (!category || category.is_delete) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.is_delete = true;
    category.is_active = false;
    await category.save();

    res.json({
      success: true,
      message: "Category soft deleted successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting category",
      error: err.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const {category_id} = req.params;
    const {category_name, is_active} = req.body;

    const category = await Category.findByPk(category_id);

    if (!category || category.is_delete) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (category_name !== undefined) category.category_name = category_name;
    if (is_active !== undefined) category.is_active = is_active;

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating category",
      error: err.message,
    });
  }
};

const getAllCategoriesByWorkspace = async (req, res) => {
  try {
    const {workspace_id} = req.params;

    const categories = await Category.findAll({
      where: {
        workspace_id,
        is_delete: false,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: err.message,
    });
  }
};

module.exports = {
  createCategory,
  deleteCategory,
  updateCategory,
  getAllCategoriesByWorkspace,
};
