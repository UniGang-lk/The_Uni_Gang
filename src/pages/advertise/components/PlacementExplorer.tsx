import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuLayers, LuCheck } from 'react-icons/lu';
import AdMockScreen from './AdMockScreen';
import { PLACEMENTS, getPlacement, formatLKR, type PlacementId } from './placements';

export default function PlacementExplorer() {
  const [active, setActive] = useState<PlacementId>('BANNER');
  const info = getPlacement(active);

  return (
    <section id="placements" className="space-y-10 scroll-mt-24">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest inline-flex items-center gap-2">
          <LuLayers /> Placement Explorer
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          See Exactly Where You Appear
        </h2>
        <p className="text-slate-600 dark:text-slate-400 font-medium">
          Pick a format to preview its position on a real page layout.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Tabs */}
        <div className="lg:col-span-2 space-y-3" role="tablist" aria-label="Ad placements">
          {PLACEMENTS.map((p) => {
            const isActive = p.id === active;
            return (
              <button
                key={p.id}
                id={`placement-tab-${p.id.toLowerCase()}`}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActive(p.id)}
                className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 shadow-xl shadow-blue-500/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="placement-active-bar"
                    className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-blue-600"
                  />
                )}
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wide">{p.title}</h3>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    from {formatLKR(p.ratePerDay)}/day
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5 leading-relaxed">{p.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Preview */}
        <div className="lg:col-span-3 space-y-5 lg:sticky lg:top-24">
          <div className="rounded-3xl bg-slate-900 dark:bg-slate-800 p-3 shadow-2xl shadow-blue-900/20">
            <div className="flex items-center gap-1.5 px-2 pb-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-3 flex-1 h-5 rounded-md bg-slate-800 dark:bg-slate-700 text-[10px] text-slate-400 font-medium flex items-center px-2">
                theunigang.lk
              </span>
            </div>
            <div className="aspect-[16/10] rounded-xl overflow-hidden">
              <AdMockScreen placement={active} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {[
                { label: 'Artwork Size', value: info.specs },
                { label: 'Starting Rate', value: `${formatLKR(info.ratePerDay)} / day` },
                { label: 'Best For', value: info.bestFor },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <LuCheck className="w-3 h-3 text-blue-500" /> {item.label}
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{item.value}</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
