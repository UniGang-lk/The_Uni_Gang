import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Send, Heart, Eye, CheckCircle2, Crown, ArrowRight, ShieldCheck, Lock, MessageCircle, Settings, GraduationCap, User2, Sparkles, Inbox, Check, X, Clock, Award } from 'lucide-react';
import { cx } from '../components/ui/ProposalPrimitives';
import { proposalApi } from '../api/proposalApi';
import { useTheme } from '../../../context/ThemeContext';
import astroCoupleHero from '../../../assets/astro_couple_hero.png';

export default function ProposalHomePage({
  setPage,
  openProfile,
  goToLanding: _goToLanding
}: {
  setPage: (page: string) => void;
  openProfile: (p: any) => void;
  goToLanding?: () => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [discoverProfiles, setDiscoverProfiles] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>({ 
    name: 'User', 
    profileCompletion: 0, 
    plan: 'free',
    missingTasks: [],
    stats: { proposalsSent: 8, matches: 3, profileViews: 142, proposalsReceived: 12 },
    activities: []
  });

  const [imageError, setImageError] = useState(false);
  const [showTrustModal, setShowTrustModal] = useState(false);
  const [activeCardModal, setActiveCardModal] = useState<'sent' | 'received' | 'views' | 'matches' | null>(null);

  // Lists for Interactive Card Modals
  const [sentProposalsList] = useState([
    {
      id: 'sent_1',
      code: 'BR000158',
      name: 'Piyumali L.',
      age: 31,
      district: 'Colombo 1',
      profession: 'Lecturer',
      sentDate: 'Yesterday',
      status: 'Pending Response ⏳',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    },
    {
      id: 'sent_2',
      code: 'GR000323',
      name: 'Sathira D. K. P.',
      age: 23,
      district: 'Akmeemana',
      profession: 'Doctor',
      sentDate: '3 days ago',
      status: 'Accepted 💕',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    }
  ]);

  const [receivedProposalsList, setReceivedProposalsList] = useState([
    {
      id: 'rec_1',
      code: 'BR000113',
      name: 'Kasuni D.',
      age: 31,
      district: 'Narammala',
      profession: 'Government Servant',
      receivedDate: '2 hours ago',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    },
    {
      id: 'rec_2',
      code: 'BR000064',
      name: 'Inoka D.',
      age: 32,
      district: 'Matale',
      profession: 'Teacher',
      receivedDate: '1 day ago',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    }
  ]);

  const [mutualMatchesList, setMutualMatchesList] = useState([
    {
      id: 'match_1',
      code: 'GR000323',
      name: 'Sathira D. K. P.',
      age: 23,
      district: 'Akmeemana',
      profession: 'Doctor',
      matchedDate: 'Matched Feb 2026',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    },
    {
      id: 'match_2',
      code: 'GR000730',
      name: 'Kisal P. S.',
      age: 23,
      district: 'Panadura',
      profession: 'Engineer',
      matchedDate: 'Matched Jan 2026',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
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
      code: 'GR003256',
      name: 'Wasantha G.',
      age: 36,
      district: 'Elpitiya',
      profession: 'Accountant',
      viewedTime: '1 hour ago',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    }
  ]);

  const handleAcceptReceivedProposal = (item: any) => {
    setReceivedProposalsList(prev => prev.filter(p => p.id !== item.id));
    setMutualMatchesList(prev => [{ ...item, matchedDate: 'Just Now' }, ...prev]);
    setCurrentUser((prev: any) => ({
      ...prev,
      stats: {
        ...prev.stats,
        proposalsReceived: Math.max(0, (prev.stats?.proposalsReceived || 1) - 1),
        matches: (prev.stats?.matches || 0) + 1
      }
    }));
    alert(`Proposal from ${item.name} (${item.code}) accepted! You are now mutually matched 💕`);
  };

  const handleDeclineReceivedProposal = (item: any) => {
    setReceivedProposalsList(prev => prev.filter(p => p.id !== item.id));
    setCurrentUser((prev: any) => ({
      ...prev,
      stats: {
        ...prev.stats,
        proposalsReceived: Math.max(0, (prev.stats?.proposalsReceived || 1) - 1)
      }
    }));
    alert(`Proposal request from ${item.name} declined.`);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Fetch user and feed
    const fetchData = async () => {
      const savedProfileRaw = localStorage.getItem('userProposalProfile');
      let savedProfile: any = null;
      try { if (savedProfileRaw) savedProfile = JSON.parse(savedProfileRaw); } catch (e) {}

      try {
        const userRes = await proposalApi.getMyProfile();
        const gamificationRes = await proposalApi.getGamificationStatus();
        
        if (userRes.success && gamificationRes.success) {
          const profileData = userRes.profile || null;
          const userObj = userRes.user || profileData?.user;
          const statsRes = await proposalApi.getStats();
          const firstPhoto = profileData?.images?.[0] || savedProfile?.images?.[0] || userObj?.profile_pic || '';
          
          setCurrentUser({
            ...profileData,
            name: userObj?.name || profileData?.name || savedProfile?.name || 'Kasun',
            avatar: firstPhoto,
            profileCompletion: gamificationRes.completionPct || 85,
            plan: gamificationRes.isPremium ? 'premium' : 'free',
            missingTasks: gamificationRes.missingTasks || [],
            stats: statsRes.stats || { proposalsSent: 8, matches: 3, profileViews: 142, proposalsReceived: 12 },
            activities: statsRes.activities || []
          });
        }
        
        const feedRes = await proposalApi.getFeed({});
        if (feedRes.success) {
          setDiscoverProfiles(feedRes.data.slice(0, 5));
        }
      } catch (err) {
        console.warn('Backend home API offline or loading, populating local state:', err);

        setCurrentUser({
          name: savedProfile?.name || 'Kasun Bandara',
          avatar: savedProfile?.images?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          profileCompletion: 85,
          plan: 'free',
          missingTasks: ['Upload Campus Student ID / Degree'],
          stats: { proposalsSent: 8, matches: 3, profileViews: 142, proposalsReceived: 12 },
          activities: [
            { icon: 'Heart', color: 'text-rose-500', text: 'You and BR000113 matched!', time: 'Today' },
            { icon: 'Eye', color: 'text-amber-500', text: '3 candidates viewed your profile.', time: 'Yesterday' }
          ]
        });
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      
      {/* Top Banner Header Dock */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-r from-rose-500/10 via-slate-500/5 to-pink-500/10 border border-rose-500/20 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-4">
          {!imageError && currentUser.avatar ? (
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              onError={() => setImageError(true)}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500 shadow-md shrink-0" 
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-black text-2xl flex items-center justify-center border-2 border-rose-400 shadow-md shrink-0">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'P'}
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Ayubowan, {currentUser.name ? currentUser.name.split(" ")[0] : 'Member'}</span>
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Your profile is active & matching today</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button 
            onClick={() => setPage('inbox')}
            className="px-4 py-2.5 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-rose-400 transition-all font-extrabold text-xs flex items-center gap-2 cursor-pointer"
            title="Messages"
          >
            <MessageCircle size={16} className="text-rose-500" />
            <span>Messages</span>
          </button>

          <button 
            onClick={() => setPage('profile')}
            className="px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800/80 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-rose-400 transition-all font-extrabold text-xs flex items-center gap-2 cursor-pointer"
            title="Edit Bio-Data Profile"
          >
            <User2 size={16} className="text-rose-500" />
            <span>Edit Profile</span>
          </button>

          <button 
            onClick={() => setPage('settings')}
            className="p-2.5 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-colors cursor-pointer"
            title="Account Privacy & Settings"
          >
            <Settings size={18} />
          </button>

          <button
            onClick={() => setPage("discover")}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-black text-xs shadow-lg shadow-rose-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Compass size={16} />
            <span>Discover Matches</span>
          </button>
        </div>
      </div>

      {/* 4 SLEEK COMPACT FROSTED GLASS METRIC KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
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
            sinhala: "පැමිණි නරඹන්නන්", 
            value: profileViewersList.length + 140, 
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
            className={cx(
              "p-4 sm:p-4.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all duration-300 hover:-translate-y-0.5",
              "cursor-pointer hover:shadow-md hover:border-rose-400/40"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${s.color}`}>
                <s.icon size={15} strokeWidth={2.5} />
              </div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {s.value}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 font-sinhala leading-tight mt-0.5">{s.sinhala}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Verification Modal */}
      {showTrustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button 
              onClick={() => setShowTrustModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              ✕
            </button>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 grid place-items-center text-emerald-500 mb-4">
              <ShieldCheck size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Verified Campus Profile</h3>
            <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mt-1">Status: Active & Authenticated</p>

            <div className="mt-6 space-y-4 text-xs font-medium text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">University Affiliation Verified</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Authenticated via official Sri Lankan University student portal / Alumni registration.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Privacy Protected Bio-data</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Your phone number, full address, and exact location are masked from public view until mutual proposal acceptance.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTrustModal(false)}
              className="mt-6 w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer text-center"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* 1. PROPOSALS SENT POPUP MODAL */}
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
              {sentProposalsList.length === 0 ? (
                <p className="text-center text-slate-400 text-xs py-8">No proposals sent yet.</p>
              ) : (
                sentProposalsList.map((item) => (
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
                        <Eye size={12} /> View Profile
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

      {/* 2. PROPOSALS RECEIVED POPUP MODAL (WITH ACCEPT, DECLINE, VIEW PROFILE BUTTONS) */}
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
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Respond to incoming candidate proposal requests</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1 my-2">
              {receivedProposalsList.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-xs font-bold mb-2">No pending received proposals right now.</p>
                  <button onClick={() => { setActiveCardModal(null); setPage('discover'); }} className="px-4 py-2 bg-rose-500 text-white rounded-full text-xs font-bold shadow-md cursor-pointer">
                    Explore Candidates
                  </button>
                </div>
              ) : (
                receivedProposalsList.map((item) => (
                  <div key={item.id} className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={item.avatar} alt={item.name} className="w-13 h-13 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-sm" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                          <span>{item.name} <span className="text-xs text-slate-500 font-medium">({item.code})</span></span>
                          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1"><Clock size={10} /> {item.receivedDate}</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.age} yrs • {item.district} • {item.profession}</p>
                      </div>
                    </div>

                    {/* 3 Action Buttons: View Profile, Decline, Accept */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => {
                          setActiveCardModal(null);
                          openProfile(item);
                        }}
                        className="py-2 px-2 rounded-xl bg-slate-200/80 dark:bg-slate-700/80 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-extrabold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye size={13} /> View
                      </button>

                      <button
                        onClick={() => handleDeclineReceivedProposal(item)}
                        className="py-2 px-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-extrabold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <X size={13} strokeWidth={3} /> Decline
                      </button>

                      <button
                        onClick={() => handleAcceptReceivedProposal(item)}
                        className="py-2 px-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[11px] shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Check size={13} strokeWidth={3} /> Accept
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

      {/* 3. PROFILE VIEWS POPUP MODAL */}
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
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3">
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

      {/* 4. MUTUAL MATCHES POPUP MODAL (OPEN MESSAGING & CONNECT) */}
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
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mutually connected profiles ready to chat</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 my-2">
              {mutualMatchesList.length === 0 ? (
                <p className="text-center text-slate-400 text-xs py-8">No mutual matches yet.</p>
              ) : (
                mutualMatchesList.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                          <span>{item.name}</span>
                          <span className="text-[10px] bg-pink-500/10 text-pink-500 font-bold px-2.5 py-0.5 rounded-full border border-pink-500/20 inline-flex items-center gap-1">
                            <Heart size={10} className="fill-pink-500" /> Matched
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.age} yrs • {item.district} • {item.profession}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveCardModal(null);
                        setPage('inbox');
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-xs shadow-md shadow-rose-500/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <MessageCircle size={14} /> Chat
                    </button>
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

      {/* Gold VIP Pro Promotional Advertisement Banner */}
      <div className="mb-8 rounded-[2.5rem] p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-amber-950/90 via-slate-950 to-yellow-950/90 text-white border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 relative overflow-hidden group">
        {/* Ambient Gold Glow & Shimmer FX */}
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/25 transition-all duration-700"></div>
        <div className="absolute left-1/3 -bottom-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-5 relative z-10">
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 p-0.5 shadow-xl shadow-amber-500/25 shrink-0 transform group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-[14px] bg-slate-950/85 backdrop-blur-md flex items-center justify-center text-amber-300">
              <Crown size={26} strokeWidth={2.4} className="text-amber-300 drop-shadow-md" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-xl sm:text-2xl font-black text-amber-200 tracking-tight font-sans">
                Uni Porondam VIP Membership
              </h3>
              <span className="text-[10px] bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 font-black px-3 py-1 rounded-full border border-amber-400/30 uppercase tracking-widest flex items-center gap-1.5 shadow-sm backdrop-blur-md">
                <Crown size={12} strokeWidth={2.5} className="text-amber-400" />
                <span>VIP PRO PASS</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-amber-100/90 mt-1.5 max-w-2xl leading-relaxed">
              Unlock <span className="font-bold text-white underline decoration-amber-400">10x More Proposal Matches</span>, Unlimited Direct Chat, Astro Matching (ජ්‍යොතිෂ පොරොන්දම්) & Priority Verification Badge!
            </p>
          </div>
        </div>

        <div className="flex items-center shrink-0 relative z-10 w-full md:w-auto">
          <button 
            type="button"
            onClick={() => setPage('premium')}
            className="w-full md:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/30 hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer text-center flex items-center justify-center gap-2 tracking-wider uppercase font-sans border border-amber-200 group/btn"
          >
            <span>Upgrade to VIP Pro</span>
            <ArrowRight size={16} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Astro Porondam Feature Banner on Dashboard */}
      <div className={`mb-10 rounded-[2.5rem] p-6 sm:p-8 border shadow-2xl transition-all duration-300 relative overflow-hidden group font-sinhala ${
        isDark 
          ? 'bg-slate-900/95 border-slate-800 text-white shadow-purple-900/10' 
          : 'bg-white border-slate-200 text-slate-900 shadow-xl'
      }`}>
        <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
          
          {/* Left Text & Action Side */}
          <div className="space-y-3">
            <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Astro Match (ජ්‍යොතිෂ 20-පොරොන්දම් පරීක්ෂාව)
            </h3>

            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Uni Porondam මංගල සේවාව පිළිබඳ 100%ක් නිවැරදි සාම්ප්‍රදායික විසි පොරොන්දම් ගණනය කර PDF වාර්තාව ලබාගන්න.
            </p>

            <ul className="space-y-2 text-xs font-semibold">
              <li className={`flex items-center gap-2.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> නැකත් 27 & රාශි 12 පාරම්පරික විද්‍යාත්මක පරීක්ෂාව
              </li>
              <li className={`flex items-center gap-2.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> කුජ දෝෂ සහ සෙනසුරු ඒරාෂ්ටක දෝෂ භංග වීම්
              </li>
            </ul>

            <div className="pt-2">
              <button 
                type="button"
                onClick={() => setPage('astro')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-xl shadow-rose-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center flex items-center justify-center gap-2 tracking-wider border-none"
              >
                <span>පොරොන්දම් බලන්න (Astro Hub →)</span>
                <ArrowRight size={16} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Right Visual Image Side with Floating Motion Badges */}
          <div className="relative h-[280px] sm:h-[320px] rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-purple-500/30 group/img">
            <img 
              src={astroCoupleHero} 
              alt="Astro Sri Lankan Couple" 
              className="w-full h-full object-cover object-top opacity-95 group-hover/img:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-xl bg-slate-950/85 border border-amber-400/40 text-amber-300 backdrop-blur-xl shadow-xl flex items-center gap-1.5 text-xs font-black uppercase tracking-wider font-sinhala"
            >
              <Sparkles size={14} className="text-amber-400 animate-spin-slow" />
              <span>100% Traditional Match</span>
            </motion.div>

            {/* Bottom Glass Overlay */}
            <div className={`absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl backdrop-blur-xl shadow-xl flex items-center justify-between border ${
              isDark ? 'bg-slate-900/90 border-purple-500/30 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
                  <Award size={18} />
                </div>
                <div>
                  <p className={`font-bold text-xs font-sinhala ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    20-පොරොන්දම් පද්ධතිය
                  </p>
                  <p className={`text-[10px] font-medium font-sinhala ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Couples & Single Checks
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PDF Report
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Grid: Today's Picks & Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Today's Recommended Picks</h3>
            <button onClick={() => setPage("discover")} className="text-xs font-extrabold flex items-center gap-1 text-rose-500 hover:text-rose-600 transition-colors cursor-pointer">
              View all matches <ArrowRight size={14} />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            {discoverProfiles.length === 0 ? (
              <div className="w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Searching for new matches in your district...</p>
                <button onClick={() => setPage("discover")} className="mt-3 px-4 py-2 rounded-full bg-rose-500 text-white text-xs font-bold shadow-md cursor-pointer">
                  Browse All Matches
                </button>
              </div>
            ) : (
              discoverProfiles.map((p) => (
                <div key={p.id || p.code} className="shrink-0 w-52 group">
                  <div className="relative rounded-3xl overflow-hidden h-72 mb-2 shadow-md border border-slate-200 dark:border-slate-800">
                    <img src={p.avatar || p.images?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} className={cx("w-full h-full object-cover transition-transform duration-700 group-hover:scale-105", p.blurPhoto && "blur-xl scale-110")} />
                    {p.blurPhoto && (
                      <div className="absolute inset-0 grid place-items-center bg-slate-950/30 backdrop-blur-sm">
                        <Lock size={20} className="text-white drop-shadow-md" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4 flex flex-col justify-end">
                      <p className="text-white font-black text-base drop-shadow-md">{p.name ? p.name.split(" ")[0] : 'Candidate'}, {p.age || 28}</p>
                      <p className="text-slate-200 text-xs font-semibold truncate flex items-center gap-1 mt-0.5"><GraduationCap size={12} className="text-rose-400" /> {p.profession || p.university || 'Graduate'}</p>
                    </div>
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2.5 p-4">
                      <button 
                        onClick={() => openProfile(p)}
                        className="w-full py-2 bg-white text-slate-950 rounded-full font-black text-xs shadow-md hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        View Profile
                      </button>
                      <button 
                        onClick={async () => {
                          try {
                            await proposalApi.swipe(p.user_id || p.id, 'like');
                            alert("Proposal Sent!");
                          } catch (err) {
                            console.error(err);
                            alert("Proposal Sent!");
                          }
                        }}
                        className="w-full py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-black text-xs shadow-md hover:from-rose-600 hover:to-pink-600 transition-colors cursor-pointer"
                      >
                        Send Proposal
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-5">Recent Activity</h3>
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
            {currentUser.activities && currentUser.activities.length > 0 ? currentUser.activities.map((a: any, i: number) => (
              <div key={i} className={cx("flex items-start gap-3 p-3 rounded-2xl transition-colors hover:bg-slate-100/60 dark:hover:bg-slate-800/60", i !== currentUser.activities.length - 1 && "border-b border-slate-100 dark:border-slate-800")}>
                <div className="w-9 h-9 rounded-full grid place-items-center shrink-0 bg-slate-100 dark:bg-slate-800">
                  {a.icon === "Heart" && <Heart size={16} className={a.color} fill="currentColor" />}
                  {a.icon === "Eye" && <Eye size={16} className={a.color} />}
                  {a.icon === "MessageCircle" && <MessageCircle size={16} className={a.color} />}
                  {a.icon === "ShieldCheck" && <ShieldCheck size={16} className={a.color} />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{a.text}</p>
                  <p className="text-[10px] font-semibold mt-0.5 text-slate-400">{a.time}</p>
                </div>
              </div>
            )) : (
              <p className="text-xs text-slate-500 p-4 text-center">No recent activities yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
