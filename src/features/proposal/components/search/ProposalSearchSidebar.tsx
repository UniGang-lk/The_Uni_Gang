import { Search, SlidersHorizontal, RotateCcw, ChevronDown, Crown } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

export interface SearchFilterState {
  codeSearch: string;
  vipOnly: boolean;
  sortBy: string;
  lookingFor: 'Groom' | 'Bride' | 'All';
  ageRange?: string;
  minAge: string;
  maxAge: string;
  minHeight: string;
  maxHeight: string;
  country: string;
  district: string;
  ethnicity: string;
  caste: string;
  religion: string;
  civilStatus: string;
  profession: string;
  monthlyIncome: string;
  education: string;
  foodPreference: string;
  drinking: string;
  smoking: string;
  differentlyAbled: string;
  accountCreatedBy: string;
  nicVerified: string;
}

const SRI_LANKA_DISTRICTS = [
  'All',
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Moneragala',
  'Ratnapura',
  'Kegalle',
];

const RELIGIONS = ['All', 'Buddhist', 'Catholic', 'Hindu', 'Islam'];

const AGE_RANGES = ['All', '18-25', '26-30', '31-35', '36-40', '41-50', '50+'];

interface ProposalSearchSidebarProps {
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  onResetFilters: () => void;
  onOpenAdvancedDrawer?: () => void;
  className?: string;
}

export default function ProposalSearchSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  onOpenAdvancedDrawer,
  className = '',
}: ProposalSearchSidebarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleChange = (field: keyof SearchFilterState, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const hasActiveFilters =
    Boolean(filters.codeSearch) ||
    filters.district !== 'All' && filters.district !== 'Any' ||
    filters.religion !== 'All' && filters.religion !== 'Any' ||
    (filters.ageRange && filters.ageRange !== 'All') ||
    filters.lookingFor !== 'All' ||
    filters.vipOnly;

  return (
    <aside
      className={`w-full rounded-[2rem] p-6 border shadow-sm font-sans transition-colors duration-300 ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200/90 text-slate-900'
      } ${className}`}
    >
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="space-y-5 pt-5">
        {/* ── 1. SEARCH INPUT (Name or Job) ── */}
        <div>
          <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2 block font-sans">
            Search
          </label>
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Name or Job..."
              value={filters.codeSearch}
              onChange={(e) => handleChange('codeSearch', e.target.value)}
              className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-xs font-semibold placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-600'
                  : 'bg-slate-50/70 border-slate-200 text-slate-900'
              }`}
            />
          </div>
        </div>

        {/* ── 2. DISTRICT DROPDOWN ── */}
        <div>
          <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2 block font-sans">
            District
          </label>
          <div className="relative">
            <select
              value={filters.district === 'Any' ? 'All' : filters.district}
              onChange={(e) => handleChange('district', e.target.value)}
              className={`w-full px-3.5 py-2.5 pr-8 rounded-xl border text-xs font-semibold appearance-none cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-white'
                  : 'bg-slate-50/70 border-slate-200 text-slate-900'
              }`}
            >
              {SRI_LANKA_DISTRICTS.map((d) => (
                <option key={d} value={d} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        {/* ── 3. RELIGION DROPDOWN ── */}
        <div>
          <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2 block font-sans">
            Religion
          </label>
          <div className="relative">
            <select
              value={filters.religion === 'Any' ? 'All' : filters.religion}
              onChange={(e) => handleChange('religion', e.target.value)}
              className={`w-full px-3.5 py-2.5 pr-8 rounded-xl border text-xs font-semibold appearance-none cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-white'
                  : 'bg-slate-50/70 border-slate-200 text-slate-900'
              }`}
            >
              {RELIGIONS.map((r) => (
                <option key={r} value={r} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        {/* ── 4. AGE RANGE PILLS (MATCHING SCREENSHOT 1) ── */}
        <div>
          <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2.5 block font-sans">
            Age Range
          </label>
          <div className="flex flex-wrap gap-2">
            {AGE_RANGES.map((range) => {
              const active = (filters.ageRange || 'All') === range;
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => handleChange('ageRange', range)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    active
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-500/30'
                      : isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {range}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 5. LOOKING FOR (BRIDE / GROOM) ── */}
        <div>
          <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2.5 block font-sans">
            Looking For
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            {(['All', 'Bride', 'Groom'] as const).map((gender) => {
              const active = filters.lookingFor === gender;
              return (
                <button
                  key={gender}
                  type="button"
                  onClick={() => handleChange('lookingFor', gender)}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    active
                      ? 'bg-rose-500 text-white shadow-sm font-black'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {gender === 'Bride' ? '👰 Bride' : gender === 'Groom' ? '🤵 Groom' : 'All'}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 6. VIP PROFILES ONLY ── */}
        <div className="pt-2">
          <label
            onClick={() => handleChange('vipOnly', !filters.vipOnly)}
            className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
              filters.vipOnly
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 font-extrabold'
                : isDark
                ? 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <span className="flex items-center gap-2 text-xs font-bold">
              <Crown size={15} className="text-amber-500 fill-amber-500" />
              <span>VIP Profiles Only</span>
            </span>
            <div
              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                filters.vipOnly
                  ? 'bg-amber-500 border-amber-500 text-slate-950'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              {filters.vipOnly && <span className="text-[10px] font-black">✓</span>}
            </div>
          </label>
        </div>

        {/* ── 7. ADVANCED FILTERS MODAL CTA (20+ FILTERS) ── */}
        {onOpenAdvancedDrawer && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onOpenAdvancedDrawer}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isDark
                  ? 'border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal size={14} className="text-rose-500" />
              <span>More Filters (20+)</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
