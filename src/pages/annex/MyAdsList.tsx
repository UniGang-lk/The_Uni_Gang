import React, { useState } from 'react';
import {
  LuChevronLeft, LuChevronRight, LuPencil, LuTrash, LuMapPin,
  LuWifi, LuBath, LuSnowflake, LuCar, LuUtensils, LuZap
} from 'react-icons/lu';
import { motion } from 'framer-motion';
import { Annex } from '../../types/annex';

interface MyAdsListProps {
  ads: Annex[];
  onEdit: (ad: Annex) => void;
  onDelete: (adId: string) => void;
}

const AMENITIES_ICONS: Record<string, any> = {
  wifi: LuWifi,
  bath: LuBath,
  ac: LuSnowflake,
  parking: LuCar,
  kitchen: LuUtensils,
  power: LuZap
};

const MyAdsList: React.FC<MyAdsListProps> = ({ ads, onEdit, onDelete }) => {
  const [currentImageIndices, setCurrentImageIndices] = useState<{ [adId: string]: number }>({});

  const handleNextImage = (adId: string, totalImages: number) => {
    setCurrentImageIndices(prev => ({
      ...prev,
      [adId]: ((prev[adId] || 0) + 1) % totalImages
    }));
  };

  const handlePrevImage = (adId: string, totalImages: number) => {
    setCurrentImageIndices(prev => ({
      ...prev,
      [adId]: ((prev[adId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <div className="absolute top-4 left-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/20 dark:border-slate-700/50">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-800 dark:text-slate-200">Approved</span>
          </div>
        );
      case 'Rejected':
        return (
          <div className="absolute top-4 left-4 bg-red-100/90 dark:bg-red-950/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-red-200 dark:border-red-900/50">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-700 dark:text-red-300">Rejected</span>
          </div>
        );
      case 'Pending':
      default:
        return (
          <div className="absolute top-4 left-4 bg-amber-100/90 dark:bg-amber-950/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-amber-200 dark:border-amber-900/50">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>hourglass_empty</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-300">Pending Review</span>
          </div>
        );
    }
  };

  if (ads.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Ads Posted Yet</h3>
        <p className="text-slate-500 dark:text-slate-400">Create your first listing to start reaching students.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {ads.map((ad, index) => {
        const images = Array.isArray(ad.images)
          ? ad.images.map((img: any) => {
              const url = typeof img === 'object' && img !== null ? (img.imageUrl || img.url) : img;
              if (typeof url === 'string') {
                if (url.startsWith('http')) return url;
                return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${url}`;
              }
              return url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800';
            })
          : (ad.images ? [ad.images] : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800']);
        const currentIndex = currentImageIndices[ad.id] || 0;

        return (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group relative h-full bg-white/45 dark:bg-slate-900/45 backdrop-blur-[24px] border border-white/40 dark:border-slate-800 rounded-[2.5rem] p-4 hover:shadow-[0_40px_80px_-20px_rgba(0,63,221,0.12)] transition-all duration-500 flex flex-col"
          >
            {/* Image Section */}
            <div className="relative h-[280px] rounded-[2rem] overflow-hidden mb-6 bg-slate-200 dark:bg-slate-700">
              {images.length > 0 ? (
                <img src={images[currentIndex]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={ad.title} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
              )}

              {/* Status Indicator */}
              {getStatusBadge((ad as any).status || 'Pending')}

              {/* Image Navigation Carousel */}
              {images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); handlePrevImage(ad.id, images.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 shadow-sm border border-white/20 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 z-10"><LuChevronLeft /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleNextImage(ad.id, images.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 shadow-sm border border-white/20 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 z-10"><LuChevronRight /></button>
                </>
              )}

              {/* Price Tag Overlay */}
              <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-blue-800 dark:text-blue-400 shadow-sm border border-white/20 dark:border-slate-700/50">
                Rs. {parseFloat(String(ad.price).replace(/,/g, '')).toLocaleString()} / mo
              </div>
            </div>

            {/* Content Section */}
            <div className="px-3 space-y-4 flex-grow flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight line-clamp-1">
                    {ad.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 mt-1 font-medium line-clamp-1">
                    <LuMapPin className="text-[14px] text-blue-800/60 dark:text-blue-400/60 flex-shrink-0" />
                    {ad.address}
                  </p>
                </div>
              </div>

              {/* Dynamic Amenities Row (only shows selected items) */}
              {ad.features && ad.features.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2 py-4 border-y border-slate-200/50 dark:border-slate-800/50 mt-auto min-h-[50px]">
                  {ad.features.map((feat: any, idx: number) => {
                    const featName = feat.featureName || feat;
                    const lowercaseName = featName.toLowerCase();
                    const matchingAmenity = Object.keys(AMENITIES_ICONS).find(k => lowercaseName.includes(k));
                    const Icon = matchingAmenity ? AMENITIES_ICONS[matchingAmenity] : LuWifi;

                    return (
                      <div key={idx} className="flex items-center gap-1 bg-blue-50/50 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-blue-100/50 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        <Icon className="text-xs text-blue-600 dark:text-blue-400" />
                        {featName}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2 py-4 border-y border-slate-200/50 dark:border-slate-800/50 mt-auto min-h-[50px] text-xs text-slate-400 italic">
                  No amenities specified
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="mt-auto pt-4 flex flex-row gap-3 border-t border-slate-100 dark:border-slate-800/50">
                <button
                  onClick={() => onEdit(ad)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 dark:bg-slate-800/80 hover:bg-blue-800 hover:text-white dark:hover:bg-blue-800 text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-slate-700 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  <LuPencil className="w-4 h-4" /> Edit Ad
                </button>
                <button
                  onClick={() => onDelete(ad.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 dark:bg-red-950/20 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  <LuTrash className="w-4 h-4" /> Delete Ad
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MyAdsList;
