"use client";

import { useState } from "react";
import LeftPanel from "../../components/LeftPanel";
import AuthForm, { AuthFormValues } from "@/app/components/AuthForm";
import { forgotpassword } from "@/app/lib/apis/authApi";
import validateEmail from "@/app/utils/emailvalidation";
import Loader from "@/app/components/Loader";
import Link from "next/link";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(values: AuthFormValues) {
    // forgotpassword variant is just { email }
    if ("email" in values && !("password" in values) && !("token" in values)) {
      if (!validateEmail(values.email)) {
        setMessage("❌ Please enter a valid email address.");
        return;
      }

      setLoading(true);
      try {
        const res = await forgotpassword(values.email);
        if (res.status === 200) setMessage("✅ Password reset link sent!");
        else setMessage("❌ Failed to send reset link. Try again.");
      } catch {
        setMessage("❌ Failed to send reset link. Try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // Should never happen when mode="forgotpassword"
      throw new Error("Invalid form submission for forgot password");
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex">
      <LeftPanel />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-md shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Forgot Password?</h2>
          <p className="text-sm text-gray-800 mb-6">
            Enter your registered email address and we’ll send you a password reset link.
          </p>

          <AuthForm mode="forgotpassword" onSubmit={handleSubmit} />

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
