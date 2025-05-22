/** @format */

const Log = require("../models/log.model");

const logMiddleware = async (req, res, next) => {
  const userId = req.user?.id || null; // Make sure req.user exists via auth middleware
  const {method, originalUrl, body, query} = req;

  const action = `${method} ${originalUrl}`;

  try {
    await Log.create({
      userId,
      method,
      route: originalUrl,
      action,
      requestData: JSON.stringify({body, query}),
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }

  next();
};

module.exports = logMiddleware;
