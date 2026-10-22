import { LayoutGrid, List, Filter, Users, UserCheck } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

interface ProposalSearchHeaderProps {
  totalResults?: number;
  currentPage?: number;
  totalPages?: number;
  layoutMode: 'grid' | 'compact';
  onLayoutModeChange: (mode: 'grid' | 'compact') => void;
  onToggleMobileFilters: () => void;
  showingOnlyVIP?: boolean;
  activeGenderTab?: 'All' | 'Bride' | 'Groom';
  onGenderTabChange?: (tab: 'All' | 'Bride' | 'Groom') => void;
  activeFilterCount?: number;
}

export default function ProposalSearchHeader({
  totalResults = 4022,
  currentPage = 1,
  totalPages = 1,
  layoutMode,
  onLayoutModeChange,
  onToggleMobileFilters,
  showingOnlyVIP = false,
  activeGenderTab = 'All',
  onGenderTabChange,
  activeFilterCount = 0,
}: ProposalSearchHeaderProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-full space-y-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 font-sans">
      
      {/* Top Row: Title, Subtitle & Grooms/Brides Main Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight font-sans ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeGenderTab === 'Groom' ? 'Grooms (මනාලයන්)' : activeGenderTab === 'Bride' ? 'Brides (මනාලියන්)' : 'Verified Proposals'}
            </h1>
            {showingOnlyVIP && (
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm font-sans">
                👑 VIP Only
              </span>
            )}
          </div>
          <p className={`text-xs sm:text-sm font-medium mt-1 font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Browse our verified profiles. Login to see full details and contact information.
          </p>
        </div>

        {/* Brides / Grooms / All Pill Switcher (Matching screenshot emphasis) */}
        {onGenderTabChange && (
          <div className={`flex items-center p-1.5 rounded-2xl border shadow-sm backdrop-blur-xl ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100/90 border-slate-200'
          }`}>
            <button
              onClick={() => onGenderTabChange('All')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeGenderTab === 'All'
                  ? 'bg-rose-500 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={14} />
              All Profiles
            </button>

            <button
              onClick={() => onGenderTabChange('Groom')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeGenderTab === 'Groom'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck size={14} />
              Grooms (මනාලයන්)
            </button>

            <button
              onClick={() => onGenderTabChange('Bride')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeGenderTab === 'Bride'
                  ? 'bg-rose-500 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck size={14} />
              Brides (මනාලියන්)
            </button>
          </div>
        )}
      </div>

      {/* Second Row: Results Count, Mobile Filter & View Mode Controls */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Showing {totalResults.toLocaleString()} verified candidates
          </span>
          {totalPages > 1 && (
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20 font-sans">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={onToggleMobileFilters}
            className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500/20 transition-all font-sans relative"
          >
            <Filter size={14} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* View Mode Switcher */}
          <div className={`hidden sm:flex items-center p-1 rounded-xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => onLayoutModeChange('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                layoutMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-rose-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => onLayoutModeChange('compact')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                layoutMode === 'compact'
                  ? 'bg-white dark:bg-slate-800 text-rose-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
