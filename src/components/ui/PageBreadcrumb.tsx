import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuShare2, LuHouse, LuChevronRight } from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

export interface BreadcrumbItem {
  label: string;
  to?: string;
  active?: boolean;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
  backTo?: string;
  backLabel?: string;
  shareTitle?: string;
  shareUrl?: string;
  rightSlot?: React.ReactNode;
  className?: string;
}

export const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({
  items,
  backTo,
  backLabel = 'Back',
  shareTitle,
  shareUrl,
  rightSlot,
  className = ''
}) => {
  const navigate = useNavigate();
  const currentUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');

  const handleShare = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 mb-6 pt-2 pb-4 border-b border-slate-200/80 dark:border-slate-800 ${className}`}>
      {/* High-Contrast Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs md:text-sm flex-wrap" aria-label="Breadcrumb">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <LuHouse className="w-3.5 h-3.5 text-blue-500" /> Home
        </Link>

        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <LuChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 select-none shrink-0" />
            
            {item.to && !item.active ? (
              <Link 
                to={item.to} 
                className="font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span 
                className={`font-black tracking-wide capitalize truncate max-w-xs sm:max-w-md ${
                  item.active 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-slate-900 dark:text-white font-bold'
                }`}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Action Buttons Right */}
      <div className="flex items-center gap-2">
        {rightSlot}

        {backTo ? (
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 transition-all shadow-xs"
          >
            <LuArrowLeft className="w-3.5 h-3.5" /> {backLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 transition-all shadow-xs cursor-pointer"
          >
            <LuArrowLeft className="w-3.5 h-3.5" /> {backLabel}
          </button>
        )}

        <button
          type="button"
          onClick={handleShare}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-300 transition-all shadow-xs cursor-pointer"
          title="Copy link"
        >
          <LuShare2 className="w-3.5 h-3.5" />
        </button>

        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent((shareTitle ? shareTitle + '\n\n' : '') + currentUrl)}`}
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-all shadow-xs"
          title="Share on WhatsApp"
        >
          <FaWhatsapp className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default PageBreadcrumb;
