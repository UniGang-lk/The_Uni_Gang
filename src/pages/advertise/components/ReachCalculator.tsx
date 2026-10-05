import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LuCalculator, LuEye, LuMousePointerClick, LuTarget, LuArrowRight } from 'react-icons/lu';
import {
  PLACEMENTS, DURATION_OPTIONS, getPlacement, formatLKR, formatNum, type PlacementId,
} from './placements';

const LONG_RUN_DISCOUNT = 0.1; // 10% off for 30-day campaigns

const AnimatedValue = ({ value }: { value: string }) => (
  <motion.span
    key={value}
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="inline-block"
  >
    {value}
  </motion.span>
);

export default function ReachCalculator() {
  const navigate = useNavigate();
  const [placementId, setPlacementId] = useState<PlacementId>('BANNER');
  const [durationIdx, setDurationIdx] = useState(1); // 14 days

  const days = DURATION_OPTIONS[durationIdx];
  const placement = getPlacement(placementId);

  const result = useMemo(() => {
    const gross = placement.ratePerDay * days;
    const discount = days >= 30 ? gross * LONG_RUN_DISCOUNT : 0;
    const cost = gross - discount;
    const impressions = placement.dailyImpressions * days;
    const clicks = impressions * placement.ctr;
    return { gross, discount, cost, impressions, clicks, cpc: clicks > 0 ? cost / clicks : 0 };
  }, [placement, days]);

  const maxImpressions = Math.max(...PLACEMENTS.map((p) => p.dailyImpressions)) * 30;
  const reachPct = Math.min(100, (result.impressions / maxImpressions) * 100);

  return (
    <section id="calculator" className="scroll-mt-24">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-6 sm:p-10 lg:p-14 shadow-2xl shadow-blue-900/30">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Inputs */}
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-widest inline-flex items-center gap-2">
                <LuCalculator /> Reach Calculator
              </span>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Estimate Your Campaign</h2>
              <p className="text-slate-400 font-medium">Choose a format and duration to see estimated reach and cost instantly.</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest">1. Placement</p>
              <div className="grid grid-cols-2 gap-2.5">
                {PLACEMENTS.map((p) => (
                  <button
                    key={p.id}
                    id={`calc-placement-${p.id.toLowerCase()}`}
                    type="button"
                    onClick={() => setPlacementId(p.id)}
                    className={`px-4 py-3 rounded-xl text-sm font-bold text-left transition-all cursor-pointer border ${
                      p.id === placementId
                        ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-slate-300 uppercase tracking-widest">2. Duration</p>
                <span className="text-sm font-black text-cyan-400">{days} days</span>
              </div>
              <input
                id="calc-duration-slider"
                type="range"
                min={0}
                max={DURATION_OPTIONS.length - 1}
                step={1}
                value={durationIdx}
                onChange={(e) => setDurationIdx(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
                aria-label="Campaign duration"
              />
              <div className="flex justify-between text-[11px] font-bold text-slate-500">
                {DURATION_OPTIONS.map((d) => (
                  <span key={d} className={d === days ? 'text-white' : ''}>{d}d</span>
                ))}
              </div>
              {days >= 30 && (
                <p className="text-xs font-bold text-emerald-400">🎉 30-day campaigns get {LONG_RUN_DISCOUNT * 100}% off</p>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col justify-between rounded-3xl bg-white/5 border border-white/10 backdrop-blur p-6 sm:p-8 space-y-6">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Estimated Total</p>
              <p className="text-4xl sm:text-5xl font-black tracking-tight mt-1">
                <AnimatedValue value={formatLKR(result.cost)} />
              </p>
              {result.discount > 0 && (
                <p className="text-sm text-slate-400 mt-1">
                  <span className="line-through">{formatLKR(result.gross)}</span>
                  <span className="text-emerald-400 font-bold ml-2">save {formatLKR(result.discount)}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: LuEye, label: 'Impressions', value: formatNum(result.impressions) },
                { icon: LuMousePointerClick, label: 'Clicks', value: formatNum(result.clicks) },
                { icon: LuTarget, label: 'Cost / Click', value: formatLKR(result.cpc) },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4">
                  <s.icon className="w-4 h-4 text-cyan-400" />
                  <p className="text-base sm:text-lg font-black mt-2 truncate"><AnimatedValue value={s.value} /></p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Reach level</span>
                <span>{Math.round(reachPct)}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  animate={{ width: `${reachPct}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            <button
              id="calc-book-campaign"
              type="button"
              onClick={() => navigate(`/advertise/submit?placement=${placementId}&days=${days}`)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 font-black uppercase tracking-wider shadow-xl shadow-blue-600/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Book This Campaign <LuArrowRight className="w-5 h-5" />
            </button>

            <p className="text-[11px] text-slate-500 font-medium text-center">
              Estimates based on average platform traffic. Final pricing is confirmed by our ad desk.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
