/** @format */

const {DataTypes} = require("sequelize");
const sequelize = require("../connection/db_connection");

const Workspace = sequelize.define(
  "Workspace",
  {
    workspace_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdById: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    creatorRoleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    workspace_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "workspaces",
    timestamps: true,
  }
);

module.exports = Workspace;

// (async () => {
//   try {
//     await Workspace.sync({alter: true}); // Use alter to update table if it already exists
//     console.log("Workspace table synced successfully.");
//   } catch (error) {
//     console.error("Error syncing Users table:", error);
//   } finally {
//     await sequelize.close();
//   }
// })();
