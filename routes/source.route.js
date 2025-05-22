/** @format */

const express = require("express");
const {
  createSource,
  deleteSource,
  updateSource,
  getAllSourcesByWorkspace,
} = require("../controllers/source.controller");
const router = express.Router();

router.post("/createSource", createSource);
router.delete("/deleteSource/:source_id", deleteSource);
router.post("/updateSource/:source_id", updateSource);
router.get("/getAllSourcesByWorkspace/:workspace_id", getAllSourcesByWorkspace);

module.exports = router;
