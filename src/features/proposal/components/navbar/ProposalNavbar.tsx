import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Heart, ShieldCheck, User, Menu, X, Compass, HelpCircle, Lock, Cog, Crown } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
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
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-6 2xl:px-12 flex items-center justify-between gap-2 lg:gap-4">
        
        {/* 1. Brand Side (Left Part): Sleek Modern Branding */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <a
            href="/"
            title="Return to The Uni Gang Main Platform"
            className={cx(
              "group inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0",
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
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="relative shrink-0">
              <img 
                src={logoImg} 
                alt="Uni Porondam" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl object-cover ring-2 ring-rose-500/30 p-0.5 group-hover:scale-105 transition-transform" 
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] sm:text-[9px] shadow-sm">
                <Heart size={7} fill="currentColor" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg 2xl:text-xl font-black tracking-tight text-slate-900 dark:text-white font-sans whitespace-nowrap">
                  Uni <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500">Porondam</span>
                </span>
                <span className="hidden 2xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 whitespace-nowrap">
                  <ShieldCheck size={11} /> Verified
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase -mt-0.5 font-sans hidden 2xl:block whitespace-nowrap">
                Campus Matchmaking • The Uni Gang
              </p>
            </div>
          </div>
        </div>

        {/* 2. Center Part: Perfectly Positioned Pill Navigation (Flexible & Adaptive) */}
        <div className="hidden xl:flex items-center justify-center flex-1 mx-2 2xl:mx-6 min-w-0">
          <nav className="flex items-center gap-0.5 2xl:gap-1.5 p-1 2xl:p-1.5 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 text-[11px] 2xl:text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm backdrop-blur-md shrink-0">
            <button
              onClick={() => handleNavClick('discover')}
              className="px-2.5 2xl:px-3.5 py-1 2xl:py-1.5 rounded-full hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 2xl:gap-1.5 whitespace-nowrap"
              title="ලියාපදිංචි සාමාජිකයින්ට මූලික විස්තර ගවේෂණය කළ හැක"
            >
              <Compass size={13} className="text-rose-500 shrink-0" />
              <span>Discover<span className="hidden 2xl:inline"> Matches</span></span>
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="px-2.5 2xl:px-3.5 py-1 2xl:py-1.5 rounded-full hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 2xl:gap-1.5 whitespace-nowrap"
              title="පියවරෙන් පියවර සම්පූර්ණ මඟපෙන්වීම"
            >
              <Cog size={13} className="text-pink-500 shrink-0" />
              <span>How It Works</span>
            </button>
            <button
              onClick={() => handleNavClick('trust')}
              className="px-2.5 2xl:px-3.5 py-1 2xl:py-1.5 rounded-full hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 2xl:gap-1.5 whitespace-nowrap"
              title="හැඳුනුම්පත් රහස්‍යභාවය, Photo blur, Watermark"
            >
              <Lock size={13} className="text-blue-500 shrink-0" />
              <span>Safety<span className="hidden 2xl:inline"> & Privacy</span></span>
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="px-2.5 2xl:px-3.5 py-1 2xl:py-1.5 rounded-full hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 2xl:gap-1.5 whitespace-nowrap"
              title="නිතර අසන ප්‍රශ්න සහ පිළිතුරු"
            >
              <HelpCircle size={13} className="text-amber-500 shrink-0" />
              <span>FAQ</span>
            </button>

            {/* Subtle vertical divider before pricing */}
            <div className="h-3.5 2xl:h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5 2xl:mx-1" />

            <button
              onClick={() => handleNavClick('pricing')}
              className="px-2.5 2xl:px-3.5 py-1 2xl:py-1.5 rounded-full hover:text-amber-500 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 2xl:gap-1.5 whitespace-nowrap text-amber-500 dark:text-amber-400 font-extrabold"
              title="සාමාජික පැකේජ සහ මිල ගණන් විස්තර"
            >
              <Crown size={13} className="text-amber-500 shrink-0" />
              <span><span className="hidden 2xl:inline">Plans & </span>Pricing</span>
              <span className="text-[9px] bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 px-1.5 py-0.5 rounded-full font-black leading-none ml-0.5">
                VIP
              </span>
            </button>
          </nav>
        </div>

        {/* 3. Right Part: Action Buttons + Mobile Toggle (Pushed Right) */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-3 shrink-0 font-sans">
          {!isLoggedIn ? (
            <>
              {/* 🔘 ඇතුල් වන්න (Log In) - Hidden on extra small phones to prevent overflow, accessible in mobile drawer */}
              <button
                onClick={onSignIn}
                className="hidden sm:inline-flex px-2.5 sm:px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-rose-500 transition-all cursor-pointer whitespace-nowrap"
              >
                ඇතුල් වන්න <span className="hidden md:inline font-normal text-slate-400">(Log In)</span>
              </button>

              {/* 🔴 නොමිලේ ලියාපදිංචි වන්න (Register Free / Get Started) */}
              <button
                onClick={onGetStarted}
                className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap font-sans"
              >
                <Sparkles size={14} />
                <span><span className="hidden sm:inline">නොමිලේ </span>ලියාපදිංචිය</span>
              </button>
            </>
          ) : (
            /* 👤 Logged-In User Action: Dashboard (Account) */
            <button
              onClick={() => handleNavClick('dashboard')}
              className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap font-sans"
            >
              <User size={15} />
              <span>Bio-Data<span className="hidden sm:inline"> (Dashboard)</span></span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden px-6 pt-3 pb-6 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl space-y-2 animate-fade-in font-sans">
          {!isLoggedIn ? (
            <div className="sm:hidden grid grid-cols-2 gap-2 pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-800/60">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignIn?.();
                }}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <User size={15} />
                <span>ඇතුල් වන්න (Log In)</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStarted?.();
                }}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                <Sparkles size={14} />
                <span>ලියාපදිංචි වන්න</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-800/60">
              <button
                onClick={() => handleNavClick('dashboard')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-sm"
              >
                <User size={15} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleNavClick('settings')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700"
              >
                <Cog size={15} />
                <span>Settings</span>
              </button>
            </div>
          )}
          <button
            onClick={() => handleNavClick('discover')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
          >
            <Compass size={16} className="text-rose-500" />
            <span>🔍 යෝජනා ගවේෂණය (Discover Matches)</span>
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
          >
            <Cog size={16} className="text-pink-500" />
            <span>⚙️ ක්‍රියාකාරීත්වය (How It Works)</span>
          </button>
          <button
            onClick={() => handleNavClick('trust')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
          >
            <Lock size={16} className="text-blue-500" />
            <span>🛡️ ආරක්ෂාව සහ රහස්‍යතාව (Safety & Privacy)</span>
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
          >
            <HelpCircle size={16} className="text-amber-500" />
            <span>❓ නිතර අසන ප්‍රශ්න (FAQ)</span>
          </button>
          <button
            onClick={() => handleNavClick('pricing')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-amber-500 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Crown size={16} className="text-amber-500" />
              <span>👑 මිල ගණන් සහ පැකේජ (Plans & Pricing)</span>
            </div>
            <span className="text-[9px] bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 px-2 py-0.5 rounded-full font-black">
              VIP
            </span>
          </button>
        </div>
      )}
    </header>
  );
}
