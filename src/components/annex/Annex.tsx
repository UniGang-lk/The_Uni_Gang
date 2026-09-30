import { motion } from 'framer-motion';
import {
  LuMapPin, LuUsers, LuShieldCheck, LuArrowRight
} from 'react-icons/lu';
import { FiHome } from 'react-icons/fi';
import TiltCard from '../ui/TiltCard.tsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Annex = () => {
  const navigate = useNavigate();
  const [, setIsNavigating] = useState(false);

  const handleExploreAnnex = () => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/annex-list');
      setTimeout(() => setIsNavigating(false), 100);
    }, 300);
  };

  return (
    <section id="annex" className="relative py-32 bg-white dark:bg-[#020617] overflow-hidden">
      {/* Smooth Section Blend Overlays */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-white via-white dark:from-[#020617] dark:via-[#020617] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white dark:from-[#020617] dark:via-[#020617] to-transparent pointer-events-none z-10" />

      {/* 🌌 Ambient Background (Blue/Teal — distinct from Market's purple/amber) */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_35%,rgba(59,130,246,0.06),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_65%,rgba(20,184,166,0.06),transparent_50%)]" />

        {/* Floating background glowing orbs */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-500/10 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-teal-400/8 blur-[90px] rounded-full"
        />
      </div>

      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 lg:px-12 2xl:px-20 relative z-10">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest mb-4">
            <LuTrendingUp className="text-sm" /> Student Lodgings Hub
          </div> */}
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Campus <span className="text-blue-600 italic">Accommodations</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The complete student housing ecosystem. Find verified boarding places near your university, connect with roommates, and deal directly with landlords — zero broker fees.
          </p>
        </motion.div>

        {/* ── Asymmetric Layout (Splits 60/40, completely different from Market's 3-column stack) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* LEFT: Premium Lifestyle Collage with Floating Badges (7/12 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex justify-center relative"
          >
            <div className="relative w-full max-w-lg 2xl:max-w-xl h-[460px] 2xl:h-[520px] flex items-center justify-center">

              {/* Background decorative circular rings (blue/teal) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-[420px] 2xl:w-[480px] h-[420px] 2xl:h-[480px] border border-blue-500/20 rounded-full animate-[spin_30s_linear_infinite]" />
                <div className="absolute w-[320px] 2xl:w-[380px] h-[320px] 2xl:h-[380px] border border-dashed border-teal-500/20 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
              </div>

              {/* Main Lifestyle Room Visual */}
              <TiltCard className="w-full relative z-20">
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-teal-500 rounded-[3rem] blur opacity-25 group-hover:opacity-45 transition duration-1000" />

                  <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 border border-white/50 dark:border-slate-800 shadow-2xl">
                    <div className="relative h-[360px] 2xl:h-[420px] rounded-[2rem] overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop"
                        alt="Premium Student Room"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />

                      {/* Floating testimonial inside photo */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                          <LuShieldCheck className="text-emerald-400 text-lg" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">100% Verified Lodgings</span>
                        </div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                          Your home <br />away from home.
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>

              {/* Floating Badge 1: Campus distance pill (top-left) */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -left-4 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-2xl shadow-[0_24px_48px_-12px_rgba(59,130,246,0.2)] flex items-center gap-3 z-30"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <LuMapPin size={16} />
                </div>
                <div>
                  <div className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Proximity</div>
                  <div className="text-xs font-black text-slate-800 dark:text-white">&lt; 1km to Campus</div>
                </div>
              </motion.div>

              {/* Floating Badge 2: Roommate match avatars (bottom-right) */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-4 -right-4 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-2xl shadow-[0_24px_48px_-12px_rgba(20,184,166,0.2)] flex items-center gap-3 z-30"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
                  <LuUsers size={16} />
                </div>
                <div>
                  <div className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Roommates</div>
                  <div className="text-xs font-black text-slate-800 dark:text-white">Batchmate Matching</div>
                </div>
              </motion.div>

              {/* Floating Badge 3: Free pricing tag (mid-right) */}
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute right-0 top-1/3 translate-x-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl shadow-xl font-black text-[10px] uppercase tracking-widest z-30"
              >
                Zero Broker Fee
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT: Descriptive Feature Progression (5/12 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full min-h-[460px] gap-8">
            <div className="space-y-6">

              {/* Feature 1 */}
              <div className="group flex gap-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 hover:border-blue-500/30 hover:bg-white dark:hover:bg-slate-900/80 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <FiHome size={20} />
                </div>
                <div>
                  <h4 className="text-md font-bold text-slate-900 dark:text-white mb-1">Boarding Place Finder</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Filter by exact university, budget range, and room specs. Browse interactive maps and check authentic property photos.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group flex gap-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 hover:border-teal-500/30 hover:bg-white dark:hover:bg-slate-900/80 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <LuUsers size={20} />
                </div>
                <div>
                  <h4 className="text-md font-bold text-slate-900 dark:text-white mb-1">Roommate Hub Integration</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Looking to split boarding costs? Create roommate request listings or connect directly with student batchmates.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group flex gap-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 hover:border-emerald-500/30 hover:bg-white dark:hover:bg-slate-900/80 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <LuShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-md font-bold text-slate-900 dark:text-white mb-1">Zero Scams Verification</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Every listing undergoes physical coordinates and landlord verification checks, supported by honest student reviews.
                  </p>
                </div>
              </div>

            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-150 dark:border-slate-850">
              <button
                onClick={handleExploreAnnex}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
              >
                Find Accommodations <LuArrowRight size={14} />
              </button>
              <button
                onClick={() => window.location.href = '/post-ad'}
                className="py-4 px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black uppercase tracking-widest text-xs rounded-2xl active:scale-[0.98] transition-all border-none cursor-pointer"
              >
                List Your Property
              </button>
            </div>
          </div>

        </div>

        {/* ── Metrics Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex w-full justify-center gap-16 mt-20 pt-8 border-t border-slate-200/50 dark:border-slate-800/40"
        >
          {[
            { num: '500', suffix: '+', accent: 'text-blue-600', label: 'Active Listings' },
            { num: '23', suffix: '', accent: 'text-teal-500', label: 'Universities Listed' },
            { num: '100', suffix: '%', accent: 'text-emerald-500', label: 'Verified Landlords' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">
                {stat.num}<span className={stat.accent}>{stat.suffix}</span>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Annex;
