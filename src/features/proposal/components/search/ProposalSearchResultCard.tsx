import { MapPin, Briefcase, Lock, User as UserIcon, ShieldCheck, Check, Crown, Bookmark, X, Star, Sparkles } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

export interface CandidateProfile {
  id: string | number;
  code: string;
  name: string;
  gender?: 'Male' | 'Female' | string;
  age: number;
  district: string;
  hometown?: string;
  profession: string;
  monthlyIncome?: string;
  images: string[];
  blurPhoto?: boolean;
  isVIP?: boolean;
  isClassic?: boolean;
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
  educationCategory?: 'University' | 'Professional' | 'Vocational' | 'Abroad' | string;
  categoryBadge?: string;
  matchPercentage?: number;
  matchSummary?: string;
  managedBy?: string;
}

interface ProposalSearchResultCardProps {
  profile: CandidateProfile;
  layoutMode?: 'grid' | 'compact';
  isInterestSent?: boolean;
  onSendInterest: (profile: CandidateProfile) => void;
  onViewProfile: (profile: CandidateProfile) => void;
  onSkipProfile?: (profile: CandidateProfile) => void;
}

export default function ProposalSearchResultCard({
  profile,
  layoutMode = 'grid',
  isInterestSent = false,
  onSendInterest,
  onViewProfile,
  onSkipProfile,
}: ProposalSearchResultCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    code = 'UG-101',
    name = 'Member',
    gender = 'Male',
    age = 25,
    district = 'Colombo',
    profession = 'Professional',
    images = [],
    isVerified = true,
    religion = 'Buddhist',
    country = 'Sri Lanka'
  } = profile;

  const blurPhoto = Boolean(profile.blurPhoto ?? profile.blur_photo);
  const displayImage = images?.[0];
  const isFemale = gender?.toLowerCase() === 'female' || code.startsWith('BR');

  if (layoutMode === 'compact') {
    return (
      <div
        onClick={() => onViewProfile(profile)}
        className={`group relative rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 border cursor-pointer font-sans shadow-sm hover:shadow-xl hover:-translate-y-0.5 ${
          profile.isVIP 
            ? 'ring-2 ring-amber-400 shadow-amber-400/20 border-amber-400/50' 
            : profile.isClassic
              ? 'ring-2 ring-blue-500/60 shadow-blue-500/15 border-blue-400/50'
              : isDark
                ? 'bg-slate-900 border-slate-800 hover:border-rose-500/50'
                : 'bg-white border-slate-200/90 hover:border-rose-300 shadow-slate-100'
        }`}
      >
        <div className="flex items-center gap-3.5 sm:gap-5 w-full sm:w-auto">
          {/* Avatar square */}
          <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border ${
            profile.isVIP ? 'border-amber-400/60' : profile.isClassic ? 'border-blue-400/60' : 'border-slate-200 dark:border-slate-700'
          }`}>
            {displayImage ? (
              <img
                src={displayImage}
                alt={name}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  blurPhoto ? 'blur-lg scale-110 opacity-80' : ''
                }`}
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${isFemale ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500' : 'bg-blue-50 dark:bg-blue-950/40 text-blue-500'}`}>
                <UserIcon size={32} />
              </div>
            )}
            {profile.isVIP && (
              <span className="absolute top-1 left-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                <Crown size={9} fill="currentColor" /> VIP
              </span>
            )}
          </div>

          {/* Center Details */}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {name || `User ${code}`}
              </h3>
              <span className="text-xs font-bold text-slate-400">({code})</span>
              {isVerified && (
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck size={11} /> Verified
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium flex-wrap">
              <span className="font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900/50">{age} Yrs</span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin size={12} className="text-slate-400" /> {district}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Briefcase size={12} className="text-slate-400" /> {profession}</span>
            </div>

            {Boolean(profile.matchPercentage && profile.matchPercentage > 0) && (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                <Sparkles size={11} className="text-emerald-500 shrink-0" />
                <span>{profile.matchPercentage}% Compatibility Match</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile(profile);
            }}
            className="flex-1 sm:flex-none py-2 px-4 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors text-center cursor-pointer whitespace-nowrap"
          >
            View Details
          </button>
          {isInterestSent ? (
            <button
              type="button"
              disabled
              className="flex-1 sm:flex-none py-2 px-4 rounded-xl font-bold text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-center flex items-center justify-center gap-1 cursor-default select-none whitespace-nowrap"
            >
              <Check size={13} className="text-emerald-500" />
              <span>Sent ✓</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSendInterest(profile);
              }}
              className="flex-1 sm:flex-none py-2 px-4 rounded-xl font-bold text-xs bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/20 transition-all text-center cursor-pointer whitespace-nowrap"
            >
              Connect
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onViewProfile(profile)}
      className={`group relative rounded-3xl p-3 flex flex-col justify-between transition-all duration-300 border cursor-pointer font-sans shadow-sm hover:shadow-xl hover:-translate-y-1 ${
        profile.isVIP 
          ? 'ring-2 ring-amber-400 shadow-amber-400/20 border-amber-400/50' 
          : profile.isClassic
            ? 'ring-2 ring-blue-500/60 shadow-blue-500/15 border-blue-400/50'
            : isDark
              ? 'bg-slate-900 border-slate-800 hover:border-rose-500/50'
              : 'bg-white border-slate-200/90 hover:border-rose-300 shadow-slate-100'
      }`}
    >
      <div>
        {/* Portrait Image Container with VIP/Classic Ring */}
        <div className={`relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 border ${
          profile.isVIP 
            ? 'border-amber-400/60 shadow-inner' 
            : profile.isClassic
              ? 'border-blue-400/60 shadow-inner'
              : 'border-slate-200/40 dark:border-slate-800'
        }`}>
          {/* Top Left Tier Badge: VIP or Classic */}
          {profile.isVIP ? (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[10px] tracking-wide px-2.5 py-0.5 rounded-full shadow-lg shadow-amber-400/30 flex items-center gap-1">
                <Crown size={12} fill="currentColor" /> VIP
              </span>
            </div>
          ) : profile.isClassic ? (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-black text-[10px] tracking-wide px-2.5 py-0.5 rounded-full shadow-lg shadow-blue-500/25 flex items-center gap-1">
                <Star size={11} fill="currentColor" /> CLASSIC
              </span>
            </div>
          ) : null}

          {displayImage ? (
            <img
              src={displayImage}
              alt={name}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                blurPhoto ? 'blur-xl scale-110 opacity-80' : ''
              }`}
            />
          ) : (
            /* Traditional Styled Placeholder if no image */
            <div className={`w-full h-full flex flex-col items-center justify-center p-4 text-center ${
              isFemale 
                ? 'bg-gradient-to-b from-rose-50 to-pink-100 dark:from-rose-950/40 dark:to-pink-900/20 text-rose-500' 
                : 'bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-900/20 text-blue-500'
            }`}>
              <div className="w-20 h-20 rounded-full border-2 border-current flex items-center justify-center mb-2 opacity-80">
                <UserIcon size={38} strokeWidth={1.5} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                {isFemale ? 'Bride Profile' : 'Groom Profile'}
              </span>
              <span className="text-[10px] opacity-60">Verified Bio-Data</span>
            </div>
          )}

          {/* Top Right Verified Badge */}
          {isVerified && (
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-200 font-extrabold text-[10px] tracking-wide px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center gap-1.5 transition-transform duration-200 hover:scale-105">
                <ShieldCheck size={13} className="text-blue-500" />
                <span>ID Verified ✓</span>
              </span>
            </div>
          )}

          {/* Photo Blur Overlay Badge */}
          {blurPhoto && displayImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30 backdrop-blur-sm pointer-events-none">
              <span className="bg-slate-900/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5">
                <Lock size={12} className="text-rose-400" /> Photo Blurred
              </span>
            </div>
          )}

          {/* Skip Profile Button */}
          {onSkipProfile && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSkipProfile(profile);
              }}
              title="Skip profile (Can rewind later)"
              className="absolute bottom-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-slate-900/75 hover:bg-rose-500 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-md hover:scale-110 active:scale-95"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Details Section */}
        <div className="px-1 space-y-2">
          {/* User Code / Name */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate">
              {name || `User ${code}`}
            </h3>
            <span className="text-[11px] font-bold text-slate-400">
              {code}
            </span>
          </div>

          {/* AI Compatibility Match Score */}
          {Boolean(profile.matchPercentage && profile.matchPercentage > 0) && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
              <Sparkles size={11} className="text-emerald-500 shrink-0" />
              <span>{profile.matchPercentage}% Compatibility Match</span>
            </div>
          )}

          {/* Age Pill & Religion */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 px-2 py-0.5 rounded-md">
              {age} Yrs
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              • {religion || 'Buddhist'}
            </span>
          </div>

          {/* Location / District */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium truncate pt-0.5">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">
              {district}{country && country.toLowerCase() !== 'sri lanka' ? ` (${country})` : ''}
            </span>
          </div>

          {/* Profession / Role */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium truncate pb-1">
            <Briefcase size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">{profession}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile(profile);
          }}
          className="w-full py-2 px-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors text-center cursor-pointer"
        >
          View Details
        </button>
        {isInterestSent ? (
          <button
            type="button"
            disabled
            className="w-full py-2 px-2.5 rounded-xl font-bold text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-center flex items-center justify-center gap-1 cursor-default select-none"
          >
            <Check size={13} className="text-emerald-500" />
            <span>Sent ✓</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSendInterest(profile);
            }}
            className="w-full py-2 px-2.5 rounded-xl font-bold text-xs bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/20 transition-all text-center cursor-pointer"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
