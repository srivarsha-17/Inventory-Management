const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    projectCode: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    labourRecords: [
      {
        labourType: {
          type: String,
          required: true
        },
        workers: {
          type: Number,
          required: true
        },
        wage: {
          type: Number,
          required: true
        },
        total: {
          type: Number,
          required: true
        }
      }
    ],
    grandTotal: {
      type: Number,
      default: 0
    },
    addedBy: {
      type: String // email of the user who added this record
    },
    status: {
      type: String,
      enum: ["draft", "submitted"],
      default: "draft"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
