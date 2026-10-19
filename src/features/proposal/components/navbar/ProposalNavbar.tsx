import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Heart, ShieldCheck, User } from 'lucide-react';
import { cx } from '../ui/ProposalPrimitives';
import logoImg from '../../../../assets/logoImage.jpg';
import { useTheme } from '../../../../context/ThemeContext';

interface ProposalNavbarProps {
  onNavigate?: (tab: string) => void;
  onGetStarted?: () => void;
  onSignIn?: () => void;
  isLoggedIn?: boolean;
}

export default function ProposalNavbar({
  onNavigate,
  onGetStarted,
  onSignIn,
  isLoggedIn = false,
}: ProposalNavbarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={cx(
        "sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-xl border-b",
        isDark
          ? scrolled
            ? "bg-slate-950/85 border-slate-800/80 shadow-2xl shadow-rose-950/20 py-3"
            : "bg-slate-950/60 border-slate-900 py-4"
          : scrolled
            ? "bg-white/85 border-slate-200/80 shadow-xl shadow-rose-500/5 py-3"
            : "bg-white/60 border-slate-100 py-4"
      )}
    >
      <div className="max-w-[1550px] mx-auto px-6 sm:px-10 lg:px-14 flex items-center justify-between">
        
        {/* Brand Side: Sleek Modern Branding */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <a
            href="/"
            title="Return to The Uni Gang Main Platform"
            className={cx(
              "group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0",
              isDark
                ? "bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-rose-500/50 hover:bg-slate-800"
                : "bg-slate-100/90 border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50"
            )}
          >
            <ArrowLeft size={13} className="text-rose-500 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">The Uni Gang</span>
            <span className="sm:hidden">Main</span>
          </a>

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Logo + Modern Title */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative">
              <img 
                src={logoImg} 
                alt="Uni Porondam" 
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-rose-500/30 p-0.5 group-hover:scale-105 transition-transform" 
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] shadow-sm">
                <Heart size={8} fill="currentColor" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                  Uni <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500">Porondam</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <ShieldCheck size={11} /> Verified
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase -mt-0.5 font-sans hidden sm:block">
                Campus Matchmaking • The Uni Gang
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right Links */}
        <div className="flex items-center gap-3 sm:gap-6 font-sans">
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-xs font-bold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => handleNavClick('discover')}
              className="px-4 py-2 rounded-full hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              Discover Matches
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="px-4 py-2 rounded-full hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('trust')}
              className="px-4 py-2 rounded-full hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              Safety & Privacy
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="px-4 py-2 rounded-full hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {!isLoggedIn ? (
              <button
                onClick={onSignIn}
                className="px-4 py-2 rounded-xl text-xs font-black text-slate-700 dark:text-slate-200 hover:text-rose-500 transition-all cursor-pointer"
              >
                Log In
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="px-3 py-2 rounded-xl text-xs font-black text-slate-700 dark:text-slate-200 hover:text-rose-500 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <User size={14} className="text-rose-500" />
                <span>Dashboard</span>
              </button>
            )}

            {/* Premium Gradient CTA Button */}
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles size={14} />
              <span>Get Started</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
