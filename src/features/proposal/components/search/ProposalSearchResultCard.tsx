import { Heart, ShieldCheck, MapPin, Briefcase, Crown, Check, Lock, Eye } from 'lucide-react';
import { WatermarkOverlay } from '../privacy/WatermarkOverlay';
import { useTheme } from '../../../../context/ThemeContext';

export interface CandidateProfile {
  id: string | number;
  code: string;
  name: string;
  age: number;
  district: string;
  hometown?: string;
  profession: string;
  monthlyIncome?: string;
  images: string[];
  blurPhoto?: boolean;
  isVIP?: boolean;
  isVerified?: boolean;
  isPhoneVerified?: boolean;
  civilStatus?: string;
  ethnicity?: string;
  religion?: string;
  caste?: string;
  height?: string;
  country?: string;
  dietaryPreference?: string;
  publishedDate?: string;
  educationCategory?: 'University' | 'Professional Qualification' | 'General / Business' | string;
  categoryBadge?: string;
}

interface ProposalSearchResultCardProps {
  profile: CandidateProfile;
  layoutMode?: 'grid' | 'compact';
  onSendInterest: (profile: CandidateProfile) => void;
  onViewProfile: (profile: CandidateProfile) => void;
}

export const getCategoryBadgeDetails = (educationCategory?: string, categoryBadge?: string) => {
  if (categoryBadge) {
    if (categoryBadge.includes('Campus') || categoryBadge.includes('University') || categoryBadge.includes('🎓')) {
      return {
        label: categoryBadge,
        bgClass: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white border-blue-400/50 shadow-blue-500/20'
      };
    }
    if (categoryBadge.includes('Professional') || categoryBadge.includes('💼')) {
      return {
        label: categoryBadge,
        bgClass: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white border-emerald-400/50 shadow-emerald-500/20'
      };
    }
    if (categoryBadge.includes('Enterprise') || categoryBadge.includes('Business') || categoryBadge.includes('🏢')) {
      return {
        label: categoryBadge,
        bgClass: 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white border-purple-400/50 shadow-purple-500/20'
      };
    }
    return {
      label: categoryBadge,
      bgClass: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white border-blue-400/50 shadow-blue-500/20'
    };
  }

  const cat = (educationCategory || '').toLowerCase();
  if (cat.includes('professional') || cat.includes('qualification')) {
    return {
      label: 'Working Professional 💼',
      bgClass: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white border-emerald-400/50 shadow-emerald-500/20'
    };
  }
  if (cat.includes('general') || cat.includes('business')) {
    return {
      label: 'Business Enterprise 🏢',
      bgClass: 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white border-purple-400/50 shadow-purple-500/20'
    };
  }
  // Default for University / Campus
  return {
    label: 'Campus Graduate 🎓',
    bgClass: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white border-blue-400/50 shadow-blue-500/20'
  };
};

