import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ArrowLeft, ShieldCheck } from 'lucide-react';
import { PrimaryButton, GhostButton } from '../components/ui/ProposalPrimitives';
import ProposalSearchHeader from '../components/search/ProposalSearchHeader';
import ProposalSearchSidebar, { SearchFilterState } from '../components/search/ProposalSearchSidebar';
import ProposalAdvancedFilterDrawer from '../components/search/ProposalAdvancedFilterDrawer';
import ProposalSearchResultCard, { CandidateProfile } from '../components/search/ProposalSearchResultCard';
import { useTheme } from '../../../context/ThemeContext';
import toast from 'react-hot-toast';

// Candidate Mock Data matching Reference Screenshots 1 to 5
const INITIAL_CANDIDATES: CandidateProfile[] = [
  {
    id: 1,
    code: 'BR000158',
    name: 'Piyumali L.',
    age: 31,
    district: 'Colombo 1',
    profession: 'Lecturer',
    monthlyIncome: 'Rs 200,000 - Rs 300,000',
    images: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: true,
    isVerified: true,
    civilStatus: 'Never Married (අවිවාහක)',
    ethnicity: 'Sinhalese',
    religion: 'Buddhist',
    caste: 'Govigama',
    height: '5.4 ft',
    country: 'Sri Lanka',
    publishedDate: '8/31/2026',
    educationCategory: 'University',
    categoryBadge: 'Campus Graduate 🎓'
  },
  {
    id: 2,
    code: 'BR000113',
    name: 'Kasuni D.',
    age: 31,
    district: 'Narammala',
    profession: 'Government Servant',
    monthlyIncome: 'Rs 100,000 - Rs 200,000',
    images: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: true,
    isVerified: true,
    civilStatus: 'Never Married (අවිවාහක)',
    ethnicity: 'Sinhalese',
    religion: 'Buddhist',
    caste: 'Govigama',
    height: '5.7 ft',
    country: 'Sri Lanka',
    publishedDate: '8/31/2026',
    educationCategory: 'Professional Qualification',
    categoryBadge: 'Working Professional 💼'
  },
  {
    id: 3,
    code: 'BR000902',
    name: 'Eranga R.',
    age: 40,
    district: 'Veyangoda',
    profession: 'Teacher',
    monthlyIncome: 'Rs 50,000 - Rs 100,000',
    images: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: true,
    isVerified: true,
    civilStatus: 'Divorced (දික්කසාද වූ)',
    ethnicity: 'Sinhalese',
    religion: 'Buddhist',
    caste: 'Bathgama',
    height: '5.8 ft',
    country: 'Sri Lanka',
    publishedDate: '8/26/2026',
    educationCategory: 'University',
    categoryBadge: 'Campus Graduate 🎓'
  },
  {
    id: 4,
    code: 'GR000323',
    name: 'Sathira D. K. P.',
    age: 23,
    district: 'Akmeemana',
    profession: 'Doctor',
    monthlyIncome: 'Rs 200,000 - Rs 300,000',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: false,
    isVerified: true,
    civilStatus: 'Never Married (අවිවාහක)',
    ethnicity: 'Sinhalese',
    religion: 'Buddhist',
    caste: 'Govigama',
    height: '5.9 ft',
    country: 'Sri Lanka',
    publishedDate: '8/26/2026',
    educationCategory: 'Professional Qualification',
    categoryBadge: 'Working Professional 💼'
  },
  {
    id: 5,
    code: 'GR000730',
    name: 'Kisal P. S.',
    age: 23,
    district: 'Panadura',
    profession: 'Engineer',
    monthlyIncome: 'Rs 200,000 - Rs 300,000',
    images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: true,
    isVerified: true,
    civilStatus: 'Never Married (අවිවාහක)',
    ethnicity: 'Sinhalese',
    religion: 'Catholic',
    caste: 'Govigama',
    height: '5.9 ft',
    country: 'Sri Lanka',
    publishedDate: '6/4/2026',
    educationCategory: 'University',
    categoryBadge: 'Campus Graduate 🎓'
  },
  {
    id: 6,
    code: 'BR000064',
    name: 'Inoka D.',
    age: 32,
    district: 'Matale',
    profession: 'Teacher',
    monthlyIncome: 'Rs 100,000 - Rs 200,000',
    images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: true,
    isVerified: true,
    civilStatus: 'Never Married (අවිවාහක)',
    ethnicity: 'Sinhalese',
    religion: 'Buddhist',
    caste: 'Govigama',
    height: '5.0 ft',
    country: 'Sri Lanka',
    publishedDate: '6/4/2026',
    educationCategory: 'General / Business',
    categoryBadge: 'Business Enterprise 🏢'
  },
  {
    id: 7,
    code: 'BR000112',
    name: 'Dharani P. A.',
    age: 31,
    district: 'Kuliyapitiya',
    profession: 'Doctor',
    monthlyIncome: 'Rs 300,000+',
    images: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: true,
    isVerified: true,
    civilStatus: 'Never Married (අවිවාහක)',
    ethnicity: 'Sinhalese',
    religion: 'Buddhist',
    caste: 'Govigama',
    height: '5.5 ft',
    country: 'Sri Lanka',
    publishedDate: '5/18/2026',
    educationCategory: 'Professional Qualification',
    categoryBadge: 'Working Professional 💼'
  },
  {
    id: 8,
    code: 'GR003256',
    name: 'Wasantha G.',
    age: 36,
    district: 'Elpitiya',
    profession: 'Accountant',
    monthlyIncome: 'Rs 200,000 - Rs 300,000',
    images: ['https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: false,
    isVerified: true,
    civilStatus: 'Never Married (අවිවාහක)',
    ethnicity: 'Sinhalese',
    religion: 'Buddhist',
    caste: 'Govigama',
    height: '5.7 ft',
    country: 'Sri Lanka',
    publishedDate: '8/31/2026',
    educationCategory: 'General / Business',
    categoryBadge: 'Business Enterprise 🏢'
  },
];

const DEFAULT_FILTERS: SearchFilterState = {
  codeSearch: '',
  vipOnly: false,
  sortBy: 'Any',
  lookingFor: 'All',
  ageRange: 'All',
  minAge: '',
  maxAge: '',
  minHeight: '',
  maxHeight: '',
  country: 'Any',
  district: 'All',
  ethnicity: 'Any',
  caste: 'Any',
  religion: 'All',
  civilStatus: 'Any',
  profession: 'Any',
  monthlyIncome: 'Any',
  education: 'Any',
  category: 'All',
  foodPreference: 'Any',
  drinking: 'Any',
  smoking: 'Any',
  differentlyAbled: 'Any',
  accountCreatedBy: 'Any',
  nicVerified: 'Any',
};

export default function ProposalDiscoverPage({
  setPage,
  openProfile,
  initialFilters,
}: {
  setPage: (p: any) => void;
  openProfile: (p: any) => void;
  initialFilters?: Partial<SearchFilterState>;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [layoutMode, setLayoutMode] = useState<'grid' | 'compact'>('grid');
  const [filters, setFilters] = useState<SearchFilterState>(() => ({
    ...DEFAULT_FILTERS,
    ...(initialFilters || {})
  }));
  const [candidates] = useState<CandidateProfile[]>(INITIAL_CANDIDATES);
  const [isAdvancedDrawerOpen, setIsAdvancedDrawerOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedInterestProfile, setSelectedInterestProfile] = useState<CandidateProfile | null>(null);
  const [showVerificationRequiredModal, setShowVerificationRequiredModal] = useState(false);

  // Filter calculation logic
  const filteredCandidates = candidates.filter((item) => {
    // 1. VIP only
    if (filters.vipOnly && !item.isVIP) return false;

    // 2. Looking for (Bride / Groom / All)
    if (filters.lookingFor && filters.lookingFor !== 'All') {
      if (filters.lookingFor === 'Bride' && !item.code.startsWith('BR')) return false;
      if (filters.lookingFor === 'Groom' && !item.code.startsWith('GR')) return false;
    }

    // 3. Search query (matches code, name, profession, or district)
    if (filters.codeSearch && filters.codeSearch.trim() !== '') {
      const q = filters.codeSearch.toLowerCase().trim();
      const matchCode = item.code.toLowerCase().includes(q);
      const matchName = item.name.toLowerCase().includes(q);
      const matchJob = item.profession.toLowerCase().includes(q);
      const matchDist = item.district.toLowerCase().includes(q);
      if (!matchCode && !matchName && !matchJob && !matchDist) return false;
    }

    // 4. District
    if (filters.district && filters.district !== 'All' && filters.district !== 'Any') {
      if (!item.district.toLowerCase().includes(filters.district.toLowerCase())) return false;
    }

    // 5. Religion
    if (filters.religion && filters.religion !== 'All' && filters.religion !== 'Any') {
      if (item.religion && !item.religion.toLowerCase().includes(filters.religion.toLowerCase())) return false;
    }

    // 6. Age Range (18-25, 26-30, 31-35, 36-40, 41-50, 50+)
    if (filters.ageRange && filters.ageRange !== 'All') {
      const age = item.age;
      if (filters.ageRange === '18-25' && (age < 18 || age > 25)) return false;
      if (filters.ageRange === '26-30' && (age < 26 || age > 30)) return false;
      if (filters.ageRange === '31-35' && (age < 31 || age > 35)) return false;
      if (filters.ageRange === '36-40' && (age < 36 || age > 40)) return false;
      if (filters.ageRange === '41-50' && (age < 41 || age > 50)) return false;
      if (filters.ageRange === '50+' && age < 50) return false;
    }

    // 7. Advanced parameters if set
    if (filters.profession && filters.profession !== 'Any' && item.profession !== filters.profession) return false;
    if (filters.civilStatus && filters.civilStatus !== 'Any' && item.civilStatus && !item.civilStatus.includes(filters.civilStatus)) return false;

    // 8. Official Category filter
    if (filters.category && filters.category !== 'All') {
      const selected = filters.category.toLowerCase();
      const badge = (item.categoryBadge || '').toLowerCase();
      if (selected.includes('graduate') && !badge.includes('graduate')) return false;
      if (selected.includes('undergrad') && !badge.includes('undergrad') && !badge.includes('student')) return false;
      if (selected.includes('higher edu') && !badge.includes('higher') && !badge.includes('edu')) return false;
      if (selected.includes('working') && !badge.includes('working') && !badge.includes('abroad') && !badge.includes('business')) return false;
    }

    return true;
  });

  const handleSendInterest = (profile: CandidateProfile) => {
    const isVerified = localStorage.getItem('userIsVerified') === 'true' || localStorage.getItem('userHasProposalVerified') === 'true';
    if (!isVerified) {
      setShowVerificationRequiredModal(true);
      return;
    }
    setSelectedInterestProfile(profile);
  };

  const handleConfirmInterest = () => {
    if (selectedInterestProfile) {
      toast.success(`Proposal Interest sent to ${selectedInterestProfile.name} (${selectedInterestProfile.code})! 💕`);
      setSelectedInterestProfile(null);
    }
  };

  return (
    <div className={`w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-[1550px] mx-auto">
        {/* Back navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setPage('landing')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
              isDark 
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700' 
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:border-slate-300 shadow-sm'
            }`}
          >
            <ArrowLeft size={14} className="text-rose-500" />
            <span>Back to Uni Porondam Home</span>
          </button>
          <span className="text-xs font-bold text-slate-400">
            Uni Porondam • Verified Candidate Directory
          </span>
        </div>
        
        {/* ── TWO-COLUMN MAIN LAYOUT: LEFT FILTERS SIDEBAR + RIGHT CANDIDATES AREA ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 1. LEFT SEARCH & FILTER SIDEBAR (MATCHING SCREENSHOT 1) */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24">
            <ProposalSearchSidebar
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={() => setFilters(DEFAULT_FILTERS)}
              onOpenAdvancedDrawer={() => setIsAdvancedDrawerOpen(true)}
            />
          </div>

          {/* 2. RIGHT AREA: SEARCH MATCHES HEADER + 3-COLUMN CARDS GRID */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            
            {/* SEARCH HEADER CONTROLS (Layout View Switch, Grooms/Brides Switcher, Mobile Trigger) */}
            <ProposalSearchHeader
              totalResults={filteredCandidates.length}
              currentPage={1}
              totalPages={1}
              layoutMode={layoutMode}
              onLayoutModeChange={setLayoutMode}
              onToggleMobileFilters={() => setIsMobileFilterOpen(true)}
              showingOnlyVIP={filters.vipOnly}
              activeGenderTab={filters.lookingFor as any || 'All'}
              onGenderTabChange={(tab) => setFilters(prev => ({ ...prev, lookingFor: tab }))}
            />

            {/* CANDIDATE RESULTS GRID (OUR PERFECT UNTOUCHED CARDS!) */}
            <div className="w-full">
              {filteredCandidates.length === 0 ? (
                <div className={`p-12 text-center rounded-3xl border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="text-xl font-bold mb-2">No matching profiles found</h3>
                  <p className="text-sm text-slate-500 mb-6">Try resetting some of your filters to view more profiles.</p>
                  <PrimaryButton onClick={() => setFilters(DEFAULT_FILTERS)} className="px-6 py-2.5">
                    Reset All Filters
                  </PrimaryButton>
                </div>
              ) : layoutMode === 'grid' ? (
                /* 4-COLUMN CARDS GRID (MATCHING SCREENSHOT LAYOUT) */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredCandidates.map((profile) => (
                    <ProposalSearchResultCard
                      key={profile.id}
                      profile={profile}
                      layoutMode="grid"
                      onSendInterest={handleSendInterest}
                      onViewProfile={openProfile}
                    />
                  ))}
                </div>
              ) : (
                /* SLEEK COMPACT LIST VIEW */
                <div className="space-y-5">
                  {filteredCandidates.map((profile) => (
                    <ProposalSearchResultCard
                      key={profile.id}
                      profile={profile}
                      layoutMode="compact"
                      onSendInterest={handleSendInterest}
                      onViewProfile={openProfile}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-[120] lg:hidden bg-slate-950/80 backdrop-blur-md flex justify-end p-0">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className={`w-full max-w-sm h-full overflow-y-auto p-4 flex flex-col justify-between shadow-2xl ${
                isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-black text-sm">Search Filters</span>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                <ProposalSearchSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  onResetFilters={() => setFilters(DEFAULT_FILTERS)}
                  onOpenAdvancedDrawer={() => {
                    setIsMobileFilterOpen(false);
                    setIsAdvancedDrawerOpen(true);
                  }}
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <PrimaryButton
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 text-xs font-bold"
                >
                  Show ({filteredCandidates.length}) Profiles
                </PrimaryButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. SLIDE-OVER ADVANCED FILTER DRAWER (20+ FILTERS) */}
      <ProposalAdvancedFilterDrawer
        isOpen={isAdvancedDrawerOpen}
        onClose={() => setIsAdvancedDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={() => setFilters(DEFAULT_FILTERS)}
        onApplyFilters={() => toast.success('Advanced search filters applied!')}
      />

      {/* CONFIRM PROPOSAL INTEREST MODAL */}
      <AnimatePresence>
        {selectedInterestProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 sm:p-8 rounded-3xl max-w-md w-full border shadow-2xl text-center relative ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <button
                onClick={() => setSelectedInterestProfile(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
                <Heart size={32} fill="currentColor" />
              </div>

              <h3 className="text-2xl font-black font-serif mb-2">Send Proposal Interest?</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                You are about to express interest to <strong className="text-rose-500">{selectedInterestProfile.name}</strong> ({selectedInterestProfile.code}). They will receive an instant notification!
              </p>

              <div className="flex gap-3">
                <GhostButton dark={isDark} onClick={() => setSelectedInterestProfile(null)} className="flex-1 py-3 text-xs">
                  Cancel
                </GhostButton>
                <PrimaryButton onClick={handleConfirmInterest} icon={Heart} className="flex-1 py-3 text-xs">
                  Send Proposal
                </PrimaryButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VERIFICATION REQUIRED MODAL */}
      <AnimatePresence>
        {showVerificationRequiredModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 sm:p-8 rounded-3xl max-w-md w-full border shadow-2xl text-center relative ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <button
                onClick={() => setShowVerificationRequiredModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-md">
                <ShieldCheck size={36} />
              </div>

              <h3 className="text-xl font-black mb-2">Identity Verification Required!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                ලංකාවේ ආරක්ෂිතම Matchmaking Platform එක විදියට, අනිත් සාමාජිකයින්ට Proposal Requests යැවීමට හෝ සම්බන්ධ වීමට පෙර කරුණාකර ඔබගේ <strong>NIC හෝ Passport</strong> එක Upload කර Verify කරගන්න.
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mb-6 bg-emerald-50 dark:bg-emerald-950/40 py-2 px-3 rounded-xl border border-emerald-500/20">
                🛡️ Verified Candidates ලාට 3x ගුණයකින් වැඩි ඉක්මන් ප්‍රතිචාර ලැබේ!
              </p>

              <div className="flex gap-3">
                <GhostButton dark={isDark} onClick={() => setShowVerificationRequiredModal(false)} className="flex-1 py-3 text-xs">
                  පසුව කරන්නම්
                </GhostButton>
                <PrimaryButton 
                  onClick={() => {
                    setShowVerificationRequiredModal(false);
                    setPage('dashboard');
                  }} 
                  icon={ShieldCheck} 
                  className="flex-1 py-3 text-xs bg-emerald-600 hover:bg-emerald-700"
                >
                  Verify NIC Now
                </PrimaryButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
