/** @format */

const crypto = require("crypto");
// const ActionLogs = require("../models/action_logs");

const hashPassword = (password) => {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
};

module.exports = {hashPassword};
