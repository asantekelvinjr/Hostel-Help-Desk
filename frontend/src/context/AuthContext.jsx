import React, { createContext, useContext, useState } from "react";
import { loginUser, loginAdmin } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem("hd_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // ── User login ───────────────────────────────────────────
  const login = async ({ email, password }) => {
    try {
      const { data } = await loginUser({ email, password });
      const sessionUser = { ...data.user, role: "user" };
      setUser(sessionUser);
      sessionStorage.setItem("hd_user", JSON.stringify(sessionUser));
      sessionStorage.setItem("hd_token", data.token);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  // ── Admin login ──────────────────────────────────────────
  const adminLogin = async ({ email, password }) => {
    try {
      const { data } = await loginAdmin({ email, password });
      const sessionUser = { ...data.admin, role: "admin" };
      setUser(sessionUser);
      sessionStorage.setItem("hd_user", JSON.stringify(sessionUser));
      sessionStorage.setItem("hd_token", data.token);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  // ── Logout ───────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("hd_user");
    sessionStorage.removeItem("hd_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
