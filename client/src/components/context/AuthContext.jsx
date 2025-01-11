import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// AuthProvider component to provide authentication context
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({ token: null, role: null ,name:null});

  // Initialize authentication state from sessionStorage on mount
  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const role = sessionStorage.getItem('role');
    if (token && role) {
      setAuthData({ token, role });
    }
  }, []);

  // Login function to store token and role in sessionStorage
  const login = (token, role,name) => {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('name',name)
    setAuthData({ token, role ,name});
  };

  // Logout function to clear token and role from sessionStorage
  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('name')
    setAuthData({ token: null, role: null,name:null });
  };

  // Provide authentication data and login/logout functions
  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
