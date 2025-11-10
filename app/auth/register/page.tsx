"use client";
import LeftPanel from "../../components/LeftPanel";
import SocialButton from "../../components/SocialButton";
import AuthForm from "../../components/AuthForm";
import { registerUser, oauthRedirect } from "../../lib/apis/authApi";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { BsTwitterX } from "react-icons/bs";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

 async function handleRegister(values: { name?: string; email: string; password: string }) {
  const res = await registerUser(values.name || "", values.email, values.password);
  if (res.status === 201 || res.status === 200) {
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
            <Link href="/auth/login" className="text-blue-700 font-medium hover:underline">
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

          <div className="mt-6 grid gap-3">
            <SocialButton
              label="Continue with Google"
              onClick={() => oauthRedirect("google")}
              icon={<FcGoogle className="text-2xl" />}
              className="border hover:underline"
            />
            <SocialButton
              label="Continue with Facebook"
              onClick={() => oauthRedirect("facebook")}
              icon={<SiFacebook  className=" text-blue-900 text-2xl"/>}
              className="border hover:underline "
            />
            <SocialButton
              label="Continue with X (Twitter)"
              onClick={() => oauthRedirect("x")}
              icon={<BsTwitterX className="text-xl"/>}
              className="border hover:underline"
            />
          </div>

          <div className="mt-4 text-xs text-gray-400">
            By creating an account you agree to our <span className="text-blue-700 hover:underline">terms</span> and <span className="text-blue-700 hover:underline">privacy policy</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
