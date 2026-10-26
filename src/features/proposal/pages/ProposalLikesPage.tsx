import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, MapPin, Briefcase, Lock, Eye, X, MessageCircle, ShieldCheck, GraduationCap, ChevronLeft } from 'lucide-react';
import { proposalApi } from '../api/proposalApi';
import toast from 'react-hot-toast';
import VerifiedBadge from '../../../components/ui/VerifiedBadge';

interface ProposalLikesPageProps {
  setPage: (page: string) => void;
}

const ProposalLikesPage: React.FC<ProposalLikesPageProps> = ({ setPage }) => {
  const [likes, setLikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(true);
  const [selectedBioProfile, setSelectedBioProfile] = useState<any | null>(null);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await proposalApi.getLikedMe();
        if (res.success) {
          const fetched = res.data || res.profiles || [];
          setLikes(Array.isArray(fetched) ? fetched : []);
        }
      } catch (err: any) {
        if (err.requiresPremium) {
          setIsPremium(false);
        } else {
          toast.error('Failed to load likes');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLikes();
  }, []);

  const handleMatch = async (userId: string, name?: string) => {
    try {
      const res = await proposalApi.swipe(userId, 'like');
      if (res.isMatch || res.matched || res.success) {
        toast((t) => (
          <div className="flex items-center gap-3">
            <div>
              <p className="font-bold text-xs text-slate-900">It's a Match! 🎉</p>
              <p className="text-[11px] text-slate-600">You and {name || 'Candidate'} accepted each other!</p>
            </div>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                setPage('inbox');
              }}
              className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer shadow-sm"
            >
              Open Chat
            </button>
          </div>
        ), { duration: 6000, icon: '💕' });

        setLikes(prev => prev.filter(p => (p.user_id || p.userId || p.id) !== userId));
        setSelectedBioProfile(null);
      }
    } catch (err: any) {
      if (err.requiresPremium) {
        setPage('premium');
      } else {
        toast.error('Failed to match');
      }
    }
  };

  const handlePass = async (userId: string, name: string) => {
    try {
      await proposalApi.swipe(userId, 'pass');
    } catch {
      // smooth fallback
    }
    setLikes(prev => prev.filter(p => (p.user_id || p.userId || p.id) !== userId));
    setSelectedBioProfile(null);
    toast(`Passed proposal request from ${name}.`, { icon: '👋' });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 my-8 font-sans">
        <div className="max-w-xl w-full flex justify-start mb-4">
          <button
            onClick={() => setPage('dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="max-w-xl w-full bg-slate-900/90 border border-amber-500/20 rounded-3xl p-8 md:p-12 text-center shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(245,158,11,0.5)]">
            <Heart size={40} className="text-white drop-shadow-md" fill="white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">See Who Liked You</h2>
          <p className="text-slate-300 mb-8 max-w-md text-sm leading-relaxed">
            Upgrade to Premium to instantly see everyone who has swiped right on your profile. Match with them instantly!
          </p>
          <button 
            onClick={() => setPage('premium')}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full font-bold text-base shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles size={20} />
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="text-white" fill="white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">Likes You</h1>
              <p className="text-slate-500 text-sm">People who swiped right on your profile</p>
            </div>
          </div>

          <button
            onClick={() => setPage('dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-500 transition-colors shadow-sm cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
        </div>

        {likes.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No likes yet</h3>
            <p className="text-slate-500">Keep your profile updated to get more matches!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {likes.map((profile, i) => {
              const displayName = profile.user?.name || profile.name || 'Interested Member';
              const rawImg = profile.images?.[0] || profile.avatar || profile.user?.avatar || '';
              const isAbsolute = rawImg.startsWith('http://') || rawImg.startsWith('https://') || rawImg.startsWith('data:');
              const displayImg = rawImg ? (isAbsolute ? rawImg : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${rawImg}`) : (
                profile.gender?.toLowerCase() === 'female' 
                  ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
                  : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
              );
              const blurPhoto = Boolean(profile.blur_photo ?? profile.blurPhoto);
              const targetUserId = profile.user_id || profile.userId || profile.id;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={profile.id || i} 
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700"
                >
                  <div className="aspect-[3/4] relative overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img 
                      src={displayImg} 
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                        blurPhoto ? 'blur-xl scale-110 opacity-75' : ''
                      }`}
                      alt={displayName}
                    />

                    {/* Privacy Lock Overlay when Photo Blur is Active */}
                    {blurPhoto && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-3 text-center bg-black/35 backdrop-blur-xs pointer-events-none">
                        <div className="w-9 h-9 rounded-full bg-slate-900/80 border border-white/20 text-white flex items-center justify-center shadow-lg mb-1.5">
                          <Lock size={16} className="text-amber-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-white bg-slate-950/80 px-2 py-0.5 rounded-full border border-white/10 shadow-sm">
                          Photo Blurred 🔒
                        </span>
                        <span className="text-[9px] text-slate-200 mt-1 font-medium max-w-[140px] drop-shadow">
                          Unlocks upon mutual match
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-15 pointer-events-none" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-black text-white leading-none">{displayName}</h3>
                        {(profile.isVerified || profile.is_nic_verified) && <VerifiedBadge size={16} title="Verified Candidate" />}
                      </div>
                      
                      <div className="flex flex-col gap-1 text-[10px] text-white/80 font-medium">
                        <div className="flex items-center gap-1.5"><Briefcase size={10} /> {profile.profession || 'Professional'}</div>
                        <div className="flex items-center gap-1.5"><MapPin size={10} /> {profile.district || 'Sri Lanka'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Clean Touch & Mobile-Friendly Action Bar */}
                  <div className="p-2.5 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedBioProfile(profile)}
                      className="flex-1 py-2 px-2 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      title="View Candidate Details"
                    >
                      <Eye size={13} />
                      <span>Bio</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePass(targetUserId, displayName)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                      title="Pass / Decline Request"
                    >
                      <X size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMatch(targetUserId, displayName)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-md shadow-rose-500/20 active:scale-95 transition-all cursor-pointer"
                      title="Accept & Match"
                    >
                      <Heart size={13} fill="white" />
                      <span>Match</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bio-Data Preview Modal */}
        {selectedBioProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setSelectedBioProfile(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                  <img
                    src={
                      selectedBioProfile.images?.[0] ||
                      selectedBioProfile.avatar ||
                      (selectedBioProfile.gender?.toLowerCase() === 'female'
                        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
                        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400')
                    }
                    alt="Candidate"
                    className={`w-full h-full object-cover ${(selectedBioProfile.blur_photo ?? selectedBioProfile.blurPhoto) ? 'blur-md' : ''}`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {selectedBioProfile.user?.name || selectedBioProfile.name || 'Interested Member'}
                    </h3>
                    {(selectedBioProfile.isVerified || selectedBioProfile.is_nic_verified) && <VerifiedBadge size={16} title="Verified Candidate" />}
                  </div>
                  <p className="text-xs text-rose-500 font-bold">
                    {selectedBioProfile.code || 'Candidate'} • Age {selectedBioProfile.age || 26}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {selectedBioProfile.district || 'Sri Lanka'} • {selectedBioProfile.profession || 'Professional'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 mb-6">
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400">Education:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedBioProfile.educationCategory || selectedBioProfile.education || 'University Degree'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400">Civil Status:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedBioProfile.civilStatus || selectedBioProfile.civil_status || 'Never Married (අවිවාහක)'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400">Religion:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedBioProfile.religion || 'Buddhist'}</span>
                </div>
                {selectedBioProfile.prompt_about_me && (
                  <div className="pt-2">
                    <span className="text-slate-400 block mb-1">About:</span>
                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{selectedBioProfile.prompt_about_me}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handlePass(selectedBioProfile.user_id || selectedBioProfile.userId || selectedBioProfile.id, selectedBioProfile.name || 'Candidate')}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  ✕ Pass
                </button>
                <button
                  type="button"
                  onClick={() => handleMatch(selectedBioProfile.user_id || selectedBioProfile.userId || selectedBioProfile.id, selectedBioProfile.name || 'Candidate')}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white text-xs font-bold shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Heart size={16} fill="white" />
                  <span>Accept & Match</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalLikesPage;
