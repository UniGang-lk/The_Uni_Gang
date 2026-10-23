import { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, Star, UserCheck, ArrowRight, Heart, X, Sparkles, PhoneCall, GraduationCap, Eye, FileText, Crown } from 'lucide-react';
import { Card } from '../components/ui/ProposalPrimitives';
import { SUCCESS_STORIES } from '../data/mockProposalData';
import ProposalHeroSection from '../components/hero/ProposalHeroSection';
import ProposalFAQSection from '../components/faq/ProposalFAQSection';
import ProposalSearchResultCard, { CandidateProfile } from '../components/search/ProposalSearchResultCard';
import { useTheme } from '../../../context/ThemeContext';
import toast from 'react-hot-toast';
import { proposalApi } from '../api/proposalApi';
import { useProposalVerification } from '../hooks/useProposalVerification';

const FEATURED_PROFILES: CandidateProfile[] = [
  {
    id: 1,
    code: 'UG-101',
    name: 'Piyumali L.',
    gender: 'Female',
    age: 25,
    district: 'Colombo',
    profession: 'Software Engineer',
    images: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: true,
    isVerified: true,
    religion: 'Buddhist',
    country: 'Sri Lanka',
    categoryBadge: 'ID Verified ✓'
  },
  {
    id: 2,
    code: 'UG-204',
    name: 'Sathira D.',
    gender: 'Male',
    age: 27,
    district: 'Kandy',
    profession: 'Doctor (MBBS)',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isClassic: true,
    isVerified: true,
    religion: 'Buddhist',
    country: 'Sri Lanka',
    categoryBadge: 'ID Verified ✓'
  },
  {
    id: 3,
    code: 'UG-312',
    name: 'Kasuni D.',
    gender: 'Female',
    age: 26,
    district: 'Gampaha',
    profession: 'Banking Executive',
    images: ['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isClassic: true,
    isVerified: true,
    religion: 'Buddhist',
    country: 'Sri Lanka',
    categoryBadge: 'ID Verified ✓'
  },
  {
    id: 4,
    code: 'UG-488',
    name: 'Kisal P.',
    gender: 'Male',
    age: 28,
    district: 'Melbourne',
    profession: 'Quantity Surveyor',
    images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    isVIP: true,
    isVerified: true,
    religion: 'Buddhist',
    country: 'Australia',
    categoryBadge: 'ID Verified ✓'
  }
];

export default function ProposalLandingPage({
  onGetStarted,
  onSearch,
  onViewProfile,
  onViewPricing,
  onViewHowItWorks,
  onViewSafety,
  onViewFAQ,
  onChoosePricingPlan,
  hasProposalProfile = false
}: {
  dark?: boolean;
  onGetStarted: () => void;
  onSearch?: (filters: any) => void;
  onViewProfile?: (profile: CandidateProfile) => void;
  onViewPricing?: () => void;
  onViewHowItWorks?: () => void;
  onViewSafety?: () => void;
  onViewFAQ?: () => void;
  onChoosePricingPlan?: (plan: 'classic_3m' | 'vip_6m') => void;
  hasProposalProfile?: boolean;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'All' | 'Groom' | 'Bride'>('All');
  const [selectedInterestProfile, setSelectedInterestProfile] = useState<CandidateProfile | null>(null);
  const [sentInterestIds, setSentInterestIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('sentProposalInterestIds') || '[]');
    } catch {
      return [];
    }
  });

  const { checkCanConnect, VerificationModal } = useProposalVerification();

  const handleCardConnect = (profile: CandidateProfile) => {
    if (!checkCanConnect(onGetStarted)) return;
    setSelectedInterestProfile(profile);
  };

  const handleConfirmProposal = async () => {
    if (!selectedInterestProfile) return;
    try {
      await proposalApi.swipe(String(selectedInterestProfile.id || selectedInterestProfile.code), 'like');
    } catch {
      // fallback smoothly
    }
    const targetId = String(selectedInterestProfile.id);
    if (!sentInterestIds.includes(targetId)) {
      const updated = [...sentInterestIds, targetId];
      setSentInterestIds(updated);
      try {
        localStorage.setItem('sentProposalInterestIds', JSON.stringify(updated));
      } catch {}
    }
    toast.success(`Proposal Request sent to ${selectedInterestProfile.name || selectedInterestProfile.code}! 💕`);
    setSelectedInterestProfile(null);
  };

  const displayedProfiles = FEATURED_PROFILES.filter(p => {
    if (activeTab === 'Groom') return p.gender === 'Male';
    if (activeTab === 'Bride') return p.gender === 'Female';
    return true;
  });

  return (
    <div className={`w-full relative min-h-screen font-sans selection:bg-rose-500/30 overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* 1. HERO SECTION (Full-bleed edge-to-edge) */}
      <ProposalHeroSection onGetStarted={onGetStarted} onSearch={onSearch} hasProposalProfile={hasProposalProfile} />

      {/* 2. MAIN CONTENT SECTIONS (Generous 1550px canvas for wide 24.5" screens) */}
      <div className="w-full max-w-[1550px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-18 relative z-10">

        {/* 2. RECENT VERIFIED PROFILES SHOWCASE */}
        <section id="discover" className="py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-rose-500">
                Verified Matchmaking
              </span>
              <h2 className={`text-2xl sm:text-4xl font-black tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {activeTab === 'Groom' ? 'Grooms (මනාලයන්)' : activeTab === 'Bride' ? 'Brides (මනාලියන්)' : 'Recent Verified Profiles'}
              </h2>
              <p className={`text-xs sm:text-sm font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Browse real Sri Lankan undergraduates, working professionals, and overseas candidates.
              </p>
            </div>

            {/* Filter Switcher (Mobile Responsive) */}
            <div className={`w-full sm:w-auto flex items-center p-1 rounded-2xl border shadow-sm shrink-0 overflow-x-auto no-scrollbar ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {(['All', 'Groom', 'Bride'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    activeTab === tab
                      ? tab === 'Groom'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-rose-500 text-white shadow-md'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'All' ? (
                    <span>All <span className="hidden sm:inline">Profiles</span></span>
                  ) : tab === 'Groom' ? (
                    <span>Grooms <span className="hidden sm:inline">(මනාලයන්)</span></span>
                  ) : (
                    <span>Brides <span className="hidden sm:inline">(මනාලියන්)</span></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 4-Column Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayedProfiles.map((profile) => (
              <ProposalSearchResultCard
                key={profile.id}
                profile={profile}
                isInterestSent={sentInterestIds.includes(String(profile.id))}
                onSendInterest={handleCardConnect}
                onViewProfile={(p) => {
                  if (onViewProfile) {
                    onViewProfile(p);
                  } else {
                    onGetStarted();
                  }
                }}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (!hasProposalProfile) {
                  toast("🔒 සියලුම සත්‍යාපිත මනාල/මනාලියන්ගේ Profiles පිරික්සීමට කරුණාකර පළමුව නොමිලේ ලියාපදිංචි වන්න.", {
                    icon: '💍',
                    duration: 5000
                  });
                  onGetStarted();
                } else {
                  onSearch?.({ lookingFor: activeTab });
                }
              }}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all hover:scale-105 cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-white' 
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-sm'
              }`}
            >
              <span>View All Verified Profiles</span>
              <ArrowRight size={14} className="text-rose-500" />
            </button>
          </div>
        </section>

        {/* 3. TRUST & SAFETY SECTION */}
        <section id="trust" className="py-12 relative border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className={`p-8 text-center hover:-translate-y-2 transition-transform duration-500 ${
              isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
            }`}>
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 shadow-inner">
                <Lock size={28} strokeWidth={2.5} />
              </div>
              <h3 className={`text-lg sm:text-xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                100% Confidential
              </h3>
              <p className="text-xs font-bold text-blue-500 mb-3">හැඳුනුම්පත් කිසිදු බාහිර අයෙකුට නොපෙනේ</p>
              <p className={`text-xs font-medium leading-relaxed mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Your National ID & proofs are strictly for internal admin verification. Never visible to any member, public, or search engines.
              </p>
              <p className={`text-[11px] font-sinhala leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                ඔබ උඩුගත කරන හැඳුනුම්පත පරිපාලන තහවුරු කිරීමට පමණක් වන අතර කිසිදු බාහිර පුද්ගලයෙකුට කිසිසේත්ම ප්‍රදර්ශනය නොවේ.
              </p>
            </Card>

            <Card className={`p-8 text-center hover:-translate-y-2 transition-transform duration-500 ${
              isDark ? 'bg-slate-900/80 border-rose-900/30 text-white' : 'bg-white border-rose-200 text-slate-900 shadow-xl'
            }`}>
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center mb-6 text-rose-500 shadow-inner">
                <UserCheck size={28} strokeWidth={2.5} />
              </div>
              <h3 className={`text-lg sm:text-xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Respectable Community
              </h3>
              <p className="text-xs font-bold text-rose-500 mb-3">ව්‍යාජ ගිණුම් සහ Spam වලින් තොරයි</p>
              <p className={`text-xs font-medium leading-relaxed mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Every candidate is manually checked to maintain high trust. Personal phone numbers & full names remain masked.
              </p>
              <p className={`text-[11px] font-sinhala leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                පෞද්ගලික දුරකථන අංක සහ සම්පූර්ණ නම් කිසිවිටෙකත් ප්‍රසිද්ධ නොකෙරේ. ආරක්ෂිත In-App Chat එකෙන් පමණක් සන්නිවේදනය සිදුවේ.
              </p>
            </Card>

            <Card className={`p-8 text-center hover:-translate-y-2 transition-transform duration-500 ${
              isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
            }`}>
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-500 shadow-inner">
                <ShieldCheck size={28} strokeWidth={2.5} />
              </div>
              <h3 className={`text-lg sm:text-xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Privacy First Photo Blur
              </h3>
              <p className="text-xs font-bold text-emerald-500 mb-3">ඡායාරූප ආරක්ෂාව සහ Watermark</p>
              <p className={`text-xs font-medium leading-relaxed mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Keep your photos blurred to the public with digital watermarks. Photos only unlock once you mutually accept a proposal.
              </p>
              <p className={`text-[11px] font-sinhala leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                ඔබගේ ඡායාරූප පෙරනිමියෙන්ම Blurred කර තැබිය හැකි අතර ඡායාරූප මත Digital Watermark එකක් ස්වයංක්‍රීයව යෙදේ.
              </p>
            </Card>
          </div>

          {/* Prominent Deep-Dive Safety & Privacy Center CTA Button */}
          {onViewSafety && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={onViewSafety}
                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-wider border border-blue-500/30 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <ShieldCheck size={16} className="text-blue-500 shrink-0" />
                <span>ආරක්ෂක ප්‍රතිපත්ති සහ පෞද්ගලිකත්ව සහතිකය (View Safety & Privacy Center)</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </section>

        {/* 4. HOW IT WORKS (CONCISE 3-STEP OVERVIEW + DEEP-DIVE GUIDE CTA) */}
        <section id="how-it-works" className={`py-16 sm:py-20 relative border-t ${isDark ? 'border-slate-900' : 'border-slate-200'}`}>
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-rose-500 font-sans">
              Authentic Matrimonial Process
            </span>
            <h2 className={`text-3xl sm:text-5xl font-black mt-2 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              How Uni Porondam Works
            </h2>
            <p className={`mt-2 text-xs sm:text-sm font-medium font-sinhala ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              පියවර 3 කින් ඔබට ගැළපෙන ජීවන සහකරුවා හෝ සහකාරිය සොයාගන්නා සැබෑ සහ ගෞරවනීය ක්‍රියාකාරීත්වය
            </p>
          </div>

          {/* Sleek 3-Card Interactive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className={`p-7 rounded-3xl border flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-xl relative overflow-hidden group ${
              isDark 
                ? 'bg-slate-900/70 border-slate-800 hover:border-rose-500/40 text-white shadow-lg' 
                : 'bg-white border-slate-200 hover:border-rose-300 text-slate-900 shadow-md'
            }`}>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-black text-xl border border-rose-500/20 shadow-inner">
                    01
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    Bio-Data
                  </span>
                </div>
                <h3 className="text-xl font-black mb-2">Build Detailed Bio-Data</h3>
                <p className="text-xs font-bold text-rose-500 mb-3 font-sinhala">මංගල Bio-Data එක සැකසීම</p>
                <p className={`text-xs leading-relaxed mb-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  විශ්වවිද්‍යාල උපාධිය, රැකියාව, පවුලේ විස්තර සහ කේන්දර තොරතුරු ඇතුළත් කර නොමිලේ profile එකක් සාදා ගන්න.
                </p>
                <ul className="space-y-2 text-xs font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Default Photo Privacy Blur</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Zero Phone Number Leaks</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2 */}
            <div className={`p-7 rounded-3xl border flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-xl relative overflow-hidden group ${
              isDark 
                ? 'bg-slate-900/70 border-slate-800 hover:border-emerald-500/40 text-white shadow-lg' 
                : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-900 shadow-md'
            }`}>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-xl border border-emerald-500/20 shadow-inner">
                    02
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Trust & Safety
                  </span>
                </div>
                <h3 className="text-xl font-black mb-2">Admin NIC Verification</h3>
                <p className="text-xs font-bold text-emerald-500 mb-3 font-sinhala">හැඳුනුම්පත් සත්‍යාපනය</p>
                <p className={`text-xs leading-relaxed mb-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  ජාතික හැඳුනුම්පත Admin Team එක විසින් රහසිගතව තහවුරු කර ‘ID Verified ✓’ නිල ලාංඡනය ලබා දෙයි.
                </p>
                <ul className="space-y-2 text-xs font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>100% Confidential (Admin Only)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>0% Fake Profiles Guarantee</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3 */}
            <div className={`p-7 rounded-3xl border flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-xl relative overflow-hidden group ${
              isDark 
                ? 'bg-slate-900/70 border-slate-800 hover:border-amber-500/40 text-white shadow-lg' 
                : 'bg-white border-slate-200 hover:border-amber-300 text-slate-900 shadow-md'
            }`}>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-xl border border-amber-500/20 shadow-inner">
                    03
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Connection
                  </span>
                </div>
                <h3 className="text-xl font-black mb-2">Proposal & Safe Chat</h3>
                <p className="text-xs font-bold text-amber-500 mb-3 font-sinhala">යෝජනා සහ ආරක්ෂිත කතාබහ</p>
                <p className={`text-xs leading-relaxed mb-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  ගැළපෙන කෙනෙකුට Proposal යවා, දෙදෙනාම Accept කළ පසු ඡායාරූප unblur වී In-App Chat විවෘත වේ.
                </p>
                <ul className="space-y-2 text-xs font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Two-Way Mutual Consent</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Safety Shield Protection</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Prominent Deep-Dive Guide CTA Button */}
          {onViewHowItWorks && (
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={onViewHowItWorks}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              >
                <Sparkles size={17} />
                <span>සම්පූර්ණ ක්‍රියාකාරීත්වය පියවරෙන් පියවර දැනගන්න (View Full A-Z Guide)</span>
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </button>
              <p className={`text-xs mt-3 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                ලියාපදිංචියේ සිට මංගල්‍යය දක්වා සියලුම අදියර 6ක් A-to-Z විස්තරාත්මකව කියවන්න
              </p>
            </div>
          )}
        </section>

        {/* 5. SUCCESS STORIES */}
        <section className={`py-20 border-t ${isDark ? 'border-slate-900' : 'border-slate-200'}`}>
          <div className="text-center mb-14 relative z-10">
            <h2 className={`text-3xl sm:text-5xl font-black mt-4 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Happily Ever After
            </h2>
            <p className={`mt-3 text-sm sm:text-base font-medium max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Real stories from verified members who found their perfect match right here on Uni Porondam.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUCCESS_STORIES.slice(0, 3).map((story) => (
              <Card key={story.id} className={`p-6 flex flex-col hover:-translate-y-2 transition-transform duration-500 border ${
                isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
              }`}>
                <div className="relative h-48 rounded-2xl overflow-hidden mb-5">
                  <img src={story.image} alt="Couple" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-bold text-base">{story.names}</p>
                    <p className="text-rose-400 font-bold text-xs">Married {story.date}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex gap-1 text-amber-400 mb-3">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill="currentColor" />)}
                  </div>
                  <p className={`text-xs sm:text-sm font-medium italic leading-relaxed line-clamp-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    "{story.quote}"
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 6. TRANSPARENT MEMBERSHIP PLANS TEASER SECTION */}
        <section id="pricing" className={`py-20 border-t ${isDark ? 'border-slate-900' : 'border-slate-200'}`}>
          <div className="text-center mb-14 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-3">
              <Crown size={14} />
              <span>Transparent Matrimonial Pricing • No Card Traps</span>
            </div>
            <h2 className={`text-3xl sm:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              සරල, විනිවිද පෙනෙන <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500">සාමාජික පැකේජ</span>
            </h2>
            <p className={`mt-3 text-sm sm:text-base font-medium max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              ශ්‍රී ලාංකික විශ්වවිද්‍යාල උපාධිධාරීන් සහ පවුල් සඳහා සුදුසුම පැකේජය තෝරාගන්න. කිසිදු මාසික auto-debit උගුල් නැත.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
            {/* Basic Card */}
            <div className={`p-7 rounded-3xl border flex flex-col justify-between transition-all ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-500/10 px-3 py-1 rounded-full border border-slate-500/20">
                  🥉 Basic Plan
                </span>
                <h3 className={`text-2xl font-black mt-3 mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Free Forever</h3>
                <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>නොමිලේ පිරික්සීමට කැමති අයට</p>
                <div className={`text-3xl font-black mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  රු. 0 <span className={`text-xs font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/ ජීවිත කාලයටම</span>
                </div>
                <ul className={`space-y-2.5 text-xs mb-6 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><CheckCircle2 size={15} /> සම්පූර්ණ Bio-Data සාදාගැනීම</li>
                  <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><CheckCircle2 size={15} /> Admin-Only NIC Verification</li>
                  <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><CheckCircle2 size={15} /> දිනකට Profiles 10ක් නැරඹීම</li>
                  <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><CheckCircle2 size={15} /> මූලික Filters (දිස්ත්‍රික්කය, වයස, ආගම)</li>
                  <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><CheckCircle2 size={15} /> මසකට Proposals 3ක් යැවීම</li>
                  <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><CheckCircle2 size={15} /> Match වූ පසු In-App Messages 10ක්</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={onGetStarted}
                className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isDark
                    ? 'border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white'
                    : 'border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                Start Free (රු. 0)
              </button>
            </div>

            {/* Classic Card (Highlighted) */}
            <div className="p-7 rounded-3xl border-2 border-amber-400/80 bg-gradient-to-b from-amber-500/10 via-slate-900/90 to-slate-900 flex flex-col justify-between relative shadow-2xl shadow-amber-500/10 scale-[1.02]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                ⭐ Most Popular
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  🥈 Classic Plan
                </span>
                <h3 className="text-2xl font-black mt-3 mb-1 text-white">මාස 3ක් (දින 90)</h3>
                <p className="text-xs text-amber-200/80 mb-4">සක්‍රීයව සහකරුවෙකු සොයන උපාධිධාරීන්ට</p>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-6">
                  <span className="text-2xl sm:text-3xl font-black text-white whitespace-nowrap">රු. 2,990</span>
                  <span className="text-xs font-normal text-slate-400 whitespace-nowrap">/ මාස 3 (මසකට රු. 997යි)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-200 mb-6 font-medium">
                  <li className="flex items-center gap-2 text-amber-300 font-bold"><Sparkles size={15} /> Unlimited Profiles & Proposals</li>
                  <li className="flex items-center gap-2 text-amber-300 font-bold"><Sparkles size={15} /> 20+ Advanced Match Filters (උස, ආදායම, රැකියාව)</li>
                  <li className="flex items-center gap-2 text-amber-300 font-bold"><Sparkles size={15} /> Unlimited In-App Real-time Chat</li>
                  <li className="flex items-center gap-2 text-emerald-400"><CheckCircle2 size={15} /> Who Liked You Unlocked</li>
                  <li className="flex items-center gap-2 text-emerald-400"><CheckCircle2 size={15} /> Read Receipts (Seen ✓✓ Status)</li>
                  <li className="flex items-center gap-2 text-emerald-400"><CheckCircle2 size={15} /> Shortlist 25ක් & Private Notes</li>
                  <li className="flex items-center gap-2 text-emerald-400"><CheckCircle2 size={15} /> දිනකට Rewinds 5ක් (Undo Skips)</li>
                  <li className="flex items-center gap-2 text-emerald-400"><CheckCircle2 size={15} /> විස්තරාත්මක කේන්දර ගැලපීම</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onChoosePricingPlan ? onChoosePricingPlan('classic_3m') : onViewPricing?.()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Choose Classic (රු. 2,990)</span>
                <Crown size={14} />
              </button>
            </div>

            {/* VIP Card */}
            <div className={`p-7 rounded-3xl border flex flex-col justify-between transition-all relative ${
              isDark ? 'bg-slate-900/60 border-amber-500/30' : 'bg-white border-amber-300 shadow-xl'
            }`}>
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-amber-400/40 font-black text-[10px] uppercase tracking-wider shadow-sm">
                👑 Best Value
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  🥇 VIP Premium Plan
                </span>
                <h3 className={`text-2xl font-black mt-3 mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>මාස 6ක් (දින 180)</h3>
                <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>කඩිනම් තීරණ ගැනීමට කැමති පවුල්වලට</p>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-6">
                  <span className={`text-2xl sm:text-3xl font-black whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-900'}`}>රු. 4,990</span>
                  <span className={`text-xs font-normal whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/ මාස 6 (මසකට රු. 830යි)</span>
                </div>
                <ul className={`space-y-2.5 text-xs mb-6 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <li className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold"><Crown size={15} /> Classic හි සියලුම පහසුකම්</li>
                  <li className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold"><Crown size={15} /> 👑 VIP Profiles Only Exclusive Filter</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-amber-500 shrink-0" /> 20+ Advanced Match Filters Unlocked</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-amber-500 shrink-0" /> 5x Top Search & Feed Placement</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-amber-500 shrink-0" /> Gold VIP Ring & Crown Badge</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-amber-500 shrink-0" /> 🕶️ Ghost / Incognito Browsing</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-amber-500 shrink-0" /> Unlimited Shortlists & Notes</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-amber-500 shrink-0" /> Unlimited Rewinds (Undo any skip)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-amber-500 shrink-0" /> සම්පූර්ණ කේන්දරය & පොරොන්දම් 20 Chart</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-amber-500 shrink-0" /> Priority VIP WhatsApp Concierge</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onChoosePricingPlan ? onChoosePricingPlan('vip_6m') : onViewPricing?.()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Choose VIP (රු. 4,990)</span>
                <Crown size={14} />
              </button>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={onViewPricing}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Crown size={16} />
              <span>සම්පූර්ණ විස්තර සහ Comparison Table එක බලන්න (Open Full Pricing Page)</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </section>

        {/* 7. FAQ SECTION */}
        <ProposalFAQSection onViewAllFAQ={onViewFAQ} maxItems={5} />

      </div>

      {/* DIRECT PROPOSAL INTEREST CONFIRMATION MODAL */}
      {selectedInterestProfile && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
          <div className={`p-6 sm:p-8 rounded-3xl max-w-md w-full border shadow-2xl text-center relative ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setSelectedInterestProfile(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-rose-500/20 shadow-lg">
              <img
                src={selectedInterestProfile.images?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                alt={selectedInterestProfile.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-xl font-black mb-1">
              Send Proposal Request?
            </h3>
            <p className="text-xs font-bold text-rose-500 mb-3">
              {selectedInterestProfile.name} ({selectedInterestProfile.code}) • {selectedInterestProfile.district}
            </p>

            <p className={`text-xs leading-relaxed mb-5 font-sinhala ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              ඔබ <strong>{selectedInterestProfile.name}</strong> වෙත Proposal Request එකක් යැවීමට සූදානම්ද? දෙපාර්ශවයම Accept කළ පසු ඡායාරූප unblur වී ආරක්ෂිත In-App Chat පහසුකම විවෘත වේ.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedInterestProfile(null)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  isDark ? 'border-slate-800 bg-slate-800/80 hover:bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                අවලංගු කරන්න
              </button>
              <button
                type="button"
                onClick={handleConfirmProposal}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-600 text-white shadow-md shadow-rose-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Heart size={14} fill="currentColor" />
                <span>Send Proposal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REUSABLE IDENTITY VERIFICATION MODAL */}
      <VerificationModal onVerifyNow={onGetStarted} />
    </div>
  );
}
