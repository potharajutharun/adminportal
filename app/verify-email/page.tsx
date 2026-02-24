"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/app/lib/apis/authApi";

const readApiErrorMessage = (error: unknown): string | null => {
  if (typeof error !== "object" || error === null) return null;
  const withResponse = error as { response?: { data?: { message?: unknown } } };
  const message = withResponse.response?.data?.message;
  return typeof message === "string" ? message : null;
};

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Verifying your email...");
  const [isSuccess, setIsSuccess] = useState(false);

  const canVerify = useMemo(() => typeof token === "string" && token.length > 0, [token]);

  useEffect(() => {
    const runVerification = async () => {
      if (!canVerify || !token) {
        setIsSuccess(false);
        setLoading(false);
        setMessage("Verification token is missing.");
        return;
      }

      try {
        await verifyEmail(token);
        setIsSuccess(true);
        setMessage("Email verified successfully. You can login now.");
      } catch (error) {
        const apiMessage = readApiErrorMessage(error);
        setIsSuccess(false);
        setMessage(
          apiMessage
            ? apiMessage
            : "Could not verify email. The link may be invalid or expired."
        );
      } finally {
        setLoading(false);
      }
    };

    runVerification();
  }, [canVerify, token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-md border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold mb-3">Email Verification</h1>
        <p className={`text-sm ${isSuccess ? "text-green-700" : "text-gray-700"}`}>{message}</p>

        {!loading && (
          <div className="mt-6">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
