/** @format */

const ServiceCategory = require("../models/ServiceCategory.model");

const createCategory = async (req, res) => {
  try {
    const {workspace_id, category_name} = req.body;

    if (!workspace_id || !category_name) {
      return res
        .status(400)
        .json({message: "Workspace ID and category name are required."});
    }

    const newCategory = await ServiceCategory.create({
      workspace_id,
      category_name,
    });
    res.status(201).json({
      message: "Service category created successfully",
      data: newCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({message: "Error creating service category", error: error.message});
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.findAll({
      where: {is_delete: false},
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({message: "Error fetching categories", error: error.message});
  }
};

const getCategoryById = async (req, res) => {
  try {
    const {id} = req.params;

    const category = await ServiceCategory.findOne({
      where: {service_category_id: id, is_delete: false},
    });

    if (!category) {
      return res.status(404).json({message: "Service category not found"});
    }

    res.status(200).json(category);
  } catch (error) {
    res
      .status(500)
      .json({message: "Error fetching service category", error: error.message});
  }
};

const updateCategory = async (req, res) => {
  try {
    const {id} = req.params;
    const {category_name, is_active} = req.body;

    const category = await ServiceCategory.findByPk(id);
    if (!category || category.is_delete) {
      return res.status(404).json({message: "Service category not found"});
    }

    category.category_name = category_name ?? category.category_name;
    category.is_active = is_active ?? category.is_active;

    await category.save();
    res
      .status(200)
      .json({message: "Service category updated successfully", data: category});
  } catch (error) {
    res
      .status(500)
      .json({message: "Error updating category", error: error.message});
  }
};

const deleteCategory = async (req, res) => {
  try {
    const {id} = req.params;

    const category = await ServiceCategory.findByPk(id);
    if (!category || category.is_delete) {
      return res.status(404).json({message: "Service category not found"});
    }

    category.is_delete = true;
    await category.save();

    res
      .status(200)
      .json({message: "Service category deleted (soft delete) successfully"});
  } catch (error) {
    res
      .status(500)
      .json({message: "Error deleting service category", error: error.message});
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
