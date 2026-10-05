import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuShieldCheck, LuCookie, LuDatabase, LuUserCheck,
  LuLock, LuGlobe, LuMail, LuFileText, LuClock, LuCheck
} from 'react-icons/lu';
import SEO from '../../components/SEO';
import PremiumPageLoader from '../../components/ui/PremiumPageLoader';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('introduction');
  const lastUpdated = 'October 2026';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const sections = [
    {
      id: 'introduction',
      icon: LuShieldCheck,
      title: '1. Introduction & Overview',
      content: (
        <div className="space-y-3">
          <p>
            Welcome to <strong>The Uni Gang</strong>. We are committed to protecting your personal information and your right to data privacy.
            This Privacy Policy describes how we collect, process, and safeguard the personal data provided by undergraduates, annex owners, advertisers, and visitors across our websites, web applications, and services.
          </p>
          <p>
            By accessing or using our platform, you confirm that you have read, understood, and agreed to our data collection, storage, and retention practices as described under Sri Lanka’s Personal Data Protection Act (PDPA) guidelines.
          </p>
        </div>
      )
    },
    {
      id: 'information-collection',
      icon: LuDatabase,
      title: '2. Information We Collect',
      content: (
        <div className="space-y-4">
          <p>We collect information in two main ways to provide a seamless university experience:</p>
          <div className="p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-sm">
              <LuGlobe className="text-blue-500" /> Automatic Usage Data
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Device type, operating system, browser specifications, IP address, and anonymized page view analytics used to optimize platform load speeds and security.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-sm">
              <LuUserCheck className="text-blue-500" /> Voluntary User Submissions
            </h4>
            <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 font-normal">
              <li><strong>Accounts:</strong> Full Name, Email Address, University, and Faculty verification details.</li>
              <li><strong>Annex Listings:</strong> Property location, monthly rent, photos, and owner WhatsApp/phone contact info.</li>
              <li><strong>Hustle Hub Market:</strong> Product photos, price, item condition, and seller contact details.</li>
              <li><strong>Matchmaking (Uni Porondam):</strong> Profile preferences, bio, and optional blurred/unblurred photos.</li>
              <li><strong>Ad Campaigns:</strong> Organization name, email, brand artwork, and target destination URL.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'matchmaking-privacy',
      icon: LuLock,
      title: '3. Uni Porondam Matchmaking Privacy',
      content: (
        <div className="space-y-3">
          <p>
            Our student matchmaking engine is built with strict privacy and security controls:
          </p>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 font-normal">
            <li><strong>Photo Blurring:</strong> You retain complete control over your photo visibility. Photos remain blurred until you explicitly accept a proposal request.</li>
            <li><strong>AI Phone Number Masking:</strong> Premium members can initiate secure voice or video calls without revealing their actual phone number.</li>
            <li><strong>Zero Public Search Indexing:</strong> Matchmaking profiles are restricted to verified undergraduates and are never indexed on Google or public web search engines.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'data-retention',
      icon: LuClock,
      title: '4. Data Retention & Archival Policies',
      content: (
        <div className="space-y-4">
          <p>Under strict PDPA data minimization regulations, we enforce automated data retention lifecycles:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
              <span className="text-amber-600 dark:text-amber-400 font-black tracking-widest text-[10px] uppercase block mb-1">1 Month Inactivity</span>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Account Archival</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-normal">Profiles with zero activity for 30 consecutive days are temporarily archived to preserve infrastructure performance.</p>
            </div>
            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800">
              <span className="text-rose-600 dark:text-rose-400 font-black tracking-widest text-[10px] uppercase block mb-1">12 Months Inactivity</span>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Permanent Erasure</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-normal">Accounts dormant for 12 consecutive months and associated personal records are permanently and securely deleted from our databases.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'user-rights',
      icon: LuUserCheck,
      title: '5. Your Privacy Rights',
      content: (
        <div className="space-y-3">
          <p>
            You hold the right to request access to your stored personal data, request corrections, or request immediate deletion of your account and listings at any time.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
            To exercise your rights or request an export of your personal information, reach out to our privacy desk at <a href="mailto:uniganglk@gmail.com" className="text-blue-600 font-bold hover:underline">uniganglk@gmail.com</a>.
          </p>
        </div>
      )
    },
    {
      id: 'third-party',
      icon: LuGlobe,
      title: '6. Third-Party Links & Integrations',
      content: (
        <p>
          Our services contain direct links to third-party services, such as landlord WhatsApp hotlines, Google One Tap sign-in, and external event ticketing portals. When you navigate to external platforms, their privacy terms govern your interactions.
        </p>
      )
    },
    {
      id: 'cookies',
      icon: LuCookie,
      title: '7. Cookies & Local Session Storage',
      content: (
        <p>
          We use browser local storage and essential cookies to keep you securely authenticated, remember your active theme (Dark/Light mode), and store your last submitted ad tracking ID for quick access.
        </p>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 relative overflow-hidden font-sans select-none">
      <SEO
        title="Privacy Policy - The Uni Gang"
        description="Read The Uni Gang Privacy Policy to understand how we collect, store, and protect your personal data under PDPA guidelines."
      />

      <PremiumPageLoader isLoading={loading} message="Securing Data Policy..." />

      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 relative z-10 space-y-12"
          >
            {/* Ambient Backgrounds */}
            <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none translate-x-1/3" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none -translate-x-1/3" />

            {/* Header */}
            <div className="text-center space-y-5 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800 shadow-xs">
                <LuShieldCheck size={16} /> Legal & Data Governance
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Policy</span>
              </h1>

              <p className="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">
                Last Updated: <span className="font-bold text-slate-900 dark:text-slate-200 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">{lastUpdated}</span>
              </p>
            </div>

            {/* Layout Grid (Sticky Table of Contents Sidebar + Content) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Sticky TOC Sidebar */}
              <div className="lg:col-span-4 sticky top-28 hidden lg:block">
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Table of Contents</h3>
                  <nav className="flex flex-col gap-1.5">
                    {sections.map((sec) => (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        onClick={() => setActiveSection(sec.id)}
                        className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                          activeSection === sec.id
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <sec.icon size={15} />
                        <span className="truncate">{sec.title}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main Policy Sections */}
              <div className="lg:col-span-8 space-y-6">
                {sections.map((sec) => (
                  <motion.div
                    key={sec.id}
                    id={sec.id}
                    whileHover={{ y: -2 }}
                    className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-4"
                  >
                    <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 flex items-center justify-center shrink-0">
                        <sec.icon size={20} />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-wide">{sec.title}</h3>
                    </div>

                    <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                      {sec.content}
                    </div>
                  </motion.div>
                ))}

                {/* Support Banner */}
                <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                  <div>
                    <h4 className="text-xl font-black">Questions about your data?</h4>
                    <p className="text-blue-100 text-xs sm:text-sm font-medium mt-1">Our privacy officer is here to assist with data access or deletion requests.</p>
                  </div>
                  <Link
                    to="/contact-us"
                    className="px-6 py-3 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 font-black text-xs uppercase tracking-wider shadow-md transition-all shrink-0 cursor-pointer"
                  >
                    Contact Privacy Team
                  </Link>
                </div>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrivacyPolicy;
