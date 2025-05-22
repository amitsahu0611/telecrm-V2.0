/** @format */

const express = require("express");
const {
  createWorkspace,
  getAllWorkspaces,
  updateWorkspace,
  deleteWorkspace,
} = require("../controllers/workspace.controller");
const router = express.Router();

router.post("/createWorkspace", createWorkspace);
router.get("/getAllWorkspaces", getAllWorkspaces);
router.post("/updateWorkspace/:id", updateWorkspace);
router.delete("/deleteWorkspace/:id", deleteWorkspace);

module.exports = router;
