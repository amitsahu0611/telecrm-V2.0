const saveActionLog = require("../config/config").saveActionLog;

const actionLogger = (action) => {
  return async (req, res, next) => {
    try {
      const userId = req.user ? req.user.user_id : "unknown";
      const firmId = req.user ? req.user.firms_id : null;
      const description = `${action} action performed.`;

      await saveActionLog(action, userId, firmId, description);

      next();
    } catch (error) {
      console.error("Error saving action log:", error);
    }
  };
};

module.exports = actionLogger;
