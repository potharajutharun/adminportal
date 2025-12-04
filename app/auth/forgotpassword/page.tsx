"use client";
import { useState } from "react";
import LeftPanel from "../../components/LeftPanel";
import Link from "next/link";
import { forgotPassword } from "../../lib/apis/authApi";
import { IoIosArrowRoundBack } from "react-icons/io";
import AuthForm from "@/app/components/AuthForm";
import validateEmail from "@/app/utils/emailvalidation";
import Loader from "@/app/components/Loader";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(values: { email: string }) {
    if (!validateEmail(values.email)) {
      setMessage("❌ Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPassword(values.email);
      if (res.status === 200) {
        setMessage("✅ Password reset link has been sent to your email.");
      }
    } catch (err: any) {
      setMessage("❌ Failed to send reset link. Try again.");
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex">
      <LeftPanel />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-md shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Forgot Password?</h2>
          <p className="text-sm text-gray-800 mb-6">
            Enter your registered email address and we’ll send you a password
            reset link.
          </p>

          <AuthForm
            mode="forgotpassword"
            onSubmit={async (v: { email: string }) => handleSubmit(v)}
          />

          {message && <p className="text-sm mt-4 text-gray-700">{message}</p>}

          <div className="mt-6 text-sm text-gray-800">
            <Link
              href="/auth/login"
              className="text-blue-700 font-medium hover:underline flex items-center gap-1"
            >
              <IoIosArrowRoundBack className="h-5 w-5" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
