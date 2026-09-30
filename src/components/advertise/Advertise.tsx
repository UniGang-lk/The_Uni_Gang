import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LuMegaphone, LuArrowRight, LuTrendingUp, LuUsers, LuTarget, LuLayoutDashboard, LuPanelRight, LuRss, LuMaximize, LuX } from 'react-icons/lu';

type PlacementKey = 'banner' | 'sidebar' | 'infeed' | 'popup' | null;

const placementData = {
  banner: {
    icon: LuLayoutDashboard,
    title: 'Top Banner',
    tag: 'High Visibility',
    tagColor: 'text-blue-400 bg-blue-500/15 border-blue-500/20',
    accentColor: 'from-blue-500 to-cyan-400',
    borderColor: 'border-blue-500',
    glowColor: 'shadow-blue-500/30',
    bgHighlight: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    description: 'Premium placement at the top of every page. Maximum visibility as the first thing students see when they open UniGang.',
    reach: '~45K daily views',
  },
  sidebar: {
    icon: LuPanelRight,
    title: 'Sidebar Widget',
    tag: 'Sticky Feed',
    tagColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20',
    accentColor: 'from-emerald-500 to-teal-400',
    borderColor: 'border-emerald-500',
    glowColor: 'shadow-emerald-500/30',
    bgHighlight: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    description: 'Stays visible as students scroll through content. Perfect for longer campaigns that need sustained attention.',
    reach: '~30K daily views',
  },
  infeed: {
    icon: LuRss,
    title: 'Native In-Feed',
    tag: 'Seamless Blend',
    tagColor: 'text-amber-400 bg-amber-500/15 border-amber-500/20',
    accentColor: 'from-amber-500 to-orange-400',
    borderColor: 'border-amber-500',
    glowColor: 'shadow-amber-500/30',
    bgHighlight: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    description: 'Blends naturally into the content feed between student posts. Highest engagement rate due to native feel.',
    reach: '~38K daily views',
  },
  popup: {
    icon: LuMaximize,
    title: 'Global Popup',
    tag: 'Interruptive',
    tagColor: 'text-purple-400 bg-purple-500/15 border-purple-500/20',
    accentColor: 'from-purple-500 to-pink-400',
    borderColor: 'border-purple-500',
    glowColor: 'shadow-purple-500/30',
    bgHighlight: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    description: 'Full-screen overlay with a powerful call-to-action. Best for major launches, events, and time-sensitive promotions.',
    reach: '~50K daily views',
  },
};

