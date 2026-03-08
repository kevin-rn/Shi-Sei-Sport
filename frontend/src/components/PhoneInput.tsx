import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { PHONE_RULES } from '../lib/validation';

export const COUNTRY_CODES: { code: string; label: string }[] = [
  { code: '+31',  label: 'NL +31'  },
  { code: '+93',  label: 'AF +93'  },
  { code: '+355', label: 'AL +355' },
  { code: '+213', label: 'DZ +213' },
  { code: '+376', label: 'AD +376' },
  { code: '+244', label: 'AO +244' },
  { code: '+54',  label: 'AR +54'  },
  { code: '+374', label: 'AM +374' },
  { code: '+61',  label: 'AU +61'  },
  { code: '+43',  label: 'AT +43'  },
  { code: '+994', label: 'AZ +994' },
  { code: '+973', label: 'BH +973' },
  { code: '+880', label: 'BD +880' },
  { code: '+375', label: 'BY +375' },
  { code: '+32',  label: 'BE +32'  },
  { code: '+501', label: 'BZ +501' },
  { code: '+229', label: 'BJ +229' },
  { code: '+975', label: 'BT +975' },
  { code: '+591', label: 'BO +591' },
  { code: '+387', label: 'BA +387' },
  { code: '+267', label: 'BW +267' },
  { code: '+55',  label: 'BR +55'  },
  { code: '+673', label: 'BN +673' },
  { code: '+359', label: 'BG +359' },
  { code: '+226', label: 'BF +226' },
  { code: '+257', label: 'BI +257' },
  { code: '+238', label: 'CV +238' },
  { code: '+855', label: 'KH +855' },
  { code: '+237', label: 'CM +237' },
  { code: '+1',   label: 'US/CA +1'},
  { code: '+236', label: 'CF +236' },
  { code: '+235', label: 'TD +235' },
  { code: '+56',  label: 'CL +56'  },
  { code: '+86',  label: 'CN +86'  },
  { code: '+57',  label: 'CO +57'  },
  { code: '+242', label: 'CG +242' },
  { code: '+243', label: 'CD +243' },
  { code: '+506', label: 'CR +506' },
  { code: '+385', label: 'HR +385' },
  { code: '+53',  label: 'CU +53'  },
  { code: '+357', label: 'CY +357' },
  { code: '+420', label: 'CZ +420' },
  { code: '+45',  label: 'DK +45'  },
  { code: '+253', label: 'DJ +253' },
  { code: '+1767',label: 'DM +1767'},
  { code: '+20',  label: 'EG +20'  },
  { code: '+503', label: 'SV +503' },
  { code: '+240', label: 'GQ +240' },
  { code: '+291', label: 'ER +291' },
  { code: '+372', label: 'EE +372' },
  { code: '+268', label: 'SZ +268' },
  { code: '+251', label: 'ET +251' },
  { code: '+679', label: 'FJ +679' },
  { code: '+358', label: 'FI +358' },
  { code: '+33',  label: 'FR +33'  },
  { code: '+241', label: 'GA +241' },
  { code: '+220', label: 'GM +220' },
  { code: '+995', label: 'GE +995' },
  { code: '+49',  label: 'DE +49'  },
  { code: '+233', label: 'GH +233' },
  { code: '+30',  label: 'GR +30'  },
  { code: '+1473',label: 'GD +1473'},
  { code: '+502', label: 'GT +502' },
  { code: '+224', label: 'GN +224' },
  { code: '+245', label: 'GW +245' },
  { code: '+592', label: 'GY +592' },
  { code: '+509', label: 'HT +509' },
  { code: '+504', label: 'HN +504' },
  { code: '+852', label: 'HK +852' },
  { code: '+36',  label: 'HU +36'  },
  { code: '+354', label: 'IS +354' },
  { code: '+91',  label: 'IN +91'  },
  { code: '+62',  label: 'ID +62'  },
  { code: '+98',  label: 'IR +98'  },
  { code: '+964', label: 'IQ +964' },
  { code: '+353', label: 'IE +353' },
  { code: '+972', label: 'IL +972' },
  { code: '+39',  label: 'IT +39'  },
  { code: '+225', label: 'CI +225' },
  { code: '+81',  label: 'JP +81'  },
  { code: '+962', label: 'JO +962' },
  { code: '+254', label: 'KE +254' },
  { code: '+686', label: 'KI +686' },
  { code: '+965', label: 'KW +965' },
  { code: '+996', label: 'KG +996' },
  { code: '+7',   label: 'RU/KZ +7'},
  { code: '+856', label: 'LA +856' },
  { code: '+371', label: 'LV +371' },
  { code: '+961', label: 'LB +961' },
  { code: '+266', label: 'LS +266' },
  { code: '+231', label: 'LR +231' },
  { code: '+218', label: 'LY +218' },
  { code: '+423', label: 'LI +423' },
  { code: '+370', label: 'LT +370' },
  { code: '+352', label: 'LU +352' },
  { code: '+853', label: 'MO +853' },
  { code: '+261', label: 'MG +261' },
  { code: '+265', label: 'MW +265' },
  { code: '+60',  label: 'MY +60'  },
  { code: '+960', label: 'MV +960' },
  { code: '+223', label: 'ML +223' },
  { code: '+356', label: 'MT +356' },
  { code: '+692', label: 'MH +692' },
  { code: '+222', label: 'MR +222' },
  { code: '+230', label: 'MU +230' },
  { code: '+52',  label: 'MX +52'  },
  { code: '+691', label: 'FM +691' },
  { code: '+373', label: 'MD +373' },
  { code: '+377', label: 'MC +377' },
  { code: '+976', label: 'MN +976' },
  { code: '+382', label: 'ME +382' },
  { code: '+212', label: 'MA +212' },
  { code: '+258', label: 'MZ +258' },
  { code: '+264', label: 'NA +264' },
  { code: '+674', label: 'NR +674' },
  { code: '+977', label: 'NP +977' },
  { code: '+64',  label: 'NZ +64'  },
  { code: '+505', label: 'NI +505' },
  { code: '+227', label: 'NE +227' },
  { code: '+234', label: 'NG +234' },
  { code: '+850', label: 'KP +850' },
  { code: '+389', label: 'MK +389' },
  { code: '+47',  label: 'NO +47'  },
  { code: '+968', label: 'OM +968' },
  { code: '+92',  label: 'PK +92'  },
  { code: '+680', label: 'PW +680' },
  { code: '+970', label: 'PS +970' },
  { code: '+507', label: 'PA +507' },
  { code: '+675', label: 'PG +675' },
  { code: '+595', label: 'PY +595' },
  { code: '+51',  label: 'PE +51'  },
  { code: '+63',  label: 'PH +63'  },
  { code: '+48',  label: 'PL +48'  },
  { code: '+351', label: 'PT +351' },
  { code: '+974', label: 'QA +974' },
  { code: '+40',  label: 'RO +40'  },
  { code: '+250', label: 'RW +250' },
  { code: '+1869',label: 'KN +1869'},
  { code: '+1758',label: 'LC +1758'},
  { code: '+1784',label: 'VC +1784'},
  { code: '+685', label: 'WS +685' },
  { code: '+378', label: 'SM +378' },
  { code: '+239', label: 'ST +239' },
  { code: '+966', label: 'SA +966' },
  { code: '+221', label: 'SN +221' },
  { code: '+381', label: 'RS +381' },
  { code: '+232', label: 'SL +232' },
  { code: '+65',  label: 'SG +65'  },
  { code: '+421', label: 'SK +421' },
  { code: '+386', label: 'SI +386' },
  { code: '+677', label: 'SB +677' },
  { code: '+252', label: 'SO +252' },
  { code: '+27',  label: 'ZA +27'  },
  { code: '+82',  label: 'KR +82'  },
  { code: '+211', label: 'SS +211' },
  { code: '+34',  label: 'ES +34'  },
  { code: '+94',  label: 'LK +94'  },
  { code: '+249', label: 'SD +249' },
  { code: '+597', label: 'SR +597' },
  { code: '+46',  label: 'SE +46'  },
  { code: '+41',  label: 'CH +41'  },
  { code: '+963', label: 'SY +963' },
  { code: '+886', label: 'TW +886' },
  { code: '+992', label: 'TJ +992' },
  { code: '+255', label: 'TZ +255' },
  { code: '+66',  label: 'TH +66'  },
  { code: '+670', label: 'TL +670' },
  { code: '+228', label: 'TG +228' },
  { code: '+676', label: 'TO +676' },
  { code: '+1868',label: 'TT +1868'},
  { code: '+216', label: 'TN +216' },
  { code: '+90',  label: 'TR +90'  },
  { code: '+993', label: 'TM +993' },
  { code: '+688', label: 'TV +688' },
  { code: '+256', label: 'UG +256' },
  { code: '+380', label: 'UA +380' },
  { code: '+971', label: 'AE +971' },
  { code: '+44',  label: 'GB +44'  },
  { code: '+598', label: 'UY +598' },
  { code: '+998', label: 'UZ +998' },
  { code: '+678', label: 'VU +678' },
  { code: '+379', label: 'VA +379' },
  { code: '+58',  label: 'VE +58'  },
  { code: '+84',  label: 'VN +84'  },
  { code: '+967', label: 'YE +967' },
  { code: '+260', label: 'ZM +260' },
  { code: '+263', label: 'ZW +263' },
];

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
          className={`flex items-center gap-1 px-3 py-2 border ${isOpen ? 'ring-2 ring-judo-red border-transparent' : borderClass} rounded-lg bg-white focus-visible:ring-2 focus-visible:ring-judo-red focus-visible:border-transparent focus:outline-none text-sm w-28`}
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
        className={`flex-1 px-4 py-2 border ${borderClass} rounded-lg focus:outline-none focus:ring-2 focus:ring-judo-red focus:border-transparent ${inputClassName}`}
      />
    </div>
  );
}
