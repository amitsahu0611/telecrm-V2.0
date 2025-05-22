/** @format */

const express = require("express");
const {
  login,
  register,
  getUserById,
  getAllUsers,
  updateUser,
  exportAllUsers,
} = require("../controllers/users.controller");
const router = express.Router();

router.post("/createUser", register);
router.post("/login", login);
router.get("/getUserById/:user_id", getUserById);
router.get("/getAllUsers", getAllUsers);
router.post("/updateUser/:user_id", updateUser);
router.get("/exportAllUsers", exportAllUsers);

module.exports = router;
