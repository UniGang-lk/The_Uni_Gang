import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  Crown, 
  Download, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  NAKSHATRAS, 
  RASHIS, 
  calculateAstroPorondam, 
  AstroMatchReport 
} from '../../utils/astroEngine';
import { PrimaryButton } from '../ui/ProposalPrimitives';

interface ProposalAstroMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName?: string;
  candidateCode?: string;
  onUpgradeVIP?: () => void;
}

export default function ProposalAstroMatchModal({
  isOpen,
  onClose,
  candidateName = 'Piyumali L.',
  candidateCode = 'BR000158',
  onUpgradeVIP
}: ProposalAstroMatchModalProps) {
  const [brideNakId, setBrideNakId] = useState<number>(1); // Aswida
  const [groomNakId, setGroomNakId] = useState<number>(2); // Berana
  const [brideRashiId, setBrideRashiId] = useState<number>(1); // Mesha
  const [groomRashiId, setGroomRashiId] = useState<number>(2); // Vrishabha
  const [hasKujaBride, setHasKujaBride] = useState(false);
  const [hasKujaGroom, setHasKujaGroom] = useState(false);
  const [showDetailedTable, setShowDetailedTable] = useState(true);

  // Compute report using real Sri Lankan 20-porondam engine
  const report: AstroMatchReport = calculateAstroPorondam(
    brideNakId,
    groomNakId,
    brideRashiId,
    groomRashiId,
    hasKujaBride,
    hasKujaGroom
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto custom-scrollbar font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-5 sm:p-8 max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-purple-500/20 shrink-0">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-amber-300">
                <Sparkles size={24} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Astro Match 🔮 (ජ්‍යොතිෂ පොරොන්දම්)
                </h2>
                <span className="text-[10px] bg-amber-500/10 text-amber-500 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-wider">
                  20-PORONDAM ENGINE
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Nirayana Zodiac Matchmaking for <strong className="text-rose-500">{candidateName} ({candidateCode})</strong>
              </p>
            </div>
          </div>

          {/* Input Controls: Select Nakshatra & Rashi */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5 font-sans">
              <Sparkles size={14} /> 1. Select Birth Stars & Rashis (නැකත හා රාශිය තෝරන්න)
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 text-xs font-bold">
              {/* Bride Input */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-pink-500/20 space-y-2.5">
                <span className="text-[11px] font-black uppercase text-pink-500 block">Bride (මනාලියගේ නැකත)</span>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Nakshatra (උපන් නැකත)</label>
                  <select
                    value={brideNakId}
                    onChange={(e) => setBrideNakId(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    {NAKSHATRAS.map((n) => (
                      <option key={n.id} value={n.id}>{n.id}. {n.nameSinhala} ({n.name})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Rashi (රාශිය)</label>
                  <select
                    value={brideRashiId}
                    onChange={(e) => setBrideRashiId(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    {RASHIS.map((r) => (
                      <option key={r.id} value={r.id}>{r.nameSinhala}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Groom Input */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-blue-500/20 space-y-2.5">
                <span className="text-[11px] font-black uppercase text-blue-500 block">Groom (මනාලයාගේ නැකත)</span>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Nakshatra (උපන් නැකත)</label>
                  <select
                    value={groomNakId}
                    onChange={(e) => setGroomNakId(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    {NAKSHATRAS.map((n) => (
                      <option key={n.id} value={n.id}>{n.id}. {n.nameSinhala} ({n.name})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Rashi (රාශිය)</label>
                  <select
                    value={groomRashiId}
                    onChange={(e) => setGroomRashiId(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    {RASHIS.map((r) => (
                      <option key={r.id} value={r.id}>{r.nameSinhala}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Kuja Doshaya Toggle Checks */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800 flex-wrap text-xs font-bold">
              <span className="text-slate-500">Kuja Doshaya Check (කුජ දෝෂය):</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={hasKujaBride} onChange={(e) => setHasKujaBride(e.target.checked)} className="rounded text-purple-600" />
                  <span>Bride Kuja</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={hasKujaGroom} onChange={(e) => setHasKujaGroom(e.target.checked)} className="rounded text-purple-600" />
                  <span>Groom Kuja</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results Teaser Hero Card */}
          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white border-2 border-purple-500/40 shadow-xl mb-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-amber-400 text-slate-950 tracking-wider">
                  INSTANT MATCH VERDICT
                </span>
                <h3 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight text-white">
                  {report.totalMatched} / 20 <span className="text-xl text-purple-300 font-bold">Porondam Matched</span>
                </h3>
                <p className="text-sm font-bold text-amber-200 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                  <span>Compatibility: {report.percentage}%</span>
                  <span>•</span>
                  <span>{report.verdict}</span>
                </p>
                <p className="text-xs text-slate-300 mt-2 max-w-md leading-relaxed font-sinhala">
                  {report.kujaDoshayaStatus}
                </p>
              </div>

              {/* Gauge Radial Badge */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-amber-400 p-1 shadow-lg shadow-purple-500/30 shrink-0">
                <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-amber-300">{report.percentage}%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Match Score</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed 20-Porondam Table Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowDetailedTable(!showDetailedTable)}
              className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>View Granular 20-Porondam Breakdown (විසි පොරොන්දම් ලැයිස්තුව)</span>
              {showDetailedTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showDetailedTable && (
              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                {report.items.map((item, idx) => (
                  <div
                    key={item.title}
                    className={`p-3 rounded-2xl border flex items-start justify-between gap-3 text-xs ${
                      item.passed 
                        ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-slate-900 dark:text-slate-100'
                        : 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="font-extrabold text-slate-400 w-5 shrink-0">{idx + 1}.</span>
                      <div>
                        <h4 className="font-extrabold text-xs flex items-center gap-1.5">
                          <span>{item.titleSinhala}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({item.title})</span>
                        </h4>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 font-sinhala">{item.details}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
                      item.passed ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' : 'bg-rose-500/20 text-rose-500 border-rose-500/30'
                    }`}>
                      {item.passed ? '✔ Pass' : '✖ Alert'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-colors cursor-pointer text-center"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                alert("Downloading Official Astro Porondam PDF Report...");
              }}
              className="w-full sm:flex-1 py-3 rounded-2xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download size={14} /> Download PDF Report
            </button>

            <PrimaryButton
              onClick={() => {
                onClose();
                if (onUpgradeVIP) onUpgradeVIP();
              }}
              icon={Crown}
              className="w-full sm:flex-1 py-3 text-xs bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300"
            >
              Unlock VIP Pro
            </PrimaryButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
