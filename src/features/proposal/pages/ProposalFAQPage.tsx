import { useState } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  FileText, 
  Heart, 
  Crown, 
  Compass
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface ProposalFAQPageProps {
  setPage: (page: string) => void;
  onGetStarted?: () => void;
  previousView?: string;
}

interface FAQItem {
  id: number;
  category: 'biodata' | 'safety' | 'proposals' | 'astrology' | 'pricing';
  categoryLabel: string;
  q: string;
  a: string;
  highlight?: string;
}

const FAQ_DATA: FAQItem[] = [
  // 1. BIODATA & ACCOUNT
  {
    id: 1,
    category: 'biodata',
    categoryLabel: 'Bio-Data & ගිණුම්',
    q: 'Bio-Data පැතිකඩක් සකස් කරගන්නේ කෙසේද?',
    a: 'අපගේ වෙබ් අඩවියේ ‘නොමිලේ ලියාපදිංචි වන්න’ (Get Started) ක්ලික් කර, මිනිත්තු 3ක් ඇතුළත ඔබගේ මූලික තොරතුරු, විශ්වවිද්‍යාල උපාධිය (Degree), රැකියාව, ආගම, පවුලේ තොරතුරු සහ කේන්දර තොරතුරු ඇතුළත් කර අලංකාර Bio-Data එකක් නොමිලේම සාදාගත හැක.',
    highlight: 'මිනිත්තු 3න් නොමිලේ සම්පූර්ණ කළ හැක.'
  },
  {
    id: 2,
    category: 'biodata',
    categoryLabel: 'Bio-Data & ගිණුම්',
    q: 'දෙමාපියන්ට හෝ වැඩිහිටියන්ට දරුවන් වෙනුවෙන් ගිණුමක් කළමනාකරණය කළ හැකිද?',
    a: 'ඔව්! ලියාපදිංචි වීමේදී ‘Profile Managed by: Parents / Guardians’ ලෙස තෝරාගත හැක. මෙහිදී දෙමාපියන්ට තම දරුවන්ට සුදුසු සහකරුවෙකු තෝරාගැනීමට අවශ්‍ය පහසුකම් සම්පූර්ණයෙන්ම සලසා ඇත.',
    highlight: 'දෙමාපියන්ගේ කළමනාකාරිත්වයට පූර්ණ සහය.'
  },
  {
    id: 3,
    category: 'biodata',
    categoryLabel: 'Bio-Data & ගිණුම්',
    q: 'මගේ Bio-Data එකේ තොරතුරු පසුව සංස්කරණය (Edit) කළ හැකිද?',
    a: 'ඔව්. Dashboard එකට පිවිස ඕනෑම වේලාවක ඔබගේ අධ්‍යාපනික, වෘත්තීය, පවුලේ තොරතුරු හෝ කේන්දර විස්තර ‘Edit Bio-Data’ මගින් යාවත්කාලීන කළ හැක.',
    highlight: 'ඕනෑම වේලාවක පහසුවෙන් Edit කළ හැක.'
  },

  // 2. SAFETY & VERIFICATION
  {
    id: 4,
    category: 'safety',
    categoryLabel: 'ආරක්ෂාව & NIC',
    q: 'මගේ ඡායාරූප ඕනෑම කෙනෙකුට දැකගත හැකිද?',
    a: 'නැත. ඔබගේ ඡායාරූප ආරම්භයේදී පෙරනිමියෙන්ම (Default) Blur කර ආරක්ෂිත ඩිජිටල් Watermark එකක් සහිතව පෙන්වනු ලැබේ. ඡායාරූප පැහැදිලිව Unblur වන්නේ ඔබ සහ අනෙක් පාර්ශ්වය යන දෙදෙනාම Proposal Request එකක් අන්‍යෝන්‍ය වශයෙන් Accept කළහොත් පමණි.',
    highlight: 'Mutual Consent එකෙන් තොරව ඡායාරූප නොපෙනේ.'
  },
  {
    id: 5,
    category: 'safety',
    categoryLabel: 'ආරක්ෂාව & NIC',
    q: 'ජාතික හැඳුනුම්පත (NIC) ඉදිරිපත් කළ යුතු ඇයි? එය අන් අයට පෙනේද?',
    a: 'හැඳුනුම්පත කිසිදු පරිශීලකයෙකුට කිසිදා දැකගත නොහැක! එය 100% Confidential වන අතර අපගේ Admin Team එක විසින් පමණක් ඔබ සත්‍ය උපාධිධාරියෙකු බව තහවුරු කිරීමට යොදා ගනී. තහවුරු වූ පසු ඔබේ පැතිකඩට ‘ID Verified ✓’ නිල ලාංඡනය ලැබේ. මේ නිසා ව්‍යාජ ගිණුම් (Fake Profiles) 0%කි.',
    highlight: 'Admin-Only 100% රහස්‍යයි.'
  },
  {
    id: 6,
    category: 'safety',
    categoryLabel: 'ආරක්ෂාව & NIC',
    q: 'මගේ WhatsApp හෝ පෞද්ගලික දුරකථන අංකය පිටස්තරයින්ට ලැබේවිද?',
    a: 'කිසිසේත්ම නැත! වේදිකාව තුළ කිසිදු දුරකථන අංකයක් ප්‍රසිද්ධියේ ප්‍රදර්ශනය නොවේ. ඔබ දෙදෙනා අතර අන්‍යෝන්‍ය කැමැත්තෙන් In-App Chat එකෙන් කතාබස් කර විශ්වාසය තහවුරු වූ පසු පමණක් දෙදෙනාගේ අභිමතය පරිදි දුරකථන අංක හුවමාරු කරගත හැක.',
    highlight: 'Zero External Leakage Guarantee.'
  },

  // 3. PROPOSALS & MATCHING
  {
    id: 7,
    category: 'proposals',
    categoryLabel: 'යෝජනා & Chat',
    q: 'Proposal Request එකක් යැවීමෙන් පසු සිදුවන්නේ කුමක්ද?',
    a: 'ඔබ යෝජනාවක් යැවූ පසු අනෙක් පාර්ශ්වයට ක්ෂණික Notification එකක් ලැබේ. ඔවුන් ඔබගේ Profile එක පරීක්ෂා කර එය ‘Accept’ කළහොත් දෙදෙනා Match වී දෙදෙනාගේම ඡායාරූප Unblur වන අතර ආරක්ෂිත In-App Chat පහසුකම විවෘත වේ.',
    highlight: 'Two-Way Mutual Consent එකක් අවශ්‍යයි.'
  },
  {
    id: 8,
    category: 'proposals',
    categoryLabel: 'යෝජනා & Chat',
    q: 'අනෙක් පාර්ශ්වය මගේ Proposal එක ප්‍රතික්ෂේප (Decline) කළහොත් කුමක් සිදුවේද?',
    a: 'කිසිදු ගැටළුවක් හෝ අපහසුතාවයක් ඇති නොවේ. එය ගෞරවනීයව අවසන් වන අතර අනවශ්‍ය පණිවිඩ හෝ කරදර කිරීම් වැළැක්වීමට Platform එක මගින් පූර්ණ ආරක්ෂාව සලසා ඇත.',
    highlight: 'ගෞරවනීය හා පෞද්ගලිකත්වයට මුල්තැන.'
  },
  {
    id: 9,
    category: 'proposals',
    categoryLabel: 'යෝජනා & Chat',
    q: 'Safety Shield Chat කියන්නේ කුමක්ද?',
    a: 'වේදිකාව තුළ සිදුවන Real-Time Chat එකෙහි දුරකථන අංක (07X, +94) හෝ සමාජ මාධ්‍ය links (Facebook, Instagram ආදී) යැවීමට තැත් කළ විට ක්ෂණික Amber Warning Alert එකක් මගින් අවහිර කර දෙපාර්ශවයේම පෞද්ගලිකත්වය සුරැකෙන නවීන පද්ධතියකි.',
    highlight: 'Anti-Harassment ආරක්ෂණ පද්ධතිය.'
  },

  // 4. HOROSCOPE & ASTROLOGY
  {
    id: 10,
    category: 'astrology',
    categoryLabel: 'කේන්දර & පොරොන්දම්',
    q: 'කේන්දර තොරතුරු ඇතුළත් කිරීම අනිවාර්යද?',
    a: 'නැත. කේන්දර ගැලපීම අත්‍යවශ්‍ය යැයි සලකන අය සඳහා ලග්නය, නැකත සහ උපන් වේලාව ඇතුළත් කළ හැකි අතර, කේන්දර නොබලන සාමාජිකයින්ට ‘කේන්දර ගැලපීම අවශ්‍ය නොවේ’ (Not Required) ලෙස තෝරාගත හැක.',
    highlight: 'තමන්ගේ කැමැත්ත පරිදි තෝරාගත හැක.'
  },
  {
    id: 11,
    category: 'astrology',
    categoryLabel: 'කේන්දර & පොරොන්දම්',
    q: 'අනෙක් අයගේ කේන්දර සටහන හෝ PDF පිටපත බැලිය හැක්කේ කාටද?',
    a: 'මූලික තොරතුරු (ලග්නය, නැකත, ශනි/කුජ දෝෂ) Classic සහ VIP සාමාජිකයින්ට විවෘත වේ. සම්පූර්ණ කේන්දර සටහන (Full Horoscope Chart/PDF) සහ නිවැරදි උපන් වේලාව බැලිය හැක්කේ VIP Premium සාමාජිකයින්ට පමණි.',
    highlight: 'VIP අයට සම්පූර්ණ කේන්දර කොපිය හිමිවේ.'
  },

  // 5. PRICING & PAYMENTS
  {
    id: 12,
    category: 'pricing',
    categoryLabel: 'පැකේජ & ගෙවීම්',
    q: 'නොමිලේ (Free Forever) පැකේජයෙන් කළ හැක්කේ මොනවාද?',
    a: 'නොමිලේ සාමාජිකයෙකුට සම්පූර්ණ Bio-Data පැතිකඩක් සකස් කරගත හැක, Admin NIC Verification නොමිලේ හිමිවේ, දිනකට profiles 10ක් නැරඹිය හැක, සහ මසකට Proposals 3ක් යැවිය හැක. ලැබෙන proposals නොමිලේ භාරගෙන match වූ පසු මුල් පණිවිඩ 10 නොමිලේ Chat කළ හැක.',
    highlight: 'රු. 0 කට ජීවිත කාලයටම හිමිවේ.'
  },
  {
    id: 13,
    category: 'pricing',
    categoryLabel: 'පැකේජ & ගෙවීම්',
    q: 'Classic Plan (රු. 2,990) සහ VIP Plan (රු. 4,990) අතර වෙනස කුමක්ද?',
    a: 'Classic Plan එක මාස 3ක් (දින 90) වලංගු වන අතර Unlimited Profiles, Unlimited Proposals, Unlimited Chat, Read Receipts (Seen ✓✓), සහ ⭐ Classic Badge එක හිමිවේ. VIP Plan එක මාස 6ක් (දින 180) වලංගු වන අතර 5x Search Boost, 👑 VIP Gold Crown Badge, Incognito Ghost Browsing, සම්පූර්ණ කේන්දර පිටපත සහ VIP WhatsApp Concierge හිමිවේ.',
    highlight: 'මාස 3 හෝ මාස 6ක තනි ගෙවීම්.'
  },
  {
    id: 14,
    category: 'pricing',
    categoryLabel: 'පැකේජ & ගෙවීම්',
    q: 'ගෙවීම් සිදුකරන්නේ කෙසේද? මගේ කාඩ්පතෙන් මාස්පතා මුදල් කැපේද?',
    a: 'නැත! කිසිදු කාඩ්පතකින් මාස්පතා මුදල් කැපෙන (Auto-Debit) උගුල් මෙහි නැත. ඔබ කළ යුත්තේ BOC (ලංකා බැංකුව) හෝ NSB (ජාතික ඉතිරි කිරීමේ බැංකුව) වෙත තනි ගෙවීමක් කර, බැංකු රිසිට්පත (Bank Slip / Online Transfer Screenshot) Upload කිරීම පමණි. Admin Team එක විසින් ගෙවීම තහවුරු කර ගිණුම Upgrade කරනු ඇත.',
    highlight: 'Manual Bank Slip Upload • Zero Auto-Debits.'
  }
];

