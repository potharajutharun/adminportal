"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { refreshToken } from "../lib/apis/authApi";
import api from "../lib/api";

export interface User {
  id: number;
  email: string;
  role_id: { role_id: number; role_key: string }[];
}

export interface Tokens {
  accessToken: string;
}

interface AuthContextType {
  user: User | null;
  tokens: Tokens | null;
  loading: boolean;
  isAuthenticated: boolean;
  setAuthData: (user: User, tokens: Tokens) => void;
  clearAuthData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


   console.log("AuthContext initialized. User:", user, "Tokens:", tokens);

  // Restore session from cookie on page reload
  useEffect(() => {
    const restoreSession = async () => {
      try {
        setLoading(true);
        const refreshRes = await refreshToken();
        // console.log("Refresh token response:", refreshRes);
        const accessToken = refreshRes.data.accessToken;
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        // const meRes = await fetchCurrentUser(accessToken);
        setUser(refreshRes.data.data);
        setTokens({ accessToken });
      } catch {
        setUser(null);
        setTokens(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Function to manually update auth state
  const setAuthData = (user: User, tokens: Tokens) => {
    setUser(user);
    setTokens(tokens);
    api.defaults.headers.common["Authorization"] = `Bearer ${tokens.accessToken}`;
  };

  const clearAuthData = () => {
    setUser(null);
    setTokens(null);
    delete api.defaults.headers.common["Authorization"];
    router.replace("/auth/login");
  };


  const isAuthenticated = Boolean(user && tokens?.accessToken);

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        loading,
        isAuthenticated,
        setAuthData,
        clearAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
