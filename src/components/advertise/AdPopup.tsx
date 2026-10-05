import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuX, LuExternalLink, LuMegaphone } from 'react-icons/lu';
import { api } from '../../api';

interface Ad {
  id: string;
  ad_title: string;
  company_name: string;
  ad_description: string;
  image_url: string | null;
  target_link: string | null;
  placement_type: string;
}

export default function AdPopup() {
  const [ad, setAd] = useState<Ad | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [hasShownThisSession, setHasShownThisSession] = useState(false);

  useEffect(() => {
    // 10-minute cooldown tracking using localStorage
    const storageKey = 'lastAdPopupShownAt';
    const lastShown = localStorage.getItem(storageKey);
    const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

    if (lastShown && (Date.now() - Number(lastShown) < COOLDOWN_MS)) {
      setHasShownThisSession(true);
      return;
    }

    const fetchPopupAd = async () => {
      try {
        const ads = await api.getActiveAds();
        const popupAds = ads.filter((a: Ad) =>
          a.placement_type === 'POPUP' ||
          (a.placement_type && (
            a.placement_type.includes('POPUP') ||
            a.placement_type.includes('Ultimate')
          ))
        );
        
        if (popupAds.length > 0) {
          const randomAd = popupAds[Math.floor(Math.random() * popupAds.length)];
          setAd(randomAd);
          
          setTimeout(() => {
            setIsVisible(true);
            localStorage.setItem(storageKey, String(Date.now()));
          }, 2000);
        }
      } catch (error) {
        console.error('Failed to fetch popup ads', error);
      }
    };

    fetchPopupAd();
  }, []);

  // Timer logic
  useEffect(() => {
    if (!isVisible) return;

    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      handleClose();
    }
  }, [isVisible, timeLeft]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleAdClick = () => {
    if (ad) {
      api.trackAdClick(ad.id);
      if (ad.target_link) {
        window.open(ad.target_link, '_blank');
      }
      handleClose();
    }
  };

  if (hasShownThisSession || !ad) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 25 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 25 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200/50 dark:border-white/5"
          >
            {/* Smooth Spinning Gradient Border Accent */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-[3px] bg-gradient-to-r from-blue-500 via-indigo-600 to-pink-500 rounded-[2rem] -z-10 opacity-70 pointer-events-none"
            />
            
            {/* Cinematic Bubbles background animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -140, 0],
                    x: [0, Math.sin(i) * 30, 0],
                    opacity: [0.15, 0.45, 0.15]
                  }}
                  transition={{
                    duration: 7 + i * 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute bg-blue-500/10 dark:bg-indigo-500/5 rounded-full blur-[8px]"
                  style={{
                    width: `${24 + i * 8}px`,
                    height: `${24 + i * 8}px`,
                    left: `${15 + i * 18}%`,
                    bottom: "-30px",
                  }}
                />
              ))}
            </div>

            {/* Header / Countdown */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/50 dark:bg-slate-950/40 border-b border-slate-150 dark:border-white/5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                  <LuMegaphone size={14} className="animate-bounce" />
                </div>
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Partner Spotlight</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClose}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <LuX size={14} />
                </button>
              </div>
            </div>

            {/* Ad Content */}
            <div 
              className="p-6 sm:p-8 cursor-pointer group"
              onClick={handleAdClick}
            >
              {ad.image_url && (
                <div className="w-full h-40 sm:h-44 mb-5 rounded-2xl overflow-hidden relative border border-slate-100 dark:border-white/5">
                  <img 
                    src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${ad.image_url}`} 
                    alt={ad.ad_title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
                </div>
              )}

              <div className="text-center select-none">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-1 block">
                  {ad.company_name}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mb-3 tracking-tight group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                  {ad.ad_title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {ad.ad_description}
                </p>
                
                <button className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/25 active:scale-95">
                  Explore Now <LuExternalLink size={12} />
                </button>
              </div>
            </div>

            {/* Countdown Progress Bar Timer */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: `${(timeLeft / 5) * 100}%` }}
                transition={{ duration: 1, ease: "linear" }}
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
