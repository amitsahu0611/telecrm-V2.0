/** @format */

const express = require("express");
const {
  createDivision,
  updateDivision,
  getAllDivisionsByWorkspace,
  deleteDivision,
} = require("../controllers/inhouseDivision.controller");
const router = express.Router();

router.post("/createDivision", createDivision);
router.delete("/deleteDivision/:division_id", deleteDivision);
router.post("/updateDivision/:division_id", updateDivision);
router.get(
  "/getAllDivisionsByWorkspace/:workspace_id",
  getAllDivisionsByWorkspace
);

module.exports = router;
