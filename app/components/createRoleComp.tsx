import { Plus } from "lucide-react";
import { useState } from "react";
import { ImCross } from "react-icons/im";
import { LuSendHorizontal } from "react-icons/lu";
import { createRole } from "../lib/apis/RoleApi";
import { useAuth } from "../context/AuthContext";
import { Role } from "@/app/types/role";

interface CreateRoleCompProps {
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

export const CreateRoleComp = ({ setRoles }: CreateRoleCompProps) => {
  const { tokens } = useAuth();
  const [loading, setLoading] = useState(false);
  const [roleKey, setRoleKey] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleCreateRole = async () => {
    if (!tokens?.accessToken) return alert("Unauthenticated");
    const trimmedKey = roleKey.trim();
    if (!trimmedKey) return alert("Role key cannot be empty");

    setLoading(true);
    try {
      const res = await createRole(tokens.accessToken, trimmedKey);
      console.log("Create role response:", res);
      const newRole: Role = res.data.data;
      if (!newRole?.role_id) throw new Error("Invalid response from server");

      setRoles((prev) => [...prev, newRole]);
      alert("Role created successfully");

      setRoleKey("");
      setShowInput(false);
    } catch (err: any) {
      alert(err.message || "Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-4 flex-shrink-0">
      <h1 className="text-2xl font-bold text-gray-800"></h1>

      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus size={18} /> Add Role
        </button>
      ) : (
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg bg-white px-2 py-1">
          <button
            onClick={() => {
              setShowInput(false);
              setRoleKey("");
            }}
            className="p-2 text-red-500 hover:text-red-700"
            title="Cancel"
          >
            <ImCross size={16} />
          </button>

          <input
            type="text"
            placeholder="Enter role key"
            value={roleKey}
            onChange={(e) => setRoleKey(e.target.value)}
            className="border-none focus:outline-none w-48"
            disabled={loading}
          />

          <button
            onClick={handleCreateRole}
            disabled={loading}
            className="text-blue-600 hover:text-blue-800 p-2"
            title="Create Role"
          >
            <LuSendHorizontal size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
