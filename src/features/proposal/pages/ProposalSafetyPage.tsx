import React from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall, 
  UserCheck, 
  Crown, 
  AlertTriangle, 
  FileCheck, 
  Ban, 
  HeartHandshake, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface ProposalSafetyPageProps {
  setPage: (page: string) => void;
  onGetStarted?: () => void;
  previousView?: string;
}

export default function ProposalSafetyPage({
  setPage,
  onGetStarted,
  previousView = 'landing'
}: ProposalSafetyPageProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const pillars = [
    {
      icon: <ShieldCheck size={28} className="text-emerald-500" />,
      tag: 'රහස්‍යභාවය 100%',
      title: 'Admin-Only ජාතික හැඳුනුම්පත් (NIC) සත්‍යාපනය',
      desc: 'විශ්වවිද්‍යාල උපාධිධාරී ප්‍රජාව තුළ 100% සත්‍ය සහ වගකීම් සහගත සාමාජිකයින් පමණක් සිටින බව තහවුරු කෙරේ.',
      points: [
        'ඔබ ඉදිරිපත් කරන ජාතික හැඳුනුම්පත (NIC) පරීක්ෂා කරන්නේ අපගේ නිල Verification Admin Team එක පමණි.',
        'වේදිකාවේ වෙනත් කිසිදු සාමාජිකයෙකුට හෝ පිටස්තරයෙකුට කිසිදා ඔබේ හැඳුනුම්පත දැකගත නොහැක.',
        'සෑම ලියකියවිල්ලක් මතම "UNIGANG VERIFICATION ONLY" ආරක්ෂිත ඩිජිටල් watermark එකක් ස්වයංක්‍රීයව යෙදේ.',
        'එකම හැඳුනුම්පතෙන් ව්‍යාජ ගිණුම් සෑදීම සම්පූර්ණයෙන්ම අවහිර කර ඇත (0% Fake Profiles).'
      ],
      badgeColor: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'
    },
    {
      icon: <Lock size={28} className="text-rose-500" />,
      tag: 'ඡායාරූප ආරක්ෂාව',
      title: 'Default Photo Blur & Privacy Masking',
      desc: 'විශ්වවිද්‍යාල ශිෂ්‍යාවන්ගේ සහ වෘත්තිකයින්ගේ පෞද්ගලිකත්වයට උපරිම ගෞරවයක් ලබා දෙන ක්‍රමවේදය.',
      points: [
        'ඔබගේ ඡායාරූප ආරම්භයේදීම අන් අයට දිස්වන්නේ පෞද්ගලිකත්වය සුරැකෙන පරිදි Blurred ආකාරයටය.',
        'දෙපාර්ශවයම අන්‍යෝන්‍ය වශයෙන් Proposal Request එකක් ‘Accept’ කළහොත් පමණක් ඡායාරූප පැහැදිලිව Unblur වේ.',
        'අනවශ්‍ය Screenshot ගැනීම් සහ Photo download කිරීම් වැළැක්වීමේ ඩිජිටල් තාක්ෂණය ක්‍රියාත්මකයි.',
        'පෞද්ගලිකත්වය ආරක්ෂා කරමින් අධ්‍යාපනය, වෘත්තිය සහ පවුලේ පසුබිම මත පදනම්ව ගෞරවනීය තීරණ ගත හැක.'
      ],
      badgeColor: 'border-rose-500/30 text-rose-500 bg-rose-500/10'
    },
    {
      icon: <Eye size={28} className="text-amber-500" />,
      tag: 'තොරතුරු කාන්දුවක් නැත',
      title: 'Safety Shield Anti-Harassment Protection',
      desc: 'අයාචිත පණිවිඩ සහ දුරකථන අංක බාහිරව හෙළිදරව් වීමෙන් 100% තොර වේදිකාව තුළම ආරක්ෂිත සංවාදය.',
      points: [
        'WhatsApp හෝ පුද්ගලික දුරකථන අංක ප්‍රසිද්ධියේ ප්‍රදර්ශනය නොවේ.',
        'Real-time In-App Messaging: වේදිකාව තුළම පණිවිඩ හුවමාරු කරගත හැකි අතර බාහිර කරදර ඇති නොවේ.',
        'Anti-Harassment Filter: දුරකථන අංක හෝ Social media links යැවීමට තැත් කළ විට Amber Warning Alert මගින් පාලනය කෙරේ.',
        'ගෞරවනීය සිංහල Matrimonial Icebreakers මගින් ආචාරශීලී සංවාදයක් ආරම්භ කිරීමට පහසුකම් සලසා ඇත.'
      ],
      badgeColor: 'border-amber-500/30 text-amber-500 bg-amber-500/10'
    },
    {
      icon: <Crown size={28} className="text-blue-500" />,
      tag: 'රහසිගත ගවේෂණය',
      title: 'VIP Incognito / Ghost Browsing Mode',
      desc: 'තමන් පැතිකඩක් නැරඹූ බවට කිසිදු සලකුණක් නොතබා රහසිගතව යෝජනා පිරික්සීමේ හැකියාව.',
      points: [
        'VIP සාමාජිකයින්ට කිසිදු Footprint එකක් නොතබා Candidate Profiles නැරඹිය හැක.',
        'තමන් කැමති Profiles ‘Shortlist’ කර තමන්ගේම පෞද්ගලික Family Notes සටහන් කර ගැනීමේ පහසුකම.',
        'විස්තරාත්මක කේන්දර සටහන සහ උපන් වේලාව පරීක්ෂා කර බැලීමේ පූර්ණ ප්‍රවේශය.',
        'පවුලේ වැඩිහිටියන්ට හෝ තමන්ට රහස්‍යව ගැලපෙන සහකරුවන් සෙවීමට සුදුසුම ක්‍රමය.'
      ],
      badgeColor: 'border-blue-500/30 text-blue-500 bg-blue-500/10'
    },
    {
      icon: <FileCheck size={28} className="text-purple-500" />,
      tag: 'සුරක්ෂිත ගෙවීම්',
      title: 'No Recurring Card Traps (100% Manual Bank Slips)',
      desc: 'මාසිකව ඔබගේ කාඩ්පතෙන් මුදල් කැපෙන (Auto-Debit) කිසිදු කාඩ් උගුලක් නොමැති ආරක්ෂිත ක්‍රමවේදය.',
      points: [
        'BOC (ලංකා බැංකුව) හෝ NSB (ජාතික ඉතිරි කිරීමේ බැංකුව) වෙත තනි ගෙවීමක් ලෙස මුදල් තැන්පත් කිරීම.',
        'බැංකු රිසිට්පත (Bank Slip / Online Transfer Screenshot) ආරක්ෂිතව Upload කිරීම.',
        'Admin Team එක විසින් පැය කිහිපයක් තුළ ගෙවීම තහවුරු කර සාමාජිකත්වය සක්‍රීය කරයි.',
        'කිසිදු සැඟවුණු ගාස්තුවක් හෝ අමතර අය කිරීමක් නොමැත.'
      ],
      badgeColor: 'border-purple-500/30 text-purple-500 bg-purple-500/10'
    },
    {
      icon: <Ban size={28} className="text-rose-600" />,
      tag: 'ක්ෂණික ක්‍රියාමාර්ග',
      title: 'Profile Reporting & Instant Moderation',
      desc: 'අනුචිත හැසිරීම්, ව්‍යාජ තොරතුරු හෝ කරදරකාරී සාමාජිකයින් පිළිබඳ ක්ෂණික වාර්තා කිරීමේ පහසුකම.',
      points: [
        'ඕනෑම සාමාජිකයෙකුගේ පැතිකඩක් මත "Report Profile" බොත්තම මගින් ක්ෂණිකව Admin අවධානයට යොමු කළ හැක.',
        'ව්‍යාජ තොරතුරු සපයන හෝ අනුචිත හැසිරීම් දක්වන ගිණුම් පැය 24ක් තුළ ස්ථිරවම තහනම් කෙරේ.',
        'තමන් අකමැති සාමාජිකයින් Block කිරීමේ හැකියාව.',
        'ශ්‍රී ලංකාවේ පිරිසිදුම සහ ගෞරවනීයම විශ්වවිද්‍යාල උපාධිධාරී ප්‍රජාව පවත්වාගෙන යාම අපගේ ප්‍රතිඥාවයි.'
      ],
      badgeColor: 'border-rose-600/30 text-rose-600 bg-rose-600/10'
    }
  ];

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 relative overflow-hidden ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Ambient Decorative Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-rose-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Top Return Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setPage(previousView === 'safety' ? 'landing' : previousView)}
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
            onClick={() => setPage('how-it-works')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDark 
                ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white' 
                : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:border-slate-300'
            }`}
          >
            <HelpCircle size={14} className="text-pink-500" />
            <span>How It Works Guide</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-4 animate-fade-in">
            <ShieldCheck size={14} />
            <span>Trust, Security & Privacy Center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            ඔබගේ ගෞරවය සහ ආරක්ෂාව <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-rose-500">
              අපගේ ප්‍රමුඛතම වගකීමයි
            </span>
          </h1>

          <p className={`text-base font-medium leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            සාමාන්‍ය Dating Apps හෝ Commercial Matchmaking Sites මෙන් නොව, Uni Porondam නිර්මාණය කර ඇත්තේ විශ්වවිද්‍යාල ශිෂ්‍යාවන්ගේ, උපාධිධාරීන්ගේ සහ දෙමාපියන්ගේ උපරිම ගෞරවය සහ රහස්‍යභාවය සුරැකෙන පරිදිය.
          </p>
        </div>

        {/* 6 Core Pillars of Safety Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {pillars.map((item, idx) => (
            <div 
              key={idx}
              className={`p-7 sm:p-8 rounded-3xl border transition-all hover:shadow-xl relative overflow-hidden group ${
                isDark 
                  ? 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700' 
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-100'
                }`}>
                  {item.icon}
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${item.badgeColor}`}>
                  {item.tag}
                </span>
              </div>

              <h2 className="text-xl font-black mb-2">{item.title}</h2>
              <p className={`text-xs sm:text-sm font-medium mb-5 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {item.desc}
              </p>

              <ul className="space-y-2.5 border-t pt-4 border-slate-200/60 dark:border-slate-800">
                {item.points.map((p, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className={`text-xs leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Matrimonial Code of Conduct Card */}
        <div className={`p-8 sm:p-10 rounded-3xl border mb-20 relative overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border-slate-800' 
            : 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-200 shadow-lg'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <HeartHandshake className="text-rose-500 shrink-0" size={28} />
            <h2 className="text-2xl font-black">ගෞරවනීය සන්නිවේදන ආචාරධර්ම පද්ධතිය</h2>
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Uni Porondam යනු විනෝදය සඳහා පණිවිඩ හුවමාරු කරන සමාජ මාධ්‍යයක් නොවේ. එය ජීවිතයේ වැදගත්ම තීරණය වන විවාහය වෙනුවෙන් උසස් අධ්‍යාපනධාරී තරුණ තරුණියන් සහ ඔවුන්ගේ පවුල් එක්වන ගෞරවනීය ස්ථානයකි.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="text-xs font-black text-rose-500 mb-1">01 • ගෞරවය සහ ආචාරශීලී බව</h3>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                සියලුම යෝජනා සහ පණිවිඩ සාම්ප්‍රදායික ශ්‍රී ලාංකීය විවාහ සංස්කෘතියට ගැලපෙන ආචාරශීලී වචන වලින් පමණක් සිදු විය යුතුය.
              </p>
            </div>
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="text-xs font-black text-emerald-500 mb-1">02 • සත්‍ය තොරතුරු පමණි</h3>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                අධ්‍යාපනය, රැකියාව, සහ පවුල් තොරතුරු සත්‍ය වශයෙන් සටහන් කළ යුතුය. අසත්‍ය තොරතුරු ලබාදීමෙන් ගිණුම ස්ථිරවම අත්හිටුවනු ලැබේ.
              </p>
            </div>
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="text-xs font-black text-blue-500 mb-1">03 • පෞද්ගලිකත්වයට ගරු කිරීම</h3>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                අනෙක් පාර්ශ්වයේ කැමැත්තකින් තොරව ඔවුන්ගේ තොරතුරු බාහිර කිසිවෙකුට ලබාදීම හෝ සමාජ මාධ්‍ය වල පළකිරීම නීතිවිරෝධී වේ.
              </p>
            </div>
          </div>
        </div>

        {/* Official Admin WhatsApp Helpline Banner */}
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white text-center shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto mb-4 border border-white/20">
              <PhoneCall size={28} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-2">
              ආරක්ෂාව පිළිබඳ ඕනෑම ගැටළුවකදී අප අමතන්න
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mb-6 font-medium leading-relaxed">
              ඔබගේ හැඳුනුම්පත් සත්‍යාපනය, ගිණුම් ආරක්ෂාව හෝ කිසියම් අනුචිත හැසිරීමක් වාර්තා කිරීමට අපගේ නිල Admin Team එක පැය 24 පුරාම සූදානම්.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://wa.me/94724478148?text=Hello%20UniPorondam%20Admin,%20I%20have%20a%20Safety%20or%20Verification%20question"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-8 rounded-2xl bg-white text-emerald-800 font-black text-xs uppercase tracking-wider shadow-lg hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <MessageSquare size={16} />
                <span>Official Admin WhatsApp (+94 72 447 8148)</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  if (onGetStarted) onGetStarted();
                  else setPage('onboarding');
                }}
                className="py-3.5 px-8 rounded-2xl bg-emerald-950/60 hover:bg-emerald-950/80 text-white font-black text-xs uppercase tracking-wider border border-white/20 transition-all cursor-pointer"
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
