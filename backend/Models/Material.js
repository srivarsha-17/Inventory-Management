const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
  materialType: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  trucks: {
    type: Number,
  },
  supplier: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  remarks: {
    type: String,
  },
});

module.exports = mongoose.model("Material", MaterialSchema);