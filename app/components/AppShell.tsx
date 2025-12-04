"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Loader from "./Loader";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

   console.log("AppShell - isAuthenticated:", isAuthenticated, "loading:", loading);
  const pathname = usePathname();
  const router = useRouter();

  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgotpassword",
    "/auth/resetpassword",
  ];

  const cleanPath = pathname.split("?")[0].replace(/\/$/, "");
  const isPublic = publicRoutes.includes(cleanPath);

 useEffect(() => {
  if (loading) return;

  // Not logged in → kick out of protected routes
  if (!isAuthenticated && !isPublic) {
    router.replace("/auth/login");
    return;
  }

  // Logged in → prevent visiting auth pages or root
  if (isAuthenticated && (isPublic || pathname === "/")) {
    router.replace("/admin/dashboard");
  }
}, [loading, isAuthenticated, isPublic, pathname, router]);


  // Avoid flicker
  if (loading || (isAuthenticated && isPublic)) return <Loader />;
  if (!isAuthenticated && !isPublic) return null;

  return (
    <div className="flex h-screen">
      {!isPublic && <Sidebar />}
      <main
        className={`flex-1 overflow-y-auto ${
          isPublic ? "bg-white" : "bg-gray-50"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
