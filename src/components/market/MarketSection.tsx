import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LuShoppingBag, LuShieldCheck, LuTags, LuBriefcase, LuBadgeCheck } from 'react-icons/lu';
import { useState } from 'react';
import TiltCard from '../ui/TiltCard';
import PremiumPageLoader from '../ui/PremiumPageLoader';

const MarketSection = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleExploreMarket = () => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/market');
      setTimeout(() => setIsNavigating(false), 500);
    }, 300);
  };

  return (
    <section id="market" className="relative py-32 bg-slate-50 dark:bg-[#020617] overflow-hidden">
      {/* Smooth Section Blend Overlays */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-slate-50 via-slate-50 dark:from-[#020617] dark:via-[#020617] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-50 via-slate-50 dark:from-[#020617] dark:via-[#020617] to-transparent pointer-events-none z-10" />
      <PremiumPageLoader isLoading={isNavigating} message="Entering The Hustle Hub..." />

      {/* 🌌 High-End Mesh Gradient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_35%,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_65%,rgba(99,102,241,0.08),transparent_50%)]" />

        {/* Animated Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-purple-400/10 blur-[120px] rounded-full"
        />
      </div>

      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 lg:px-12 2xl:px-20 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-black text-[10px] uppercase tracking-widest mb-4">
            <LuTrendingUp className="text-sm" /> The Hustle Hub
          </div> */}
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Campus <span className="text-purple-600 italic">Marketplace</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The ultimate hub for campus trade. Buy official merchandise directly from the <span className="text-purple-600 font-bold dark:text-purple-400">Uni Gang Official Store</span>, trade peer-to-peer, or offer freelance services in a secure environment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mt-12">
          {/* Column 1: Modern 3D Visual Collage */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center w-full h-full"
          >
            {/* Modern 3D Visual Collage */}
            <div className="relative h-[480px] flex items-center justify-center w-full max-w-sm mx-auto">
              {/* Background Decorative Rings */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-[360px] h-[360px] border border-purple-500 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute w-[280px] h-[280px] border border-dashed border-indigo-500 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              </div>

              <TiltCard className="w-full max-w-sm relative z-20">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                  <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 border border-white/50 dark:border-slate-800 shadow-2xl">
                    <div className="relative h-[380px] rounded-[2rem] overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=800&auto=format&fit=crop"
                        alt="Marketplace Gear"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      {/* Floating Info Overlays */}
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute top-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white"
                      >
                        <LuTags className="text-purple-400 mb-2 text-xl" />
                        <p className="text-xs font-medium leading-relaxed italic">
                          "Got my engineering calculator for half the price from a senior. Best deal ever!"
                        </p>
                      </motion.div>

                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-3 mb-2">
                          <LuShieldCheck className="text-emerald-400 text-lg" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Student Verified</span>
                        </div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Safe & <br /> Secure.</h4>
                      </div>
                    </div>
                  </div>

                  {/* Floating "Hot Deal" Card */}
                  <motion.div
                    initial={{ x: -60, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -left-6 top-1/2 -translate-y-1/2 w-44 bg-white dark:bg-slate-800 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-700 p-4 hidden xl:block z-30"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                        <LuShoppingBag size={16} />
                      </div>
                      <div>
                        <div className="text-[8px] font-black text-purple-600 uppercase">Hot Deal</div>
                        <div className="text-[11px] font-bold text-slate-900 dark:text-white">Drawing Board</div>
                      </div>
                    </div>
                    <div className="text-md font-black text-emerald-500">Rs. 3,500</div>
                  </motion.div>
                </div>
              </TiltCard>

              {/* Random Floating Particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -40, 0],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                  className="absolute w-2 h-2 bg-purple-500 rounded-full blur-[1px]"
                  style={{
                    top: `${20 + i * 15}%`,
                    left: `${80 - i * 10}%`
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Column 2: Premium Official Store Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col h-full"
          >
            <div className="flex-1 group relative bg-gradient-to-b from-amber-500/10 via-purple-500/5 to-indigo-500/10 dark:from-amber-500/5 dark:via-purple-500/5 dark:to-[#090d1f] backdrop-blur-md p-8 rounded-[2.5rem] border border-amber-500/30 dark:border-amber-500/25 hover:border-amber-500/60 transition-all hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)] flex flex-col justify-between overflow-hidden h-full min-h-[480px]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-amber-500 bg-amber-500/10 group-hover:scale-110 transition-transform">
                    <LuBadgeCheck className="w-8 h-8" />
                  </div>
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    Verified Store
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">
                  Uni Gang Official Store
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  Shop official university merchandise, graduation bouquets, custom keytags, and premium souvenirs. Secure checkout via bank slip uploads or COD with real-time order tracking.
                </p>

                {/* Feature Checkmarks */}
                <ul className="space-y-3.5 mb-8">
                  {[
                    "Premium Shopping Cart checkout",
                    "Direct Bank Transfer with receipt upload",
                    "100% campus-verified official merchandise",
                    "Real-time order review & approval system"
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={handleExploreMarket}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 active:scale-[0.98] mt-auto"
              >
                Shop Official Store
              </button>
            </div>
          </motion.div>

          {/* Column 3: Peer-to-Peer Hub Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col h-full justify-between gap-6"
          >
            {/* Stack of 3 Horizontal Cards */}
            <div className="flex-1 flex flex-col justify-between gap-4 h-full min-h-[480px]">
              {[
                {
                  icon: <LuShoppingBag className="w-5 h-5" />,
                  title: "Physical Goods",
                  desc: "Buy and sell textbooks, drawing tables, laptops, and calculators.",
                  color: "blue"
                },
                {
                  icon: <LuBriefcase className="w-5 h-5" />,
                  title: "Freelance Gigs",
                  desc: "Offer tutoring, graphic design, or coding services to peers.",
                  color: "purple"
                },
                {
                  icon: <LuShieldCheck className="w-5 h-5" />,
                  title: "Zero Scams Guarantee",
                  desc: "Only university-verified students can list. 100% secure peer trades.",
                  color: "emerald"
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex-1 group relative bg-white dark:bg-slate-800/40 backdrop-blur-md p-5 rounded-[1.8rem] border border-slate-100 dark:border-slate-700/50 hover:border-purple-500/40 transition-all hover:shadow-[0_8px_30px_rgba(139,92,246,0.06)] overflow-hidden flex items-start gap-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-${item.color}-500 bg-${item.color}-500/10 shrink-0 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>

                  <div className="flex-1">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}

              {/* Action Button */}
              <button
                onClick={handleExploreMarket}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 active:scale-[0.98] mt-2"
              >
                Explore Peer Listings
              </button>
            </div>
          </motion.div>
        </div>

        {/* Quick Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex w-full justify-center gap-16 mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-800/40"
        >
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">2<span className="text-purple-600">k+</span></div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Listings</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">100<span className="text-emerald-500">%</span></div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">24<span className="text-amber-500">/7</span></div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Store Operations</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MarketSection;