export default function ProposalSearchResultCard({
  profile,
  layoutMode = 'grid',
  onSendInterest,
  onViewProfile,
}: ProposalSearchResultCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    code = 'BR000158',
    name = 'Piyumali L.',
    age = 31,
    district = 'Colombo 1',
    profession = 'Lecturer',
    monthlyIncome = 'Rs 200,000 - Rs 300,000',
    images = ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    blurPhoto = false,
    isVIP = false,
    isVerified = true,
    civilStatus = 'Never Married (අවිවාහක)',
    religion = 'Buddhist',
    height = '5.4 ft',
    dietaryPreference = 'Non-Vegetarian 🍗',
    educationCategory,
    categoryBadge
  } = profile;

  const categoryDetails = getCategoryBadgeDetails(educationCategory, categoryBadge);

  const displayImage = images?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  if (layoutMode === 'grid') {
    return (
      <div
        onClick={() => onViewProfile(profile)}
        className={`group relative w-full rounded-[2.2rem] p-3.5 flex flex-col justify-between transition-all duration-500 border cursor-pointer font-sans shadow-md hover:shadow-2xl hover:-translate-y-1.5 ${
          isVIP
            ? isDark
              ? 'bg-gradient-to-b from-slate-900 via-slate-900/95 to-amber-950/20 border-amber-500/40 hover:border-amber-400'
              : 'bg-gradient-to-b from-white via-amber-50/30 to-white border-amber-300/60 hover:border-amber-400 shadow-amber-500/5'
            : isDark
            ? 'bg-slate-900/90 border-slate-800 hover:border-rose-500/40'
            : 'bg-white border-slate-200/90 hover:border-rose-300 shadow-slate-200/50'
        }`}
      >
        <div>
          {/* Full-Bleed Luxury Portrait Photo Container */}
          <div className="relative w-full h-72 rounded-[1.8rem] overflow-hidden shadow-sm border border-slate-200/50 dark:border-slate-800 group-hover:shadow-md transition-all">
            <WatermarkOverlay text={`ID: ${code} • Uni Porondam`}>
              <img
                src={displayImage}
                alt={name}
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  blurPhoto ? 'blur-xl scale-110 opacity-85' : ''
                }`}
              />
            </WatermarkOverlay>

            {/* Dark Scrim Overlay at Bottom of Photo */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

            {/* Floating Top Left Badge: Distinct Background Category Badge */}
            <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-md flex items-center gap-1 font-sans ${categoryDetails.bgClass}`}>
                {categoryDetails.label}
              </span>
            </div>

            {/* Floating Top Right Badge: Metallic Gold Crown VIP Pill */}
            {isVIP && (
              <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
                <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-yellow-200/90 shadow-md flex items-center gap-1 font-sans">
                  <Crown size={11} className="fill-slate-950 text-slate-950 shrink-0" /> VIP
                </span>
              </div>
            )}

            {/* Photo Blur Overlay Badge */}
            {blurPhoto && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30 backdrop-blur-sm pointer-events-none font-sans">
                <span className="bg-slate-900/90 text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5 font-sans">
                  <Lock size={12} className="text-amber-400" /> Photo Protected
                </span>
              </div>
            )}

            {/* Floating Name, Age & Verified Checkmark on Photo Scrim */}
            <div className="absolute bottom-3 left-3.5 right-3.5 z-10 text-white pointer-events-none font-sans">
              <h3 className="text-xl font-black tracking-tight leading-tight flex items-center gap-1.5 text-white drop-shadow-md font-sans">
                <span>{name}</span>
                <span className="text-sm font-extrabold opacity-90">{age} yrs</span>
                {isVerified && (
                  <span className="text-blue-400 shrink-0 inline-flex items-center" title="Verified Profile">
                    <ShieldCheck size={16} className="fill-blue-500/30" />
                  </span>
                )}
              </h3>
              <p className="text-xs font-semibold text-slate-200/90 flex items-center gap-1 mt-0.5 drop-shadow-sm font-sans">
                <MapPin size={12} className="text-rose-400 shrink-0" /> {district}
              </p>
            </div>
          </div>

          {/* Details Metadata Stack */}
          <div className="p-2 pt-3 space-y-3 font-sans">
            {/* Profession & Income */}
            <div className="flex items-center justify-between gap-2 text-xs font-bold">
              <span className={`flex items-center gap-1.5 truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <Briefcase size={14} className="text-indigo-500 shrink-0" />
                <span className="truncate">{profession}</span>
              </span>
              {monthlyIncome && (
                <span className="text-[11px] font-black text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full shrink-0 border border-rose-500/20">
                  {monthlyIncome}
                </span>
              )}
            </div>

            {/* Attribute Chips */}
            <div className="flex flex-wrap gap-1.5 font-sinhala">
              {civilStatus && (
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${
                  isDark ? 'bg-slate-800/80 border-slate-700/80 text-slate-300' : 'bg-slate-100/80 border-slate-200/80 text-slate-700'
                }`}>
                  {civilStatus}
                </span>
              )}
              {religion && (
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${
                  isDark ? 'bg-slate-800/80 border-slate-700/80 text-slate-300' : 'bg-slate-100/80 border-slate-200/80 text-slate-700'
                }`}>
                  {religion}
                </span>
              )}
              {height && (
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${
                  isDark ? 'bg-slate-800/80 border-slate-700/80 text-slate-300' : 'bg-slate-100/80 border-slate-200/80 text-slate-700'
                }`}>
                  {height}
                </span>
              )}
              {dietaryPreference && (
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${
                  isDark ? 'bg-slate-800/80 border-slate-700/80 text-slate-300' : 'bg-slate-100/80 border-slate-200/80 text-slate-700'
                }`}>
                  {dietaryPreference}
                </span>
              )}
            </div>

            {/* Verification Checkmarks */}
            <div className="flex items-center gap-3 pt-1 text-[10px] font-extrabold text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Check size={12} strokeWidth={3} /> Photo Verified
              </span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Check size={12} strokeWidth={3} /> Bio Verified
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Dual Action Buttons (View Profile + Send Proposal) */}
        <div className="p-2 pt-1 font-sans grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile(profile);
            }}
            className={`w-full py-2.5 px-3 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
            }`}
          >
            <Eye size={14} className="text-slate-500 dark:text-slate-400" />
            <span>View Profile</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSendInterest(profile);
            }}
            className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-black text-xs shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-rose-400/20"
          >
            <Heart size={14} fill="currentColor" />
            <span>Send Proposal</span>
          </button>
        </div>
      </div>
    );
  }

  /* Compact List Mode View */
  return (
    <div
      onClick={() => onViewProfile(profile)}
      className={`group relative w-full rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 border cursor-pointer font-sans shadow-sm hover:shadow-xl ${
        isVIP
          ? isDark
            ? 'bg-slate-900/95 border-amber-500/30 hover:border-amber-400'
            : 'bg-gradient-to-r from-amber-50/40 to-white border-amber-300/60 hover:border-amber-400'
          : isDark
          ? 'bg-slate-900/80 border-slate-800 hover:border-rose-500/40'
          : 'bg-white border-slate-200 hover:border-rose-300'
      }`}
    >
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* Clean Thumbnail Container without crowded overlay badges */}
        <div className="relative w-20 h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800 shadow-sm">
          <WatermarkOverlay text={`ID: ${code}`} compact={true}>
            <img src={displayImage} alt={name} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${blurPhoto ? 'blur-md' : ''}`} />
          </WatermarkOverlay>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 tracking-wider">
              {code}
            </span>
            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-sm flex items-center gap-0.5 font-sans ${categoryDetails.bgClass}`}>
              {categoryDetails.label}
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors flex items-center gap-1.5">
              <span>{name},</span>
              <span className="font-bold text-sm text-slate-500 dark:text-slate-400">{age} yrs</span>
            </h3>

            {/* VIP Metallic Gold Crown Badge (Moved inline next to candidate name for clean visual design) */}
            {isVIP && (
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-yellow-200/90 shadow-sm flex items-center gap-0.5 font-sans">
                <Crown size={9} className="fill-slate-950 text-slate-950 shrink-0" /> VIP
              </span>
            )}

            {isVerified && <span title="Verified Profile"><ShieldCheck size={15} className="text-blue-500 shrink-0" /></span>}
          </div>

          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1"><MapPin size={12} className="text-rose-500" /> {district}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Briefcase size={12} className="text-indigo-500" /> {profession}</span>
          </p>

          <div className="flex items-center gap-2 mt-2 font-sinhala">
            {civilStatus && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {civilStatus}
              </span>
            )}
            {religion && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {religion}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex sm:flex-row items-center justify-end w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile(profile);
          }}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer"
        >
          <Eye size={13} /> View Profile
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSendInterest(profile);
          }}
          className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Heart size={13} fill="currentColor" /> Proposal
        </button>
      </div>
    </div>
  );
}
