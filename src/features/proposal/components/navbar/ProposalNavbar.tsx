import { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { LuSun, LuMoon } from 'react-icons/lu';
import { cx } from '../ui/ProposalPrimitives';
import logoImg from '../../../../assets/logoImage.jpg';
import { useTheme } from '../../../../context/ThemeContext';

interface ProposalNavbarProps {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
  onGetStarted?: () => void;
  onSignIn?: () => void;
  isLoggedIn?: boolean;
  hasProposalProfile?: boolean;
  user?: { name: string; avatar?: string } | null;
  onCreateProposalProfile?: () => void;
}

export default function ProposalNavbar({
  activeTab = 'home',
  onNavigate,
  onGetStarted,
  onSignIn,
  isLoggedIn = false,
  hasProposalProfile = false,
  user,
  onCreateProposalProfile,
}: ProposalNavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', isHighlight: false },
    { id: 'discover', label: 'Search', isHighlight: false },
    { id: 'premium', label: '👑 VIP', isHighlight: true },
  ];

  const handleNavClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isDark = theme === 'dark';

  return (
    <header
      className={cx(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b font-sinhala",
        isDark
          ? scrolled
            ? "bg-slate-950/95 backdrop-blur-xl border-slate-800/90 shadow-xl shadow-rose-500/5 py-2.5 text-white"
            : "bg-slate-950/90 backdrop-blur-md border-slate-900 py-3 text-white"
          : scrolled
            ? "bg-white/95 backdrop-blur-xl border-slate-200 shadow-lg shadow-blue-500/5 py-2.5 text-slate-800"
            : "bg-white/90 backdrop-blur-md border-slate-100 py-3 text-slate-800"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        {/* Far Left Back Button */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            title="Back to Main Website"
            className={cx(
              "p-2 sm:px-3 sm:py-2 rounded-xl border transition-all flex items-center gap-1.5 shrink-0",
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            )}
          >
            <ArrowLeft size={16} />
          </a>

          {/* Main Logo & Name (The Uni Gang - Uni Porondam) */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* Main Logo Image */}
            <div className="relative overflow-hidden rounded-full border-2 border-blue-500 p-0.5 transition-transform duration-300 group-hover:scale-105 shrink-0">
              <img src={logoImg} alt="The Uni Gang" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover" />
            </div>

            {/* Brand Title */}
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={cx("text-base sm:text-lg font-bold tracking-tight font-sans", isDark ? "text-white" : "text-slate-900")}>
                  The <span className="text-blue-500">Uni Gang</span>
                </span>
                <span className="text-xs font-black text-rose-500 dark:text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                  Uni Porondam
                </span>
              </div>
              {/* <p className={cx("text-[10px] font-bold tracking-wider uppercase -mt-0.5 font-sinhala hidden sm:block", isDark ? "text-slate-400" : "text-slate-500")}>
                යූනි පොරොන්දම් මංගල සේවය
              </p> */}
            </div>
          </div>
        </div>

        {/* Central Nav Links */}
        <nav className={cx(
          "hidden md:flex items-center gap-1.5 p-1.5 rounded-full border backdrop-blur-xl transition-all shadow-inner",
          isDark ? "bg-slate-900/90 border-slate-800/90" : "bg-slate-100/90 border-slate-200/90"
        )}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cx(
                  "px-5 py-2 rounded-full text-xs font-extrabold transition-all duration-300 relative font-sans cursor-pointer",
                  isActive
                    ? "bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 text-white shadow-md shadow-pink-400/25 scale-105 font-black"
                    : item.isHighlight
                    ? "text-amber-400 font-extrabold hover:bg-amber-500/10 hover:text-amber-300"
                    : isDark
                    ? "text-slate-300 hover:text-white hover:bg-slate-800/70"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Auth & Theme Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Main Website Theme Switcher Button (LuSun / LuMoon) */}
          <button
            onClick={toggleTheme}
            className={cx(
              "p-2.5 rounded-full transition-all cursor-pointer",
              isDark
                ? "text-slate-300 hover:bg-slate-800 hover:text-amber-400"
                : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
            )}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <LuSun className="w-5 h-5 text-amber-400" /> : <LuMoon className="w-5 h-5 text-slate-700" />}
          </button>

          {/* Conditional Auth & User Profile State Display */}
          {isLoggedIn ? (
            !hasProposalProfile ? (
              /* State 2: Main Website User (Logged In), but no Proposal Profile created yet */
              <button
                type="button"
                onClick={onCreateProposalProfile || onGetStarted}
                className="px-4 py-2 rounded-full text-xs font-black text-white bg-gradient-to-r from-pink-400 via-rose-500 to-pink-500 hover:from-pink-500 hover:to-rose-600 shadow-md shadow-pink-500/20 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer font-sinhala"
              >
                <Sparkles size={14} />
                <span>Profile එක සාදන්න (Free Access 🎁)</span>
              </button>
            ) : (
              /* State 3: Active Proposal Member */
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('profile')}
                className={cx(
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-sans shadow-sm",
                  (activeTab === 'profile' || activeTab === 'dashboard')
                    ? "bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 text-white border-pink-300 shadow-md font-black scale-105"
                    : isDark ? "bg-slate-900 border-slate-800 text-slate-200 hover:border-pink-400" : "bg-white border-slate-200 text-slate-800 hover:border-pink-400"
                )}
              >
                <div className={cx(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0",
                  (activeTab === 'profile' || activeTab === 'dashboard') ? "bg-white text-rose-600" : "bg-gradient-to-tr from-pink-400 to-rose-500 text-white"
                )}>
                  {user?.name?.[0] || 'K'}
                </div>
                <span className="text-xs font-extrabold">
                  {user?.name || 'Kasun Bandara'}
                </span>
              </button>
            )
          ) : (
            /* State 1: Guest / Unauthenticated */
            <>
              <button
                type="button"
                onClick={onSignIn || onGetStarted}
                className={cx(
                  "px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition-colors font-sans cursor-pointer",
                  isDark ? "text-slate-300 hover:text-rose-400" : "text-slate-700 hover:text-rose-600"
                )}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={onGetStarted}
                className="px-4 sm:px-5 py-2.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400 hover:from-pink-500 hover:to-rose-500 shadow-md shadow-pink-400/20 hover:shadow-lg hover:shadow-pink-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 font-sans cursor-pointer"
              >
                <Sparkles size={14} />
                <span>Join Now</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
