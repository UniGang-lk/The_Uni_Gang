import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuCheck, LuClock, LuSparkles, LuX } from 'react-icons/lu';

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  description?: string;
  isPendingApproval?: boolean;
  durationSeconds?: number;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  isPendingApproval = true,
  durationSeconds = 5,
  primaryActionLabel,
  onPrimaryAction,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(durationSeconds);
      return;
    }

    setSecondsLeft(durationSeconds);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, durationSeconds, onClose]);

  if (!isOpen) return null;

  const defaultTitle = isPendingApproval
    ? 'දැන්වීම සාර්ථකව ඉදිරිපත් කරන ලදී!'
    : 'දැන්වීම සජීවීව පළ විය!';

  const defaultSubtitle = isPendingApproval
    ? 'Submission Received • Under Admin Review'
    : 'Your Listing is Now Live! 🎉';

  const defaultDescription = isPendingApproval
    ? 'ඔබගේ දැන්වීම අපගේ Admin කණ්ඩායම විසින් සමාලෝචනය කර අනුමත කළ පසු (Usually within a few hours), එය The Uni Gang platform එකේ සජීවීව සියලු සිසුන්ට දිස්වනු ඇත.'
    : 'ඔබගේ දැන්වීම සාර්ථකව පළ වූ අතර දැන් platform එකේ සියලුම සිසුන්ට එය නැරඹිය හැක.';

  const progressPercent = Math.max(0, Math.min(100, (secondsLeft / durationSeconds) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop with luxury blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10 text-center"
        >
          {/* Close Icon */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border-none bg-transparent"
          >
            <LuX className="w-5 h-5" />
          </button>

          {/* Icon Badge */}
          <div className="mx-auto mb-5 relative flex items-center justify-center">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isPendingApproval
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-200 dark:border-amber-800/60 shadow-lg shadow-amber-500/10'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-200 dark:border-emerald-800/60 shadow-lg shadow-emerald-500/10'
              }`}
            >
              {isPendingApproval ? (
                <LuClock className="w-10 h-10 animate-pulse" />
              ) : (
                <LuCheck className="w-10 h-10" />
              )}
            </div>
            <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-blue-600 text-white shadow-md">
              <LuSparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Titles */}
          <span
            className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${
              isPendingApproval
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
            }`}
          >
            {subtitle || defaultSubtitle}
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3">
            {title || defaultTitle}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-6 px-2">
            {description || defaultDescription}
          </p>

          {/* 5-second countdown progress bar */}
          <div className="mb-6 space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
              <span>ස්වයංක්‍රීයව වැසෙමින් පවතී...</span>
              <span className="text-blue-600 dark:text-blue-400 font-extrabold">{secondsLeft}s</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                  isPendingApproval ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border-none"
            >
              Close Now (වසන්න)
            </button>
            {primaryActionLabel && onPrimaryAction && (
              <button
                type="button"
                onClick={() => {
                  onPrimaryAction();
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all cursor-pointer border-none"
              >
                {primaryActionLabel}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

