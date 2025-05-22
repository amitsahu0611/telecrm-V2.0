/** @format */

const {DataTypes} = require("sequelize");
const sequelize = require("../connection/db_connection");

const Source = sequelize.define(
  "Source",
  {
    source_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    workspace_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    source_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "Source",
    timestamps: true,
  }
);

module.exports = Source;

// (async () => {
//   try {
//     await Source.sync({alter: true}); // Use alter to update table if it already exists
//     console.log("Source table synced successfully.");
//   } catch (error) {
//     console.error("Error syncing Users table:", error);
//   } finally {
//     await sequelize.close();
//   }
// })();
