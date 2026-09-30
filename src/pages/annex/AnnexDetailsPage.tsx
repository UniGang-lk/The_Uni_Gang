import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  LuStar, LuWifi, LuBath, LuSnowflake, LuCar, LuUtensils,
  LuZap, LuMessageCircle, LuCircleCheckBig, LuCheck,
  LuShieldCheck, LuHouse, LuUsers, LuBus, LuFootprints,
  LuDroplets, LuLock, LuLightbulb, LuBanknote, LuShare2, LuCalculator,
  LuChevronLeft, LuMapPin, LuGraduationCap, LuPhone, LuCamera,
  LuCalendar, LuBadgePercent, LuInfo, LuHeart
} from 'react-icons/lu';
import SEO from '../../components/SEO';
import VerifiedBadge from '../../components/ui/VerifiedBadge';
import PremiumPageLoader from '../../components/ui/PremiumPageLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Leaflet Map Component
const LeafletDetailMap = ({ propertyLat, propertyLng, uniLat, uniLng, uniName, address }: {
  propertyLat: number; propertyLng: number; uniLat: number; uniLng: number; uniName: string; address: string;
}) => {
  useEffect(() => {
    let map: any;

    function initMap() {
      if (!(window as any).L) return;
      const L = (window as any).L;

      const container = L.DomUtil.get('details-map-canvas');
      if (container != null) {
        container._leaflet_id = null;
      }

      map = L.map('details-map-canvas', { scrollWheelZoom: false }).setView([propertyLat, propertyLng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Property Pin
      const propMarker = L.marker([propertyLat, propertyLng]).addTo(map);
      propMarker.bindPopup(`<b>Property Location</b><br>${address}`).openPopup();

      // Campus Pin
      if (uniLat && uniLng) {
        const campusMarker = L.marker([uniLat, uniLng], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#1e40af; color:white; padding:4px 8px; border-radius:8px; font-weight:bold; font-size:9px; border:2.5px solid white; box-shadow:0 4px 10px rgba(0,0,0,0.15);'>CAMPUS</div>",
            iconSize: [55, 26]
          })
        }).addTo(map);
        campusMarker.bindPopup(`<b>${uniName} Campus Center</b>`);

        L.polyline([[propertyLat, propertyLng], [uniLat, uniLng]], {
          color: '#2563eb',
          dashArray: '6, 8',
          weight: 3.5
        }).addTo(map);
      }
    }

    initMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [propertyLat, propertyLng, uniLat, uniLng, address, uniName]);

  return (
    <div 
      id="details-map-canvas" 
      className="w-full h-[320px] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner z-10"
    />
  );
};

const AnnexDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [annex, setAnnex] = useState<any | null>(null);

  // Gallery and Roommate Calculator States
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [splitRoommates, setSplitRoommates] = useState(2);

  // Review Posting State
  const [overall, setOverall] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [landlord, setLandlord] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);

  // Check initial favorite status from localStorage
  useEffect(() => {
    if (!id) return;
    try {
      const saved = JSON.parse(localStorage.getItem('annex_favorites') || '[]');
      if (Array.isArray(saved) && saved.includes(id)) {
        setIsFavorite(true);
      }
    } catch (e) {
      // ignore
    }
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!id) return;
    try {
      const saved = JSON.parse(localStorage.getItem('annex_favorites') || '[]');
      const safeSaved = Array.isArray(saved) ? saved : [];
      let updated: string[];

      if (safeSaved.includes(id)) {
        updated = safeSaved.filter(item => item !== id);
        setIsFavorite(false);
        toast('Removed from saved list', { icon: '🤍' });
      } else {
        updated = [...safeSaved, id];
        setIsFavorite(true);
        toast.success('Saved to your favorites!');

        // Notify backend / landlord lead tracking
        const token = localStorage.getItem('userToken');
        if (token) {
          fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/annexes/${id}/lead`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ actionType: 'favorite' })
          }).catch(console.error);
        }
      }
      localStorage.setItem('annex_favorites', JSON.stringify(updated));
    } catch (e) {
      console.error('Error toggling favorite:', e);
    }
  };

  const fetchAnnexDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/annexes/${id}`);
      if (!response.ok) {
        toast.error("Accommodation details not found.");
        navigate('/annex-list');
        return;
      }
      const data = await response.json();
      setAnnex(data?.data || data);
    } catch (error) {
      console.error("Failed to load details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchAnnexDetails();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error("Please login to submit feedback.");
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/annexes/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          overallRating: overall,
          cleanlinessRating: cleanliness,
          landlordRating: landlord,
          comment
        })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Feedback submitted! Awaiting approval.");
        setComment("");
        fetchAnnexDetails();
      } else {
        toast.error(data.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Compile review scores
  const calculateAverages = () => {
    if (!annex || !annex.reviews || annex.reviews.length === 0) {
      return { overall: 5, cleanliness: 5, landlord: 5, count: 0 };
    }
    const count = annex.reviews.length;
    const overallSum = annex.reviews.reduce((acc: number, r: any) => acc + (r.overallRating || r.overall_rating || 5), 0);
    const cleanSum = annex.reviews.reduce((acc: number, r: any) => acc + (r.cleanlinessRating || r.cleanliness_rating || 5), 0);
    const lordSum = annex.reviews.reduce((acc: number, r: any) => acc + (r.landlordRating || r.landlord_rating || 5), 0);

    return {
      overall: parseFloat((overallSum / count).toFixed(1)),
      cleanliness: parseFloat((cleanSum / count).toFixed(1)),
      landlord: parseFloat((lordSum / count).toFixed(1)),
      count
    };
  };

  const scores = calculateAverages();

  const AMENITIES_ICONS: Record<string, any> = {
    wifi: LuWifi,
    bath: LuBath,
    ac: LuSnowflake,
    parking: LuCar,
    kitchen: LuUtensils,
    power: LuZap
  };

  const galleryImages = (annex?.images && annex.images.length > 0)
    ? annex.images
    : [{ imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800' }];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24">
      <PremiumPageLoader isLoading={loading} message="Loading Accommodation Details..." />

      <SEO
        title={annex ? `${annex.title} - The Uni Gang Accommodation` : "Accommodation Details - The Uni Gang"}
        description={annex ? `${annex.walk_time_mins || annex.walkTimeMins || 5} mins walk to ${annex.university ? annex.university.name : 'Campus'}. ${annex.address}. Verified Student Accommodation.` : undefined}
        image={annex && annex.images && annex.images[0] ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${annex.images[0].imageUrl}` : undefined}
      />

      {annex && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6"
        >
          {/* Top Bar Navigation (Similar to Proposal Profile Header) */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 shadow-sm">
            <button
              onClick={() => navigate('/annex-list')}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700/80 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700"
            >
              <LuChevronLeft size={16} />
              <span>Back to Listings</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200/80 dark:border-blue-900/60 uppercase tracking-wider">
                ID: #{annex.id ? String(annex.id).slice(0, 8) : 'ANNEX'}
              </span>
              {annex.status === 'Approved' && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/60">
                  <LuShieldCheck size={14} /> Verified Listing
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors border cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-500'
                }`}
                title="Save to Favorites"
              >
                <LuHeart size={14} className={isFavorite ? 'fill-rose-500 text-rose-500' : ''} />
                <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this student accommodation on The Uni Gang: ${annex.title}\n\nhttps://unigang.lk/share/annex/${annex.id}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-colors border border-emerald-200/70"
              >
                <LuShare2 size={14} />
                <span className="hidden sm:inline">Share</span>
              </a>
            </div>
          </div>

          {/* Main 2-Column Balanced Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── LEFT COLUMN (5 Cols): Photo Showcase + Highlights + Rent Splitter ── */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Photo Showcase Card */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
                {/* Main Hero Image */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-800 group">
                  <img
                    src={galleryImages[activeImageIdx]?.imageUrl.startsWith('http')
                      ? galleryImages[activeImageIdx].imageUrl
                      : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${galleryImages[activeImageIdx]?.imageUrl}`}
                    alt={annex.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Rating Tag */}
                  <div className="absolute top-3 left-3 bg-slate-950/75 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 shadow-md">
                    <LuStar className="text-amber-400 fill-amber-400 text-xs" />
                    <span>{scores.overall} ({scores.count} Reviews)</span>
                  </div>

                  {/* Image index count */}
                  <div className="absolute bottom-3 right-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1">
                    <LuCamera size={13} /> {activeImageIdx + 1} / {galleryImages.length}
                  </div>
                </div>

                {/* Thumbnail Switcher Row */}
                {galleryImages.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1 custom-scrollbar">
                    {galleryImages.map((img: any, idx: number) => {
                      const src = img.imageUrl.startsWith('http')
                        ? img.imageUrl
                        : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${img.imageUrl}`;
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIdx(idx)}
                          className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 shadow-xs ${
                            activeImageIdx === idx
                              ? 'border-blue-600 ring-2 ring-blue-500/30 scale-102'
                              : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={src} alt={`thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Price & Primary Attributes Card */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block mb-1">Monthly Rental</span>
                      <span className="text-3xl sm:text-4xl font-black text-blue-700 dark:text-blue-400">
                        Rs. {parseFloat(annex.price || 0).toLocaleString()}
                      </span>
                      <span className="text-sm font-bold text-slate-500 ml-1">/month</span>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Key Money: {annex.key_money_months || annex.keyMoneyMonths || 1} Mo.
                    </span>
                  </div>
                </div>

                {/* Key Quick Info Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs font-bold pt-1">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Accommodation Type</span>
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold flex items-center gap-1.5">
                      <LuHouse size={14} className="text-blue-600" />
                      {annex.listing_type === 'ROOMMATE_WANTED' ? 'Roommate Finder' : 'Boarding / Annex'}
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Walk to Campus</span>
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold flex items-center gap-1.5">
                      <LuFootprints size={14} className="text-emerald-600" />
                      {annex.walk_time_mins || annex.walkTimeMins || 5} Mins
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Bedrooms & Bath</span>
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold">
                      {annex.beds || 1} Beds • {annex.bath || 'Shared Bath'}
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Gender Policy</span>
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold flex items-center gap-1.5">
                      <LuUsers size={14} className="text-pink-600" />
                      {annex.gender_policy === 'GIRLS_ONLY' ? 'Girls Only' : annex.gender_policy === 'BOYS_ONLY' ? 'Boys Only' : 'Any Student'}
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="pt-2 space-y-2.5">
                  <button
                    type="button"
                    onClick={async () => {
                      const token = localStorage.getItem('userToken');
                      if (!token) {
                        toast.error('Please login to send an inquiry.');
                        return;
                      }
                      try {
                        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/annexes/chats/start`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            annexId: annex.id,
                            initialMessage: `Hi! I saw your Annex listing "${annex.title}" on The Uni Gang. Is it available?`
                          })
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.message || 'Failed to start chat');

                        toast.success('Inquiry sent! Redirecting to your Messages Hub...');
                        navigate(`/profile?tab=annex_inbox&chatId=${data.chat.id}`);
                      } catch (err: any) {
                        toast.error(err.message || 'Failed to send inquiry.');
                      }
                    }}
                    className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                  >
                    <LuMessageCircle size={18} />
                    <span>Send Inquiry to Landlord</span>
                  </button>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this student accommodation on The Uni Gang: ${annex.title}\n\nhttps://unigang.lk/share/annex/${annex.id}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 px-6 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                  >
                    <LuShare2 size={16} />
                    <span>Share on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Interactive Rent & Bill Splitter Widget */}
              <div className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60 dark:from-slate-900 dark:to-slate-800/60 p-6 rounded-[2rem] border border-blue-200/70 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                      <LuCalculator className="text-sm shrink-0" /> Roommate Rent Splitter
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      Calculate your individual share if sharing with batchmates
                    </p>
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 bg-blue-600 text-white rounded-full shadow-xs">
                    {splitRoommates} Students
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-500">1</span>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={splitRoommates}
                    onChange={(e) => setSplitRoommates(parseInt(e.target.value))}
                    className="flex-grow h-2 bg-blue-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-xs font-bold text-slate-500">6</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-200/50 dark:border-slate-700">
                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Pure Rent Share</span>
                    <span className="text-lg font-black text-blue-700 dark:text-blue-400">
                      Rs. {Math.round(parseFloat(annex.price || 0) / splitRoommates).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 block">/student/month</span>
                  </div>
                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Est. with Utilities</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      Rs. {(Math.round(parseFloat(annex.price || 0) / splitRoommates) + 2500).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 block">incl. ~Rs.2,500 CEB/Water</span>
                  </div>
                </div>
              </div>

              {/* Landlord Contact Box */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm bg-slate-100"
                    alt="avatar"
                    src={annex.owner?.profile_pic || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Owner'}
                  />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Property Provider</span>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{annex.owner?.name || 'Verified Landlord'}</p>
                      {annex.owner && (annex.owner.is_verified_landlord || annex.owner.is_verified_student) && (
                        <VerifiedBadge size={16} title="Verified Provider" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <LuPhone size={14} className="text-blue-600" />
                  <span>Direct Booking</span>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN (7 Cols): Title, Amenities, Description, Location Map, Reviews ── */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Title & Proximity Banner */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {annex.listing_type === 'ROOMMATE_WANTED' ? 'Roommate Finder' : 'Private Boarding'}
                  </span>
                  {annex.landlord_presence === 'INDEPENDENT' || annex.landlordPresence === 'INDEPENDENT' ? (
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
                      Independent / No Owner Disturbance
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-100 text-amber-700 border border-amber-200">
                      On-site Landlord Family
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                  {annex.title}
                </h1>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <LuMapPin size={15} className="text-blue-600 shrink-0" />
                    {annex.address}
                  </span>
                  {annex.university?.name && (
                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-bold text-slate-700 dark:text-slate-300">
                      <LuGraduationCap size={15} className="text-indigo-600 shrink-0" />
                      {annex.university.name}
                    </span>
                  )}
                  {annex.distance_to_uni && (
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      📍 ~{annex.distance_to_uni} km from main gate
                    </span>
                  )}
                </div>

                {/* About Annex Description */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Accommodation Description & Rules</h3>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                    {annex.description || 'Spacious, clean, and highly secure student boarding place available close to campus. Contact landlord for inspection.'}
                  </div>
                </div>
              </div>

              {/* Key Features & Amenities Grid */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <LuCircleCheckBig className="text-blue-600" /> Key Amenities & Facilities
                </h3>

                {annex.features && annex.features.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {annex.features.map((feat: any, idx: number) => {
                      const featName = feat.featureName || feat.feature_name || '';
                      const lowercaseName = featName.toLowerCase();
                      const matchingAmenity = Object.keys(AMENITIES_ICONS).find(k => lowercaseName.includes(k));
                      const Icon = matchingAmenity ? AMENITIES_ICONS[matchingAmenity] : LuCircleCheckBig;

                      return (
                        <div
                          key={idx}
                          className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl flex items-center gap-3 border border-slate-100 dark:border-slate-800 shadow-xs hover:border-blue-200 transition-colors"
                        >
                          <Icon className="text-blue-600 text-xl shrink-0" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{featName}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No specific amenity tags listed.</p>
                )}

                {/* Sri Lanka Specific Utility Checklist */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Student Living Specifications</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-bold">
                    <div className={`p-3 rounded-xl border flex items-center gap-2 ${annex.has_power_backup || annex.hasPowerBackup ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200 line-through'}`}>
                      <LuZap size={15} /> Power Generator/UPS
                    </div>
                    <div className={`p-3 rounded-xl border flex items-center gap-2 ${(annex.has_water_tank !== false && annex.hasWaterTank !== false) ? 'bg-cyan-50 text-cyan-800 border-cyan-200' : 'bg-slate-50 text-slate-400 border-slate-200 line-through'}`}>
                      <LuDroplets size={15} /> 24h Water Storage
                    </div>
                    <div className={`p-3 rounded-xl border flex items-center gap-2 ${(annex.is_cooking_allowed !== false && annex.isCookingAllowed !== false) ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200 line-through'}`}>
                      <LuUtensils size={15} /> Cooking Permitted
                    </div>
                    <div className={`p-3 rounded-xl border flex items-center gap-2 ${annex.has_separate_entrance || annex.hasSeparateEntrance ? 'bg-indigo-50 text-indigo-800 border-indigo-200' : 'bg-slate-50 text-slate-400 border-slate-200 line-through'}`}>
                      <LuLock size={15} /> Separate Entrance
                    </div>
                    <div className={`p-3 rounded-xl border flex items-center gap-2 ${annex.has_separate_meter || annex.hasSeparateMeter ? 'bg-purple-50 text-purple-800 border-purple-200' : 'bg-slate-50 text-slate-400 border-slate-200 line-through'}`}>
                      <LuLightbulb size={15} /> Separate Electric Meter
                    </div>
                    {annex.bus_route || annex.busRoute ? (
                      <div className="p-3 rounded-xl border bg-blue-50 text-blue-800 border-blue-200 flex items-center gap-2 truncate">
                        <LuBus size={15} /> Route: {annex.bus_route || annex.busRoute}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl border bg-slate-50 text-slate-700 border-slate-200 flex items-center gap-2">
                        <LuFootprints size={15} /> Direct Walking Route
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Campus Proximity & Interactive Map */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <LuMapPin className="text-blue-600" /> Location & Campus Route
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    {annex.address}
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl">
                  <LeafletDetailMap
                    propertyLat={parseFloat(annex.latitude || 6.796345)}
                    propertyLng={parseFloat(annex.longitude || 79.897256)}
                    uniLat={annex.university ? parseFloat(annex.university.latitude) : 6.7969}
                    uniLng={annex.university ? parseFloat(annex.university.longitude) : 79.9018}
                    uniName={annex.university ? annex.university.name : 'University'}
                    address={annex.address}
                  />
                </div>
              </div>

              {/* Student Reviews & Ratings Section */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Student Feedback & Reviews</h3>
                    <p className="text-xs text-slate-500 font-medium">Ratings submitted by university students who resided here</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-black text-base bg-amber-50 dark:bg-amber-950/60 px-3.5 py-1.5 rounded-full border border-amber-200/80 dark:border-amber-800">
                    <LuStar className="fill-amber-400" />
                    <span>{scores.overall} / 5</span>
                  </div>
                </div>

                {/* Score breakdown metrics */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Room Quality</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">⭐ {scores.overall}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Cleanliness</span>
                    <span className="text-lg font-black text-teal-600 dark:text-teal-400">⭐ {scores.cleanliness}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Landlord Safety</span>
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">⭐ {scores.landlord}</span>
                  </div>
                </div>

                {/* Existing Reviews List */}
                {annex.reviews && annex.reviews.length > 0 ? (
                  <div className="space-y-3">
                    {annex.reviews.map((rev: any, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-900 dark:text-white">{rev.user?.name || 'Verified Student'}</span>
                          <span className="text-[11px] text-slate-400">{new Date(rev.createdAt || rev.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-400 font-medium">
                    No student reviews posted yet. Be the first to share your experience!
                  </div>
                )}

                {/* Submit Feedback Form */}
                <form onSubmit={handleReviewSubmit} className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Leave a Student Review</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Overall Quality</label>
                      <select
                        value={overall}
                        onChange={(e) => setOverall(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                      >
                        {[5, 4, 3, 2, 1].map((val) => (
                          <option key={val} value={val}>{val} Stars</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Cleanliness</label>
                      <select
                        value={cleanliness}
                        onChange={(e) => setCleanliness(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                      >
                        {[5, 4, 3, 2, 1].map((val) => (
                          <option key={val} value={val}>{val} Stars</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Landlord Safety</label>
                      <select
                        value={landlord}
                        onChange={(e) => setLandlord(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                      >
                        {[5, 4, 3, 2, 1].map((val) => (
                          <option key={val} value={val}>{val} Stars</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Your Honest Feedback</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share details about room condition, study environment, and landlord safety..."
                      rows={3}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-medium"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="py-3 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Student Review'}
                  </button>
                </form>
              </div>

            </div>

          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnnexDetailsPage;
