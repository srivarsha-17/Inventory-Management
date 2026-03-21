const Material = require("../Models/Material");

exports.addMaterial = async (req, res) => {
  try {
    const material = new Material(req.body);
    const savedMaterial = await material.save();
    res.status(201).json(savedMaterial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    const updated = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ message: "Material deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMaterialSummary = async (req, res) => {
  try {
    const summary = await Material.aggregate([
      {
        $group: {
          _id: "$materialType",
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};