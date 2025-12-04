"use client";

import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "@/app/lib/apis/authApi";

export default function DashboardPage() {
  const { user } = useAuth();
   console.log("User data in DashboardPage:", user);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {user ? (
        <div className="mb-4">
          <p className="text-gray-700">
            Welcome, <span className="font-semibold">{user.email}</span>
          </p>
      

        </div>
      ) : (
        <p className="text-gray-500">Loading user data...</p>
      )}

      <button
        onClick={logoutUser}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
