import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  LuGraduationCap, LuBuilding, LuUsers, LuCalendar,
  LuHeartHandshake, LuShieldCheck, LuSparkles, LuArrowRight,
  LuShoppingBag, LuCheck, LuMegaphone, LuMail
} from 'react-icons/lu';
import SEO from '../../components/SEO';
import PremiumPageLoader from '../../components/ui/PremiumPageLoader';

const AboutUs = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'University Campuses', value: '15+', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
    { label: 'Active Undergrads', value: '50,000+', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' },
    { label: 'Verified Annexes', value: '500+', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
    { label: 'Campus Events Hosted', value: '250+', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
  ];

  const pillars = [
    {
      icon: LuBuilding,
      title: 'Verified Annex Hunting',
      desc: 'Direct, zero-commission connections between students and house owners near all major state & private universities in Sri Lanka.',
      badge: 'Housing'
    },
    {
      icon: LuCalendar,
      title: 'Central Campus Event Radar',
      desc: 'Never miss a hackathon, workshop, batch party, or club event again. All faculty buzz organized into one live stream.',
      badge: 'Events'
    },
    {
      icon: LuShoppingBag,
      title: 'Hustle Hub Peer Market',
      desc: 'Buy, sell, or trade used textbooks, electronics, notes, and dorm gear safely within verified student communities.',
      badge: 'Marketplace'
    },
    {
      icon: LuHeartHandshake,
      title: 'Uni Porondam Matchmaking',
      desc: 'Privacy-focused student matchmaking built exclusively for verified undergraduates with photo-blurring & phone masking.',
      badge: 'Matchmaking'
    },
    {
      icon: LuMegaphone,
      title: 'Targeted Student Advertising',
      desc: 'Helping brands, tech academies, and local businesses reach verified undergraduates with high ROI promotional tools.',
      badge: 'B2B Hub'
    },
    {
      icon: LuShieldCheck,
      title: 'PDPA Compliant Safety',
      desc: 'Strict privacy controls, automatic inactivity data retention policies, and zero Google indexing on confidential profiles.',
      badge: 'Security'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 relative overflow-hidden font-sans select-none">
      <SEO
        title="About Us - The Uni Gang"
        description="Learn about Sri Lanka's leading university student platform connecting undergraduates to annexes, events, marketplace, and matchmaking."
      />

      <PremiumPageLoader isLoading={loading} message="Loading About Us..." />

      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 relative z-10 space-y-20"
          >
            {/* Background Ambient Glows */}
            <div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
            <div className="fixed bottom-1/4 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none translate-y-1/2 -translate-x-1/3" />

            {/* Hero Header */}
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800 shadow-xs">
                <LuSparkles size={16} /> Our Mission & Vision
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
                Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">University Life</span> Across Sri Lanka
              </h1>

              <p className="text-slate-600 dark:text-slate-400 font-medium text-base sm:text-lg leading-relaxed">
                The Uni Gang is Sri Lanka’s first centralized student super-app built by undergraduates, for undergraduates. We simplify housing, community events, peer trading, and campus connections.
              </p>
            </div>

            {/* Key Metrics Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-3xl border shadow-xs flex flex-col justify-between ${stat.bg}`}
                >
                  <h3 className={`text-3xl sm:text-4xl font-black ${stat.color}`}>{stat.value}</h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden group">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-bold mb-6">
                  <LuGraduationCap size={28} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Our Mission</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
                  To eliminate the stress of university life by giving every student instant access to verified accommodation listings, faculty event news, safe marketplace trading, and private peer connections without middleman fees.
                </p>
              </div>

              <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden group">
                <div className="w-14 h-14 rounded-2xl bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 flex items-center justify-center font-bold mb-6">
                  <LuUsers size={28} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Our Vision</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
                  To become the indispensable digital backbone for higher education in Sri Lanka — connecting undergraduates from Moratuwa, Colombo, Peradeniya, SLIIT, NSBM, KDU, and beyond into one thriving, safe community.
                </p>
              </div>
            </div>

            {/* Core Pillars Grid */}
            <div className="space-y-10">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">What Makes Us Different</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">A complete suite of tools tailored specifically for Sri Lankan campus life.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pillars.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="p-7 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 flex items-center justify-center">
                          <item.icon size={22} />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom CTA Box */}
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-2xl sm:text-3xl font-black">Ready to explore campus life?</h3>
                <p className="text-blue-100 text-sm font-medium">Join 50,000+ students finding annexes, events, and campus opportunities daily.</p>
              </div>

              <div className="flex flex-wrap gap-4 shrink-0 justify-center">
                <Link
                  to="/annex-list"
                  className="px-6 py-3.5 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
                >
                  <span>Find Annexes</span>
                  <LuArrowRight size={14} />
                </Link>
                <Link
                  to="/contact-us"
                  className="px-6 py-3.5 rounded-2xl bg-blue-700/50 hover:bg-blue-700 text-white border border-blue-400/30 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <LuMail size={14} />
                  <span>Contact Team</span>
                </Link>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutUs;
