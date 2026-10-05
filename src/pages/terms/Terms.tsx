import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuScale, LuLayers, LuUserCog, LuMessageSquareWarning,
  LuClock, LuBan, LuShieldAlert, LuMail, LuHeartHandshake, LuCheck
} from 'react-icons/lu';
import SEO from '../../components/SEO';
import PremiumPageLoader from '../../components/ui/PremiumPageLoader';
import { Link } from 'react-router-dom';

const Terms = () => {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('platform-role');
  const lastUpdated = 'October 2026';

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const sections = [
    {
      id: 'platform-role',
      icon: LuLayers,
      title: '1. Platform Role & Facilitator Status',
      content: (
        <div className="space-y-3">
          <p>
            "The Uni Gang" operates exclusively as a digital aggregator and community platform designed to connect Sri Lankan university undergraduates with housing options, campus event updates, peer trading marketplace, student blogs, and matchmaking proposals.
          </p>
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
            We act solely as a digital facilitator. We do <strong>not</strong> own, manage, endorse, or guarantee third-party rental properties, external event tickets, or user-posted advertisements listed on our platform.
          </div>
        </div>
      )
    },
    {
      id: 'user-content',
      icon: LuUserCog,
      title: '2. User Submissions & Copyright',
      content: (
        <p>
          As a student platform, users may post event notices, upload annex photos, sell goods on Hustle Hub, and submit student blogs. By submitting content, you confirm that you hold all necessary rights and licenses. For Student Blogs, you retain intellectual property ownership while granting us a non-exclusive license to display your work with author credit.
        </p>
      )
    },
    {
      id: 'third-party',
      icon: LuMessageSquareWarning,
      title: '3. Offline & Third-Party Transactions',
      content: (
        <div className="space-y-3">
          <p>
            Our platform enables direct communication between students and third parties (e.g., house owners, event organizers, peer sellers) via WhatsApp or phone.
          </p>
          <p className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400">
            All offline transactions, advance deposits, and agreements conducted outside of "The Uni Gang" are strictly at your own risk. Always inspect properties and verify seller details prior to transferring funds.
          </p>
        </div>
      )
    },
    {
      id: 'inactivity-policy',
      icon: LuClock,
      title: '4. Account Inactivity & Data Retention',
      content: (
        <div className="space-y-3">
          <p>To preserve system integrity and ensure data minimization under PDPA rules:</p>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 font-normal">
            <li><strong>1 Month Inactivity:</strong> Accounts showing zero activity for 30 consecutive days will be temporarily archived to conserve database resources.</li>
            <li><strong>12 Months Inactivity:</strong> Accounts and associated data showing zero login activity for 12 consecutive months will be permanently and securely deleted.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'matchmaking-rules',
      icon: LuHeartHandshake,
      title: '5. Uni Porondam Matchmaking Rules',
      content: (
        <div className="space-y-3">
          <p>
            The Uni Porondam matchmaking feature is exclusively reserved for verified undergraduates and alumni seeking genuine relationships. By using this service, you agree to:
          </p>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 font-normal">
            <li><strong>Zero Harassment:</strong> Hate speech, offensive language, or harassment results in an immediate permanent ban.</li>
            <li><strong>Authentic Identity:</strong> Profiles must reflect real undergraduate credentials; fake accounts are immediately purged.</li>
            <li><strong>Subscription Terms:</strong> Premium features (unlimited proposals, video calling) are billed on a recurring monthly cycle and can be cancelled at any time.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'prohibited-use',
      icon: LuBan,
      title: '6. Prohibited Platform Activities',
      content: (
        <div className="space-y-2">
          <p>Users are strictly prohibited from engaging in the following behaviors:</p>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-1.5 font-normal">
            <li>Scraping platform data or automated spamming of member feeds.</li>
            <li>Posting fake annex listings or fraudulent marketplace items.</li>
            <li>Plagiarizing articles in the Student Blogs section.</li>
            <li>Impersonating another student or university faculty member.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'liability',
      icon: LuShieldAlert,
      title: '7. Limitation of Liability',
      content: (
        <p>
          To the maximum extent permitted by applicable law, "The Uni Gang" and its creators shall not be held liable for indirect, incidental, or consequential damages resulting from canceled university events, misrepresented rental annexes, or disputes between buyers and sellers.
        </p>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 relative overflow-hidden font-sans select-none">
      <SEO
        title="Terms of Service - The Uni Gang"
        description="Read The Uni Gang Terms of Service governing platform usage, student annex listings, events, marketplace, and matchmaking rules."
      />

      <PremiumPageLoader isLoading={loading} message="Loading Terms of Service..." />

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
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -translate-x-1/3" />

            {/* Header */}
            <div className="text-center space-y-5 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest border border-indigo-200 dark:border-indigo-800 shadow-xs">
                <LuScale size={16} /> Legal Agreement
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Service</span>
              </h1>

              <p className="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">
                Last Updated: <span className="font-bold text-slate-900 dark:text-slate-200 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">{lastUpdated}</span>
              </p>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Sticky TOC Sidebar */}
              <div className="lg:col-span-4 sticky top-28 hidden lg:block">
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Terms Index</h3>
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

              {/* Main Terms Sections */}
              <div className="lg:col-span-8 space-y-6">
                {sections.map((sec) => (
                  <motion.div
                    key={sec.id}
                    id={sec.id}
                    whileHover={{ y: -2 }}
                    className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-4"
                  >
                    <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center shrink-0">
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
                    <h4 className="text-xl font-black">Need assistance with legal terms?</h4>
                    <p className="text-blue-100 text-xs sm:text-sm font-medium mt-1">Our support team is ready to answer any questions regarding terms or user guidelines.</p>
                  </div>
                  <Link
                    to="/contact-us"
                    className="px-6 py-3 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 font-black text-xs uppercase tracking-wider shadow-md transition-all shrink-0 cursor-pointer"
                  >
                    Contact Legal Desk
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

export default Terms;
