import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

function readStoredAdmin() {
  try {
    const raw = localStorage.getItem("mrvilz_admin_user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem("mrvilz_admin_user");
    localStorage.removeItem("mrvilz_admin_token");
    return null;
  }
}

function readStoredToken() {
  const token = localStorage.getItem("mrvilz_admin_token");
  if (!token) return null;
  const admin = readStoredAdmin();
  if (!admin) {
    localStorage.removeItem("mrvilz_admin_token");
    return null;
  }
  return token;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readStoredToken);
  const [admin, setAdmin] = useState(readStoredAdmin);

  const value = useMemo(
    () => ({
      token,
      admin,
      isAuthenticated: Boolean(token && admin),
      login: ({ token: nextToken, admin: nextAdmin }) => {
        localStorage.setItem("mrvilz_admin_token", nextToken);
        localStorage.setItem("mrvilz_admin_user", JSON.stringify(nextAdmin));
        setToken(nextToken);
        setAdmin(nextAdmin);
      },
      logout: () => {
        localStorage.removeItem("mrvilz_admin_token");
        localStorage.removeItem("mrvilz_admin_user");
        setToken(null);
        setAdmin(null);
      }
    }),
    [token, admin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
