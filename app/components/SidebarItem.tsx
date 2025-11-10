"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SidebarItemProps {
  name: string;
  icon: React.ReactNode;
  sub?: { label: string; path: string }[];
  collapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ name, icon, sub = [], collapsed }) => {
  const [open, setOpen] = useState(false);

  const hasChildren = sub.length > 0;

  return (
    <div className="text-sm">
      <button
        className="flex items-center justify-between w-full px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
        onClick={() => hasChildren && setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          {icon}
          {!collapsed && <span>{name}</span>}
        </div>
        {!collapsed && hasChildren && (
          open ? <ChevronUp size={14} /> : <ChevronDown size={14} />
        )}
      </button>

      {!collapsed && open && hasChildren && (
        <div className="ml-6 mt-1 space-y-1">
          {sub.map((s) => (
            <Link
              key={s.path}
              href={s.path}
              className="block px-3 py-1.5 text-gray-400 hover:bg-gray-800 rounded-md hover:text-white"
            >
              {s.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
