/** @format */

const express = require("express");
const {
  createLead,
  getLeadById,
  bulkcreateFromCsv,
  getAllLeadByWorkspaceId,
  addAttachment,
  getAttachmentByUserId,
  getallImportedLeads,
} = require("../controllers/lead.controller");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post("/createLead", createLead);
router.get("/getLeadById/:id", getLeadById);
router.get("/getAllLeadByWorkspaceId/:workspace_id", getAllLeadByWorkspaceId);
router.post("/bulk-upload", upload.single("upload"), bulkcreateFromCsv);
router.post("/addAttachment", upload.single("file"), addAttachment);
router.get("/getAttachmentByUserId/:user_id", getAttachmentByUserId);
router.get("/getallImportedLeads/:workspace_id", getallImportedLeads);

module.exports = router;
