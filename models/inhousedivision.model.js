/** @format */

const {DataTypes} = require("sequelize");
const sequelize = require("../connection/db_connection");

const InhouseDivision = sequelize.define(
  "InhouseDivision",
  {
    division_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    workspace_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    division_name: {
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
    tableName: "inhouseDivision",
    timestamps: true,
  }
);

module.exports = InhouseDivision;

// (async () => {
//   try {
//     await InhouseDivision.sync({alter: true}); // Use alter to update table if it already exists
//     console.log("InhouseDivision table synced successfully.");
//   } catch (error) {
//     console.error("Error syncing Users table:", error);
//   } finally {
//     await sequelize.close();
//   }
// })();
