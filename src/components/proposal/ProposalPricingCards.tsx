import { LuCheck, LuX, LuCrown, LuSparkles, LuShieldCheck } from 'react-icons/lu';
import toast from 'react-hot-toast';

interface ProposalPricingCardsProps {
  onSubscribeClick: () => void;
}

const ProposalPricingCards = ({ onSubscribeClick }: ProposalPricingCardsProps) => {
  return (
    <div id="proposal-pricing-section" className="py-16 mb-16">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-500 font-black text-[10px] uppercase tracking-widest mb-3 ring-1 ring-amber-500/20">
          <LuCrown size={14} /> Transparent Matrimonial Plans
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Unlock Genuine <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 italic">Connections</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mt-3 leading-relaxed">
          ශ්‍රී ලංකාවේ විශ්වවිද්‍යාල ප්‍රජාව සඳහා ආරක්ෂිත, විනිවිදභාවයෙන් යුතු සාමාජිකත්ව සැලසුම්. නොමිලේ ආරම්භ කරන්න හෝ සීමාවකින් තොරව සම්බන්ධ වීමට Classic / VIP තෝරාගන්න.
        </p>
      </div>

      {/* Pricing Cards Grid - 3 Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
        
        {/* 1. Free Plan */}
        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">🥉 Free Tier</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Basic Plan</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-black text-slate-900 dark:text-white">රු. 0</span>
              <span className="text-xs font-bold text-slate-500">/ Lifetime</span>
            </div>
            
            <ul className="space-y-3.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2.5"><LuCheck className="text-emerald-500 shrink-0" size={16} /> Bio-data සැකසීම & Admin ID Badge</li>
              <li className="flex items-center gap-2.5"><LuCheck className="text-emerald-500 shrink-0" size={16} /> දිනකට Profiles 10ක් බැලීම</li>
              <li className="flex items-center gap-2.5"><LuCheck className="text-emerald-500 shrink-0" size={16} /> Proposals නොමිලේම ලැබීම & Accept කිරීම</li>
              <li className="flex items-center gap-2.5"><LuCheck className="text-emerald-500 shrink-0" size={16} /> පෙරනිමි Blurred ඡායාරූප & Screenshot Guard</li>
              <li className="flex items-center gap-2.5 opacity-40"><LuX className="text-rose-400 shrink-0" size={16} /> Unlimited In-App Chat</li>
              <li className="flex items-center gap-2.5 opacity-40"><LuX className="text-rose-400 shrink-0" size={16} /> Who Liked You Unlock</li>
            </ul>
          </div>

          <button
            onClick={() => toast.success("You are currently using the Free Plan!")}
            className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
          >
            Currently Active
          </button>
        </div>

        {/* 2. Classic Plan (Most Popular) */}
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-500 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <span className="absolute top-5 right-5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md flex items-center gap-1">
            <LuSparkles size={11} /> Most Popular
          </span>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 block mb-1">🥈 Classic Tier</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Classic Plan</h3>
            <div className="flex flex-wrap items-baseline gap-1 mb-1">
              <span className="text-3xl font-black text-amber-500 whitespace-nowrap">රු. 2,990</span>
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">/ මාස 3 (දින 90)</span>
            </div>
            <p className="text-[11px] font-bold text-emerald-500 mb-6 whitespace-nowrap">~ රු. 997 / මසකට පමණි</p>
            
            <ul className="space-y-3.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-8">
              <li className="flex items-center gap-2.5"><LuCheck className="text-amber-500 shrink-0" size={16} /> Unlimited Profiles & Proposals ♾️</li>
              <li className="flex items-center gap-2.5"><LuCheck className="text-amber-500 shrink-0" size={16} /> Unlimited In-App Real-Time Chat</li>
              <li className="flex items-center gap-2.5"><LuCheck className="text-amber-500 shrink-0" size={16} /> Who Liked You Unlocked (ක්ෂණික Match)</li>
              <li className="flex items-center gap-2.5"><LuCheck className="text-amber-500 shrink-0" size={16} /> Read Receipts (Seen ✓✓ Status)</li>
              <li className="flex items-center gap-2.5"><LuCheck className="text-amber-500 shrink-0" size={16} /> Shortlist 25 Profiles & Family Notes</li>
              <li className="flex items-center gap-2.5"><LuCheck className="text-amber-500 shrink-0" size={16} /> 2x Discover Profile Boost</li>
            </ul>
          </div>

          <button
            onClick={onSubscribeClick}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 transition-all border-none cursor-pointer flex items-center justify-center gap-1.5"
          >
            <LuCrown size={16} /> Upgrade to Classic
          </button>
        </div>

        {/* 3. VIP Premium Plan */}
        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-amber-500/30 dark:border-amber-500/30 shadow-lg flex flex-col justify-between hover:border-amber-500/60 transition-all">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">🥇 VIP Tier</span>
              <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">Best Value 👑</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">VIP Premium</h3>
            <div className="flex flex-wrap items-baseline gap-1 mb-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white whitespace-nowrap">රු. 4,990</span>
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">/ මාස 6 (දින 180)</span>
            </div>
            <p className="text-[11px] font-bold text-amber-500 mb-6">~ රු. 830 / මසකට (30% ඉතිරියක්)</p>
            
            <ul className="space-y-3.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2.5"><LuCheck className="text-amber-500 shrink-0" size={16} /> Classic හි සියලුම පහසුකම් ♾️</li>
              <li className="flex items-center gap-2.5"><LuCheck className="text-amber-500 shrink-0" size={16} /> 5x Top Search Placement & Gold Ring</li>
              <li className="flex items-center gap-2.5"><LuCheck className="text-amber-500 shrink-0" size={16} /> 🕶️ Incognito / Ghost Browsing Mode</li>
              <li className="flex items-center gap-2.5"><LuCheck className="text-amber-500 shrink-0" size={16} /> Unlimited Shortlists & Rewinds</li>
              <li className="flex items-center gap-2.5"><LuCheck className="text-amber-500 shrink-0" size={16} /> සම්පූර්ණ කේන්දරය & පොරොන්දම් වාර්තාව</li>
              <li className="flex items-center gap-2.5"><LuCheck className="text-amber-500 shrink-0" size={16} /> Priority VIP Admin WhatsApp Concierge</li>
            </ul>
          </div>

          <button
            onClick={onSubscribeClick}
            className="w-full py-3.5 bg-slate-800 hover:bg-slate-750 text-amber-400 border border-amber-500/40 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
          >
            <LuCrown size={16} /> Choose VIP Membership
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProposalPricingCards;
