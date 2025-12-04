"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { refreshToken } from "../lib/apis/authApi";
import api from "../lib/api";

export interface User {
  user_id: number;
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


  //  console.log("AuthProvider mounted, checking for existing session...",user);

 useEffect(() => {
  const restoreSession = async () => {
    try {
      setLoading(true);

      // Only attempt refresh if refresh cookie exists
      if (!document.cookie.includes("refreshToken")) {
        setLoading(false);
        return;
      }

      const refreshRes = await refreshToken(); // call refresh API
      const accessToken = refreshRes.data.accessToken;

      // Set default axios header
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // Set user & tokens
      setUser(refreshRes.data.data);
      setTokens({ accessToken });
    } catch (err) {
      // If refresh fails, silently clear auth without affecting other API calls
      setUser(null);
      setTokens(null);
      delete api.defaults.headers.common["Authorization"];
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
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${tokens.accessToken}`;
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
