"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Shield,
  Database,
  Users,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import Link from "next/link";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const modules = [
    {
      name: "Authentication",
      icon: <Shield size={18} />,
      path: "/admin/auth",
      sub: [
        { label: "Users", path: "/admin/users" },
        { label: "Roles", path: "/admin/roles" },
        { label: "Permissions", path: "/admin/permissions" },
      ],
    },
    {
      name: "Job Portal",
      icon: <Users size={18} />,
      path: "/admin/job",
      sub: [
        { label: "Employers", path: "/admin/job/employers" },
        { label: "Candidates", path: "/admin/job/candidates" },
      ],
    },
    {
      name: "Master Data",
      icon: <Database size={18} />,
      path: "/admin/master",
      sub: [
        { label: "Countries", path: "/admin/master/countries" },
        { label: "States", path: "/admin/master/states" },
        { label: "Cities", path: "/admin/master/cities" },
      ],
    },
    {
      name: "System Settings",
      icon: <Settings size={18} />,
      path: "/admin/settings",
      sub: [],
    },
  ];

  return (
    <aside
      className={`relative h-screen bg-gray-900 text-gray-200 flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      {/* Collapse/Expand button - fixed position */}
      <button
        onClick={toggleSidebar}
        className={`absolute top-4 right-[-12px] z-50 bg-gray-800 border border-gray-700 rounded-full p-1 text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300 ${
          collapsed ? "rotate-180" : ""
        }`}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Header */}
      <div className="flex items-center justify-center p-4 border-b border-gray-700">
        <Link href="/admin/dashboard">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "space-x-2"
          } overflow-hidden`}
        >
          
          <img
            src="/Gemini_Generated_Image_o0uen0o0uen0o0ue-removebg-preview.png"
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
          {!collapsed && (
            <span className="text-lg font-bold whitespace-nowrap">
              Pensoic.com
            </span>
          )}
         
        </div>
         </Link>
      </div>

      {/* Sub-header
      {!collapsed && (
        <div className="px-4 py-2 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-gray-300">Admin Panel</h1>
        </div>
      )} */}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {modules.map((mod) => (
          <SidebarItem key={mod.name} collapsed={collapsed} {...mod} />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-xs text-center text-gray-500">
        {!collapsed && "© 2025 Universal Admin"}
      </div>
    </aside>
  );
};

export default Sidebar;
