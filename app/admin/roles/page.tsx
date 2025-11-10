"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Shield } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { ListRoles, deleteRole } from "@/app/lib/apis/RoleApi";
import Loader from "@/app/components/Loader";
import {CreateRoleComp} from "@/app/components/createRoleComp";
import { Role } from "@/app/types/role";
import RoleListItem from "@/app/components/RoleListItem";
import Search from "@/app/components/Search";

export default function RolesPage(): JSX.Element {
  const { tokens } = useAuth();
  const accessToken = tokens?.accessToken;

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const fetchRoles = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError("");
    try {
      const res = await ListRoles(accessToken);
      const data = res?.data;
      if (!Array.isArray(data)) throw new Error("Invalid response format");
      setRoles(data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch roles");
      console.error("fetchRoles error:", err);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleDeleteRole = useCallback(
    async (roleId: number) => {
      if (!accessToken) {
        alert("Authentication required to delete a role.");
        return;
      }

      if (
        !window.confirm(
          `Are you sure you want to delete role ID: ${roleId}? This action cannot be undone.`
        )
      )
        return;

      setIsDeletingId(roleId);
      try {
        await deleteRole(accessToken, roleId);
        setRoles((prev) => prev.filter((r) => r.role_id !== roleId));
      } catch (err: any) {
        const msg =
          err?.message?.includes?.("in use")
            ? "Cannot delete role: It is currently assigned to entities."
            : `Failed to delete role ${roleId}.`;
        setError(msg);
        console.error("Delete role error:", err);
      } finally {
        setIsDeletingId(null);
      }
    },
    [accessToken]
  );

  const handleEditRole = useCallback(
    (roleId: number) => {
      const roleToEdit = roles.find((r) => r.role_id === roleId);
      if (roleToEdit) {
        // Replace with your edit modal or navigation later
        alert(
          `Editing role: ${roleToEdit.role_key}. A modal/form would open here for key update.`
        );
      }
    },
    [roles]
  );

  const filteredRoles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return q ? roles.filter((r) => r.role_key.toLowerCase().includes(q)) : roles;
  }, [roles, searchQuery]);

  if (loading && roles.length === 0) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto flex flex-col h-[90vh]">
        <div className="flex-shrink-0 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Shield className="mr-3 text-indigo-600" size={28} />
            Role Management
          </h1>

          <div className="mt-4">
            {/* CreateRoleComp is expected to call setRoles or provide a callback via props */}
            <CreateRoleComp setRoles={setRoles} />
          </div>

          {error && (
            <div
              className="p-4 text-sm text-red-800 bg-red-100 rounded-lg mt-4"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="mt-4">
            <Search setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
          </div>
        </div>

        <div className="flex-grow overflow-hidden bg-white rounded-lg border border-gray-200 shadow-md">
          <div className="h-full overflow-y-auto">
            {filteredRoles.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <Shield size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-lg">
                  {searchQuery
                    ? `No roles found matching "${searchQuery}".`
                    : "No roles defined. Start by creating a new role above."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredRoles.map((role) => (
                  <RoleListItem
                    key={role.role_id}
                    role={role}
                    onEdit={handleEditRole}
                    onDelete={handleDeleteRole}
                    isDeleting={isDeletingId === role.role_id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
