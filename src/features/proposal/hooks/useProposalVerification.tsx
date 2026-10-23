import { useState, useCallback } from 'react';
import { ShieldCheck, X, Crown, Sparkles } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import toast from 'react-hot-toast';

export type ProposalMembershipTier = 'free' | 'classic' | 'vip';

export interface UseProposalVerificationReturn {
  isVerified: boolean;
  hasProfile: boolean;
  isPremium: boolean;
  membershipPlan: ProposalMembershipTier;
  monthlyProposalsSent: number;
  showVerificationModal: boolean;
  setShowVerificationModal: (val: boolean) => void;
  showProposalLimitModal: boolean;
  setShowProposalLimitModal: (val: boolean) => void;
  checkCanConnect: (onNeedProfile?: () => void, onNeedUpgrade?: () => void) => boolean;
  recordProposalSent: () => void;
  VerificationModal: React.FC<{ onVerifyNow?: () => void }>;
  ProposalLimitModal: React.FC<{ onUpgrade?: () => void }>;
}

export function useProposalVerification(): UseProposalVerificationReturn {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showProposalLimitModal, setShowProposalLimitModal] = useState(false);

  const getHasProfile = useCallback((): boolean => {
    try {
      return (
        localStorage.getItem('userHasProposalProfile') === 'true' ||
        localStorage.getItem('userProposalProfile') !== null
      );
    } catch {
      return false;
    }
  }, []);

  const getIsVerified = useCallback((): boolean => {
    try {
      const savedProfile = localStorage.getItem('userProposalProfile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed && typeof parsed === 'object' && (parsed.isVerified || parsed.is_nic_verified || parsed.verificationStatus === 'verified' || parsed.verification_status === 'verified')) {
          return true;
        }
      }
      return (
        localStorage.getItem('userIsVerified') === 'true' ||
        localStorage.getItem('userHasProposalVerified') === 'true'
      );
    } catch {
      return false;
    }
  }, []);

  const getMembershipPlan = useCallback((): ProposalMembershipTier => {
    try {
      const explicitPlan = localStorage.getItem('userProposalPlan');
      if (explicitPlan === 'vip' || localStorage.getItem('userIsProposalVIP') === 'true' || localStorage.getItem('userRole') === 'admin') {
        return 'vip';
      }
      if (explicitPlan === 'classic' || localStorage.getItem('userIsProposalPremium') === 'true') {
        return 'classic';
      }
      return 'free';
    } catch {
      return 'free';
    }
  }, []);

  const getIsPremium = useCallback((): boolean => {
    return getMembershipPlan() !== 'free';
  }, [getMembershipPlan]);

  const getMonthlyStorageKey = (): string => {
    const now = new Date();
    return `proposal_monthly_sends_${now.getFullYear()}_${now.getMonth() + 1}`;
  };

  const getMonthlyProposalsSent = useCallback((): number => {
    try {
      const stored = localStorage.getItem(getMonthlyStorageKey());
      return stored ? parseInt(stored, 10) || 0 : 0;
    } catch {
      return 0;
    }
  }, []);

  const recordProposalSent = useCallback((): void => {
    try {
      const current = getMonthlyProposalsSent();
      localStorage.setItem(getMonthlyStorageKey(), String(current + 1));
    } catch (e) {
      console.warn("Could not save proposal send quota:", e);
    }
  }, [getMonthlyProposalsSent]);

  const checkCanConnect = useCallback((onNeedProfile?: () => void, onNeedUpgrade?: () => void): boolean => {
    // 1. Must have a bio-data profile
    if (!getHasProfile()) {
      toast.error("කරුණාකර පළමුව ලියාපදිංචි වී ඔබගේ Bio-Data සාදන්න!");
      if (onNeedProfile) onNeedProfile();
      return false;
    }

    // 2. Must be verified
    if (!getIsVerified()) {
      setShowVerificationModal(true);
      return false;
    }

    // 3. Free Plan Monthly Limit (3 proposals/month)
    if (!getIsPremium()) {
      const sentCount = getMonthlyProposalsSent();
      if (sentCount >= 3) {
        setShowProposalLimitModal(true);
        if (onNeedUpgrade) onNeedUpgrade();
        return false;
      }
    }

    return true;
  }, [getHasProfile, getIsVerified, getIsPremium, getMonthlyProposalsSent]);

  const VerificationModal: React.FC<{ onVerifyNow?: () => void }> = ({ onVerifyNow }) => {
    if (!showVerificationModal) return null;

    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
        <div
          className={`p-6 sm:p-8 rounded-3xl max-w-md w-full border shadow-2xl text-center relative ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <button
            onClick={() => setShowVerificationModal(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full cursor-pointer transition-colors"
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-md">
            <ShieldCheck size={36} />
          </div>

          <h3 className="text-xl font-black mb-2">Identity Verification Required!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed font-sinhala">
            ලංකාවේ ආරක්ෂිතම Matchmaking Platform එක විදියට, අනිත් සාමාජිකයින්ට Proposal Requests යැවීමට හෝ සම්බන්ධ වීමට පෙර කරුණාකර ඔබගේ <strong>NIC හෝ Passport</strong> එක Upload කර Verify කරගන්න.
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mb-6 bg-emerald-50 dark:bg-emerald-950/40 py-2 px-3 rounded-xl border border-emerald-500/20">
            🛡️ Verified Candidates ලාට 3x ගුණයකින් වැඩි ඉක්මන් ප්‍රතිචාර ලැබේ!
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowVerificationModal(false)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                isDark
                  ? 'border-slate-800 bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              පසුව කරන්නම්
            </button>
            <button
              type="button"
              onClick={() => {
                setShowVerificationModal(false);
                if (onVerifyNow) onVerifyNow();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5 cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <ShieldCheck size={14} />
              <span>Verify NIC Now</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProposalLimitModal: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
    if (!showProposalLimitModal) return null;

    return (
      <div className="fixed inset-0 z-[125] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
        <div
          className={`p-6 sm:p-8 rounded-3xl max-w-md w-full border shadow-2xl text-center relative ${
            isDark ? 'bg-slate-900 border-amber-500/30 text-white' : 'bg-white border-amber-300 text-slate-900'
          }`}
        >
          <button
            onClick={() => setShowProposalLimitModal(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full cursor-pointer transition-colors"
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/30 shadow-lg shadow-amber-500/10">
            <Crown size={34} />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block mb-2">
            Monthly Proposal Quota (3/3) Reached
          </span>

          <h3 className="text-xl font-black mb-2">මාසික නොමිලේ සීමාව ඉක්මවා ඇත!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed font-sinhala">
            Basic (Free) Plan එක යටතේ මසකට හිමි නොමිලේ <strong>Proposals 3 සීමාව</strong> ඔබ සම්පූර්ණ කර ඇත. සීමාවකින් තොරව (Unlimited) ඕනෑම අයෙකුට Proposals යැවීමට සහ චැට් කිරීමට කරුණාකර <strong>Classic Plan</strong> එකට Upgrade වන්න.
          </p>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6 text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-400">Classic Plan (මාස 3)</span>
              <span className="text-xs font-black text-white">රු. 2,990</span>
            </div>
            <p className="text-[11px] text-slate-400">~ රු. 997 / මසකට • Unlimited Proposals & In-App Chat</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowProposalLimitModal(false)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                isDark
                  ? 'border-slate-800 bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                setShowProposalLimitModal(false);
                if (onUpgrade) onUpgrade();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5 cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <Crown size={14} />
              <span>Upgrade to Classic</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return {
    isVerified: getIsVerified(),
    hasProfile: getHasProfile(),
    isPremium: getIsPremium(),
    membershipPlan: getMembershipPlan(),
    monthlyProposalsSent: getMonthlyProposalsSent(),
    showVerificationModal,
    setShowVerificationModal,
    showProposalLimitModal,
    setShowProposalLimitModal,
    checkCanConnect,
    recordProposalSent,
    VerificationModal,
    ProposalLimitModal
  };
}
