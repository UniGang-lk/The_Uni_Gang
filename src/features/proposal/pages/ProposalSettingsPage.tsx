import { useState, useEffect } from 'react';
import { ChevronLeft, ShieldCheck, Crown, Lock, EyeOff, Clock } from 'lucide-react';
import { Card } from '../components/ui/ProposalPrimitives';
import { proposalApi } from '../api/proposalApi';
import toast from 'react-hot-toast';

interface ProposalSettingsPageProps {
  setPage: (p: string) => void;
  onDeleteProposalProfile?: () => void;
}

export default function ProposalSettingsPage({ setPage, onDeleteProposalProfile }: ProposalSettingsPageProps) {
  const [profile, setProfile] = useState<any>(null);
  const [isPhotoBlurred, setIsPhotoBlurred] = useState(true);
  const [isProfilePaused, setIsProfilePaused] = useState(false);
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    proposalApi.getMyProfile().then(res => {
      if (res.success && res.profile) {
        setProfile(res.profile);
        setIsPhotoBlurred(res.profile.blur_photo ?? res.profile.blurPhoto ?? true);
        setIsProfilePaused(res.profile.is_paused ?? res.profile.isPaused ?? false);
        setIsGhostMode(res.profile.is_ghost_mode ?? res.profile.isGhostMode ?? false);
      }
    });
  }, []);

  const handleDeleteAccount = async () => {
    try {
      await proposalApi.deleteProfile();
      toast.success("Proposal account permanently purged!");
    } catch (e) {
      console.warn("Could not call backend delete, cleaning locally", e);
    }
    localStorage.removeItem('userHasProposalProfile');
    localStorage.removeItem('userProposalProfile');
    localStorage.removeItem('sentProposalInterestIds');
    setShowDeleteModal(false);
    if (onDeleteProposalProfile) {
      onDeleteProposalProfile();
    } else {
      setPage('landing');
    }
  };

  const handleTogglePhotoBlur = async () => {
    const next = !isPhotoBlurred;
    setIsPhotoBlurred(next);
    try {
      const saved = localStorage.getItem('userProposalProfile');
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.blurPhoto = next;
        parsed.blur_photo = next;
        localStorage.setItem('userProposalProfile', JSON.stringify(parsed));
      }
      await proposalApi.togglePhotoBlur();
      toast.success(next ? "Photos Blurred for unverified viewers!" : "Photo Blur removed. Visible to all members.");
    } catch (e) {
      console.warn("Toggle photo blur API failed, kept local state", e);
    }
  };

  const handleTogglePause = async () => {
    const next = !isProfilePaused;
    setIsProfilePaused(next);
    try {
      const saved = localStorage.getItem('userProposalProfile');
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.isPaused = next;
        parsed.is_paused = next;
        localStorage.setItem('userProposalProfile', JSON.stringify(parsed));
      }
      await proposalApi.togglePauseProfile();
      toast.success(next ? "Profile Paused! Hidden from search matches." : "Profile Activated & Visible in search matches!");
    } catch (e) {
      console.warn("Toggle pause API call failed, kept local state", e);
    }
  };

  const isVip = 
    profile?.membership_tier === 'vip' || 
    profile?.is_vip || 
    profile?.isVIP ||
    localStorage.getItem('userProposalPlan') === 'vip' ||
    localStorage.getItem('userIsProposalVIP') === 'true' ||
    localStorage.getItem('userRole') === 'admin';

  const handleToggleGhostMode = async () => {
    if (!isVip) {
      toast.error("🕶️ Ghost / Incognito Mode is an exclusive VIP feature! Upgrade to VIP to browse 100% invisibly.", {
        icon: '👑'
      });
      setPage('premium');
      return;
    }

    const next = !isGhostMode;
    setIsGhostMode(next);
    try {
      const saved = localStorage.getItem('userProposalProfile');
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.isGhostMode = next;
        parsed.is_ghost_mode = next;
        localStorage.setItem('userProposalProfile', JSON.stringify(parsed));
      }
      await proposalApi.toggleGhostMode();
      toast.success(
        next
          ? "🕶️ Incognito Ghost Mode ON! You can browse candidate profiles 100% invisibly without leaving a footprint."
          : "👁️ Ghost Mode OFF. Profile visits will be visible to members."
      );
    } catch (e) {
      console.warn("Toggle ghost mode API failed, kept local state", e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-80px)] font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setPage('dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <ChevronLeft size={24} className="text-slate-700 dark:text-slate-300" />
        </button>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Settings & Account Privacy</h1>
      </div>

      <div className="space-y-8">
        
        {/* 1. Official National ID (NIC) Verification Status Card */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-white dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 border-blue-200/60 dark:border-blue-900/40 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl grid place-items-center shrink-0 ${
                profile?.verification_status === 'verified' || profile?.verificationStatus === 'verified'
                  ? 'bg-emerald-500/15 text-emerald-500 ring-2 ring-emerald-500/20'
                  : profile?.verification_status === 'pending_review' || profile?.verificationStatus === 'pending_review'
                    ? 'bg-amber-500/15 text-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}>
                {profile?.verification_status === 'verified' || profile?.verificationStatus === 'verified' ? (
                  <ShieldCheck size={26} />
                ) : profile?.verification_status === 'pending_review' || profile?.verificationStatus === 'pending_review' ? (
                  <Clock size={24} />
                ) : (
                  <Lock size={24} />
                )}
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>ජාතික හැඳුනුම්පත් (NIC) සත්‍යාපනය</span>
                  {profile?.verification_status === 'verified' || profile?.verificationStatus === 'verified' ? (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      ID Verified ✓
                    </span>
                  ) : profile?.verification_status === 'pending_review' || profile?.verificationStatus === 'pending_review' ? (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      Review Pending ⏳
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Not Verified
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Government NIC Identity Verification & Trust Badge
                </p>
              </div>
            </div>

            {profile?.verification_status !== 'verified' && profile?.verificationStatus !== 'verified' && (
              <button
                type="button"
                onClick={() => setPage('dashboard')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-blue-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center gap-2"
              >
                <ShieldCheck size={14} />
                <span>හැඳුනුම්පත Submit කරන්න</span>
              </button>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5">
            <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <span className="text-blue-500 font-bold shrink-0">✓</span>
              <span><strong>විශ්වසනීයත්වය:</strong> හැඳුනුම්පත තහවුරු කළ සාමාජිකයින්ට Profile එක වටා Blue Verified Shield එක වැටෙන අතර අනෙක් සාමාජිකයින්ගෙන් 4x ගුණයක ප්‍රතිචාර ලැබේ.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <span className="text-blue-500 font-bold shrink-0">✓</span>
              <span><strong>100% රහස්‍යතාව:</strong> ඔබගේ NIC ඡායාරූප Admin නිලධාරීන්ගේ සත්‍යාපනයට පමණක් යොදාගන්නා අතර, කිසිදු තෙවන පාර්ශවයකට හෝ වෙනත් සාමාජිකයෙකුට නොපෙනේ.</span>
            </div>
          </div>
        </Card>

        {/* 2. Matrimonial Anti-Stalking & Contact Privacy Guard Card */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900 border-emerald-200/60 dark:border-emerald-900/40 shadow-sm">
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 grid place-items-center shrink-0">
              <Lock size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                සම්බන්ධතා සහ පෞද්ගලිකත්ව ආරක්ෂණ රීති (Privacy Shield)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Anti-Stalking & Contact Number Safeguards
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                <span>🚫 Social Media Links Blocked</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                ෆේස්බුක්, ඉන්ස්ටග්‍රෑම් හෝ ලින්ක්ඩ්ඉන් සබැඳි කිසිවක් පොදු ප්‍රොෆයිලයේ හෝ චැට් තුළ ප්‍රදර්ශනය නොවේ.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                <span>📞 Phone / WhatsApp Masked</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                දුරකථන අංක හුවමාරු වන්නේ දෙපාර්ශවයම අන්‍යෝන්‍ය වශයෙන් Proposal එකක් Accept කළහොත් පමණි.
              </p>
            </div>
          </div>
        </Card>

        {/* Subscription Plan */}
        <Card className="p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                Subscription 
                {profile?.membership_tier === 'vip' || profile?.is_vip ? (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-black">👑 VIP Member Active</span>
                ) : profile?.membership_tier === 'classic' || profile?.is_classic ? (
                  <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-black">⭐ Classic Member Active</span>
                ) : (
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-black">Free Access Active</span>
                )}
              </h2>
              <p className="text-sm text-slate-500 max-w-sm mt-2">Your profile is active with proposal matching and messaging.</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-500 grid place-items-center">
              <Crown size={24} />
            </div>
          </div>
          <button onClick={() => setPage('premium')} className="mt-6 text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer">View Membership Plans &rarr;</button>
        </Card>

        {/* Privacy & Account Control */}
        <Card className="p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Privacy & Profile Controls</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2"><Lock size={16} className="text-slate-400" /> Blur my photos</p>
                <p className="text-xs text-slate-500 mt-1">Your photos will be blurred to unverified users for privacy.</p>
              </div>
              <button 
                type="button"
                onClick={handleTogglePhotoBlur}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 cursor-pointer ${
                  isPhotoBlurred ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isPhotoBlurred ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2"><EyeOff size={16} className="text-slate-400" /> Pause my profile (Temporarily Hide)</p>
                <p className="text-xs text-slate-500 mt-1">Hide your profile from Search Matches when you are talking to someone. Your account remains saved.</p>
              </div>
              <button 
                type="button"
                onClick={handleTogglePause}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 cursor-pointer ${
                  isProfilePaused ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isProfilePaused ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>

            {/* 🕶️ VIP Exclusive Ghost / Incognito Mode Toggle */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>🕶️ VIP Ghost / Incognito Mode</span>
                  </p>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center gap-1">
                    <Crown size={11} /> VIP Exclusive
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                  අනෙකුත් profiles 100% රහසිගතව නරඹන්න. ඔබගේ නම හෝ පැමිණීම "Who Viewed My Profile" list එකට කිසිදා ඇතුළත් නොවේ.
                </p>
              </div>
              
              {isVip ? (
                <button 
                  type="button"
                  onClick={handleToggleGhostMode}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 cursor-pointer shrink-0 ${
                    isGhostMode ? 'bg-amber-500 shadow-md shadow-amber-500/30' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  title={isGhostMode ? "Ghost Mode Active: 100% Invisible" : "Ghost Mode Inactive: Visible"}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    isGhostMode ? 'right-1' : 'left-1'
                  }`} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    toast.error("🕶️ Ghost Mode requires VIP Premium Membership! Upgrade to browse anonymously.", { icon: '👑' });
                    setPage('premium');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white font-bold text-xs uppercase tracking-wider shrink-0 flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  <Crown size={12} /> Unlock VIP
                </button>
              )}
            </div>
            
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400">Delete Proposal Account</p>
                <p className="text-xs text-slate-500 mt-0.5">Permanently purge your matrimonial profile, code (BR000158), photos, and matches. Your Main Uni Gang account will stay intact.</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-black hover:bg-rose-500 hover:text-white transition-all cursor-pointer shrink-0"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </Card>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <EyeOff size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Proposal Account එක ඉවත් කරන්නද?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                ඔබට සාර්ථකව Proposal එකක් සෙට් වූ පසු හෝ ඕනෑම අවස්ථාවක ඔබේ Proposal Profile එක (`BR000158`) පද්ධතියෙන් සම්පූර්ණයෙන්ම ඉවත් කළ හැක. ඔබගේ Main User Account එක ආරක්ෂිතව පවතිනු ඇත.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                කැන්සල් කරන්න
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="w-full py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-md shadow-rose-500/20 cursor-pointer"
              >
                ඔව්, ඉවත් කරන්න
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
