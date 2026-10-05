import { motion, AnimatePresence } from 'framer-motion';
import { LuMegaphone } from 'react-icons/lu';
import type { PlacementId } from './placements';

const Line = ({ w = 'w-full' }: { w?: string }) => (
  <div className={`h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 ${w}`} />
);

const FeedCard = () => (
  <div className="rounded-md bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 p-1.5 flex gap-1.5">
    <div className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-700 shrink-0" />
    <div className="flex-1 space-y-1 pt-0.5">
      <Line w="w-3/4" />
      <Line w="w-1/2" />
    </div>
  </div>
);

const AdChip = ({ label, className = '' }: { label: string; className?: string }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.85 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className={`relative overflow-hidden rounded-md bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center gap-1.5 px-2 py-1.5 ring-2 ring-blue-400/70 shadow-lg shadow-blue-500/40 ${className}`}
  >
    <LuMegaphone className="w-3 h-3 shrink-0" />
    <span className="text-[8px] font-black uppercase tracking-wider truncate">{label}</span>
    <span className="absolute top-0.5 right-1 text-[6px] font-bold bg-white/25 rounded px-1 uppercase">Ad</span>
    {/* shimmer */}
    <motion.span
      className="absolute inset-y-0 w-1/3 bg-white/20 skew-x-12"
      initial={{ x: '-150%' }}
      animate={{ x: '350%' }}
      transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.2 }}
    />
  </motion.div>
);

interface AdMockScreenProps {
  placement: PlacementId;
  device?: 'desktop' | 'mobile';
  label?: string;
}

/** Miniature, theme-aware page skeleton that highlights where an ad placement appears. */
export default function AdMockScreen({ placement, device = 'desktop', label = 'Your Brand Here' }: AdMockScreenProps) {
  const isMobile = device === 'mobile';
  const showNative = placement === 'NATIVE_FEED' || (isMobile && placement === 'SIDEBAR');

  return (
    <div className="relative w-full h-full bg-slate-50 dark:bg-slate-900 overflow-hidden flex flex-col select-none">
      {/* Fake navbar */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white dark:bg-slate-800 border-b border-slate-200/70 dark:border-slate-700 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
        <Line w="w-10" />
        {!isMobile && (
          <div className="ml-auto flex gap-1 w-1/3">
            <Line /><Line /><Line />
          </div>
        )}
      </div>

      <div className="flex-1 p-2 space-y-1.5 overflow-hidden">
        <AnimatePresence>
          {placement === 'BANNER' && <AdChip key="banner" label={label} className={isMobile ? 'h-7' : 'h-9'} />}
        </AnimatePresence>

        <div className="flex gap-2">
          <div className="flex-1 space-y-1.5 min-w-0">
            <FeedCard />
            <AnimatePresence>
              {showNative && <AdChip key="native" label={label} className="h-10" />}
            </AnimatePresence>
            <FeedCard />
            <FeedCard />
            {!isMobile && <FeedCard />}
          </div>

          {!isMobile && (
            <div className="w-1/4 space-y-1.5">
              <div className="rounded-md bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 p-1.5 space-y-1">
                <Line />
                <Line w="w-2/3" />
              </div>
              <AnimatePresence>
                {placement === 'SIDEBAR' && (
                  <AdChip key="sidebar" label={label} className="h-16 flex-col justify-center text-center" />
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {placement === 'POPUP' && (
          <motion.div
            key="popup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50 flex items-center justify-center p-3"
          >
            <AdChip label={label} className={`${isMobile ? 'w-4/5 h-20' : 'w-1/2 h-24'} flex-col justify-center text-center`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
