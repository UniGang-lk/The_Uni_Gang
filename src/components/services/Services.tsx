import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LuLayoutDashboard,
  LuPalette,
  LuCamera,
  LuSearch,
  LuArrowRight,
  LuCheck,
  LuDollarSign,
  LuClock,
  LuCpu
} from 'react-icons/lu';
import { useState } from 'react';
import TiltCard from '../ui/TiltCard';
import PremiumPageLoader from '../ui/PremiumPageLoader';

const categories = [
  {
    id: 'tech',
    title: 'Software & Tech',
    desc: 'Custom software applications, web portals, and mobile app developments designed to scale.',
    icon: <LuLayoutDashboard className="size-6" />,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
    features: ['Custom Software Dev', 'Web & Mobile Apps', 'Enterprise & Systems'],
    gradient: 'from-blue-500/10 to-indigo-500/10',
    accentColor: 'text-blue-500 bg-blue-500/10',
    shadowGlow: 'hover:shadow-blue-500/20'
  },
  {
    id: 'design',
    title: 'Branding & Design',
    desc: 'Visual identities, logos, and custom branding packages that capture your core essence.',
    icon: <LuPalette className="size-6" />,
    image: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?q=80&w=600&auto=format&fit=crop',
    features: ['Logo & Branding Kits', 'Social Media Branding', 'Print & Vector Media'],
    gradient: 'from-purple-500/10 to-pink-500/10',
    accentColor: 'text-purple-500 bg-purple-500/10',
    shadowGlow: 'hover:shadow-purple-500/20'
  },
  {
    id: 'media',
    title: 'Media Production',
    desc: 'Cinematic video shoots, batch photoshoots, event coverage, and high-impact commercial editing.',
    icon: <LuCamera className="size-6" />,
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop',
    features: ['Batch & Convocation Shoots', 'Cinematic Event Videos', 'Professional Editing'],
    gradient: 'from-orange-500/10 to-rose-500/10',
    accentColor: 'text-rose-500 bg-rose-500/10',
    shadowGlow: 'hover:shadow-rose-500/20'
  },
  {
    id: 'growth',
    title: 'Growth & SEO',
    desc: 'Technical SEO audits, speed optimizations, and backlink strategies to rank higher.',
    icon: <LuSearch className="size-6" />,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
    features: ['Technical SEO Audits', 'On-page Speedups', 'Keyword Optimization'],
    gradient: 'from-emerald-500/10 to-teal-500/10',
    accentColor: 'text-emerald-500 bg-emerald-500/10',
    shadowGlow: 'hover:shadow-emerald-500/20'
  }
];

