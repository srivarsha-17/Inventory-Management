const express = require("express");
const router = express.Router();

const ensureAuthenticated = require("../Middleware/Auth");
const roleCheck = require("../Middleware/roleCheck");
const {
  addExpenseValidation,
  updateExpenseValidation
} = require("../Middleware/ExpenseValidation");

const {
  addExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  getSingleExpense
} = require("../Controllers/ExpenseController");


// ADD
router.post(
  "/add",
  ensureAuthenticated,
  roleCheck("admin", "inventoryManager"),
  addExpenseValidation,
  addExpense
);


// VIEW ALL  (MUST COME BEFORE :id)
router.get(
  "/all",
  ensureAuthenticated,
  roleCheck("admin", "inventoryManager"),
  getAllExpenses
);


// GET SINGLE (ALWAYS LAST GET ROUTE)
router.get(
  "/:id",
  ensureAuthenticated,
  roleCheck("admin","inventoryManager"),
  getSingleExpense
);


// UPDATE
router.put(
  "/update/:id",
  ensureAuthenticated,
  roleCheck("admin", "inventoryManager"),
  updateExpenseValidation,
  updateExpense
);


// DELETE
router.delete(
  "/delete/:id",
  ensureAuthenticated,
  roleCheck("admin","inventoryManager"),
  deleteExpense
);

module.exports = router;
