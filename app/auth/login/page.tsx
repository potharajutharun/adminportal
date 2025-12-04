"use client";

import AuthForm from "../../components/AuthForm";
import { loginUser } from "../../lib/apis/authApi";
import { useAuth } from "../../context/AuthContext";
import LeftPanel from "@/app/components/LeftPanel";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Sociallogins from "@/app/components/Sociallogins";

export default function LoginPage() {
  const router = useRouter();
  const { setAuthData } = useAuth(); // ✅ get user from context

  async function handleLogin(values: { email: string; password: string }) {

    try {
      const res = await loginUser(values.email, values.password);
      // console.log("Login successful:", res);
      setAuthData(res.data.data, { accessToken: res.data.accessToken });
       console.log("User logged in:", res.data.data); // ✅ log user data
      router.replace("/admin/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid credentials");
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

          <AuthForm
            mode="login"
            onSubmit={async (v: { email: string; password: string }) =>
              await handleLogin(v)
            }
          />

          <p className="text-right text-sm text-blue-700 mb-6 hover:underline">
            <Link href="/auth/forgotpassword">Forgot Password?</Link>
          </p>

          <Sociallogins />

          <div className="mt-4 text-xs text-gray-400">
            By continuing, you agree to our{" "}
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
