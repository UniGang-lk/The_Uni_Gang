import React, { useState, useEffect } from 'react';
import {
  LuSearch,
  LuX,
  LuEye,
  LuMousePointer,
  LuCalendar,
  LuClock,
  LuTriangleAlert,
  LuSparkles,
  LuMessageCircle,
  LuBuilding,
  LuTrendingUp,
  LuCopy,
  LuCheck,
  LuExternalLink,
} from 'react-icons/lu';
import { api } from '../../../api';

interface AdTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const AdTrackModal: React.FC<AdTrackModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Check local storage for recent submitted ad ID
      const recentAdId = localStorage.getItem('last_submitted_ad_id');
      const initialSearch = initialQuery || recentAdId || '';
      if (initialSearch) {
        setQuery(initialSearch);
        handleSearch(initialSearch);
      }
    } else {
      setResults([]);
      setError(null);
      setSearched(false);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = async (searchTerm?: string) => {
    const term = (searchTerm !== undefined ? searchTerm : query).trim();
    if (!term) {
      setError('Please enter your Ad ID or Contact Email.');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);
    setResults([]);

    try {
      if (term.includes('@')) {
        const ads = await api.trackAdsByEmail(term);
        setResults(ads);
      } else {
        const ad = await api.trackAdById(term);
        setResults([ad]);
      }
    } catch (err: any) {
      setError(err.message || 'No matching ad campaign found. Please check your Ad ID or Email.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20">
              <LuTrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Track Ad Campaign Performance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your Ad ID or Contact Email to view live status, views & clicks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Search Controls */}
        <div className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ad ID (e.g. ad_9381...) or your email address"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm shadow-md shadow-cyan-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Track Status'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
              <LuTriangleAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Campaign Results */}
          <div className="mt-6 max-h-[50vh] overflow-y-auto space-y-4 pr-1">
            {searched && !loading && results.length === 0 && !error && (
              <div className="text-center py-10">
                <LuSparkles className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No campaigns found
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  If you recently submitted an ad, review process takes 1-2 hours. You can also chat with support on WhatsApp.
                </p>
              </div>
            )}

            {results.map((ad) => {
              const ctr = ad.views ? ((ad.clicks / ad.views) * 100).toFixed(1) : '0.0';
              const status = (ad.status || ad.Status || '').toUpperCase();
              const isApproved = status === 'ACTIVE' || status === 'APPROVED';
              const isPending = status === 'PENDING';
              const isPaused = status === 'PAUSED';
              const isRejected = status === 'REJECTED';
              const isExpired = status === 'EXPIRED';
              const targetLink = ad.target_link || ad.TargetLink;

              const rawImg = ad.image_url || ad.ImageURL;
              const imgSrc = rawImg
                ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`)
                : null;

              return (
                <div
                  key={ad.id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-cyan-500/50 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {imgSrc && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                          <img
                            src={imgSrc}
                            alt={ad.ad_title || 'Creative'}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {(() => {
                            const adIdStr = String(ad.id || '');
                            return (
                              <>
                                <span
                                  className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-800"
                                  title={`Full System ID: ${adIdStr}`}
                                >
                                  AD-{adIdStr.length > 8 ? adIdStr.slice(0, 8).toUpperCase() : adIdStr}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(adIdStr);
                                    setCopiedId(adIdStr);
                                    setTimeout(() => setCopiedId(null), 2000);
                                  }}
                                  className="p-1 rounded text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950 transition-colors cursor-pointer"
                                  title="Copy full tracking ID"
                                >
                                  {copiedId === adIdStr ? (
                                    <LuCheck className="w-3.5 h-3.5 text-emerald-500" />
                                  ) : (
                                    <LuCopy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </>
                            );
                          })()}
                          <span className="text-xs text-slate-400">
                            • {new Date(ad.createdAt || ad.CreatedAt || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          {ad.ad_title || ad.AdTitle || ad.company_name || 'Campaign'}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <LuBuilding className="w-3.5 h-3.5" />
                            {ad.company_name || ad.CompanyName}
                          </span>
                          <span>•</span>
                          <span className="font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px] bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
                            {ad.placement_type || ad.PlacementType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="self-start">
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          LIVE & ACTIVE
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          <LuClock className="w-3.5 h-3.5" />
                          UNDER REVIEW
                        </span>
                      ) : isPaused ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
                          <LuClock className="w-3.5 h-3.5" />
                          PAUSED
                        </span>
                      ) : isRejected ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-800">
                          REJECTED
                        </span>
                      ) : isExpired ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          EXPIRED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {status || 'UNKNOWN'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
                        <LuEye className="w-3.5 h-3.5 text-cyan-500" /> Views
                      </div>
                      <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                        {(ad.views || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
                        <LuMousePointer className="w-3.5 h-3.5 text-indigo-500" /> Clicks
                      </div>
                      <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                        {(ad.clicks || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
                        <LuTrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Avg CTR
                      </div>
                      <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {ctr}%
                      </p>
                    </div>
                  </div>

                  {/* Details Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                    <div className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <LuCalendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Duration: {ad.duration_days || ad.DurationDays || 7} Days</span>
                      </div>
                      {(ad.end_date || ad.EndDate) && (
                        <span>
                          (Ends: {new Date(ad.end_date || ad.EndDate).toLocaleDateString()})
                        </span>
                      )}
                      {targetLink && !targetLink.toLowerCase().startsWith('javascript:') && !targetLink.toLowerCase().startsWith('data:') && (
                        <>
                          <span>•</span>
                          <a
                            href={targetLink.startsWith('http') ? targetLink : `https://${targetLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-semibold hover:underline truncate max-w-[160px]"
                            title={targetLink}
                          >
                            <LuExternalLink className="w-3 h-3 flex-shrink-0" />
                            {targetLink.replace(/^https?:\/\//, '')}
                          </a>
                        </>
                      )}
                    </div>
                    
                    <a
                      href={`https://wa.me/94724478148?text=${encodeURIComponent(`Hi UniGang! I am checking status for Ad ID: ${ad.id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 font-semibold"
                    >
                      <LuMessageCircle className="w-4 h-4" />
                      WhatsApp Ad Desk
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Need custom reporting or instant ad launch? Contact us on WhatsApp at{' '}
            <a
              href="https://wa.me/94724478148"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
            >
              072 447 8148
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
