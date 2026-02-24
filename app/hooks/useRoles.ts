"use client";
import { useEffect, useState } from "react";
import apiClient from "../lib/apiClient";
import { Role, CreateRoleRequest } from "../types/role.js";
import { getErrorMessage } from "@/app/lib/getErrorMessage";

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/roles/list");
      setRoles(res.data.roles || []);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to fetch roles"));
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (payload: CreateRoleRequest) => {
    try {
      const res = await apiClient.post("/roles/create", payload);
      setRoles((prev) => [...prev, res.data.role]);
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err, "Failed to create role"));
    }
  };

  const deleteRole = async (id: number) => {
    try {
      // backend should have delete endpoint
      await apiClient.post("/roles/remove", { role_id: id });
      setRoles((prev) => prev.filter((r) => r.role_id !== id));
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err, "Failed to delete role"));
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return { roles, loading, error, createRole, deleteRole, fetchRoles };
};
