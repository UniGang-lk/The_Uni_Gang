import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuChevronDown } from 'react-icons/lu';

export interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="max-w-3xl mx-auto space-y-8 scroll-mt-24">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-600 dark:text-slate-400 font-medium">Everything you need to know before launching.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={faq.q}
              className={`rounded-2xl border transition-colors ${
                isOpen
                  ? 'border-blue-500/50 bg-white dark:bg-slate-900 shadow-lg shadow-blue-500/5'
                  : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60'
              }`}
            >
              <button
                id={`faq-toggle-${i}`}
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer"
              >
                <span className="text-base font-bold text-slate-900 dark:text-white">{faq.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <LuChevronDown className="w-4 h-4" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
