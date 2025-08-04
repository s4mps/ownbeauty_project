import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log('AuthContext - checking auth status, token exists:', !!token);
      
      if (token) {
        // Verify token with backend
        const response = await authAPI.verify();
        console.log('AuthContext - verify response:', response);
        
        if (response.valid && response.user) {
          console.log('AuthContext - setting user:', response.user);
          setUser(response.user);
        } else {
          console.log('AuthContext - invalid token, removing from localStorage');
          localStorage.removeItem("token");
        }
      } else {
        console.log('AuthContext - no token found');
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.success && response.token) {
        localStorage.setItem("token", response.token);
        setUser(response.user);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const { name, email, password } = userData;
      const response = await authAPI.register(name, email, password);
      if (response.success && response.token) {
        localStorage.setItem("token", response.token);
        setUser(response.user);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || "Registration failed",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
