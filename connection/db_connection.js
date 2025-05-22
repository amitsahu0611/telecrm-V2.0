/** @format */

const {Sequelize} = require("sequelize");
const dotenv = require("dotenv");
const colors = require("colors");

dotenv.config({
  path: "./.env",
});

const db = new Sequelize(
  "jasminz_tele_crm",
  "jasminz_tele_crm_user",
  "Nowgray@2025",
  {
    host: "66.103.193.120",
    port: "3306",
    dialect: "mysql",
    logging: false,
  }
);

const dbConnection = async () => {
  try {
    await db.authenticate();
    console.log(colors.rainbow("SQL Server Connected!!"));
  } catch (error) {
    console.error(colors.red("Unable to connect to the database:", error));
  }
};

process.on("SIGINT", async () => {
  try {
    await db.close();
    console.log("Connection closed gracefully.");
    process.exit(0);
  } catch (error) {
    console.error("Error closing the database connection:", error);
    process.exit(1);
  }
});

module.exports = db;
module.exports.dbConnection = dbConnection;
