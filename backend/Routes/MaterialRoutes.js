const express = require("express");
const router = express.Router();

const {
  addMaterial,
  getMaterials,
  updateMaterial,
  deleteMaterial,
  getMaterialSummary,
} = require("../Controllers/materialController");

router.post("/", addMaterial);
router.get("/", getMaterials);
router.put("/:id", updateMaterial);
router.delete("/:id", deleteMaterial);
router.get("/summary", getMaterialSummary);

module.exports = router;