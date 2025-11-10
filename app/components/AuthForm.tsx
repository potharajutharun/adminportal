import React, { useState } from "react";

type Mode = "login" | "register";

type Props = {
  mode?: Mode;
  onSubmit: (values: {
    name?: string;
    email: string;
    password: string;
  }) => Promise<void>;
};

export default function AuthForm({ mode = "login", onSubmit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit({ name: name || undefined, email, password });
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
      {mode === "register" && (
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue"
            placeholder="John Doe"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue"
          placeholder="Enter password"
        />
      </div>
      {mode === "register" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brandBlue"
            placeholder="Enter password"
          />
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
          : "Create account"}
      </button>
    </form>
  );
}
