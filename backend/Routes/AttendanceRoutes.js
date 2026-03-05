const express = require("express");
const router = express.Router();

const ensureAuthenticated = require("../Middleware/Auth");
const roleCheck = require("../Middleware/roleCheck");
const {
  addAttendanceValidation,
  updateAttendanceValidation
} = require("../Middleware/AttendanceValidation");

const {
  addAttendance,
  getAllAttendance,
  getSingleAttendance,
  updateAttendance,
  deleteAttendance,
  submitAttendance
} = require("../Controllers/AttendanceController");

// ADD attendance record
router.post(
  "/add",
  ensureAuthenticated,
  roleCheck("admin", "siteEngineer"),
  addAttendanceValidation,
  addAttendance
);

// VIEW ALL attendance records (MUST COME BEFORE :id)
router.get(
  "/all",
  ensureAuthenticated,
  roleCheck("admin", "siteEngineer", "inventoryManager"),
  getAllAttendance
);

// GET SINGLE attendance record (ALWAYS LAST GET ROUTE)
router.get(
  "/:id",
  ensureAuthenticated,
  roleCheck("admin", "siteEngineer", "inventoryManager"),
  getSingleAttendance
);

// UPDATE attendance record
router.put(
  "/update/:id",
  ensureAuthenticated,
  roleCheck("admin", "siteEngineer"),
  updateAttendanceValidation,
  updateAttendance
);

// SUBMIT attendance record (change status from draft to submitted)
router.put(
  "/submit/:id",
  ensureAuthenticated,
  roleCheck("admin", "siteEngineer"),
  submitAttendance
);

// DELETE attendance record
router.delete(
  "/delete/:id",
  ensureAuthenticated,
  roleCheck("admin", "siteEngineer"),
  deleteAttendance
);

module.exports = router;
