import { motion } from 'framer-motion';
import { X, RotateCcw, Check, SlidersHorizontal } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';
import { SearchFilterState } from './ProposalSearchSidebar';

interface ProposalAdvancedFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

export default function ProposalAdvancedFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  onApplyFilters,
}: ProposalAdvancedFilterDrawerProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleChange = (field: keyof SearchFilterState, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex justify-end p-0 font-sans">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        className={`w-full max-w-md h-full flex flex-col justify-between shadow-2xl border-l font-sans ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between font-sans">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
              <SlidersHorizontal size={16} />
            </div>
            <div>
              <h3 className="text-lg font-black font-sans">All Advanced Filters</h3>
              <p className="text-[11px] font-semibold text-slate-400 font-sans">Refine matches across 20+ parameters</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans">

          {/* Section 1: Demographics */}
          <div className="space-y-4 font-sans">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-500 pb-1 border-b border-rose-500/20 font-sans">
              1. Demographics & Appearance
            </h4>

            {/* Age Range */}
            <div>
              <label className="text-[11px] font-black uppercase text-slate-400 mb-1.5 block font-sans">Age Range (Years)</label>
              <div className="flex items-center gap-2 font-sans">
                <input
                  type="text"
                  placeholder="Min"
                  value={filters.minAge}
                  onChange={(e) => handleChange('minAge', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold border text-center font-sans ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                <span className="text-slate-400 font-bold">–</span>
                <input
                  type="text"
                  placeholder="Max"
                  value={filters.maxAge}
                  onChange={(e) => handleChange('maxAge', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold border text-center font-sans ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            {/* Height Range */}
            <div>
              <label className="text-[11px] font-black uppercase text-slate-400 mb-1.5 block font-sans">Height Range (Ft)</label>
              <div className="flex items-center gap-2 font-sans">
                <input
                  type="text"
                  placeholder="Min"
                  value={filters.minHeight}
                  onChange={(e) => handleChange('minHeight', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold border text-center font-sans ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                <span className="text-slate-400 font-bold">–</span>
                <input
                  type="text"
                  placeholder="Max"
                  value={filters.maxHeight}
                  onChange={(e) => handleChange('maxHeight', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold border text-center font-sans ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            {/* Civil Status */}
            <div>
              <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block font-sans">Civil Status</label>
              <select
                value={filters.civilStatus}
                onChange={(e) => handleChange('civilStatus', e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold border font-sans ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="Any">Any</option>
                <option value="Never Married">Never Married (අවිවාහක)</option>
                <option value="Divorced">Divorced (දික්කසාද වූ)</option>
                <option value="Widowed">Widowed (වැන්දඹු)</option>
              </select>
            </div>

            {/* Ethnicity & Religion */}
            <div className="grid grid-cols-2 gap-3 font-sans">
              <div>
                <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block font-sans">Ethnicity</label>
                <select
                  value={filters.ethnicity}
                  onChange={(e) => handleChange('ethnicity', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold border font-sans ${
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

              <div>
                <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block font-sans">Religion</label>
                <select
                  value={filters.religion}
                  onChange={(e) => handleChange('religion', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold border font-sans ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="Any">Any</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Catholic">Catholic</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Islam">Islam</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="space-y-4 font-sans">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-500 pb-1 border-b border-rose-500/20 font-sans">
              2. Location & Hometown
            </h4>

            <div className="grid grid-cols-2 gap-3 font-sans">
              <div>
                <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block font-sans">Country</label>
                <select
                  value={filters.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold border font-sans ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="Any">Any</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Abroad">Abroad</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block font-sans">Living District</label>
                <select
                  value={filters.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold border font-sans ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="Any">Any</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Gampaha">Gampaha</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                  <option value="Kurunegala">Kurunegala</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Career & Income */}
          <div className="space-y-4 font-sans">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-500 pb-1 border-b border-rose-500/20 font-sans">
              3. Profession & Financials
            </h4>

            <div>
              <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block font-sans">Profession</label>
              <select
                value={filters.profession}
                onChange={(e) => handleChange('profession', e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold border font-sans ${
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

            <div>
              <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block font-sans">Monthly Income</label>
              <select
                value={filters.monthlyIncome}
                onChange={(e) => handleChange('monthlyIncome', e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold border font-sans ${
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
          </div>

          {/* Section 4: NIC Verified */}
          <div className="space-y-4 font-sans">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-500 pb-1 border-b border-rose-500/20 font-sans">
              4. Verification Status
            </h4>

            <div>
              <label className="text-[11px] font-black uppercase text-slate-400 mb-1 block font-sans">NIC Verified</label>
              <select
                value={filters.nicVerified}
                onChange={(e) => handleChange('nicVerified', e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold border font-sans ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="Any">Any</option>
                <option value="Verified Only">Verified Only</option>
              </select>
            </div>
          </div>

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 font-sans">
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-3 rounded-2xl text-xs font-extrabold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 font-sans"
          >
            <RotateCcw size={14} /> Reset
          </button>

          <button
            type="button"
            onClick={() => {
              onApplyFilters();
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-xs shadow-lg shadow-rose-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 font-sans"
          >
            <Check size={16} strokeWidth={3} /> Apply Filters
          </button>
        </div>
      </motion.div>
    </div>
  );
}
