import { MapPin, Briefcase, Lock, User as UserIcon } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';
import UnifiedTrustPill from '../verification/UnifiedTrustPill';

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
}

interface ProposalSearchResultCardProps {
  profile: CandidateProfile;
  layoutMode?: 'grid' | 'compact';
  onSendInterest: (profile: CandidateProfile) => void;
  onViewProfile: (profile: CandidateProfile) => void;
}

export default function ProposalSearchResultCard({
  profile,
  onSendInterest,
  onViewProfile,
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
    blurPhoto = false,
    isVerified = true,
    religion = 'Buddhist',
    country = 'Sri Lanka',
    categoryBadge
  } = profile;

  const displayImage = images?.[0];
  const isFemale = gender?.toLowerCase() === 'female' || code.startsWith('BR');

  // Universal Persona / Badge calculation
  const getBadge = () => {
    if (categoryBadge) return categoryBadge;
    if (country && country.toLowerCase() !== 'sri lanka') return 'Working Professional 💼 / Abroad ✈️';
    if (profession?.toLowerCase().includes('student') || profession?.toLowerCase().includes('undergrad')) return 'Campus Undergrad 🏛️';
    if (profession?.toLowerCase().includes('doctor') || profession?.toLowerCase().includes('engineer') || profession?.toLowerCase().includes('lecturer')) return 'Campus Graduate 🎓';
    return 'Higher Edu Verified 📜';
  };

  return (
    <div
      onClick={() => onViewProfile(profile)}
      className={`group relative rounded-3xl p-3 flex flex-col justify-between transition-all duration-300 border cursor-pointer font-sans shadow-sm hover:shadow-xl hover:-translate-y-1 ${
        isDark
          ? 'bg-slate-900 border-slate-800 hover:border-rose-500/50'
          : 'bg-white border-slate-200/90 hover:border-rose-300 shadow-slate-100'
      }`}
    >
      <div>
        {/* Portrait Image Container */}
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 border border-slate-200/40 dark:border-slate-800">
          {/* Unified Trust Pill on top of image */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <UnifiedTrustPill 
              isVerified={isVerified}
              categoryBadge={getBadge()}
              instituteOrCompany={profession || district}
            />
          </div>
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
              <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-200 font-extrabold text-[10px] tracking-wide px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center gap-1">
                <ShieldCheck size={13} className="text-blue-500" />
                <span>{getBadge()}</span>
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
      </div>
    </div>
  );
}
