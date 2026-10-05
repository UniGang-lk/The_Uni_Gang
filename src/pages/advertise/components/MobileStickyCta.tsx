import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LuMegaphone } from 'react-icons/lu';

/** Bottom CTA bar shown on mobile after the user scrolls past the hero. */
export default function MobileStickyCta() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;
      setVisible(window.scrollY > 600 && !nearBottom);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="md:hidden fixed bottom-0 inset-x-0 z-40 p-3 pr-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
        >
          {/* pr-20 leaves room for the floating WhatsApp button */}
          <button
            id="mobile-sticky-start-campaign"
            type="button"
            onClick={() => navigate('/advertise/submit')}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <LuMegaphone className="w-4 h-4" /> Start Campaign
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
