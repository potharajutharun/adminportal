"use client";
import { useState } from "react";
import LeftPanel from "../../components/LeftPanel";
import Link from "next/link";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      if (res.status === 200) {
        setMessage("✅ Password reset link has been sent to your email.");
      }
    } catch (err: any) {
      setMessage("❌ Failed to send reset link. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <LeftPanel />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-md shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Forgot Password?</h2>
          <p className="text-sm text-gray-800 mb-6">
            Enter your registered email address and we’ll send you a password reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              {loading ? "Sending..." : "Send Reset Link"}
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
