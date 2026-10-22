import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ArrowLeft, ShieldCheck, Lock, Crown, Sparkles, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { PrimaryButton, GhostButton } from '../components/ui/ProposalPrimitives';
import ProposalSearchHeader from '../components/search/ProposalSearchHeader';
import ProposalSearchSidebar, { SearchFilterState } from '../components/search/ProposalSearchSidebar';
import ProposalAdvancedFilterDrawer from '../components/search/ProposalAdvancedFilterDrawer';
import ProposalSearchResultCard, { CandidateProfile } from '../components/search/ProposalSearchResultCard';
import { useTheme } from '../../../context/ThemeContext';
import toast from 'react-hot-toast';
import { proposalApi } from '../api/proposalApi';
import { useProposalVerification } from '../hooks/useProposalVerification';

const mapBackendToCandidate = (p: any): CandidateProfile => {
  const isFemale = p.gender?.toLowerCase() === 'female' || p.lookingFor?.toLowerCase() === 'groom' || p.looking_for?.toLowerCase() === 'groom';
  const codePrefix = isFemale ? 'BR' : 'GR';
  const codeNum = p.id ? String(p.id).replace(/\D/g, '').slice(-4).padStart(6, '0') : '000101';
  const code = p.code || `${codePrefix}${codeNum}`;
  
  return {
    id: p.id || p.ID,
    code: code,
    name: p.user?.name || (isFemale ? 'Candidate B.' : 'Candidate G.'),
    age: p.age || 26,
    district: p.district || 'Colombo',
    profession: p.profession || 'Professional',
    monthlyIncome: p.monthly_income || p.monthlyIncome || 'Confidential',
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (
      isFemale 
        ? ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
        : ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80']
    ),
    isVIP: p.is_vip || p.isVIP || p.membership_tier === 'vip',
    isClassic: p.is_classic || p.isClassic || p.membership_tier === 'classic',
    isVerified: p.is_nic_verified || p.isNicVerified || p.verification_status === 'verified',
    civilStatus: p.civil_status || 'Never Married (අවිවාහක)',
    ethnicity: p.ethnicity || 'Sinhalese',
    religion: p.religion || 'Buddhist',
    caste: p.caste || 'Govigama',
    height: p.height || "5.6 ft",
    country: p.country || 'Sri Lanka',
    publishedDate: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Recent',
    educationCategory: p.education_category || 'University',
    categoryBadge: p.category_badge || (p.is_vip || p.membership_tier === 'vip' ? 'VIP Member 👑' : 'Campus Graduate 🎓'),
    blurPhoto: p.blur_photo ?? p.blurPhoto ?? false,
    matchPercentage: p.matchPercentage || p.match_percentage || undefined,
    matchSummary: p.matchSummary || p.match_summary || undefined,
    managedBy: p.managed_by || p.managedBy || p.account_created_by || p.accountCreatedBy || 'Self (මා විසින්ම)'
  };
};

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
    isVIP: false,
    isClassic: true,
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
    isClassic: true,
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
    isVIP: false,
    isClassic: true,
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
  {
    id: 9,
    code: 'GR000418',
    name: 'Dr. Janaka M.',
    age: 29,
    district: 'Kandy',
    profession: 'Medical Officer (MBBS)',
    monthlyIncome: 'Rs 300,000+',
    images: ['https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: true,
    isVerified: true,
    civilStatus: 'Never Married (අවිවාහක)',
    ethnicity: 'Sinhalese',
    religion: 'Buddhist',
    caste: 'Govigama',
    height: '5.8 ft',
    country: 'Sri Lanka',
    publishedDate: '9/01/2026',
    educationCategory: 'University',
    categoryBadge: 'Campus Graduate 🎓'
  },
  {
    id: 10,
    code: 'BR000245',
    name: 'Dinithi S.',
    age: 26,
    district: 'Gampaha',
    profession: 'Software Engineer',
    monthlyIncome: 'Rs 200,000 - Rs 300,000',
    images: ['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: false,
    isClassic: true,
    isVerified: true,
    civilStatus: 'Never Married (අවිවාහක)',
    ethnicity: 'Sinhalese',
    religion: 'Buddhist',
    caste: 'Govigama',
    height: '5.4 ft',
    country: 'Sri Lanka',
    publishedDate: '9/02/2026',
    educationCategory: 'University',
    categoryBadge: 'Campus Graduate 🎓'
  },
  {
    id: 11,
    code: 'GR000552',
    name: 'Supun T.',
    age: 33,
    district: 'Kurunegala',
    profession: 'Civil Engineer (BSc Eng)',
    monthlyIncome: 'Rs 200,000 - Rs 300,000',
    images: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: false,
    isClassic: true,
    isVerified: true,
    civilStatus: 'Never Married (අවිවාහක)',
    ethnicity: 'Sinhalese',
    religion: 'Buddhist',
    caste: 'Govigama',
    height: '5.9 ft',
    country: 'Sri Lanka',
    publishedDate: '9/03/2026',
    educationCategory: 'University',
    categoryBadge: 'Campus Graduate 🎓'
  },
  {
    id: 12,
    code: 'BR000319',
    name: 'Nadeesha K.',
    age: 28,
    district: 'Kalutara',
    profession: 'Bank Executive (BBA)',
    monthlyIncome: 'Rs 150,000 - Rs 200,000',
    images: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: true,
    isVerified: true,
    civilStatus: 'Never Married (අවිවාහක)',
    ethnicity: 'Sinhalese',
    religion: 'Buddhist',
    caste: 'Govigama',
    height: '5.5 ft',
    country: 'Sri Lanka',
    publishedDate: '9/04/2026',
    educationCategory: 'University',
    categoryBadge: 'Campus Graduate 🎓'
  },
  {
    id: 13,
    code: 'GR000620',
    name: 'Chamith V.',
    age: 30,
    district: 'Colombo',
    profession: 'Architect (B.Arch)',
    monthlyIncome: 'Rs 300,000+',
    images: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: true,
    isVerified: true,
    civilStatus: 'Never Married (අවිවාහක)',
    ethnicity: 'Sinhalese',
    religion: 'Buddhist',
    caste: 'Govigama',
    height: '5.10 ft',
    country: 'Sri Lanka',
    publishedDate: '9/05/2026',
    educationCategory: 'Professional Qualification',
    categoryBadge: 'Working Professional 💼'
  },
  {
    id: 14,
    code: 'BR000431',
    name: 'Oshadi W.',
    age: 25,
    district: 'Galle',
    profession: 'Financial Analyst',
    monthlyIncome: 'Rs 150,000 - Rs 250,000',
    images: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: false,
    isClassic: true,
    isVerified: true,
    civilStatus: 'Never Married (අවිවාහක)',
    ethnicity: 'Sinhalese',
    religion: 'Buddhist',
    caste: 'Govigama',
    height: '5.3 ft',
    country: 'Sri Lanka',
    publishedDate: '9/06/2026',
    educationCategory: 'University',
    categoryBadge: 'Campus Graduate 🎓'
  },
  {
    id: 15,
    code: 'GR000788',
    name: 'Buddhika R.',
    age: 34,
    district: 'Anuradhapura',
    profession: 'Senior Lecturer',
    monthlyIncome: 'Rs 200,000 - Rs 300,000',
    images: ['https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: false,
    isClassic: true,
    isVerified: true,
    civilStatus: 'Never Married (අවිවාහක)',
    ethnicity: 'Sinhalese',
    religion: 'Buddhist',
    caste: 'Govigama',
    height: '5.8 ft',
    country: 'Sri Lanka',
    publishedDate: '9/07/2026',
    educationCategory: 'University',
    categoryBadge: 'Campus Graduate 🎓'
  },
  {
    id: 16,
    code: 'BR000599',
    name: 'Sanduni N.',
    age: 27,
    district: 'Matara',
    profession: 'Attorney-at-Law (LLB)',
    monthlyIncome: 'Rs 200,000+',
    images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: true,
    isVerified: true,
    civilStatus: 'Never Married (අවිවාහක)',
    ethnicity: 'Sinhalese',
    religion: 'Buddhist',
    caste: 'Govigama',
    height: '5.6 ft',
    country: 'Sri Lanka',
    publishedDate: '9/08/2026',
    educationCategory: 'Professional Qualification',
    categoryBadge: 'Working Professional 💼'
  }
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
  const [currentPage, setCurrentPage] = useState(1);
  const PROFILES_PER_PAGE = 12;

  const [filters, setFilters] = useState<SearchFilterState>(() => ({
    ...DEFAULT_FILTERS,
    ...(initialFilters || {})
  }));
  const [candidates, setCandidates] = useState<CandidateProfile[]>(INITIAL_CANDIDATES);
  const [loadingFeed, setLoadingFeed] = useState(false);

  // Auto-reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    let isMounted = true;
    const fetchFeed = async () => {
      setLoadingFeed(true);
      try {
        const queryParams: any = {};
        if (filters.lookingFor && filters.lookingFor !== 'All') queryParams.gender = filters.lookingFor === 'Bride' ? 'Female' : 'Male';
        if (filters.district && filters.district !== 'All') queryParams.district = filters.district;
        if (filters.religion && filters.religion !== 'All') queryParams.religion = filters.religion;
        if (filters.education && filters.education !== 'Any') queryParams.education = filters.education;
        if (filters.minAge) queryParams.minAge = filters.minAge;
        if (filters.maxAge) queryParams.maxAge = filters.maxAge;

        const res = await proposalApi.getFeed(queryParams);
        const feedList = res?.feed || res?.profiles;
        if (isMounted && feedList && Array.isArray(feedList) && feedList.length > 0) {
          const mapped = feedList.map(mapBackendToCandidate);
          const existingCodes = new Set(mapped.map((m: CandidateProfile) => m.code));
          const remainingCurated = INITIAL_CANDIDATES.filter(c => !existingCodes.has(c.code));
          setCandidates([...mapped, ...remainingCurated]);
        }
      } catch (err) {
        console.warn('Backend getFeed fallback to curated candidate list:', err);
      } finally {
        if (isMounted) setLoadingFeed(false);
      }
    };
    fetchFeed();
    return () => { isMounted = false; };
  }, [filters.lookingFor, filters.vipOnly, filters.district, filters.religion, filters.education, filters.minAge, filters.maxAge]);

  const [isAdvancedDrawerOpen, setIsAdvancedDrawerOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedInterestProfile, setSelectedInterestProfile] = useState<CandidateProfile | null>(null);
  const { isPremium, membershipPlan, checkCanConnect, recordProposalSent, VerificationModal, ProposalLimitModal } = useProposalVerification();
  const [skippedCandidates, setSkippedCandidates] = useState<CandidateProfile[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [sentInterestIds, setSentInterestIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('sentProposalInterestIds') || '[]');
    } catch {
      return [];
    }
  });

  // Filter calculation logic
  const filteredCandidates = candidates.filter((item) => {
    // 0. Exclude skipped/dismissed profiles
    if (dismissedIds.includes(String(item.id))) return false;

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

    // 9. Account Created By filter
    if (filters.accountCreatedBy && filters.accountCreatedBy !== 'Any') {
      const managed = (item.managedBy || 'Self (මා විසින්ම)').toLowerCase();
      const target = filters.accountCreatedBy.toLowerCase();
      if (target.includes('parent') && !managed.includes('parent')) return false;
      if (target.includes('self') && !managed.includes('self')) return false;
      if (target.includes('sibling') && !managed.includes('sibling')) return false;
      if (target.includes('relative') && !managed.includes('relative') && !managed.includes('guardian')) return false;
    }

    return true;
  });

  // Active filters list for removable chips & mobile badge counter
  const activeFilterList = useMemo(() => {
    const list: { id: string; label: string; onRemove: () => void }[] = [];
    if (filters.vipOnly) {
      list.push({ id: 'vipOnly', label: '👑 VIP Only', onRemove: () => setFilters(f => ({ ...f, vipOnly: false })) });
    }
    if (filters.district && filters.district !== 'All' && filters.district !== 'Any') {
      list.push({ id: 'district', label: `📍 ${filters.district}`, onRemove: () => setFilters(f => ({ ...f, district: 'All' })) });
    }
    if (filters.category && filters.category !== 'All') {
      list.push({ id: 'category', label: `🎯 ${filters.category}`, onRemove: () => setFilters(f => ({ ...f, category: 'All' })) });
    }
    if (filters.religion && filters.religion !== 'All' && filters.religion !== 'Any') {
      list.push({ id: 'religion', label: `🕉️ ${filters.religion}`, onRemove: () => setFilters(f => ({ ...f, religion: 'All' })) });
    }
    if (filters.ageRange && filters.ageRange !== 'All') {
      list.push({ id: 'ageRange', label: `Age: ${filters.ageRange}`, onRemove: () => setFilters(f => ({ ...f, ageRange: 'All' })) });
    }
    if (filters.minAge || filters.maxAge) {
      list.push({ 
        id: 'customAge', 
        label: `Age: ${filters.minAge || '18'} - ${filters.maxAge || '60'}`, 
        onRemove: () => setFilters(f => ({ ...f, minAge: '', maxAge: '' })) 
      });
    }
    if (filters.profession && filters.profession !== 'Any') {
      list.push({ id: 'profession', label: `💼 ${filters.profession}`, onRemove: () => setFilters(f => ({ ...f, profession: 'Any' })) });
    }
    if (filters.civilStatus && filters.civilStatus !== 'Any') {
      list.push({ id: 'civilStatus', label: `Status: ${filters.civilStatus}`, onRemove: () => setFilters(f => ({ ...f, civilStatus: 'Any' })) });
    }
    if (filters.caste && filters.caste !== 'Any') {
      list.push({ id: 'caste', label: `Caste: ${filters.caste}`, onRemove: () => setFilters(f => ({ ...f, caste: 'Any' })) });
    }
    if (filters.education && filters.education !== 'Any') {
      list.push({ id: 'education', label: `🎓 ${filters.education}`, onRemove: () => setFilters(f => ({ ...f, education: 'Any' })) });
    }
    if (filters.country && filters.country !== 'Any') {
      list.push({ id: 'country', label: `🌍 ${filters.country}`, onRemove: () => setFilters(f => ({ ...f, country: 'Any' })) });
    }
    if (filters.accountCreatedBy && filters.accountCreatedBy !== 'Any') {
      list.push({ id: 'accountCreatedBy', label: `Managed: ${filters.accountCreatedBy}`, onRemove: () => setFilters(f => ({ ...f, accountCreatedBy: 'Any' })) });
    }
    if (filters.codeSearch && filters.codeSearch.trim() !== '') {
      list.push({ id: 'codeSearch', label: `Search: "${filters.codeSearch}"`, onRemove: () => setFilters(f => ({ ...f, codeSearch: '' })) });
    }
    return list;
  }, [filters]);

  const handleSendInterest = (profile: CandidateProfile) => {
    if (!checkCanConnect(() => setPage('onboarding'))) return;
    setSelectedInterestProfile(profile);
  };

  const handleConfirmInterest = async () => {
    if (selectedInterestProfile) {
      try {
        await proposalApi.swipe(String(selectedInterestProfile.id || selectedInterestProfile.code), 'like');
      } catch {
        // Continue even if offline/mock
      }
      recordProposalSent();
      const updated = [...sentInterestIds, String(selectedInterestProfile.id)];
      setSentInterestIds(updated);
      localStorage.setItem('sentProposalInterestIds', JSON.stringify(updated));
      toast.success(`Proposal Request sent to ${selectedInterestProfile.name} (${selectedInterestProfile.code})! 💕`);
      setSelectedInterestProfile(null);
    }
  };

  const handleSkipProfile = (profile: CandidateProfile) => {
    setSkippedCandidates(prev => [profile, ...prev]);
    setDismissedIds(prev => [...prev, String(profile.id)]);
    toast.success(`Skipped ${profile.name || profile.code}. You can Rewind anytime!`, { icon: '↩️' });
  };

  const handleRewind = () => {
    if (skippedCandidates.length === 0) {
      toast('No skipped profiles to rewind.');
      return;
    }

    if (membershipPlan === 'free') {
      toast.error('Rewind is a Premium feature! Upgrade to Classic (5/day) or VIP (Unlimited). 👑');
      setPage('premium');
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const rewindKey = `daily_rewinds_${todayStr}`;
    const currentCount = parseInt(localStorage.getItem(rewindKey) || '0', 10);

    if (membershipPlan === 'classic' && currentCount >= 5) {
      toast.error('Daily 5 rewinds limit reached for Classic Plan! Upgrade to VIP for unlimited rewinds. 👑');
      return;
    }

    const lastSkipped = skippedCandidates[0];
    setSkippedCandidates(prev => prev.slice(1));
    setDismissedIds(prev => prev.filter(id => id !== String(lastSkipped.id)));

    if (membershipPlan === 'classic') {
      localStorage.setItem(rewindKey, String(currentCount + 1));
      toast.success(`Rewound ${lastSkipped.name || lastSkipped.code}! (${4 - currentCount} rewinds left today) ↺`);
    } else {
      toast.success(`VIP Unlimited Rewind: Restored ${lastSkipped.name || lastSkipped.code}! 👑 ↺`);
    }
  };

  // Pagination Calculations
  const totalCandidatesCount = filteredCandidates.length;
  const totalPages = Math.max(1, Math.ceil(totalCandidatesCount / PROFILES_PER_PAGE));

  // Sliced candidates for current view
  const paginatedCandidates = useMemo(() => {
    if (!isPremium) {
      // Basic Free User: 10 profiles max on page 1
      return filteredCandidates.slice(0, 10);
    }
    const startIndex = (currentPage - 1) * PROFILES_PER_PAGE;
    return filteredCandidates.slice(startIndex, startIndex + PROFILES_PER_PAGE);
  }, [filteredCandidates, isPremium, currentPage, PROFILES_PER_PAGE]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    if (!isPremium && page > 1) {
      toast.error("🔒 පිටු 2 සහ ඉන් ඉදිරියට සියලුම යෝජනා බැලීමට Classic Plan එකට Upgrade වන්න.", {
        icon: '👑'
      });
      setPage('premium');
      return;
    }
    setCurrentPage(page);
    const topEl = document.getElementById('search-results-top');
    if (topEl) {
      topEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 350, behavior: 'smooth' });
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
          <div id="search-results-top" className="lg:col-span-8 xl:col-span-9 space-y-6 scroll-mt-24">
            
            {/* SEARCH HEADER CONTROLS (Layout View Switch, Grooms/Brides Switcher, Mobile Trigger) */}
            <ProposalSearchHeader
              totalResults={totalCandidatesCount}
              currentPage={currentPage}
              totalPages={totalPages}
              layoutMode={layoutMode}
              onLayoutModeChange={setLayoutMode}
              onToggleMobileFilters={() => setIsMobileFilterOpen(true)}
              showingOnlyVIP={filters.vipOnly}
              activeGenderTab={filters.lookingFor as any || 'All'}
              onGenderTabChange={(tab) => setFilters(prev => ({ ...prev, lookingFor: tab }))}
              activeFilterCount={activeFilterList.length}
            />

            {/* ACTIVE FILTER PILLS */}
            {activeFilterList.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-0.5 pb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Active Filters ({activeFilterList.length}):
                </span>
                {activeFilterList.map(item => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-xs"
                  >
                    <span>{item.label}</span>
                    <button
                      type="button"
                      onClick={item.onRemove}
                      className="hover:bg-rose-500/20 rounded-full p-0.5 transition-colors cursor-pointer"
                      title="Clear filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 underline cursor-pointer ml-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* REWIND / UNDO LAST SKIP BANNER */}
            {skippedCandidates.length > 0 && (
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 px-4 rounded-2xl border transition-all ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                    <RotateCcw size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      You skipped <span className="text-rose-500">{skippedCandidates[0]?.name || skippedCandidates[0]?.code}</span>
                      {skippedCandidates.length > 1 && ` (+${skippedCandidates.length - 1} more)`}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {membershipPlan === 'vip' 
                        ? '👑 VIP Member: Unlimited Instant Rewinds' 
                        : membershipPlan === 'classic'
                          ? '🥈 Classic Member: 5 Rewinds / Day'
                          : '🔒 Basic Plan: Upgrade to Classic (5/day) or VIP (Unlimited) to Rewind'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRewind}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                >
                  <RotateCcw size={13} />
                  <span>Rewind Last Skip</span>
                </button>
              </div>
            )}

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
                /* 4-COLUMN CARDS GRID */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {paginatedCandidates.map((profile) => (
                    <ProposalSearchResultCard
                      key={profile.id}
                      profile={profile}
                      layoutMode="grid"
                      isInterestSent={sentInterestIds.includes(String(profile.id))}
                      onSendInterest={handleSendInterest}
                      onViewProfile={openProfile}
                      onSkipProfile={handleSkipProfile}
                    />
                  ))}

                  {/* 11th CARD: DAILY 10 PROFILES PAYWALL GATEKEEPER FOR BASIC USERS */}
                  {!isPremium && filteredCandidates.length > 10 && (
                    <div className={`p-6 rounded-3xl border flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden min-h-[380px] transition-all ${
                      isDark ? 'bg-slate-900/90 border-amber-500/30' : 'bg-white/95 border-amber-300'
                    }`}>
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3 border border-amber-500/20 shadow-md">
                        <Lock size={26} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
                        Daily Free Limit (10/10)
                      </span>
                      <h4 className="text-base font-black mb-1.5">නොමිලේ දිනකට Profiles 10යි</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed font-sinhala">
                        Basic Plan එකෙහි අද දිනට හිමි Profiles 10 සීමාව ඔබ සම්පූර්ණ කර ඇත. සීමාවකින් තොරව සියලුම Profiles නැරඹීමට Classic Plan එකට Upgrade වන්න.
                      </p>
                      <button
                        onClick={() => setPage('premium')}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] cursor-pointer"
                      >
                        <Crown size={14} /> Upgrade to Classic
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* SLEEK COMPACT LIST VIEW */
                <div className="space-y-5">
                  {paginatedCandidates.map((profile) => (
                    <ProposalSearchResultCard
                      key={profile.id}
                      profile={profile}
                      layoutMode="compact"
                      isInterestSent={sentInterestIds.includes(String(profile.id))}
                      onSendInterest={handleSendInterest}
                      onViewProfile={openProfile}
                      onSkipProfile={handleSkipProfile}
                    />
                  ))}

                  {/* COMPACT PAYWALL GATEKEEPER */}
                  {!isPremium && filteredCandidates.length > 10 && (
                    <div className={`p-6 rounded-3xl border flex items-center justify-between gap-4 shadow-lg ${
                      isDark ? 'bg-slate-900 border-amber-500/30' : 'bg-white border-amber-300'
                    }`}>
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                          <Lock size={22} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black">Daily Free Limit Reached (10/10)</h4>
                          <p className="text-xs text-slate-500">Upgrade to Classic Plan to unlock unlimited profiles & instant matching.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPage('premium')}
                        className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Crown size={14} /> Upgrade
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MODERN GLASSMORPHIC PAGINATION CONTROLLER */}
              {totalCandidatesCount > 0 && (
                <div className={`mt-10 p-4 sm:p-5 rounded-3xl border shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 font-sans backdrop-blur-xl transition-all ${
                  isDark 
                    ? 'bg-slate-900/90 border-slate-800 text-white' 
                    : 'bg-white/95 border-slate-200/90 text-slate-800 shadow-slate-100'
                }`}>
                  {/* Left: Detailed Count Indicator */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-1.5 text-center sm:text-left">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Showing <strong className="text-slate-900 dark:text-white font-extrabold">{isPremium ? `${((currentPage - 1) * PROFILES_PER_PAGE) + 1} - ${Math.min(currentPage * PROFILES_PER_PAGE, totalCandidatesCount)}` : `1 - ${Math.min(10, totalCandidatesCount)}`}</strong> of <strong className="text-rose-500 font-black">{totalCandidatesCount}</strong> Profiles
                    </span>
                    <span className="text-[11px] text-slate-400 font-sinhala">
                      (යෝජනා {totalCandidatesCount}න් {isPremium ? `${((currentPage - 1) * PROFILES_PER_PAGE) + 1} - ${Math.min(currentPage * PROFILES_PER_PAGE, totalCandidatesCount)}` : `1 - ${Math.min(10, totalCandidatesCount)}`} දක්වා)
                    </span>
                  </div>

                  {/* Right: Page Navigation Pills & Prev/Next Buttons */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
                    {/* Previous Button */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        currentPage === 1
                          ? 'opacity-40 cursor-not-allowed text-slate-400'
                          : isDark
                            ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:scale-105 active:scale-95'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 hover:scale-105 active:scale-95'
                      }`}
                    >
                      <ChevronLeft size={15} />
                      <span className="hidden sm:inline">පෙර (Prev)</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => {
                        const isActive = pageNum === currentPage;
                        const isLockedForFree = !isPremium && pageNum > 1;

                        // Smart truncation for large number of pages
                        if (totalPages > 6) {
                          if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                            if (pageNum === 2 || pageNum === totalPages - 1) {
                              return (
                                <span key={pageNum} className="px-1 text-slate-400 text-xs font-bold">
                                  •••
                                </span>
                              );
                            }
                            return null;
                          }
                        }

                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-9 h-9 rounded-xl text-xs font-black transition-all flex items-center justify-center cursor-pointer relative ${
                              isActive
                                ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 scale-105 ring-2 ring-rose-500/30'
                                : isDark
                                  ? 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                                  : 'bg-slate-100/80 hover:bg-slate-200 text-slate-700 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                            }`}
                          >
                            <span>{pageNum}</span>
                            {isLockedForFree && (
                              <span className="absolute -top-1 -right-1 text-[9px]">👑</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        currentPage === totalPages
                          ? 'opacity-40 cursor-not-allowed text-slate-400'
                          : isDark
                            ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:scale-105 active:scale-95'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 hover:scale-105 active:scale-95'
                      }`}
                    >
                      <span className="hidden sm:inline">ඊළඟ (Next)</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
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

      {/* REUSABLE IDENTITY VERIFICATION MODAL */}
      <VerificationModal onVerifyNow={() => setPage('dashboard')} />

      {/* MONTHLY PROPOSAL LIMIT (3/3) PAYWALL MODAL */}
      <ProposalLimitModal onUpgrade={() => setPage('premium')} />
    </div>
  );
}
