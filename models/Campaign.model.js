/** @format */

const {DataTypes} = require("sequelize");
const sequelize = require("../connection/db_connection");
const Lead = require("./lead.model");
const LeadCampaignMap = require("./LeadCampaignMap.model");

const Campaign = sequelize.define(
  "Campaign",
  {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    workspace_id: {type: DataTypes.INTEGER, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: true},
    start_date: {type: DataTypes.DATE, allowNull: true},
    end_date: {type: DataTypes.DATE, allowNull: true},
    is_active: {type: DataTypes.BOOLEAN, defaultValue: true},
    is_delete: {type: DataTypes.BOOLEAN, defaultValue: false},
  },
  {
    tableName: "campaigns",
    timestamps: true,
  }
);

module.exports = Campaign;

// (async () => {
//   try {
//     await Campaign.sync({alter: true}); // Use alter to update table if it already exists
//     console.log("Campaign table synced successfully.");
//   } catch (error) {
//     console.error("Error syncing Users table:", error);
//   } finally {
//     await sequelize.close();
//   }
// })();
