/** @format */

const { DataTypes } = require("sequelize");
const sequelize = require("../connection/db_connection");

const Lead = sequelize.define(
  "Lead",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    workspace_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    inhouse_division: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sheet_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Name of the CSV file or import batch",
    },
    service_categories: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    budget: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alternate_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "leads",
    timestamps: true,
  }
);

module.exports = Lead;

// (async () => {
//   try {
//     await Lead.sync({alter: true}); // Use alter to update table if it already exists
//     console.log("Lead table synced successfully.");
//   } catch (error) {
//     console.error("Error syncing Users table:", error);
//   } finally {
//     await sequelize.close();
//   }
// })();
