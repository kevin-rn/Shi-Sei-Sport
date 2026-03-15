import { useRef, Fragment, type KeyboardEvent, type ClipboardEvent } from 'react';
import { IBAN_LENGTHS } from '../lib/validation';
import { useLanguage } from '../contexts/LanguageContext';

/** Split segments as groups of 4, with a remainder for the last */
function getSegmentSizes(totalLen: number): number[] {
  if (totalLen <= 0) return [4, 4, 4, 4, 2]; // default NL-like placeholder
  const sizes: number[] = [];
  let remaining = totalLen;
  while (remaining > 0) {
    sizes.push(Math.min(4, remaining));
    remaining -= 4;
  }
  return sizes;
}

function splitToSegments(iban: string, sizes: number[]): string[] {
  const stripped = iban.replace(/\s/g, '').toUpperCase();
  const segs: string[] = [];
  let pos = 0;
  for (const size of sizes) {
    segs.push(stripped.slice(pos, pos + size));
    pos += size;
  }
  return segs;
}

interface IbanInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  id?: string;
  hasError?: boolean;
  'aria-describedby'?: string;
}

export function IbanInput({
  value,
  onChange,
  onBlur,
  required,
  id,
  hasError,
  'aria-describedby': ariaDescribedby,
}: IbanInputProps) {
  const { t } = useLanguage();
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const stripped = value.replace(/\s/g, '').toUpperCase();
  const country = stripped.slice(0, 2);
  const knownLen = (country.length === 2 && /^[A-Z]{2}$/.test(country))
    ? (IBAN_LENGTHS[country] ?? 0)
    : 0;
  const segmentSizes = getSegmentSizes(knownLen);
  const segments = splitToSegments(value, segmentSizes);

  function handleChange(i: number, raw: string) {
    const filtered = raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, segmentSizes[i]);
    const next = segments.map((s, idx) => (idx === i ? filtered : s));
    onChange(next.join(' ').trimEnd());
    if (filtered.length >= segmentSizes[i] && i < segmentSizes.length - 1) {
      refs.current[i + 1]?.focus();
    }
  }

  function handleKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && segments[i] === '' && i > 0) {
      refs.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && e.currentTarget.selectionStart === segments[i].length && i < segmentSizes.length - 1) {
      e.preventDefault();
      refs.current[i + 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && e.currentTarget.selectionStart === 0 && i > 0) {
      e.preventDefault();
      refs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const pastedCountry = pasted.slice(0, 2);
    const pastedLen = (pastedCountry.length === 2 && /^[A-Z]{2}$/.test(pastedCountry))
      ? (IBAN_LENGTHS[pastedCountry] ?? 0)
      : 0;
    const pasteSizes = getSegmentSizes(pastedLen);
    const newSegs = splitToSegments(pasted, pasteSizes);
    onChange(newSegs.join(' ').trimEnd());
    let remaining = pasted.length;
    let focusIdx = pasteSizes.length - 1;
    for (let k = 0; k < pasteSizes.length; k++) {
      if (remaining <= pasteSizes[k]) { focusIdx = k; break; }
      remaining -= pasteSizes[k];
    }
    setTimeout(() => refs.current[focusIdx]?.focus(), 0);
  }

  const borderColor = hasError ? 'border-red-400' : 'border-gray-300';

  return (
    <div className="flex flex-col gap-1">
      <div
        className="flex items-center gap-1.5 flex-wrap"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            onBlur?.();
          }
        }}
      >
        {segmentSizes.map((size, i) => (
          <Fragment key={i}>
            <div
              className={`relative border rounded-md ${borderColor} focus-within:ring-2 focus-within:ring-judo-red focus-within:border-transparent`}
              style={{ width: `${size * 0.75 + 1}rem` }}
            >
              <input
                ref={el => { refs.current[i] = el; }}
                id={i === 0 ? id : undefined}
                type="text"
                inputMode={i >= 2 ? 'numeric' : 'text'}
                maxLength={size}
                value={segments[i]}
                required={required && i === 0}
                aria-label={`IBAN deel ${i + 1} van ${segmentSizes.length}`}
                aria-describedby={i === 0 ? ariaDescribedby : undefined}
                aria-invalid={hasError && i === 0 ? true : undefined}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={handlePaste}
                placeholder={i === 0 ? 'NL12' : i === 1 ? 'ABNA' : '····'}
                className="w-full py-2 text-center font-mono text-sm sm:text-base uppercase tracking-wider sm:tracking-widest bg-transparent focus:outline-none"
              />
            </div>
            {i < segmentSizes.length - 1 && (
              <span className="text-gray-400 select-none text-sm">–</span>
            )}
          </Fragment>
        ))}
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 italic">{t('common.ibanCountryHint')}</p>
    </div>
  );
}
