import React, { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

export const SearchBar = ({ initialValue = '', onSearch, isLoading = false, placeholder = 'Search products, brands, categories (e.g. "laptops", "shoes", "headphones")...' }) => {
  const [term, setTerm] = useState(initialValue);

  useEffect(() => {
    setTerm(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(term.trim());
    }
  };

  const handleClear = () => {
    setTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="w-5 h-5 text-slate-500 absolute left-4 pointer-events-none" />
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-900/90 border border-slate-800 focus:border-teal-500 rounded-2xl py-3.5 pl-12 pr-24 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
        />

        <div className="absolute right-3 flex items-center gap-2">
          {term && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-500 hover:text-slate-300 rounded-lg transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
