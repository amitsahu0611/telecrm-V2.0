/** @format */

// routes/serviceCategoryRoutes.js
const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/serviceCategory.controller");
const router = express.Router();

router.post("/createCategory", createCategory);
router.get("/getAllCategories/:workspace_id", getAllCategories);
router.get("/getCategoryById/:id", getCategoryById);
router.post("/updateCategory/:id", updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);

module.exports = router;
