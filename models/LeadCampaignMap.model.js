/** @format */

const {DataTypes} = require("sequelize");
const sequelize = require("../connection/db_connection");

const LeadCampaignMap = sequelize.define(
  "LeadCampaignMap",
  {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    lead_id: {type: DataTypes.INTEGER, allowNull: false},
    campaign_id: {type: DataTypes.INTEGER, allowNull: false},
    is_active: {type: DataTypes.BOOLEAN, defaultValue: true},
    is_delete: {type: DataTypes.BOOLEAN, defaultValue: false},
  },
  {
    underscored: true,
  },
  {
    tableName: "lead_campaign_map",
    timestamps: true,
  }
);

module.exports = LeadCampaignMap;

// (async () => {
//   try {
//     await LeadCampaignMap.sync({alter: true}); // Use alter to update table if it already exists
//     console.log("LeadCampaignMap table synced successfully.");
//   } catch (error) {
//     console.error("Error syncing Users table:", error);
//   } finally {
//     await sequelize.close();
//   }
// })();
