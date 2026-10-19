import React, { useState, useEffect } from 'react';
import { 
  Compass, Send, Heart, Eye, CheckCircle2, Crown, ArrowRight, ArrowLeft, ShieldCheck, 
  Lock, MessageCircle, Settings, GraduationCap, User2, Inbox, Check, X, 
  Clock, Camera, Upload, AlertCircle, Phone, MapPin, Briefcase, FileText,
  Calendar, Users, Sparkles, Pencil, Bell, Shield, ChevronRight, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cx } from '../components/ui/ProposalPrimitives';
import { proposalApi } from '../api/proposalApi';

export default function ProposalHomePage({
  setPage,
  openProfile,
  goToLanding: _goToLanding
}: {
  setPage: (page: string) => void;
  openProfile: (p: any) => void;
  goToLanding?: () => void;
}) {
  const [currentUser, setCurrentUser] = useState<any>({ 
    name: 'Kasun Bandara', 
    code: 'UG-101',
    age: 26,
    gender: 'Male',
    civilStatus: 'Never Married (අවිවාහක)',
    birthday: '1998-05-14',
    district: 'Colombo',
    hometown: 'Alawwa',
    religion: 'Buddhist',
    height: '5.8 ft',
    phone: '077 123 4567',
    profession: 'Software Engineer',
    workplace: 'IFS Sri Lanka',
    university: 'University of Moratuwa',
    educationCategory: 'University Degree (BSc Engineering)',
    monthlyIncome: 'Rs 250,000 - Rs 350,000',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    isVerified: false,
    verificationStatus: 'unverified', // 'unverified' | 'pending_review' | 'verified'
    categoryBadge: 'ID Verified Pending ⏳',
    profileViews: 14,
    blurPhoto: true
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'proposals' | 'photos' | 'verification'>('overview');
  const [activeCardModal, setActiveCardModal] = useState<'sent' | 'received' | 'views' | 'matches' | null>(null);
  const [notificationsActive, setNotificationsActive] = useState(true);
  const [blurPhotosActive, setBlurPhotosActive] = useState(true);

  // Verification upload state
  const [nicFront, setNicFront] = useState<string | null>(null);
  const [nicBack, setNicBack] = useState<string | null>(null);
  const [isSubmittingNic, setIsSubmittingNic] = useState(false);

  // Lists for Interactive Modals
  const [sentProposalsList] = useState([
    {
      id: 'sent_1',
      code: 'BR000158',
      name: 'Piyumali L.',
      age: 25,
      district: 'Colombo 1',
      profession: 'Software Engineer',
      sentDate: 'Yesterday',
      status: 'Pending Response ⏳',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    },
    {
      id: 'sent_2',
      code: 'BR000113',
      name: 'Kasuni D.',
      age: 26,
      district: 'Gampaha',
      profession: 'Banking Executive',
      sentDate: '3 days ago',
      status: 'Accepted 💕',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    }
  ]);

  const [receivedProposalsList, setReceivedProposalsList] = useState([
    {
      id: 'rec_1',
      code: 'BR000112',
      name: 'Dharani P. A.',
      age: 31,
      district: 'Kuliyapitiya',
      profession: 'Doctor (MBBS)',
      receivedDate: '2 hours ago',
      avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    },
    {
      id: 'rec_2',
      code: 'BR000064',
      name: 'Inoka D.',
      age: 28,
      district: 'Matale',
      profession: 'Chartered Accountant',
      receivedDate: '1 day ago',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    }
  ]);

  const [mutualMatchesList, setMutualMatchesList] = useState([
    {
      id: 'match_1',
      code: 'BR000113',
      name: 'Kasuni D.',
      age: 26,
      district: 'Gampaha',
      profession: 'Banking Executive',
      matchedDate: 'Matched Feb 2026',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    }
  ]);

  const [profileViewersList] = useState([
    {
      id: 'view_1',
      code: 'BR000112',
      name: 'Dharani P. A.',
      age: 31,
      district: 'Kuliyapitiya',
      profession: 'Doctor',
      viewedTime: '10 mins ago',
      avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    },
    {
      id: 'view_2',
      code: 'BR000158',
      name: 'Piyumali L.',
      age: 25,
      district: 'Colombo 1',
      profession: 'Software Engineer',
      viewedTime: '1 hour ago',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    }
  ]);

  // Read saved profile data on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const savedProfileRaw = localStorage.getItem('userProposalProfile');
    if (savedProfileRaw) {
      try {
        const saved = JSON.parse(savedProfileRaw);
        setCurrentUser((prev: any) => ({
          ...prev,
          name: saved.name || prev.name,
          age: saved.age || prev.age,
          gender: saved.gender || prev.gender,
          civilStatus: saved.civil_status || prev.civilStatus,
          district: saved.district || prev.district,
          hometown: saved.hometown || prev.hometown,
          religion: saved.religion || prev.religion,
          height: saved.height || prev.height,
          profession: saved.profession || prev.profession,
          workplace: saved.workplace || prev.workplace,
          university: saved.university || prev.university,
          educationCategory: saved.educationCategory || prev.educationCategory,
          avatar: saved.images?.[0] || prev.avatar,
          images: saved.images?.length ? saved.images : prev.images,
          blurPhoto: saved.blurPhoto ?? prev.blurPhoto
        }));
        if (saved.blurPhoto !== undefined) {
          setBlurPhotosActive(saved.blurPhoto);
        }
      } catch (e) {
        console.error('Failed to parse saved proposal profile', e);
      }
    }
  }, []);

  const handleAcceptReceivedProposal = (item: any) => {
    setReceivedProposalsList(prev => prev.filter(p => p.id !== item.id));
    setMutualMatchesList(prev => [{ ...item, matchedDate: 'Just Now' }, ...prev]);
    toast.success(`Proposal from ${item.name} (${item.code}) accepted! Photos unblurred & Chat unlocked 💕`);
  };

  const handleDeclineReceivedProposal = (item: any) => {
    setReceivedProposalsList(prev => prev.filter(p => p.id !== item.id));
    toast.success(`Proposal request from ${item.name} declined.`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (side === 'front') setNicFront(event.target?.result as string);
        else setNicBack(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicFront || !nicBack) {
      toast.error('Please upload both Front and Back photos of your NIC/Passport');
      return;
    }
    setIsSubmittingNic(true);
    try {
      await proposalApi.submitNICVerification({
        nicFront,
        nicBack,
        categoryBadge: currentUser.categoryBadge
      });
    } catch (err) {
      console.warn("Backend submitNICVerification fallback to local state", err);
    }
    setIsSubmittingNic(false);
    setCurrentUser((prev: any) => ({
      ...prev,
      verificationStatus: 'pending_review',
      categoryBadge: 'ID Review in Progress ⏳'
    }));
    toast.success('🛡️ NIC submitted for admin review! Verification completed under 2-4 hours.');
    setActiveTab('overview');
  };

  const handleResetProfile = () => {
    localStorage.removeItem('userHasProposalProfile');
    localStorage.removeItem('userProposalProfile');
    toast.success('Test profile reset! You can now test the form from scratch.');
    setPage('landing');
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-8 lg:px-12 py-8 font-sans transition-colors duration-300">
      
      {/* ============================================================== */}
      {/* 1. TOP PROFILE HEADER BANNER (PORONDU LANKA STYLE) */}
      {/* ============================================================== */}
      <div className="rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-rose-950/5 mb-8">
        
        {/* Colorful Gradient Cover Banner */}
        <div className="relative h-44 sm:h-56 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/20 blur-2xl pointer-events-none" />
          <div className="absolute left-1/3 -bottom-10 w-64 h-64 rounded-full bg-amber-300/20 blur-xl pointer-events-none" />
          
          {/* Top Cover Banner Navigation: Back to Landing on Left, Status + Reset on Right */}
          <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-10">
            <button
              onClick={() => setPage('landing')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-105"
            >
              <ArrowLeft size={13} />
              <span>Back to Landing</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-sm">
                <Sparkles size={12} className="text-amber-300" />
                <span>Uni Porondam Member</span>
              </span>

              <button
                type="button"
                onClick={handleResetProfile}
                title="Reset test profile to test onboarding from scratch"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-rose-950/80 backdrop-blur-md border border-white/20 text-white/90 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw size={12} />
                <span>Reset Test Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info Bar with Overlapping Avatar */}
        <div className="relative px-6 sm:px-10 pb-6 pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            {/* Left: Overlapping Circular Avatar + Name + Location */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-16 sm:-mt-20">
              
              {/* Overlapping Avatar */}
              <div className="relative group shrink-0">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-2xl ring-2 ring-rose-500/20"
                />
                <button
                  onClick={() => setPage('profile')}
                  title="Change Photo"
                  className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-slate-900 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer border-2 border-white dark:border-slate-900"
                >
                  <Camera size={16} />
                </button>
              </div>

              {/* Name & Credentials */}
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {currentUser.name}
                  </h1>

                  {/* Verification Pill */}
                  {currentUser.verificationStatus === 'verified' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck size={14} /> ID Verified ✓
                    </span>
                  ) : currentUser.verificationStatus === 'pending_review' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      <Clock size={14} /> Verification Under Review ⏳
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveTab('verification')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                    >
                      <AlertCircle size={14} />
                      <span>ID Unverified • Verify Now</span>
                    </button>
                  )}
                </div>

                {/* Subtext: Location | Age | Views */}
                <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-rose-500" />
                    <span>{currentUser.hometown || currentUser.district}</span>
                  </span>
                  <span>•</span>
                  <span>{currentUser.age} වයස (Years)</span>
                  <span>•</span>
                  
                  {/* Porondu Lanka Style Profile Views Count */}
                  <div 
                    onClick={() => setActiveCardModal('views')}
                    className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-900/60 cursor-pointer hover:scale-105 transition-transform"
                    title="Click to view candidate visitors"
                  >
                    <Eye size={13} />
                    <span>{currentUser.profileViews} බැලූ වාර (Views)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Porondu Lanka Style "ගිණුම වෙනස් කරන්න" (Edit Profile) Button */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setPage('profile')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Pencil size={14} />
                <span>ගිණුම වෙනස් කරන්න (Edit Bio-Data)</span>
              </button>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. PORONDU LANKA QUICK TABS NAVIGATION (DIRECTLY BELOW BANNER) */}
        {/* ============================================================== */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 px-6 sm:px-10 py-2.5">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-1">
            
            {/* Tab: Overview (මගේ Bio-Data) */}
            <button
              onClick={() => setActiveTab('overview')}
              className={cx(
                "px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0",
                activeTab === 'overview'
                  ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm border border-slate-200 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <FileText size={15} />
              <span>මගේ Bio-Data (Overview)</span>
            </button>

            {/* Tab: Search Candidates (මනාලියන් / මනාලයන් සොයන්න) */}
            <button
              onClick={() => setPage('discover')}
              className="px-4 py-2 rounded-xl text-xs font-black text-slate-700 dark:text-slate-300 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Compass size={15} className="text-rose-500" />
              <span>මනාලියන් / මනාලයන් සොයන්න (Discover)</span>
            </button>

            {/* Tab: Received Proposals (ලැබුණු ඇරයුම්) */}
            <button
              onClick={() => setActiveCardModal('received')}
              className="px-4 py-2 rounded-xl text-xs font-black text-slate-700 dark:text-slate-300 hover:text-emerald-600 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer shrink-0 relative"
            >
              <Inbox size={15} className="text-emerald-500" />
              <span>ලැබුණු ඇරයුම් (Received Proposals)</span>
              {receivedProposalsList.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                  {receivedProposalsList.length}
                </span>
              )}
            </button>

            {/* Tab: Chat / Messages (සාකච්ඡා) */}
            <button
              onClick={() => setPage('inbox')}
              className="px-4 py-2 rounded-xl text-xs font-black text-slate-700 dark:text-slate-300 hover:text-pink-600 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <MessageCircle size={15} className="text-pink-500" />
              <span>සාකච්ඡා (Messages & Chat)</span>
              {mutualMatchesList.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              )}
            </button>

            {/* Tab: Photos & Privacy (ඡායාරූප) */}
            <button
              onClick={() => setActiveTab('photos')}
              className={cx(
                "px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0",
                activeTab === 'photos'
                  ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm border border-slate-200 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Camera size={15} className="text-amber-500" />
              <span>ඡායාරූප (Photos & Privacy)</span>
            </button>

            {/* Tab: Verification (අනන්‍යතාවය) */}
            <button
              onClick={() => setActiveTab('verification')}
              className={cx(
                "px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0",
                activeTab === 'verification'
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <ShieldCheck size={15} className="text-emerald-500" />
              <span>NIC Verification</span>
            </button>

          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 3. MAIN 2-COLUMN CONTENT SECTION (PORONDU LANKA GRID) */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN (7 COLS): BIO-DATA PROFILE DETAILS ── */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Card 1: පුද්ගලික තොරතුරු (Personal Details) */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                  <User2 size={20} className="text-rose-500" />
                  <span>පුද්ගලික තොරතුරු (Personal Details)</span>
                </h3>
                <button
                  onClick={() => setPage('profile')}
                  className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Edit <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">සම්පූර්ණ නම (Full Name)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{currentUser.name}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">වයස සහ උපන් දිනය</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{currentUser.age} වයස ({currentUser.birthday})</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">ස්ත්‍රී / පුරුෂ භාවය (Gender)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{currentUser.gender}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">ආගම (Religion)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{currentUser.religion}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">උස (Height)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{currentUser.height}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">විවාහක තත්ත්වය (Civil Status)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{currentUser.civilStatus}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 sm:col-span-2">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">දුරකථන අංකය (Phone Number - Masked for Privacy)</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">{currentUser.phone}</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Mutual Accept වූ අයට පමණක් පෙනේ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: අධ්‍යාපනය සහ රැකියාව (Education & Profession) */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Briefcase size={20} className="text-indigo-500" />
                  <span>අධ්‍යාපනය සහ රැකියාව (Education & Career)</span>
                </h3>
                <button
                  onClick={() => setPage('profile')}
                  className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Edit <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">නගරය සහ දිස්ත්‍රික්කය</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{currentUser.hometown}, {currentUser.district}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">රැකියාව (Profession)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{currentUser.profession}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">සේවා ස්ථානය (Workplace)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{currentUser.workplace}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">කැම්පස් / ආයතනය (University)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{currentUser.university}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">අධ්‍යාපන මට්ටම (Degree/Course)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{currentUser.educationCategory}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">මාසික ආදායම (Monthly Income)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{currentUser.monthlyIncome}</span>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN (5 COLS): VERIFICATION, NOTIFICATIONS & QUICK STATS ── */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card 1: 🛡️ NIC / PASSPORT VERIFICATION GATE */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    අනන්‍යතාවය තහවුරු කිරීම (ID Verification)
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    100% Verified Community Standard
                  </p>
                </div>
              </div>

              {currentUser.verificationStatus === 'verified' ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span className="font-black text-sm">Identity Verified by National ID</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    ඔබගේ ගිණුම 100% තහවුරු කර ඇත. ඔබගේ Profile එක search results වල ඉහළින්ම දිස්වේ.
                  </p>
                </div>
              ) : currentUser.verificationStatus === 'pending_review' ? (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={18} className="text-amber-500" />
                    <span className="font-black text-sm">Review in Progress (පරීක්ෂා කරමින් පවතී)</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    ඔබගේ NIC ඡායාරූප admin review සඳහා යොමු කර ඇත. පැය 2-4ක් ඇතුළත badge එක ලැබෙනු ඇත.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <p className="font-bold text-rose-600 dark:text-rose-400 mb-1">⚠️ Profile Verified කර නැත!</p>
                    Proposals යැවීමට සහ 100% Real members ලා සමඟ ගැලපීමට ඔබගේ ජාතික හැඳුනුම්පත (NIC) upload කරන්න.
                  </div>

                  <button
                    onClick={() => setActiveTab('verification')}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload size={16} />
                    <span>Upload NIC / Passport Now</span>
                  </button>
                </div>
              )}
            </div>

            {/* Card 2: PORONDU LANKA STYLE NOTIFICATIONS TOGGLE */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Bell size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">දැනුම්දීම් (Notifications)</h4>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Proposals ලැබෙන විට instant alerts</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setNotificationsActive(!notificationsActive);
                    toast.success(notificationsActive ? 'Notifications Muted' : 'Notifications Activated (සක්‍රියයි)!');
                  }}
                  className={cx(
                    "px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border",
                    notificationsActive
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                  )}
                >
                  {notificationsActive ? 'සක්‍රියයි (Active)' : 'අක්‍රියයි'}
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                යමෙකු ඔබට යෝජනාවක් එවූ විට හෝ ඔබේ යෝජනාව පිළිගත් විට SMS / Web Notification එකක් ලැබේ.
              </p>
            </div>

            {/* Card 3: 4 INTERACTIVE METRIC CARDS */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { 
                  id: 'sent', 
                  label: "Proposals Sent", 
                  sinhala: "යවන ලද යෝජනා", 
                  value: sentProposalsList.length, 
                  icon: Send, 
                  color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
                  onClick: () => setActiveCardModal('sent')
                },
                { 
                  id: 'received', 
                  label: "Proposals Received", 
                  sinhala: "ලැබුණු යෝජනා", 
                  value: receivedProposalsList.length, 
                  icon: Inbox, 
                  color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20", 
                  onClick: () => setActiveCardModal('received') 
                },
                { 
                  id: 'views', 
                  label: "Profile Views", 
                  sinhala: "බැලූ වාර ගණන", 
                  value: currentUser.profileViews, 
                  icon: Eye, 
                  color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20", 
                  onClick: () => setActiveCardModal('views') 
                },
                { 
                  id: 'matches', 
                  label: "Mutual Matches", 
                  sinhala: "ගැලපුණු යෝජනා", 
                  value: mutualMatchesList.length, 
                  icon: Heart, 
                  color: "text-pink-500 bg-pink-500/10 border-pink-500/20",
                  onClick: () => setActiveCardModal('matches')
                },
              ].map((s) => (
                <div 
                  key={s.label} 
                  onClick={s.onClick}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-rose-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${s.color}`}>
                      <s.icon size={15} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {s.value}
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{s.label}</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sinhala truncate">{s.sinhala}</p>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 4. NIC VERIFICATION TAB VIEW */}
      {/* ============================================================== */}
      {activeTab === 'verification' && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  ජාතික හැඳුනුම්පත් (NIC) තහවුරු කිරීම
                </h2>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  National Identity Card / Passport Verification Gate
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className="text-xs font-black text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Back to Overview ✕
            </button>
          </div>

          <form onSubmit={handleSubmitVerification} className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="font-bold text-emerald-700 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                <Lock size={14} /> 100% Private & Confidential
              </p>
              ඔබගේ හැඳුනුම්පත් ඡායාරූප වෙනත් කිසිදු සාමාජිකයෙකුට නොපෙනේ. එය භාවිතා කරන්නේ අපගේ admin කණ්ඩායම විසින් ඔබගේ අනන්‍යතාවය තහවුරු කිරීමට පමණි.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* NIC Front */}
              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  1. හැඳුනුම්පතේ ඉදිරිපස (Front Side) *
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-3xl p-6 text-center cursor-pointer relative bg-slate-50 dark:bg-slate-850 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'front')}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {nicFront ? (
                    <div className="relative">
                      <img src={nicFront} alt="NIC Front" className="h-36 mx-auto rounded-xl object-contain shadow-md" />
                      <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <Check size={12} /> Front Uploaded
                      </span>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Upload size={28} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to upload Front photo</p>
                      <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* NIC Back */}
              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  2. හැඳුනුම්පතේ පසුපස (Back Side) *
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-3xl p-6 text-center cursor-pointer relative bg-slate-50 dark:bg-slate-850 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'back')}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {nicBack ? (
                    <div className="relative">
                      <img src={nicBack} alt="NIC Back" className="h-36 mx-auto rounded-xl object-contain shadow-md" />
                      <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <Check size={12} /> Back Uploaded
                      </span>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Upload size={28} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to upload Back photo</p>
                      <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingNic || !nicFront || !nicBack}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmittingNic ? (
                  <span>Submitting for Review...</span>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Submit NIC for Verification</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. PHOTOS & PRIVACY TAB VIEW */}
      {/* ============================================================== */}
      {activeTab === 'photos' && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
                <Camera size={24} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  ඡායාරූප සහ රහස්‍යභාවය (Photos & Privacy)
                </h2>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Manage gallery & photo blur settings
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className="text-xs font-black text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Back to Overview ✕
            </button>
          </div>

          <div className="space-y-6">
            
            {/* Privacy Blur Toggle Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Lock size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    ඡායාරූප ප්‍රසිද්ධියේ Blur කර තබන්න (Privacy Blur)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ඔබ proposal එකක් mutually accept කළ පසු පමණක් ඡායාරූප unblur වේ.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setBlurPhotosActive(!blurPhotosActive);
                  toast.success(blurPhotosActive ? 'Photo Blur Turned Off (Photos Public)' : 'Photo Blur Activated (Photos Protected)!');
                }}
                className={cx(
                  "px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border",
                  blurPhotosActive
                    ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                )}
              >
                {blurPhotosActive ? '🔒 Protected (Blur ON)' : '🔓 Public (Blur OFF)'}
              </button>
            </div>

            {/* Photo Gallery Grid */}
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                My Uploaded Photos ({currentUser.images?.length || 0}/4)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(currentUser.images || []).map((imgUrl: string, idx: number) => (
                  <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm group">
                    <img 
                      src={imgUrl} 
                      alt={`Photo ${idx + 1}`} 
                      className={cx(
                        "w-full h-full object-cover transition-all",
                        blurPhotosActive && "blur-md scale-105"
                      )} 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white bg-black/60 px-2.5 py-1 rounded-full">
                        Photo {idx + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPage('profile')}
              className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              Upload / Replace Photos in Edit Bio-Data
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. POPUP MODALS: PROPOSALS SENT / RECEIVED / VIEWS / MATCHES */}
      {/* ============================================================== */}
      
      {/* 1. PROPOSALS SENT MODAL */}
      {activeCardModal === 'sent' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button 
              onClick={() => setActiveCardModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
                <Send size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Proposals Sent (යවන ලද යෝජනා)</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Proposals you have expressed interest in</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 my-2">
              {sentProposalsList.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{item.name} <span className="text-xs text-slate-500 font-medium">({item.code})</span></h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.age} yrs • {item.district} • {item.profession}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {item.status}
                    </span>
                    <button
                      onClick={() => {
                        setActiveCardModal(null);
                        openProfile(item);
                      }}
                      className="text-[11px] font-extrabold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={12} /> View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveCardModal(null)}
              className="mt-4 w-full py-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-colors cursor-pointer text-center"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* 2. PROPOSALS RECEIVED MODAL */}
      {activeCardModal === 'received' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button 
              onClick={() => setActiveCardModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
                <Inbox size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Proposals Received (ලැබුණු යෝජනා)</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Accept to unblur photos and open private chat</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 my-2">
              {receivedProposalsList.length === 0 ? (
                <p className="text-center text-slate-400 text-xs py-8">No pending received proposals.</p>
              ) : (
                receivedProposalsList.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{item.name} <span className="text-xs text-slate-500 font-medium">({item.code})</span></h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.age} yrs • {item.district} • {item.profession}</p>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{item.receivedDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleDeclineReceivedProposal(item)}
                        className="flex-1 sm:flex-initial py-2 px-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black text-xs hover:bg-rose-500/20 transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAcceptReceivedProposal(item)}
                        className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-md shadow-emerald-500/20 transition-colors"
                      >
                        Accept 💕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setActiveCardModal(null)}
              className="mt-4 w-full py-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-colors cursor-pointer text-center"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* 3. PROFILE VIEWS MODAL */}
      {activeCardModal === 'views' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button 
              onClick={() => setActiveCardModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 shrink-0">
                <Eye size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Profile Viewers (පැමිණි නරඹන්නන්)</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Candidates who recently viewed your proposal profile</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 my-2">
              {profileViewersList.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{item.name} <span className="text-xs text-slate-500 font-medium">({item.code})</span></h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.age} yrs • {item.district} • {item.profession}</p>
                      <span className="text-[10px] text-indigo-500 font-semibold flex items-center gap-1 mt-0.5"><Clock size={10} /> Viewed {item.viewedTime}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveCardModal(null);
                      openProfile(item);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-rose-500 hover:text-white font-extrabold text-xs transition-colors shrink-0 cursor-pointer"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveCardModal(null)}
              className="mt-4 w-full py-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-colors cursor-pointer text-center"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* 4. MUTUAL MATCHES MODAL */}
      {activeCardModal === 'matches' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button 
              onClick={() => setActiveCardModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-500 shrink-0">
                <Heart size={22} strokeWidth={2.5} fill="currentColor" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Mutual Matches (ගැලපුණු යෝජනා)</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mutually accepted profiles ready to chat</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 my-2">
              {mutualMatchesList.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{item.name} <span className="text-xs text-slate-500 font-medium">({item.code})</span></h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.age} yrs • {item.district} • {item.profession}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveCardModal(null);
                      setPage('inbox');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-xs shadow-md shadow-rose-500/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <MessageCircle size={14} /> Chat
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveCardModal(null)}
              className="mt-4 w-full py-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-colors cursor-pointer text-center"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
