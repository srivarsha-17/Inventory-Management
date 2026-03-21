// ============ AUTH STORAGE UTILITIES ============

export const setAuthData = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("email", user.email);
  localStorage.setItem("name", user.name);
  localStorage.setItem("role", user.role);
  localStorage.setItem("projectCode", user.projectCode);
};

export const getAuthData = () => {
  return {
    token: localStorage.getItem("token"),
    email: localStorage.getItem("email"),
    name: localStorage.getItem("name"),
    role: localStorage.getItem("role"),
    projectCode: localStorage.getItem("projectCode")
  };
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  localStorage.removeItem("role");
  localStorage.removeItem("projectCode");
};

export const hasRole = (requiredRole) => {
  const userRole = localStorage.getItem("role");
  return userRole === requiredRole;
};

export const hasAnyRole = (roles) => {
  const userRole = localStorage.getItem("role");
  return roles.includes(userRole);
};
