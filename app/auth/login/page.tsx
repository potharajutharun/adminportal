"use client";

import AuthForm, { AuthFormValues } from "../../components/AuthForm";
import { loginUser } from "../../lib/apis/authApi";
import { useAuth } from "../../context/AuthContext";
import LeftPanel from "@/app/components/LeftPanel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sociallogins from "@/app/components/Sociallogins";

export default function LoginPage() {
  const router = useRouter();
  const { setAuthData } = useAuth();

  // Must accept AuthFormValues (union), then narrow to login variant
  async function handleLogin(values: AuthFormValues) {
    // login variant: { email, password }
    if ("email" in values && "password" in values && !("confirmpassword" in values) && !("token" in values)) {
      const res = await loginUser(values.email, values.password);
      setAuthData(res.data.data, { accessToken: res.data.accessToken });
      router.replace("/admin/dashboard");
    } else {
      // If something else comes through, treat as invalid for this page
      throw new Error("Invalid form submission for login");
    }
  }

  return (
    <div className="min-h-screen flex">
      <LeftPanel />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-md shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Welcome Back!</h2>
          <p className="text-sm text-gray-800 mb-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-blue-700 font-medium hover:underline"
            >
              Create one
            </Link>
          </p>

          <AuthForm mode="login" onSubmit={handleLogin} />

          <p className="text-right text-sm text-blue-700 mb-6 hover:underline">
            <Link href="/auth/forgotpassword">Forgot Password?</Link>
          </p>

          <Sociallogins />

          <div className="mt-4 text-xs text-gray-400">
            By continuing, you agree to our{" "}
            <span className="text-blue-700 hover:underline">terms</span> and{" "}
            <span className="text-blue-700 hover:underline">privacy policy</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
