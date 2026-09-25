import React, { useState, useEffect } from 'react';
import {
    LuArrowLeft, LuSearch, LuCalendar, LuMapPin, LuGraduationCap,
    LuClock, LuMessageCircle, LuInfo, LuArrowRight, LuSparkles,
    LuTicket, LuX, LuChevronDown, LuUsers
} from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import TiltCard from '../../components/ui/TiltCard';
import EventDetails from './EventDetails';
import { api } from '../../api';
import toast from 'react-hot-toast';
import PremiumPageLoader from '../../components/ui/PremiumPageLoader';
import AdBanner from '../../components/advertise/AdBanner';
import AdNativeFeed from '../../components/advertise/AdNativeFeed';
import SEO from '../../components/SEO';

// Mock Data for University Events
const DUMMY_EVENTS = [
    {
        id: 1,
        title: "Tech Summit 2024",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200",
        uni: "UOM",
        faculty: "Engineering",
        description: "Explore the latest in AI and Robotics at the biggest tech gathering of the year.",
        date: "2024-11-12",
        time: "09:00 AM",
        contact: "+94771234567",
        category: "Tech",
        location: "Main Auditorium",
        extra: "Drone shots included",
        requirements: "Ticket required"
    },
    {
        id: 2,
        title: "Neon Nights Musical",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200",
        uni: "UOC",
        faculty: "Arts",
        description: "A night of vibrant music and dance featuring top student talent.",
        date: "2024-10-24",
        time: "06:30 PM",
        contact: "+94777654321",
        category: "Culture",
        location: "Nelum Pokuna",
        extra: "Refreshments provided",
        requirements: "Open for all"
    },
    {
        id: 3,
        title: "Inter-Uni Cricket",
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1200",
        uni: "SLIIT",
        faculty: "Computing",
        description: "The ultimate showdown on the pitch. Support your campus team!",
        date: "2024-12-05",
        time: "08:00 AM",
        contact: "+94778889990",
        category: "Sports",
        location: "University Grounds",
        extra: "Live streaming",
        requirements: "Student ID required"
    },
    {
        id: 4,
        title: "InnovateX Forum",
        image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200",
        uni: "NSBM",
        faculty: "Business",
        description: "Pitch your ideas to top entrepreneurs and win grand prizes.",
        date: "2025-01-18",
        time: "10:00 AM",
        contact: "+94770001112",
        category: "Business",
        location: "Auditorium A1",
        extra: "Mentorship sessions",
        requirements: "Registration ends Dec 30"
    },
    {
        id: 5,
        title: "Global Beats Festival",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200",
        uni: "UOM",
        faculty: "Architecture",
        description: "Experience food, music, and art from around the world.",
        date: "2025-02-02",
        time: "04:00 PM",
        contact: "+94772223334",
        category: "Lifestyle",
        location: "Civil Grounds",
        extra: "After-party DJ",
        requirements: "Early bird tickets available"
    },
    {
        id: 6,
        title: "Code Sprint 2024",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200",
        uni: "IIT",
        faculty: "Software Eng",
        description: "24-hour hackathon to solve real-world problems with code.",
        date: "2024-11-20",
        time: "08:00 AM",
        contact: "+94774445556",
        category: "Tech",
        location: "Digital Lab",
        extra: "T-shirts and snacks",
        requirements: "Team of 4"
    }
];



const FloatingIcon = ({ icon: Icon, index }: { icon: React.ComponentType, index: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [0.15, 0.4, 0.15],
            scale: [1, 1.2, 1],
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
        }}
        transition={{
            duration: 5 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5
        }}
        className="absolute text-blue-500/20 pointer-events-none"
        style={{
            left: `${15 + (index * 20)}%`,
            top: `${10 + (index * 15)}%`,
            fontSize: `${2 + (index % 3)}rem`
        }}
    >
        <Icon />
    </motion.div>
);

