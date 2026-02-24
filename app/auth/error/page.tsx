"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OAuthErrorPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-md border border-red-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-red-700 mb-3">Sign-in failed</h1>
        <p className="text-sm text-gray-700 mb-6">
          {reason ? `Reason: ${reason}` : "Could not complete OAuth sign-in."}
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
