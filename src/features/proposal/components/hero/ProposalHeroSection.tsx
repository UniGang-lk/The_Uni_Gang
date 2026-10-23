import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, ShieldCheck, Lock, Heart, ArrowRight, Sparkles, BadgeCheck,
  GraduationCap, Briefcase, Plane, Store, Star, Users,
} from 'lucide-react';
import heroCouple from '../../../../assets/proposal-hero-couple.jpg';

interface ProposalHeroSectionProps {
  onGetStarted: () => void;
  onSearch?: (filters: any) => void;
  hasProposalProfile?: boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const CATEGORIES = [
  { id: 'campus', label: 'Campus', sub: 'Undergrads & Grads', icon: GraduationCap, tone: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-300' },
  { id: 'working', label: 'Working', sub: 'Professionals', icon: Briefcase, tone: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-300' },
  { id: 'abroad', label: 'Abroad', sub: 'Living overseas', icon: Plane, tone: 'text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-300' },
  { id: 'business', label: 'Business', sub: 'Self-employed', icon: Store, tone: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-300' },
];

export default function ProposalHeroSection({ onGetStarted, onSearch, hasProposalProfile = false }: ProposalHeroSectionProps) {
  const [lookingFor, setLookingFor] = useState<'Bride' | 'Groom'>('Bride');
  const [ageRange, setAgeRange] = useState('22-30');
  const [religion, setReligion] = useState('Any');
  const [livingIn, setLivingIn] = useState('Anywhere');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters = { lookingFor, ageRange, religion, livingIn };
    if (onSearch) onSearch(filters);
    else onGetStarted();
  };

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden border-b border-rose-100/70 dark:border-white/10 bg-gradient-to-b from-[#fff7f4] via-white to-white dark:from-[#160b14] dark:via-[#0f0a14] dark:to-slate-950 font-sans"
    >
      {/* ── Ambient background ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-rose-200/40 dark:bg-rose-600/15 blur-[140px]" />
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-amber-200/40 dark:bg-amber-500/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(225,29,72,0.18) 1px, transparent 0)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1550px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-18 pt-10 sm:pt-14 pb-14">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">

          {/* ── LEFT: Copy ── */}
          <div className="lg:col-span-6 xl:col-span-7">
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={0}
              className="inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full bg-white/90 dark:bg-white/5 border border-rose-200/80 dark:border-white/10 shadow-sm backdrop-blur"
            >
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black uppercase tracking-wider">
                <Sparkles size={11} /> New
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Sri Lanka's verified proposal platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="mt-6 text-[2.6rem] leading-[1.08] sm:text-6xl xl:text-7xl font-black tracking-tight text-slate-900 dark:text-white"
            >
              Find the one who{' '}
              <span className="bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                truly matches
              </span>{' '}
              you.
            </motion.h1>

            <motion.p
              variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="mt-4 text-base sm:text-lg font-bold text-rose-600 dark:text-rose-300 font-sinhala"
            >
              ඔබට ගැළපෙනම සහකරු හෝ සහකාරිය — විශ්වාසයෙන් සොයන්න.
            </motion.p>

            <motion.p
              variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="mt-4 max-w-xl text-[15px] sm:text-base leading-relaxed text-slate-600 dark:text-slate-300"
            >
              Campus students, working professionals, Sri Lankans living abroad — every profile is
              ID-verified, every photo stays private until <span className="font-bold text-slate-900 dark:text-white">you</span> accept.
            </motion.p>

            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={4}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-black text-sm shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                {hasProposalProfile ? 'Go to My Dashboard' : 'Create Free Profile'}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onSearch?.({ lookingFor, ageRange, religion, livingIn })}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-black text-sm hover:border-rose-300 dark:hover:border-rose-500/40 hover:-translate-y-0.5 transition-all cursor-pointer shadow-sm"
              >
                <Users size={18} className="text-rose-500" />
                Browse Profiles
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={5}
              className="mt-8 flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {[
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop',
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&h=96&fit=crop',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop',
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-10 h-10 rounded-full object-cover ring-[3px] ring-white dark:ring-[#140b13] blur-[1.5px]" />
                ))}
                <div className="w-10 h-10 rounded-full ring-[3px] ring-white dark:ring-[#140b13] bg-rose-600 text-white text-[11px] font-black flex items-center justify-center">
                  +2k
                </div>
              </div>
              <div>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  Trusted by verified members island-wide
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Visual ── */}
          <div className="lg:col-span-6 xl:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-[420px]"
            >
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-rose-950/15 ring-1 ring-slate-900/10 dark:ring-white/10">
                <img src={heroCouple} alt="Happy Sri Lankan couple" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider border border-white/30">
                      Success Story
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl font-black tracking-tight">Dilshan & Tharushi</h3>
                  <p className="text-xs font-semibold text-white/85 flex items-center gap-1.5 mt-0.5">
                    <BadgeCheck size={14} className="text-sky-300" /> Matched in 3 weeks • Kandy
                  </p>
                </div>
              </div>

