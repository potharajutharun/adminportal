"use client";

import { useState } from "react";
// import { useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import SocialButton from "./SocialButton";
import { oauthRedirect } from "../lib/apis/authApi";

function Sociallogins() {
  // const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const onGoogleLogin = () => {
    try {
      setError(null);
      // const tenantParam = searchParams.get("tenant_id");
      // const parsedTenantId = tenantParam ? Number.parseInt(tenantParam, 10) : undefined;
      oauthRedirect("google", 12);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not start Google login. Please check tenant configuration.";
      setError(message);
    }
  };

  return (
    <div className="mt-6 grid gap-3">
      <SocialButton
        label="Continue with Google"
        onClick={onGoogleLogin}
        icon={<FcGoogle className="text-2xl" />}
        className="border hover:underline"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Sociallogins;
