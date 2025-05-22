/** @format */

const Source = require("../models/source.model");

const createSource = async (req, res) => {
  try {
    const {workspace_id, source_name} = req.body;

    if (!workspace_id || !source_name) {
      return res.status(400).json({
        success: false,
        message: "workspace_id and source_name are required",
      });
    }

    const source = await Source.create({
      workspace_id,
      source_name,
    });

    res.status(201).json({
      success: true,
      message: "Source created successfully",
      data: source,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating source",
      error: err.message,
    });
  }
};

const deleteSource = async (req, res) => {
  try {
    const {source_id} = req.params;

    const source = await Source.findByPk(source_id);

    if (!source || source.is_delete) {
      return res.status(404).json({
        success: false,
        message: "Source not found",
      });
    }

    source.is_delete = true;
    source.is_active = false;
    await source.save();

    res.json({
      success: true,
      message: "Source soft deleted successfully",
      data: source,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting source",
      error: err.message,
    });
  }
};

const updateSource = async (req, res) => {
  try {
    const {source_id} = req.params;
    const {source_name, is_active} = req.body;

    const source = await Source.findByPk(source_id);

    if (!source || source.is_delete) {
      return res.status(404).json({
        success: false,
        message: "Source not found",
      });
    }

    if (source_name !== undefined) source.source_name = source_name;
    if (is_active !== undefined) source.is_active = is_active;

    await source.save();

    res.json({
      success: true,
      message: "Source updated successfully",
      data: source,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating source",
      error: err.message,
    });
  }
};

const getAllSourcesByWorkspace = async (req, res) => {
  try {
    const {workspace_id} = req.params;

    const sources = await Source.findAll({
      where: {
        workspace_id,
        is_delete: false,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      message: "Sources fetched successfully",
      data: sources,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching sources",
      error: err.message,
    });
  }
};

module.exports = {
  createSource,
  deleteSource,
  updateSource,
  getAllSourcesByWorkspace,
};
