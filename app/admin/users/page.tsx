"use client";

import React, { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { Loader2, Edit2, CheckCircle2, XCircle } from "lucide-react";

interface User {
  user_id: number;
  full_name: string;
  email: string;
  role_key?: string;
  is_active?: boolean;
  created_at?: string;
}

export default function UsersPage() {
  const { tokens } = useAuth();
  const accessToken = tokens?.accessToken;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });

  // Fetch users
  useEffect(() => {
    if (!accessToken) return;
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log(res, "users");
        setUsers(res.data.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [accessToken]);

  // Update user active status
  const toggleActive = async (userId: number, currentStatus?: boolean) => {
    alert(userId);
    try {
      await api.patch(
        `/users/${userId}/active_status`,
        { is_active: !currentStatus },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === userId ? { ...u, is_active: !currentStatus } : u
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // Start editing
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.full_name || "",
      email: user.email || "",
      role: user.role_key || "",
    });
  };

  // Save user edit
  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      const res = await api.put(`/users/${editingUser.user_id}`, editForm, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers((prev) =>
        prev.map((u) => (u.user_id === editingUser.user_id ? res.data : u))
      );
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading users...
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md text-center">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Management</h1>

      {users.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No users found.</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th> 
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr
                  key={u.user_id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">{index++ + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {u.full_name || "-"}
                  </td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.role_key || "—"}</td>
                  <td className="px-4 py-3">
                    {u.is_active ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-red-600 font-medium">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button className="" onClick={() => handleEdit(u)}>
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </button>

                    {u.is_active ? (
                      <button onClick={() => toggleActive(u.user_id, u.is_active)}>
                        <XCircle className="w-4 h-4 mr-1" /> Deactivate
                      </button>
                    ) : (
                      <button onClick={() => toggleActive(u.user_id, u.is_active)}>
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Dialog */}
      {/* <Modal open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input
              placeholder="Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <input
              placeholder="Email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
            />
            <input
              placeholder="Role"
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
              <button onClick={handleSaveEdit}>Save</button>
            </div>
          </div>
        </DialogContent>
      </Modal> */}
    </div>
  );
}
