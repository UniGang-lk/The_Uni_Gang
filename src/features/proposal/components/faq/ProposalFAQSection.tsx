import { useState } from 'react';
import { ChevronDown, Heart, HelpCircle, ArrowRight } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "ලියාපදිංචි වෙන්නේ කොහොමද?",
    answer: "අපගේ වෙබ් අඩවියේ 'ලියාපදිංචි වන්න' (Get Started) බොත්තම ක්ලික් කර ඔබගේ මුලික තොරතුරු සහ විශ්වවිද්‍යාල/වෘත්තීය තොරතුරු ඇතුළත් කිරීමෙන් පහසුවෙන්ම ගිණුමක් සාදාගත හැක."
  },
  {
    id: 2,
    question: "ගැළපෙන යෝජනා තිබේදැයි බලන්නේ කොහොමද?",
    answer: "ඔබගේ ප්‍රොෆයිල් එක සක්‍රිය වූ පසු 'සොයන්න' (Search) කොටසෙන් වයස, දිස්ත්‍රික්කය, අධ්‍යාපන සුදුසුකම් සහ ආගම අනුව ගැළපෙන යෝජනා පෙරා වෙන්කර ගත හැක."
  },
  {
    id: 3,
    question: "මගේ තොරතුරු සහ ඡායාරූප ඕනෑම කෙනෙකුට දැකගත හැකිද?",
    answer: "නැත. ඔබගේ ඡායාරූප පෙරනිමියෙන්ම නොපෙනෙන සේ (Blurred) තැබිය හැක. ඔබ යෝජනාවක් (Proposal) පිළිගත් පසු පමණක් අනෙක් පාර්ශවයට ඔබගේ පැහැදිලි ඡායාරූප පෙනෙනු ඇත."
  },
  {
    id: 4,
    question: "මම කැමති සහකාරියකට / සහකාරයට යෝජනාවක් (Interest) යවන්නේ කෙසේද?",
    answer: "ඔබ කැමති පැතිකඩෙහි ඇති 'Send Proposal' හෝ 'Interest' බොත්තම ක්ලික් කිරීමෙන් ක්ෂණිකව ඔබගේ ඇරයුම යැවිය හැක."
  },
  {
    id: 5,
    question: "මට ඇරයුමක් (Interest Request) ලැබුණු බව දැනගන්නේ කෙසේද?",
    answer: "ඔබගේ Inbox / Notifications කොටස වෙත ක්ෂණික පණිවිඩයක් ලැබෙනු ඇත."
  },
  {
    id: 6,
    question: "ජාතික හැඳුනුම්පත (NIC) මගින් තහවුරු කළ පැතිකඩයන් (Profiles) හඳුනා ගන්නේ කෙසේද?",
    answer: "තහවුරු කළ පැතිකඩයන්හි නමට පසෙකින් නිල් පැහැති Verified Badge එකක් ප්‍රදර්ශනය වේ. එයින් ඔවුන්ගේ ජාතික හැඳුනුම්පත හා ශිෂ්‍ය තොරතුරු පරීක්ෂා කර ඇති බව තහවුරු වේ."
  },
  {
    id: 7,
    question: "සේවාව සඳහා කිසියම් ගාස්තුවක් අය කෙරේද?",
    answer: "නැත. Uni Porondam මූලික ලියාපදිංචිය, පැතිකඩක් සෑදීම සහ ගැළපෙන යෝජනා සෙවීම (Discover Matches) සියලුම තරුණ තරුණියන්ට සම්පූර්ණයෙන්ම නොමිලේ (100% Free) ලබා දී ඇත."
  },
  {
    id: 8,
    question: "මා උඩුගත කරන ජාතික හැඳුනුම්පත් (NIC) ඡායාරූප සුරක්ෂිතද?",
    answer: "ඔව්, 100% සුරක්ෂිතයි. ඔබ උඩුගත කරන හැඳුනුම්පත මත 'UNIGANG VERIFICATION ONLY' ලෙස ස්වයංක්‍රීය ඩිජිටල් Watermark එකක් යෙදේ. එමෙන්ම එය සත්‍යාපනය කරනු ලබන්නේ අපගේ අභ්‍යන්තර Verification Team එක විසින් පමණක් වන අතර වෙනත් කිසිදු සාමාජිකයෙකුට ඔබගේ හැඳුනුම්පත කිසිසේත්ම නොපෙනේ."
  },
  {
    id: 9,
    question: "මගේ යෝජනා විස්තරය පෙනෙන්නෙ නෑ ඇයි ඒ?",
    answer: "ඔබගේ පැතිකඩෙහි මුලික තොරතුරු අසම්පූර්ණ නම් හෝ පරිපාලක පරීක්ෂාව (Admin Verification) සිදුකෙරෙමින් පවතී නම් එය තාවකාලිකව පෙන්වීම නතර විය හැක. පැය 24ක් ඇතුළත එය සක්‍රිය වේ."
  }
];

