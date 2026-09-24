import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LuHeart,
  LuSparkles,
  LuGraduationCap,
  LuShieldCheck,
  LuMessageSquare,
  LuChevronRight,
  LuLock,
  LuMapPin
} from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import TiltCard from '../ui/TiltCard';
import PremiumTraceButton from '../ui/PremiumTraceButton';
import PremiumPageLoader from '../ui/PremiumPageLoader';

const ProposalTeaserSection = () => {
  const navigate = useNavigate();
  const [isNavigating] = useState(false);

  const handleOpenHub = () => {
    navigate('/proposals');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="proposals" className="relative py-32 bg-slate-950 text-white overflow-hidden">
      <PremiumPageLoader isLoading={isNavigating} message="Opening Proposals & Soulmate Hub..." />

      {/* ── Ambient Radial Mesh Glows & Particle Grid ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #f43f5e 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* ── Standarized Centered Section Header (Matching Events/Services/Market style) ── */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            Verified Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-amber-400 italic">Proposals</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed">
            Discover verified university undergraduates, alumni, and working professionals for genuine lifelong connections.
          </p>
        </div>

        {/* ── Hero Split Layout (Enhanced Orbiting Left Showcase / World-Class Pitch Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* LEFT: Multi-Floating Motion Icon Glass Container (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 relative flex justify-center items-center min-h-[520px]"
          >
            <div className="relative w-full max-w-lg">

              {/* Floating Motion Badges Around Left Visual Container */}

              {/* Floating Icon 1: Pulsing Heart (Top Left) */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -left-4 z-40 px-3.5 py-2 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 backdrop-blur-xl shadow-2xl flex items-center gap-2 text-xs font-black uppercase tracking-wider"
              >
                <LuHeart className="text-rose-400 animate-bounce" size={16} /> 98% Match Rate
              </motion.div>

              {/* Floating Icon 2: Sparkles (Top Right) */}
              <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, -12, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-5 -right-3 z-40 w-11 h-11 rounded-2xl bg-pink-500/20 border border-pink-500/40 text-pink-300 backdrop-blur-xl shadow-2xl flex items-center justify-center"
              >
                <LuSparkles size={20} className="animate-spin-slow" />
              </motion.div>

              {/* Floating Icon 3: Student Verified (Mid Left) */}
              <motion.div
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-1/2 -left-8 -translate-y-1/2 z-40 px-3.5 py-2 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-300 backdrop-blur-xl shadow-2xl flex items-center gap-2 text-xs font-black uppercase tracking-wider"
              >
                <LuGraduationCap size={16} /> Student Verified
              </motion.div>

              {/* Floating Icon 4: Phone Masking Shield (Mid Right) */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute top-1/2 -right-6 -translate-y-1/2 z-40 px-3.5 py-2 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 backdrop-blur-xl shadow-2xl flex items-center gap-2 text-xs font-black uppercase tracking-wider"
              >
                <LuShieldCheck size={16} /> Privacy Shield
              </motion.div>

              {/* Outer Glowing Glass Wrapper Container */}
              <div className="relative p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-xl hover:border-rose-500/40 transition-all duration-500">

                {/* Top Status Header */}
                <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                      Live Campus Match Hub
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    100% Student Verified
                  </span>
                </div>

                {/* Dual Overlapping Interactive Profile Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">

                  {/* Card 1: Female Undergrad */}
                  <TiltCard>
                    <div className="group bg-slate-950/90 rounded-3xl p-4 border border-rose-500/30 hover:border-rose-500 transition-all cursor-pointer shadow-xl" onClick={handleOpenHub}>
                      <div className="relative h-56 rounded-2xl overflow-hidden mb-3 bg-slate-900">
                        <img
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop"
                          alt="Dilini Perera"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-md inline-flex items-center gap-1">
                          <LuGraduationCap size={10} /> Verified Undergrad
                        </span>
                        <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-950/80 backdrop-blur-md text-white border border-white/20 inline-flex items-center gap-1">
                          <LuMapPin size={10} /> Kandy • 23 yrs
                        </span>
                      </div>

                      <h4 className="text-base font-black text-white uppercase tracking-tight group-hover:text-rose-400 transition-colors">
                        Dilini Perera
                      </h4>
                      <p className="text-[10px] text-rose-400 font-extrabold uppercase tracking-wider mt-0.5">
                        Software Eng • SLIIT Malabe
                      </p>
                    </div>
                  </TiltCard>

                  {/* Card 2: Male Uni Alumni */}
                  <TiltCard>
                    <div className="group bg-slate-950/90 rounded-3xl p-4 border border-amber-500/30 hover:border-amber-500 transition-all cursor-pointer shadow-xl" onClick={handleOpenHub}>
                      <div className="relative h-56 rounded-2xl overflow-hidden mb-3 bg-slate-900">
                        <img
                          src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=500&auto=format&fit=crop"
                          alt="Kasun Bandara"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-md inline-flex items-center gap-1">
                          <LuGraduationCap size={10} /> Verified Alumni
                        </span>
                        <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-950/80 backdrop-blur-md text-white border border-white/20 inline-flex items-center gap-1">
                          <LuMapPin size={10} /> Colombo • 25 yrs
                        </span>
                      </div>

                      <h4 className="text-base font-black text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors">
                        Kasun Bandara
                      </h4>
                      <p className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider mt-0.5">
                        Civil Engineer • UOM
                      </p>
                    </div>
                  </TiltCard>

                </div>

                {/* Floating Bottom Match Notification Bar */}
                <div className="mt-5 p-3 rounded-2xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center text-sm shadow-md animate-bounce">
                      <LuHeart />
                    </div>
                    <div>
                      <span className="text-xs font-black text-white uppercase tracking-wider block">It's a Campus Match! 💖</span>
                      <span className="text-[10px] text-rose-300 font-medium block">Filter by Age, Uni, Profession & District</span>
                    </div>
                  </div>

                  <button
                    onClick={handleOpenHub}
                    className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider border-none cursor-pointer shadow-md transition-colors"
                  >
                    View Hub
                  </button>
                </div>

              </div>

            </div>
          </motion.div>

          {/* RIGHT: World-Class Value Pitch & Pillar Feature Cards (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-6"
          >
            <div>
              {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-400 font-black text-[10px] uppercase tracking-widest mb-3 ring-1 ring-rose-500/30">
                <LuSparkles className="text-sm animate-pulse" /> Verified Sri Lankan Proposals
              </div> */}

              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                Find Your Educated <span className="text-rose-400 italic">Soulmate</span>
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed font-medium mt-2">
                Connecting genuine university undergraduates, working alumni, and young professionals in a 100% verified, safe environment.
              </p>
            </div>

            {/* Feature Cards Stack (Pillar Highlights) */}
            <div className="space-y-3.5 pt-1">

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-rose-500/30 transition-colors">
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 shrink-0 mt-0.5">
                  <LuGraduationCap size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">100% Student & Alumni Verification</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Student ID & `.ac.lk` mail මගින් 100% Genuine ශ්‍රී ලාංකික Campus matches බව තහවුරු කිරීම.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/30 transition-colors">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 shrink-0 mt-0.5">
                  <LuLock size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">Anti-Leak Contact Security Filter</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Phone Numbers / Contact Leaks වැළැක්වීමේ automated Regex Privacy Engine එක.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-pink-500/30 transition-colors">
                <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 shrink-0 mt-0.5">
                  <LuMessageSquare size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">💬 Encrypted In-App Chat & Free Teaser</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Messages 3ක් නොමිලේ යවා Chat කිරීමට සහ VIP Upgrade එක ලබාගැනීමට ඇති පහසුකම.
                  </p>
                </div>
              </div>

            </div>

            {/* Action CTA Button */}
            <div className="pt-2">
              <PremiumTraceButton
                index={15}
                onClick={handleOpenHub}
                isLoading={isNavigating}
                icon={<LuChevronRight />}
                className="w-full text-xs uppercase tracking-widest py-4 font-black"
              >
                Explore Proposals Hub
              </PremiumTraceButton>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default ProposalTeaserSection;
