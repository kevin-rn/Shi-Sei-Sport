import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { PHONE_RULES } from '../lib/validation';
import { COUNTRY_CODES } from './countryCodes';

function parsePhone(value: string): { code: string; number: string } {
  if (!value) return { code: '+31', number: '' };
  const match = value.match(/^(\+\d{1,4})-(.*)/);
  if (match) return { code: match[1], number: match[2] };
  return { code: '+31', number: value };
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  id?: string;
  hasError?: boolean;
  inputClassName?: string;
  'aria-describedby'?: string;
}

export function PhoneInput({
  value,
  onChange,
  onBlur,
  required,
  id,
  hasError,
  inputClassName = '',
  'aria-describedby': ariaDescribedby,
}: PhoneInputProps) {
  const { code, number } = parsePhone(value);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    searchRef.current?.focus();
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const filtered = search
    ? COUNTRY_CODES.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()))
    : COUNTRY_CODES;

  const selectedLabel = COUNTRY_CODES.find((c) => c.code === code)?.label ?? code;
  const borderClass = hasError ? 'border-red-400' : 'border-gray-300';
  const rules = PHONE_RULES[code];
  const placeholder = rules ? '0'.repeat(rules.min) : '612345678';

  return (
    <div
      className="flex items-center gap-2"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onBlur?.();
        }
      }}
    >
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => { setIsOpen((o) => !o); setSearch(''); }}
          onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
          className={`flex items-center gap-1 px-2 sm:px-3 py-2 border ${isOpen ? 'ring-2 ring-judo-red border-transparent' : borderClass} rounded-lg bg-white focus-visible:ring-2 focus-visible:ring-judo-red focus-visible:border-transparent focus:outline-none text-xs sm:text-sm w-24 sm:w-28`}
        >
          <span className="flex-1 text-left truncate">{selectedLabel}</span>
          <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg w-40">
            <div className="p-2 border-b border-gray-100">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && (setIsOpen(false), setSearch(''))}
                placeholder="Zoeken..."
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-judo-red"
              />
            </div>
            <ul className="max-h-48 overflow-y-auto">
              {filtered.map((c) => (
                <li key={c.code}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(`${c.code}-${number}`);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${c.code === code ? 'text-judo-red font-medium' : ''}`}
                  >
                    {c.label}
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-3 py-2 text-sm text-gray-400">Geen resultaten</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <span className="text-gray-400 select-none">–</span>

      <input
        type="tel"
        id={id}
        required={required}
        value={number}
        onChange={(e) => {
          const num = e.target.value.replace(/[^\d\s]/g, '');
          onChange(`${code}-${num}`);
        }}
        aria-describedby={ariaDescribedby}
        aria-invalid={hasError ? true : undefined}
        placeholder={placeholder}
        className={`flex-1 min-w-0 px-3 sm:px-4 py-2 border ${borderClass} rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent text-sm sm:text-base ${inputClassName}`}
      />
    </div>
  );
}
