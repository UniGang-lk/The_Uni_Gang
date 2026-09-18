import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  Heart,
  Star,
  Check,
  Crown,
  Printer,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  ShieldCheck,
  Info,
  Compass,
  User
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  NAKSHATRAS, 
  RASHIS, 
  calculateAstroPorondam, 
  AstroMatchReport 
} from '../utils/astroEngine';

// Visual Image Assets
import astroCoupleHero from '../../../assets/astro_couple_hero.png';
import astroCoupleCard from '../../../assets/astro_couple_card.png';

export default function ProposalAstroHubPage({ setPage }: { setPage: (p: string) => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Form Inputs - Unfilled by Default
  const [brideName, setBrideName] = useState('');
  const [brideDob, setBrideDob] = useState('');
  const [brideTime, setBrideTime] = useState('');
  const [bridePlace, setBridePlace] = useState('');
  const [brideNakId, setBrideNakId] = useState<number | ''>(''); // Unfilled
  const [brideRashiId, setBrideRashiId] = useState<number | ''>(''); // Unfilled
  const [hasKujaBride, setHasKujaBride] = useState(false);

  const [groomName, setGroomName] = useState('');
  const [groomDob, setGroomDob] = useState('');
  const [groomTime, setGroomTime] = useState('');
  const [groomPlace, setGroomPlace] = useState('');
  const [groomNakId, setGroomNakId] = useState<number | ''>(''); // Unfilled
  const [groomRashiId, setGroomRashiId] = useState<number | ''>(''); // Unfilled
  const [hasKujaGroom, setHasKujaGroom] = useState(false);

  // Form Validation & Modal States
  const [formErrors, setFormErrors] = useState<{ 
    brideName?: string; 
    groomName?: string; 
    brideLagna?: string; 
    groomLagna?: string;
    brideNak?: string;
    groomNak?: string;
  }>({});
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'passed' | 'alerts'>('all');

  // Real-time calculation from 20-porondam engine
  const report: AstroMatchReport = useMemo(() => {
    return calculateAstroPorondam(
      brideNakId === '' ? 1 : brideNakId,
      groomNakId === '' ? 2 : groomNakId,
      brideRashiId === '' ? 1 : brideRashiId,
      groomRashiId === '' ? 2 : groomRashiId,
      hasKujaBride,
      hasKujaGroom
    );
  }, [brideNakId, groomNakId, brideRashiId, groomRashiId, hasKujaBride, hasKujaGroom]);

  const filteredItems = useMemo(() => {
    if (filterMode === 'passed') return report.items.filter(i => i.passed);
    if (filterMode === 'alerts') return report.items.filter(i => !i.passed);
    return report.items;
  }, [report.items, filterMode]);

  const passedCount = report.items.filter(i => i.passed).length;
  const alertCount = report.items.filter(i => !i.passed).length;

  const handleCalculateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { 
      brideName?: string; 
      groomName?: string; 
      brideLagna?: string; 
      groomLagna?: string;
      brideNak?: string;
      groomNak?: string;
    } = {};

    if (!brideName.trim()) {
      errors.brideName = 'කරුණාකර මනාලියගේ නම ඇතුළත් කරන්න';
    }
    if (!groomName.trim()) {
      errors.groomName = 'කරුණාකර මනාලයාගේ නම ඇතුළත් කරන්න';
    }
    if (brideRashiId === '') {
      errors.brideLagna = 'කරුණාකර මනාලියගේ ලග්නය තෝරන්න';
    }
    if (groomRashiId === '') {
      errors.groomLagna = 'කරුණාකර මනාලයාගේ ලග්නය තෝරන්න';
    }
    if (brideNakId === '') {
      errors.brideNak = 'කරුණාකර මනාලියගේ නැකත තෝරන්න';
    }
    if (groomNakId === '') {
      errors.groomNak = 'කරුණාකර මනාලයාගේ නැකත තෝරන්න';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsCalculating(true);

    setTimeout(() => {
      setIsCalculating(false);
      setShowResultModal(true);
    }, 1000);
  };

  return (
    <div className={`w-full min-h-screen py-10 px-4 sm:px-6 lg:px-12 font-sinhala transition-colors duration-500 relative overflow-hidden ${
      isDark ? 'bg-[#0B0F17] text-slate-100 selection:bg-purple-500/30' : 'bg-slate-50 text-slate-900 selection:bg-rose-500/20'
    }`}>
      
      {/* ATMOSPHERIC AMBIENT GLOW ORBS FOR GLASSMORPHISM */}
      <div className={`absolute top-10 left-1/4 w-[700px] h-[700px] rounded-full blur-[170px] pointer-events-none transition-all duration-700 ${
        isDark ? 'bg-purple-600/15' : 'bg-purple-300/25'
      }`} />
      <div className={`absolute top-1/3 right-10 w-[600px] h-[600px] rounded-full blur-[170px] pointer-events-none transition-all duration-700 ${
        isDark ? 'bg-rose-500/15' : 'bg-rose-300/25'
      }`} />

      {/* MATCHED CONTAINER WIDTH WITH OTHER SECTIONS (max-w-6xl) */}
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">

        {/* 1. HERO SECTION WITH IMAGE & FLOATING MOTION BADGES */}
        <div className={`rounded-[2.5rem] p-6 sm:p-10 border shadow-2xl backdrop-blur-2xl transition-all duration-300 relative overflow-hidden group ${
          isDark 
            ? 'bg-slate-900/80 border-white/10 text-white' 
            : 'bg-white/80 border-white/80 text-slate-900 shadow-xl'
        }`}>
          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content Side */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-500 font-extrabold text-xs uppercase tracking-wider border border-rose-500/20 backdrop-blur-md">
                <Sparkles size={14} className="animate-pulse text-rose-500" />
                <span>20-Porondam Vedic Engine</span>
              </div>

              <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Astro Match <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500">(ජ්‍යොතිෂ පොරොන්දම් පරීක්ෂාව)</span>
              </h1>

              <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                මනාලයාගේ සහ මනාලියගේ නම, ලග්නය, නැකත හා උපන් ස්ථානය ඇතුළත් කර <strong className="text-rose-500">"පොරොන්දම් පරීක්ෂා කරන්න"</strong> බටන් එක ක්ලික් කරන්න. සම්පූර්ණ 20-පොරොන්දම් වාර්තාව Popup එකක් ලෙස ලබාගන්න.
              </p>

              <div className="space-y-2.5 text-xs font-semibold pt-1">
                <div className={`flex items-center gap-2.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> නැකත් 27 & ලග්න 12 පාරම්පරික විද්‍යාත්මක පරීක්ෂාව
                </div>
                <div className={`flex items-center gap-2.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> කුජ දෝෂ සහ සෙනසුරු ඒරාෂ්ටක දෝෂ භංග වීම්
                </div>
                <div className={`flex items-center gap-2.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> මුද්‍රිත නිවැරදි PDF වාර්තාව Instant Download
                </div>
              </div>
            </div>

            {/* Right Visual Image Side with Floating Motion Badges */}
            <div className="lg:col-span-5 relative h-[300px] sm:h-[340px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-slate-800 group/img">
              <img 
                src={astroCoupleHero} 
                alt="Sri Lankan Astro Couple" 
                className="w-full h-full object-cover object-top opacity-95 group-hover/img:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Floating Badge Top Right */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-xl bg-slate-950/85 border border-amber-400/40 text-amber-300 backdrop-blur-xl shadow-xl flex items-center gap-1.5 text-xs font-black uppercase tracking-wider"
              >
                <Sparkles size={14} className="text-amber-400" />
                <span>100% Traditional Match</span>
              </motion.div>

              {/* Floating Badge Top Left */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-rose-500 text-white shadow-xl flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
              >
                <Heart size={13} fill="currentColor" /> 20-Porondam Engine
              </motion.div>
            </div>

          </div>
        </div>

        {/* 2. DUAL INPUT FORM WITH NEW ULTRA-PROFESSIONAL GLASS CARDS */}
        <form onSubmit={handleCalculateSubmit} className="space-y-8">
          
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* BRIDE EXECUTIVE GLASS CARD (🌸 Modern Pink/Rose Theme) */}
            <div className={`rounded-[2.5rem] border-2 backdrop-blur-2xl shadow-2xl overflow-hidden relative transition-all duration-300 group ${
              isDark 
                ? 'bg-gradient-to-b from-rose-950/20 via-slate-900/90 to-slate-900 border-rose-500/30 text-white shadow-[0_12px_40px_0_rgba(244,63,94,0.15)]' 
                : 'bg-gradient-to-b from-rose-50/80 via-white to-white border-rose-200 text-slate-900 shadow-[0_12px_40px_0_rgba(244,63,94,0.08)]'
            }`}>
              {/* Top Accent Pill Header */}
              <div className="px-6 py-4 bg-rose-500/10 border-b border-rose-500/20 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                    <Heart size={18} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-rose-600 dark:text-rose-300 font-sinhala leading-none">
                      මනාලියගේ විස්තර (Bride)
                    </h3>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      Horoscope Parameters
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-black px-3 py-1 rounded-full bg-rose-500 text-white shadow-sm font-sinhala">
                  මනාලිය
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                
                {/* Bride Name Input */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5 font-sinhala">
                    <User size={13} className="text-rose-500" />
                    <span>මනාලියගේ නම</span> <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={brideName}
                    onChange={(e) => {
                      setBrideName(e.target.value);
                      if (formErrors.brideName) setFormErrors({ ...formErrors, brideName: undefined });
                    }}
                    placeholder="උදා: නිමාලි පෙරේරා"
                    className={`w-full rounded-2xl px-4 py-3 text-xs font-semibold border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors shadow-inner ${
                      formErrors.brideName ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40' : (isDark ? 'bg-slate-950/80 border-rose-500/30 text-white' : 'bg-white border-rose-200 text-slate-900')
                    }`}
                  />
                  {formErrors.brideName && (
                    <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1 mt-1 font-sinhala">
                      <AlertCircle size={12} /> {formErrors.brideName}
                    </span>
                  )}
                </div>

                {/* Lagna (Zodiac Sign) - UNFILLED BY DEFAULT */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5 font-sinhala">
                    <Compass size={13} className="text-rose-500" />
                    <span>ලග්නය (Lagna / Zodiac Sign)</span> <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={brideRashiId}
                    onChange={(e) => {
                      setBrideRashiId(e.target.value ? Number(e.target.value) : '');
                      if (formErrors.brideLagna) setFormErrors({ ...formErrors, brideLagna: undefined });
                    }}
                    className={`w-full rounded-2xl px-4 py-3 text-xs font-semibold border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer shadow-inner ${
                      formErrors.brideLagna ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40' : (isDark ? 'bg-slate-950/80 border-rose-500/30 text-white' : 'bg-white border-rose-200 text-slate-900')
                    }`}
                  >
                    <option value="" className={isDark ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-500'}>
                      -- ලග්නය තෝරන්න (Select Lagna) --
                    </option>
                    {RASHIS.map((r) => (
                      <option key={r.id} value={r.id} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                        {r.nameSinhala}
                      </option>
                    ))}
                  </select>
                  {formErrors.brideLagna && (
                    <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1 mt-1 font-sinhala">
                      <AlertCircle size={12} /> {formErrors.brideLagna}
                    </span>
                  )}
                </div>

                {/* Nakshatra (Unfilled by default with Don't Know Option) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5 font-sinhala">
                    <Star size={13} className="text-amber-400" />
                    <span>උපන් නැකත (Nakshatra)</span> <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={brideNakId}
                    onChange={(e) => {
                      setBrideNakId(e.target.value !== '' ? Number(e.target.value) : '');
                      if (formErrors.brideNak) setFormErrors({ ...formErrors, brideNak: undefined });
                    }}
                    className={`w-full rounded-2xl px-4 py-3 text-xs font-semibold border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer shadow-inner ${
                      formErrors.brideNak ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40' : (isDark ? 'bg-slate-950/80 border-rose-500/30 text-white' : 'bg-white border-rose-200 text-slate-900')
                    }`}
                  >
                    <option value="" className={isDark ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-500'}>
                      -- නැකත තෝරන්න (Select Nakshatra) --
                    </option>
                    {NAKSHATRAS.map((n) => (
                      <option key={n.id} value={n.id} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                        {n.id === 0 ? '✨ 0. දන්නේ නැත (Auto Calculate)' : `${n.id}. ${n.nameSinhala} (${n.name})`}
                      </option>
                    ))}
                  </select>

                  {formErrors.brideNak && (
                    <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1 mt-1 font-sinhala">
                      <AlertCircle size={12} /> {formErrors.brideNak}
                    </span>
                  )}

                  {brideNakId === 0 && (
                    <span className="text-[11px] font-medium text-rose-500 dark:text-rose-400 flex items-start gap-1 mt-1.5 font-sinhala leading-relaxed">
                      <Info size={13} className="shrink-0 mt-0.5" />
                      <span>නැකත දන්නේ නැත්නම් ලග්නය හා උපන් වේලාව අනුව auto-calculate වේ.</span>
                    </span>
                  )}
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1.5 font-sinhala">
                      <Calendar size={13} className="text-rose-500" /> උපන් දිනය
                    </label>
                    <input
                      type="date"
                      value={brideDob}
                      onChange={(e) => setBrideDob(e.target.value)}
                      className={`w-full rounded-2xl px-3 py-2.5 text-xs font-semibold border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer ${
                        isDark ? 'bg-slate-950/80 border-rose-500/30 text-white' : 'bg-white border-rose-200 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1.5 font-sinhala">
                      <Clock size={13} className="text-rose-500" /> උපන් වේලාව
                    </label>
                    <input
                      type="time"
                      value={brideTime}
                      onChange={(e) => setBrideTime(e.target.value)}
                      className={`w-full rounded-2xl px-3 py-2.5 text-xs font-semibold border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer ${
                        isDark ? 'bg-slate-950/80 border-rose-500/30 text-white' : 'bg-white border-rose-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Birth Place / District */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1.5 font-sinhala">
                    <MapPin size={13} className="text-rose-500" /> උපන් ස්ථානය / දිස්ත්‍රික්කය
                  </label>
                  <input
                    type="text"
                    value={bridePlace}
                    onChange={(e) => setBridePlace(e.target.value)}
                    placeholder="උදා: කොළඹ / මහනුවර"
                    className={`w-full rounded-2xl px-4 py-3 text-xs font-semibold border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      isDark ? 'bg-slate-950/80 border-rose-500/30 text-white' : 'bg-white border-rose-200 text-slate-900'
                    }`}
                  />
                </div>

                {/* Kuja Doshaya Check */}
                <div 
                  onClick={() => setHasKujaBride(!hasKujaBride)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between backdrop-blur-md ${
                    hasKujaBride 
                      ? 'bg-rose-500/15 border-rose-400 text-rose-600 dark:text-rose-300' 
                      : (isDark ? 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-rose-500/30' : 'bg-white/80 border-slate-200 text-slate-600 hover:border-rose-300')
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold">
                    <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border ${hasKujaBride ? 'bg-rose-500 text-white border-rose-500' : 'border-slate-400'}`}>
                      {hasKujaBride && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span>මනාලියට කුජ දෝෂය පවතී (Kuja Doshaya)</span>
                  </div>
                </div>

              </div>
            </div>

            {/* GROOM EXECUTIVE GLASS CARD (👔 Modern Indigo/Cyan Theme) */}
            <div className={`rounded-[2.5rem] border-2 backdrop-blur-2xl shadow-2xl overflow-hidden relative transition-all duration-300 group ${
              isDark 
                ? 'bg-gradient-to-b from-indigo-950/20 via-slate-900/90 to-slate-900 border-indigo-500/30 text-white shadow-[0_12px_40px_0_rgba(99,102,241,0.15)]' 
                : 'bg-gradient-to-b from-indigo-50/80 via-white to-white border-indigo-200 text-slate-900 shadow-[0_12px_40px_0_rgba(99,102,241,0.08)]'
            }`}>
              {/* Top Accent Pill Header */}
              <div className="px-6 py-4 bg-indigo-500/10 border-b border-indigo-500/20 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md">
                    <Heart size={18} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-indigo-600 dark:text-indigo-300 font-sinhala leading-none">
                      මනාලයාගේ විස්තර (Groom)
                    </h3>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      Horoscope Parameters
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-black px-3 py-1 rounded-full bg-indigo-500 text-white shadow-sm font-sinhala">
                  මනාලයා
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                
                {/* Groom Name Input */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5 font-sinhala">
                    <User size={13} className="text-indigo-500" />
                    <span>මනාලයාගේ නම</span> <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={groomName}
                    onChange={(e) => {
                      setGroomName(e.target.value);
                      if (formErrors.groomName) setFormErrors({ ...formErrors, groomName: undefined });
                    }}
                    placeholder="උදා: කසුන් බණ්ඩාර"
                    className={`w-full rounded-2xl px-4 py-3 text-xs font-semibold border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors shadow-inner ${
                      formErrors.groomName ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40' : (isDark ? 'bg-slate-950/80 border-indigo-500/30 text-white' : 'bg-white border-indigo-200 text-slate-900')
                    }`}
                  />
                  {formErrors.groomName && (
                    <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1 mt-1 font-sinhala">
                      <AlertCircle size={12} /> {formErrors.groomName}
                    </span>
                  )}
                </div>

                {/* Lagna (Zodiac Sign) - UNFILLED BY DEFAULT */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5 font-sinhala">
                    <Compass size={13} className="text-indigo-500" />
                    <span>ලග්නය (Lagna / Zodiac Sign)</span> <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={groomRashiId}
                    onChange={(e) => {
                      setGroomRashiId(e.target.value ? Number(e.target.value) : '');
                      if (formErrors.groomLagna) setFormErrors({ ...formErrors, groomLagna: undefined });
                    }}
                    className={`w-full rounded-2xl px-4 py-3 text-xs font-semibold border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-inner ${
                      formErrors.groomLagna ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40' : (isDark ? 'bg-slate-950/80 border-indigo-500/30 text-white' : 'bg-white border-indigo-200 text-slate-900')
                    }`}
                  >
                    <option value="" className={isDark ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-500'}>
                      -- ලග්නය තෝරන්න (Select Lagna) --
                    </option>
                    {RASHIS.map((r) => (
                      <option key={r.id} value={r.id} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                        {r.nameSinhala}
                      </option>
                    ))}
                  </select>
                  {formErrors.groomLagna && (
                    <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1 mt-1 font-sinhala">
                      <AlertCircle size={12} /> {formErrors.groomLagna}
                    </span>
                  )}
                </div>

                {/* Nakshatra (Unfilled by default with Don't Know Option) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5 font-sinhala">
                    <Star size={13} className="text-amber-400" />
                    <span>උපන් නැකත (Nakshatra)</span> <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={groomNakId}
                    onChange={(e) => {
                      setGroomNakId(e.target.value !== '' ? Number(e.target.value) : '');
                      if (formErrors.groomNak) setFormErrors({ ...formErrors, groomNak: undefined });
                    }}
                    className={`w-full rounded-2xl px-4 py-3 text-xs font-semibold border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-inner ${
                      formErrors.groomNak ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40' : (isDark ? 'bg-slate-950/80 border-indigo-500/30 text-white' : 'bg-white border-indigo-200 text-slate-900')
                    }`}
                  >
                    <option value="" className={isDark ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-500'}>
                      -- නැකත තෝරන්න (Select Nakshatra) --
                    </option>
                    {NAKSHATRAS.map((n) => (
                      <option key={n.id} value={n.id} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                        {n.id === 0 ? '✨ 0. දන්නේ නැත (Auto Calculate)' : `${n.id}. ${n.nameSinhala} (${n.name})`}
                      </option>
                    ))}
                  </select>

                  {formErrors.groomNak && (
                    <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1 mt-1 font-sinhala">
                      <AlertCircle size={12} /> {formErrors.groomNak}
                    </span>
                  )}

                  {groomNakId === 0 && (
                    <span className="text-[11px] font-medium text-indigo-500 dark:text-indigo-400 flex items-start gap-1 mt-1.5 font-sinhala leading-relaxed">
                      <Info size={13} className="shrink-0 mt-0.5" />
                      <span>නැකත දන්නේ නැත්නම් ලග්නය හා උපන් වේලාව අනුව auto-calculate වේ.</span>
                    </span>
                  )}
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1.5 font-sinhala">
                      <Calendar size={13} className="text-indigo-500" /> උපන් දිනය
                    </label>
                    <input
                      type="date"
                      value={groomDob}
                      onChange={(e) => setGroomDob(e.target.value)}
                      className={`w-full rounded-2xl px-3 py-2.5 text-xs font-semibold border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                        isDark ? 'bg-slate-950/80 border-indigo-500/30 text-white' : 'bg-white border-indigo-200 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1.5 font-sinhala">
                      <Clock size={13} className="text-indigo-500" /> උපන් වේලාව
                    </label>
                    <input
                      type="time"
                      value={groomTime}
                      onChange={(e) => setGroomTime(e.target.value)}
                      className={`w-full rounded-2xl px-3 py-2.5 text-xs font-semibold border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                        isDark ? 'bg-slate-950/80 border-indigo-500/30 text-white' : 'bg-white border-indigo-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Birth Place / District */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1.5 font-sinhala">
                    <MapPin size={13} className="text-indigo-500" /> උපන් ස්ථානය / දිස්ත්‍රික්කය
                  </label>
                  <input
                    type="text"
                    value={groomPlace}
                    onChange={(e) => setGroomPlace(e.target.value)}
                    placeholder="උදා: කොළඹ / මහනුවර"
                    className={`w-full rounded-2xl px-4 py-3 text-xs font-semibold border backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-slate-950/80 border-indigo-500/30 text-white' : 'bg-white border-indigo-200 text-slate-900'
                    }`}
                  />
                </div>

                {/* Kuja Doshaya Check */}
                <div 
                  onClick={() => setHasKujaGroom(!hasKujaGroom)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between backdrop-blur-md ${
                    hasKujaGroom 
                      ? 'bg-indigo-500/15 border-indigo-400 text-indigo-600 dark:text-indigo-300' 
                      : (isDark ? 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-indigo-500/30' : 'bg-white/80 border-slate-200 text-slate-600 hover:border-indigo-300')
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold">
                    <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border ${hasKujaGroom ? 'bg-indigo-500 text-white border-indigo-500' : 'border-slate-400'}`}>
                      {hasKujaGroom && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span>මනාලයාට කුජ දෝෂය පවතී (Kuja Doshaya)</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* SUBMIT CTA BUTTON WITH PROFESSIONAL STYLING */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isCalculating}
              className="w-full sm:w-auto px-10 py-4.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-rose-500/25 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 border-none font-sans"
            >
              {isCalculating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>පොරොන්දම් ගණනය වෙමින් පවතී...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} className="text-amber-300 animate-pulse" />
                  <span>🔮 පොරොන්දම් පරීක්ෂා කරන්න (Calculate Porondam Match)</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* 3. PRICING CARDS */}
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">
              Service Packages
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Astro Membership Packages 💎
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Graphic Showcase Card */}
            <div className="lg:col-span-4 rounded-3xl overflow-hidden relative border border-slate-200 dark:border-slate-800 shadow-xl group min-h-[280px]">
              <img 
                src={astroCoupleCard} 
                alt="Sri Lankan Astro Couple" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6 space-y-1.5 text-white">
                <span className="text-xs font-extrabold text-amber-300 font-sinhala flex items-center gap-1.5">
                  <Sparkles size={14} /> 100% Confidential & Instant PDF
                </span>
                <h4 className="text-base font-bold font-sinhala">
                  ඔබගේ සහ සහකරුගේ නැකත පරීක්ෂා කරගන්න.
                </h4>
                <p className="text-xs text-slate-300 font-sinhala leading-relaxed">
                  VIP members සඳහා සියලුම profiles හි පොරොන්දම් නොමිලේ බැලිය හැක.
                </p>
              </div>
            </div>

            {/* Single Report Card */}
            <div className="lg:col-span-4 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Single Proposal Check
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Single Astro Report</h3>
                  <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">රු. 499/= <span className="text-xs font-normal text-slate-500">/ එක පාරක් පමණයි</span></p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sinhala">
                  ඕනෑම එක් මංගල යෝජනාවක් සඳහා 100%ක් නිවැරදි විසි පොරොන්දම් ගණනය කිරීම හා මුද්‍රිත PDF වාර්තාව ලබාගැනීමට.
                </p>
              </div>

              <button
                onClick={() => alert("Redirecting to Rs. 499 Single Astro Report Checkout...")}
                className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Buy Single Report - Rs. 499/=
              </button>
            </div>

            {/* VIP Pass Card */}
            <div className="lg:col-span-4 p-8 rounded-3xl bg-gradient-to-b from-rose-500/10 via-pink-500/5 to-purple-500/10 dark:from-rose-500/20 dark:via-pink-500/15 dark:to-purple-500/20 border-2 border-rose-500 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
              <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-rose-500 text-white shadow-md flex items-center gap-1">
                <Sparkles size={12} /> Best Value
              </span>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                  VIP Membership Pass
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">VIP Pro Unlimited</h3>
                  <p className="text-3xl font-extrabold text-rose-500 dark:text-rose-400 mt-1">රු. 1,499/= <span className="text-xs font-normal text-slate-500">/ මසකට</span></p>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sinhala">
                  සියලුම Proposal Profiles සඳහා Unlimited Astro Matching, Direct Chat සහ Priority Verification ලබාගැනීමට.
                </p>
              </div>

              <button
                onClick={() => setPage('premium')}
                className="w-full py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-rose-500/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border-none"
              >
                <Crown size={16} /> Upgrade to VIP Pro (Rs. 1,499)
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 4. ULTRA-PROFESSIONAL FULL POPUP MODAL (MATCHING PROPOSALPROFILEMODAL STYLING) */}
      <AnimatePresence>
        {showResultModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md font-sinhala"
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`w-full max-h-[92vh] max-w-4xl rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-2xl border transition-colors ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Top Bar Header Controls */}
              <div className="px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-20 shrink-0">
                <button 
                  onClick={() => setShowResultModal(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronDown size={20} />
                </button>
                
                <div className="text-center flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {brideName} ❤️ {groomName}
                  </span>
                  <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20 uppercase tracking-widest">
                    VERIFIED HOROSCOPE
                  </span>
                  <ShieldCheck size={16} className="text-emerald-500" />
                </div>

                <div className="w-9 h-9" />
              </div>

              {/* Scrollable Modal Content */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">

                {/* Identity Summary Card */}
                <div className="grid grid-cols-2 gap-4 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest">මනාලිය (BRIDE)</span>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{brideName}</h4>
                    <p className="text-slate-600 dark:text-slate-400">ලග්නය: <strong className="text-slate-900 dark:text-white font-bold">{report.brideRashi.nameSinhala}</strong></p>
                    <p className="text-slate-600 dark:text-slate-400">නැකත: <strong className="text-slate-900 dark:text-white font-bold">{report.brideNakshatra.nameSinhala}</strong> ({report.brideNakshatra.name})</p>
                    {bridePlace && <p className="text-slate-500 text-[11px] flex items-center gap-1"><MapPin size={11} className="text-rose-500" /> {bridePlace}</p>}
                    {brideDob && <p className="text-slate-500 text-[11px] flex items-center gap-1"><Calendar size={11} /> {brideDob} {brideTime && `(${brideTime})`}</p>}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest">මනාලයා (GROOM)</span>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{groomName}</h4>
                    <p className="text-slate-600 dark:text-slate-400">ලග්නය: <strong className="text-slate-900 dark:text-white font-bold">{report.groomRashi.nameSinhala}</strong></p>
                    <p className="text-slate-600 dark:text-slate-400">නැකත: <strong className="text-slate-900 dark:text-white font-bold">{report.groomNakshatra.nameSinhala}</strong> ({report.groomNakshatra.name})</p>
                    {groomPlace && <p className="text-slate-500 text-[11px] flex items-center gap-1"><MapPin size={11} className="text-indigo-500" /> {groomPlace}</p>}
                    {groomDob && <p className="text-slate-500 text-[11px] flex items-center gap-1"><Calendar size={11} /> {groomDob} {groomTime && `(${groomTime})`}</p>}
                  </div>
                </div>

                {/* Verdict Score Banner */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md">
                      ★ 20-PORONDAM MATCH VERDICT
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black flex items-center justify-center sm:justify-start gap-3">
                      <span>{report.totalMatched} / 20</span>
                      <span className="text-lg font-bold text-rose-100 font-sinhala">{report.verdict}</span>
                    </h2>
                    <p className="text-xs text-rose-100 max-w-xl font-sinhala leading-relaxed">
                      {report.kujaDoshayaStatus}
                    </p>
                  </div>

                  {/* Score Gauge Circle */}
                  <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex flex-col items-center justify-center shrink-0 shadow-lg">
                    <span className="text-2xl font-black text-white">{report.percentage}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-rose-100">Score</span>
                  </div>
                </div>

                {/* Porondam Items Breakdown Table */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-sinhala flex items-center gap-2">
                      <Sparkles size={16} className="text-rose-500" />
                      <span>විසි පොරොන්දම් ලැයිස්තු විග්‍රහය (Full Breakdown)</span>
                    </h4>
                    
                    <div className="flex gap-2 text-xs font-bold font-sinhala">
                      <button 
                        onClick={() => setFilterMode('all')}
                        className={`px-3 py-1.5 rounded-xl transition-all ${filterMode === 'all' ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                      >
                        සියල්ල ({report.items.length})
                      </button>
                      <button 
                        onClick={() => setFilterMode('passed')}
                        className={`px-3 py-1.5 rounded-xl transition-all ${filterMode === 'passed' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                      >
                        සාර්ථකයි ({passedCount})
                      </button>
                      <button 
                        onClick={() => setFilterMode('alerts')}
                        className={`px-3 py-1.5 rounded-xl transition-all ${filterMode === 'alerts' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                      >
                        අවධානය ({alertCount})
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                    {filteredItems.map((item, idx) => (
                      <div 
                        key={item.title}
                        className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 text-xs transition-all ${
                          item.passed 
                            ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200' 
                            : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="font-extrabold text-slate-400 w-5 shrink-0 text-xs">{idx + 1}.</span>
                          <div className="space-y-1">
                            <h4 className="font-bold text-xs font-sinhala text-slate-900 dark:text-white flex items-center gap-1">
                              <span>{item.titleSinhala}</span>
                              <span className="text-[10px] text-slate-400 font-normal">({item.title})</span>
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sinhala leading-relaxed">{item.details}</p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 border ${
                          item.passed ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        }`}>
                          {item.passed ? '✔ Pass' : '✖ Alert'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Action Footer Bar */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 font-sinhala">
                <button
                  onClick={() => setShowResultModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer transition-colors"
                >
                  වසා දමන්න (Close)
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-7 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-500/25 transition-all border-none font-sans"
                >
                  <Printer size={16} /> PDF ලෙස Print / Save කරන්න
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
