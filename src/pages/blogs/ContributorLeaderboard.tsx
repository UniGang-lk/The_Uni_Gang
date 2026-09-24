import React from 'react';
import { motion } from 'framer-motion';
import { LuTrophy, LuCrown, LuThumbsUp, LuBookOpen, LuSparkles, LuArrowRight } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { Contributor } from '../../types/blog';

interface ContributorLeaderboardProps {
  contributors: Contributor[];
}

const ContributorLeaderboard: React.FC<ContributorLeaderboardProps> = ({ contributors }) => {
  const topContributors = contributors.slice(0, 5);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-md shadow-yellow-500/30">
            <LuCrown className="w-4 h-4" />
          </div>
        );
      case 2:
        return (
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-800 font-black text-xs flex items-center justify-center shadow-sm">
            2
          </div>
        );
      case 3:
        return (
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-sm">
            3
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs flex items-center justify-center">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl shadow-slate-100 dark:shadow-none space-y-5 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center">
            <LuTrophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              Top Contributors
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">Monthly Leaderboard</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider">
          Top Writers
        </span>
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {topContributors.length > 0 ? (
          topContributors.map((contributor, index) => {
            const rank = index + 1;
            return (
              <motion.div
                key={contributor.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center justify-between p-2.5 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all"
              >
                {/* Left: Rank & Avatar & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  {getRankBadge(rank)}
                  <div className="relative">
                    <img
                      src={contributor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contributor.name}`}
                      alt={contributor.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                    />
                    {rank === 1 && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {contributor.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {contributor.university || 'University Student'}
                    </p>
                  </div>
                </div>

                {/* Right: Posts & Likes stats */}
                <div className="flex items-center gap-3 shrink-0 text-right">
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                    <LuBookOpen className="w-3.5 h-3.5 text-blue-500" />
                    <span>{contributor.blogsCount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                    <LuThumbsUp className="w-3.5 h-3.5 text-rose-500" />
                    <span>{contributor.totalLikes}</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-6 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-2">
            <LuSparkles className="w-6 h-6 text-amber-500 mx-auto" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Be the First Top Contributor!
            </p>
            <p className="text-[11px] text-slate-400">
              Publish university insights and rise to the top of the campus leaderboard.
            </p>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <Link
        to="/submit-blog"
        className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100/60 dark:hover:bg-blue-900/40 transition-colors group"
      >
        <span>Write a Story to Rank Up</span>
        <LuArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default ContributorLeaderboard;
