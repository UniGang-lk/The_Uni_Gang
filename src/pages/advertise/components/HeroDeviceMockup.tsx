import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdMockScreen from './AdMockScreen';
import { PLACEMENTS } from './placements';

/** Laptop + phone mockup that auto-rotates through every ad placement. */
export default function HeroDeviceMockup() {
  const [index, setIndex] = useState(0);
  const current = PLACEMENTS[index];

  // Restart the timer whenever the user picks a placement manually
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % PLACEMENTS.length), 3200);
    return () => clearInterval(t);
  }, [index]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25, duration: 0.6 }}
      className="relative w-full max-w-xl mx-auto"
    >
      {/* Glow */}
      <div className="absolute -inset-8 bg-gradient-to-tr from-blue-500/25 via-indigo-500/20 to-cyan-400/25 blur-3xl rounded-full pointer-events-none" />

      {/* Laptop */}
      <div className="relative">
        <div className="rounded-t-2xl border-[10px] border-b-[14px] border-slate-800 dark:border-slate-700 bg-slate-800 shadow-2xl shadow-blue-900/20 aspect-[16/10] overflow-hidden">
          <AdMockScreen placement={current.id} />
        </div>
        <div className="h-3 -mx-[4%] bg-gradient-to-b from-slate-600 to-slate-900 rounded-b-xl shadow-lg" />
      </div>

      {/* Phone */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-8 -left-3 sm:-left-8 w-[28%] aspect-[9/19] rounded-[1.6rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-2.5 bg-slate-900 rounded-b-lg z-10" />
        <AdMockScreen placement={current.id} device="mobile" />
      </motion.div>

      {/* Placement switcher */}
      <div className="relative mt-14 flex flex-wrap justify-center gap-2">
        {PLACEMENTS.map((p, i) => (
          <button
            key={p.id}
            id={`hero-placement-${p.id.toLowerCase()}`}
            type="button"
            onClick={() => setIndex(i)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              i === index
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
            }`}
          >
            {p.short}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
