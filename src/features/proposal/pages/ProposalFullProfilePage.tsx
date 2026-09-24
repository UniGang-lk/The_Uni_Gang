import { useState } from 'react';
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
  Crown
} from 'lucide-react';
import { cx, PrimaryButton } from '../components/ui/ProposalPrimitives';
import { WatermarkOverlay } from '../components/privacy/WatermarkOverlay';

export default function ProposalFullProfilePage({ 
  profile, 
  goBack, 
  onSendProposal 
}: { 
  profile: any;
  goBack: () => void;
  onSendProposal?: () => void;
}) {
  const [proposalSent, setProposalSent] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleConnect = () => {
    setProposalSent(true);
    if (onSendProposal) onSendProposal();
  };

  if (!profile) return null;

  // Guarantee 3 images for the candidate gallery
  const allImages = [
    ...(profile.images || []),
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  ].slice(0, 3);

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
        
        <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-sm font-sans">
          <span>{profile.name}</span>
          <span className="text-xs font-black text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
            {profile.code || 'BR000158'}
          </span>
          {profile.isVerified && <ShieldCheck size={16} className="text-blue-500" />}
        </div>
        
        <div className="w-9" />
      </div>

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
                  className={cx("w-full h-full object-cover transition-all duration-500", profile.blurPhoto && "blur-xl")}
                />
              </WatermarkOverlay>

              {/* Photo Count Badge */}
              <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white border border-white/20 flex items-center gap-1">
                <Camera size={12} /> Photo {selectedImageIndex + 1} of {allImages.length}
              </div>
            </div>

            {/* 3 Photos Thumbnail Switcher Row */}
            <div className="flex items-center justify-center gap-3 mt-3">
              {allImages.map((imgUrl, idx) => (
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
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
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
                  {profile.isVIP && (
                    <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-yellow-200/90 shadow-sm inline-flex items-center gap-1 font-sans">
                      <Crown size={11} className="fill-slate-950 text-slate-950 shrink-0" /> VIP
                    </span>
                  )}
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
                  <PrimaryButton onClick={handleConnect} icon={MessageCircle} className="w-full py-3.5 text-xs shadow-xl shadow-rose-500/20 font-bold">
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
                  { label: 'Ethnicity', value: profile.ethnicity || 'Sinhalese' },
                  { label: 'Religion', value: profile.religion || 'Buddhist' },
                  { label: 'Caste', value: profile.caste || 'Govigama' },
                  { label: 'Height (ft)', value: profile.height || '5.4 ft' },
                  { label: 'Age', value: `${profile.age || 31} years` },
                  { label: 'Civil Status', value: profile.civilStatus || 'Never Married (අවිවාහක)' },
                  { label: 'Drinking Habits', value: (profile.social_drinking_level || profile.drinkingStatus || 'Non-drinker').replace(/[^\w\s\/-]/g, '').trim() },
                  { label: 'Smoking Habits', value: (profile.smokingStatus || 'Non-smoker').replace(/[^\w\s\/-]/g, '').trim() },
                  { label: 'Food / Diet Preference', value: (profile.dietaryPreference || profile.diet || 'Non-Vegetarian').replace(/[^\w\s\/-]/g, '').trim() },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center px-5 py-2.5 font-sans">
                    <span className="font-semibold text-slate-500">{row.label}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{row.value}</span>
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
                  <div className="flex justify-between p-3"><span className="text-slate-500">District</span><span className="font-bold">{profile.district || 'Colombo'}</span></div>
                  <div className="flex justify-between p-3"><span className="text-slate-500">Hometown</span><span className="font-bold">{profile.hometown || 'Colombo 1'}</span></div>
                </div>
              </div>

              {/* Education Block */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs shadow-sm">
                <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-2 font-bold text-[11px] text-slate-600 dark:text-slate-300 uppercase flex items-center gap-1">
                  <GraduationCap size={14} className="text-indigo-500" /> Education & Career
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <div className="flex justify-between p-3"><span className="text-slate-500">Education</span><span className="font-bold truncate max-w-[130px]">{profile.university || 'University Degree'}</span></div>
                  <div className="flex justify-between p-3"><span className="text-slate-500">Profession</span><span className="font-bold">{profile.profession || 'Lecturer'}</span></div>
                  <div className="flex justify-between p-3"><span className="text-slate-500">Income</span><span className="font-bold text-rose-500">{profile.monthlyIncome || 'Rs 200,000+'}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. FAMILY INFORMATION (පවුලේ විස්තර) */}
          <div className="space-y-3 font-sans">
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <Users size={16} /> Family Information
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              
              {/* Father */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs shadow-sm">
                <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-2 font-bold text-[11px] text-amber-600 dark:text-amber-400 uppercase">
                  FATHER
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <div className="flex justify-between p-3"><span className="text-slate-500">Ethnicity</span><span className="font-bold">{profile.fatherEthnicity || 'Sinhalese'}</span></div>
                  <div className="flex justify-between p-3"><span className="text-slate-500">Religion</span><span className="font-bold">{profile.fatherReligion || 'Buddhist'}</span></div>
                  <div className="flex justify-between p-3"><span className="text-slate-500">Profession</span><span className="font-bold">{profile.fatherProfession || 'Businessman'}</span></div>
                  <div className="flex justify-between p-3"><span className="text-slate-500">Status</span><span className="font-bold text-slate-800 dark:text-slate-200">{profile.fatherStatus || 'Deceased / Retired'}</span></div>
                </div>
              </div>

              {/* Mother */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs shadow-sm">
                <div className="bg-slate-100 dark:bg-slate-800/60 px-4 py-2 font-bold text-[11px] text-pink-600 dark:text-pink-400 uppercase">
                  MOTHER
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <div className="flex justify-between p-3"><span className="text-slate-500">Ethnicity</span><span className="font-bold">{profile.motherEthnicity || 'Sinhalese'}</span></div>
                  <div className="flex justify-between p-3"><span className="text-slate-500">Religion</span><span className="font-bold">{profile.motherReligion || 'Buddhist'}</span></div>
                  <div className="flex justify-between p-3"><span className="text-slate-500">Profession</span><span className="font-bold">{profile.motherProfession || 'Teacher / Housewife'}</span></div>
                  <div className="flex justify-between p-3"><span className="text-slate-500">Country</span><span className="font-bold">{profile.motherCountry || 'Sri Lanka'}</span></div>
                </div>
              </div>
            </div>

            {/* Siblings */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-xs flex justify-between items-center shadow-sm">
              <span className="font-semibold text-slate-500">Siblings & Status</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile.siblings || '1 Brother, 1 Sister (Respectable Family)'}</span>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
