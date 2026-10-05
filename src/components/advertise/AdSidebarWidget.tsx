import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuMegaphone, LuArrowRight } from 'react-icons/lu';
import { api } from '../../api';

export default function AdSidebarWidget() {
  const [ad, setAd] = useState<any>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const ads = await api.getActiveAds();
        const sidebarAds = ads.filter(a =>
          a.placement_type === 'SIDEBAR' ||
          (a.placement_type && (
            a.placement_type.includes('SIDEBAR') ||
            a.placement_type.includes('Starter')
          ))
        );
        if (sidebarAds.length > 0) {
          const randomAd = sidebarAds[Math.floor(Math.random() * sidebarAds.length)];
          setAd(randomAd);
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };
    fetchAd();
  }, []);

  if (!ad) return null;

  const handleClick = () => {
    api.trackAdClick(ad.id);
    if (ad.target_link) {
      window.open(ad.target_link, '_blank');
    }
  };

  const adImgSrc = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${ad.image_url}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative overflow-hidden rounded-[2rem] bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/5 dark:hover:shadow-none transition-all mb-8 w-full max-w-[320px] mx-auto select-none cursor-pointer group"
      onClick={handleClick}
    >
      {ad.image_url && (
        <div className="relative aspect-video overflow-hidden border-b border-slate-200/40 dark:border-white/5 bg-slate-900/10">
          <img 
            src={adImgSrc} 
            alt={ad.ad_title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
          />
          {/* Floating Neon Badge */}
          <div className="absolute top-3 right-3 z-15 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black uppercase text-[8px] tracking-widest px-2.5 py-1 rounded-full shadow-lg shadow-indigo-500/20 flex items-center gap-1 border border-white/10">
            <LuMegaphone className="w-2.5 h-2.5 animate-pulse" />
            Partner
          </div>
        </div>
      )}
      <div className="p-5 relative z-10 flex flex-col h-full justify-between">
        <div>
          <h4 className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">{ad.company_name}</h4>
          <h3 className="text-base font-black text-slate-800 dark:text-white mb-2 leading-tight group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{ad.ad_title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">{ad.ad_description}</p>
        </div>
        
        <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest group-hover:gap-2 transition-all">
          Learn More 
          <LuArrowRight className="w-3.5 h-3.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}
