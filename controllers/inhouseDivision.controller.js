/** @format */

const InhouseDivision = require("../models/inhousedivision.model");

// ✅ Create Division
const createDivision = async (req, res) => {
  try {
    const {workspace_id, division_name} = req.body;

    if (!workspace_id || !division_name) {
      return res.status(400).json({
        success: false,
        message: "workspace_id and division_name are required",
      });
    }

    const division = await InhouseDivision.create({
      workspace_id,
      division_name,
    });

    res.status(201).json({
      success: true,
      message: "Division created successfully",
      data: division,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating division",
      error: err.message,
    });
  }
};

// ✅ Soft Delete Division
const deleteDivision = async (req, res) => {
  try {
    const {division_id} = req.params;

    const division = await InhouseDivision.findByPk(division_id);

    if (!division || division.is_delete) {
      return res.status(404).json({
        success: false,
        message: "Division not found",
      });
    }

    division.is_delete = true;
    division.is_active = false;
    await division.save();

    res.json({
      success: true,
      message: "Division soft deleted successfully",
      data: division,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting division",
      error: err.message,
    });
  }
};

// ✅ Update Division (name or is_active)
const updateDivision = async (req, res) => {
  try {
    const {division_id} = req.params;
    const {division_name, is_active} = req.body;

    const division = await InhouseDivision.findByPk(division_id);

    if (!division || division.is_delete) {
      return res.status(404).json({
        success: false,
        message: "Division not found",
      });
    }

    if (division_name !== undefined) division.division_name = division_name;
    if (is_active !== undefined) division.is_active = is_active;

    await division.save();

    res.json({
      success: true,
      message: "Division updated successfully",
      data: division,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating division",
      error: err.message,
    });
  }
};

// ✅ Get All Divisions by Workspace
const getAllDivisionsByWorkspace = async (req, res) => {
  try {
    const {workspace_id} = req.params;

    const divisions = await InhouseDivision.findAll({
      where: {
        workspace_id,
        is_delete: false,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      message: "Divisions fetched successfully",
      data: divisions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching divisions",
      error: err.message,
    });
  }
};

module.exports = {
  createDivision,
  deleteDivision,
  updateDivision,
  getAllDivisionsByWorkspace,
};
