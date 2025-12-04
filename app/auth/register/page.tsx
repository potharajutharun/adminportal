"use client";

import LeftPanel from "../../components/LeftPanel";
import AuthForm, { AuthFormValues } from "../../components/AuthForm";
import { registerUser } from "../../lib/apis/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { validatePassword } from "@/app/utils/validatepassword";
import Sociallogins from "@/app/components/Sociallogins";
import validateEmail from "@/app/utils/emailvalidation";

export default function RegisterPage() {
  const router = useRouter();

  // Must accept AuthFormValues (union), then narrow inside
  async function handleRegister(values: AuthFormValues) {
    // Only the "register" variant has email + confirmpassword
    if ("email" in values && "confirmpassword" in values) {
      const { email, password, confirmpassword } = values;

      if (!validateEmail(email)) {
        throw new Error("Invalid email format");
      }

      if (!validatePassword(password)) {
        throw new Error(
          "Password does not meet complexity requirements"
        );
      }

      if (password !== confirmpassword) {
        throw new Error("Passwords do not match");
      }

      const res = await registerUser(email, password);

      if (res.status === 201) {
        router.push("/auth/login");
      } else {
        throw new Error(res?.data?.message || "Registration failed");
      }
    } else {
      // This should never happen when mode="register"
      throw new Error("Invalid form submission for register");
    }
  }

  return (
    <div className="min-h-screen flex">
      <LeftPanel />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-md shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Create account</h2>
          <p className="text-sm text-gray-500 mb-6">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-blue-700 font-medium hover:underline"
            >
              Login
            </Link>
          </p>

          {/* This is fine now because handleRegister matches (values: AuthFormValues) */}
          <AuthForm mode="register" onSubmit={handleRegister} />

          <Sociallogins />

          <div className="mt-4 text-xs text-gray-400">
            By creating an account you agree to our{" "}
            <span className="text-blue-700 hover:underline">terms</span> and{" "}
            <span className="text-blue-700 hover:underline">
              privacy policy
            </span>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
