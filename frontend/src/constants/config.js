// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  TIMEOUT: 10000
};

// User Roles
export const ROLES = {
  ADMIN: "admin",
  SITE_ENGINEER: "siteEngineer",
  INVENTORY_MANAGER: "inventoryManager"
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted"
};

// Expense Categories
export const EXPENSE_CATEGORIES = [
  "Materials",
  "Labour",
  "Transport",
  "Equipment",
  "Other"
];

// Labour Types for Attendance
export const LABOUR_TYPES = [
  "Skilled",
  "Semi-Skilled",
  "Unskilled",
  "Supervisor"
];

// Messages
export const MESSAGES = {
  SUCCESS: "Operation successful",
  ERROR: "Something went wrong",
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "You don't have permission to perform this action",
  LOADING: "Loading...",
  SAVING: "Saving..."
};
