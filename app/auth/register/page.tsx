"use client";
import LeftPanel from "../../components/LeftPanel";

import AuthForm from "../../components/AuthForm";
import { registerUser } from "../../lib/apis/authApi";
import { useRouter } from "next/navigation";

import Link from "next/link";
import validateEmail from "@/app/utils/emailvalidation";
import { validatePassword } from "@/app/utils/validatepassword";
import Sociallogins from "@/app/components/Sociallogins";

export default function RegisterPage() {
  const router = useRouter();

  async function handleRegister(values: { email: string; password: string }) {
    if (!validateEmail(values.email)) {
      throw new Error("Invalid email format");
    }
    if (!validatePassword(values.password)) {
      throw new Error("Password does not meet complexity requirements");
    }

    const res = await registerUser(values.email, values.password);
    if (res.status === 201) {
      router.push("/auth/login");
    } else {
      throw new Error("Register failed");
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

          <AuthForm
            mode="register"
            onSubmit={async (v: {
              name?: string;
              email: string;
              password: string;
            }) => handleRegister(v)}
          />

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
