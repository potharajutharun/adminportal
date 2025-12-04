"use client";
import React, { useState } from "react";
import PasswordView from "./PasswordView";
import { useSearchParams } from "next/navigation";

type Mode = "login" | "register" | "resetpassword" | "forgotpassword";

type Props = {
  mode?: Mode;
  onSubmit: (values: {
    token?: string;
    email: string;
    password: string;
  }) => Promise<void>;
};

export default function AuthForm({ mode = "login", onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
   const searchParams = useSearchParams();
  const token = searchParams.get("token") || undefined;
  

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit({email, password,token });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Request failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handle} className="space-y-2 w-full max-w-md">
      {mode != "resetpassword" && (
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="you@example.com"
          />
        </div>
      )}

      {/* Password Field */}
      {mode != "forgotpassword" && (
        <div className="relative ">
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="flex items-center">
            <input
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter password"
            />
            <PasswordView
              toggleConfirmPassword={showPassword}
              setToggleConfirmPassword={setShowPassword}
            />
          </div>
        </div>
      )}

      {(mode === "register" || mode == "resetpassword") && (
        <div className="relative">
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <div className="flex items-center">
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Confirm password"
            />

            <PasswordView
              toggleConfirmPassword={showConfirmPassword}
              setToggleConfirmPassword={setShowConfirmPassword}
            />
          </div>
        </div>
      )}

      {error && <div className="text-sm text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-md bg-black text-white font-semibold disabled:opacity-60"
      >
        {loading
          ? "Please wait..."
          : mode === "login"
          ? "Login"
          : mode === "register"
          ? "Register"
          : "Reset Password"}
      </button>
    </form>
  );
}
