import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Pre-seeded admin account — change these to your real credentials
const ADMIN = {
  id: 1,
  name: "Admin",
  email: "admin@hostel.com",
  password: "admin123",
  role: "admin",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem("hd_admin");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // const login = ({ email, password }) => {
  //   if (email === ADMIN.email && password === ADMIN.password) {
  //     const sessionUser = { id: ADMIN.id, name: ADMIN.name, email: ADMIN.email, role: ADMIN.role };
  //     setUser(sessionUser);
  //     sessionStorage.setItem("hd_admin", JSON.stringify(sessionUser));
  //     return { success: true };
  //   }
  //   return { success: false, error: "Invalid email or password." };
  // };

  const login = ({ email, name }) => {
  const sessionUser = {
    id: Date.now(),
    name: name || "User",
    email,
    role: "user", // always user for now
  };

  setUser(sessionUser);
  sessionStorage.setItem("hd_admin", JSON.stringify(sessionUser));

  return { success: true };
};

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("hd_admin");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
