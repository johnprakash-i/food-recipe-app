// src/components/recipe/SearchBar.tsx
import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import { useDebounce } from '../../hooks/useDebounce';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialValue = '',
  placeholder = 'Search for recipes...',
  className = '',
  autoFocus = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        id="search-input"
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        leftIcon={<Search className="h-4 w-4" />}
        rightIcon={
          searchTerm && (
            <button
              onClick={handleClear}
              className="hover:text-secondary-700 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )
        }
        className="pr-12"
      />
      
      {searchTerm && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 animate-scale-in overflow-hidden rounded-xl border border-secondary-200 bg-white shadow-lg">
          <div className="p-4">
            <p className="text-sm text-secondary-600">
              Searching for <span className="font-medium text-secondary-900">"{searchTerm}"</span>...
            </p>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary-100">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-primary-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;