import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuCalendar, LuMapPin, LuShieldCheck, LuMegaphone,
  LuChevronDown, LuHeartHandshake, LuSearch, LuShoppingBag,
  LuCircleHelp, LuArrowRight, LuMail, LuLifeBuoy,
  LuSparkles, LuThumbsUp, LuThumbsDown, LuMessageSquare, LuCheck
} from 'react-icons/lu';
import SEO from '../../components/SEO';
import PremiumPageLoader from '../../components/ui/PremiumPageLoader';
import { Link } from 'react-router-dom';

interface FAQItemProps {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  feedbackState: 'liked' | 'disliked' | null;
  onFeedback: (id: string, type: 'liked' | 'disliked') => void;
}

const FAQItem = ({ id, question, answer, isOpen, onToggle, feedbackState, onFeedback }: FAQItemProps) => {
  return (
    <div
      className={`rounded-2xl transition-all duration-300 border ${
        isOpen
          ? 'bg-white dark:bg-slate-900 border-blue-500/40 shadow-md ring-1 ring-blue-500/10'
          : 'bg-white/90 dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400/40 dark:hover:border-blue-500/40 hover:shadow-xs'
      }`}
    >
      <button
        onClick={onToggle}
        type="button"
        className="w-full px-5 py-4 sm:px-6 sm:py-4.5 flex items-center justify-between gap-4 text-left focus:outline-none cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full shrink-0 transition-colors ${isOpen ? 'bg-blue-600 dark:bg-blue-400 scale-125' : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-blue-400'}`} />
          <span className={`font-bold text-sm sm:text-base transition-colors ${
            isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
          }`}>
            {question}
          </span>
        </div>
        <div
          className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
            isOpen
              ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rotate-180 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
          }`}
        >
          <LuChevronDown size={18} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ ease: 'easeInOut', duration: 0.2 }}
          >
            <div className="px-5 pb-5 sm:px-6 sm:pb-5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-4">
              <p>{answer}</p>

              {/* Feedback Micro-Interaction */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <span className="font-medium text-[11px]">Was this article helpful?</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onFeedback(id, 'liked')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      feedbackState === 'liked'
                        ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {feedbackState === 'liked' ? <LuCheck size={14} /> : <LuThumbsUp size={13} />}
                    <span>Yes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onFeedback(id, 'disliked')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      feedbackState === 'disliked'
                        ? 'bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <LuThumbsDown size={13} />
                    <span>No</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [openId, setOpenId] = useState<string | null>('annex-0');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [feedback, setFeedback] = useState<Record<string, 'liked' | 'disliked'>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleFeedback = (id: string, type: 'liked' | 'disliked') => {
    setFeedback(prev => ({ ...prev, [id]: type }));
  };

  const categories = [
    {
      id: 'annex',
      title: 'Accommodations & Annexes',
      subtitle: 'Student housing, direct landlord contacts, and zero broker fees.',
      icon: LuMapPin,
      badge: 'Housing',
      questions: [
        {
          id: 'annex-0',
          question: 'How do I contact a landlord for a student annex listing?',
          answer: 'Direct contact details (WhatsApp hotline and phone number) are published on every Annex listing detail page. Clicking the contact button connects you directly with the verified property owner.'
        },
        {
          id: 'annex-1',
          question: 'Are there any broker charges or commission fees for students?',
          answer: 'No. The Uni Gang operates on a direct listing model with zero broker charges, hidden fees, or commissions for students searching for accommodation.'
        },
        {
          id: 'annex-2',
          question: 'How do property owners submit an annex listing?',
          answer: 'Property owners can click "Post an Ad" in the main navigation, enter property details, rent terms, and photos. Listings are published following review by our moderation desk.'
        }
      ]
    },
    {
      id: 'market',
      title: 'Hustle Hub Marketplace',
      subtitle: 'Buy and sell textbooks, dorm items, and electronics campus-wide.',
      icon: LuShoppingBag,
      badge: 'Marketplace',
      questions: [
        {
          id: 'market-0',
          question: 'What items can students buy or sell on Hustle Hub?',
          answer: 'Students can trade verified textbooks, calculators, dorm furniture, electronics, study materials, and personal items within their university ecosystem.'
        },
        {
          id: 'market-1',
          question: 'How do marketplace buyers and sellers communicate?',
          answer: 'Hustle Hub includes built-in real-time buyer-seller messaging. You can initiate a private conversation directly from any item detail page.'
        }
      ]
    },
    {
      id: 'events',
      title: 'Campus Events & Pulse',
      subtitle: 'Hackathons, batch gatherings, and club directory across Sri Lanka.',
      icon: LuCalendar,
      badge: 'Events',
      questions: [
        {
          id: 'events-0',
          question: 'How are campus events collected and updated?',
          answer: 'We aggregate official university club events, hackathons, batch gatherings, and faculty workshops across Sri Lanka into a single unified event directory.'
        },
        {
          id: 'events-1',
          question: 'What happens when I click the "Interested" button?',
          answer: 'Clicking "Interested" bookmarks the event in your profile to provide updates. Official registrations or ticketing remain managed by event organizers.'
        }
      ]
    },
    {
      id: 'matchmaking',
      title: 'Uni Porondam (Matchmaking)',
      subtitle: 'Verified undergraduate matchmaking with photo blur and phone masking.',
      icon: LuHeartHandshake,
      badge: 'Matchmaking',
      questions: [
        {
          id: 'match-0',
          question: 'Who can view my matchmaking profile?',
          answer: 'Only verified university undergraduates and alumni can access Uni Porondam profiles. Profiles are strictly excluded from Google search indexing.'
        },
        {
          id: 'match-1',
          question: 'How do Photo Blurring and AI Phone Masking protect my privacy?',
          answer: 'Photos can remain blurred by default until you accept a proposal request. Premium members can also place encrypted calls without exposing actual telephone numbers.'
        }
      ]
    },
    {
      id: 'ads',
      title: 'Advertising & Brand Campaigns',
      subtitle: 'B2B campus ads, banner placements, and self-serve promotion.',
      icon: LuMegaphone,
      badge: 'B2B Ads',
      questions: [
        {
          id: 'ads-0',
          question: 'How can brands and institutes launch advertising campaigns?',
          answer: 'Organizations can select structured B2B packages (Campus Starter, Campus Hero, Ultimate Blast) or custom placements via our self-serve advertising portal.'
        },
        {
          id: 'ads-1',
          question: 'How do advertisers monitor campaign metrics?',
          answer: 'Advertisers receive an Order Tracking ID to monitor live impression counts, click rates, and campaign expiration dates in real time.'
        }
      ]
    },
    {
      id: 'safety',
      title: 'Security & Data Policies',
      subtitle: 'PDPA account data retention, safety guidelines, and support tickets.',
      icon: LuShieldCheck,
      badge: 'Security',
      questions: [
        {
          id: 'safety-0',
          question: 'What is your account data retention policy under PDPA?',
          answer: 'Accounts inactive for 30 consecutive days are temporarily archived. Accounts showing 12 consecutive months of inactivity are permanently deleted under PDPA guidelines.'
        },
        {
          id: 'safety-1',
          question: 'How do I report fake listings or technical issues?',
          answer: 'Report issues directly using the support form on our Contact page (/contact-us). Our moderation team reviews all tickets within 2-4 business hours.'
        }
      ]
    }
  ];

  const quickSearches = [
    'Direct Landlord Contact',
    'Hustle Hub Buying',
    'Uni Porondam Privacy',
    'B2B Ad Packages',
    'PDPA Retention'
  ];

  const filteredCategories = categories.map(cat => {
    const matched = cat.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, questions: matched };
  }).filter(cat =>
    (activeTab === 'all' || cat.id === activeTab) && cat.questions.length > 0
  );

  const totalResultsCount = filteredCategories.reduce((acc, c) => acc + c.questions.length, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none transition-colors duration-300 pb-20">
      <SEO
        title="Help Center & FAQ - The Uni Gang"
        description="Search our official help center articles regarding university housing, campus marketplace, matchmaking privacy, and advertising."
      />

      <PremiumPageLoader isLoading={loading} message="Loading Help Center..." />

      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12"
          >
            {/* Hero Search Section - Stripe / Intercom Inspired */}
            <div className="relative rounded-3xl bg-slate-900 text-white p-8 sm:p-12 lg:p-14 overflow-hidden shadow-2xl border border-slate-800">
              {/* Radial Gradient Backdrops */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-extrabold uppercase tracking-wider">
                  <LuLifeBuoy className="text-blue-400" size={15} />
                  <span>The Uni Gang Help Center</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  How can we help you today?
                </h1>

                <p className="text-slate-300 text-sm sm:text-base font-normal max-w-2xl mx-auto">
                  Find instant answers on student accommodation listings, Hustle Hub marketplace, Uni Porondam privacy, and platform guidelines.
                </p>

                {/* Hero Search Input Bar */}
                <div className="relative max-w-2xl mx-auto pt-2">
                  <div className="relative flex items-center">
                    <LuSearch className="absolute left-4.5 text-slate-400 w-5 h-5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search by topic, feature, or keyword (e.g., landlord, privacy, ads)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 rounded-2xl pl-12 pr-12 py-4 text-sm sm:text-base font-medium shadow-xl border border-slate-200/20 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Quick Suggestion Chips */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs">
                    <span className="text-slate-400 font-semibold flex items-center gap-1">
                      <LuSparkles className="text-amber-400" size={12} /> Popular:
                    </span>
                    {quickSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-blue-600/40 text-slate-300 hover:text-white border border-slate-700/60 transition-all text-[11px] font-medium cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Navigation Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeTab === 'all'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  All Topics
                </button>
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeTab === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveTab(cat.id); setSearchQuery(''); }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <Icon size={14} className={isActive ? 'text-white' : 'text-blue-500'} />
                      <span>{cat.badge}</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Showing <span className="text-slate-900 dark:text-white font-bold">{totalResultsCount}</span> articles
              </div>
            </div>

            {/* Knowledge Base Categories Grid */}
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {filteredCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6"
                    >
                      <div className="space-y-4">
                        {/* Category Card Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Icon size={24} />
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider">
                            {cat.questions.length} Articles
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {cat.title}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-normal mt-1 leading-relaxed">
                            {cat.subtitle}
                          </p>
                        </div>

                        {/* Questions Accordion inside Category Card */}
                        <div className="space-y-3 pt-2">
                          {cat.questions.map((q) => (
                            <FAQItem
                              key={q.id}
                              id={q.id}
                              question={q.question}
                              answer={q.answer}
                              isOpen={openId === q.id}
                              onToggle={() => setOpenId(openId === q.id ? null : q.id)}
                              feedbackState={feedback[q.id] || null}
                              onFeedback={handleFeedback}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl mx-auto space-y-4">
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <LuCircleHelp size={32} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">No articles matched your search</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                    We couldn't find any questions matching "{searchQuery}". Try typing different keywords or check out our direct support desk.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Support Callout Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                  <LuMail size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black">Still need assistance?</h3>
                  <p className="text-blue-100 text-xs sm:text-sm font-normal">
                    Can't find the answers you're looking for? Submit a support request directly to our team.
                  </p>
                </div>
                <Link
                  to="/contact-us"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  <span>Submit Support Ticket</span>
                  <LuArrowRight size={14} />
                </Link>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                    <LuMessageSquare size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Direct WhatsApp Support</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-normal">
                      Connect directly with our campus desk on WhatsApp for instant assistance (+94 72 447 8148).
                    </p>
                  </div>
                </div>
                <a
                  href="https://wa.me/94724478148"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs w-fit"
                >
                  <span>Chat on WhatsApp</span>
                  <LuArrowRight size={14} />
                </a>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQ;

