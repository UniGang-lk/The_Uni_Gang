import { useState, useEffect } from 'react';

import { ChevronLeft, ShieldCheck, Mail, Link as LinkIcon, Smartphone, MessageCircle, Crown, Lock, EyeOff } from 'lucide-react';
import { PrimaryButton, Card, cx } from '../components/ui/ProposalPrimitives';
import { proposalApi } from '../api/proposalApi';
import toast from 'react-hot-toast';

interface ProposalSettingsPageProps {
  setPage: (p: string) => void;
  onDeleteProposalProfile?: () => void;
}

export default function ProposalSettingsPage({ setPage, onDeleteProposalProfile }: ProposalSettingsPageProps) {
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'linkedin' | 'id' | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isPhotoBlurred, setIsPhotoBlurred] = useState(true);
  const [isProfilePaused, setIsProfilePaused] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    proposalApi.getMyProfile().then(res => {
      if (res.success) setProfile(res.profile);
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
    setShowDeleteModal(false);
    if (onDeleteProposalProfile) {
      onDeleteProposalProfile();
    } else {
      setPage('landing');
    }
  };

  const handleTogglePause = async () => {
    const next = !isProfilePaused;
    setIsProfilePaused(next);
    try {
      await proposalApi.togglePauseProfile();
      toast.success(next ? "Profile Paused! Hidden from search matches." : "Profile Activated!");
    } catch (e) {
      console.warn("Toggle pause API call failed, kept local state", e);
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
        
        {/* Verification Status Card */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-100 dark:border-blue-900/30">
          <div className="flex items-start sm:items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 grid place-items-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Verification Status</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Verify your account to get the Gold Badge and increase your trust score.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Choose Verification Method</h3>
            
            <button 
              onClick={() => setVerificationMethod('email')}
              className={cx(
                "w-full flex items-center justify-between p-4 rounded-2xl border transition-colors cursor-pointer",
                verificationMethod === 'email' ? "bg-white dark:bg-slate-800 border-blue-500 ring-1 ring-blue-500" : "bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-blue-300"
              )}
            >
              <div className="flex items-center gap-3">
                <Mail className="text-blue-500" size={20} />
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">University Email</p>
                  <p className="text-xs text-slate-500">Fastest method if you have a .ac.lk email</p>
                </div>
              </div>
              <div className={cx("w-4 h-4 rounded-full border-2", verificationMethod === 'email' ? "border-blue-500 bg-blue-500" : "border-slate-300")} />
            </button>

            <button 
              onClick={() => setVerificationMethod('id')}
              className={cx(
                "w-full flex items-center justify-between p-4 rounded-2xl border transition-colors cursor-pointer",
                verificationMethod === 'id' ? "bg-white dark:bg-slate-800 border-blue-500 ring-1 ring-blue-500" : "bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-blue-300"
              )}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="text-blue-500" size={20} />
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {profile?.education_category === 'University' ? 'Upload Campus ID / Degree' : 'Upload NIC / Driving License'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {profile?.education_category === 'University' ? 'Upload a photo of your Student ID or Degree' : 'Upload a photo of your Official ID'}
                  </p>
                </div>
              </div>
              <div className={cx("w-4 h-4 rounded-full border-2", verificationMethod === 'id' ? "border-blue-500 bg-blue-500" : "border-slate-300")} />
            </button>

            <button 
              onClick={() => setVerificationMethod('linkedin')}
              className={cx(
                "w-full flex items-center justify-between p-4 rounded-2xl border transition-colors cursor-pointer",
                verificationMethod === 'linkedin' ? "bg-white dark:bg-slate-800 border-blue-500 ring-1 ring-blue-500" : "bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-blue-300"
              )}
            >
              <div className="flex items-center gap-3">
                <LinkIcon className="text-blue-600" size={20} />
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Social Media Link</p>
                  <p className="text-xs text-slate-500">For passed out alumni without Uni emails</p>
                </div>
              </div>
              <div className={cx("w-4 h-4 rounded-full border-2", verificationMethod === 'linkedin' ? "border-blue-500 bg-blue-500" : "border-slate-300")} />
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <PrimaryButton className="w-full sm:w-auto cursor-pointer" disabled={!verificationMethod}>Submit for Verification</PrimaryButton>
            <a href="#" className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              <MessageCircle size={16} /> Need help? WhatsApp Us
            </a>
          </div>
        </Card>

        {/* Subscription Plan */}
        <Card className="p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">Subscription <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-black">Free Access Active</span></h2>
              <p className="text-sm text-slate-500 max-w-sm mt-2">Your profile is active with free proposal matching and messaging.</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-500 grid place-items-center">
              <Crown size={24} />
            </div>
          </div>
          <button onClick={() => setPage('premium')} className="mt-6 text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer">Upgrade to VIP Pass &rarr;</button>
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
                onClick={() => setIsPhotoBlurred(!isPhotoBlurred)}
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
