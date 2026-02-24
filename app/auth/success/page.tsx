"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/app/lib/apis/authApi";
import { AuthPayload, AuthUser, extractAuthPayload } from "@/app/lib/auth/contracts";
import { useAuth } from "@/app/context/AuthContext";

const decodeBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
};

const extractOAuthHashPayload = (): AuthPayload | null => {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  const accessToken = params.get("accessToken");
  const refreshToken = params.get("refreshToken");
  const encodedUser = params.get("user");

  if (!accessToken || !refreshToken || !encodedUser) return null;

  try {
    const parsedUser = JSON.parse(decodeBase64Url(encodedUser)) as AuthUser;
    if (!parsedUser || typeof parsedUser !== "object") return null;
    return {
      accessToken,
      refreshToken,
      user: parsedUser,
    };
  } catch {
    return null;
  }
};

export default function OAuthSuccessPage() {
  const router = useRouter();
  const { setAuthData } = useAuth();
  const [message, setMessage] = useState("Finalizing sign-in...");

  useEffect(() => {
    const finalizeOAuth = async () => {
      try {
        const hashPayload = extractOAuthHashPayload();

        if (hashPayload) {
          setAuthData(hashPayload);
          router.replace("/admin/dashboard");
          return;
        }

        const response = await refreshToken();
        const payload = extractAuthPayload(response.data);
        setAuthData(payload);
        router.replace("/admin/dashboard");
      } catch {
        setMessage("OAuth sign-in failed. Please try again.");
        setTimeout(() => router.replace("/auth/login"), 1500);
      }
    };

    finalizeOAuth();
  }, [router, setAuthData]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-md border border-gray-200 bg-white p-8 shadow-sm text-center">
        <h1 className="text-xl font-semibold mb-2">Authentication</h1>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}
