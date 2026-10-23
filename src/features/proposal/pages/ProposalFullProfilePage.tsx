import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Heart, 
  MessageCircle, 
  MapPin, 
  GraduationCap, 
  ShieldCheck, 
  Lock, 
  Check, 
  User2, 
  Users, 
  Info, 
  Globe,
  Sparkles,
  Camera,
  Crown,
  X,
  Moon,
  FileText,
  Eye,
  Bookmark,
  Star
} from 'lucide-react';
import { cx, PrimaryButton } from '../components/ui/ProposalPrimitives';
import { WatermarkOverlay } from '../components/privacy/WatermarkOverlay';
import toast from 'react-hot-toast';
import { proposalApi } from '../api/proposalApi';
import { useTheme } from '../../../context/ThemeContext';
import { useProposalVerification } from '../hooks/useProposalVerification';

export default function ProposalFullProfilePage({ 
  profile, 
  goBack, 
  onSendProposal,
  onVerifyNow,
  onRegisterNow
}: { 
  profile: any;
  goBack: () => void;
  onSendProposal?: () => void;
  onVerifyNow?: () => void;
  onRegisterNow?: () => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const hasProfile = Boolean(
    localStorage.getItem('userHasProposalProfile') === 'true' || 
    localStorage.getItem('userProposalProfile')
  );
  const [showRegisterPromptModal, setShowRegisterPromptModal] = useState(false);

  const [proposalSent, setProposalSent] = useState(() => {
    try {
      const sentIds: string[] = JSON.parse(localStorage.getItem('sentProposalInterestIds') || '[]');
      return sentIds.includes(String(profile?.id));
    } catch {
      return false;
    }
  });

  const { checkCanConnect, recordProposalSent, VerificationModal, ProposalLimitModal, membershipPlan, setShowProposalLimitModal } = useProposalVerification();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showHoroscopeModal, setShowHoroscopeModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [isShortlisted, setIsShortlisted] = useState(() => {
    try {
      const list = JSON.parse(localStorage.getItem('proposal_shortlists') || '[]');
      return list.some((item: any) => String(item.id) === String(profile?.id));
    } catch {
      return false;
    }
  });

  const [familyNote, setFamilyNote] = useState(() => {
    try {
      const list = JSON.parse(localStorage.getItem('proposal_shortlists') || '[]');
      const found = list.find((item: any) => String(item.id) === String(profile?.id));
      return found?.note || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 1. Record profile view (Backend handles VIP Ghost mode stealth automatically)
    if (profile?.id || profile?.user_id) {
      proposalApi.recordProfileView(profile.id || profile.user_id);
    }

    // 2. Cross-Device Shortlist sync
    proposalApi.getShortlists().then(res => {
      if (res?.success && Array.isArray(res.shortlists)) {
        const found = res.shortlists.find((item: any) => 
          String(item.candidate_id) === String(profile?.id) || 
          String(item.candidate?.id) === String(profile?.id)
        );
        if (found) {
          setIsShortlisted(true);
          if (found.family_notes) setFamilyNote(found.family_notes);
        }
      }
    }).catch(err => console.warn('Shortlist sync error:', err));
  }, [profile?.id, profile?.user_id]);

  const handleToggleShortlist = () => {
    if (membershipPlan === 'free') {
      setShowProposalLimitModal(true);
      return;
    }

    try {
      const list = JSON.parse(localStorage.getItem('proposal_shortlists') || '[]');
      if (isShortlisted) {
        const updated = list.filter((item: any) => String(item.id) !== String(profile.id));
        localStorage.setItem('proposal_shortlists', JSON.stringify(updated));
        setIsShortlisted(false);
        proposalApi.removeShortlist(profile.id).catch(err => console.warn('Remove shortlist backend fallback', err));
        toast.success("Removed from shortlist.");
      } else {
        if (membershipPlan === 'classic' && list.length >= 25) {
          toast.error("Classic plan allows up to 25 shortlists. Upgrade to VIP for unlimited! 👑");
          return;
        }
        setShowNotesModal(true);
      }
    } catch {
      // ignore
    }
  };

  const handleSaveFamilyNote = () => {
    try {
      const list = JSON.parse(localStorage.getItem('proposal_shortlists') || '[]');
      const filtered = list.filter((item: any) => String(item.id) !== String(profile.id));
      const updated = [...filtered, { id: profile.id, code: profile.code, name: profile.name, note: familyNote, savedAt: new Date().toISOString() }];
      localStorage.setItem('proposal_shortlists', JSON.stringify(updated));
      setIsShortlisted(true);
      setShowNotesModal(false);
      proposalApi.saveShortlist(profile.id, familyNote).catch(err => console.warn('Save shortlist backend fallback', err));
      toast.success("Profile saved to Shortlist with Family Note! 📑");
    } catch {
      // ignore
    }
  };

  const handleConnectClick = () => {
    if (!hasProfile) {
      setShowRegisterPromptModal(true);
      return;
    }
    if (!checkCanConnect(onVerifyNow)) return;
    setShowConfirmModal(true);
  };

  const handleConfirmProposal = async () => {
    setProposalSent(true);
    setShowConfirmModal(false);
    recordProposalSent();
    try {
      await proposalApi.swipe(String(profile.id || profile.code), 'like');
    } catch {
      // smooth fallback
    }
    try {
      const sentIds: string[] = JSON.parse(localStorage.getItem('sentProposalInterestIds') || '[]');
      if (!sentIds.includes(String(profile.id))) {
        localStorage.setItem('sentProposalInterestIds', JSON.stringify([...sentIds, String(profile.id)]));
      }
    } catch {
      // ignore
    }
    toast.success(`Proposal Request sent to ${profile.name || 'Candidate'}! 💕`);
    if (onSendProposal) onSendProposal();
  };

  if (!profile) return null;

  // Gender-aware photo fallback (ensures male profiles never show female stock photos)
  const isMaleCandidate = profile?.gender?.toLowerCase() === 'male' || String(profile?.code || '').startsWith('GR');
  const malePlaceholders = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ];
  const femalePlaceholders = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ];
  const relevantPlaceholders = isMaleCandidate ? malePlaceholders : femalePlaceholders;

  const validProfileImages = Array.isArray(profile.images) ? profile.images.filter(Boolean) : [];
  const allImages = (
    validProfileImages.length >= 3 
      ? validProfileImages 
      : [...validProfileImages, ...relevantPlaceholders]
  ).slice(0, 3);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="w-full max-w-6xl mx-auto min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 flex flex-col relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 my-4 font-sans"
    >
      {/* Top Header inside Profile Card */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 font-sans">
        <button 
          onClick={goBack}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-sm font-sans flex-wrap">
          <span>{profile.name}</span>
          <span className="text-xs font-black text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
            {profile.code || 'BR000158'}
          </span>
          {profile.isVerified && <ShieldCheck size={16} className="text-blue-500" />}
          {Boolean(profile.matchPercentage && profile.matchPercentage > 0) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
              <Sparkles size={12} className="text-emerald-500" />
              <span>{profile.matchPercentage}% Match</span>
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {membershipPlan === 'vip' && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-amber-400/40 text-amber-300 text-[11px] font-bold shadow-xs">
              <span>🕶️ Ghost Mode Active</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleToggleShortlist}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isShortlisted
                ? 'bg-amber-500/15 text-amber-500 border-amber-500/30 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Bookmark size={14} fill={isShortlisted ? "currentColor" : "none"} />
            <span>{isShortlisted ? 'Shortlisted' : 'Shortlist & Notes'}</span>
          </button>
        </div>
      </div>

      {/* GUEST PREVIEW MODE NOTICE BANNER */}
      {!hasProfile && (
        <div className="bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-amber-500/10 border-b border-rose-500/20 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <div className="w-8 h-8 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                ඔබ අමුත්තෙකු ලෙස මෙම Profile එක නරඹමින් සිටී (Guest Preview Mode)
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sinhala">
                මෙම යෝජනාවට Proposal Request එකක් යැවීමට හෝ In-App Chat සඳහා ඔබගේ නොමිලේ Bio-Data එක සකසා ගන්න.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRegisterNow}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shrink-0 shadow-md shadow-rose-500/20 cursor-pointer transition-all hover:scale-105"
          >
            නොමිලේ Bio-Data සාදන්න 💍
          </button>
        </div>
      )}

      {/* Main 2-Column Balanced Dashboard Layout */}
      <div className="flex-1 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">

        {/* ── LEFT COLUMN (4 Cols): Compact Photo Showcase + Candidate Highlights ── */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Compact Photo Card & Interactive Selector */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 border border-slate-200 dark:border-slate-800 shadow-lg relative">
            
            {/* Featured Compact Photo Box (Fixed Height ~260px) */}
            <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800 group">
              <WatermarkOverlay text={`ID: ${profile.code || 'BR000158'}`}>
                <img 
                  src={allImages[selectedImageIndex]} 
                  alt={profile.name} 
                  className={cx(
                    "w-full h-full object-cover transition-all duration-500", 
                    Boolean(profile.blurPhoto ?? profile.blur_photo) && "blur-2xl scale-110"
                  )}
                />
              </WatermarkOverlay>

              {Boolean(profile.blurPhoto ?? profile.blur_photo) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 text-center pointer-events-none z-20">
                  <div className="w-10 h-10 rounded-full bg-slate-900/90 text-rose-400 border border-white/20 flex items-center justify-center mb-1.5 shadow-lg">
                    <Lock size={18} />
                  </div>
                  <span className="text-white text-xs font-black px-3 py-1 rounded-full bg-slate-900/90 border border-white/20 shadow-md">
                    🔒 Photo Blurred for Privacy
                  </span>
                  <p className="text-[10px] text-slate-300 mt-1 max-w-[220px]">
                    දෙපාර්ශවයම Proposal Accept කළ පසු ඡායාරූප ස්වයංක්‍රීයව Unblur වේ.
                  </p>
                </div>
              )}
            </div>

            {/* 3 Photos Thumbnail Switcher Row */}
            <div className="flex items-center justify-center gap-3 mt-3">
              {allImages.map((imgUrl: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={cx(
                    "relative w-16 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 shadow-sm",
                    selectedImageIndex === idx
                      ? "border-rose-500 ring-2 ring-rose-500/30 scale-105"
                      : "border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
                  )}
                >
                  <img 
                    src={imgUrl} 
                    alt={`Thumbnail ${idx + 1}`} 
                    className={cx("w-full h-full object-cover", Boolean(profile.blurPhoto ?? profile.blur_photo) && "blur-sm")} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Key Quick Info Badge Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  {profile.name}
                  {profile.isVIP ? (
                    <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-yellow-200/90 shadow-sm inline-flex items-center gap-1 font-sans">
                      <Crown size={11} className="fill-slate-950 text-slate-950 shrink-0" /> VIP
                    </span>
                  ) : profile.isClassic ? (
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-blue-400/50 shadow-sm inline-flex items-center gap-1 font-sans">
                      <Star size={11} className="fill-white text-white shrink-0" /> CLASSIC
                    </span>
                  ) : null}
                </h1>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  {profile.code || 'BR000158'} • Age {profile.age || 31} Years
                </p>
              </div>
              <div className="bg-rose-500/10 text-rose-500 border border-rose-500/20 font-black text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                <Heart size={14} fill="currentColor" /> {profile.matchPercentage || 95}% Match
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold font-sans pt-1">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">District</span>
                <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1"><MapPin size={12} className="text-emerald-500" /> {profile.district || 'Colombo'}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Profession</span>
                <span className="text-slate-800 dark:text-slate-200 truncate block">{profile.profession || 'Lecturer'}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Status</span>
                <span className="text-slate-800 dark:text-slate-200 truncate block">{profile.civilStatus || 'Never Married'}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Religion</span>
                <span className="text-slate-800 dark:text-slate-200 truncate block">{profile.religion || 'Buddhist'}</span>
              </div>
            </div>

            {/* Action Buttons: Send Proposal Request */}
            <div className="pt-2">
              <AnimatePresence mode="wait">
                {!proposalSent ? (
                  <PrimaryButton onClick={handleConnectClick} icon={MessageCircle} className="w-full py-3.5 text-xs shadow-xl shadow-rose-500/20 font-bold">
                    Send Proposal Request
                  </PrimaryButton>
                ) : (
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold">
                    <Check size={16} /> Proposal Sent!
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN (7 Cols): Structured Categorized Details ── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Privacy Alert Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 flex items-start gap-3 text-xs font-medium leading-relaxed shadow-sm">
            <Lock size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5 text-amber-800 dark:text-amber-200">
                Privacy Protection Notice
              </span>
              Full name, contact details, birthday and exact address are protected and revealed only after mutual proposal acceptance.
            </div>
          </div>

          {/* 1. ABOUT & PARTNER PREFERENCE (අපේක්ෂා) */}
          <div className="space-y-3 font-sans">
            <h2 className="text-xs font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
              <User2 size={16} /> About Candidate & Partner Expectations
            </h2>

            {/* About Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <p className="font-bold text-slate-900 dark:text-white mb-1">About Candidate:</p>
              {profile.prompt_about_me || profile.bio || `Educated university graduate currently residing in ${profile.district || 'Colombo'}. Looking for a grounded partner with genuine moral values.`}
            </div>

            {/* Partner Preference Box */}
            <div className="bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent rounded-2xl p-5 border border-rose-500/20 shadow-sm text-xs leading-relaxed font-sinhala">
              <p className="font-extrabold text-rose-500 mb-1 flex items-center gap-1">
                <Sparkles size={14} /> Partner Preference (සහකරු / සහකාරිය පිළිබඳ අපේක්ෂා):
              </p>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {profile.prompt_ideal_partner || `සමාන අධ්‍යාපන සුදුසුකම් ඇති, යහපත් ගුණධර්ම සහිත වෛද්‍ය/ඉංජිනේරු/කථිකාචාර්ය/මෘදුකාංග ඉංජිනේරු වැනි ගෞරවනීය රැකියාවක නිරත සහකරුවෙකු/සහකාරියක් සොයයි.`}
              </p>
            </div>
          </div>

          {/* 2. PERSONAL INFORMATION (Basic, Residency, Education) */}
          <div className="space-y-4 font-sans">
            <h2 className="text-xs font-black uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
              <Info size={16} /> Personal Information
            </h2>

            {/* Basic Attributes Block */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs shadow-sm">
              <div className="bg-slate-100 dark:bg-slate-800/60 px-5 py-2.5 font-bold text-[11px] text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Basic Attributes
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {[
                  { label: 'Ethnicity', value: profile.ethnicity || 'Not Specified' },
                  { label: 'Religion', value: profile.religion || 'Not Specified' },
                  { label: 'Caste', value: profile.caste || 'Not Specified' },
                  { label: 'Height (ft)', value: profile.height || 'Not Specified' },
                  { label: 'Age', value: profile.age ? `${profile.age} years` : 'Not Specified' },
                  { label: 'Civil Status', value: profile.civilStatus || 'Never Married (අවිවාහක)' },
                  { label: 'Drinking Habits', value: (profile.social_drinking_level || profile.drinkingStatus || 'Non-drinker').replace(/[^\w\s\/-]/g, '').trim() },
                  { label: 'Smoking Habits', value: (profile.smokingStatus || 'Non-smoker').replace(/[^\w\s\/-]/g, '').trim() },
                  { label: 'Food / Diet Preference', value: (profile.dietaryPreference || profile.diet || 'Non-Vegetarian').replace(/[^\w\s\/-]/g, '').trim() },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center px-5 py-2.5 font-sans">
                    <span className="font-semibold text-slate-500">{row.label}</span>
                    <span className={`font-bold ${row.value === 'Not Specified' ? 'text-slate-400 italic font-normal' : 'text-slate-900 dark:text-white'}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Residency & Education Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              
              {/* Residency Block */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs shadow-sm">
                <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-2 font-bold text-[11px] text-slate-600 dark:text-slate-300 uppercase flex items-center gap-1">
                  <Globe size={13} className="text-emerald-500" /> Residency
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <div className="flex justify-between p-3"><span className="text-slate-500">Country</span><span className="font-bold">{profile.country || 'Sri Lanka'}</span></div>
                  <div className="flex justify-between p-3"><span className="text-slate-500">District</span><span className="font-bold">{profile.district || 'Not Specified'}</span></div>
                  <div className="flex justify-between p-3"><span className="text-slate-500">Hometown</span><span className={`font-bold ${!profile.hometown ? 'text-slate-400 italic font-normal' : ''}`}>{profile.hometown || 'Not Specified'}</span></div>
                </div>
              </div>

              {/* Education Block */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs shadow-sm">
                <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-2 font-bold text-[11px] text-slate-600 dark:text-slate-300 uppercase flex items-center gap-1">
                  <GraduationCap size={14} className="text-indigo-500" /> Education & Career
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <div className="flex justify-between p-3"><span className="text-slate-500">Education</span><span className="font-bold truncate max-w-[130px]">{profile.university || profile.educationCategory || 'University Graduate'}</span></div>
                  <div className="flex justify-between p-3"><span className="text-slate-500">Profession</span><span className="font-bold">{profile.profession || 'Not Specified'}</span></div>
                  <div className="flex justify-between p-3"><span className="text-slate-500">Income</span><span className={`font-bold ${profile.monthlyIncome ? 'text-rose-500' : 'text-slate-400 italic font-normal'}`}>{profile.monthlyIncome || 'Not Disclosed (රහස්‍යයි)'}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. FAMILY INFORMATION (පවුලේ විස්තර) - Gated: Classic & VIP Only */}
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Users size={16} /> Family Information (පවුලේ පසුබිම)
              </h2>
              {membershipPlan !== 'free' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck size={12} /> Verified Family Access
                </span>
              )}
            </div>

            <div className="relative">
              {/* Content (Blurred if Free Plan) */}
              <div className={membershipPlan === 'free' ? 'filter blur-sm select-none pointer-events-none opacity-40' : ''}>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Father */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs shadow-sm">
                    <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-2 font-bold text-[11px] text-amber-600 dark:text-amber-400 uppercase">
                      FATHER (පියා)
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      <div className="flex justify-between p-3"><span className="text-slate-500">Ethnicity</span><span className="font-bold">{profile.fatherEthnicity || 'Sinhalese'}</span></div>
                      <div className="flex justify-between p-3"><span className="text-slate-500">Religion</span><span className="font-bold">{profile.fatherReligion || 'Buddhist'}</span></div>
                      <div className="flex justify-between p-3"><span className="text-slate-500">Profession</span><span className={`font-bold ${!profile.fatherProfession ? 'text-slate-400 italic font-normal' : ''}`}>{profile.fatherProfession || 'Senior Executive / Businessman'}</span></div>
                      <div className="flex justify-between p-3"><span className="text-slate-500">Status</span><span className={`font-bold ${!profile.fatherStatus ? 'text-slate-400 italic font-normal' : ''}`}>{profile.fatherStatus || 'Employed'}</span></div>
                    </div>
                  </div>

                  {/* Mother */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs shadow-sm">
                    <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-2 font-bold text-[11px] text-pink-600 dark:text-pink-400 uppercase">
                      MOTHER (මව)
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      <div className="flex justify-between p-3"><span className="text-slate-500">Ethnicity</span><span className="font-bold">{profile.motherEthnicity || 'Sinhalese'}</span></div>
                      <div className="flex justify-between p-3"><span className="text-slate-500">Religion</span><span className="font-bold">{profile.motherReligion || 'Buddhist'}</span></div>
                      <div className="flex justify-between p-3"><span className="text-slate-500">Profession</span><span className={`font-bold ${!profile.motherProfession ? 'text-slate-400 italic font-normal' : ''}`}>{profile.motherProfession || 'Educator / Housewife'}</span></div>
                      <div className="flex justify-between p-3"><span className="text-slate-500">Country</span><span className="font-bold">{profile.motherCountry || 'Sri Lanka'}</span></div>
                    </div>
                  </div>
                </div>

                {/* Siblings */}
                <div className="mt-4 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-xs flex justify-between items-center shadow-sm">
                  <span className="font-semibold text-slate-500">Siblings & Family Standing</span>
                  <span className={`font-bold ${!profile.siblings ? 'text-slate-400 italic font-normal' : 'text-slate-900 dark:text-white'}`}>{profile.siblings || '1 Brother (Studying)'}</span>
                </div>
              </div>

              {/* Free Plan Lock Overlay for Family Information */}
              {membershipPlan === 'free' && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-xs rounded-2xl border border-amber-500/30 text-center">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 shadow-inner">
                    <Lock size={18} />
                  </div>
                  <p className="text-xs font-bold text-white mb-1">
                    🔒 Family Background Protected
                  </p>
                  <p className="text-[11px] text-slate-300 max-w-xs mb-3 font-sinhala">
                    දෙමව්පියන්ගේ සහ පවුලේ තොරතුරු නැරඹීමට කරුණාකර Classic හෝ VIP සාමාජිකත්වය ලබාගන්න.
                  </p>
                  <button
                    type="button"
                    onClick={onVerifyNow}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Crown size={14} />
                    <span>Unlock with Classic (රු. 2,990)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 4. ASTROLOGICAL & HOROSCOPE INFORMATION (කේන්දර විස්තර) - 3-Tier Gated */}
          <div className="space-y-4 font-sans">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-purple-500 flex items-center gap-1.5">
                <Moon size={16} /> Astrological & Horoscope Information (කේන්දර විස්තර)
              </h2>
              {membershipPlan === 'vip' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                  <Crown size={12} /> VIP Fully Unlocked
                </span>
              ) : membershipPlan === 'classic' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                  <Check size={12} /> Classic Unlocked
                </span>
              ) : null}
            </div>

            {/* A. Basic Horoscope Grid (Lagna, Nekatha, Dosha Status, Birth City) */}
            <div className="relative">
              <div className={membershipPlan === 'free' ? 'filter blur-sm select-none pointer-events-none opacity-40' : ''}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs shadow-sm">
                  <div className="bg-purple-50 dark:bg-purple-950/40 px-5 py-2.5 font-bold text-[11px] text-purple-700 dark:text-purple-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Astrological Attributes</span>
                    <span className="text-[10px] font-normal normal-case text-purple-600 dark:text-purple-400">
                      {profile.horoscopeMatchRequired || profile.horoscope_match_required || 'Must Match (අත්‍යවශ්‍යයි)'}
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    <div className="flex justify-between items-center px-5 py-2.5">
                      <span className="font-semibold text-slate-500">ලග්නය (Lagna)</span>
                      <span className="font-bold text-slate-900 dark:text-white px-2.5 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
                        {profile.lagna || 'කන්‍යා (Virgo)'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center px-5 py-2.5">
                      <span className="font-semibold text-slate-500">නැකත (Nekatha)</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {profile.nekatha || 'හත (Hastha)'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center px-5 py-2.5">
                      <span className="font-semibold text-slate-500">ශනි / කුජ දෝෂ (Dosha Status)</span>
                      <span className={`font-bold ${
                        (profile.doshaStatus || profile.dosha_status || '').includes('None') || !(profile.doshaStatus || profile.dosha_status)
                          ? 'text-emerald-500'
                          : 'text-amber-500'
                      }`}>
                        {profile.doshaStatus || profile.dosha_status || 'None (දෝෂ රහිතයි)'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center px-5 py-2.5">
                      <span className="font-semibold text-slate-500">උපන් නගරය (Birth City)</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {profile.birthCity || profile.birth_city || profile.district || 'Colombo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Free Plan Lock Overlay for Basic Horoscope */}
              {membershipPlan === 'free' && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-xs rounded-2xl border border-purple-500/30 text-center">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 shadow-inner">
                    <Lock size={18} />
                  </div>
                  <p className="text-xs font-bold text-white mb-1">
                    🔒 Astrological Info Protected
                  </p>
                  <p className="text-[11px] text-slate-300 max-w-xs mb-3 font-sinhala">
                    ලග්නය, නැකත සහ දෝෂ තත්ත්වයන් නැරඹීමට කරුණාකර Classic හෝ VIP සාමාජිකත්වය ලබාගන්න.
                  </p>
                  <button
                    type="button"
                    onClick={onVerifyNow}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-md shadow-purple-500/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Crown size={14} />
                    <span>Unlock with Classic (රු. 2,990)</span>
                  </button>
                </div>
              )}
            </div>

            {/* B. VIP Exclusive: Full Horoscope Chart & Exact Birth Time */}
            {membershipPlan === 'vip' ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-slate-900 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown size={16} className="text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      VIP Astrological Deep Dive
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-300">
                    උපන් වේලාව: <span className="text-amber-400 font-mono font-black">{profile.birthTime || profile.birth_time || '08:42 AM'}</span>
                  </span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Full Horoscope Chart (කේන්දර පිටපත)</p>
                      <p className="text-[10px] text-slate-400">Verified Planetary Placements & Astrological Chart</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHoroscopeModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                  >
                    <Eye size={13} /> View Chart
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Crown size={20} />
                  </div>
                  <div>
                    <p className="font-extrabold text-amber-400 flex items-center justify-center sm:justify-start gap-1">
                      <span>Full Horoscope Chart & Planetary Placements</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded font-mono">VIP</span>
                    </p>
                    <p className="text-[11px] text-slate-400 font-sinhala">
                      උපන් වේලාව, ග්‍රහ පිහිටීම් සහ සම්පූර්ණ කේන්දර පිටපත බැලීමට VIP සාමාජිකත්වය ලබාගන්න.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onVerifyNow}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black shrink-0 cursor-pointer shadow-md shadow-amber-400/20"
                >
                  Unlock VIP (රු. 4,990)
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* CONFIRM PROPOSAL MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
          <div className={`p-6 sm:p-8 rounded-3xl max-w-md w-full border shadow-2xl text-center relative ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-rose-500/20 shadow-lg">
              <img
                src={allImages[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-xl font-black mb-1">
              Send Proposal Request?
            </h3>
            <p className="text-xs font-bold text-rose-500 mb-3">
              {profile.name} ({profile.code}) • {profile.district}
            </p>

            <p className={`text-xs leading-relaxed mb-5 font-sinhala ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              ඔබ <strong>{profile.name}</strong> වෙත Proposal Request එකක් යැවීමට සූදානම්ද? දෙපාර්ශවයම Accept කළ පසු ඡායාරූප unblur වී ආරක්ෂිත In-App Chat පහසුකම විවෘත වේ.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
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

      {/* VIP HOROSCOPE CHART VIEWER MODAL */}
      {showHoroscopeModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
          <div className={`p-6 sm:p-8 rounded-3xl max-w-lg w-full border shadow-2xl relative ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setShowHoroscopeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Crown size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {profile.name}'s Horoscope Chart (කේන්දර පිටපත)
                </h3>
                <p className="text-[10px] text-amber-500 font-semibold">VIP Astrological Verification</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 p-2 mb-4 flex items-center justify-center min-h-[260px]">
              <img
                src={profile.horoscopeDocUrl || profile.horoscope_doc_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                alt="Horoscope Document"
                className="max-h-[340px] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-100 dark:bg-slate-800/60 p-3 rounded-2xl mb-4">
              <div>
                <span className="text-slate-500 block text-[10px]">උපන් වේලාව</span>
                <span className="font-bold font-mono">{profile.birthTime || profile.birth_time || '08:42 AM'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">ලග්නය & නැකත</span>
                <span className="font-bold">{profile.lagna || 'කන්‍යා'} • {profile.nekatha || 'හත'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHoroscopeModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close Viewer
            </button>
          </div>
        </div>
      )}

      {/* PRIVATE FAMILY NOTES & SHORTLIST MODAL */}
      {showNotesModal && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
          <div className={`p-6 sm:p-7 rounded-3xl max-w-md w-full border shadow-2xl relative ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setShowNotesModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Bookmark size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Shortlist & Private Family Notes
                </h3>
                <p className="text-[10px] text-amber-500 font-bold">
                  {membershipPlan === 'vip' ? 'VIP Unlimited Shortlists' : 'Classic Plan (Up to 25 Profiles)'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-sinhala leading-relaxed">
              මෙහි ලියන සටහන් අනෙක් පාර්ශවයට නොපෙනෙන අතර, දෙමව්පියන්ට සහ ඔබට පමණක් පුද්ගලිකව සුරැකේ.
            </p>

            <textarea
              rows={3}
              value={familyNote}
              onChange={(e) => setFamilyNote(e.target.value)}
              placeholder="e.g. පවුල් පසුබිම ඉතා ගෞරවනීයයි. කේන්දරය පොරොන්දම් බැලීමට අම්මාට පෙන්වන්න..."
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white mb-4 focus:outline-none focus:border-amber-500"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowNotesModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveFamilyNote}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black cursor-pointer shadow-md shadow-amber-500/20"
              >
                Save Shortlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REUSABLE IDENTITY VERIFICATION REQUIRED MODAL */}
      <VerificationModal onVerifyNow={onVerifyNow} />

      {/* PROPOSAL USAGE LIMIT REACHED MODAL (3/month for free plan) */}
      <ProposalLimitModal onUpgrade={() => onVerifyNow ? onVerifyNow() : null} />

      {/* REGISTER PROMPT MODAL FOR GUESTS */}
      {showRegisterPromptModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
          <div className={`p-6 sm:p-8 rounded-3xl max-w-md w-full border shadow-2xl text-center relative ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setShowRegisterPromptModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 bg-rose-500/10 text-rose-500 flex items-center justify-center ring-4 ring-rose-500/20 shadow-lg">
              <Heart size={32} fill="currentColor" />
            </div>

            <h3 className="text-xl font-black mb-1">
              Create Your Free Bio-Data 💍
            </h3>
            <p className="text-xs font-bold text-rose-500 mb-3">
              Connect with {profile.name} ({profile.code || 'BR000158'})
            </p>

            <p className={`text-xs leading-relaxed mb-6 font-sinhala ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              මෙම මනාල/මනාලිය වෙත Proposal Request එකක් යැවීමට සහ දෙපාර්ශවයම Accept කළ පසු ආරක්ෂිත In-App Chat ආරම්භ කිරීමට, කරුණාකර පළමුව ඔබගේ මූලික Bio-Data ගිණුම මිනිත්තු 2කින් නොමිලේ සකස් කරගන්න.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowRegisterPromptModal(false)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  isDark ? 'border-slate-800 bg-slate-800/80 hover:bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                පසුව බලන්න
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRegisterPromptModal(false);
                  if (onRegisterNow) onRegisterNow();
                  else if (onVerifyNow) onVerifyNow();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-600 text-white shadow-md shadow-rose-500/25 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <span>Bio-Data සාදන්න</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
