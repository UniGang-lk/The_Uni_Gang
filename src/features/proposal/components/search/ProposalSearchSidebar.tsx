import { Search, SlidersHorizontal, RotateCcw, Save, Crown, Check } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

export interface SearchFilterState {
  codeSearch: string;
  vipOnly: boolean;
  sortBy: string;
  lookingFor: 'Groom' | 'Bride' | 'All';
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

interface ProposalSearchSidebarProps {
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  onResetFilters: () => void;
  onSaveFilters?: () => void;
  className?: string;
}

export default function ProposalSearchSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  onSaveFilters,
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

  return (
    <aside
      className={`w-full lg:w-[320px] rounded-3xl p-5 sm:p-6 border shadow-xl font-sans transition-colors duration-300 ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-900'
      } ${className}`}
    >
      {/* 1. FIND BY CODE (Matching Reference Screenshot 5) */}
      <div className="mb-6">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5 font-sans">
          <Search size={14} className="text-rose-500" /> FIND BY CODE
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. GR000149"
            value={filters.codeSearch}
            onChange={(e) => handleChange('codeSearch', e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-600'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>
      </div>

      {/* 2. FILTER SETTINGS HEADER + RESET & SAVE BUTTONS (Matching Screenshot 5) */}
      <div className="mb-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-sans">
            <SlidersHorizontal size={14} className="text-rose-500" /> FILTER SETTINGS
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetFilters}
              className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold border flex items-center gap-1 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button
              type="button"
              onClick={onSaveFilters}
              className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-rose-500 text-white flex items-center gap-1 hover:bg-rose-600 transition-colors shadow-sm"
            >
              <Save size={12} /> Save
            </button>
          </div>
        </div>
      </div>

      {/* 3. SHOW ONLY: VIP ELITE PROFILES TOGGLE (Matching Screenshot 4 & 5) */}
      <div className="mb-6">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 block font-sans">
          SHOW ONLY
        </span>
        <button
          type="button"
          onClick={() => handleChange('vipOnly', !filters.vipOnly)}
          className={`w-full py-2.5 px-4 rounded-xl border text-xs font-black flex items-center justify-center gap-2 transition-all ${
            filters.vipOnly
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-slate-950 border-amber-300 shadow-md scale-[1.02]'
              : isDark
              ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-amber-500/40'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-400'
          }`}
        >
          <Crown size={15} className={filters.vipOnly ? 'text-slate-950' : 'text-amber-500'} fill={filters.vipOnly ? 'currentColor' : 'none'} />
          <span>VIP Elite Profiles</span>
          {filters.vipOnly && <Check size={14} strokeWidth={3} className="ml-auto" />}
        </button>
      </div>

      {/* 4. SORT BY DROPDOWN (Matching Screenshot 4 & 5) */}
      <div className="mb-5">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block font-sans">
          SORT BY
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-rose-500/50 cursor-pointer ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <option value="Any">Any</option>
          <option value="Latest">Latest Published</option>
          <option value="AgeLowHigh">Age: Low to High</option>
          <option value="AgeHighLow">Age: High to Low</option>
        </select>
      </div>

      {/* 5. I'M LOOKING FOR: GROOM / BRIDE TOGGLE (Matching Screenshot 4 & 5) */}
      <div className="mb-5">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 block font-sans">
          I'M LOOKING FOR
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleChange('lookingFor', 'Groom')}
            className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              filters.lookingFor === 'Groom'
                ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                : isDark
                ? 'bg-slate-950 border-slate-800 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span>🤵</span> Groom
          </button>
          <button
            type="button"
            onClick={() => handleChange('lookingFor', 'Bride')}
            className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              filters.lookingFor === 'Bride'
                ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                : isDark
                ? 'bg-slate-950 border-slate-800 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span>👰</span> Bride
          </button>
        </div>
      </div>

      {/* 6. AGE RANGE (MIN - MAX) (Matching Screenshot 4) */}
      <div className="mb-5">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block font-sans">
          AGE RANGE
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Min"
            value={filters.minAge}
            onChange={(e) => handleChange('minAge', e.target.value)}
            className={`w-full px-3 py-2 rounded-xl text-xs font-bold border text-center focus:outline-none focus:ring-2 focus:ring-rose-500/50 ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
          <span className="text-slate-400 font-bold text-xs">–</span>
          <input
            type="text"
            placeholder="Max"
            value={filters.maxAge}
            onChange={(e) => handleChange('maxAge', e.target.value)}
            className={`w-full px-3 py-2 rounded-xl text-xs font-bold border text-center focus:outline-none focus:ring-2 focus:ring-rose-500/50 ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* 7. HEIGHT RANGE (FT) (Matching Screenshot 4) */}
      <div className="mb-5">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 block font-sans">
          HEIGHT RANGE (FT)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Min"
            value={filters.minHeight}
            onChange={(e) => handleChange('minHeight', e.target.value)}
            className={`w-full px-3 py-2 rounded-xl text-xs font-bold border text-center focus:outline-none focus:ring-2 focus:ring-rose-500/50 ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
          <span className="text-slate-400 font-bold text-xs">–</span>
          <input
            type="text"
            placeholder="Max"
            value={filters.maxHeight}
            onChange={(e) => handleChange('maxHeight', e.target.value)}
            className={`w-full px-3 py-2 rounded-xl text-xs font-bold border text-center focus:outline-none focus:ring-2 focus:ring-rose-500/50 ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
        </div>
      </div>

      {/* 8. COUNTRY (Matching Screenshot 4) */}
      <div className="mb-4">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block font-sans">
          COUNTRY
        </label>
        <select
          value={filters.country}
          onChange={(e) => handleChange('country', e.target.value)}
          className={`w-full px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <option value="Any">Any</option>
          <option value="Sri Lanka">Sri Lanka</option>
          <option value="Abroad">Abroad</option>
        </select>
      </div>

      {/* 9. DISTRICT (Matching Screenshot 3 & 4) */}
      <div className="mb-4">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block font-sans">
          DISTRICT
        </label>
        <select
          value={filters.district}
          onChange={(e) => handleChange('district', e.target.value)}
          className={`w-full px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <option value="Any">Any</option>
          <option value="Colombo">Colombo</option>
          <option value="Gampaha">Gampaha</option>
          <option value="Kandy">Kandy</option>
          <option value="Galle">Galle</option>
          <option value="Kurunegala">Kurunegala</option>
          <option value="Matale">Matale</option>
          <option value="Kalutara">Kalutara</option>
        </select>
      </div>

      {/* 10. ETHNICITY (Matching Screenshot 3) */}
      <div className="mb-4">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block font-sans">
          ETHNICITY
        </label>
        <select
          value={filters.ethnicity}
          onChange={(e) => handleChange('ethnicity', e.target.value)}
          className={`w-full px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <option value="Any">Any</option>
          <option value="Sinhalese">Sinhalese</option>
          <option value="Tamil">Tamil</option>
          <option value="Muslim">Muslim</option>
          <option value="Burger">Burger</option>
        </select>
      </div>

      {/* 11. CASTE (Matching Screenshot 3) */}
      <div className="mb-4">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block font-sans">
          CASTE
        </label>
        <select
          value={filters.caste}
          onChange={(e) => handleChange('caste', e.target.value)}
          className={`w-full px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <option value="Any">Any</option>
          <option value="Govigama">Govigama</option>
          <option value="Karava">Karava</option>
          <option value="Salagama">Salagama</option>
          <option value="Bathgama">Bathgama</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* 12. RELIGION (Matching Screenshot 3) */}
      <div className="mb-4">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block font-sans">
          RELIGION
        </label>
        <select
          value={filters.religion}
          onChange={(e) => handleChange('religion', e.target.value)}
          className={`w-full px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <option value="Any">Any</option>
          <option value="Buddhist">Buddhist</option>
          <option value="Catholic">Catholic / Christian</option>
          <option value="Hindu">Hindu</option>
          <option value="Islam">Islam</option>
        </select>
      </div>

      {/* 13. CIVIL STATUS (Matching Screenshot 3) */}
      <div className="mb-4">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block font-sans">
          CIVIL STATUS
        </label>
        <select
          value={filters.civilStatus}
          onChange={(e) => handleChange('civilStatus', e.target.value)}
          className={`w-full px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <option value="Any">Any</option>
          <option value="Never Married">Never Married (අවිවාහක)</option>
          <option value="Divorced">Divorced (දික්කසාද වූ)</option>
          <option value="Widowed">Widowed (වැන්දඹු)</option>
        </select>
      </div>

      {/* 14. PROFESSION (Matching Screenshot 2 & 3) */}
      <div className="mb-4">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block font-sans">
          PROFESSION
        </label>
        <select
          value={filters.profession}
          onChange={(e) => handleChange('profession', e.target.value)}
          className={`w-full px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <option value="Any">Any</option>
          <option value="Doctor">Doctor</option>
          <option value="Engineer">Engineer</option>
          <option value="Lecturer">Lecturer</option>
          <option value="Accountant">Accountant</option>
          <option value="Teacher">Teacher</option>
          <option value="Government Servant">Government Servant</option>
        </select>
      </div>

      {/* 15. MONTHLY INCOME (Matching Screenshot 2) */}
      <div className="mb-4">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block font-sans">
          MONTHLY INCOME
        </label>
        <select
          value={filters.monthlyIncome}
          onChange={(e) => handleChange('monthlyIncome', e.target.value)}
          className={`w-full px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <option value="Any">Any</option>
          <option value="Rs 50,000 - Rs 100,000">Rs 50,000 - Rs 100,000</option>
          <option value="Rs 100,000 - Rs 200,000">Rs 100,000 - Rs 200,000</option>
          <option value="Rs 200,000 - Rs 300,000">Rs 200,000 - Rs 300,000</option>
          <option value="Rs 300,000+">Rs 300,000+</option>
        </select>
      </div>

      {/* 16. NIC VERIFIED (Matching Screenshot 1) */}
      <div className="mb-2">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block font-sans">
          NIC VERIFIED
        </label>
        <select
          value={filters.nicVerified}
          onChange={(e) => handleChange('nicVerified', e.target.value)}
          className={`w-full px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <option value="Any">Any</option>
          <option value="Verified Only">Verified Only</option>
        </select>
      </div>
    </aside>
  );
}
