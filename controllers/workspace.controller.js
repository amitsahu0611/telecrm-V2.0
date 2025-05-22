/** @format */

const Users = require("../models/users.model");
const Workspace = require("../models/workspace.model");
const {createSuccess} = require("../utils/response");

const createWorkspace = async (req, res) => {
  try {
    const {workspace_name, description, createdById} = req.body;

    const user = await Users.findByPk(createdById);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    // Check if workspace already exists
    const existing = await Workspace.findOne({
      where: {workspace_name, is_deleted: false},
    });
    if (existing) {
      return res.status(400).json({message: "Workspace name already exists."});
    }

    // Create workspace
    const newWorkspace = await Workspace.create({
      workspace_name,
      description,
      createdById,
      creatorRoleId: user.role_id, // updated to match your Sequelize model (`creatorRoleId`)
      is_active: true,
      is_deleted: false,
    });

    res
      .status(201)
      .json(createSuccess("Workspace created successfully", newWorkspace));
  } catch (error) {
    res.status(500).json({message: "Error creating workspace", error});
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const {id} = req.params;

    const workspace = await Workspace.findByPk(id);
    if (!workspace || workspace.is_deleted) {
      return res.status(404).json({message: "Workspace not found"});
    }

    await workspace.update({is_deleted: true, is_active: false});

    res.json(createSuccess("Workspace deleted successfully", workspace));
  } catch (error) {
    res.status(500).json({message: "Error deleting workspace", error});
  }
};

const getAllWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.findAll({
      where: {is_deleted: false},
      order: [["createdAt", "DESC"]],
    });

    res.json(createSuccess("Workspaces fetched successfully", workspaces));
  } catch (error) {
    res.status(500).json({message: "Error fetching workspaces", error});
  }
};

const updateWorkspace = async (req, res) => {
  try {
    const {id} = req.params;
    const {workspace_name, description, is_active} = req.body;

    const workspace = await Workspace.findByPk(id);

    if (!workspace) {
      return res.status(404).json({message: "Workspace not found"});
    }

    const data = await Workspace.update(
      {
        workspace_name,
        description,
        is_active,
      },
      {
        where: {
          workspace_id: id,
        },
      }
    );

    res.json({message: "Workspace updated successfully", data});
  } catch (error) {
    res.status(500).json({message: "Error updating workspace", error});
  }
};

module.exports = {
  createWorkspace,
  deleteWorkspace,
  getAllWorkspaces,
  updateWorkspace,
};
