/** @format */

const {createSuccess} = require("../utils/response");
const Lead = require("../models/lead.model");
const fs = require("fs");
const csv = require("csv-parser");
const Attachment = require("../models/attachment.model");
const {Sequelize, Op} = require("sequelize");

const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);

    return res.json(createSuccess("Lead created successfully", lead));
  } catch (error) {
    console.error("Error creating lead:", error);
    return res.status(500).json({message: "Internal server error"});
  }
};

const bulkcreateFromCsv = async (req, res) => {
  try {
    const leads = [];
    const filePath = req.file.path;
    const {workspace_id} = req.body;
    const fileName = req.file.filename.split(".")[0];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // optional: sanitize or format each row
        leads.push({
          name: row.name || null,
          workspace_id,
          phone: row.phone || null,
          source: row.source || null,
          sheet_name: fileName || "",
          inhouse_division: row.inhouse_division || null,
          service_categories: row.service_categories || null,
          requirements: row.requirements || null,
          budget: row.budget || null,
          email: row.email || null,
          alternate_phone: row.alternate_phone || null,
          city_name: row.city_name || null,
          feedback: row.feedback || null,
          company_name: row.company_name || null,
        });
      })
      .on("end", async () => {
        try {
          await Lead.bulkCreate(leads);
          res
            .status(200)
            .json(createSuccess("Leads uploaded successfully", leads));
        } catch (dbError) {
          console.error("DB Error:", dbError);
          res
            .status(500)
            .json({message: "Database error", error: dbError.message});
        } finally {
          fs.unlinkSync(filePath); // Clean up uploaded file
        }
      });
  } catch (error) {
    console.error("File parsing error:", error);
    res.status(500).json({message: "Server error", error: error.message});
  }
};

const getLeadById = async (req, res) => {
  try {
    const leadId = req.params.id;
    const lead = await Lead.findByPk(leadId);

    if (!lead) {
      return res.status(404).json({message: "Lead not found"});
    }

    return res.json(createSuccess("Lead retrieved successfully", lead));
  } catch (error) {
    console.error("Error retrieving lead:", error);
    return res.status(500).json({message: "Internal server error"});
  }
};

const getAllLeadByWorkspaceId = async (req, res) => {
  try {
    const workspaceId = req.params.workspace_id;
    const leads = await Lead.findAll({
      where: {workspace_id: workspaceId},
      order: [["createdAt", "DESC"]],
    });

    return res.json(createSuccess("Leads retrieved successfully", leads));
  } catch (error) {
    console.error("Error retrieving leads:", error);
    return res.status(500).json({message: "Internal server error"});
  }
};

const addAttachment = async (req, res) => {
  try {
    const {
      user_id,
      workspace_id,
      type: bodyType,
      content: bodyContent,
    } = req.body;

    let type = bodyType;
    let content = bodyContent;
    let original_name = null;

    if (req.file) {
      // If a file is uploaded, set type and content accordingly
      const filePath = `/uploads/${req.file.filename}`;
      content = filePath;
      original_name = req.file.originalname;

      // Set type to 'image' or 'file' based on MIME
      if (req.file.mimetype.startsWith("image/")) {
        type = "image";
      } else {
        type = "file";
      }
    }

    if (!type || !content) {
      return res.status(400).json({message: "Type and content are required."});
    }

    const newAttachment = await Attachment.create({
      user_id,
      workspace_id,
      type,
      content,
      original_name,
    });

    res
      .status(201)
      .json(createSuccess("Attachment added successfully", newAttachment));
  } catch (err) {
    console.error("Attachment upload error:", err);
    res
      .status(500)
      .json({success: false, message: "Error adding attachment", err});
  }
};

const getAttachmentByUserId = async (req, res) => {
  try {
    const {user_id} = req.params;

    const attachments = await Attachment.findAll({
      where: {user_id},
      order: [["createdAt", "DESC"]],
    });

    if (!attachments) {
      return res.status(404).json({message: "Attachments not found"});
    }

    return res.json(
      createSuccess("Attachments retrieved successfully", attachments)
    );
  } catch (error) {
    console.error("Error retrieving attachments:", error);
    return res.status(500).json({message: "Internal server error"});
  }
};

const getallImportedLeads = async (req, res) => {
  try {
    const {workspace_id} = req.params;

    // Step 1: Get distinct sheet names
    const distinctSheets = await Lead.findAll({
      attributes: [
        "sheet_name",
        [Sequelize.fn("MIN", Sequelize.col("createdAt")), "createdAt"],
      ],
      where: {
        sheet_name: {
          [Op.ne]: null,
        },
        workspace_id,
      },
      group: ["sheet_name"],
      raw: true,
    });

    // Step 2: For each sheet, fetch all leads
    const result = await Promise.all(
      distinctSheets.map(async (sheet) => {
        const leads = await Lead.findAll({
          where: {
            sheet_name: sheet.sheet_name,
            workspace_id,
          },
          order: [["createdAt", "DESC"]],
        });

        return {
          sheetName: sheet.sheet_name,
          createdAt: sheet.createdAt,
          totalLeads: leads.length,
          allLeads: leads,
        };
      })
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving imported leads:", error);
    return res.status(500).json({message: "Internal server error"});
  }
};

module.exports = {
  createLead,
  getLeadById,
  bulkcreateFromCsv,
  getAllLeadByWorkspaceId,
  addAttachment,
  getAttachmentByUserId,
  getallImportedLeads,
};
