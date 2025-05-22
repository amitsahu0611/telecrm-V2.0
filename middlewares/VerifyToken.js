const jwt = require("jsonwebtoken");
const User = require("../models/users.model.js");
const { createError,createSuccess } = require("../utils/response.js");

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.json(createError("Unauthorized request"));
    }

    const decodedToken = jwt.verify(token, process.env.JWTKEY);

    const user = await User.findOne({ _id: decodedToken.User_Id });

    if (!user) {
      return res.status(401).json(createError("Invalid Access Token"));
    }
    req.user = user;

    next();
  } catch (error) {
    return res.json(createError(`Exception:${error.message}`));
  }
};

module.exports = verifyJWT;
