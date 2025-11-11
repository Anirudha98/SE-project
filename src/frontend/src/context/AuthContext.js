import React, { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "../services/api";

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const AUTH_STORAGE_KEY = "auth";

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAuthToken(parsed.token);
        return parsed;
      } catch (error) {
        console.warn("Failed to parse auth state:", error);
      }
    }
    return { token: null, user: null };
  });

  useEffect(() => {
    if (state?.token) {
      setAuthToken(state.token);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    } else {
      setAuthToken(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [state]);

  const login = ({ token, user }) => setState({ token, user });
  const logout = () => setState({ token: null, user: null });

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAuthenticated: Boolean(state.token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
