'use client';

import React, { useState } from 'react';
import { Search, X, Filter, ChevronDown, Check } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  suggestions?: string[];
  isLoading?: boolean;
  className?: string;
}

/**
 * Smart Search Bar Component
 * AI-powered search with autocomplete and suggestions
 */
export function SearchBar({
  placeholder = 'Search creators, tags, content...',
  onSearch,
  onClear,
  suggestions = [],
  isLoading = false,
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0);
    onSearch?.(value);
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    onClear?.();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch?.(suggestion);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 bg-bg-medium border border-border-medium rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary-blue/50 focus:ring-1 focus:ring-primary-blue/20 transition-all duration-200"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-border-medium rounded transition-colors"
          >
            <X className="w-4 h-4 text-text-tertiary" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-bg-dark border border-border-medium rounded-lg shadow-lg z-50">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-bg-medium transition-colors text-text-secondary hover:text-text-primary border-b border-border-medium last:border-0"
            >
              <Search className="w-4 h-4 inline mr-2 text-text-tertiary" />
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

interface FilterOption {
  id: string;
  label: string;
  count?: number;
  checked?: boolean;
}

interface FilterPanelProps {
  filters: Record<string, FilterOption[]>;
  onFilterChange?: (filterName: string, optionId: string, checked: boolean) => void;
  className?: string;
}

/**
 * Filter Panel Component
 * Advanced filtering for discovery
 */
export function FilterPanel({
  filters,
  onFilterChange,
  className = '',
}: FilterPanelProps) {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(Object.keys(filters))
  );

  const toggleFilter = (filterName: string) => {
    const newExpanded = new Set(expandedFilters);
    if (newExpanded.has(filterName)) {
      newExpanded.delete(filterName);
    } else {
      newExpanded.add(filterName);
    }
    setExpandedFilters(newExpanded);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {Object.entries(filters).map(([filterName, options]) => (
        <div
          key={filterName}
          className="border-b border-border-medium pb-4 last:border-0"
        >
          {/* Filter Header */}
          <button
            onClick={() => toggleFilter(filterName)}
            className="w-full flex items-center justify-between py-2 hover:text-primary-blue transition-colors"
          >
            <span className="font-semibold text-text-primary capitalize">{filterName}</span>
            <ChevronDown
              className={`w-4 h-4 text-text-tertiary transition-transform ${
                expandedFilters.has(filterName) ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Filter Options */}
          {expandedFilters.has(filterName) && (
            <div className="space-y-2 mt-3">
              {options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-3 cursor-pointer py-1 px-2 rounded hover:bg-bg-medium/50 transition-colors"
                >
                  <div className="relative w-4 h-4">
                    <input
                      type="checkbox"
                      checked={option.checked || false}
                      onChange={(e) =>
                        onFilterChange?.(filterName, option.id, e.target.checked)
                      }
                      className="w-4 h-4 rounded border-border-medium bg-bg-medium cursor-pointer appearance-none checked:bg-primary-blue checked:border-primary-blue"
                    />
                    {option.checked && (
                      <Check className="w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none" />
                    )}
                  </div>
                  <span className="text-text-secondary text-sm flex-1">{option.label}</span>
                  {option.count && (
                    <span className="text-text-tertiary text-xs">({option.count})</span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface CategoryFilterProps {
  categories: Array<{ id: string; name: string; icon?: React.ReactNode; count?: number }>;
  selected?: string[];
  onSelect?: (categoryId: string) => void;
  variant?: 'button' | 'chip';
  className?: string;
}

/**
 * Category Filter Component
 * Quick category selection
 */
export function CategoryFilter({
  categories,
  selected = [],
  onSelect,
  variant = 'chip',
  className = '',
}: CategoryFilterProps) {
  if (variant === 'button') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect?.(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              selected.includes(category.id)
                ? 'bg-primary-blue text-white'
                : 'bg-bg-medium text-text-secondary hover:bg-bg-light hover:text-text-primary'
            }`}
          >
            {category.icon}
            {category.name}
            {category.count && <span className="text-xs opacity-75">({category.count})</span>}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect?.(category.id)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 border ${
            selected.includes(category.id)
              ? 'bg-primary-blue/20 border-primary-blue text-primary-blue'
              : 'bg-bg-medium border-border-medium text-text-secondary hover:border-primary-blue/50'
          }`}
        >
          {category.icon}
          {category.name}
        </button>
      ))}
    </div>
  );
}

interface SortOptionProps {
  id: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOptionProps[];
  value?: string;
  onChange?: (optionId: string) => void;
  className?: string;
}

/**
 * Sort Dropdown Component
 * Sorting options for content discovery
 */
export function SortDropdown({
  options,
  value,
  onChange,
  className = '',
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-medium border border-border-medium text-text-secondary hover:text-text-primary hover:border-primary-blue/50 transition-all duration-200"
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">
          {selectedOption?.label || 'Sort by'}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-bg-dark border border-border-medium rounded-lg shadow-lg z-50 min-w-48 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange?.(option.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-border-medium last:border-0 flex items-center gap-2 ${
                value === option.id
                  ? 'bg-primary-blue/10 text-primary-blue font-medium'
                  : 'text-text-secondary hover:bg-bg-medium hover:text-text-primary'
              }`}
            >
              {value === option.id && <Check className="w-4 h-4" />}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const discoveryComponents = {
  SearchBar,
  FilterPanel,
  CategoryFilter,
  SortDropdown,
};
