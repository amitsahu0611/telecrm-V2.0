/** @format */

const {create} = require("html-pdf");
const Campaign = require("../models/Campaign.model");
const Lead = require("../models/lead.model");
const LeadCampaignMap = require("../models/LeadCampaignMap.model");
const {createError, createSuccess} = require("../utils/response");
const Users = require("../models/users.model");
const CampaignAssignee = require("../models/CampaignAssignee.model");

const createCampaign = async (req, res) => {
  try {
    const {leadIds = [], assigneeIds = [], ...campaignData} = req.body;

    const campaign = await Campaign.create(campaignData);

    if (leadIds.length > 0) {
      const leadCampaignData = leadIds.map((leadId) => ({
        campaign_id: campaign.id,
        lead_id: leadId,
      }));
      await LeadCampaignMap.bulkCreate(leadCampaignData);
    }

    if (assigneeIds.length > 0) {
      const assigneeData = assigneeIds.map((userId) => ({
        campaign_id: campaign.id,
        user_id: userId,
      }));
      await CampaignAssignee.bulkCreate(assigneeData);
    }

    res
      .status(201)
      .json(createSuccess("Campaign created successfully", campaign));
  } catch (error) {
    res
      .status(500)
      .json({message: "Error creating campaign", error: error.message});
  }
};

const getAllCampaigns = async (req, res) => {
  const {id} = req.params;
  try {
    if (!id) {
      return res.status(400).json(createError("Workspace ID is required"));
    }

    const campaigns = await Campaign.findAll({
      where: {
        workspace_id: id,
        is_delete: false,
      },
      include: [
        {
          model: Lead,
          through: {attributes: []},
        },
        {
          model: CampaignAssignee,
          as: "assignees",
          include: {
            model: Users,
            as: "user",
            attributes: ["id", "name", "email"], // Customize as needed
          },
        },
      ],
    });

    res.json(createSuccess("Campaigns fetched successfully", campaigns));
  } catch (error) {
    res
      .status(500)
      .json({message: "Error fetching campaigns", error: error.message});
  }
};

const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id, {
      include: [
        {
          model: Lead,
          through: {attributes: []},
        },
        {
          model: CampaignAssignee,
          as: "assignees", // 👈 Must match the alias used in Campaign.hasMany
          include: [
            {
              model: Users,
              as: "user", // 👈 Must match the alias used in CampaignAssignee.belongsTo
              attributes: ["user_id", "name", "email"],
            },
          ],
        },
      ],
    });

    if (!campaign)
      return res.status(404).json(createError("Campaign not found"));

    res.json(createSuccess("Campaign fetched successfully", campaign));
  } catch (error) {
    res.status(500).json({
      message: "Error fetching campaign",
      error: error.message,
    });
  }
};

const updateCampaign = async (req, res) => {
  try {
    const {leadIds = [], assigneeIds = [], ...campaignData} = req.body;
    const {id} = req.params;

    const campaign = await Campaign.findByPk(id);
    if (!campaign) return res.status(404).json({message: "Campaign not found"});

    await campaign.update(campaignData);

    if (leadIds.length) {
      await LeadCampaignMap.destroy({where: {campaign_id: id}});
      const mappings = leadIds.map((leadId) => ({
        campaign_id: id,
        lead_id: leadId,
      }));
      await LeadCampaignMap.bulkCreate(mappings);
    }

    await CampaignAssignee.destroy({where: {campaign_id: id}});
    if (assigneeIds.length) {
      const assigneeData = assigneeIds.map((userId) => ({
        campaign_id: id,
        user_id: userId,
      }));
      await CampaignAssignee.bulkCreate(assigneeData);
    }

    res.json(createSuccess("Campaign updated successfully", campaign));
  } catch (error) {
    res
      .status(500)
      .json({message: "Error updating campaign", error: error.message});
  }
};

const deleteCampaign = async (req, res) => {
  try {
    const {id} = req.params;

    await LeadCampaignMap.update(
      {is_delete: true, is_active: false},
      {where: {campaign_id: id}}
    );

    await CampaignAssignee.update(
      {is_active: false},
      {where: {campaign_id: id}}
    );

    const [affectedRows] = await Campaign.update(
      {is_delete: true, is_active: false},
      {where: {id}}
    );

    if (affectedRows === 0)
      return res.status(404).json(createError("Campaign not found"));

    res.json(createSuccess("Campaign deleted successfully"));
  } catch (error) {
    res
      .status(500)
      .json({message: "Error deleting campaign", error: error.message});
  }
};

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
};
