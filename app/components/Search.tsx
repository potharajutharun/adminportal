import React from "react";
import { Search as SearchIcon, X } from "lucide-react";

type Props = {
  setSearchQuery: (query: string) => void;
  searchQuery: string;
};

export default function Search({ setSearchQuery, searchQuery }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div className="relative">
        <SearchIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a role key..."
          className="w-full pl-10 pr-8 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
            type="button"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
