import React from "react";
import { format } from "date-fns";
import {
  Trash2,
  Edit,
  Loader2,
  Shield,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Role } from "@/app/types/role";

interface RoleListItemProps {
  role: Role;
  onEdit: (roleId: number) => void;
  onDelete: (roleId: number) => void;
  isDeleting: boolean;
}

export default function RoleListItem({
  role,
  onEdit,
  onDelete,
  isDeleting,
}: RoleListItemProps): JSX.Element {
  const isGlobal = role.tenant_id === null || role.tenant_id === undefined;

  return (
    <div className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 border-b border-gray-100 transition-colors">
      <div className="flex items-center space-x-4 flex-grow min-w-0">
        <Shield
          size={20}
          className={isGlobal ? "text-indigo-600" : "text-gray-500"}
        />

        <div className="min-w-0 flex-grow">
          <div className="flex items-center space-x-2">
            <span
              className={`text-lg font-semibold truncate ${
                isGlobal ? "text-indigo-800" : "text-gray-900"
              }`}
              title={role.role_key}
            >
              {role.role_key}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 bg-gray-100 rounded text-gray-600 hidden sm:inline">
              ID: {role.role_id}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500 mt-0.5">
            <Calendar size={14} className="mr-1.5" />
            Created:{" "}
            {role.created_at
              ? format(new Date(role.created_at), "MMM dd, yyyy @ HH:mm")
              : "—"}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
        <button
          onClick={() => onEdit(role.role_id)}
          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors disabled:opacity-50"
          disabled={isDeleting}
          title="Edit Role Key"
        >
          <Edit size={18} />
        </button>

        <button
          onClick={() => onDelete(role.role_id)}
          disabled={isDeleting}
          className={`p-2 rounded-full transition-colors ${
            isDeleting ? "text-red-400 cursor-not-allowed" : "text-red-600 hover:bg-red-100"
          }`}
          title={isDeleting ? "Deleting..." : "Delete Role"}
        >
          {isDeleting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
        </button>

        <ChevronRight size={20} className="text-gray-400" />
      </div>
    </div>
  );
}