const EventList: React.FC = () => {
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [, setIsScrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoading(true);
                const data = await api.getApprovedEvents();
                setEvents(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load approved events:", err);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const displayEvents = events.length > 0 ? events : DUMMY_EVENTS;
    const featuredEvent = displayEvents[0] || DUMMY_EVENTS[0];

    const handleStartChat = async (eventId: string) => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            toast.error("Please login to chat with the host.");
            return;
        }
        try {
            const chat = await api.startEventChat(eventId);
            window.location.href = `/profile?tab=inbox&chatId=${chat.id}&type=event`;
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to start chat session.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
            <SEO
                title="University Events & Tech Meetups - The Uni Gang"
                description="Discover the latest university events, tech summits, hackathons, and cultural nights across Sri Lanka."
            />
            <PremiumPageLoader isLoading={loading} message="Syncing with the campus heartbeat..." />

            <AnimatePresence>
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Background Ambient Glows */}
                        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[140px]" />
                            <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-[120px]" />
                        </div>

                        {/* Top Hero Section */}
                        <section className="relative pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
                            <div className="grid lg:grid-cols-12 gap-10 items-center">
                                
                                {/* Left Column: Headline and Proof */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="lg:col-span-7 space-y-6 text-center lg:text-left"
                                >
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 dark:text-cyan-400 font-black text-xs uppercase tracking-wider shadow-sm">
                                        <LuSparkles className="w-3.5 h-3.5 animate-pulse" /> Sri Lanka's Campus Heartbeat
                                    </div>

                                    <h1 className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white leading-[0.95] tracking-tight">
                                        University <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">Pulse.</span>
                                    </h1>

                                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                                        The unified stage for hackathons, cultural festivals, tech summits, and sports derbies across Sri Lankan universities. Never miss a landmark campus moment.
                                    </p>

                                    {/* Stats & Trust Row */}
                                    <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-3">
                                                {[1, 2, 3, 4].map(i => (
                                                    <img
                                                        key={i}
                                                        src={`https://i.pravatar.cc/100?u=${i + 15}`}
                                                        className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover shadow-sm"
                                                        alt="student"
                                                    />
                                                ))}
                                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white dark:border-slate-900 text-white text-[11px] font-black shadow-sm">
                                                    +3K
                                                </div>
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">3,000+ Students</span>
                                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Active Campus Community</span>
                                            </div>
                                        </div>

                                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                            <span>{displayEvents.length} Active University Events Live</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Right Column: Dynamic Featured Event Spotlight */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, delay: 0.1 }}
                                    className="lg:col-span-5 relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-cyan-500/20 rounded-[2.5rem] blur-2xl pointer-events-none" />

                                    <FloatingIcon icon={LuCalendar} index={0} />
                                    <FloatingIcon icon={LuSparkles} index={1} />
                                    <FloatingIcon icon={LuGraduationCap} index={2} />

                                    <TiltCard>
                                        <div
                                            onClick={() => setSelectedEvent(featuredEvent)}
                                            className="group cursor-pointer relative rounded-[2rem] overflow-hidden border border-white/60 dark:border-white/10 shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-4 sm:p-5 transition-all duration-300 hover:border-blue-500/50"
                                        >
                                            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden mb-4">
                                                <img
                                                    src={featuredEvent.image || "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200"}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    alt={featuredEvent.title}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                                                <div className="absolute top-3.5 left-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                                                    <LuSparkles className="w-3 h-3" /> Spotlight Event
                                                </div>

                                                <div className="absolute top-3.5 right-3.5 bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                                                    {featuredEvent.category}
                                                </div>

                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-1">
                                                        <LuGraduationCap className="text-sm" /> {featuredEvent.uni}{featuredEvent.faculty ? ` - ${featuredEvent.faculty}` : ''}
                                                    </div>
                                                    <h3 className="text-2xl font-black text-white tracking-tight leading-tight group-hover:text-cyan-300 transition-colors">
                                                        {featuredEvent.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-1 px-1">
                                                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-200">
                                                        <LuCalendar className="text-blue-500" /> {featuredEvent.date}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <LuMapPin className="text-blue-500" /> {featuredEvent.location}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-black text-blue-600 dark:text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                    View RSVP <LuArrowRight className="w-3.5 h-3.5" />
                                                </span>
                                            </div>
                                        </div>
                                    </TiltCard>
                                </motion.div>

                            </div>
                        </section>

                        {/* Events Main Hub */}
                        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 relative z-10">

                            {/* Ad Banner */}
                            <div className="mb-8">
                                <AdBanner placement="BANNER" />
                            </div>

                            {/* Section Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                        Upcoming University Events
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs mt-1">
                                        Showing {displayEvents.length} active campus events
                                    </p>
                                </div>
                            </div>

                            {/* Events Grid */}
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                                >
                                    {displayEvents.map((event, index) => {
                                        const imageUrl = event.image
                                            ? (event.image.startsWith('http') ? event.image : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${event.image}`)
                                            : 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800';

                                        const eventDate = new Date(event.date);
                                        const dayStr = isNaN(eventDate.getTime()) ? event.date : String(eventDate.getDate());
                                        const monthStr = isNaN(eventDate.getTime()) ? 'OCT' : eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();

                                        return (
                                            <React.Fragment key={event.id}>
                                                <motion.div
                                                    layout
                                                    initial={{ opacity: 0, y: 25 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                                >
                                                    <div className="h-full">
                                                        <div className="group h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col relative overflow-hidden">
                                                            
                                                            {/* Image Capsule */}
                                                            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-800">
                                                                <img
                                                                    src={imageUrl}
                                                                    alt={event.title}
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                                                {/* Date Badge - Ultra Crisp Calendar Pill */}
                                                                <div className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col items-center border border-white/60 dark:border-slate-700/60 shadow-xl min-w-[3.2rem]">
                                                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-full py-1 text-center">
                                                                        <span className="text-[9px] font-black uppercase tracking-wider text-white leading-none block">{monthStr}</span>
                                                                    </div>
                                                                    <div className="px-2.5 py-1 flex items-center justify-center">
                                                                        <span className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{dayStr}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Category Tag */}
                                                                <div className="absolute top-3.5 right-3.5 bg-slate-900/80 dark:bg-white/15 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 shadow-md">
                                                                    {event.category || 'Event'}
                                                                </div>

                                                                {/* University & Faculty Badge on Image Bottom */}
                                                                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white/95 text-xs font-bold truncate">
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/15 text-[11px]">
                                                                        <LuGraduationCap className="text-cyan-400 shrink-0" />
                                                                        <span className="truncate">{event.uni}{event.faculty ? ` • ${event.faculty}` : ''}</span>
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex flex-col flex-grow">
                                                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1 mb-2">
                                                                    {event.title}
                                                                </h3>

                                                                {/* Time & Location */}
                                                                <div className="flex flex-wrap items-center gap-3 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-3">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <LuMapPin className="text-blue-500 shrink-0" />
                                                                        <span className="truncate">{event.location}</span>
                                                                    </div>
                                                                    <span className="text-slate-300 dark:text-slate-700">•</span>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <LuClock className="text-blue-500 shrink-0" />
                                                                        <span>{event.time || '09:00 AM'}</span>
                                                                    </div>
                                                                </div>

                                                                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-normal line-clamp-2 mb-4 flex-grow">
                                                                    {event.description}
                                                                </p>

                                                                {/* Capacity Progress Bar (if exists) */}
                                                                {event.capacity && (
                                                                    <div className="mb-4 pt-3 border-t border-slate-100 dark:border-white/5 flex flex-col gap-1.5">
                                                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                                            <span>RSVP Capacity</span>
                                                                            <span className="text-blue-600 dark:text-cyan-400">{event.attendees?.length || 0} / {event.capacity} Spots</span>
                                                                        </div>
                                                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                            <div
                                                                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                                                                                style={{ width: `${Math.min(((event.attendees?.length || 0) / event.capacity) * 100, 100)}%` }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Interaction Buttons */}
                                                                <div className="pt-3 border-t border-slate-100 dark:border-white/5 grid grid-cols-[1fr_auto] gap-2.5 mt-auto">
                                                                    <button
                                                                        onClick={() => setSelectedEvent(event)}
                                                                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer border-none"
                                                                    >
                                                                        <LuTicket className="w-3.5 h-3.5" /> View & RSVP
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStartChat(event.id.toString())}
                                                                        className="flex items-center justify-center p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer border-none"
                                                                        title="Chat with Event Organizer"
                                                                    >
                                                                        <LuMessageCircle className="w-4 h-4" />
                                                                    </button>
                                                                </div>

                                                            </div>

                                                        </div>
                                                    </div>
                                                </motion.div>

                                                {(index + 1) % 6 === 0 && (
                                                    <div key={`ad-${index}`} className="col-span-1 md:col-span-2 lg:col-span-3">
                                                        <AdNativeFeed adIndex={Math.floor((index + 1) / 6) - 1} />
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </motion.div>
                            </AnimatePresence>

                            {/* Empty State */}
                            {displayEvents.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-white via-slate-50/80 to-blue-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/20 border border-slate-200/80 dark:border-white/10 shadow-2xl p-8 sm:p-12 text-center my-8"
                                >
                                    <div className="w-20 h-20 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                                        <LuCalendar className="w-9 h-9" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                                        No Events Scheduled
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                                        There are currently no active campus events. Check back soon!
                                    </p>
                                </motion.div>
                            )}

                            {/* Event Details Modal Popup */}
                            <EventDetails
                                event={selectedEvent}
                                isOpen={!!selectedEvent}
                                onClose={() => setSelectedEvent(null)}
                            />

                        </section>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EventList;
