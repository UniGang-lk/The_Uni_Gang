import { LuSparkles, LuGraduationCap, LuSearch, LuArrowRight, LuUsers, LuLock, LuMapPin } from 'react-icons/lu';
import TiltCard from '../ui/TiltCard';

interface ProposalHeroBannerProps {
  onSearchClick: () => void;
  onCreateClick: () => void;
}

const ProposalHeroBanner = ({ onSearchClick, onCreateClick }: ProposalHeroBannerProps) => {
  return (
    <div className="relative py-16 md:py-24 mb-16 rounded-[3.5rem] bg-gradient-to-b from-rose-500/10 via-pink-500/5 to-transparent dark:from-slate-900/90 dark:via-slate-900/60 dark:to-slate-950 border border-rose-200/60 dark:border-slate-800/80 backdrop-blur-3xl p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl transition-colors duration-300">

      {/* ── Ambient Radial Glow Orbs & Floating Heart Particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-500/15 dark:bg-rose-500/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/15 dark:bg-pink-500/20 blur-[150px] rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

        {/* LEFT: Text Pitch & Action Buttons (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black text-xs uppercase tracking-widest ring-1 ring-rose-500/30 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <LuSparkles className="text-sm" /> 100% Student-Verified Matchmaking Hub
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Connect With Educated <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 italic">Campus Partners</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
            Discover verified undergraduates, university alumni, and young Sri Lankan professionals for genuine lifelong connections in a 100% encrypted environment.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
            <button
              onClick={onSearchClick}
              className="w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-500/30 hover:scale-[1.03] active:scale-95 transition-all border-none cursor-pointer flex items-center justify-center gap-2.5"
            >
              <LuSearch size={18} /> Explore Proposal Directory <LuArrowRight size={16} />
            </button>

            <button
              onClick={onCreateClick}
              className="w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-white/90 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest border border-slate-200 dark:border-slate-700 shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              ✍️ Post Free Proposal Ad
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><LuGraduationCap className="text-rose-500" size={16} /> ID Photo & Email Verified</span>
            <span className="flex items-center gap-1.5"><LuLock className="text-purple-500" size={16} /> Phone Masking Shield</span>
            <span className="flex items-center gap-1.5"><LuUsers className="text-pink-500" size={16} /> 1,400+ Active Members</span>
          </div>

        </div>

        {/* RIGHT: Overlapping Dual Card Visual Showcase (5 Cols) */}
        <div className="lg:col-span-5 flex justify-center items-center relative min-h-[380px]">

          {/* Card 1: Back Shifted Card */}
          <motion.div
            initial={{ opacity: 0, rotate: -6, scale: 0.9 }}
            animate={{ opacity: 1, rotate: -6, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute -left-2 top-0 w-full max-w-xs pointer-events-none opacity-80"
          >
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 border border-amber-500/30 shadow-xl">
              <div className="h-56 rounded-2xl overflow-hidden bg-slate-900 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=500&auto=format&fit=crop"
                  alt="Kasun Bandara"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-base font-black text-slate-900 dark:text-white uppercase">Kasun Bandara</h4>
              <p className="text-[10px] text-amber-500 font-extrabold uppercase">Civil Engineer • UOM</p>
            </div>
          </motion.div>

          {/* Card 2: Front Floating Interactive Card */}
          <TiltCard className="w-full max-w-xs relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: 3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group bg-white/95 dark:bg-slate-950/95 rounded-3xl p-5 border border-rose-400/40 dark:border-rose-500/30 shadow-2xl overflow-hidden text-left"
            >
              <div className="relative h-64 rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop"
                  alt="Dilini Perera"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-black uppercase bg-rose-500 text-white shadow-md inline-flex items-center gap-1">
                  <LuGraduationCap size={11} /> Verified Undergrad
                </span>
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-white border border-white/20 inline-flex items-center gap-1">
                  <LuMapPin size={11} /> Kandy • 23 yrs
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Dilini Perera</h3>
              <p className="text-xs text-rose-500 font-extrabold uppercase tracking-wider mt-0.5">Software Eng • SLIIT Malabe</p>
            </motion.div>
          </TiltCard>

        </div>

      </div>
    </div>
  );
};

export default ProposalHeroBanner;
