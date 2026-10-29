import React, { useState, useEffect, useRef } from "react";
import {
    LuArrowRight, LuGraduationCap, LuSearch, LuArrowLeft, LuPlus,
    LuHeart, LuMapPin, LuBedDouble, LuMap, LuHouse, LuShieldCheck,
    LuBus, LuFootprints, LuZap, LuDroplets, LuUtensils, LuChevronDown, LuX
} from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import universitiesData from "../../constants/annex/Universities.json";
import PremiumPageLoader from "../../components/ui/PremiumPageLoader";
import PageBreadcrumb from "../../components/ui/PageBreadcrumb";
import AdNativeFeed from "../../components/advertise/AdNativeFeed";
import SEO from "../../components/SEO";
import VerifiedBadge from "../../components/ui/VerifiedBadge";

const escapeHtml = (str: string) => {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

// Dynamic Leaflet map rendering component with Proximity Radius Circle overlay
const LeafletListMap = ({ items, centerUniId, maxDistance }: { items: any[], centerUniId: string, maxDistance: string }) => {
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        let map: any;
        let retryTimer: any;

        function initMap() {
            if (!(window as any).L) {
                // Retry if Leaflet script is still fetching
                retryTimer = setTimeout(initMap, 200);
                return;
            }
            setMapReady(true);
            const L = (window as any).L;
            
            const container = L.DomUtil.get('list-map-canvas');
            if (container != null) {
                container._leaflet_id = null; // Prevent dual rendering errors
            }

            // Default center: Moratuwa University
            let centerLat = 6.7969;
            let centerLng = 79.9018;
            let selectedUniName = "Campus";

            if (centerUniId && centerUniId !== "All Universities") {
                const foundUni = universitiesData.find(u => String(u.id) === String(centerUniId));
                if (foundUni && foundUni.latitude && foundUni.longitude) {
                    centerLat = foundUni.latitude;
                    centerLng = foundUni.longitude;
                    selectedUniName = foundUni.name;
                }
            }

            map = L.map('list-map-canvas').setView([centerLat, centerLng], 14);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // 1. Seed University Center Marker
            if (centerUniId && centerUniId !== "All Universities") {
                L.marker([centerLat, centerLng], {
                    icon: L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div style='background: linear-gradient(135deg, #1e40af, #3b82f6); color:white; padding:6px 12px; border-radius:12px; font-weight:900; font-size:10px; border:2px solid white; box-shadow:0 10px 20px rgba(30,64,175,0.3); text-transform:uppercase; letter-spacing:0.5px; display:inline-flex; align-items:center; gap:5px;'><svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M22 10v6M2 10l10-5 10 5-10 5z'/><path d='M6 12v5c3 3 9 3 12 0v-5'/></svg> ${selectedUniName}</div>`,
                        iconSize: [140, 36]
                    })
                }).addTo(map);

                // 2. Draw Interactive Luminous Proximity Radius Circle if maxDistance selected
                if (maxDistance && maxDistance !== "Any Distance") {
                    const radiusKm = parseFloat(maxDistance);
                    const radiusMeters = radiusKm * 1000;

                    const radiusCircle = L.circle([centerLat, centerLng], {
                        radius: radiusMeters,
                        color: '#2563eb',
                        fillColor: '#3b82f6',
                        fillOpacity: 0.14,
                        weight: 2.5,
                        dashArray: '6, 6'
                    }).addTo(map);

                    // Radius Tag Popup Label
                    radiusCircle.bindTooltip(`${radiusKm} KM Proximity Radius around ${selectedUniName}`, {
                        permanent: true,
                        direction: 'top',
                        className: 'bg-blue-900 text-white text-xs font-bold px-2 py-1 rounded-md border border-white/30'
                    });

                    // Smoothly fit map view to the radius circle bounds
                    map.fitBounds(radiusCircle.getBounds(), { padding: [30, 30] });
                }
            }

            // 3. Map Listing Pins
            items.forEach((item: any) => {
                if (item.latitude && item.longitude) {
                    const price = parseFloat(item.price || 0).toLocaleString();
                    const walkTime = item.walk_time_mins || item.walkTimeMins || 5;
                    const distVal = item.distance_to_uni || item.distanceToUni;
                    const distanceStr = distVal ? `${walkTime} mins walk (${distVal} km)` : `${walkTime} mins walk to gate`;

                    const marker = L.marker([parseFloat(item.latitude), parseFloat(item.longitude)]).addTo(map);
                    marker.bindPopup(`
                        <div style="font-family:sans-serif; padding:6px; max-width:220px;">
                            <span style="font-size:9px; font-weight:bold; background:#dbeafe; color:#1e40af; padding:2px 6px; border-radius:10px; text-transform:uppercase;">${item.listing_type === 'ROOMMATE_WANTED' ? 'Roommate Finder' : 'Landlord Annex'}</span>
                            <h4 style="margin:6px 0 4px 0; color:#0f172a; font-weight:bold; font-size:13px; line-height:1.2;">${escapeHtml(item.title)}</h4>
                            <p style="margin:0 0 4px 0; font-size:10px; color:#64748b;">${escapeHtml(item.address)}</p>
                            <p style="margin:0 0 6px 0; font-size:10px; font-weight:bold; color:#2563eb;">${distanceStr}</p>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; pt:6px; border-top:1px solid #f1f5f9;">
                                <span style="font-weight:900; color:#1e40af; font-size:13px;">Rs. ${price}<span style="font-size:9px; color:#64748b; font-weight:normal;">/mo</span></span>
                                <button onclick="window.location.href='/annex/${item.id}'" style="font-size:10px; font-weight:bold; background:#1e40af; color:white; border:none; padding:5px 10px; border-radius:8px; cursor:pointer;">View</button>
                            </div>
                        </div>
                    `);
                }
            });
        }

        initMap();

        return () => {
            if (retryTimer) {
                clearTimeout(retryTimer);
            }
            if (map) {
                map.remove();
            }
        };
    }, [items, centerUniId, maxDistance]);

    return (
        <div className="relative w-full h-[520px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/40 dark:border-slate-800">
            {!mapReady && (
                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
                    <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                    Loading Interactive Campus Map...
                </div>
            )}
            <div 
                id="list-map-canvas" 
                className="w-full h-full relative z-10"
            />
        </div>
    );
};

