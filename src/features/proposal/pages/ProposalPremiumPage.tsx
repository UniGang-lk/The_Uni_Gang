import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Crown, CheckCircle2, Star, Sparkles, Heart, Lock, X, 
  UploadCloud, FileImage, CreditCard, ShieldCheck, Copy, Check, Eye, 
  RotateCcw, Bookmark, MessageSquare, Compass, HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { proposalApi } from '../api/proposalApi';
import { useTheme } from '../../../context/ThemeContext';

interface ProposalPremiumPageProps {
  setPage: (p: string) => void;
  previousView?: string;
  initialPlan?: 'classic_3m' | 'vip_6m' | null;
}

export default function ProposalPremiumPage({ 
  setPage, 
  previousView = 'dashboard',
  initialPlan = null
}: ProposalPremiumPageProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showPaymentModal, setShowPaymentModal] = useState(!!initialPlan);
  const [selectedPlan, setSelectedPlan] = useState<'classic_3m' | 'vip_6m'>(initialPlan || 'classic_3m');
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  useEffect(() => {
    if (initialPlan) {
      setSelectedPlan(initialPlan);
      setShowPaymentModal(true);
    }
  }, [initialPlan]);

  const [paymentData, setPaymentData] = useState({
    date: '',
    reference: '',
    whatsapp: ''
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = (text: string, bankName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bankName);
    toast.success(`Copied ${bankName} account number!`);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  const handleOpenPayment = (plan: 'classic_3m' | 'vip_6m') => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentData.date || !paymentData.whatsapp || !receiptFile) {
      toast.error("Please fill all required fields and upload your transfer slip.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('plan', selectedPlan);
      formData.append('amount', selectedPlan === 'vip_6m' ? '4990' : '2990');
      formData.append('payment_date', paymentData.date);
      formData.append('reference_number', paymentData.reference);
      formData.append('whatsapp_number', paymentData.whatsapp);
      formData.append('receipt', receiptFile);

      const res = await proposalApi.submitPayment(formData);
      
      if (res.success) {
        toast.success("Payment slip submitted! An administrator will activate your membership shortly. 👑");
        setShowPaymentModal(false);
        setPage('dashboard');
      } else {
        toast.error(res.message || "Failed to submit payment");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const basicFeatures = [
    { text: "සම්පූර්ණ Bio-Data පැතිකඩක් සකස් කිරීම", included: true },
    { text: "Admin-Only NIC සත්‍යාපන ලාංඡනය (100% Confidential)", included: true },
    { text: "Managed By Badge (🎓 Self හෝ 👨‍👩‍👧‍👦 By Parents)", included: true },
    { text: "පෙරනිමි Blurred ඡායාරූප & Screenshot Guard", included: true },
    { text: "දිනකට Profiles 10ක් දක්වා සෙවීම", included: true },
    { text: "මසකට Proposals 3ක් යැවීම", included: true },
    { text: "අන් අය එවන Proposals නොමිලේම ලැබීම & Accept කිරීම", included: true },
    { text: "Mutual Match වූ පසු මූලික In-App Messages 10ක්", included: true },
    { text: "ආචාරශීලී සිංහල Icebreaker Presets භාවිතය", included: true },
    { text: "Who Liked You (තමන්ට කැමති වූ අය බැලීම)", included: false },
    { text: "Shortlist & Private Family Notes", included: false },
    { text: "Read Receipts (Seen ✓✓ Status)", included: false },
    { text: "Rewind / Undo Last Pass", included: false }
  ];

  const classicFeatures = [
    { text: "Basic හි සියලු පහසුකම්", included: true },
    { text: "Unlimited Profiles & Proposals (කිසිදු දෛනික සීමාවක් නැත)", included: true },
    { text: "Unlimited Real-Time In-App Chat (Match වූ පසු)", included: true },
    { text: "Who Liked You Unlocked (කැමති වූ අය දැක ක්ෂණික Match)", included: true },
    { text: "Read Receipts (Seen ✓✓ නිල් හරි සලකුණු)", included: true },
    { text: "Shortlist Profiles 25ක් දක්වා සුරැකීම + Private Family Notes", included: true },
    { text: "Rewind / Undo Last Pass (දිනකට 5ක්)", included: true },
    { text: "විස්තරාත්මක කේන්දර ගැලපීම් (Horoscope Insights)", included: true },
    { text: "2x Profile Visibility Boost (Discover Feed හි කැපී පෙනීම)", included: true },
    { text: "Zero External Leakage (Personal Phone ආරක්ෂිතව රඳවා තැබීම)", included: true }
  ];

  const vipFeatures = [
    { text: "Classic හි සියලුම පහසුකම්", included: true },
    { text: "මාස 6ක දීර්ඝ වලංගු කාලය (දින 180 - නිදහසේ සහකරු සෙවීම)", included: true },
    { text: "5x Top Search Placement (සැමවිටම Discover Feed හි ඉහළින්ම)", included: true },
    { text: "Exclusive Gold VIP Ring & Verified Badge", included: true },
    { text: "🕶️ Incognito / Ghost Mode (අන් අයට නොපෙනී Profiles නැරඹීම)", included: true },
    { text: "Unlimited Shortlists & Private Notes", included: true },
    { text: "Unlimited Rewinds / Undos", included: true },
    { text: "සම්පූර්ණ කේන්දරය & පොරොන්දම් 20 විග්‍රහ වාර්තාව", included: true },
    { text: "Priority VIP Admin Concierge (WhatsApp ඍජු සහයෝගය)", included: true }
  ];

  return (
    <div className={`w-full min-h-[calc(100vh-80px)] pb-28 relative overflow-hidden font-sans transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Background Ambient Glows */}
      <div className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none ${
        isDark ? 'bg-amber-500/10' : 'bg-amber-400/20'
      }`} />
      <div className={`absolute top-60 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none ${
        isDark ? 'bg-orange-600/10' : 'bg-orange-400/15'
      }`} />
      <div className={`absolute -bottom-20 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none ${
        isDark ? 'bg-emerald-500/5' : 'bg-rose-400/10'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 relative z-10">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={() => {
              if (previousView === 'landing' || previousView === 'home') setPage('landing');
              else if (previousView === 'discover') setPage('discover');
              else setPage('dashboard');
            }} 
            className={`flex items-center gap-2 text-sm font-bold transition-colors group cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to {previousView === 'landing' || previousView === 'home' ? 'Home' : previousView === 'discover' ? 'Discover' : 'Dashboard'}</span>
          </button>

          <a 
            href="https://wa.me/94724478148?text=Hello%20Uni%20Gang%20Admin,%20I%20have%20a%20question%20about%20Proposal%20Membership"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-500/30 transition-all cursor-pointer"
          >
            <HelpCircle size={14} /> Official Admin Support (WhatsApp)
          </a>
        </div>

        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative">
          
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-10 -left-6 hidden md:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white items-center justify-center shadow-xl shadow-amber-500/20 rotate-12"
          >
            <Crown size={28} />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute top-16 -right-6 hidden md:flex w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 text-white items-center justify-center shadow-xl shadow-amber-500/20 -rotate-12"
          >
            <Heart size={24} fill="currentColor" />
          </motion.div>

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 text-amber-500 mb-6 border border-amber-500/20 shadow-[0_0_35px_rgba(245,158,11,0.25)] relative">
            <Crown size={40} className="drop-shadow-lg" />
            <Sparkles size={20} className="absolute -top-1 -right-1 text-amber-400 animate-pulse" />
          </div>

          <h1 className={`text-3xl sm:text-5xl font-black mb-4 tracking-tight drop-shadow-sm ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Uni Porondam <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500">Membership Plans</span>
          </h1>
          <p className={`text-base font-medium max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            ශ්‍රී ලංකාවේ විශ්වවිද්‍යාල උපාධිධාරීන් සහ පවුල් සඳහා සුරක්ෂිත, ගෞරවනීය සහ විනිවිදභාවයෙන් යුතු විවාහ යෝජනා සේවාව. කිසිදු රහස්‍ය micro-payment උගුල් නැත.
          </p>

          {/* Privacy Guarantee Pill */}
          <div className={`mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-full px-5 py-2 text-xs font-semibold border ${
            isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
          }`}>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"><ShieldCheck size={16} /> 100% In-App Secure Chat</span>
            <span className="text-slate-400">•</span>
            <span>Zero External Phone Number Leaks</span>
            <span className="text-slate-400">•</span>
            <span className="text-amber-500 font-bold">One-time Bank Transfer (No Auto Debits)</span>
          </div>
        </div>

        {/* 3-TIER PRICING CARDS */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          
          {/* TIER 1: BASIC (FREE FOREVER) */}
          <div className={`p-8 rounded-[2.2rem] backdrop-blur-md border flex flex-col justify-between relative transition-all ${
            isDark 
              ? 'bg-slate-900/60 border-slate-800 text-white hover:border-slate-700' 
              : 'bg-white border-slate-200 text-slate-900 shadow-xl hover:border-slate-300'
          }`}>
            <div>
              <div className="mb-6">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  isDark ? 'text-slate-400 bg-slate-800/80 border-slate-700' : 'text-slate-600 bg-slate-100 border-slate-200'
                }`}>
                  🥉 Basic Tier
                </span>
                <h3 className="text-2xl font-black mt-3 mb-1">Free Forever</h3>
                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>මූලිකව සොයා බැලීමට කැමති සාමාජිකයින්ට</p>
                <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className={`text-3xl sm:text-4xl font-black whitespace-nowrap ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>රු. 0</span>
                  <span className="text-xs font-bold text-slate-500 whitespace-nowrap">/ ජීවිත කාලයටම</span>
                </div>
              </div>

              <div className={`border-t pt-6 mb-6 ${isDark ? 'border-slate-800/70' : 'border-slate-100'}`}>
                <ul className="space-y-3.5">
                  {basicFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {f.included ? (
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <Lock size={16} className={`shrink-0 mt-0.5 opacity-60 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                      )}
                      <span className={`text-xs font-medium leading-relaxed ${
                        f.included 
                          ? isDark ? 'text-slate-300' : 'text-slate-700' 
                          : isDark ? 'text-slate-600 line-through' : 'text-slate-400 line-through'
                      }`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={`pt-6 border-t ${isDark ? 'border-slate-800/50' : 'border-slate-100'}`}>
              <button 
                onClick={() => setPage('discover')}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                Browse Free Profiles
              </button>
            </div>
          </div>

          {/* TIER 2: CLASSIC (MOST POPULAR - 3 MONTHS) */}
          <div className="relative p-1 rounded-[2.3rem] group">
            {/* Glowing Accent Border */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-[2.3rem] opacity-90 blur-[1px] transition-opacity" />
            
            <div className={`relative p-8 rounded-[2.2rem] flex flex-col justify-between h-full overflow-hidden transition-all ${
              isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900 shadow-2xl'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                    isDark ? 'text-amber-300 bg-amber-500/20 border-amber-500/30' : 'text-amber-700 bg-amber-100 border-amber-300'
                  }`}>
                    🥈 Classic Tier
                  </span>
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Most Popular ⭐
                  </span>
                </div>

                <div className="mb-6 relative z-10">
                  <h3 className="text-2xl font-black text-amber-500 mt-2 mb-1 flex items-center gap-1.5">
                    Classic Plan <Star size={18} fill="currentColor" />
                  </h3>
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>සක්‍රීයව සහකරු/සහකාරිය සොයන උපාධිධාරීන්ට</p>
                  
                  <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className={`text-3xl sm:text-4xl font-black drop-shadow-sm whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-950'}`}>රු. 2,990</span>
                    <span className={`text-xs font-bold whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/ මාස 3 (දින 90)</span>
                  </div>
                  <p className="text-[11px] font-bold text-emerald-500 dark:text-emerald-400 mt-1 whitespace-nowrap">~ රු. 997 / මසකට පමණි</p>
                </div>

                <div className={`border-t pt-6 mb-6 relative z-10 ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
                  <ul className="space-y-3.5">
                    {classicFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-amber-500 shrink-0 mt-0.5 drop-shadow-sm" />
                        <span className={`text-xs font-semibold leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={`pt-6 border-t relative z-10 ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
                <button 
                  onClick={() => handleOpenPayment('classic_3m')}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white text-sm font-black shadow-lg shadow-amber-500/25 transition-all transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  Choose Classic (රු. 2,990) <Crown size={18} />
                </button>
                <p className={`text-center text-[10px] font-medium mt-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Manual Bank Transfer • Zero Hidden Fees</p>
              </div>
            </div>
          </div>

          {/* TIER 3: VIP PREMIUM (BEST VALUE - 6 MONTHS) */}
          <div className={`p-8 rounded-[2.2rem] border flex flex-col justify-between relative transition-all shadow-xl ${
            isDark 
              ? 'bg-gradient-to-b from-slate-900/90 to-slate-950 border-amber-500/30 text-white shadow-amber-950/20 hover:border-amber-500/60' 
              : 'bg-gradient-to-b from-amber-50/40 via-white to-white border-2 border-amber-400/80 text-slate-900 shadow-amber-500/10 hover:border-amber-500'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  isDark ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-amber-700 bg-amber-100 border-amber-300'
                }`}>
                  🥇 VIP Tier
                </span>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                  isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  Best Value 👑
                </span>
              </div>

              <div className="mb-6">
                <h3 className={`text-2xl font-black mt-2 mb-1 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  VIP Premium <Sparkles size={18} className="text-amber-500" />
                </h3>
                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>ස්ථිර තීරණයක් අපේක්ෂා කරන පවුල් & වෘත්තිකයින්ට</p>

                <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className={`text-3xl sm:text-4xl font-black whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-950'}`}>රු. 4,990</span>
                  <span className={`text-xs font-bold whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/ මාස 6 (දින 180)</span>
                </div>
                <p className="text-[11px] font-bold text-amber-500 dark:text-amber-400 mt-1 whitespace-nowrap">~ රු. 830 / මසකට පමණි (30% Saving)</p>
              </div>

              <div className={`border-t pt-6 mb-6 ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
                <ul className="space-y-3.5">
                  {vipFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-amber-500 shrink-0 mt-0.5" />
                      <span className={`text-xs font-semibold leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={`pt-6 border-t ${isDark ? 'border-slate-800/50' : 'border-slate-100'}`}>
              <button 
                onClick={() => handleOpenPayment('vip_6m')}
                className={`w-full py-4 px-6 rounded-xl text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/30 hover:border-amber-400' 
                    : 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-slate-900 shadow-md hover:scale-[1.01]'
                }`}
              >
                Choose VIP (රු. 4,990) <Crown size={18} />
              </button>
              <p className={`text-center text-[10px] font-medium mt-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Priority WhatsApp Verification Concierge</p>
            </div>
          </div>

        </div>

        {/* CULTURAL & SAFETY VALUES SECTION */}
        <div className={`mt-20 max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 border ${
          isDark ? 'bg-slate-900/40 border-slate-800/80 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
        }`}>
          <h2 className={`text-xl sm:text-2xl font-black text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            අපගේ ආරක්ෂිත හා සංස්කෘතික ප්‍රතිපත්ති (Our Safety Guarantees)
          </h2>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
                <ShieldCheck size={22} />
              </div>
              <h3 className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>No WhatsApp Contact Leaks</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                කාන්තාවන්ගේ පෞද්ගලිකත්වය සුරැකීමට පුද්ගලික දුරකථන අංක බාහිරව හෙළි නොකෙරේ. සන්නිවේදනය අපගේ In-App Chat එකෙන් පමණි.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
                <Bookmark size={22} />
              </div>
              <h3 className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>Managed By Parents Badge</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                දෙමව්පියන් විසින් මෙහෙයවනු ලබන Bio-data සඳහා විශේෂ ලාංඡනය හිමිවන අතර පවුලේ වැඩිහිටියන්ට සෘජුව මැදිහත් විය හැක.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                <CreditCard size={22} />
              </div>
              <h3 className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>No Recurring Card Traps</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                මාසිකව නොදැනුවත්ව කාඩ්පත් වලින් මුදල් කැපෙන හොර උගුල් නැත. Bank Slip Upload එකෙන් පමණක් සක්‍රීය වන සෘජු ක්‍රමයකි.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* MANUAL BANK TRANSFER PAYMENT MODAL */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md" 
              onClick={() => !isSubmitting && setShowPaymentModal(false)} 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative w-full max-w-xl border rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh] ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Modal Header */}
              <div className={`p-6 border-b flex items-center justify-between ${
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <div>
                  <h3 className={`text-xl font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <CreditCard className="text-amber-500" /> Manual Bank Transfer
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    BOC (ලංකා බැංකුව) හෝ NSB (ජාතික ඉතිරි කිරීමේ බැංකුව) ගිණුමට තැන්පත් කර Slip එක upload කරන්න
                  </p>
                </div>
                <button 
                  onClick={() => !isSubmitting && setShowPaymentModal(false)} 
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <X size={22} />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Plan Selector Inside Modal */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>තෝරාගත් Package එක</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPlan('classic_3m')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedPlan === 'classic_3m'
                          ? 'bg-amber-500/15 border-amber-500'
                          : isDark 
                            ? 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-amber-500">Classic (මාස 3)</span>
                        {selectedPlan === 'classic_3m' && <Check size={16} className="text-amber-500" />}
                      </div>
                      <span className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>රු. 2,990</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPlan('vip_6m')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedPlan === 'vip_6m'
                          ? 'bg-amber-500/15 border-amber-500'
                          : isDark 
                            ? 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-amber-500">VIP (මාස 6) 👑</span>
                        {selectedPlan === 'vip_6m' && <Check size={16} className="text-amber-500" />}
                      </div>
                      <span className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>රු. 4,990</span>
                    </button>
                  </div>
                </div>

                {/* Bank Account Details Cards */}
                <div className="space-y-3">
                  <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    අපගේ නිල බැංකු ගිණුම් විස්තර
                  </p>
                  
                  {/* Bank of Ceylon (BOC) */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-500">Bank of Ceylon (BOC)</span>
                        <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Polgahawela Branch</span>
                      </div>
                      <p className={`text-sm font-black tracking-wider mt-0.5 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        89190289
                      </p>
                      <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>P.N.D.M.Bandara</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('89190289', 'Bank of Ceylon')}
                      className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                        isDark 
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white' 
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                      title="Copy Account Number"
                    >
                      {copiedBank === 'Bank of Ceylon' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                  </div>

                  {/* National Savings Bank (NSB) */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-500 dark:text-blue-400">National Savings Bank (NSB)</span>
                        <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Polgahawela Branch</span>
                      </div>
                      <p className={`text-sm font-black tracking-wider mt-0.5 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        300110194254
                      </p>
                      <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>P.N.D.M.Bandara</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('300110194254', 'National Savings Bank')}
                      className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                        isDark 
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white' 
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                      title="Copy Account Number"
                    >
                      {copiedBank === 'National Savings Bank' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submission Form */}
                <form id="payment-form" onSubmit={handlePaymentSubmit} className="space-y-4 pt-2">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        තැන්පත් කළ දිනය & වේලාව *
                      </label>
                      <input 
                        type="datetime-local" 
                        required
                        value={paymentData.date}
                        onChange={e => setPaymentData({...paymentData, date: e.target.value})}
                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 transition-colors border ${
                          isDark 
                            ? 'bg-slate-950 border-slate-800 text-white' 
                            : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        බැංකු Reference / Remarks
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. TR-9201 හෝ 'Uni Porondam'"
                        value={paymentData.reference}
                        onChange={e => setPaymentData({...paymentData, reference: e.target.value})}
                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 transition-colors border ${
                          isDark 
                            ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-600' 
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      ඔබගේ WhatsApp අංකය *
                    </label>
                    <input 
                      type="tel" 
                      required
                      placeholder="07X XXX XXXX"
                      value={paymentData.whatsapp}
                      onChange={e => setPaymentData({...paymentData, whatsapp: e.target.value})}
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500 transition-colors border ${
                        isDark 
                          ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-600' 
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                      }`}
                    />
                    <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      Slip පරීක්ෂාවේදී ගැටළුවක් ඇති වුවහොත් පමණක් Admin විසින් WhatsApp හරහා සම්බන්ධ කරගනු ඇත.
                    </p>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Transfer Slip ඡායාරූපය / Receipt *
                    </label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        isDark 
                          ? 'bg-slate-950 border-slate-800 hover:border-amber-500 hover:bg-slate-900/50' 
                          : 'bg-slate-50 border-slate-300 hover:border-amber-500 hover:bg-amber-50/20'
                      }`}
                    >
                      {receiptFile ? (
                        <>
                          <FileImage size={28} className="text-amber-500 mb-1" />
                          <p className={`font-bold text-xs truncate max-w-[80%] ${isDark ? 'text-white' : 'text-slate-900'}`}>{receiptFile.name}</p>
                          <span className="text-[10px] text-emerald-500 mt-0.5">Click to change file</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={28} className="text-slate-400 mb-1" />
                          <p className={`font-bold text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>බැංකු Slip පත්‍රිකාව මෙතැනට Upload කරන්න</p>
                          <span className="text-[10px] text-slate-400">JPG, PNG හෝ PDF (Max 10MB)</span>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*,application/pdf"
                      required
                      onChange={e => {
                        if (e.target.files?.[0]) setReceiptFile(e.target.files[0]);
                      }}
                    />
                  </div>

                  {/* Direct WhatsApp Concierge Alternative */}
                  <div className="pt-2 text-center">
                    <div className="flex items-center gap-3 my-2">
                      <div className={`h-[1px] flex-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>හෝ කෙලින්ම WhatsApp කරන්න</span>
                      <div className={`h-[1px] flex-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                    </div>
                    <a
                      href={`https://wa.me/94724478148?text=Hello%20Uni%20Gang%20Admin,%20I%20have%20transferred%20the%20payment%20for%20Proposal%20${selectedPlan === 'vip_6m' ? 'VIP%20Plan%20(Rs.%204,990)' : 'Classic%20Plan%20(Rs.%202,990)'}.%20Here%20is%20my%20bank%20slip.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-500/30 transition-all cursor-pointer"
                    >
                      <MessageSquare size={15} />
                      <span>ස්ලිප්පත කෙලින්ම WhatsApp මගින් Admin ට එවන්න</span>
                    </a>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className={`p-6 border-t flex gap-3 ${
                isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-100 bg-slate-50'
              }`}>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer ${
                    isDark 
                      ? 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700' 
                      : 'text-slate-700 hover:text-slate-950 bg-slate-200 hover:bg-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="payment-form"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 font-black bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all flex justify-center items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  ) : (
                    `Submit Slip (${selectedPlan === 'vip_6m' ? 'රු. 4,990' : 'රු. 2,990'})`
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