export default function ProposalFAQPage({
  setPage,
  onGetStarted,
  previousView = 'landing'
}: ProposalFAQPageProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openAccordionId, setOpenAccordionId] = useState<number | null>(1);

  const categories = [
    { id: 'all', label: 'සියල්ල (All FAQs)', icon: <Sparkles size={14} /> },
    { id: 'biodata', label: 'Bio-Data & ගිණුම්', icon: <FileText size={14} /> },
    { id: 'safety', label: 'ආරක්ෂාව & NIC', icon: <ShieldCheck size={14} /> },
    { id: 'proposals', label: 'යෝජනා & Chat', icon: <Heart size={14} /> },
    { id: 'astrology', label: 'කේන්දර & පොරොන්දම්', icon: <Compass size={14} /> },
    { id: 'pricing', label: 'පැකේජ & ගෙවීම්', icon: <Crown size={14} /> },
  ];

  const filteredFAQs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: number) => {
    setOpenAccordionId(openAccordionId === id ? null : id);
  };

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 relative overflow-hidden ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Ambient Decorative Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-rose-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Top Return Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setPage(previousView === 'faq' ? 'landing' : previousView)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDark 
                ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800' 
                : 'bg-white border-slate-200 text-slate-700 hover:text-rose-600 hover:bg-rose-50/50 shadow-sm'
            }`}
          >
            <ArrowLeft size={14} className="text-rose-500" />
            <span>Back to Proposal Home</span>
          </button>

          <button
            onClick={() => setPage('premium')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDark 
                ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white' 
                : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:border-slate-300'
            }`}
          >
            <Crown size={14} className="text-amber-500" />
            <span>View Pricing Plans</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-4 animate-fade-in">
            <HelpCircle size={14} />
            <span>Help Center & Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            නිතර අසන ප්‍රශ්න සහ <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500">
              පැහැදිලි පිළිතුරු (FAQ)
            </span>
          </h1>

          <p className={`text-base font-medium leading-relaxed mb-8 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Uni Porondam වේදිකාව භාවිතා කිරීම, ආරක්ෂාව, යෝජනා හුවමාරුව සහ සාමාජික පැකේජ පිළිබඳ සියලුම තොරතුරු එකම තැනකින්.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ඔබට අවශ්‍ය ප්‍රශ්නය හෝ මාතෘකාව මෙහි සොයන්න..."
              className={`w-full pl-12 pr-4 py-3.5 rounded-2xl text-xs sm:text-sm font-medium border outline-none transition-all ${
                isDark 
                  ? 'bg-slate-900/90 border-slate-800 text-white placeholder-slate-500 focus:border-rose-500' 
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-rose-500 shadow-md'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                activeCategory === c.id
                  ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/25 scale-105'
                  : isDark
                    ? 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
              }`}
            >
              {c.icon}
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-20 max-w-4xl mx-auto">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const isOpen = openAccordionId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? isDark 
                        ? 'bg-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-950/20' 
                        : 'bg-white border-rose-300 shadow-md shadow-rose-500/5'
                      : isDark
                        ? 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}>
                          {faq.categoryLabel}
                        </span>
                        {faq.highlight && (
                          <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 hidden sm:inline flex items-center gap-1">
                            • {faq.highlight}
                          </span>
                        )}
                      </div>
                      <h2 className={`text-sm sm:text-base font-black ${
                        isOpen ? 'text-rose-500' : isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {faq.q}
                      </h2>
                    </div>

                    <div className={`p-1.5 rounded-xl transition-transform shrink-0 ${
                      isOpen ? 'rotate-180 bg-rose-500/10 text-rose-500' : 'text-slate-400'
                    }`}>
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-100 dark:border-slate-800/60 animate-fade-in">
                      <p className={`text-xs sm:text-sm leading-relaxed ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className={`text-center py-16 px-4 rounded-3xl border ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <HelpCircle className="mx-auto text-slate-400 mb-3" size={32} />
              <p className="text-sm font-bold">ඔබ සොයන ප්‍රශ්නය හමු නොවීය</p>
              <p className="text-xs text-slate-400 mt-1">කරුණාකර වෙනත් වචනයක් යොදා සොයන්න හෝ පහතින් අපගේ Admin Team එක අමතන්න.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white cursor-pointer"
              >
                සියලු ප්‍රශ්න පෙන්වන්න
              </button>
            </div>
          )}
        </div>

        {/* Still Have Questions Banner */}
        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white text-center shadow-2xl shadow-rose-500/20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black mb-2">
              තවමත් ඔබට ගැටළුවක් තිබේද?
            </h2>
            <p className="text-xs sm:text-sm text-rose-100 mb-6 font-medium leading-relaxed">
              අපගේ නිල Uni Porondam Admin Team එක ඕනෑම ප්‍රශ්නයකට පිළිතුරු දීමට WhatsApp ඔස්සේ සූදානමින් සිටී.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://wa.me/94724478148?text=Hello%20UniPorondam%20Admin,%20I%20have%20a%20question"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-8 rounded-2xl bg-white text-rose-600 font-black text-xs uppercase tracking-wider shadow-lg hover:bg-rose-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <MessageSquare size={16} />
                <span>Ask on WhatsApp (+94 72 447 8148)</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  if (onGetStarted) onGetStarted();
                  else setPage('onboarding');
                }}
                className="py-3.5 px-8 rounded-2xl bg-slate-950/60 hover:bg-slate-950/80 text-white font-black text-xs uppercase tracking-wider border border-white/20 transition-all cursor-pointer"
              >
                නොමිලේ Bio-Data එකක් සාදන්න
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
