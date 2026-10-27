import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LuTrendingUp, LuUsers, LuTarget, LuMegaphone, LuCheck,
  LuFileText, LuX, LuZap, LuShieldCheck, LuPrinter, LuSparkles,
  LuGraduationCap, LuMousePointer, LuLayoutDashboard, LuPanelRight,
  LuRss, LuMaximize
} from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa6';
import SEO from '../../components/SEO';
import HeroDeviceMockup from './components/HeroDeviceMockup';
import HowItWorks from './components/HowItWorks';
import PlacementExplorer from './components/PlacementExplorer';
import ReachCalculator from './components/ReachCalculator';
import FaqAccordion from './components/FaqAccordion';
import MobileStickyCta from './components/MobileStickyCta';
import { AdTrackModal } from './components/AdTrackModal';
import { PageBreadcrumb } from '../../components/ui/PageBreadcrumb';
import { api } from '../../api';

export default function AdvertiseLanding() {
  const navigate = useNavigate();
  const [showMediaKit, setShowMediaKit] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [liveStats, setLiveStats] = useState<{
    totalStudents: number;
    estimatedReach: number;
    totalImpressions: number;
    activeCampuses: number;
    avgCtr: string;
    approvedAnnexes: number;
    totalEvents: number;
  }>({
    totalStudents: 150,
    estimatedReach: 2850,
    totalImpressions: 48500,
    activeCampuses: 52,
    avgCtr: '3.8%',
    approvedAnnexes: 42,
    totalEvents: 18,
  });

  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    api.getPublicStats().then((data) => {
      if (data && data.estimatedReach) {
        setLiveStats(data);
      }
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get('track') === 'true' || params.get('id') || params.get('email')) {
      setShowTrackModal(true);
    }
  }, []);

  useEffect(() => {
    if (!showMediaKit) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMediaKit(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showMediaKit]);

  const pricingTiers = [
    {
      name: 'Campus Starter',
      tagline: 'Ideal for local shops, student deals & single campus events',
      price: 'LKR 4,500',
      period: '/ 7 Days',
      badge: 'Starter',
      featured: false,
      features: [
        '1 Placement (Sidebar or Native Feed)',
        'Guaranteed ~15,000 impressions',
        'Basic Click & View Analytics',
        'Standard 12h Approval Turnaround',
        'Direct Link to your Website / Social'
      ],
      ctaText: 'Select Starter',
      placementType: 'SIDEBAR'
    },
    {
      name: 'Campus Hero',
      tagline: 'Most Popular for Higher Ed Institutes, IT Academies & Fast Food Brands',
      price: 'LKR 12,500',
      period: '/ 14 Days',
      badge: 'Most Popular',
      featured: true,
      features: [
        '2 Premium Placements (Top Banner + Native Feed)',
        'Guaranteed ~50,000+ impressions',
        'Real-time Dashboard Analytics',
        'Targeted University Filters (UOM, SLIIT, NSBM, UOC)',
        'WhatsApp Lead Direct Routing',
        'Priority 2h Express Approval'
      ],
      ctaText: 'Launch Campus Hero',
      placementType: 'BANNER'
    },
    {
      name: 'Ultimate Uni Blast',
      tagline: 'Maximum Reach & Domination for National Brands & Large Events',
      price: 'LKR 24,500',
      period: '/ 30 Days',
      badge: 'Maximum Impact',
      featured: false,
      features: [
        'Full Suite (Top Banner + Native Feed + Global Popup)',
        'Guaranteed ~150,000+ impressions',
        'Dedicated Campaign Manager',
        'Custom Media Kit Performance Report',
        'Social Media Co-Promotion on Uni Gang Channels',
        '24/7 Dedicated VIP Support'
      ],
      ctaText: 'Get Ultimate Blast',
      placementType: 'POPUP'
    }
  ];

  const faqs = [
    {
      q: 'How fast will my ad campaign go live after submission?',
      a: 'Our campaign review team verifies banner specifications and content compliance within 2 to 4 hours. Once verified, your ad goes live instantly.'
    },
    {
      q: 'Can I target specific universities or regions in Sri Lanka?',
      a: 'Yes! Our system allows geo-targeting and campus-specific filtering so your message reaches students at UOM, SLIIT, UOC, USJ, KDU, NSBM, and more.'
    },
    {
      q: 'Do I get access to real-time performance analytics?',
      a: 'Absolutely. Every advertiser receives live impression counts, click-through rates (CTR), and conversion tracking metrics via their campaign dashboard.'
    },
    {
      q: 'What banner image dimensions are recommended?',
      a: 'Top Banners: 1200x400 px. Sidebar Widgets: 300x300 px. Native Feed Cards: 800x450 px. Global Popup: 600x600 px. High-resolution PNG, JPG or WebP files up to 8MB.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-24 px-4 sm:px-6 lg:px-8 2xl:px-16 overflow-x-hidden">
      <SEO
        title="Advertise to University Students in Sri Lanka - The Uni Gang"
        description="Reach Sri Lankan university students with banner, feed, sidebar and popup ads. Estimate your reach and launch a campaign in minutes."
      />
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto space-y-20 lg:space-y-28">
        {/* Top Breadcrumb Navigation */}
        <div className="pt-2">
          <PageBreadcrumb
            items={[
              { label: 'Advertise', active: true }
            ]}
            backTo="/"
            backLabel="Back to Home"
            shareTitle="Advertise on The Uni Gang - Reach 50,000+ Sri Lankan University Students"
          />
        </div>

        {/* Hero Section */}
        <section id="advertise-hero" className="relative grid lg:grid-cols-2 gap-14 lg:gap-10 items-center pt-6">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative text-center lg:text-left space-y-7">

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl xl:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-[1.05]"
            >
              Put Your Brand in Front of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500">Sri Lanka's Uni Students</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Connect your institute, tech course, food outlet, or student service directly with Gen-Z university students across Sri Lanka.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row sm:flex-wrap justify-center lg:justify-start items-center gap-3 pt-2"
            >
              <button
                onClick={() => navigate('/advertise/submit')}
                id="hero-start-campaign"
                className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base uppercase tracking-wider rounded-2xl shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <LuMegaphone className="w-5 h-5" /> Start Campaign Now
              </button>

              <button
                onClick={() => setShowTrackModal(true)}
                id="hero-track-campaign"
                className="w-full sm:w-auto px-7 py-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-black text-base uppercase tracking-wider rounded-2xl shadow-lg border border-slate-700/50 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LuTrendingUp className="w-5 h-5 text-cyan-400" /> Track My Ad Status
              </button>

              <button
                onClick={() => setShowMediaKit(true)}
                id="hero-view-media-kit"
                className="w-full sm:w-auto px-7 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 text-slate-900 dark:text-white font-black text-base uppercase tracking-wider rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LuFileText className="w-5 h-5 text-blue-500" /> View Media Kit
              </button>
            </motion.div>

            {/* Trust row */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 text-xs font-bold text-slate-500 dark:text-slate-400"
            >
              {['No account needed to advertise', '2–4h review turnaround', 'Live views & CTR tracker'].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <LuCheck className="w-4 h-4 text-emerald-500" /> {t}
                </li>
              ))}
            </motion.ul>
          </div>

          <div className="relative pb-6">
            <HeroDeviceMockup />
          </div>
        </section>

        {/* Stats Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: LuUsers, stat: `${(liveStats?.estimatedReach || 2850).toLocaleString()}+`, label: 'Monthly Student Reach', sub: `Across ${liveStats?.activeCampuses || 52} Campuses` },
            { icon: LuTarget, stat: liveStats?.avgCtr || '3.8%', label: 'Avg Engagement CTR', sub: 'High Click Intent Gen-Z' },
            { icon: LuTrendingUp, stat: `${Math.round((liveStats?.totalImpressions || 48500) / 1000)}K+`, label: 'Delivered Impressions', sub: 'Mobile & Web Reach' },
            { icon: LuZap, stat: '2-4 Hrs', label: 'Express Approval', sub: 'Fast Campaign Turnaround' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-3xl text-center space-y-3 shadow-xl shadow-slate-200/40 dark:shadow-none hover:border-blue-500/50 transition-all"
            >
              <div className="w-14 h-14 mx-auto bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-2xl">
                <item.icon />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{item.stat}</h3>
              <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">{item.label}</p>
              <p className="text-[11px] font-medium text-slate-400">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <HowItWorks />

        {/* Interactive Placement Explorer */}
        <PlacementExplorer />

        {/* Reach / ROI Calculator */}
        <ReachCalculator />

        {/* Pricing Tiers Section */}
        <section id="pricing" className="space-y-12 scroll-mt-24">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <LuTrendingUp /> B2B Pricing Plans
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Transparent Campaign Pricing</h2>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">Choose a package tailored for your budget and campaign objectives. No hidden fees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 2xl:gap-10 items-stretch">
            {pricingTiers.map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className={`relative rounded-3xl p-6 sm:p-7 2xl:p-8 flex flex-col justify-between transition-all duration-300 ${tier.featured
                  ? 'bg-slate-900 text-white border-2 border-blue-500 shadow-2xl shadow-blue-500/20 lg:scale-105 z-10'
                  : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl'
                  }`}
              >
                {tier.badge && (
                  <div className={`absolute -top-4 right-8 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${tier.featured
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}>
                    {tier.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-2xl font-black uppercase tracking-wide ${tier.featured ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {tier.name}
                    </h3>
                    <p className={`text-xs font-medium mt-2 leading-relaxed ${tier.featured ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                      {tier.tagline}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-3xl sm:text-4xl 2xl:text-5xl font-black tracking-tight whitespace-nowrap">{tier.price}</span>
                    <span className={`text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap shrink-0 ${tier.featured ? 'text-slate-400' : 'text-slate-400'}`}>
                      {tier.period}
                    </span>
                  </div>

                  <div className={`h-px ${tier.featured ? 'bg-slate-800' : 'bg-slate-100 dark:bg-slate-800'}`} />

                  <ul className="space-y-3.5">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-sm font-medium">
                        <LuCheck className={`w-5 h-5 shrink-0 mt-0.5 ${tier.featured ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'}`} />
                        <span className={tier.featured ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => navigate(`/advertise/submit?tier=${encodeURIComponent(tier.name)}`)}
                  className={`mt-8 w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer ${tier.featured
                    ? 'bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-xl shadow-blue-600/30 hover:scale-[1.02]'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-slate-900 dark:text-white hover:scale-[1.02]'
                    }`}
                >
                  {tier.ctaText}
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Advertiser FAQ Section */}
        <FaqAccordion faqs={faqs} />

        {/* Bottom CTA Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-[2.5rem] p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl shadow-blue-600/20">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight max-w-3xl mx-auto">Ready to Grow Your Business with Student Audiences?</h2>
          <p className="text-white/80 font-medium text-lg max-w-2xl mx-auto">
            Submit your campaign proposal in under 2 minutes. Our team will handle layout optimization and live activation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/advertise/submit')}
              className="px-8 py-4 bg-white text-blue-600 font-black text-lg uppercase tracking-wider rounded-2xl shadow-xl hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Submit Campaign Request
            </button>
          </div>
        </div>

      </div>

      <MobileStickyCta />

      {/* Premium Media Kit Modal */}
      <AnimatePresence>
        {showMediaKit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMediaKit(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 25 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative w-full max-w-3xl bg-white/95 dark:bg-slate-900/95 border border-white/60 dark:border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.5)] max-h-[92vh] overflow-y-auto space-y-7 z-10 custom-scrollbar"
            >
              {/* Ambient glows */}
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setShowMediaKit(false)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-rose-500 hover:text-white hover:rotate-90 transition-all duration-300 border-none cursor-pointer z-20"
                aria-label="Close Media Kit"
              >
                <LuX className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="space-y-2 border-b border-slate-150 dark:border-slate-800/80 pb-5 pr-12">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 text-blue-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest">
                  <LuSparkles className="text-amber-400" /> Official Publisher Deck 2026
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                  The Uni Gang <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-400">Media Kit</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Verified audience demographics, advertising specs, and performance guarantees for brands reaching Sri Lankan university students.
                </p>
              </div>

              {/* 4 Core Verified Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
                  <div className="flex items-center justify-center text-blue-600 dark:text-cyan-400 mb-1">
                    <LuUsers size={18} />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">50,000+</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Active Students</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
                  <div className="flex items-center justify-center text-purple-600 dark:text-purple-400 mb-1">
                    <LuTrendingUp size={18} />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">2,000,000+</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Monthly Views</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
                  <div className="flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-1">
                    <LuMousePointer size={18} />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">3.8%</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Avg Click-Through</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
                  <div className="flex items-center justify-center text-amber-500 mb-1">
                    <LuGraduationCap size={18} />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">94%</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Age 18 - 25 Cohort</p>
                </div>
              </div>

              {/* Placement Specifications Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <LuTarget className="text-blue-500" /> Ad Placement Dimensions & Specs
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JPG, PNG, WebP (Max 8MB)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 shrink-0">
                      <LuLayoutDashboard size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Top Hero Banner</span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-blue-500/15 text-blue-600 dark:text-cyan-400">1200 x 400 px</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Full-width placement at the header of major sections. First touchpoint for all campus visitors (~45K daily views).
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <LuPanelRight size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Sticky Sidebar Widget</span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">300 x 300 px</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Persistent square ad card that remains anchored as students scroll through feeds (~30K daily views).
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                      <LuRss size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Native Feed Card</span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400">800 x 450 px</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        In-stream organic banner integrated naturally between listings and stories. Highest organic CTR (~38K daily views).
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                      <LuMaximize size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Global Popup Interstitial</span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-purple-500/15 text-purple-600 dark:text-purple-400">600 x 600 px</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        High-impact interstitial overlay with automatic 10s countdown timer. Guaranteed 100% impression rate (~50K daily views).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demographics & Campus Reach */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2.5">
                <p className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Campus Distribution Breakdown
                </p>
                <div className="flex flex-wrap gap-2">
                  {['University of Moratuwa (UOM)', 'University of Colombo (UOC)', 'SLIIT Malabe', 'University of Sri Jayewardenepura (USJ)', 'University of Kelaniya', 'University of Peradeniya', 'NSBM Green University', 'IIT Colombo'].map(uni => (
                    <span key={uni} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {uni}
                    </span>
                  ))}
                </div>
              </div>

              {/* Trust & Brand Safety Notice */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 flex items-start gap-3">
                <LuShieldCheck className="w-5 h-5 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-blue-950 dark:text-blue-200 font-medium">
                  <strong>Brand Safety & Student Relevance Guarantee:</strong> Every advertisement is vetted by human moderators within 2-4 hours to guarantee zero spam, authentic youth relevance, and verified external destination URLs.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 border-t border-slate-150 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border-none cursor-pointer"
                  title="Print or Save as PDF"
                >
                  <LuPrinter size={15} /> Save / Print Deck
                </button>

                <a
                  href="https://wa.me/94724478148?text=Hi%20UniGang!%20I%20would%20like%20to%20discuss%20a%20Custom%20Media%20Kit%20Advertising%20Campaign."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all text-decoration-none shadow-md shadow-emerald-600/20"
                >
                  <FaWhatsapp size={15} /> WhatsApp Media Desk
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setShowMediaKit(false);
                    navigate('/advertise/submit');
                  }}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
                >
                  <LuZap size={15} /> Book Campaign Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ad Tracking Modal */}
      <AdTrackModal
        isOpen={showTrackModal}
        onClose={() => {
          setShowTrackModal(false);
          if (window.location.search.includes('track') || window.location.search.includes('id') || window.location.search.includes('email')) {
            navigate('/advertise', { replace: true });
          }
        }}
        initialQuery={new URLSearchParams(window.location.search).get('id') || new URLSearchParams(window.location.search).get('email') || undefined}
      />

    </div>
  );
}
