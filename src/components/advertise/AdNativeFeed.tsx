import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LuMegaphone, LuArrowRight } from 'react-icons/lu';
import { api } from '../../api';

interface Ad {
  id: string | number;
  ad_title: string;
  ad_description: string;
  company_name: string;
  image_url: string;
  target_link: string;
  placement_type: string;
  duration_days: number;
}

interface AdNativeFeedProps {
  adIndex?: number;
}

const AdNativeFeed: React.FC<AdNativeFeedProps> = ({ adIndex }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(adIndex !== undefined ? adIndex : 0);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const activeAds = await api.getActiveAds();
        const nativeAds = activeAds.filter((a: Ad) =>
          a.placement_type === 'NATIVE_FEED' ||
          (a.placement_type && (
            a.placement_type.includes('NATIVE') ||
            a.placement_type.includes('FEED') ||
            a.placement_type.includes('Hero') ||
            a.placement_type.includes('Ultimate')
          ))
        );
        setAds(nativeAds);
      } catch (err) {
        console.error('Failed to load native ads', err);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    if (adIndex !== undefined) {
      if (ads.length > 0) {
        setCurrentAdIndex(adIndex % ads.length);
      }
    } else if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 10000); // rotate every 10 seconds
      return () => clearInterval(interval);
    }
  }, [ads.length, adIndex]);

  if (ads.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-cyan-500/10 border border-blue-500/20 p-4 sm:p-5 my-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
            <LuMegaphone className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Promote Your Brand to 50,000+ Uni Students</h4>
            <p className="text-[11px] text-slate-500 font-medium">High conversion ad placements for institutes, deals & services.</p>
          </div>
        </div>
        <a
          href="/advertise"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md hover:scale-105 transition-all shrink-0"
        >
          Advertise Here
        </a>
      </motion.div>
    );
  }

  const ad = ads[currentAdIndex];

  const handleAdClick = () => {
    api.trackAdClick(ad.id);
  };

  const adImgSrc = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${ad.image_url}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full relative overflow-hidden rounded-[2rem] bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/5 dark:hover:shadow-none transition-all my-6 select-none cursor-pointer group"
      onClick={handleAdClick}
    >
      <a
        href={ad.target_link || '#'}
        target={ad.target_link ? "_blank" : "_self"}
        rel="noopener noreferrer"
        className="block"
      >
        {/* Floating Neon Badge */}
        <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-black uppercase text-[8px] tracking-widest px-3 py-1 rounded-full shadow-lg shadow-blue-500/20 flex items-center gap-1 border border-white/10">
          <LuMegaphone className="w-2.5 h-2.5 animate-pulse" />
          Partner
        </div>

        {/* Blurred Duplicate Background Layer (For aspect-ratio clipping correction) */}
        {ad.image_url && (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center blur-2xl opacity-20 dark:opacity-30 scale-110 pointer-events-none transition-transform duration-700 group-hover:scale-115"
            style={{ backgroundImage: `url(${adImgSrc})` }}
          />
        )}

        <div className="flex flex-col sm:flex-row h-full relative z-10">
          {ad.image_url && (
            <div className="sm:w-1/3 relative overflow-hidden aspect-video sm:aspect-auto select-none bg-slate-900/10 min-h-[160px] sm:min-h-0">
              <img 
                src={adImgSrc} 
                alt={ad.ad_title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
            </div>
          )}
          
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-1.5">
              {ad.company_name}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-tight mb-2.5 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {ad.ad_title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {ad.ad_description}
            </p>
            <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest group-hover:gap-2 transition-all">
              Learn More 
              <LuArrowRight className="w-3.5 h-3.5 transition-transform" />
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
};

export default AdNativeFeed;
