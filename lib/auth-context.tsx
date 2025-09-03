"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuth, AuthState } from "@/hooks/use-auth";

const AuthContext = createContext<AuthState | undefined>(undefined);

export const useAuthContext = (): AuthState => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authState = useAuth();

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};
