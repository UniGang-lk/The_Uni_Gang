import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export interface UnifiedTrustPillProps {
  isVerified?: boolean;
  categoryBadge?: string;
  instituteOrCompany?: string;
  district?: string;
  className?: string;
  showTooltip?: boolean;
}

export default function UnifiedTrustPill({
  isVerified = true,
  categoryBadge = 'Campus Graduate 🎓',
  instituteOrCompany = 'University / Workplace',
  showTooltip = true,
  className = ''
}: UnifiedTrustPillProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Normalize category badge text & emoji
  const badgeText = categoryBadge || 'Campus Graduate 🎓';

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => showTooltip && setIsOpen(true)}
      onMouseLeave={() => showTooltip && setIsOpen(false)}
      onClick={() => showTooltip && setIsOpen(!isOpen)}
    >
      {/* Sleek Glowing Trust Pill */}
      <div 
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide cursor-pointer transition-all duration-300 select-none ${
          isVerified
            ? 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-blue-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 shadow-sm shadow-emerald-500/10 hover:shadow-emerald-500/20'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
        }`}
      >
        {isVerified ? (
          <>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={14} className="stroke-[2.5]" />
              <span className="text-[11px] font-black">100% Verified</span>
            </span>
            <span className="opacity-40">•</span>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              {badgeText}
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Clock size={13} className="stroke-[2.5]" />
              <span className="text-[11px] font-bold">Pending ID</span>
            </span>
            <span className="opacity-40">•</span>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
              {badgeText}
            </span>
          </>
        )}
      </div>

      {/* Interactive Tooltip Snapshot */}
      <AnimatePresence>
        {isOpen && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 bottom-full mb-2 z-50 w-72 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/10 text-left font-sans pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className={`w-6 h-6 rounded-lg grid place-items-center ${
                isVerified ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600'
              }`}>
                <ShieldCheck size={14} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                  {isVerified ? 'Verified Candidate Snapshot' : 'Verification Under Review'}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium">Uni Gang Trust & Safety Protocol</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className={isVerified ? 'text-emerald-500' : 'text-slate-300'} />
                <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                  National ID (NIC) Confirmed
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className={isVerified ? 'text-emerald-500' : 'text-slate-300'} />
                <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                  {badgeText} ({instituteOrCompany})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className={isVerified ? 'text-emerald-500' : 'text-slate-300'} />
                <span className="text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                  Active Mobile / WhatsApp Verified
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-medium flex items-center justify-between">
              <span>🔒 100% Scammer-Free Guarantee</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
