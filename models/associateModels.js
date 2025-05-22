/** @format */

// models/associateModels.js

const Campaign = require("./Campaign.model");
const Lead = require("./lead.model");
const LeadCampaignMap = require("./LeadCampaignMap.model");
const CampaignAssignee = require("./CampaignAssignee.model");
const Users = require("./users.model");

const associateModels = () => {
  Lead.belongsToMany(Campaign, {
    through: LeadCampaignMap,
    foreignKey: "lead_id",
    otherKey: "campaign_id",
  });

  Campaign.belongsToMany(Lead, {
    through: LeadCampaignMap,
    foreignKey: "campaign_id",
    otherKey: "lead_id",
  });

  Campaign.hasMany(CampaignAssignee, {
    foreignKey: "campaign_id",
    as: "assignees",
  });

  CampaignAssignee.belongsTo(Campaign, {
    foreignKey: "id",
    as: "campaign",
  });

  Users.hasMany(CampaignAssignee, {
    foreignKey: "user_id",
    as: "campaignAssignments",
  });

  CampaignAssignee.belongsTo(Users, {
    foreignKey: "user_id",
    as: "user",
  });
};

module.exports = associateModels;
