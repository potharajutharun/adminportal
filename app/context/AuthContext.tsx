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
  role_id?: { role_id: number; role_key: string }[];
}

export interface Tokens {
  accessToken: string;
}

// Matches the *inner* `data` of your login response
export interface AuthData {
  accessToken: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  tokens: Tokens | null;
  loading: boolean;
  isAuthenticated: boolean;
  setAuthData: (data: AuthData) => void;
  clearAuthData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        setLoading(true);

        // Only attempt refresh if refresh cookie exists
        if (!document.cookie.includes("refreshToken")) {
          setLoading(false);
          return;
        }

        const refreshRes = await refreshToken();

        // Support both shapes:
        // 1) { message, data: { accessToken, user } }
        // 2) { accessToken, user }
        const refreshPayload = (refreshRes.data as any).data ?? refreshRes.data;
        const { accessToken, user } = refreshPayload as AuthData;

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        setUser(user);
        setTokens({ accessToken });
      } catch (err) {
        setUser(null);
        setTokens(null);
        delete api.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ✅ Correct: accept { user, accessToken }
  const setAuthData = ({ user, accessToken }: AuthData) => {
    console.log("Setting auth data:", user);

    setUser(user);
    setTokens({ accessToken });

    // Use the fresh token, NOT the old state
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
