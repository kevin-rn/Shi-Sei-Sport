import { Search, Calendar, X, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  // Optional extra select filters rendered after the year dropdown
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

  // Debounce search to avoid too many API calls while typing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    setSelectedYear(year);
    onFilterDate(year);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedYear('');
    onSearch('');
    onFilterDate('');
    extraFilters.forEach((f) => f.onChange(''));
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedYear !== '' ||
    extraFilters.some((f) => f.value !== '');

  return (
    <div className={`flex flex-col md:flex-row gap-4 mb-8 justify-between items-center ${className}`}>
      {/* Search Input */}
      <div className="relative w-full md:max-w-md group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-judo-red transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-judo-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-judo-red/20 focus:border-judo-red transition-all shadow-sm hover:shadow-md"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-judo-red"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter & Actions */}
      <div className="flex gap-3 w-full md:w-auto flex-wrap justify-end">
        {/* Year filter */}
        <div className="relative w-full md:w-40">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-4 w-4 text-gray-500" />
          </div>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="appearance-none block w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-judo-dark focus:outline-none focus:ring-2 focus:ring-judo-red/20 focus:border-judo-red cursor-pointer transition-all shadow-sm hover:shadow-md"
          >
            <option value="">Alle jaren</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {/* Extra filters */}
        {extraFilters.map((filter, idx) => (
          <div key={idx} className="relative w-full md:w-44">
            {filter.icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {filter.icon}
              </div>
            )}
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className={`appearance-none block w-full ${filter.icon ? 'pl-10' : 'pl-4'} pr-8 py-3 bg-white border border-gray-200 rounded-xl text-judo-dark focus:outline-none focus:ring-2 focus:ring-judo-red/20 focus:border-judo-red cursor-pointer transition-all shadow-sm hover:shadow-md`}
            >
              <option value="">{filter.placeholder}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        ))}

        {/* Reset Button */}
        <button
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className={`search-filter-reset flex items-center justify-center px-4 py-3 border rounded-xl transition-all shadow-sm ${
            hasActiveFilters
              ? "bg-white border-gray-200 text-gray-600 hover:text-judo-red hover:border-judo-red hover:shadow-md cursor-pointer"
              : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
          }`}
          title="Filters wissen"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