export default function AdvertiseSection() {
  const navigate = useNavigate();
  const [activePlacement, setActivePlacement] = useState<PlacementKey>(null);

  const stats = [
    { icon: LuUsers, stat: '50K+', label: 'Active Students', color: 'from-blue-500 to-cyan-400' },
    { icon: LuTarget, stat: '85%', label: 'Engagement Rate', color: 'from-violet-500 to-purple-400' },
    { icon: LuTrendingUp, stat: '2M+', label: 'Monthly Impressions', color: 'from-amber-500 to-orange-400' },
    { icon: LuMegaphone, stat: 'Premium', label: 'Ad Placements', color: 'from-emerald-500 to-teal-400' },
  ];

  const placementKeys: PlacementKey[] = ['banner', 'sidebar', 'infeed', 'popup'];

  return (
    <section id="advertise" className="relative py-24 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Ambient Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-500/10 to-transparent rounded-[100%] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-20 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-black uppercase tracking-widest"
          >
            <LuMegaphone className="animate-pulse" /> Partner With Us
          </motion.div> */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            Reach the Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">Generation</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 font-medium"
          >
            Position your institute, course, or brand in front of thousands of highly engaged university students across Sri Lanka. The #1 student platform awaits you.
          </motion.p>
        </div>

        {/* Content Grid - Balanced */}
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">

          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 gap-4 flex-1">
              {stats.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 rounded-full blur-2xl transition-opacity duration-500`} />

                  <div className={`w-11 h-11 mb-4 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white text-lg shadow-lg`}>
                    <item.icon />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">{item.stat}</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{item.label}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 overflow-hidden shadow-2xl shadow-blue-600/20"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />
              <div className="absolute top-4 right-4 w-20 h-20 border border-white/10 rounded-full" />
              <div className="absolute top-8 right-8 w-12 h-12 border border-white/10 rounded-full" />

              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                  Ready to Grow?
                </h3>
                <p className="text-white/70 font-medium text-sm mb-6 max-w-xs">
                  Launch your campaign today and connect with the most active student community in Sri Lanka.
                </p>
                <button
                  onClick={() => navigate('/advertise/submit')}
                  className="flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-blue-50 hover:scale-105 transition-all group shadow-xl"
                >
                  Start Campaign <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive Visual Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-[2.5rem] blur-xl opacity-50" />
            <div className="relative bg-white dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-800/80 rounded-[2.5rem] p-6 md:p-8 shadow-2xl overflow-hidden flex-1 flex flex-col">
              {/* Corner glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />

              {/* Header */}
              <div className="flex items-center justify-between mb-5 relative z-10">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Where Your Ad Appears
                </h3>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Click to explore
                </span>
              </div>

              {/* ============ VISUAL MOCKUP ============ */}
              <div className="relative z-10 flex-1 flex flex-col">
                {/* Mini Browser Chrome */}
                <div className="bg-slate-100 dark:bg-slate-800 rounded-t-2xl px-4 py-2.5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-white dark:bg-slate-700 rounded-lg px-3 py-1 flex items-center gap-2">
                      <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">theunigang.com</span>
                    </div>
                  </div>
                </div>

                {/* Mock Website Layout */}
                <div className="bg-slate-50 dark:bg-slate-850 border-x border-b border-slate-200 dark:border-slate-700/50 rounded-b-2xl overflow-hidden flex-1 flex flex-col relative" style={{ minHeight: '340px' }}>

                  {/* === 1. TOP BANNER ZONE === */}
                  <div
                    onClick={() => setActivePlacement(activePlacement === 'banner' ? null : 'banner')}
                    className={`relative cursor-pointer transition-all duration-300 mx-2 mt-2 rounded-xl overflow-hidden ${activePlacement === 'banner'
                      ? `ring-2 ring-blue-500 ${placementData.banner.glowColor} shadow-lg scale-[1.01]`
                      : 'hover:ring-1 hover:ring-blue-400/50'
                      }`}
                  >
                    <div className={`h-12 flex items-center justify-between px-4 transition-all duration-300 ${activePlacement === 'banner'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500'
                      : 'bg-gradient-to-r from-blue-600/20 to-cyan-500/20 dark:from-blue-600/30 dark:to-cyan-500/30'
                      }`}>
                      <div className="flex items-center gap-2">
                        <LuLayoutDashboard className={`text-sm ${activePlacement === 'banner' ? 'text-white' : 'text-blue-500'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${activePlacement === 'banner' ? 'text-white' : 'text-blue-500 dark:text-blue-400'}`}>
                          Your Banner Ad Here
                        </span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${activePlacement === 'banner' ? 'bg-white/20 text-white' : 'bg-blue-500/15 text-blue-500'
                        }`}>
                        970×90
                      </span>
                    </div>
                    {/* Pulsing indicator */}
                    {activePlacement !== 'banner' && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    )}
                  </div>

                  {/* Main Content Area */}
                  <div className="flex flex-1 gap-2 px-2 py-2">

                    {/* Feed / Content Area */}
                    <div className="flex-1 flex flex-col gap-2">
                      {/* Mock Nav Bar */}
                      <div className="flex gap-2 px-2">
                        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                        <div className="w-12 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                        <div className="w-14 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                      </div>

                      {/* Post 1 */}
                      <div className="bg-white dark:bg-slate-800/60 rounded-lg p-2.5 border border-slate-100 dark:border-slate-700/40">
                        <div className="flex gap-2 items-center mb-2">
                          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                          <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700/50 rounded-full" />
                          <div className="w-4/5 h-2 bg-slate-100 dark:bg-slate-700/50 rounded-full" />
                        </div>
                      </div>

                      {/* === 3. NATIVE IN-FEED AD ZONE === */}
                      <div
                        onClick={() => setActivePlacement(activePlacement === 'infeed' ? null : 'infeed')}
                        className={`relative cursor-pointer rounded-lg p-2.5 transition-all duration-300 ${activePlacement === 'infeed'
                          ? `ring-2 ring-amber-500 ${placementData.infeed.glowColor} shadow-lg bg-gradient-to-r from-amber-500/15 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/15 scale-[1.02]`
                          : 'bg-white dark:bg-slate-800/60 border border-amber-300/30 dark:border-amber-500/20 hover:ring-1 hover:ring-amber-400/50'
                          }`}
                      >
                        <div className="flex gap-2 items-start">
                          <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center ${activePlacement === 'infeed'
                            ? 'bg-gradient-to-br from-amber-500 to-orange-400'
                            : 'bg-amber-500/10 dark:bg-amber-500/15'
                            }`}>
                            <LuRss className={`text-xs ${activePlacement === 'infeed' ? 'text-white' : 'text-amber-500'}`} />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${activePlacement === 'infeed' ? 'bg-amber-500 text-white' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                }`}>
                                Sponsored
                              </span>
                            </div>
                            <div className={`text-[9px] font-bold uppercase tracking-wider ${activePlacement === 'infeed' ? 'text-amber-700 dark:text-amber-300' : 'text-slate-500 dark:text-slate-400'
                              }`}>
                              Your In-Feed Ad Here
                            </div>
                            <div className="w-3/4 h-1.5 bg-slate-100 dark:bg-slate-700/50 rounded-full" />
                          </div>
                        </div>
                        {activePlacement !== 'infeed' && (
                          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        )}
                      </div>

                      {/* Post 2 */}
                      <div className="bg-white dark:bg-slate-800/60 rounded-lg p-2.5 border border-slate-100 dark:border-slate-700/40">
                        <div className="flex gap-2 items-center mb-2">
                          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                          <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                        </div>
                        <div className="w-full h-12 bg-slate-100 dark:bg-slate-700/50 rounded-lg" />
                      </div>
                    </div>

                    {/* === 2. SIDEBAR WIDGET ZONE === */}
                    <div
                      onClick={() => setActivePlacement(activePlacement === 'sidebar' ? null : 'sidebar')}
                      className={`w-[90px] shrink-0 cursor-pointer rounded-lg transition-all duration-300 overflow-hidden ${activePlacement === 'sidebar'
                        ? `ring-2 ring-emerald-500 ${placementData.sidebar.glowColor} shadow-lg scale-[1.02]`
                        : 'hover:ring-1 hover:ring-emerald-400/50'
                        }`}
                    >
                      <div className={`h-full flex flex-col items-center justify-center gap-2 p-2 transition-all duration-300 ${activePlacement === 'sidebar'
                        ? 'bg-gradient-to-b from-emerald-500/20 to-teal-500/15 dark:from-emerald-500/25 dark:to-teal-500/20'
                        : 'bg-white/50 dark:bg-slate-800/40 border border-emerald-300/30 dark:border-emerald-500/20'
                        }`}>
                        <LuPanelRight className={`text-lg ${activePlacement === 'sidebar' ? 'text-emerald-500' : 'text-emerald-500/50'}`} />
                        <span className={`text-[8px] font-black uppercase tracking-wider text-center leading-tight ${activePlacement === 'sidebar' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                          }`}>
                          Sidebar Ad
                        </span>
                        <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full ${activePlacement === 'sidebar' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                          }`}>
                          300×250
                        </span>
                        {/* Mini placeholder blocks */}
                        <div className="w-full space-y-1 mt-1">
                          <div className={`w-full h-8 rounded ${activePlacement === 'sidebar' ? 'bg-emerald-500/15' : 'bg-slate-100 dark:bg-slate-700/50'}`} />
                          <div className={`w-full h-6 rounded ${activePlacement === 'sidebar' ? 'bg-emerald-500/10' : 'bg-slate-100 dark:bg-slate-700/50'}`} />
                        </div>
                        {activePlacement !== 'sidebar' && (
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* === 4. GLOBAL POPUP OVERLAY === */}
                  <AnimatePresence>
                    {activePlacement === 'popup' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center rounded-b-2xl"
                      >
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          className="w-[75%] bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl shadow-purple-500/20 border-2 border-purple-500 relative"
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); setActivePlacement(null); }}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
                          >
                            <LuX size={10} />
                          </button>
                          <div className="flex flex-col items-center gap-2 text-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center">
                              <LuMaximize className="text-white text-sm" />
                            </div>
                            <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest">
                              Your Popup Ad
                            </span>
                            <span className="text-[8px] text-slate-500 dark:text-slate-400 font-medium">
                              Full-screen overlay • Max impact
                            </span>
                            <div className="w-full h-10 bg-slate-100 dark:bg-slate-700 rounded-lg mt-1" />
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Popup trigger zone (bottom bar) */}
                  {activePlacement !== 'popup' && (
                    <div
                      onClick={() => setActivePlacement('popup')}
                      className="mx-2 mb-2 cursor-pointer"
                    >
                      <div className="relative bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/15 dark:to-pink-500/15 border border-purple-300/30 dark:border-purple-500/20 rounded-lg px-3 py-2 flex items-center justify-between hover:ring-1 hover:ring-purple-400/50 transition-all">
                        <div className="flex items-center gap-2">
                          <LuMaximize className="text-purple-500/60 text-xs" />
                          <span className="text-[9px] font-bold text-purple-500 dark:text-purple-400 uppercase tracking-wider">
                            Global Popup — Click to Preview
                          </span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ============ PLACEMENT SELECTOR BUTTONS ============ */}
              <div className="mt-5 relative z-10">
                <div className="grid grid-cols-4 gap-2">
                  {placementKeys.map((key) => {
                    if (!key) return null;
                    const data = placementData[key];
                    const Icon = data.icon;
                    const isActive = activePlacement === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActivePlacement(isActive ? null : key)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-300 border ${isActive
                          ? `${data.borderColor} ${data.bgHighlight} shadow-lg ${data.glowColor}`
                          : 'border-slate-100 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/30 hover:border-slate-200 dark:hover:border-slate-600'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isActive
                          ? `bg-gradient-to-br ${data.accentColor} text-white shadow-md`
                          : 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500'
                          }`}>
                          <Icon size={14} />
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider text-center leading-tight transition-colors ${isActive ? data.textColor : 'text-slate-400 dark:text-slate-500'
                          }`}>
                          {data.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ============ INFO PANEL ============ */}
              <AnimatePresence mode="wait">
                {activePlacement && (
                  <motion.div
                    key={activePlacement}
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -5, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="relative z-10 overflow-hidden"
                  >
                    <div className={`mt-4 p-4 rounded-2xl border ${placementData[activePlacement].borderColor} ${placementData[activePlacement].bgHighlight}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${placementData[activePlacement].accentColor} flex items-center justify-center text-white shrink-0 shadow-md`}>
                          {(() => {
                            const Icon = placementData[activePlacement].icon;
                            return <Icon size={16} />;
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide">
                              {placementData[activePlacement].title}
                            </span>
                            <span className={`text-[9px] font-bold ${placementData[activePlacement].tagColor} px-2 py-0.5 rounded-full border uppercase tracking-wider`}>
                              {placementData[activePlacement].tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                            {placementData[activePlacement].description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[10px] font-bold ${placementData[activePlacement].textColor}`}>
                              📊 {placementData[activePlacement].reach}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
