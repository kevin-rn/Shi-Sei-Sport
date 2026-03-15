import { Search, Calendar, X, RotateCcw } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { useEffect, useRef, useState, useCallback } from 'react';

interface SelectFilter {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  icon?: React.ReactNode;
}

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterDate: (year: string) => void;
  years: number[];
  className?: string;
  placeholder?: string;
  extraFilters?: SelectFilter[];
}

export const SearchFilter = ({
  onSearch,
  onFilterDate,
  years,
  className = "",
  placeholder = "Zoeken...",
  extraFilters = [],
}: SearchFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const onSearchRef = useRef(onSearch);
  const onFilterDateRef = useRef(onFilterDate);
  const extraFiltersRef = useRef(extraFilters);

  // Keep refs in sync without triggering effects
  useEffect(() => { onSearchRef.current = onSearch; }, [onSearch]);
  useEffect(() => { onFilterDateRef.current = onFilterDate; }, [onFilterDate]);
  useEffect(() => { extraFiltersRef.current = extraFilters; }, [extraFilters]);

  // Debounce search — only depends on searchTerm, not the callback ref
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchRef.current(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    setSelectedYear(year);
    onFilterDateRef.current(year);
  };

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedYear('');
    onSearchRef.current('');
    onFilterDateRef.current('');
    extraFiltersRef.current.forEach((f) => f.onChange(''));
  }, []);

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedYear !== '' ||
    extraFilters.some((f) => f.value !== '');

  return (
    <div className={`mb-10 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-judo-red transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-judo-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-judo-red/20 focus:border-judo-red transition-all"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-judo-red transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          {/* Year filter */}
          <div className="relative w-full sm:w-36 flex items-center">
            <div className="absolute left-3 flex items-center pointer-events-none z-10">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <CustomSelect
              name="year"
              value={selectedYear}
              onChange={handleYearChange}
              className="appearance-none block w-full pl-9 py-2.5 bg-white dark:bg-[#252836] border border-gray-200 dark:border-[#2e3145] rounded-lg text-sm text-judo-dark dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-judo-red/20 focus:border-judo-red cursor-pointer transition-all"
              options={[
                { value: '', label: 'Alle jaren' },
                ...years.map((year) => ({ value: String(year), label: String(year) })),
              ]}
            />
          </div>

          {/* Extra filters */}
          {extraFilters.map((filter, idx) => (
            <div key={idx} className={`relative w-full sm:w-40 flex items-center ${filter.icon ? '' : ''}`}>
              {filter.icon && (
                <div className="absolute left-3 flex items-center pointer-events-none z-10">
                  {filter.icon}
                </div>
              )}
              <CustomSelect
                name={`filter-${idx}`}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className={`appearance-none block w-full ${filter.icon ? 'pl-9' : 'pl-3'} py-2.5 bg-white dark:bg-[#252836] border border-gray-200 dark:border-[#2e3145] rounded-lg text-sm text-judo-dark dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-judo-red/20 focus:border-judo-red cursor-pointer transition-all`}
                options={[
                  { value: '', label: filter.placeholder },
                  ...filter.options,
                ]}
              />
            </div>
          ))}

          {/* Reset Button */}
          <button
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={`search-filter-reset flex items-center justify-center w-10 h-10 self-center border rounded-lg transition-all ${
              hasActiveFilters
                ? "bg-white border-gray-200 text-gray-500 hover:text-judo-red hover:border-judo-red cursor-pointer"
                : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
            }`}
            title="Filters wissen"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-judo-red" />
          <span>Filters actief</span>
          <button
            onClick={clearFilters}
            className="text-judo-red hover:underline ml-1"
          >
            Wis alles
          </button>
        </div>
      )}
    </div>
  );
};
