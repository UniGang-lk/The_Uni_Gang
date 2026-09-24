import { useParams, useNavigate } from 'react-router-dom';
import {
  LuStar, LuBadgeCheck, LuWifi, LuBath, LuSnowflake, LuCar, LuUtensils,
  LuZap, LuMessageCircle, LuX, LuCircleCheckBig, LuCheck,
  LuShieldCheck, LuHouse, LuClock, LuUsers, LuBus, LuFootprints,
  LuDroplets, LuLock, LuLightbulb, LuBanknote, LuShare2, LuCalculator, LuMapPin
} from 'react-icons/lu';
import SEO from '../../components/SEO';
import VerifiedBadge from '../../components/ui/VerifiedBadge';
import PremiumPageLoader from '../../components/ui/PremiumPageLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdSidebarWidget from '../../components/advertise/AdSidebarWidget';

// Dynamic Leaflet Map connecting campus center and property pin
const LeafletDetailMap = ({ propertyLat, propertyLng, uniLat, uniLng, uniName, address }: {
  propertyLat: number, propertyLng: number, uniLat: number, uniLng: number, uniName: string, address: string
}) => {
  useEffect(() => {
    let map: any;

    function initMap() {
      if (!(window as any).L) return;
      const L = (window as any).L;
      
      const container = L.DomUtil.get('details-map-canvas');
      if (container != null) {
        container._leaflet_id = null; // Prevent dual render canvas warnings
      }

      map = L.map('details-map-canvas').setView([propertyLat, propertyLng], 15);

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
            html: "<div style='background-color:#1e40af; color:white; padding:4px 8px; border-radius:8px; font-weight:bold; font-size:9px; border:2.5px solid white;'>CAMPUS</div>",
            iconSize: [50, 25]
          })
        }).addTo(map);
        campusMarker.bindPopup(`<b>${uniName} Campus Center</b>`);

        // Draw dotted walk path connecting both
        L.polyline([[propertyLat, propertyLng], [uniLat, uniLng]], {
          color: '#3b82f6',
          dashArray: '5, 8',
          weight: 3
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
      className="w-full h-[320px] rounded-[1.8rem] border border-white/40 dark:border-slate-800"
    />
  );
};

const AnnexDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [annex, setAnnex] = useState<any | null>(null);

  // Image swap & roommate calculator states
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [splitRoommates, setSplitRoommates] = useState(2);

  // Review posting states
  const [overall, setOverall] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [landlord, setLandlord] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchAnnexDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/annexes/${id}`);
      if (!response.ok) {
        toast.error("Accommodation details not found.");
        navigate('/annexes');
        return;
      }
      const data = await response.json();
      setAnnex(data);
    } catch (error) {
      console.error("Failed to load details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    fetchAnnexDetails();
    
    return () => {
      document.body.style.overflow = 'auto';
    };
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

  // Compile split progress averages
  const calculateAverages = () => {
    if (!annex || !annex.reviews || annex.reviews.length === 0) {
      return { overall: 5, cleanliness: 5, landlord: 5, count: 0 };
    }
    const count = annex.reviews.length;
    const overallSum = annex.reviews.reduce((acc: number, r: any) => acc + r.overallRating, 0);
    const cleanSum = annex.reviews.reduce((acc: number, r: any) => acc + r.cleanlinessRating, 0);
    const lordSum = annex.reviews.reduce((acc: number, r: any) => acc + r.landlordRating, 0);

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 font-sans">
      <PremiumPageLoader isLoading={loading} message="Polishing details..." />

      <SEO
        title={annex ? `${annex.title} - Annex details` : "Loading details..."}
        description={annex ? `${annex.walkTimeMins || 5} mins walk to ${annex.university ? annex.university.name : 'Campus'}. ${annex.address}. Verified Student Accommodation.` : undefined}
        image={annex && annex.images && annex.images[0] ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${annex.images[0].imageUrl}` : undefined}
        schemaData={annex ? {
          "@context": "https://schema.org",
          "@type": "Accommodation",
          "name": annex.title,
          "description": annex.address,
          "image": annex.images && annex.images[0] ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${annex.images[0].imageUrl}` : undefined,
          "offers": {
            "@type": "Offer",
            "price": annex.price,
            "priceCurrency": "LKR",
            "availability": "https://schema.org/InStock"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": annex.university ? annex.university.name : "Sri Lanka",
            "addressCountry": "LK"
          }
        } : undefined}
      />

      <AnimatePresence>
        {!loading && annex && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="contents"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md cursor-pointer"
              onClick={() => navigate(-1)}
            ></div>

            {/* Main Modal */}
            <main className="relative z-10 w-full max-w-6xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,63,221,0.12)] border border-white/50 dark:border-slate-700/50 overflow-hidden flex flex-col md:flex-row h-[90vh] md:max-h-[850px] animate-in fade-in zoom-in duration-300">

              {/* Close Button */}
              <button
                onClick={() => navigate(-1)}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 shadow-sm border border-white/40 dark:border-slate-600 transition-all z-50 hover:scale-105 active:scale-95 text-xl"
              >
                <LuX />
              </button>

              {/* Left Column: Image Gallery */}
              <section className="w-full md:w-[45%] p-6 md:p-10 flex flex-col gap-6 bg-white/30 dark:bg-slate-950/30 overflow-y-auto custom-scrollbar md:overflow-hidden">
                <div className="relative group rounded-[2rem] overflow-hidden aspect-[4/5] shadow-xl bg-slate-100">
                  <img
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    src={annex.images && annex.images.length > 0 
                      ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${annex.images[Math.min(activeImageIdx, annex.images.length - 1)].imageUrl}` 
                      : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800"}
                    alt={annex.title}
                  />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold tracking-wider text-blue-800 dark:text-blue-400 shadow-sm flex items-center gap-1.5 border border-white/20">
                      <LuStar className="text-sm fill-blue-500 text-blue-500" />
                      ⭐ {scores.overall} ({scores.count} Reviews)
                    </span>
                  </div>
                </div>

                {/* Sub Images / Thumbnails */}
                {annex.images && annex.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {annex.images.map((img: any, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all shadow-md border-2 ${
                          activeImageIdx === idx ? 'border-blue-600 ring-2 ring-blue-500/30 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img className="w-full h-full object-cover" src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${img.imageUrl}`} alt={`thumbnail ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Right Column: Dynamic Data details */}
              <section className="w-full md:w-[55%] p-6 md:p-10 overflow-y-auto flex flex-col gap-8 custom-scrollbar">

                {/* Listing Details */}
                <div className="space-y-4 pt-5 md:pt-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{annex.title}</h1>
                    <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-200 dark:border-blue-800/50">
                      <LuBadgeCheck className="text-base fill-blue-500 text-white dark:text-slate-900" />
                      {annex.status}
                    </span>
                    {annex.listing_type === 'ROOMMATE_WANTED' ? (
                      <span className="inline-flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-200 dark:border-indigo-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                        Roommate Wanted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Landlord Annex
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-blue-800 dark:text-blue-400">Rs. {parseFloat(annex.price).toLocaleString()}</span>
                      <span className="text-lg font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">/mo</span>
                    </div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
                      {annex.beds} Beds • {annex.bath || "Shared Bath"}
                    </p>
                  </div>

                  {/* Interactive Rent & Bill Splitter Widget (Roommate Calculator) */}
                  <div className="p-5 rounded-3xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-200/60 dark:border-slate-700 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                          <LuCalculator className="text-sm shrink-0" /> Rent & Bill Splitter Calculator
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          Estimate per-student cost when sharing this annex
                        </p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 bg-blue-600 text-white rounded-full">
                        {splitRoommates} Roommates
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">1</span>
                      <input
                        type="range"
                        min="1"
                        max="6"
                        value={splitRoommates}
                        onChange={(e) => setSplitRoommates(parseInt(e.target.value))}
                        className="flex-grow h-2 bg-blue-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">6</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-200/40 dark:border-slate-700/60">
                      <div className="p-3 bg-white/70 dark:bg-slate-900/60 rounded-2xl">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Rent Share</span>
                        <span className="text-lg font-black text-blue-800 dark:text-blue-400">
                          Rs. {Math.round(parseFloat(annex.price || 0) / splitRoommates).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500 block">/student/mo</span>
                      </div>
                      <div className="p-3 bg-white/70 dark:bg-slate-900/60 rounded-2xl">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Total Share (Est. CEB/Water)</span>
                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                          Rs. {(Math.round(parseFloat(annex.price || 0) / splitRoommates) + 2500).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500 block">incl. ~Rs.2,500 bills</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities Row */}
                {annex.features && annex.features.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Key Amenities</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                      {annex.features.map((feat: any, idx: number) => {
                        const lowercaseName = feat.featureName.toLowerCase();
                        const matchingAmenity = Object.keys(AMENITIES_ICONS).find(k => lowercaseName.includes(k));
                        const Icon = matchingAmenity ? AMENITIES_ICONS[matchingAmenity] : LuCircleCheckBig;

                        return (
                          <div key={idx} className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl flex flex-col gap-3 items-start border border-white/60 dark:border-slate-700 shadow-sm transition-all hover:-translate-y-1 hover:bg-white dark:hover:bg-slate-800/80">
                            <Icon className="text-blue-700 dark:text-blue-400 text-2xl" />
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{feat.featureName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Location Map */}
                <div className="space-y-4">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    Location proximity: {annex.distanceToUni ? `${annex.distanceToUni} km to campus` : ''}
                  </h2>
                  <div className="p-1 rounded-[2rem] border border-white/40 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40">
                    <LeafletDetailMap
                      propertyLat={parseFloat(annex.latitude)}
                      propertyLng={parseFloat(annex.longitude)}
                      uniLat={annex.university ? parseFloat(annex.university.latitude) : 0}
                      uniLng={annex.university ? parseFloat(annex.university.longitude) : 0}
                      uniName={annex.university ? annex.university.name : "Campus"}
                      address={annex.address}
                    />
                  </div>
                </div>

                {/* Reviews Split metrics display */}
                <div className="space-y-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-8">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Student Reviews</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/30 dark:bg-slate-800/30 p-5 rounded-2xl border border-white/30">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Housing Quality</p>
                      <p className="text-xl font-black text-slate-800 dark:text-white">⭐ {scores.overall} / 5</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Cleanliness</p>
                      <p className="text-xl font-black text-teal-600 dark:text-teal-400">⭐ {scores.cleanliness} / 5</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Landlord Safety</p>
                      <p className="text-xl font-black text-blue-600 dark:text-blue-400">⭐ {scores.landlord} / 5</p>
                    </div>
                  </div>

                  {/* Scrollable list of reviews */}
                  {annex.reviews && annex.reviews.length > 0 ? (
                    <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                      {annex.reviews.map((rev: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/50 border-slate-200/50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-sm text-slate-800 dark:text-white">{rev.user ? rev.user.name : "Verified Student"}</span>
                            <span className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No verified student reviews yet.</p>
                  )}

                  {/* Add review form */}
                  {localStorage.getItem('userToken') && (
                    <form onSubmit={handleReviewSubmit} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                      <h3 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Share Your Housing Experience</h3>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Quality</label>
                          <select value={overall} onChange={(e) => setOverall(Number(e.target.value))} className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Cleanliness</label>
                          <select value={cleanliness} onChange={(e) => setCleanliness(Number(e.target.value))} className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Landlord</label>
                          <select value={landlord} onChange={(e) => setLandlord(Number(e.target.value))} className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                          </select>
                        </div>
                      </div>

                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your constructive feedback here..."
                        required
                        className="w-full p-4 text-xs rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-0 outline-none text-slate-900 dark:text-white font-medium"
                        rows={3}
                      />

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-full text-xs transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                      >
                        {submittingReview ? "Submitting..." : "Post Review"} <LuCheck />
                      </button>
                    </form>
                  )}
                </div>

                {/* Ad Placement */}
                <div className="flex justify-center border-t border-slate-200/50 dark:border-slate-700/50 pt-8 w-full">
                  <AdSidebarWidget />
                </div>

                {/* SL Utilities & Specific Amenities Checklist */}
                <div className="space-y-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-6">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Sri Lanka Student Utilities</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className={`p-3.5 rounded-2xl flex items-center gap-2.5 border text-xs font-bold ${annex.landlordPresence === 'ON_SITE' ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'}`}>
                      {annex.landlordPresence === 'ON_SITE' ? <LuShieldCheck size={16} className="shrink-0" /> : <LuHouse size={16} className="shrink-0" />} {annex.landlordPresence === 'ON_SITE' ? 'Landlord Lives On-Site' : 'Independent (No Landlord on-site)'}
                    </div>
                    {annex.curfewTime && (
                      <div className="p-3.5 rounded-2xl flex items-center gap-2.5 border text-xs font-bold bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-400">
                        <LuClock size={16} className="shrink-0" /> Gate Rules: {annex.curfewTime}
                      </div>
                    )}
                    {annex.visitorPolicy && (
                      <div className="p-3.5 rounded-2xl flex items-center gap-2.5 border text-xs font-bold bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-400">
                        <LuUsers size={16} className="shrink-0" /> Visitors: {annex.visitorPolicy}
                      </div>
                    )}
                    {annex.busRoute && (
                      <div className="p-3.5 rounded-2xl flex items-center gap-2.5 border text-xs font-bold bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400 col-span-2 lg:col-span-3">
                        <LuBus size={16} className="shrink-0" /> Transit: {annex.busRoute}
                      </div>
                    )}
                    <div className={`p-3.5 rounded-2xl flex items-center gap-2.5 border text-xs font-bold ${annex.walkTimeMins ? 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                      <LuFootprints size={16} className="shrink-0" /> {annex.walkTimeMins || 5} mins walk to gate
                    </div>
                    <div className={`p-3.5 rounded-2xl flex items-center gap-2.5 border text-xs font-bold ${annex.hasPowerBackup ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 line-through'}`}>
                      <LuZap size={16} className="shrink-0" /> Inverter / Generator
                    </div>
                    <div className={`p-3.5 rounded-2xl flex items-center gap-2.5 border text-xs font-bold ${annex.hasWaterTank !== false ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-700 dark:text-cyan-400' : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 line-through'}`}>
                      <LuDroplets size={16} className="shrink-0" /> 24h Water Storage Tank
                    </div>
                    <div className={`p-3.5 rounded-2xl flex items-center gap-2.5 border text-xs font-bold ${annex.isCookingAllowed !== false ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 line-through'}`}>
                      <LuUtensils size={16} className="shrink-0" /> Cooking Facilities Allowed
                    </div>
                    <div className={`p-3.5 rounded-2xl flex items-center gap-2.5 border text-xs font-bold ${annex.hasSeparateEntrance ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 line-through'}`}>
                      <LuLock size={16} className="shrink-0" /> Separate Entrance & Keys
                    </div>
                    <div className={`p-3.5 rounded-2xl flex items-center gap-2.5 border text-xs font-bold ${annex.hasSeparateMeter ? 'bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-400' : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 line-through'}`}>
                      <LuLightbulb size={16} className="shrink-0" /> Separate Electricity Meter
                    </div>
                    <div className="p-3.5 rounded-2xl flex items-center gap-2.5 border text-xs font-bold bg-pink-500/10 border-pink-500/20 text-pink-700 dark:text-pink-400">
                      <LuUsers size={16} className="shrink-0" /> {annex.genderPolicy === 'GIRLS_ONLY' ? 'Girls Only' : annex.genderPolicy === 'BOYS_ONLY' ? 'Boys Only' : 'Any Student'}
                    </div>
                    <div className="p-3.5 rounded-2xl flex items-center gap-2.5 border text-xs font-bold bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                      <LuBanknote size={16} className="shrink-0" /> Key Money: {annex.keyMoneyMonths || 1} Month(s)
                    </div>
                  </div>
                </div>

                {/* Footer Sticky Contact & In-App Inquiry Chat */}
                <div className="mt-auto pt-8 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-6 pb-6 md:pb-0">
                  <div className="flex items-center gap-4">
                    <img
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm bg-slate-100"
                      alt="avatar"
                      src={annex.owner && annex.owner.profile_pic 
                        ? annex.owner.profile_pic 
                        : "https://api.dicebear.com/7.x/avataaars/svg?seed=Owner"}
                    />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Listed by</p>
                      <div className="flex items-center gap-1">
                        <p className="text-base font-bold text-slate-900 dark:text-white">{annex.owner ? annex.owner.name : "Mr. Landlord"}</p>
                        {annex.owner && (annex.owner.is_verified_landlord || annex.owner.is_verified_student) && (
                          <VerifiedBadge size={18} title="Verified Provider" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
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
                              'Authorization': `Bearer ${token}`
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
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-full font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 text-sm cursor-pointer border-none"
                    >
                      <LuMessageCircle className="text-xl shrink-0" /> Send Inquiry
                    </button>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this student accommodation on The Uni Gang: ${annex.title}\n\nhttps://unigang.lk/share/annex/${annex.id}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3.5 rounded-full font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 text-sm cursor-pointer border-none decoration-none whitespace-nowrap"
                    >
                      <LuShare2 className="text-lg shrink-0" /> Share Link
                    </a>
                  </div>
                </div>
              </section>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnnexDetailsPage;