const AnnexList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [mapView, setMapView] = useState(false);

    // Read initial category from URL (?category=ROOMMATE_WANTED or LANDLORD_RENT)
    const getInitialCategory = (): 'ALL' | 'LANDLORD_RENT' | 'ROOMMATE_WANTED' => {
        const params = new URLSearchParams(location.search);
        const cat = params.get('category');
        if (cat === 'ROOMMATE_WANTED' || cat === 'LANDLORD_RENT') {
            return cat;
        }
        return 'ALL';
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUni, setSelectedUni] = useState("All Universities");
    const [maxDistance, setMaxDistance] = useState("Any Distance");
    const [activeCategory, setActiveCategory] = useState<'ALL' | 'LANDLORD_RENT' | 'ROOMMATE_WANTED'>(getInitialCategory);
    const [loading, setLoading] = useState(true);
    const [annexes, setAnnexes] = useState<any[]>([]);

    // Custom Dropdown Open States & Search inputs
    const [isUniDropdownOpen, setIsUniDropdownOpen] = useState(false);
    const [isDistanceDropdownOpen, setIsDistanceDropdownOpen] = useState(false);
    const [uniFilterQuery, setUniFilterQuery] = useState("");
    const uniDropdownRef = useRef<HTMLDivElement>(null);
    const distDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (uniDropdownRef.current && !uniDropdownRef.current.contains(e.target as Node)) {
                setIsUniDropdownOpen(false);
            }
            if (distDropdownRef.current && !distDropdownRef.current.contains(e.target as Node)) {
                setIsDistanceDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Stored active search query (only updated on Search Click)
    const [appliedFilters, setAppliedFilters] = useState({
        uni: "All Universities",
        dist: "Any Distance",
        search: ""
    });

    const fetchAnnexes = async (filtersToApply = appliedFilters, category = activeCategory) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filtersToApply.uni !== "All Universities") {
                queryParams.append("universityId", filtersToApply.uni);
            }
            if (filtersToApply.dist !== "Any Distance" && filtersToApply.uni !== "All Universities") {
                queryParams.append("maxDistance", filtersToApply.dist);
            }
            if (category !== 'ALL') {
                queryParams.append("listingType", category);
            }

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/annexes?${queryParams.toString()}`);
            const data = await response.json();
            
            const rawList = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
            let filtered = rawList;
            if (filtersToApply.search.trim() !== "") {
                const query = filtersToApply.search.toLowerCase();
                const numericQuery = parseFloat(query);
                const isNumeric = !isNaN(numericQuery);

                filtered = rawList.filter((item: any) => {
                    if (!item) return false;
                    const matchesTitle = item.title?.toLowerCase().includes(query);
                    const matchesAddress = item.address?.toLowerCase().includes(query);
                    const matchesUniName = item.university?.name?.toLowerCase().includes(query);
                    const matchesUniLoc = item.university?.location?.toLowerCase().includes(query);
                    const itemDist = item.distance_to_uni || item.distanceToUni;
                    const matchesDistance = isNumeric && itemDist && parseFloat(itemDist) <= numericQuery;

                    return matchesTitle || matchesAddress || matchesUniName || matchesUniLoc || matchesDistance;
                });
            }
            setAnnexes(filtered);
        } catch (error) {
            console.error("Error loading annexes:", error);
            setAnnexes([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial load and category change
    useEffect(() => {
        setCurrentPage(1);
        fetchAnnexes(appliedFilters, activeCategory);
    }, [activeCategory]);

    // Explicit Search Button Trigger
    const handleSearchClick = () => {
        const nextFilters = {
            uni: selectedUni,
            dist: maxDistance,
            search: searchTerm
        };
        setAppliedFilters(nextFilters);
        setCurrentPage(1);
        fetchAnnexes(nextFilters, activeCategory);
        document.getElementById('listing-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const safeAnnexes = Array.isArray(annexes) ? annexes : [];
    const itemsPerPage = 12;
    const totalPages = Math.max(1, Math.ceil(safeAnnexes.length / itemsPerPage));
    const paginatedData = safeAnnexes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        document.getElementById('listing-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Initialize favorites from localStorage
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('annex_favorites') || '[]');
            if (Array.isArray(saved)) {
                setFavorites(saved);
            }
        } catch (e) {
            // ignore
        }
    }, []);

    const toggleFavorite = (id: string) => {
        setFavorites(prev => {
            const safePrev = Array.isArray(prev) ? prev : [];
            const isFav = safePrev.includes(id);
            const next = isFav ? safePrev.filter(fId => fId !== id) : [...safePrev, id];

            try {
                localStorage.setItem('annex_favorites', JSON.stringify(next));
            } catch (e) {
                // ignore
            }

            if (!isFav) {
                // Track lead in backend for landlord analytics
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

            return next;
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans selection:bg-blue-500/30 overflow-hidden relative">
            <SEO title="Find Student Annexes & Boarding Places - The Uni Gang" description="Browse hundreds of verified student accommodations and boarding places near universities in Sri Lanka." />
            <PremiumPageLoader isLoading={loading} message="Curating available listings..." />

            <AnimatePresence>
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Top Action Bar with Breadcrumbs */}
                        <div className="w-full max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1760px] mx-auto px-4 md:px-8 pt-4 relative z-20">
                            <PageBreadcrumb
                                items={[
                                    { label: 'Accommodations', active: true }
                                ]}
                                backTo="/"
                                backLabel="Back to Home"
                                shareTitle="Find Student Accommodations & Annexes in Sri Lanka - The Uni Gang"
                            />
                        </div>

                        {/* Hero Section */}
                        <main className="pt-2 pb-10 px-4 md:px-8 w-full max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1760px] mx-auto">
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                {/* Left Content */}
                                <div className="relative z-10 space-y-10">
                                    <motion.div
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="space-y-6"
                                    >
                                        <span className="text-blue-800 dark:text-blue-400 font-bold tracking-widest text-sm uppercase">
                                            Verified Accommodations
                                        </span>
                                        <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tighter">
                                            Discover Your <br />
                                            <span className="text-blue-800 dark:text-blue-500">Perfect Annex.</span>
                                        </h1>
                                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
                                            Curated annexes and boarding places designed for the modern Sri Lankan scholar. High-value living near your campus.
                                        </p>
                                    </motion.div>

                                    {/* Floating Cards (Animated) */}
                                    <div className="hidden md:grid grid-cols-2 gap-4 pt-8">
                                        <motion.div
                                            className="bg-white/45 dark:bg-slate-900/45 glass-card p-4 rounded-xl shadow-lg transform -rotate-2 hover:rotate-0 transition-transform origin-bottom-right"
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                        >
                                            <img
                                                className="w-full h-40 object-cover rounded-lg mb-3"
                                                alt="minimalist dorm"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGhAtTRv4YETE_l3kthBiRfvl5i3hovr-AlpW5vluxBwPn3QCjJUC56kW0pz7V8DuZkKK-9ed4xkLS4f52saB_DX7iyO2rW9ettc9DuxP4tqArzuazsh6njre6kOPivAXKAMPEFxGHvFupgZC24UesQgRKWpY2YD6o94b3zAXPoRGS4JPhBdshP_-P-dHfTjLwVpzA1HSn1BeXycBmj3Gfm6vpJ5pyrMTPK10v7ISuSJ4WZx2EOn2Ybw-Hgm2MBgFzMt5dw7esh5AR"
                                            />
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">The Study Loft</span>
                                                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full font-bold uppercase tracking-wide">New</span>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            className="bg-white/45 dark:bg-slate-900/45 glass-card p-4 rounded-xl shadow-lg transform rotate-3 translate-y-8 hover:rotate-0 transition-transform origin-bottom-left"
                                            animate={{ y: [0, -8, 0] }}
                                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                                        >
                                            <img
                                                className="w-full h-40 object-cover rounded-lg mb-3"
                                                alt="cozy room"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXVjBjuRyVD_GdHsXCoJBF-3L_6yfqsQfZ7eVctHyCUAWEN6xhV7_Mm191cRUkn5Cet6hD5pCH8fgRlPs3aze3FgzAslWkx3hW6_gHrgVStfuo3gGi-9fuNwVNDvh988lMmcWhCLu6MDUbKNrWP8ZnRjfB-EATrgxjdIG_1wNi_K8v44aKS0YF0q_xc2vurCFrxhAVvm9JzzQTWZlz3USPGlhggzMWjSwRa36a4FKpqKMxNfEV2vB8HyIABqGieF30Os_x1kGbqss8"
                                            />
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">Lounge Area</span>
                                                <span className="text-[10px] text-blue-800 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full border border-blue-100 dark:border-blue-800/50 uppercase tracking-wide">Premium</span>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Right Mosaic Visual */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1 }}
                                    className="relative group"
                                >
                                    <div className="absolute -inset-4 bg-blue-800/10 dark:bg-blue-500/10 rounded-3xl blur-3xl group-hover:bg-blue-800/20 dark:group-hover:bg-blue-500/20 transition-all"></div>
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[600px] border border-white/20">
                                        <img
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                                            alt="modern luxury apartment"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_a9K6J0T27yXtg8BVkOms82Z4hYqbA3bbaBnDJFSayEv31Q3cpORu_tx4ZT2XccVgdHQp1MnIpz2W34ywh8jE4sh9LfVvgbruEobqkXFysvxpHturvQlOomS4x2VgovVm7e9s0athDqlOeqVerfWk1_wTbQBf3n7EwPHpJC3fZtKNYBIO1aoYY5M6jPcJudpFm-NfKwQUEawpdIvJpGBbQ4WsJb_vSuW_HN5GwP3lRVKT9YcDm-lz8yLaUISBifiHnTNZA0cTdWxY"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                                            <motion.div
                                                className="flex items-center gap-4 text-white"
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ repeat: Infinity, duration: 3 }}
                                            >
                                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                                    <span className="material-symbols-outlined text-green-400" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg">Verified Residencies</p>
                                                    <p className="text-sm text-gray-300">100+ properties across Sri Lanka</p>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Centralized Search Control */}
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-16 relative z-20"
                            >
                                <div className="max-w-5xl mx-auto p-4 bg-white/45 dark:bg-slate-900/45 backdrop-blur-xl rounded-[3rem] shadow-[0_30px_60px_rgba(0,63,221,0.08)] flex flex-col lg:flex-row gap-4 items-center border border-white/50 dark:border-slate-800/50">
                                    {/* Stand 1: Keyword or Location Search */}
                                    <div className="flex-1 w-full flex flex-col px-6 py-2 rounded-2xl hover:bg-white/50 dark:hover:bg-slate-800/30 transition-all">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5">
                                            <LuSearch className="text-blue-800 dark:text-blue-400" /> Keyword or Location
                                        </label>
                                        <input
                                            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-slate-900 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 py-1 text-sm"
                                            placeholder="e.g. Colombo, attached bath..."
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                                        />
                                    </div>

                                    {/* Vertical Divider */}
                                    <div className="h-12 w-[1px] bg-slate-200 dark:bg-slate-700 hidden lg:block self-center"></div>

                                    {/* Stand 2: Nearest Campus Custom Dropdown */}
                                    <div ref={uniDropdownRef} className="flex-1 w-full flex flex-col px-6 py-2 rounded-2xl hover:bg-white/50 dark:hover:bg-slate-800/30 transition-all relative">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5">
                                            <LuGraduationCap className="text-blue-800 dark:text-blue-400" /> Nearest Campus
                                        </label>
                                        
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsUniDropdownOpen(!isUniDropdownOpen);
                                                setIsDistanceDropdownOpen(false);
                                            }}
                                            className="w-full bg-transparent border-none p-0 flex items-center justify-between text-left text-slate-900 dark:text-white font-bold text-sm cursor-pointer py-1"
                                        >
                                            <span className="truncate pr-2">
                                                {selectedUni === "All Universities" 
                                                    ? "All Universities" 
                                                    : universitiesData.find(u => String(u.id) === String(selectedUni))?.name || "All Universities"}
                                            </span>
                                            <LuChevronDown className={`text-slate-400 text-base transition-transform duration-200 shrink-0 ${isUniDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Custom Floating Uni Dropdown Menu */}
                                        <AnimatePresence>
                                            {isUniDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute top-full left-0 right-0 sm:right-auto sm:w-[320px] mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-2 z-50 overflow-hidden"
                                                >
                                                    {/* Search box inside dropdown */}
                                                    <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center gap-2">
                                                        <LuSearch className="text-slate-400 text-xs shrink-0" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search university..."
                                                            value={uniFilterQuery}
                                                            onChange={(e) => setUniFilterQuery(e.target.value)}
                                                            className="w-full bg-transparent border-none text-xs font-semibold focus:outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                                                            autoFocus
                                                        />
                                                        {uniFilterQuery && (
                                                            <button 
                                                                type="button" 
                                                                onClick={() => setUniFilterQuery("")}
                                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                                            >
                                                                <LuX size={12} />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-0.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedUni("All Universities");
                                                                setMaxDistance("Any Distance");
                                                                setIsUniDropdownOpen(false);
                                                                setUniFilterQuery("");
                                                            }}
                                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                                                                selectedUni === "All Universities"
                                                                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300'
                                                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                                                            }`}
                                                        >
                                                            <span>All Universities</span>
                                                            {selectedUni === "All Universities" && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                                                        </button>

                                                        {universitiesData
                                                            .filter(u => u.name.toLowerCase().includes(uniFilterQuery.toLowerCase()))
                                                            .map((uni) => {
                                                                const isSelected = String(selectedUni) === String(uni.id);
                                                                return (
                                                                    <button
                                                                        type="button"
                                                                        key={uni.id}
                                                                        onClick={() => {
                                                                            setSelectedUni(String(uni.id));
                                                                            setIsUniDropdownOpen(false);
                                                                            setUniFilterQuery("");
                                                                        }}
                                                                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                                                                            isSelected
                                                                                ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300'
                                                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                                                                        }`}
                                                                    >
                                                                        <span className="truncate pr-2">{uni.name}</span>
                                                                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>}
                                                                    </button>
                                                                );
                                                            })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Vertical Divider */}
                                    <div className="h-12 w-[1px] bg-slate-200 dark:bg-slate-700 hidden lg:block self-center"></div>

                                    {/* Stand 3: Proximity Limit Custom Dropdown */}
                                    <div ref={distDropdownRef} className="flex-1 w-full flex flex-col px-6 py-2 rounded-2xl hover:bg-white/50 dark:hover:bg-slate-800/30 transition-all relative">
                                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5">
                                            <LuMapPin className="text-blue-800 dark:text-blue-400 text-xs" /> Proximity Limit
                                        </label>

                                        <button
                                            type="button"
                                            disabled={selectedUni === "All Universities"}
                                            onClick={() => {
                                                if (selectedUni !== "All Universities") {
                                                    setIsDistanceDropdownOpen(!isDistanceDropdownOpen);
                                                    setIsUniDropdownOpen(false);
                                                }
                                            }}
                                            className={`w-full bg-transparent border-none p-0 flex items-center justify-between text-left font-bold text-sm py-1 ${
                                                selectedUni === "All Universities"
                                                    ? 'text-slate-400 cursor-not-allowed opacity-70'
                                                    : 'text-slate-900 dark:text-white cursor-pointer'
                                            }`}
                                        >
                                            <span className="truncate pr-2">
                                                {selectedUni === "All Universities" 
                                                    ? "Select Campus First" 
                                                    : maxDistance === "Any Distance" 
                                                        ? "Any Distance" 
                                                        : `Within ${maxDistance} km`}
                                            </span>
                                            <LuChevronDown className={`text-slate-400 text-base transition-transform duration-200 shrink-0 ${isDistanceDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Custom Floating Distance Dropdown Menu */}
                                        <AnimatePresence>
                                            {isDistanceDropdownOpen && selectedUni !== "All Universities" && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute top-full left-0 right-0 sm:right-auto sm:w-[220px] mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-2 z-50 overflow-hidden"
                                                >
                                                    <div className="space-y-0.5">
                                                        {[
                                                            { val: "Any Distance", label: "Any Distance" },
                                                            { val: "1", label: "Within 1 km" },
                                                            { val: "2", label: "Within 2 km" },
                                                            { val: "3", label: "Within 3 km" },
                                                            { val: "5", label: "Within 5 km" }
                                                        ].map(item => {
                                                            const isSelected = maxDistance === item.val;
                                                            return (
                                                                <button
                                                                    type="button"
                                                                    key={item.val}
                                                                    onClick={() => {
                                                                        setMaxDistance(item.val);
                                                                        setIsDistanceDropdownOpen(false);
                                                                    }}
                                                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                                                                        isSelected
                                                                            ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300'
                                                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                                                                    }`}
                                                                >
                                                                    <span>{item.label}</span>
                                                                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Search Button */}
                                    <button
                                        onClick={handleSearchClick}
                                        className="w-full lg:w-auto bg-blue-800 hover:bg-blue-900 text-white px-9 py-4 rounded-2xl font-black uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-800/25 flex-shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
                                    >
                                        Search Now
                                        <LuArrowRight className="group-hover:translate-x-1 transition-transform text-base" />
                                    </button>
                                </div>
                            </motion.div>
                        </main>
                        {/* Annex Listings Section */}
                        <section className="w-full max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 py-14" id="listing-grid">
                            <div className="flex flex-col gap-6 mb-10">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="space-y-1.5">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                                            <LuGraduationCap className="text-sm" /> Campus Accommodations
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                                            Refined Accommodations
                                        </h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Verified boarding places and roommate requests near leading universities
                                        </p>
                                    </div>
                                    <Link
                                        to="/post-ad"
                                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-800/25 transition-all hover:scale-105 active:scale-95 w-full md:w-auto shrink-0"
                                    >
                                        <LuPlus className="text-lg" /> Post Advertisement
                                    </Link>
                                </div>

                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pt-2">
                                    {/* Category Filter Tabs */}
                                    <div className="flex p-1.5 bg-slate-100/90 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 rounded-2xl w-full lg:w-auto overflow-x-auto custom-scrollbar shrink-0 select-none">
                                        {(['ALL', 'LANDLORD_RENT', 'ROOMMATE_WANTED'] as const).map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => {
                                                    setActiveCategory(type);
                                                    setCurrentPage(1);
                                                }}
                                                className={`flex-1 lg:flex-initial whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 border-none cursor-pointer ${
                                                    activeCategory === type
                                                        ? 'bg-blue-800 text-white shadow-md shadow-blue-800/25'
                                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 bg-transparent'
                                                }`}
                                            >
                                                {type === 'ALL' && 'All Listings'}
                                                {type === 'LANDLORD_RENT' && 'Boarding Places'}
                                                {type === 'ROOMMATE_WANTED' && 'Roommate Finder'}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                                        {/* Toggle Map View button */}
                                        <button
                                            onClick={() => setMapView(!mapView)}
                                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200/70 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all shadow-sm w-full sm:w-auto whitespace-nowrap"
                                        >
                                            <LuMap className="text-base text-blue-600" /> {mapView ? "Show Grid View" : "Show Map View"}
                                        </button>

                                        {/* Pagination Context Info */}
                                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-900/60 px-4 py-2.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 w-full sm:w-auto text-center whitespace-nowrap">
                                            Showing {safeAnnexes.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(currentPage * itemsPerPage, safeAnnexes.length)} of {safeAnnexes.length}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Render Map View or Grid View based on Toggle */}
                            {mapView ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="mb-10"
                                >
                                    <LeafletListMap items={annexes} centerUniId={selectedUni} maxDistance={maxDistance} />
                                </motion.div>
                            ) : (
                                /* Animated Responsive Grid for Large Screens (up to 4 cols on 2xl) */
                                <motion.div
                                    id="listing-grid"
                                    layout
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 xl:gap-8 scroll-mt-24"
                                >
                                    <AnimatePresence mode="popLayout">
                                        {paginatedData.map((item, index) => {
                                            // Handle images mapping correctly
                                            const coverImage = item.images && item.images.length > 0 
                                                ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${item.images[0].imageUrl}` 
                                                : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800";

                                            // Resolve University Name
                                            const uniName = item.university?.name || 
                                                (item.university_id ? universitiesData.find(u => String(u.id) === String(item.university_id))?.name : null);
                                                
                                            return (
                                                <React.Fragment key={item.id}>
                                                    <motion.div
                                                        layout
                                                        initial={{ opacity: 0, y: 30 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        transition={{ duration: 0.4, delay: index * 0.04 }}
                                                        className="group relative h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-[2rem] p-3.5 hover:shadow-[0_24px_50px_-15px_rgba(30,64,175,0.18)] hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 flex flex-col"
                                                    >
                                                        {/* Image Showcase */}
                                                        <div className="relative h-[220px] rounded-[1.5rem] overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
                                                            <img
                                                                alt={item.title}
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                src={coverImage}
                                                                onError={(e: any) => {
                                                                    e.currentTarget.onerror = null;
                                                                    e.currentTarget.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800";
                                                                }}
                                                            />

                                                            {/* Gradient Overlay for bottom text readability */}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

                                                            {/* Top Badges */}
                                                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                                                                {/* Verified Badge */}
                                                                {item.status === 'Approved' ? (
                                                                    <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md border border-white/20 text-white pointer-events-auto">
                                                                        <VerifiedBadge size={14} title="Verified Owner" />
                                                                        <span className="text-[9px] font-extrabold uppercase tracking-wider">Verified</span>
                                                                    </div>
                                                                ) : <div />}

                                                                {/* Favorite Button */}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleFavorite(item.id);
                                                                    }}
                                                                    className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-md border border-white/30 dark:border-slate-700 text-slate-700 dark:text-slate-200 pointer-events-auto cursor-pointer"
                                                                >
                                                                    <LuHeart className={`text-base transition-colors ${favorites.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-slate-400 dark:text-slate-300'}`} />
                                                                </button>
                                                            </div>

                                                            {/* Bottom Tag on Image (Listing Type) */}
                                                            <div className="absolute bottom-3 left-3 z-10">
                                                                <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-md shadow-md text-white border border-white/20 inline-flex items-center gap-1.5 bg-slate-950/70">
                                                                    {item.listing_type === 'ROOMMATE_WANTED' ? (
                                                                        <>
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                                                                            Roommate Finder
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                                            Boarding Place
                                                                        </>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Content Body */}
                                                        <div className="px-1.5 space-y-3 flex-grow flex flex-col">
                                                            {/* Target University Highlight Badge */}
                                                            {uniName && (
                                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-900/50 text-blue-800 dark:text-blue-300 text-[11px] font-bold w-fit">
                                                                    <LuGraduationCap className="text-blue-600 dark:text-blue-400 text-xs shrink-0" />
                                                                    <span className="truncate max-w-[220px]">{uniName}</span>
                                                                </div>
                                                            )}

                                                            <div>
                                                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors tracking-tight line-clamp-1" title={item.title}>
                                                                    {item.title}
                                                                </h3>
                                                                <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 font-medium mt-1 line-clamp-1">
                                                                    <LuMapPin className="text-xs text-blue-700 dark:text-blue-400 shrink-0" />
                                                                    {item.address}
                                                                </p>
                                                            </div>

                                                            {/* Walk & Distance Info Pill */}
                                                            <div className="flex flex-wrap items-center gap-1.5">
                                                                <span className="text-[10px] font-bold bg-blue-500/10 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-md border border-blue-500/20 inline-flex items-center gap-1">
                                                                    <LuFootprints size={11} className="shrink-0 text-blue-600 dark:text-blue-400" /> 
                                                                    {item.walk_time_mins || item.walkTimeMins || 5} mins walk
                                                                    {(item.distance_to_uni || item.distanceToUni) ? ` (${item.distance_to_uni || item.distanceToUni} km)` : ''}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                                    <LuBedDouble className="text-xs text-slate-400" /> {item.beds} {item.beds === 1 ? 'Bed' : 'Beds'}
                                                                </span>
                                                            </div>

                                                            {/* Amenities & Facility Badges */}
                                                            <div className="flex flex-wrap items-center gap-1.5 py-2.5 border-y border-slate-100 dark:border-slate-800/80 mt-auto">
                                                                {item.landlordPresence === 'INDEPENDENT' || item.landlord_presence === 'INDEPENDENT' ? (
                                                                    <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                                                                        <LuHouse size={11} /> Independent
                                                                    </span>
                                                                ) : item.landlordPresence === 'ON_SITE' || item.landlord_presence === 'ON_SITE' ? (
                                                                    <span className="text-[9px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                                                                        <LuShieldCheck size={11} /> On-Site Landlord
                                                                    </span>
                                                                ) : null}
                                                                {item.busRoute || item.bus_route ? (
                                                                    <span className="text-[9px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-md truncate max-w-[130px] inline-flex items-center gap-1" title={item.busRoute || item.bus_route}>
                                                                        <LuBus size={11} className="shrink-0" /> {item.busRoute || item.bus_route}
                                                                    </span>
                                                                ) : null}
                                                                {item.has_power_backup || item.hasPowerBackup ? (
                                                                    <span className="text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                                                                        <LuZap size={11} /> Power Backup
                                                                    </span>
                                                                ) : null}
                                                                {(item.has_water_tank !== false && item.hasWaterTank !== false) ? (
                                                                    <span className="text-[9px] font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                                                                        <LuDroplets size={11} /> Water Tank
                                                                    </span>
                                                                ) : null}
                                                                {(item.is_cooking_allowed !== false && item.isCookingAllowed !== false) ? (
                                                                    <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                                                                        <LuUtensils size={11} /> Cooking Allowed
                                                                    </span>
                                                                ) : null}
                                                            </div>

                                                            {/* Action & Price Bottom Row */}
                                                            <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80">
                                                                <div>
                                                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">Monthly Fee</span>
                                                                    <span className="text-lg md:text-xl font-black text-blue-800 dark:text-blue-400 leading-none">
                                                                        <span className="text-xs mr-0.5 font-bold">Rs.</span>{parseFloat(item.price).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    onClick={() => navigate(`/annex/${item.id}`)}
                                                                    className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-800/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                                                                >
                                                                    Details
                                                                    <LuArrowRight className="text-xs" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                    {(index + 1) % 8 === 0 && (
                                                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 2xl:col-span-4">
                                                            <AdNativeFeed adIndex={Math.floor((index + 1) / 8) - 1} />
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </AnimatePresence>
                                </motion.div>
                            )}

                            {/* Empty State when no annexes match criteria */}
                            {!mapView && safeAnnexes.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-16 px-4 text-center flex flex-col items-center justify-center max-w-md mx-auto"
                                >
                                    <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 flex items-center justify-center text-blue-600 mb-5 shadow-lg shadow-blue-500/10">
                                        <LuHouse className="text-3xl" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No Accommodations Found</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                        We couldn't find any annexes matching your search filters. Try adjusting your proximity distance or university campus.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedUni("All Universities");
                                            setMaxDistance("Any Distance");
                                            setSearchTerm("");
                                            const cleared = { uni: "All Universities", dist: "Any Distance", search: "" };
                                            setAppliedFilters(cleared);
                                            fetchAnnexes(cleared, activeCategory);
                                        }}
                                        className="px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-800/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                    >
                                        Reset All Filters
                                    </button>
                                </motion.div>
                            )}

                            {/* Glass Pagination System */}
                            {totalPages > 1 && (
                                <div className="mt-20 flex justify-center w-full">
                                    <div className="flex items-center gap-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-2 rounded-full border border-white/40 dark:border-slate-800 shadow-xl">
                                        <button
                                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${currentPage === 1 ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 shadow-sm'}`}
                                        >
                                            <LuArrowLeft className="text-lg" />
                                        </button>

                                        <div className="flex gap-1 px-2">
                                            {Array.from({ length: totalPages }).map((_, i) => {
                                                const page = i + 1;
                                                const isActive = currentPage === page;
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`w-10 h-10 flex items-center justify-center font-bold rounded-full transition-all ${isActive ? 'bg-blue-800 text-white shadow-md shadow-blue-800/30 font-black' : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60'}`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${currentPage === totalPages ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 shadow-sm'}`}
                                        >
                                            <LuArrowRight className="text-lg" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnnexList;
