import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuMegaphone } from 'react-icons/lu';
import { api } from '../../api';

export default function AdBanner({ placement = 'BANNER' }: { placement?: string }) {
  const [ad, setAd] = useState<any>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const ads = await api.getActiveAds();
        const bannerAds = ads.filter(a =>
          a.placement_type === placement ||
          (a.placement_type && (
            a.placement_type.includes(placement) ||
            a.placement_type.includes('Hero') ||
            a.placement_type.includes('Ultimate')
          ))
        );
        if (bannerAds.length > 0) {
          // Pick a random ad for rotation
          const randomAd = bannerAds[Math.floor(Math.random() * bannerAds.length)];
          setAd(randomAd);
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };
    fetchAd();
  }, [placement]);

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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.005 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full relative overflow-hidden rounded-[1.8rem] md:rounded-[2.2rem] cursor-pointer group border border-slate-200/50 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none bg-slate-950 mb-8 h-28 sm:h-36"
      onClick={handleClick}
    >
      {/* Blurred Duplicate Background Layer (For aspect-ratio clipping correction) */}
      {ad.image_url && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center blur-2xl opacity-30 dark:opacity-40 scale-110 pointer-events-none transition-transform duration-700 group-hover:scale-115"
          style={{ backgroundImage: `url(${adImgSrc})` }}
        />
      )}

      {/* Main Container / Content */}
      <div className="relative w-full h-full z-10 flex items-center justify-between overflow-hidden">
        
        {/* Left Side: Ad text info */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 z-20 flex flex-col justify-center h-full bg-gradient-to-r from-black/80 via-black/60 to-transparent text-white select-none">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-md shadow-blue-500/20">
              <LuMegaphone className="w-2.5 h-2.5 animate-pulse" />
              Partner
            </span>
            <span className="text-white/60 text-[10px] sm:text-xs font-bold truncate max-w-[120px] sm:max-w-none">{ad.company_name}</span>
          </div>
          <h3 className="text-sm sm:text-lg md:text-xl font-black truncate tracking-tight text-white group-hover:text-blue-400 transition-colors">
            {ad.ad_title}
          </h3>
          <p className="text-white/70 text-[10px] sm:text-xs md:text-sm line-clamp-1 mt-0.5 sm:mt-1 font-medium">
            {ad.ad_description}
          </p>
        </div>

        {/* Right Side: Centered/Contained Ad Image */}
        {ad.image_url ? (
          <div className="w-1/3 sm:w-1/2 md:w-2/5 h-full relative overflow-hidden shrink-0 select-none bg-slate-900/50">
            <img
              src={adImgSrc}
              alt={ad.ad_title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 relative z-10"
            />
            {/* Dark gradient to blend image into text pane */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/80 to-transparent z-20 pointer-events-none" />
          </div>
        ) : (
          <div className="w-1/3 sm:w-1/2 md:w-2/5 h-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shrink-0">
            <LuMegaphone className="w-8 h-8 text-white/20" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
