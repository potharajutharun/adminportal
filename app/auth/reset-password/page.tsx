"use client";
import { useState } from "react";
import LeftPanel from "../../components/LeftPanel";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("❌ Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/reset-password", {
        token,
        password,
      });
      if (res.status === 200) {
        setMessage("✅ Password reset successfully! Redirecting...");
        setTimeout(() => router.push("/auth/login"), 2000);
      }
    } catch (err: any) {
      setMessage("❌ Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <LeftPanel />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-md shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
          <p className="text-sm text-gray-800 mb-6">
            Set a new password for your account.
          </p>

          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            />
            <input
              type="password"
              value={confirm}
              required
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {message && (
            <p className="text-sm mt-4 text-gray-700">{message}</p>
          )}

          <div className="mt-6 text-sm text-gray-800">
            <Link
              href="/auth/login"
              className="text-blue-700 font-medium hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
