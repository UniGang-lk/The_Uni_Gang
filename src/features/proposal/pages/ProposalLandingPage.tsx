import { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, Star, UserCheck, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/ProposalPrimitives';
import { SUCCESS_STORIES } from '../data/mockProposalData';
import ProposalHeroSection from '../components/hero/ProposalHeroSection';
import ProposalFAQSection from '../components/faq/ProposalFAQSection';
import ProposalSearchResultCard, { CandidateProfile } from '../components/search/ProposalSearchResultCard';
import { useTheme } from '../../../context/ThemeContext';

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
    isVerified: true,
    religion: 'Buddhist',
    country: 'Sri Lanka',
    categoryBadge: 'Campus Verified 🎓'
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
    isVerified: true,
    religion: 'Buddhist',
    country: 'Australia',
    categoryBadge: 'Living Abroad ✈️'
  }
];

export default function ProposalLandingPage({
  onGetStarted,
  onSearch,
  onViewProfile,
  hasProposalProfile = false
}: {
  dark?: boolean;
  onGetStarted: () => void;
  onSearch?: (filters: any) => void;
  onViewProfile?: (profile: CandidateProfile) => void;
  hasProposalProfile?: boolean;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'All' | 'Groom' | 'Bride'>('All');

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
        <section className="py-16">
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

            {/* Filter Switcher */}
            <div className={`flex items-center p-1 rounded-2xl border shadow-sm shrink-0 ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {(['All', 'Groom', 'Bride'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeTab === tab
                      ? tab === 'Groom'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-rose-500 text-white shadow-md'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'All' ? 'All' : tab === 'Groom' ? 'Grooms (මනාලයන්)' : 'Brides (මනාලියන්)'}
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
                onSendInterest={onGetStarted}
                onViewProfile={(p) => (onViewProfile ? onViewProfile(p) : onGetStarted())}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onSearch?.({ lookingFor: activeTab })}
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
        <section className="py-12 relative border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className={`p-8 text-center hover:-translate-y-2 transition-transform duration-500 ${
              isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
            }`}>
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 shadow-inner">
                <Lock size={28} strokeWidth={2.5} />
              </div>
              <h3 className={`text-xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>100% Confidential</h3>
              <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Your profile is invisible to search engines like Google or Facebook. Only verified members can view your details.
              </p>
            </Card>
            <Card className={`p-8 text-center hover:-translate-y-2 transition-transform duration-500 ${
              isDark ? 'bg-slate-900/80 border-rose-900/30 text-white' : 'bg-white border-rose-200 text-slate-900 shadow-xl'
            }`}>
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center mb-6 text-rose-500 shadow-inner">
                <UserCheck size={28} strokeWidth={2.5} />
              </div>
              <h3 className={`text-xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Respectable Community</h3>
              <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Every candidate is manually checked with phone & identity proofs to maintain high trust and avoid fake profiles.
              </p>
            </Card>
            <Card className={`p-8 text-center hover:-translate-y-2 transition-transform duration-500 ${
              isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
            }`}>
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-500 shadow-inner">
                <ShieldCheck size={28} strokeWidth={2.5} />
              </div>
              <h3 className={`text-xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Privacy First Photo Blur</h3>
              <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Keep your photos blurred to the public. Photos only unlock once you mutually accept a proposal interest.
              </p>
            </Card>
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section id="how-it-works" className={`py-20 relative border-t ${isDark ? 'border-slate-900' : 'border-slate-200'}`}>
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-5xl font-black mt-4 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              How Uni Porondam Works
            </h2>
          </div>

          <div className="space-y-16 w-full">
            {/* Step 1 */}
            <div className="grid lg:grid-cols-2 gap-10 sm:gap-14 items-center group">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 mb-5 font-black text-xl shadow-inner">01</div>
                <h3 className={`text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Create a Verified Profile
                </h3>
                <p className={`text-sm sm:text-base leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Join a trusted circle. Your identity and background are verified to keep out fake accounts and casual daters.
                </p>
                <ul className="space-y-3">
                  {[
                    "Quick setup in under 2 minutes",
                    "Add your campus, profession, or overseas details",
                    "Configure photo privacy (e.g. Blur photos by default)"
                  ].map(point => (
                    <li key={point} className={`flex items-center gap-3 text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`order-1 lg:order-2 relative h-[360px] sm:h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all duration-700 hover:shadow-rose-500/20 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Students studying" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>
                <div className={`absolute bottom-6 left-6 right-6 p-4 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-4 border animate-fade-up ${
                  isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
                }`}>
                  <ShieldCheck size={32} className="text-emerald-500" />
                  <div>
                    <p className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Identity Verified</p>
                    <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Campus & Career confirmed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid lg:grid-cols-2 gap-10 sm:gap-14 items-center group">
              <div className={`relative h-[360px] sm:h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all duration-700 hover:shadow-fuchsia-500/20 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <img src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Friends laughing" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>
                <div className={`absolute bottom-6 left-6 right-6 p-4 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-4 border animate-fade-up ${
                  isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
                }`}>
                  <ShieldCheck size={32} className="text-fuchsia-500" />
                  <div>
                    <p className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Smart Matching</p>
                    <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Filter by District, Campus & Country</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-fuchsia-500/20 text-fuchsia-500 mb-5 font-black text-xl shadow-inner">02</div>
                <h3 className={`text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Discover & Get Matched
                </h3>
                <p className={`text-sm sm:text-base leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Smart filters do the work. Browse genuine profiles of students, graduates, professionals and expats in Sri Lanka and abroad.
                </p>
                <ul className="space-y-3">
                  {[
                    "Filter by University, Career, or Overseas status",
                    "Compatibility indicators",
                    "Bookmark & favorite prospects"
                  ].map(point => (
                    <li key={point} className={`flex items-center gap-3 text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      <CheckCircle2 size={18} className="text-fuchsia-500 shrink-0" /> {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid lg:grid-cols-2 gap-10 sm:gap-14 items-center group">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 mb-5 font-black text-xl shadow-inner">03</div>
                <h3 className={`text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Send a Proposal & Connect
                </h3>
                <p className={`text-sm sm:text-base leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  When you find someone special, send them a proposal. If they accept, your photos unblur and you unlock a private chat.
                </p>
                <ul className="space-y-3">
                  {[
                    "Real-time proposal requests with notifications",
                    "Photos automatically reveal only upon mutual accept",
                    "Masked phone number protection"
                  ].map(point => (
                    <li key={point} className={`flex items-center gap-3 text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      <CheckCircle2 size={18} className="text-amber-500 shrink-0" /> {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`order-1 lg:order-2 relative h-[360px] sm:h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all duration-700 hover:shadow-amber-500/20 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Couple holding hands" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>

                <div className={`absolute top-1/3 left-6 backdrop-blur-xl p-3 pr-5 rounded-2xl rounded-bl-none shadow-xl border animate-[float_4s_ease-in-out_infinite] ${
                  isDark ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
                }`}>
                  <p className="text-xs font-bold font-sans">Hi! I saw you graduated from UoM too? 👋</p>
                </div>
                <div className="absolute top-1/2 right-6 bg-rose-500 p-3 pr-5 rounded-2xl rounded-br-none shadow-xl shadow-rose-500/30 animate-[float_5s_ease-in-out_infinite_reverse]">
                  <p className="text-white text-xs font-bold font-sans">Yes! Batch of '21. Nice to meet you! 😊</p>
                </div>
              </div>
            </div>
          </div>
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

        {/* 6. FAQ SECTION */}
        <ProposalFAQSection />

      </div>
    </div>
  );
}
