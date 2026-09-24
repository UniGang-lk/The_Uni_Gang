import { useState, useEffect } from 'react';
import { Target, CheckCircle2, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/ProposalPrimitives';
import { celebrate } from '../../../../utils/celebrate';

export function ProfileGamification({ completionPct, missingTasks, onTaskClick }: { completionPct: number, missingTasks: { id: string, label: string, reward: number }[], onTaskClick: (taskId: string) => void }) {
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    if (completionPct === 100 && !hasCelebrated) {
      celebrate();
      setHasCelebrated(true);
    }
  }, [completionPct, hasCelebrated]);

  return (
    <Card className="p-6 overflow-hidden relative group">
      {/* Background glow if 100% */}
      {completionPct === 100 && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 dark:from-emerald-900/20 dark:to-transparent pointer-events-none" />
      )}
      
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            {completionPct === 100 ? (
              <><ShieldCheck className="text-emerald-500" /> Verified Elite</>
            ) : (
              <><Target className="text-rose-500" /> Profile Strength</>
            )}
          </h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {completionPct === 100 ? "Your profile is fully complete and verified." : "Complete your profile to increase visibility and get a Verified badge."}
          </p>
        </div>
        <div className="w-14 h-14 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center relative shadow-inner shrink-0">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="24" cy="24" r="24" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="4" fill="none" />
            <circle cx="24" cy="24" r="24" className={`stroke-${completionPct === 100 ? 'emerald' : 'rose'}-500 transition-all duration-1000 ease-out`} strokeWidth="4" fill="none" strokeDasharray="150" strokeDashoffset={150 - (150 * completionPct) / 100} strokeLinecap="round" />
          </svg>
          <span className={`text-sm font-bold ${completionPct === 100 ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>{completionPct}%</span>
        </div>
      </div>

      {completionPct < 100 && (
        <div className="space-y-3 relative z-10">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Remaining Tasks</p>
          {missingTasks.map(task => (
            <button 
              key={task.id}
              onClick={() => onTaskClick(task.id)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-rose-300 hover:shadow-sm transition-all text-left group/btn"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover/btn:text-rose-500 transition-colors">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{task.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+{task.reward}%</span>
                <ArrowRight size={14} className="text-slate-400 group-hover/btn:text-rose-500 transform group-hover/btn:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Free Premium Trial disabled for redesign */}
      {/* completionPct === 100 && (
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-between relative z-10 shadow-lg shadow-emerald-500/20 animate-fade-up">
          <div className="flex items-center gap-3">
            <Trophy size={24} className="text-emerald-100 drop-shadow-md" />
            <div>
              <p className="text-sm font-black">Free Premium Activated!</p>
              <p className="text-xs font-medium text-emerald-100">Enjoy full access for 2 days.</p>
            </div>
          </div>
        </div>
      ) */}
    </Card>
  );
}
