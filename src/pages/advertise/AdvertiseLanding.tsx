import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LuTrendingUp, LuUsers, LuTarget, LuMegaphone, LuCheck,
  LuFileText, LuX, LuZap
} from 'react-icons/lu';
import SEO from '../../components/SEO';
import HeroDeviceMockup from './components/HeroDeviceMockup';
import HowItWorks from './components/HowItWorks';
import PlacementExplorer from './components/PlacementExplorer';
import ReachCalculator from './components/ReachCalculator';
import FaqAccordion from './components/FaqAccordion';
import MobileStickyCta from './components/MobileStickyCta';
import { AdTrackModal } from './components/AdTrackModal';
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
    api.getPublicStats().then((data) => {
      if (data && data.estimatedReach) {
        setLiveStats(data);
      }
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get('track') === 'true' || params.get('id')) {
      setShowTrackModal(true);
    }
  }, []);

  const pricingTiers = [
    {
      name: 'Campus Starter',
      tagline: 'Ideal for local shops, student deals & single campus events',
      price: 'LKR 7,500',
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
      price: 'LKR 18,500',
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
      price: 'LKR 35,000',
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
      a: 'Top Banners: 1200x400 px. Sidebar Widgets: 300x300 or 300x250 px. Native Feed Cards: 800x450 px. PNG or JPG files under 5MB.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <SEO
        title="Advertise to University Students in Sri Lanka - The Uni Gang"
        description="Reach Sri Lankan university students with banner, feed, sidebar and popup ads. Estimate your reach and launch a campaign in minutes."
      />
      <div className="max-w-7xl mx-auto space-y-24">

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
            { icon: LuUsers, stat: `${liveStats.estimatedReach.toLocaleString()}+`, label: 'Monthly Student Reach', sub: `Across ${liveStats.activeCampuses} Campuses` },
            { icon: LuTarget, stat: liveStats.avgCtr, label: 'Avg Engagement CTR', sub: 'High Click Intent Gen-Z' },
            { icon: LuTrendingUp, stat: `${Math.round(liveStats.totalImpressions / 1000)}K+`, label: 'Delivered Impressions', sub: 'Mobile & Web Reach' },
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
        <div className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <LuTrendingUp /> B2B Pricing Plans
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Transparent Campaign Pricing</h2>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">Choose a package tailored for your budget and campaign objectives. No hidden fees.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${tier.featured
                  ? 'bg-slate-900 text-white border-2 border-blue-500 shadow-2xl shadow-blue-500/20 scale-105 z-10'
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

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight">{tier.price}</span>
                    <span className={`text-sm font-bold uppercase tracking-wider ${tier.featured ? 'text-slate-400' : 'text-slate-400'}`}>
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
                  className={`mt-8 w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${tier.featured
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 hover:scale-[1.02]'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white hover:scale-[1.02]'
                    }`}
                >
                  {tier.ctaText}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

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
              className="px-8 py-4 bg-white text-blue-600 font-black text-lg uppercase tracking-wider rounded-2xl shadow-xl hover:bg-slate-100 hover:scale-105 transition-all"
            >
              Submit Campaign Request
            </button>
          </div>
        </div>

      </div>

      <MobileStickyCta />

      {/* Media Kit Modal */}
      <AnimatePresence>
        {showMediaKit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowMediaKit(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <LuX className="w-5 h-5" />
              </button>

              <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Official Document</span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase">The Uni Gang Media Kit 2026</h3>
                <p className="text-xs font-medium text-slate-500">Audience Demographics & Advertising Specifications</p>
              </div>

              <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-400 uppercase">Age Distribution</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">18 - 25 Years (94%)</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-400 uppercase">Top Campuses</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">UOM, UOC, SLIIT, USJ</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs">Ad Banner Size Specifications:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <li><strong>Top Banner:</strong> 1200 x 400 pixels (Landscape, Max 5MB)</li>
                    <li><strong>Sidebar Widget:</strong> 300 x 300 pixels (Square / Sticky, Max 3MB)</li>
                    <li><strong>Native Feed Card:</strong> 800 x 450 pixels (16:9 ratio, Max 4MB)</li>
                    <li><strong>Popup Interstitial:</strong> 600 x 600 pixels (Square High Impact, Max 5MB)</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-300 font-medium">
                  📌 All ads are audited for brand safety, non-deceptive claims, and student-focused relevance before activation.
                </div>
              </div>

              <div className="pt-2 flex gap-4">
                <button
                  onClick={() => {
                    setShowMediaKit(false);
                    navigate('/advertise/submit');
                  }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm uppercase tracking-wider"
                >
                  Book Ad Now
                </button>
                <button
                  onClick={() => setShowMediaKit(false)}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ad Tracking Modal */}
      <AdTrackModal
        isOpen={showTrackModal}
        onClose={() => setShowTrackModal(false)}
      />

    </div>
  );
}
