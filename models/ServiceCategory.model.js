/** @format */

const {DataTypes} = require("sequelize");
const sequelize = require("../connection/db_connection");

const ServiceCategory = sequelize.define(
  "ServiceCategory",
  {
    service_category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    workspace_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category_name: {
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
    tableName: "serviceCategory",
    timestamps: true,
  }
);

module.exports = ServiceCategory;

// (async () => {
//   try {
//     await ServiceCategory.sync({alter: true}); // Use alter to update table if it already exists
//     console.log("ServiceCategory table synced successfully.");
//   } catch (error) {
//     console.error("Error syncing Users table:", error);
//   } finally {
//     await sequelize.close();
//   }
// })();
