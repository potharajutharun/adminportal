"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/app/lib/apis/authApi";
import { extractAuthPayload } from "@/app/lib/auth/contracts";
import { useAuth } from "@/app/context/AuthContext";

export default function OAuthSuccessPage() {
  const router = useRouter();
  const { setAuthData } = useAuth();
  const [message, setMessage] = useState("Finalizing sign-in...");

  useEffect(() => {
    const finalizeOAuth = async () => {
      try {
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
