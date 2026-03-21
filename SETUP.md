# Backend & Frontend Setup

## Backend Files Added

### 1. **Middleware/AttendanceValidation.js**

Validates attendance data before processing.

- `addAttendanceValidation()` - Validates new attendance records
- `updateAttendanceValidation()` - Validates attendance updates

### 2. **Middleware/ExpenseValidation.js**

Validates expense data before processing.

- `addExpenseValidation()` - Validates new expenses
- `updateExpenseValidation()` - Validates expense updates

### 3. **Models/Attendance.js** (Created earlier)

MongoDB schema for attendance records with fields:

- projectCode, date, labourRecords[], grandTotal, addedBy, status

### 4. **Controllers/AttendanceController.js** (Created earlier)

CRUD operations for attendance:

- `addAttendance()`, `getAllAttendance()`, `updateAttendance()`, `deleteAttendance()`, `submitAttendance()`

### 5. **Routes/AttendanceRoutes.js** (Created earlier & Updated)

API endpoints with validation middleware added

---

## Frontend Files Added

### 1. **services/api.js**

Centralized API service for all backend calls.

**Usage:**

```javascript
import { attendanceAPI, expenseAPI, authAPI } from "@/services/api";

// Add attendance
const response = await attendanceAPI.addAttendance(data);

// Get all expenses
const expenses = await expenseAPI.getAllExpenses();
```

### 2. **components/ProtectedRoute.jsx**

Protects routes based on authentication and role.

**Usage:**

```javascript
import ProtectedRoute from "@/components/ProtectedRoute";

<Route
  path="/attendance"
  element={
    <ProtectedRoute requiredRole="siteEngineer">
      <Attendance />
    </ProtectedRoute>
  }
/>;
```

### 3. **components/ErrorBoundary.jsx**

Catches and displays errors gracefully.

**Usage:**

```javascript
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 4. **components/Toast.jsx & Toast.css**

Toast notifications for success/error messages.

**Usage:**

```javascript
import Toast from "@/components/Toast";

<Toast message="Success!" type="success" duration={3000} />
<Toast message="Error occurred" type="error" />
```

### 5. **components/Loader.jsx & Loader.css**

Loading spinner component.

**Usage:**

```javascript
import Loader from "@/components/Loader";

{
  isLoading && <Loader message="Saving..." />;
}
```

### 6. **utils/authStorage.js**

Utility functions for managing auth data in localStorage.

**Available functions:**

```javascript
import {
  setAuthData, // Store auth data after login
  getAuthData, // Retrieve auth data
  isAuthenticated, // Check if user is logged in
  logout, // Clear auth data
  hasRole, // Check specific role
  hasAnyRole, // Check multiple roles
} from "@/utils/authStorage";
```

### 7. **hooks/useToast.js**

Custom hook for managing toast notifications.

**Usage:**

```javascript
import useToast from "@/hooks/useToast";

const { showSuccess, showError, showWarning, showInfo, toasts } = useToast();

showSuccess("Data saved!");
showError("Failed to save");
```

### 8. **constants/config.js**

Central configuration and constants.

**Available constants:**

```javascript
import {
  API_CONFIG,
  ROLES,
  ATTENDANCE_STATUS,
  EXPENSE_CATEGORIES,
  LABOUR_TYPES,
  MESSAGES,
} from "@/constants/config";
```

---

## Environment Variables Needed

Create a `.env` file in the **backend** root:

```
PORT=8080
MONGO_CONN=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Create a `.env.local` file in the **frontend** root:

```
VITE_API_URL=http://localhost:8080
```

---

## Example: Using the New Components

### Adding Attendance with Error Handling & Notifications

```javascript
import { useState } from "react";
import { attendanceAPI } from "@/services/api";
import useToast from "@/hooks/useToast";
import Loader from "@/components/Loader";

export default function Attendance() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, toasts } = useToast();

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await attendanceAPI.addAttendance(data);

      if (response.success) {
        showSuccess("Attendance added successfully!");
      } else {
        showError(response.message || "Failed to add attendance");
      }
    } catch (error) {
      showError("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <Loader message="Saving attendance..." />}
      {/* Your form here */}
    </div>
  );
}
```

---

## API Routes Summary

### Attendance Routes

- `POST /attendance/add` - Add new attendance
- `GET /attendance/all` - Get all records
- `GET /attendance/:id` - Get single record
- `PUT /attendance/update/:id` - Update record
- `PUT /attendance/submit/:id` - Submit record
- `DELETE /attendance/delete/:id` - Delete record

### Expense Routes (Updated)

- `POST /expense/add` - Add new expense
- `GET /expense/all` - Get all expenses
- `GET /expense/:id` - Get single expense
- `PUT /expense/update/:id` - Update expense
- `DELETE /expense/delete/:id` - Delete expense

---

## Notes

- All routes require authentication (Bearer token)
- All routes have role-based access control
- Input validation is now enforced on all POST/PUT requests
- Frontend should save auth data using `setAuthData()` after login
- Use `isAuthenticated()` to check user login status throughout the app
