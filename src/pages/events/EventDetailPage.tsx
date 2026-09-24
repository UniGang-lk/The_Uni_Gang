import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LuArrowLeft, LuCalendar, LuMapPin, LuGraduationCap,
    LuTicket, LuZap, LuShare2, LuSparkles, LuCheck, LuLoader, LuCloudUpload, LuCircleAlert
} from "react-icons/lu";
import { api } from '../../api';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO';
import AdBanner from '../../components/advertise/AdBanner';

interface EventData {
    id: number;
    title: string;
    image: string;
    uni: string;
    faculty: string;
    description: string;
    date: string;
    time: string;
    contact: string;
    category: string;
    location: string;
    extra: string;
    requirements: string;
    capacity?: number;
    attendees?: any[];
    user?: { id: string, name?: string, email?: string };
}

const EventDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isInterested, setIsInterested] = useState(false);
    const [isLoadingRsvp, setIsLoadingRsvp] = useState(false);
    const [attendeeCount, setAttendeeCount] = useState(0);
    const [isHost, setIsHost] = useState(false);
    const [showDashboard, setShowDashboard] = useState(false);

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await api.getEventById(id);
                setEvent(data);
                setAttendeeCount(data.attendees?.length || 0);

                const token = localStorage.getItem('userToken');
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        if (data.user && data.user.id === payload.id) {
                            setIsHost(true);
                        } else {
                            setIsHost(false);
                        }
                        if (data.attendees) {
                            const isAttending = data.attendees.some((a: any) => a.id === payload.id);
                            setIsInterested(isAttending);
                        }
                    } catch {
                        /* ignore invalid token */
                    }
                }
            } catch (err: any) {
                toast.error(err.message || 'Failed to load event details');
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    const handleRsvp = async () => {
        if (!event) return;
        const token = localStorage.getItem('userToken');
        if (!token) {
            toast.error('Please sign in to RSVP for events.');
            return;
        }

        setIsLoadingRsvp(true);
        try {
            const res = await api.toggleEventRsvp(event.id.toString(), token);
            setIsInterested(res.isAttending);
            setAttendeeCount(prev => res.isAttending ? prev + 1 : prev - 1);
            toast.success(res.message);
        } catch (error: any) {
            toast.error(error.message || 'Failed to toggle RSVP');
        } finally {
            setIsLoadingRsvp(false);
        }
    };

    const handleAddToCalendar = () => {
        if (!event) return;
        const startDate = new Date(event.date);
        const startStr = startDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const details = encodeURIComponent(`${event.description}\n\nLink: ${window.location.href}`);
        const location = encodeURIComponent(event.location);
        const title = encodeURIComponent(event.title);

        const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${startStr}&details=${details}&location=${location}`;
        window.open(googleCalUrl, '_blank');
    };

    const exportToCSV = () => {
        if (!event?.attendees || event.attendees.length === 0) {
            toast.error("No attendees to export.");
            return;
        }

        const headers = ["Name,Email"];
        const rows = event.attendees.map(a => `"${a.name || ''}","${a.email || ''}"`);
        const csvContent = headers.concat(rows).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${event.title.replace(/\s+/g, '_')}_Attendees.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
                <LuLoader size={48} className="animate-spin text-blue-600 mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Event Details...</p>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">Event Not Found</h2>
                <p className="text-slate-500 text-sm font-medium mb-6">The event you are looking for does not exist or has been removed.</p>
                <button
                    onClick={() => navigate('/event-list')}
                    className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-all"
                >
                    Back to Events
                </button>
            </div>
        );
    }

    const imageUrl = event.image ? (event.image.startsWith('http') ? event.image : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${event.image}`) : 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800';

    return (
        <div className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
            <SEO 
                title={`${event.title} - The Uni Gang`}
                description={event.description}
                image={imageUrl}
                schemaData={{
                    "@context": "https://schema.org",
                    "@type": "Event",
                    "name": event.title,
                    "startDate": event.date,
                    "eventStatus": "https://schema.org/EventScheduled",
                    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                    "location": {
                        "@type": "Place",
                        "name": event.location,
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": event.uni || "Sri Lanka",
                            "addressCountry": "LK"
                        }
                    },
                    "image": [imageUrl],
                    "description": event.description,
                    "offers": {
                        "@type": "Offer",
                        "url": window.location.href,
                        "price": "0",
                        "priceCurrency": "LKR",
                        "availability": "https://schema.org/InStock"
                    },
                    "organizer": {
                        "@type": "Organization",
                        "name": event.uni || "The Uni Gang",
                        "url": "https://unigang.lk"
                    }
                }}
            />
            
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-8 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-all"
            >
                <LuArrowLeft size={16} /> Back
            </button>

            {/* Main Content Layout */}
            <div className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl flex flex-col md:flex-row border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[60vh]">
                
                {/* Image Section */}
                <div className="w-full md:w-1/2 relative h-80 md:h-auto overflow-hidden shrink-0 bg-slate-900">
                    <motion.img
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5 }}
                        src={imageUrl}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                    {/* Floating labels over image */}
                    <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 space-y-3 md:space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 shadow-lg text-white text-[10px] md:text-xs font-black uppercase tracking-widest">
                            <LuZap className="animate-pulse" /> Campus Pulse
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                            {event.title}
                        </h1>
                        <div className="flex items-center gap-2 text-white/90 text-xs md:text-lg font-bold uppercase tracking-wider">
                            <LuGraduationCap className="text-blue-400" /> {event.uni} • {event.faculty}
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 p-6 md:p-12 space-y-8 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50 overflow-y-auto">

                    {/* Description Block */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-1 bg-blue-600 rounded-full" />
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">About Event</span>
                        </div>
                        <p className="text-sm md:text-base font-medium text-slate-800 dark:text-white leading-relaxed whitespace-pre-wrap">
                            {event.description}
                        </p>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 gap-4 py-4 border-y border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                <LuCalendar size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Schedule</p>
                                <p className="text-xs md:text-sm font-black text-slate-800 dark:text-slate-200 uppercase">
                                    {new Date(event.date).toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' })} @ {event.time}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                                <LuMapPin size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Gathering At</p>
                                <p className="text-xs md:text-sm font-black text-slate-800 dark:text-slate-200 uppercase">
                                    {event.location}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                                <LuTicket size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Access Basis</p>
                                <p className="text-xs md:text-sm font-black text-slate-800 dark:text-slate-200 uppercase">
                                    {event.requirements}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Capacity Overview */}
                    {event.capacity && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <span>Capacity Overview</span>
                                <span className="text-blue-600">{attendeeCount} / {event.capacity} Spots Filled</span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((attendeeCount / event.capacity) * 100, 100)}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-full rounded-full ${attendeeCount >= event.capacity ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-blue-600'}`}
                                />
                            </div>
                            {attendeeCount >= event.capacity && (
                                <p className="text-[10px] text-red-500 font-bold uppercase mt-1 flex items-center gap-1">
                                    <LuCircleAlert size={12} className="shrink-0" /> Event is at full capacity!
                                </p>
                            )}
                        </div>
                    )}

                    {/* Extra Notes */}
                    {event.extra && (
                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                                <LuSparkles size={14} />
                            </div>
                            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 tracking-tight italic leading-snug">
                                "{event.extra}"
                            </p>
                        </div>
                    )}

                    {/* Actions and Controls */}
                    <div className="flex flex-col gap-3 pt-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleAddToCalendar}
                                className="w-14 h-14 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-blue-600 border border-slate-100 dark:border-slate-800 transition-all active:scale-95 shadow-sm"
                                title="Add to Google Calendar"
                            >
                                <LuCalendar size={18} />
                            </button>

                            {isHost ? (
                                <motion.button
                                    onClick={() => setShowDashboard(!showDashboard)}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex-grow flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all border shadow-sm ${showDashboard
                                        ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900'
                                        : 'bg-amber-500 border-amber-500 text-white hover:bg-amber-600'
                                        }`}
                                >
                                    <LuSparkles size={16} /> {showDashboard ? 'Close Dashboard' : 'Manage Attendees'}
                                </motion.button>
                            ) : (
                                <motion.button
                                    onClick={handleRsvp}
                                    disabled={isLoadingRsvp || (!isInterested && !!event.capacity && attendeeCount >= event.capacity)}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex-grow flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all border shadow-sm ${isInterested
                                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/40'
                                        : (!isInterested && event.capacity && attendeeCount >= event.capacity)
                                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border-transparent'
                                            : 'bg-blue-600 border-blue-600 text-white shadow-blue-500/40 hover:bg-blue-700'
                                        }`}
                                >
                                    {isLoadingRsvp ? (
                                        <LuLoader size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            {isInterested ? <LuCheck size={18} /> : <LuTicket size={18} />}
                                            <span>{isInterested ? "I'm Going!" : "RSVP Now"}</span>
                                        </>
                                    )}
                                </motion.button>
                            )}

                            <button className="w-14 h-14 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-blue-600 border border-slate-100 dark:border-slate-800 transition-all active:scale-95 shadow-sm">
                                <LuShare2 size={18} />
                            </button>
                        </div>

                        {/* Expandable Host Dashboard */}
                        <AnimatePresence>
                            {isHost && showDashboard && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden mt-4"
                                >
                                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-inner">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                                                Attendee Roster ({event.attendees?.length || 0})
                                            </h4>
                                            <button
                                                onClick={exportToCSV}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors"
                                            >
                                                <LuCloudUpload size={12} /> Export CSV
                                            </button>
                                        </div>

                                        <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                            {!event.attendees || event.attendees.length === 0 ? (
                                                <p className="text-center text-xs text-slate-500 py-4 font-medium italic">No RSVPs yet. Share your event!</p>
                                            ) : (
                                                event.attendees.map((attendee: any, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                                                        <img
                                                            src={attendee.profile_pic ? (attendee.profile_pic.startsWith('http') ? attendee.profile_pic : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${attendee.profile_pic}`) : "https://i.pravatar.cc/150"}
                                                            alt={attendee.name}
                                                            className="w-8 h-8 rounded-full object-cover shadow-sm"
                                                        />
                                                        <div className="flex flex-col flex-1 overflow-hidden">
                                                            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{attendee.name}</span>
                                                            <span className="text-[9px] text-slate-500 font-medium truncate">{attendee.email}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Ad Placement */}
            <div className="mt-10">
                <AdBanner placement="BANNER" />
            </div>
        </div>
    );
};

export default EventDetailPage;
