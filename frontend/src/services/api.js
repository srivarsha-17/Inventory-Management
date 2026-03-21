const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Get the JWT token from localStorage
const getToken = () => localStorage.getItem("token");

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
});

// ============ AUTH ENDPOINTS ============
export const authAPI = {
  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });
    return response.json();
  }
};

// ============ EXPENSE ENDPOINTS ============
export const expenseAPI = {
  addExpense: async (expenseData) => {
    const response = await fetch(`${API_BASE_URL}/expense/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData)
    });
    return response.json();
  },

  getAllExpenses: async () => {
    const response = await fetch(`${API_BASE_URL}/expense/all`, {
      method: "GET",
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getSingleExpense: async (id) => {
    const response = await fetch(`${API_BASE_URL}/expense/${id}`, {
      method: "GET",
      headers: getAuthHeaders()
    });
    return response.json();
  },

  updateExpense: async (id, expenseData) => {
    const response = await fetch(`${API_BASE_URL}/expense/update/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData)
    });
    return response.json();
  },

  deleteExpense: async (id) => {
    const response = await fetch(`${API_BASE_URL}/expense/delete/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// ============ ATTENDANCE ENDPOINTS ============
export const attendanceAPI = {
  addAttendance: async (attendanceData) => {
    const response = await fetch(`${API_BASE_URL}/attendance/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(attendanceData)
    });
    return response.json();
  },

  getAllAttendance: async () => {
    const response = await fetch(`${API_BASE_URL}/attendance/all`, {
      method: "GET",
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getSingleAttendance: async (id) => {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: "GET",
      headers: getAuthHeaders()
    });
    return response.json();
  },

  updateAttendance: async (id, attendanceData) => {
    const response = await fetch(`${API_BASE_URL}/attendance/update/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(attendanceData)
    });
    return response.json();
  },

  deleteAttendance: async (id) => {
    const response = await fetch(`${API_BASE_URL}/attendance/delete/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return response.json();
  },

  submitAttendance: async (id) => {
    const response = await fetch(`${API_BASE_URL}/attendance/submit/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({})
    });
    return response.json();
  }
};
