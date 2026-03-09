import { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  filters?: {
    key: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }[];
}

export function SearchBar({ placeholder = 'بحث...', value, onChange, filters }: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasActiveFilters = filters?.some(f => f.value !== 'all' && f.value !== '');

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2.5 bg-card rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
          {value && (
            <button
              onClick={() => {
                onChange('');
                inputRef.current?.focus();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        {filters && filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              showFilters || hasActiveFilters
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">تصفية</span>
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {filters.filter(f => f.value !== 'all' && f.value !== '').length}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Filter Dropdowns */}
      <AnimatePresence>
        {showFilters && filters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 p-3 bg-card rounded-xl border border-border">
              {filters.map(filter => (
                <div key={filter.key} className="flex-1 min-w-[140px]">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {filter.label}
                  </label>
                  <select
                    value={filter.value}
                    onChange={e => filter.onChange(e.target.value)}
                    className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="all">الكل</option>
                    {filter.options.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              
              {hasActiveFilters && (
                <button
                  onClick={() => filters.forEach(f => f.onChange('all'))}
                  className="self-end px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  مسح الكل
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
