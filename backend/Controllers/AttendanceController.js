const Attendance = require("../Models/Attendance");

// ✅ 1. ADD Attendance Record
const addAttendance = async (req, res) => {
  try {
    const { date, labourRecords, grandTotal } = req.body;

    // projectCode comes from JWT
    const projectCode = req.user.projectCode;

    console.log("=== ADD ATTENDANCE DEBUG ===");
    console.log("req.user:", req.user);
    console.log("projectCode:", projectCode);
    console.log("date:", date);
    console.log("labourRecords:", labourRecords);
    console.log("grandTotal:", grandTotal);

    const newAttendance = await Attendance.create({
      projectCode,
      date,
      labourRecords,
      grandTotal,
      addedBy: req.user.email,
      status: "draft"
    });

    console.log("Created attendance:", newAttendance);

    res.status(201).json({
      success: true,
      message: "Attendance record added successfully",
      attendance: newAttendance
    });

  } catch (err) {
    console.error("Add Attendance Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

// ✅ 2. GET All Attendance Records (Only for that Project)
const getAllAttendance = async (req, res) => {
  try {
    const projectCode = req.user.projectCode;

    const attendanceRecords = await Attendance.find({ projectCode })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      attendanceRecords
    });

  } catch (err) {
    console.log("Get Attendance Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// ✅ 3. GET Single Attendance Record
const getSingleAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findOne({
      _id: id,
      projectCode: req.user.projectCode
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found"
      });
    }

    res.status(200).json({
      success: true,
      attendance
    });

  } catch (err) {
    console.log("Get Single Attendance Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// ✅ 4. UPDATE Attendance Record
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, labourRecords, grandTotal, status } = req.body;
    const projectCode = req.user.projectCode;

    console.log("=== UPDATE ATTENDANCE DEBUG ===");
    console.log("Record ID:", id);
    console.log("Project Code:", projectCode);
    console.log("Update Data:", { date, labourRecords, grandTotal, status });

    // First check if record belongs to this user's project
    const existingRecord = await Attendance.findOne({
      _id: id,
      projectCode: projectCode
    });

    if (!existingRecord) {
      console.error("Record not found or doesn't belong to this project");
      return res.status(404).json({
        success: false,
        message: "Attendance record not found"
      });
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id,
      {
        date,
        labourRecords,
        grandTotal,
        status
      },
      { new: true, runValidators: false } // Disable validators to allow our custom validation
    );

    console.log("Updated record:", updatedAttendance);

    res.status(200).json({
      success: true,
      message: "Attendance record updated successfully",
      attendance: updatedAttendance
    });

  } catch (err) {
    console.error("Update Attendance Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

// ✅ 5. DELETE Attendance Record
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAttendance = await Attendance.findByIdAndDelete(id);

    if (!deletedAttendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance record deleted successfully"
    });

  } catch (err) {
    console.log("Delete Attendance Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// ✅ 6. SUBMIT Attendance Record (Change status from draft to submitted)
const submitAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const submittedAttendance = await Attendance.findByIdAndUpdate(
      id,
      { status: "submitted" },
      { new: true }
    );

    if (!submittedAttendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance record submitted successfully",
      attendance: submittedAttendance
    });

  } catch (err) {
    console.log("Submit Attendance Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

// ✅ Export All Controllers
module.exports = {
  addAttendance,
  getAllAttendance,
  getSingleAttendance,
  updateAttendance,
  deleteAttendance,
  submitAttendance
};
