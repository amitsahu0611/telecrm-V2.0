/** @format */

const {DataTypes} = require("sequelize");
const sequelize = require("../connection/db_connection");

const CampaignAssignee = sequelize.define(
  "CampaignAssignee",
  {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    campaign_id: {type: DataTypes.INTEGER, allowNull: false},
    user_id: {type: DataTypes.INTEGER, allowNull: false},
    assigned_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    is_active: {type: DataTypes.BOOLEAN, defaultValue: true},
    is_delete: {type: DataTypes.BOOLEAN, defaultValue: false},
  },
  {
    tableName: "campaign_assignees",
    timestamps: true,
  }
);
module.exports = CampaignAssignee;

// (async () => {
//   try {
//     await CampaignAssignee.sync({alter: true}); // Use alter to update table if it already exists
//     console.log("CampaignAssignee table synced successfully.");
//   } catch (error) {
//     console.error("Error syncing Users table:", error);
//   } finally {
//     await sequelize.close();
//   }
// })();
