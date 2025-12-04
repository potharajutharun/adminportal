"use client";

import { useState } from "react";
import LeftPanel from "../../components/LeftPanel";
import AuthForm from "../../components/AuthForm";
import { resetPassword } from "@/app/lib/apis/authApi";
import { validatePassword } from "@/app/utils/validatepassword";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import Link from "next/link";
import { IoIosArrowRoundBack } from "react-icons/io";

import { AuthFormValues } from "@/app/components/AuthForm";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

 async function handleReset(values: AuthFormValues) {
  // Narrow type
  if ("token" in values && "confirmpassword" in values) {
    if (!validatePassword(values.password)) {
      setMessage("❌ Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }
    if (values.password !== values.confirmpassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(values.token, values.password);
      if (res.status === 200) {
        setMessage("✅ Password reset successfully! Redirecting...");
        setTimeout(() => router.push("/auth/login"), 2000);
      }
    } catch {
      setMessage("❌ Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  } else {
    setMessage("❌ Invalid form submission");
  }
}


  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex">
      <LeftPanel />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-md shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
          <p className="text-sm text-gray-800 mb-6">Set a new password for your account.</p>

          <AuthForm mode="resetpassword" onSubmit={handleReset} />

          {message && <p className="text-sm mt-4 text-gray-700">{message}</p>}

          <div className="mt-6 text-sm text-gray-800">
            <Link href="/auth/login" className="text-blue-700 font-medium hover:underline flex items-center gap-1">
              <IoIosArrowRoundBack className="h-5 w-5" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
