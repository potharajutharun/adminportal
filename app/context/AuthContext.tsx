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
import {
  clearStoredRefreshToken,
  getStoredRefreshToken,
  setStoredRefreshToken,
} from "../lib/auth/session";

export interface Tokens {
  accessToken: string;
  refreshToken?: string | null;
}

export interface AuthData {
  accessToken: string;
  user: AuthUser;
  refreshToken?: string;
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
        const storedRefreshToken = getStoredRefreshToken() || undefined;
        if (!storedRefreshToken) {
          setUser(null);
          setTokens(null);
          delete api.defaults.headers.common["Authorization"];
          return;
        }

        const refreshRes = await refreshToken(storedRefreshToken);
        const { accessToken, user, refreshToken: rotatedRefreshToken } =
          extractAuthPayload(refreshRes.data);

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        setUser(user);
        setTokens({ accessToken, refreshToken: rotatedRefreshToken ?? null });
        if (rotatedRefreshToken) {
          setStoredRefreshToken(rotatedRefreshToken);
        }
      } catch {
        setUser(null);
        setTokens(null);
        delete api.defaults.headers.common["Authorization"];
        clearStoredRefreshToken();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const setAuthData = ({ user, accessToken, refreshToken }: AuthData) => {
    setUser(user);
    setTokens({ accessToken, refreshToken: refreshToken ?? null });
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    if (refreshToken) {
      setStoredRefreshToken(refreshToken);
    }
  };

  const clearAuthData = () => {
    setUser(null);
    setTokens(null);
    delete api.defaults.headers.common["Authorization"];
    clearStoredRefreshToken();
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
