import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  MoreVertical, 
  Heart, 
  ShieldCheck, 
  MapPin, 
  AlertTriangle, 
  UserX,
  Lock,
  Users,
  User2,
  Sparkles,
  Info,
  Camera
} from 'lucide-react';
import { cx } from './ui/ProposalPrimitives';
import { WatermarkOverlay } from './privacy/WatermarkOverlay';

export default function ProposalProfileModal({ profile, onClose }: { profile: any; onClose: () => void }) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [proposalSent, setProposalSent] = useState(false);

  if (!profile) return null;

  const handleSendProposal = () => {
    setProposalSent(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  // Guarantee 3 candidate photos
  const allImages = [
    ...(profile.images || []),
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  ].slice(0, 3);

  return (
    <AnimatePresence>
      {profile && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/75 backdrop-blur-md font-sans"
        >
          <motion.div 
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full h-full md:h-[90vh] max-w-4xl bg-white dark:bg-slate-900 md:rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-2xl border border-slate-200 dark:border-slate-800 font-sans"
          >
            {/* Success Animation Overlay */}
            <AnimatePresence>
              {proposalSent && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-rose-500/95 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center font-sans"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-rose-500 mb-4 shadow-xl"
                  >
                    <Heart size={40} fill="currentColor" />
                  </motion.div>
                  <h2 className="text-2xl font-black mb-1">Proposal Request Sent!</h2>
                  <p className="font-medium text-sm text-rose-100">We'll notify you as soon as they respond 💖</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Top Bar Header Controls */}
            <div className="px-6 py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-20 shrink-0 font-sans">
              <button 
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronDown size={20} />
              </button>
              
              <div className="text-center font-sans flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {profile.name}
                </span>
                <span className="text-xs font-black text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                  {profile.code || 'BR000158'}
                </span>
                {profile.isVerified && <ShieldCheck size={16} className="text-blue-500" />}
              </div>

              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <MoreVertical size={18} />
                </button>
                
                {/* Security Popup Menu */}
                <AnimatePresence>
                  {showMenu && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute top-11 right-0 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden py-1 z-50 font-sans"
                    >
                      <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                        <UserX size={15} /> Block {profile.name}
                      </button>
                      <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2">
                        <AlertTriangle size={15} /> Report Profile
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Scrollable Content: 2-Column Split Dashboard */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 font-sans">
              
              {/* LEFT COLUMN: Photo Showcase & Quick Info */}
              <div className="md:col-span-5 space-y-4">
                
                {/* Photo Display Card */}
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-3 border border-slate-200 dark:border-slate-800">
                  <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800">
                    <WatermarkOverlay text={`ID: ${profile.code || 'BR000158'}`}>
                      <img 
                        src={allImages[activePhotoIndex]} 
                        alt={profile.name} 
                        className={cx(
                          "w-full h-full object-cover transition-transform duration-500",
                          profile.blurPhoto && "blur-2xl brightness-75 scale-110"
                        )} 
                      />
                    </WatermarkOverlay>
                    <div className="absolute top-2 left-2 bg-slate-950/70 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
                      <Camera size={11} /> Photo {activePhotoIndex + 1} of {allImages.length}
                    </div>
                  </div>

                  {/* 3 Photos Thumbnail Switcher Row */}
                  <div className="flex items-center justify-center gap-2.5 mt-3">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIndex(idx)}
                        className={cx(
                          "relative w-14 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shadow-sm shrink-0",
                          activePhotoIndex === idx
                            ? "border-rose-500 ring-2 ring-rose-500/30 scale-105"
                            : "border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
                        )}
                      >
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Candidate Overview Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-xs space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{profile.name}</h3>
                      <p className="text-[11px] font-bold text-slate-500">{profile.code || 'BR000158'} • Age {profile.age || 31}</p>
                    </div>
                    <span className="bg-rose-500/10 text-rose-500 font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Heart size={13} fill="currentColor" /> {profile.matchPercentage || 95}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-bold pt-1">
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg"><span className="text-slate-400 block text-[9px] uppercase">Location</span><span className="text-slate-800 dark:text-slate-200 truncate block"><MapPin size={11} className="inline text-emerald-500" /> {profile.district || 'Colombo'}</span></div>
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg"><span className="text-slate-400 block text-[9px] uppercase">Profession</span><span className="text-slate-800 dark:text-slate-200 truncate block">{profile.profession || 'Lecturer'}</span></div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Categorized Details Grid */}
              <div className="md:col-span-7 space-y-5">
                
                {/* Privacy Notice Box */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 flex items-start gap-2.5 text-xs font-medium shadow-sm">
                  <Lock size={15} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-amber-800 dark:text-amber-200 text-[11px]">
                      Privacy Protection Notice
                    </span>
                    Full name, contact info & birthday are revealed only after mutual proposal acceptance.
                  </div>
                </div>

                {/* About & Partner Expectation */}
                <div className="space-y-2.5 font-sans">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-rose-500 flex items-center gap-1">
                    <User2 size={14} /> About & Partner Preferences
                  </h4>

                  <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm">
                    {profile.bio || `Educated university graduate currently residing in ${profile.district || 'Colombo'}. Looking for a grounded life partner.`}
                  </div>

                  <div className="bg-gradient-to-br from-rose-500/10 to-transparent p-3.5 rounded-xl border border-rose-500/20 text-xs leading-relaxed font-sinhala shadow-sm">
                    <p className="font-extrabold text-rose-500 text-[11px] mb-0.5 flex items-center gap-1">
                      <Sparkles size={12} /> 💕 Partner Preference (අපේක්ෂා):
                    </p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {profile.prompt_ideal_partner || `සමාන අධ්‍යාපන සුදුසුකම් ඇති, යහපත් ගුණධර්ම සහිත වෛද්‍ය/ඉංජිනේරු/කථිකාචාර්ය/මෘදුකාංග ඉංජිනේරු වැනි ගෞරවනීය රැකියාවක නිරත සහකරුවෙකු/සහකාරියක් සොයයි.`}
                    </p>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-2.5 font-sans">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-blue-500 flex items-center gap-1">
                    <Info size={14} /> Personal Information
                  </h4>

                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs shadow-sm">
                    <div className="bg-slate-100 dark:bg-slate-800/60 px-3.5 py-1.5 font-bold text-[10px] text-slate-600 dark:text-slate-300 uppercase">
                      Basic & Location
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      <div className="flex justify-between p-2.5"><span className="text-slate-500">Ethnicity & Religion</span><span className="font-bold">{profile.ethnicity || 'Sinhalese'} • {profile.religion || 'Buddhist'}</span></div>
                      <div className="flex justify-between p-2.5"><span className="text-slate-500">Caste</span><span className="font-bold">{profile.caste || 'Govigama'}</span></div>
                      <div className="flex justify-between p-2.5"><span className="text-slate-500">Height</span><span className="font-bold">{profile.height || '5.4 ft'}</span></div>
                      <div className="flex justify-between p-2.5"><span className="text-slate-500">Civil Status</span><span className="font-bold">{profile.civilStatus || 'Never Married (අවිවාහක)'}</span></div>
                      <div className="flex justify-between p-2.5"><span className="text-slate-500">Education</span><span className="font-bold">{profile.university || 'University Graduate'}</span></div>
                      <div className="flex justify-between p-2.5"><span className="text-slate-500">Income</span><span className="font-bold text-rose-500">{profile.monthlyIncome || 'Rs 200,000+'}</span></div>
                    </div>
                  </div>
                </div>

                {/* Family Info */}
                <div className="space-y-2.5 font-sans">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-500 flex items-center gap-1">
                    <Users size={14} /> Family Info
                  </h4>

                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs shadow-sm">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      <div className="flex justify-between p-2.5"><span className="text-slate-500">Father's Profession</span><span className="font-bold">{profile.fatherProfession || 'Businessman / Accountant'}</span></div>
                      <div className="flex justify-between p-2.5"><span className="text-slate-500">Mother's Profession</span><span className="font-bold">{profile.motherProfession || 'Teacher / Housewife'}</span></div>
                      <div className="flex justify-between p-2.5"><span className="text-slate-500">Siblings</span><span className="font-bold">{profile.siblings || '1 Brother, 1 Sister'}</span></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Sticky Action Footer Bar */}
            <div className="px-6 py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-4 z-30 font-sans shrink-0">
              <button 
                onClick={handleSendProposal}
                className="w-full max-w-sm py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-xs shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart size={16} fill="white" />
                <span>Send Proposal Request</span>
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
