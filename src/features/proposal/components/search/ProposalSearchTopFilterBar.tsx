import { useState } from 'react';
import { Search, SlidersHorizontal, Crown, ChevronDown, ChevronUp, X, MapPin, Briefcase, Filter } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';
import { SearchFilterState } from './ProposalSearchSidebar';

interface ProposalSearchTopFilterBarProps {
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  onOpenAdvancedDrawer: () => void;
  activeFilterCount: number;
}

export default function ProposalSearchTopFilterBar({
  filters,
  onFilterChange,
  onOpenAdvancedDrawer,
  activeFilterCount,
}: ProposalSearchTopFilterBarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isQuickFiltersOpen, setIsQuickFiltersOpen] = useState(false);

  const handleChange = (field: keyof SearchFilterState, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const handleResetFilters = () => {
    onFilterChange({
      ...filters,
      codeSearch: '',
      district: 'Any',
      profession: 'Any',
      vipOnly: false,
      religion: 'Any',
      civilStatus: 'Any',
    });
  };

  return (
    <div className="w-full mb-6 font-sans space-y-2">
      {/* ── ULTRA-SLIM FLOATING SEARCH DOCK ── */}
      <div
        className={`w-full rounded-full p-2 sm:px-3 sm:py-2 backdrop-blur-2xl border transition-all shadow-md font-sans flex flex-wrap sm:flex-nowrap items-center gap-2 ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-white shadow-black/40'
            : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-200/40'
        }`}
      >
        {/* Search Field */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-rose-500">
            <Search size={16} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Search name, code (e.g. BR000158), district..."
            value={filters.codeSearch}
            onChange={(e) => handleChange('codeSearch', e.target.value)}
            className={`w-full pl-10 pr-8 py-2 rounded-full text-xs font-bold border-0 outline-none transition-all font-sans ${
              isDark
                ? 'bg-slate-950/60 text-white placeholder:text-slate-500 focus:bg-slate-950'
                : 'bg-slate-100/80 text-slate-900 placeholder:text-slate-400 focus:bg-slate-100'
            }`}
          />
          {filters.codeSearch && (
            <button
              type="button"
              onClick={() => handleChange('codeSearch', '')}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Gender Segmented Switcher */}
        <div className={`flex items-center p-1 rounded-full border shrink-0 backdrop-blur-md ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100/80 border-slate-200/80'
        }`}>
          <button
            type="button"
            onClick={() => handleChange('lookingFor', 'All')}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              !filters.lookingFor || filters.lookingFor === 'All'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => handleChange('lookingFor', 'Bride')}
            className={`px-3.5 py-1 rounded-full text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
              filters.lookingFor === 'Bride'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>👰</span> Bride
          </button>
          <button
            type="button"
            onClick={() => handleChange('lookingFor', 'Groom')}
            className={`px-3.5 py-1 rounded-full text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
              filters.lookingFor === 'Groom'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🤵</span> Groom
          </button>
        </div>

        {/* Quick Filters Toggle Pill */}
        <button
          type="button"
          onClick={() => setIsQuickFiltersOpen(!isQuickFiltersOpen)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
            isQuickFiltersOpen || (filters.district !== 'Any' || filters.profession !== 'Any' || filters.religion !== 'Any')
              ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-600 dark:text-indigo-400 font-extrabold'
              : isDark ? 'bg-slate-950/80 border-slate-800 text-slate-300' : 'bg-slate-100/80 border-slate-200 text-slate-700'
          }`}
        >
          <Filter size={13} className="text-indigo-500" />
          <span>Quick Filters</span>
          {isQuickFiltersOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {/* VIP Toggle Pill */}
        <button
          type="button"
          onClick={() => handleChange('vipOnly', !filters.vipOnly)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
            filters.vipOnly
              ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 border-amber-300 shadow-md font-black'
              : isDark ? 'bg-slate-950/80 border-slate-800 text-amber-400' : 'bg-slate-100/80 border-slate-200 text-amber-600'
          }`}
        >
          <Crown size={13} fill={filters.vipOnly ? 'currentColor' : 'none'} />
          <span>VIP</span>
        </button>

        {/* Advanced Filters Drawer Button */}
        <button
          type="button"
          onClick={onOpenAdvancedDrawer}
          className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border border-slate-700/50"
        >
          <SlidersHorizontal size={13} />
          <span>All Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── COLLAPSIBLE QUICK FILTER CHIPS (ONLY SHOWN IF TOGGLED ON) ── */}
      {isQuickFiltersOpen && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 font-sans animate-fade-up">
          <div className="relative shrink-0">
            <select
              value={filters.district}
              onChange={(e) => handleChange('district', e.target.value)}
              className={`pl-8 pr-7 py-1.5 rounded-full text-xs font-bold border appearance-none outline-none transition-all cursor-pointer ${
                filters.district !== 'Any'
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400'
                  : isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <option value="Any" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">District: Any</option>
              <option value="Colombo" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Colombo</option>
              <option value="Gampaha" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Gampaha</option>
              <option value="Kandy" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Kandy</option>
              <option value="Galle" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Galle</option>
              <option value="Kurunegala" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Kurunegala</option>
              <option value="Matale" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Matale</option>
            </select>
            <MapPin size={12} className="absolute left-3 top-2.5 text-rose-500 pointer-events-none" />
            <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative shrink-0">
            <select
              value={filters.profession}
              onChange={(e) => handleChange('profession', e.target.value)}
              className={`pl-8 pr-7 py-1.5 rounded-full text-xs font-bold border appearance-none outline-none transition-all cursor-pointer ${
                filters.profession !== 'Any'
                  ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-600 dark:text-indigo-400'
                  : isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <option value="Any" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Profession: Any</option>
              <option value="Doctor" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Doctor</option>
              <option value="Engineer" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Engineer</option>
              <option value="Lecturer" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Lecturer</option>
              <option value="Accountant" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Accountant</option>
              <option value="Teacher" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Teacher</option>
            </select>
            <Briefcase size={12} className="absolute left-3 top-2.5 text-indigo-500 pointer-events-none" />
            <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative shrink-0">
            <select
              value={filters.religion}
              onChange={(e) => handleChange('religion', e.target.value)}
              className={`pl-4 pr-7 py-1.5 rounded-full text-xs font-bold border appearance-none outline-none transition-all cursor-pointer ${
                filters.religion !== 'Any'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                  : isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <option value="Any" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Religion: Any</option>
              <option value="Buddhist" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Buddhist</option>
              <option value="Hindu" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Hindu</option>
              <option value="Muslim" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Muslim</option>
              <option value="Catholic" className="dark:bg-slate-900 dark:text-white bg-white text-slate-900">Catholic</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/30 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <X size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