const Services = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleExploreServices = () => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/services');
      setTimeout(() => setIsNavigating(false), 500);
    }, 300);
  };

  return (
    <section id="services" className="relative py-32 bg-white dark:bg-[#020617] overflow-hidden">
      {/* Smooth Section Blend Overlays */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-white via-white dark:from-[#020617] dark:via-[#020617] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white dark:from-[#020617] dark:via-[#020617] to-transparent pointer-events-none z-10" />
      <PremiumPageLoader isLoading={isNavigating} message="Opening Services Hub..." />

      {/* ── Background Patterns (Indigo/Blue Theme) ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_35%,rgba(99,102,241,0.06),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_65%,rgba(59,130,246,0.06),transparent_50%)]" />

        {/* Ambient Glowing Orbs */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-indigo-500/5 blur-[120px] rounded-full"
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
          {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-4">
            <LuTrendingUp className="text-sm" /> Digital Agency Solutions
          </div> */}
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Our Premium <span className="text-indigo-600 italic">Services</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Cutting-edge tech, graphics, and media solutions designed specifically to help student projects and local businesses stand out.
          </p>
        </motion.div>

        {/* ── Premium Asymmetric Split Deck (Splits 35% / 65%) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">

          {/* LEFT: Estimator Preview Card Widget (35% width / 4 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4 flex flex-col justify-between"
          >
            <TiltCard className="h-full">
              <div
                onClick={handleExploreServices}
                className="relative h-full bg-gradient-to-b from-indigo-500/10 via-blue-500/5 to-slate-900/10 dark:from-indigo-500/5 dark:via-blue-500/5 dark:to-[#090d1f] backdrop-blur-2xl p-8 rounded-[2.5rem] border border-indigo-500/20 dark:border-indigo-500/10 hover:border-indigo-500/50 transition-all duration-500 shadow-2xl flex flex-col justify-between overflow-hidden cursor-pointer group min-h-[420px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <LuCpu className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                      Live Estimator
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">
                    Instant Quote Configurator
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium">
                    Use our interactive project builder to choose features, calculate pricing, and get direct estimates instantly sent to WhatsApp.
                  </p>

                  {/* Calculator preview mock widget */}
                  <div className="p-4 rounded-2xl bg-white/45 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 space-y-3 shadow-inner">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
                      <span>PROJECT TYPE:</span>
                      <span className="text-indigo-500">WEB DEVELOPMENT</span>
                    </div>
                    <div className="h-px bg-slate-100 dark:bg-slate-800/60" />
                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-1.5 text-slate-650 dark:text-slate-350 font-semibold"><LuDollarSign size={14} /> Estimated Price:</span>
                      <span className="font-black text-slate-900 dark:text-white">LKR 45,000</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-1.5 text-slate-650 dark:text-slate-350 font-semibold"><LuClock size={14} /> Delivery Speed:</span>
                      <span className="font-black text-slate-900 dark:text-white">~ 5 Days</span>
                    </div>
                  </div>

                  {/* Interactive Step-by-Step Flow Widget (Fills empty spacer with beautiful floating animation) */}
                  <div className="flex items-center justify-around py-5 relative mt-4">
                    {/* Glowing dotted line */}
                    <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 border-t border-dashed border-indigo-500/20 dark:border-slate-800" />

                    {[
                      { step: '1', label: 'Configure', desc: 'Pick features' },
                      { step: '2', label: 'Calculate', desc: 'Real-time LKR' },
                      { step: '3', label: 'Transmit', desc: 'Send WhatsApp' }
                    ].map((s, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
                        className="relative z-10 flex flex-col items-center gap-1.5"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-650 dark:text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-md font-bold text-xs">
                          {s.step}
                        </div>
                        <div className="text-[9px] font-black text-slate-700 dark:text-slate-350 uppercase tracking-wider">{s.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 mt-6">
                  <button className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 active:scale-[0.98] transition-all border-none">
                    Start Calculation
                  </button>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* RIGHT: Compact visual category deck (65% width / 8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 2xl:gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.12 }}
                onClick={handleExploreServices}
                className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-150 dark:border-slate-800/80 rounded-[2rem] p-4 2xl:p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:border-indigo-500/40"
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                {/* Top Image Thumbnail with gradient overlay */}
                <div className="relative h-[150px] 2xl:h-[190px] rounded-[1.5rem] overflow-hidden mb-5">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

                  {/* Floating Icon badge over image */}
                  <div className={`absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/90 dark:bg-slate-950/90 backdrop-blur shadow-lg border border-white/20 ${cat.accentColor} group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="px-2 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-base 2xl:text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors uppercase tracking-tight">
                      {cat.title}
                    </h4>
                    <p className="text-xs 2xl:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">
                      {cat.desc}
                    </p>

                    {/* Mini specs list */}
                    <div className="flex flex-wrap gap-2.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      {cat.features.slice(0, 2).map((feat, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-650 dark:text-slate-350 bg-slate-100 dark:bg-slate-800/60 py-1 px-2.5 rounded-lg border border-transparent dark:border-slate-700/40">
                          <LuCheck size={10} className="text-indigo-500" />
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow Link */}
                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/65">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">
                      Estimated Package
                    </span>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider group-hover:text-indigo-500 transition-colors flex items-center gap-1 select-none">
                      Details <LuArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Services;
