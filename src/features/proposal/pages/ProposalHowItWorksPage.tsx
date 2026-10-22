import React from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Lock, 
  Heart, 
  MessageSquare, 
  Compass, 
  Crown, 
  HelpCircle,
  Eye
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface ProposalHowItWorksPageProps {
  setPage: (page: string) => void;
  onGetStarted?: () => void;
  previousView?: string;
}

export default function ProposalHowItWorksPage({
  setPage,
  onGetStarted,
  previousView = 'landing'
}: ProposalHowItWorksPageProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const steps = [
    {
      step: '01',
      tag: 'මූලික ලියාපදිංචිය',
      title: 'මිනිත්තු 3න් නොමිලේ Bio-Data පැතිකඩක් සකස් කිරීම',
      desc: 'සරල පියවර කිහිපයකින් ඔබගේ අධ්‍යාපනික, වෘත්තීය සහ පෞද්ගලික තොරතුරු ඇතුළත් කර අලංකාර Bio-Data පත්‍රිකාවක් සාදා ගන්න.',
      icon: <FileText className="text-rose-500" size={26} />,
      badgeColor: 'border-rose-500/30 text-rose-500 bg-rose-500/10',
      details: [
        'තමන් විසින්ම (Self) හෝ දෙමාපියන් (Parents) විසින් Profile එක කළමනාකරණය කරන්නේද යන්න තෝරාගත හැක.',
        'විශ්වවිද්‍යාල උපාධිය (Campus/Degree), රැකියාව, ආගම, කුලය සහ පදිංචි දිස්ත්‍රික්කය සටහන් කිරීම.',
        'ඡායාරූප Upload කිරීම — ඔබගේ ඡායාරූප ආරම්භයේදීම අන් අයට දිස්වන්නේ පෞද්ගලිකත්වය සුරැකෙන පරිදි Blurred & Watermarked ආකාරයටය.',
      ],
      highlight: 'කිසිදු අවස්ථාවක ඔබගේ WhatsApp හෝ දුරකථන අංක ප්‍රසිද්ධියේ ප්‍රදර්ශනය නොකෙරේ.'
    },
    {
      step: '02',
      tag: 'රහස්‍ය සත්‍යාපනය',
      title: 'Admin-Only ජාතික හැඳුනුම්පත් (NIC) සත්‍යාපනය',
      desc: 'විශ්වවිද්‍යාල ප්‍රජාව තුළ 100% සත්‍ය සහ වගකීම් සහගත සාමාජිකයින් පමණක් සිටින බව තහවුරු කරන ප්‍රධාන පියවරයි.',
      icon: <ShieldCheck className="text-emerald-500" size={26} />,
      badgeColor: 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10',
      details: [
        'ඔබගේ ජාතික හැඳුනුම්පතෙහි (NIC) ඡායාරූපයක් Admin Verification සඳහා ආරක්ෂිතව යොමු කරන්න.',
        '100% Confidential: හැඳුනුම්පත පරීක්ෂා කරන්නේ අපගේ නිල Verification Admin Team එක පමණි. වේදිකාවේ වෙනත් කිසිදු සාමාජිකයෙකුට එය කිසිදා දැකගත නොහැක.',
        'සත්‍යාපනය සාර්ථක වූ පසු ඔබේ Profile එකට ‘ID Verified ✓’ නිල ලාංඡනය හිමිවේ. (Fake Profiles 0%).',
      ],
      highlight: 'Fake Profiles සහ වංචනික පුද්ගලයින්ගෙන් 100% තොර සුරක්ෂිත වේදිකාවක්.'
    },
    {
      step: '03',
      tag: 'ගැලපෙන යෝජනා සෙවීම',
      title: 'ස්මාර්ට් Filters මගින් තමන්ට ගැළපෙන සහකරු/සහකාරිය සෙවීම',
      desc: 'උසස් අධ්‍යාපනයක් ලැබූ විවාහ අපේක්ෂිත වෘත්තිකයින් අතරින් ඔබගේ බලාපොරොත්තු වලට වඩාත්ම ගැලපෙන අය පහසුවෙන් සොයාගන්න.',
      icon: <Compass className="text-blue-500" size={26} />,
      badgeColor: 'border-blue-500/30 text-blue-500 bg-blue-500/10',
      details: [
        'විශ්වවිද්‍යාලය (Campus), වයස් පරතරය, ආගම, දිස්ත්‍රික්කය, සහ රැකියාව අනුව නිවැරදිව Filter කිරීම.',
        'ඡායාරූප රහස්‍යභාවය: පෞද්ගලිකත්වයට ගරු කරමින් මුලින්ම ඡායාරූප Blur කර පෙන්වන අතර අධ්‍යාපනය, පවුලේ තොරතුරු සහ bio කියවා තීරණ ගත හැක.',
        'තමන් කැමති Profiles ‘Shortlist’ කර තමන්ගේම පෞද්ගලික Family Notes සටහන් කර ගැනීමේ පහසුකම.',
      ],
      highlight: 'පරිශීලකයින්ගේ ගෞරවය සහ අභිමානය ආරක්ෂා වන පරිදි පිරික්සීම.'
    },
    {
      step: '04',
      tag: 'යෝජනා හුවමාරුව',
      title: 'Proposal Request යැවීම සහ දෙපාර්ශවයේම කැමැත්ත (Mutual Consent)',
      desc: 'කැමති Profile එකක් හමු වූ විට ආචාරශීලීව Proposal එකක් යොමු කර දෙපාර්ශවයේම කැමැත්තෙන් සම්බන්ධ වන්න.',
      icon: <Heart className="text-pink-500" size={26} />,
      badgeColor: 'border-pink-500/30 text-pink-500 bg-pink-500/10',
      details: [
        'තමන් කැමති සාමාජිකයා වෙත ‘Send Proposal’ ක්ලික් කර යෝජනාවක් යොමු කරන්න.',
        'අනෙක් පාර්ශ්වයට ක්ෂණික Notification එකක් ලැබෙන අතර, ඔවුන් ඔබගේ Profile එක පරීක්ෂා කරනු ඇත.',
        'Mutual Acceptance: අනෙක් පාර්ශ්වයද ඔබගේ යෝජනාව ‘Accept’ කළහොත් පමණක් දෙදෙනාගේ ඡායාරූප පැහැදිලිව Unblur වී ආරක්ෂිත Chat පහසුකම විවෘත වේ.',
      ],
      highlight: 'යෝජනාව ප්‍රතික්ෂේප වුවහොත් (Decline) කිසිදු අපහසුතාවයකින් තොරව ගෞරවනීයව අවසන් වේ.'
    },
    {
      step: '05',
      tag: 'චාරිත්‍රානුකූල පිරික්සුම',
      title: 'කේන්දර සහ නැකත් ගැළපීම (Horoscope & Porondam Verification)',
      desc: 'සිංහල සම්ප්‍රදායට අනුව පොරොන්දම් සහ ග්‍රහ පිහිටීම් ගැලපීමට කැමති පවුල් සහ සාමාජිකයින් සඳහා විශේෂ පහසුකම්.',
      icon: <Sparkles className="text-amber-500" size={26} />,
      badgeColor: 'border-amber-500/30 text-amber-500 bg-amber-500/10',
      details: [
        'මූලික කේන්දර තොරතුරු: ලග්නය, නැකත, සහ ශනි/කුජ දෝෂ තත්ත්වයන් Classic සහ VIP සාමාජිකයින්ට විවෘතව පරීක්ෂා කළ හැක.',
        'සම්පූර්ණ කේන්දර පිටපත (Full Horoscope PDF/Chart): නිවැරදි උපන් වේලාව, නගරය සහ කේන්දර සටහන VIP සාමාජිකයින්ට High-Resolution Zoom Modal එකක් හරහා බලාගත හැක.',
        'ජ්‍යෝතිෂවේදීන් වෙත ඉදිරිපත් කර පොරොන්දම් ගැලපීම ඉතා පහසුවෙන් කර ගැනීමේ හැකියාව.',
      ],
      highlight: 'පවුලේ වැඩිහිටියන්ගේ සම්ප්‍රදායික තීරණ වලට උපරිම පහසුකම්.'
    },
    {
      step: '06',
      tag: 'ආරක්ෂිත සංවාදය & විවාහය',
      title: 'Safety Shield Chat සහ දෙමාපියන් සම්බන්ධ කරගැනීම',
      desc: 'බාහිර කරදර වලින් තොරව වේදිකාව තුළම කතාබස් කර විශ්වාසය තහවුරු වූ පසු පවුල් මට්ටමින් ඉදිරියට යන්න.',
      icon: <MessageSquare className="text-purple-500" size={26} />,
      badgeColor: 'border-purple-500/30 text-purple-500 bg-purple-500/10',
      details: [
        '100% In-App Real-Time Messaging: WhatsApp හෝ පුද්ගලික දුරකථන අංක නොදී වේදිකාව තුළම කතාබස් කරන්න.',
        'Safety Shield Protection: අනවශ්‍ය ලින්ක් (Social media links) හෝ බාහිර දුරකථන අංක යැවීම ස්වයංක්‍රීයව Alert මගින් පාලනය කර ආරක්ෂාව සපයයි.',
        'අවබෝධය ගොඩනැගුණු පසු දෙමාපියන් සහ පවුලේ වැඩිහිටියන් සම්බන්ධ කරගෙන සුබ මංගල්‍යයක් දක්වා සාකච්ඡා ඉදිරියට ගෙන යා හැක.',
      ],
      highlight: 'ආරක්ෂිත, විශ්වාසනීය සහ ගෞරවනීය විවාහයකට මඟ.'
    }
  ];

  const safetyGuarantees = [
    {
      icon: <ShieldCheck size={28} className="text-emerald-500" />,
      title: '100% Admin NIC Vetted',
      desc: 'සෑම සාමාජිකයෙකුම ජාතික හැඳුනුම්පත මගින් Admin team එක විසින් අතින් තහවුරු කරනු ලැබේ.'
    },
    {
      icon: <Lock size={28} className="text-rose-500" />,
      title: 'Default Photo Blur',
      desc: 'දෙපාර්ශවයම කැමැත්ත ප්‍රකාශ කර Proposal Accept කරන තුරු ඡායාරූප කිසිවෙකුට පැහැදිලිව නොපෙනේ.'
    },
    {
      icon: <Eye size={28} className="text-amber-500" />,
      title: 'Zero Leakage Guarantee',
      desc: 'ඔබගේ පෞද්ගලික දුරකථන අංක හෝ සමාජ මාධ්‍ය තොරතුරු කිසිදා ප්‍රසිද්ධියේ හෙළිදරව් නොවේ.'
    },
    {
      icon: <Crown size={28} className="text-blue-500" />,
      title: 'VIP Ghost Browsing',
      desc: 'VIP සාමාජිකයින්ට කිසිදු සලකුණක් නොතබා රහසිගතව (Incognito) profiles පිරික්සීමේ හැකියාව.'
    }
  ];

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 relative overflow-hidden ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Ambient Decorative Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Top Navigation & Return Link */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setPage(previousView === 'how-it-works' ? 'landing' : previousView)}
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
          >
            <Crown size={14} />
            <span>View Membership Plans</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-4 animate-fade-in">
            <Sparkles size={14} />
            <span>සරල & සුරක්ෂිත පියවරෙන් පියවර මඟපෙන්වීම (A-to-Z Guide)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            Uni Porondam ක්‍රියාත්මක වන්නේ <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500">
              කෙසේද?
            </span>
          </h1>

          <p className={`text-base font-medium leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            ශ්‍රී ලංකාවේ විශ්වවිද්‍යාල උපාධිධාරීන් සහ වෘත්තිකයින් සඳහා සකස් කළ ගෞරවනීය, 100% හැඳුනුම්පත් සත්‍යාපිත විවාහ යෝජනා සේවාව භාවිතා කරන ආකාරය මෙන්න.
          </p>
        </div>

        {/* 6-Step Visual Roadmap */}
        <div className="space-y-8 mb-20">
          {steps.map((s, idx) => (
            <div 
              key={idx}
              className={`p-6 sm:p-8 rounded-3xl border transition-all hover:shadow-xl relative overflow-hidden group ${
                isDark 
                  ? 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700' 
                  : 'bg-white border-slate-200/90 hover:border-rose-300 shadow-md shadow-slate-200/50'
              }`}
            >
              {/* Subtle Step Number Watermark */}
              <span className={`absolute top-4 right-6 text-6xl sm:text-7xl font-black select-none pointer-events-none transition-opacity ${
                isDark ? 'text-slate-800/40 group-hover:text-slate-800/70' : 'text-slate-100 group-hover:text-slate-200/80'
              }`}>
                {s.step}
              </span>

              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${s.badgeColor}`}>
                    Step {s.step} • {s.tag}
                  </span>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-2xl shrink-0 border ${
                    isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-rose-50 border-rose-100'
                  }`}>
                    {s.icon}
                  </div>
                  <div>
                    <h2 className={`text-xl sm:text-2xl font-black mb-1.5 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {s.title}
                    </h2>
                    <p className={`text-sm font-medium ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {s.desc}
                    </p>
                  </div>
                </div>

                {/* Bullet Points */}
                <ul className="space-y-2.5 my-5 max-w-4xl">
                  {s.details.map((item, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-1" />
                      <span className={`text-xs sm:text-sm leading-relaxed ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Highlight Pill */}
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border ${
                  isDark 
                    ? 'bg-slate-950/80 border-slate-800 text-rose-300' 
                    : 'bg-rose-50/70 border-rose-200 text-rose-700'
                }`}>
                  <ShieldCheck size={14} className="text-rose-500 shrink-0" />
                  <span>{s.highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Pillars of Safety & Privacy */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-500 block mb-2">
              Our Commitment to You
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              අපගේ පෞද්ගලිකත්ව සහ ආරක්ෂණ ප්‍රතිපත්තිය
            </h2>
            <p className={`text-xs sm:text-sm font-medium mt-2 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              සාමාන්‍ය වෙබ් අඩවි මෙන් නොව, Uni Porondam නිර්මාණය කර ඇත්තේ විශ්වවිද්‍යාල ශිෂ්‍යාවන්ගේ සහ වෘත්තිකයින්ගේ උපරිම ගෞරවය සුරැකෙන පරිදිය.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyGuarantees.map((item, idx) => (
              <div 
                key={idx}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all hover:scale-[1.02] ${
                  isDark 
                    ? 'bg-slate-900/60 border-slate-800 text-white' 
                    : 'bg-white border-slate-200 text-slate-900 shadow-md'
                }`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                  }`}>
                    {item.icon}
                  </div>
                  <h3 className="text-base font-black mb-2">{item.title}</h3>
                  <p className={`text-xs leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step FAQ Accordion Cards */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-rose-500 block mb-2">
              FAQ • නිතර අසන පැහැදිලි කිරීම්
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              පරිශීලකයින් නිතර අසන ප්‍රශ්න
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className="text-sm font-black mb-2 flex items-center gap-2 text-rose-500">
                <HelpCircle size={16} /> මගේ ඡායාරූප ඕනෑම කෙනෙකුට පෙනේද?
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                නැත. ඔබගේ ඡායාරූප මුලින්ම දිස්වන්නේ පූර්ණ Watermark සහ Blur එකක් සහිතවය. පැහැදිලිව පෙනෙන්නේ ඔබ සහ අනෙක් පාර්ශ්වය යන දෙදෙනාම Proposal Request එකක් අන්‍යෝන්‍ය වශයෙන් Accept කළහොත් පමණි.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className="text-sm font-black mb-2 flex items-center gap-2 text-emerald-500">
                <HelpCircle size={16} /> ජාතික හැඳුනුම්පත (NIC) අන් අයට පෙනේද?
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                කිසිසේත්ම නැත! හැඳුනුම්පත පරිශීලකයින් කිසිවෙකුට දැකගත නොහැකි අතර, එය භාවිතා කරන්නේ අපගේ Admin Verification Team එක විසින් සත්‍යතාව තහවුරු කිරීමට පමණි.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className="text-sm font-black mb-2 flex items-center gap-2 text-blue-500">
                <HelpCircle size={16} /> දෙමාපියන්ට හෝ වැඩිහිටියන්ට මෙය භාවිතා කළ හැකිද?
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                ඔව්, ඉතාමත් සුදුසුයි! ලියාපදිංචි වීමේදී ‘Profile Managed by: Parents / Guardians’ ලෙස තෝරාගත හැකි අතර දෙමාපියන්ට දරුවන් වෙනුවෙන් සුදුසු සහකරුවෙකු සොයා ගැනීමට පහසුකම් සලසා ඇත.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className="text-sm font-black mb-2 flex items-center gap-2 text-amber-500">
                <HelpCircle size={16} /> නොමිලේ (Free Forever) සේවාව ලබාගත හැකිද?
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                ඔව්! ඕනෑම අයෙකුට නොමිලේ Bio-Data එකක් සාදා ගැනීම, Admin NIC සත්‍යාපනය, දිනකට profiles 10ක් නැරඹීම, සහ මසකට proposals 3ක් යැවීම නොමිලේම ජීවිත කාලයටම හිමිවේ.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white text-center shadow-2xl shadow-rose-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black mb-3">
              ඔබගේ සුබ මංගල්‍යයට පළමු පියවර අදම තබන්න
            </h2>
            <p className="text-xs sm:text-sm text-rose-100 mb-8 font-medium leading-relaxed">
              විශ්වවිද්‍යාල උපාධිධාරීන් 1,000+ කට අධික සත්‍යාපිත පිරිසක් සමග එක්වී ඔබගේ සිතැඟි සහකරු හෝ සහකාරිය විශ්වාසයෙන් යුතුව සොයාගන්න.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  if (onGetStarted) onGetStarted();
                  else setPage('onboarding');
                }}
                className="py-3.5 px-8 rounded-2xl bg-white text-rose-600 font-black text-xs uppercase tracking-wider shadow-lg hover:bg-rose-50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles size={16} />
                <span>නොමිලේ Bio-Data එකක් සාදන්න</span>
              </button>
              <button
                type="button"
                onClick={() => setPage('discover')}
                className="py-3.5 px-8 rounded-2xl bg-slate-950/60 hover:bg-slate-950/80 text-white font-black text-xs uppercase tracking-wider border border-white/20 transition-all cursor-pointer"
              >
                යෝජනා ගවේෂණය කරන්න
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