interface ProposalFAQSectionProps {
  onViewAllFAQ?: () => void;
  maxItems?: number;
}

export default function ProposalFAQSection({
  onViewAllFAQ,
  maxItems = 6
}: ProposalFAQSectionProps = {}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [openId, setOpenId] = useState<number | null>(1); // Open 1st by default

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className={`py-20 relative border-t font-sinhala ${isDark ? 'border-slate-800/80 bg-gradient-to-b from-transparent via-rose-500/5 to-transparent' : 'border-slate-200 bg-gradient-to-b from-transparent via-rose-500/5 to-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header Title */}
        <div className="text-center mb-14">
          <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Frequently Asked Questions (නිතර අසන ප්‍රශ්න)
          </h2>
          <p className={`mt-3 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Uni Porondam මංගල සේවාව පිළිබඳ ඔබට දැනගැනීමට අවශ්‍ය සියලුම තොරතුරු මෙහි දැක්වේ.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Bridal Couple Image Card */}
          <div className="lg:col-span-5 relative group">
            <div className={`relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 transition-transform duration-700 hover:scale-[1.01] ${isDark ? 'border-slate-800' : 'border-white'
              }`}>
              <img
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Sri Lankan Wedding Couple"
                className="w-full h-[480px] lg:h-[580px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

              {/* Overlay Badge */}
              <div className={`absolute bottom-6 left-6 right-6 p-5 rounded-2xl backdrop-blur-xl border shadow-xl ${isDark ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
                }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0">
                    <Heart size={20} fill="white" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold leading-tight font-sinhala ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Uni Porondam - යූනි පොරොන්දම්
                    </h4>
                    <p className="text-xs font-semibold text-rose-500 mt-0.5 font-sinhala">
                      100% Genuine & Verified Campus Matrimony
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion Questions */}
          <div className="lg:col-span-7 space-y-3.5">
            {FAQ_DATA.slice(0, maxItems).map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl transition-all duration-300 border ${isDark
                      ? isOpen
                        ? "bg-slate-900 border-rose-500/50 shadow-lg shadow-rose-500/10"
                        : "bg-slate-900/60 border-slate-800/80 hover:border-rose-500/30"
                      : isOpen
                        ? "bg-white border-rose-500 shadow-md"
                        : "bg-white/80 border-slate-200 hover:border-rose-300"
                    }`}
                >
                  <button
                    onClick={() => toggleFAQ(item.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 font-sinhala"
                  >
                    <span className={`text-xs sm:text-sm font-bold leading-snug ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                      {item.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen
                        ? "bg-rose-500 text-white rotate-180"
                        : isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
                        }`}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className={`px-4 sm:px-5 pb-5 pt-1 text-xs font-medium leading-relaxed border-t mt-1 font-sinhala animate-fade-up ${isDark ? 'border-slate-800/80 text-slate-300' : 'border-slate-100 text-slate-600'
                      }`}>
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Prominent Deep-Dive FAQ / Knowledge Base Button */}
            {onViewAllFAQ && (
              <div className="pt-4 text-center sm:text-left">
                <button
                  type="button"
                  onClick={onViewAllFAQ}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 hover:from-amber-500/20 hover:to-rose-500/20 border border-amber-500/30 dark:border-amber-400/30 text-amber-600 dark:text-amber-400 font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-sm group"
                >
                  <HelpCircle size={16} className="text-amber-500 shrink-0" />
                  <span>සියලුම ප්‍රශ්නෝත්තර 25+ සහ Help Desk එක බලන්න (Open Full FAQ Page)</span>
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
