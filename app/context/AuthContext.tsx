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
import { extractAuthPayload, AuthUser } from "../lib/auth/contracts";
import api from "../lib/api";

export interface Tokens {
  accessToken: string;
}

export interface AuthData {
  accessToken: string;
  user: AuthUser;
}

interface AuthContextType {
  user: AuthUser | null;
  tokens: Tokens | null;
  loading: boolean;
  isAuthenticated: boolean;
  setAuthData: (data: AuthData) => void;
  clearAuthData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        setLoading(true);
        const refreshRes = await refreshToken();
        const { accessToken, user } = extractAuthPayload(refreshRes.data);

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        setUser(user);
        setTokens({ accessToken });
      } catch {
        setUser(null);
        setTokens(null);
        delete api.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const setAuthData = ({ user, accessToken }: AuthData) => {
    setUser(user);
    setTokens({ accessToken });
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
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