              {/* Floating: match card (Crisp Solid Card) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -left-2 sm:-left-12 top-6 sm:top-8 w-44 sm:w-56 p-2.5 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-950/15 z-20"
                style={{ animation: 'heroFloat 6s ease-in-out infinite' }}
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/30 shrink-0">
                    <Heart size={18} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">It's a Match</p>
                    <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">96% Compatible</p>
                  </div>
                </div>
                <div className="mt-2 sm:mt-2.5 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-rose-500 to-amber-400" />
                </div>
              </motion.div>

              {/* Floating: verified (Crisp Solid Card) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.65, duration: 0.6 }}
                className="absolute -right-2 sm:-right-10 top-1/2 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-950/15 flex items-center gap-2 sm:gap-3 z-20"
                style={{ animation: 'heroFloat 7s ease-in-out infinite reverse' }}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">NIC Verified</p>
                  <p className="text-[11px] sm:text-xs font-black text-slate-900 dark:text-white">100% Real profiles</p>
                </div>
              </motion.div>

              {/* Floating: privacy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute left-2 sm:-left-8 -bottom-5 sm:-bottom-6 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-slate-800 dark:border-slate-200 shadow-2xl shadow-slate-950/20 flex items-center gap-2 sm:gap-2.5 z-20"
              >
                <Lock size={15} className="text-amber-400 dark:text-rose-500 shrink-0" />
                <p className="text-[11px] sm:text-xs font-black">Photos blurred until you accept</p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ── SEARCH PANEL ── */}
        <motion.form
          onSubmit={handleSearchSubmit}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
          className="relative mt-16 lg:mt-14 p-2.5 rounded-[1.75rem] bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-2xl shadow-rose-900/10 dark:shadow-black/40 backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_1fr_auto] gap-2 items-stretch">
            {/* Looking for — segmented toggle */}
            <div className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5">
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">I'm looking for</span>
              <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-white/10">
                {(['Bride', 'Groom'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setLookingFor(opt)}
                    className={`py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      lookingFor === opt
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/30'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {opt === 'Bride' ? 'Bride · මනාලිය' : 'Groom · මනාලයා'}
                  </button>
                ))}
              </div>
            </div>

            {[
              { label: 'Age', value: ageRange, set: setAgeRange, options: [['18-25', '18 – 25'], ['22-30', '22 – 30'], ['26-35', '26 – 35'], ['30-40', '30 – 40'], ['18-60', 'Any age']] },
              { label: 'Religion', value: religion, set: setReligion, options: [['Any', 'Any religion'], ['Buddhist', 'Buddhist'], ['Hindu', 'Hindu'], ['Muslim', 'Muslim'], ['Christian', 'Christian / Catholic']] },
              { label: 'Living in', value: livingIn, set: setLivingIn, options: [['Anywhere', 'Anywhere'], ['Sri Lanka', 'Sri Lanka'], ['Abroad', 'Abroad']] },
            ].map((f) => (
              <label key={f.label} className="px-4 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">{f.label}</span>
                <select
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="w-full bg-transparent text-sm font-extrabold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  {f.options.map(([v, l]) => (
                    <option key={v} value={v} className="text-slate-900">{l}</option>
                  ))}
                </select>
              </label>
            ))}

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-7 py-4 md:py-0 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Search size={18} strokeWidth={2.5} />
              <span>Search</span>
            </button>
          </div>
        </motion.form>

        {/* ── CATEGORY STRIP ── */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((c, i) => (
            <motion.button
              key={c.id}
              type="button"
              onClick={() => onSearch?.({ lookingFor, ageRange, religion, livingIn, category: c.id })}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 + i * 0.07 }}
              className="group flex items-center gap-3 p-3 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-500/40 hover:bg-white dark:hover:bg-white/[0.06] transition-all text-left cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.tone}`}>
                <c.icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900 dark:text-white">{c.label}</p>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">{c.sub}</p>
              </div>
              <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all" />
            </motion.button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}
