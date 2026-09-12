import React from 'react';
import { Search, X } from 'lucide-react';

interface RepositorySearchProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
  totalCount?: number;
  filteredCount?: number;
  className?: string;
  id?: string;
}

export const RepositorySearch: React.FC<RepositorySearchProps> = ({
  value,
  onChange,
  placeholder = 'Search repositories...',
  totalCount,
  filteredCount,
  className = '',
  id = 'repository-search-input'
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#B47A9A]">
        <Search className="h-4 w-4" />
      </div>

      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-[#5E3A5C] bg-[#0B0E1A] py-2.5 pl-10 pr-20 text-xs font-urbanist text-[#F3E9EC] placeholder-[#B47A9A]/40 transition-all duration-200 focus:border-[#B47A9A] focus:bg-[#0B0E1A] focus:outline-none focus:ring-1 focus:ring-[#B47A9A]"
      />

      {/* Right controls: clear button or result count */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2 font-urbanist">
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="rounded-full p-1 text-[#B47A9A] hover:bg-[#2C1B2F] hover:text-[#F3E9EC] transition"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {totalCount !== undefined && (
          <span className="font-urbanist text-[11px] font-bold text-[#B47A9A] bg-[#2C1B2F] px-2.5 py-0.5 rounded-full border border-[#5E3A5C]">
            {filteredCount !== undefined && filteredCount !== totalCount
              ? `${filteredCount}/${totalCount}`
              : totalCount}
          </span>
        )}
      </div>
    </div>
  );
};
