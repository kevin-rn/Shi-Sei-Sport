import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface OptionGroup {
  group: string;
  options: Option[];
}

type SelectItem = Option | OptionGroup;

function isGroup(item: SelectItem): item is OptionGroup {
  return 'group' in item;
}

function flatOptions(items: SelectItem[]): Option[] {
  return items.flatMap(item => isGroup(item) ? item.options : [item]);
}

interface CustomSelectProps {
  id?: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectItem[];
  required?: boolean;
  className?: string;
}

export function CustomSelect({ id, name, value, onChange, options, required, className }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = flatOptions(options).find(o => o.value === value);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  function handleSelect(optValue: string) {
    const syntheticEvent = {
      target: { name, value: optValue },
    } as ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
    setOpen(false);
  }

  // Strip focus classes from caller — handled here based on open state
  const baseClass = (className ?? '').replace(/\bfocus:[^\s]+/g, '').trim();
  const openRing = open ? 'ring-2 ring-judo-red border-transparent' : '';

  return (
    <div ref={ref} className="relative" id={id}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`${baseClass} ${openRing} flex items-center justify-between text-left focus-visible:ring-2 focus-visible:ring-judo-red focus-visible:border-transparent focus:outline-none`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? '' : 'text-gray-400 dark:text-gray-500'}>
          {selected ? selected.label : ''}
        </span>
        <ChevronDown className={`w-4 h-4 ml-2 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 dark:border-[#2e3145] bg-white dark:bg-[#252836] shadow-lg overflow-auto max-h-64"
        >
          {options.map((item, i) =>
            isGroup(item) ? (
              <li key={`group-${i}`} role="presentation">
                <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide bg-gray-50 dark:bg-[#1e2030]">
                  {item.group}
                </div>
                <ul>
                  {item.options.map(opt => (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={opt.value === value}
                      onClick={() => handleSelect(opt.value)}
                      className={`px-4 py-2 text-sm cursor-pointer select-none text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#2e3145] ${opt.value === value ? 'font-semibold' : ''}`}
                    >
                      {opt.label}
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li
                key={item.value}
                role="option"
                aria-selected={item.value === value}
                onClick={() => handleSelect(item.value)}
                className={`px-4 py-2 text-sm cursor-pointer select-none text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#2e3145] ${item.value === value ? 'font-semibold' : ''}`}
              >
                {item.label}
              </li>
            )
          )}
        </ul>
      )}

      {/* Hidden native select for form validation */}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-hidden="true"
        tabIndex={-1}
        style={{ display: 'block', position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0, overflow: 'hidden' }}
      >
        {options.map((item, i) =>
          isGroup(item) ? (
            <optgroup key={`group-${i}`} label={item.group}>
              {item.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </optgroup>
          ) : (
            <option key={item.value} value={item.value}>{item.label}</option>
          )
        )}
      </select>
    </div>
  );
}
