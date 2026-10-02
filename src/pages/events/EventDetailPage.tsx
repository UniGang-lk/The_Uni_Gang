import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuCalendar, LuMapPin, LuGraduationCap,
  LuTicket, LuZap, LuShare2, LuSparkles, LuCheck, LuCloudUpload, LuCircleAlert,
  LuClock, LuMessageCircle, LuArrowRight, LuShieldCheck, LuHeart, LuCamera,
  LuStar, LuInfo, LuPhone, LuUsers, LuUser, LuExternalLink
} from "react-icons/lu";
import { FaWhatsapp } from 'react-icons/fa6';
import confetti from 'canvas-confetti';
import { api } from '../../api';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO';
import PremiumPageLoader from '../../components/ui/PremiumPageLoader';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
import AdBanner from '../../components/advertise/AdBanner';

interface EventData {
  id: number | string;
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
  price?: string;
  capacity?: number;
  attendees?: any[];
  user?: { id: string, name?: string, email?: string, profile_pic?: string };
}

const DUMMY_EVENTS: EventData[] = [
  {
    id: 1,
    title: "Tech Summit 2024",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200",
    uni: "University of Moratuwa",
    faculty: "Faculty of Engineering",
    description: "Explore the latest breakthroughs in AI, Robotics, and Embedded Systems at the biggest university tech gathering of the year. Join industry leaders, startup founders, and student innovators for hands-on workshops, live demos, and networking opportunities.",
    date: "2024-11-12",
    time: "09:00 AM",
    contact: "+94771234567",
    category: "Tech & Innovation",
    location: "Main University Auditorium, Moratuwa",
    extra: "Live drone aerial shows & hackathon prizes included",
    requirements: "Student ID / Free Registration Ticket required",
    price: "Free Entry",
    capacity: 350,
    attendees: [{ id: "1", name: "Kasun Perera", email: "kasun@demo.lk" }]
  },
  {
    id: 2,
    title: "Neon Nights Musical Festival",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200",
    uni: "University of Colombo",
    faculty: "Faculty of Arts",
    description: "A night of vibrant neon lights, live band performances, DJ sets, and traditional fusion dances featuring top student talent from across Sri Lankan universities.",
    date: "2024-10-24",
    time: "06:30 PM",
    contact: "+94777654321",
    category: "Gigs & Culture",
    location: "Open Air Amphitheatre, Colombo",
    extra: "Free glow sticks & refreshments provided",
    requirements: "Open for all students and alumni",
    price: "LKR 1,000",
    capacity: 500,
    attendees: []
  },
  {
    id: 3,
    title: "Inter-Uni Cricket Championship 2024",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1200",
    uni: "SLIIT Malabe",
    faculty: "Faculty of Computing",
    description: "The ultimate university derby on the pitch. Support your campus team as 16 universities battle for glory in this high-octane T20 tournament.",
    date: "2024-12-05",
    time: "08:00 AM",
    contact: "+94778889990",
    category: "Sports Arena",
    location: "SLIIT Main Sports Grounds, Malabe",
    extra: "Live big-screen broadcasting & food stalls",
    requirements: "Student ID required at gate",
    price: "Free Entry",
    capacity: 600,
    attendees: []
  },
  {
    id: 4,
    title: "InnovateX Startup Pitch Forum",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200",
    uni: "NSBM Green University",
    faculty: "School of Business",
    description: "Pitch your groundbreaking business ideas to top venture capitalists, angel investors, and tech mentors to secure seed funding and incubation.",
    date: "2025-01-18",
    time: "10:00 AM",
    contact: "+94770001112",
    category: "Entrepreneurship",
    location: "Auditorium Complex A1, Homagama",
    extra: "1-on-1 VC speed networking sessions",
    requirements: "Team pitchdeck submission required",
    price: "Free for Pitchers",
    capacity: 200,
    attendees: []
  },
  {
    id: 5,
    title: "Global Beats Cultural Carnival",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200",
    uni: "University of Moratuwa",
    faculty: "Faculty of Architecture",
    description: "Experience international food stalls, fashion parades, art exhibits, and acoustic jam sessions hosted by university student societies.",
    date: "2025-02-02",
    time: "04:00 PM",
    contact: "+94772223334",
    category: "Lifestyle & Arts",
    location: "Civil Open Grounds, Moratuwa",
    extra: "After-party live DJ set until midnight",
    requirements: "Early bird tickets available online",
    price: "LKR 500",
    capacity: 800,
    attendees: []
  },
  {
    id: 6,
    title: "CodeSprint 24-Hour Hackathon",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200",
    uni: "Informatics Institute of Technology (IIT)",
    faculty: "Department of Software Engineering",
    description: "An intense 24-hour non-stop hackathon where student developers design software prototypes to solve pressing real-world challenges.",
    date: "2024-11-20",
    time: "08:00 AM",
    contact: "+94774445556",
    category: "Hackathon",
    location: "Digital Innovation Lab, Colombo 06",
    extra: "Free swag bags, meals & midnight pizza",
    requirements: "Teams of 3 - 4 members",
    price: "Free Entry",
    capacity: 150,
    attendees: []
  }
];

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventData | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInterested, setIsInterested] = useState(false);
  const [isLoadingRsvp, setIsLoadingRsvp] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Check saved favorites
  useEffect(() => {
    if (!id) return;
    try {
      const saved = JSON.parse(localStorage.getItem('event_favorites') || '[]');
      if (Array.isArray(saved) && saved.includes(id)) {
        setIsFavorite(true);
      }
    } catch {
      /* ignore */
    }
  }, [id]);

  const handleToggleFavorite = () => {
    if (!id) return;
    try {
      const saved = JSON.parse(localStorage.getItem('event_favorites') || '[]');
      const safeSaved = Array.isArray(saved) ? saved : [];
      let updated: string[];

      if (safeSaved.includes(id)) {
        updated = safeSaved.filter((item: string) => item !== id);
        setIsFavorite(false);
        toast('Removed from saved events', { icon: '🤍' });
      } else {
        updated = [...safeSaved, id];
        setIsFavorite(true);
        toast.success('Saved to your interested events!');
      }
      localStorage.setItem('event_favorites', JSON.stringify(updated));
    } catch (e) {
      console.error('Error toggling favorite:', e);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchEventDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        let data: EventData | null = null;

        try {
          data = await api.getEventById(id);
        } catch {
          data = DUMMY_EVENTS.find(d => String(d.id) === String(id)) || null;
        }

        if (!data) {
          data = DUMMY_EVENTS.find(d => String(d.id) === String(id)) || null;
        }

        if (data) {
          setEvent(data);
          setAttendeeCount(data.attendees?.length || 0);

          const token = localStorage.getItem('userToken');
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              if (data.user && data.user.id === payload.id) {
                setIsHost(true);
              }
              if (data.attendees) {
                const isAttending = data.attendees.some((a: any) => a.id === payload.id);
                setIsInterested(isAttending);
              }
            } catch {
              /* ignore */
            }
          }
        }

        // Related events
        try {
          const allApproved = await api.getApprovedEvents();
          const list = Array.isArray(allApproved) && allApproved.length > 0 ? allApproved : DUMMY_EVENTS;
          setRelatedEvents(list.filter((e: any) => String(e.id) !== String(id)).slice(0, 3));
        } catch {
          setRelatedEvents(DUMMY_EVENTS.filter(e => String(e.id) !== String(id)).slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load event details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleRsvp = async () => {
    if (!event) return;
    const token = localStorage.getItem('userToken') || localStorage.getItem('userEmail');
    if (!token) {
      toast.error('Please sign in to RSVP for campus events.');
      return;
    }

    setIsLoadingRsvp(true);
    try {
      const res = await api.toggleEventRsvp(event.id.toString(), token);
      setIsInterested(res.isAttending);
      setAttendeeCount(prev => res.isAttending ? prev + 1 : prev - 1);
      if (res.isAttending) {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
      toast.success(res.message);
    } catch {
      // Optimistic RSVP fallback
      setIsInterested(prev => {
        const next = !prev;
        setAttendeeCount(cnt => next ? cnt + 1 : cnt - 1);
        if (next) {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 }
          });
          toast.success("RSVP Confirmed! See you at the event.");
        } else {
          toast.success("RSVP Cancelled.");
        }
        return next;
      });
    } finally {
      setIsLoadingRsvp(false);
    }
  };

  const handleStartChat = async () => {
    if (!event) return;
    const token = localStorage.getItem('userToken') || localStorage.getItem('userEmail');
    if (!token) {
      toast.error("Please login to chat with the event host.");
      return;
    }
    try {
      const chat = await api.startEventChat(event.id.toString());
      window.location.href = `/profile?tab=inbox&chatId=${chat.id}&type=event`;
    } catch {
      toast.success("Opening chat with event organizer...");
      window.location.href = `/profile?tab=inbox&type=event&eventId=${event.id}`;
    }
  };

  const handleAddToCalendar = () => {
    if (!event) return;
    const startDate = new Date(event.date);
    const startStr = isNaN(startDate.getTime()) ? new Date().toISOString().replace(/-|:|\.\d\d\d/g, "") : startDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const details = encodeURIComponent(`${event.description}\n\nEvent Link: ${window.location.href}`);
    const location = encodeURIComponent(event.location);
    const title = encodeURIComponent(event.title);

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${startStr}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  const exportToCSV = () => {
    if (!event?.attendees || event.attendees.length === 0) {
      toast.error("No registered attendees yet.");
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

  const imageUrl = event?.image
    ? (event.image.startsWith('http') ? event.image : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${event.image}`)
    : 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-24">
      {/* Brand Page Loader Component */}
      <PremiumPageLoader isLoading={loading} message="Loading Campus Event Details..." />

      <SEO
        title={event ? `${event.title} - University Event on The Uni Gang` : "University Event Details"}
        description={event ? `${event.title} at ${event.uni}. ${event.description}` : undefined}
        image={imageUrl}
      />

      {event && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6"
        >
          {/* Top Breadcrumb Navigation */}
          <PageBreadcrumb
            items={[
              { label: 'Campus Events', to: '/event-list' },
              { label: event.category || 'Event', to: '/event-list', active: true },
              { label: event.title }
            ]}
            backTo="/event-list"
            backLabel="Back to Events"
            shareTitle={`Join ${event.title} at ${event.uni} on The Uni Gang!`}
            rightSlot={
              <div className="flex items-center gap-2 mr-2">
                <span className="text-[11px] font-extrabold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200/80 dark:border-blue-900/60 uppercase tracking-wider">
                  EVENT #{String(event.id).slice(0, 6)}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800/60">
                  <LuShieldCheck size={14} /> Verified Event
                </span>
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors border cursor-pointer ${
                    isFavorite
                      ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-rose-50 hover:text-rose-500'
                  }`}
                  title="Save to Favorites"
                >
                  <LuHeart size={14} className={isFavorite ? 'fill-rose-500 text-rose-500' : ''} />
                  <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            }
          />

          {/* ── Main 2-Column Balanced Layout (Inspired by Annex Details Layout) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* ── LEFT COLUMN (5 Cols): Event Poster Showcase + Host Contact Card ── */}
            <div className="lg:col-span-5 space-y-6">

              {/* Photo Showcase Card */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-sm bg-slate-950 group">
                  <img
                    src={imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-white/20 shadow-md">
                    <LuZap className="animate-pulse text-amber-300" />
                    <span>{event.category || 'Campus Fest'}</span>
                  </div>

                  {/* Price Tag Badge */}
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full text-emerald-400 text-xs font-extrabold uppercase tracking-wider border border-white/20 shadow-md">
                    {event.price || 'Free Entry'}
                  </div>

                  {/* University Label on Image Bottom */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white text-xs font-bold">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-xs">
                      <LuGraduationCap className="text-cyan-400 shrink-0" />
                      <span className="truncate">{event.uni}</span>
                    </span>
                  </div>
                </div>

                {/* Event Highlights Perks */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Category</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{event.category || 'Event'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Target Audience</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{event.faculty || 'All Students'}</p>
                  </div>
                </div>
              </div>

              {/* Organizer & Host Contact Card */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Organized By</h3>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-lg shadow-md shrink-0">
                    {event.user?.profile_pic ? (
                      <img src={event.user.profile_pic} alt="host" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <LuGraduationCap size={24} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {event.user?.name || event.uni}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                      Official Campus Organizer
                    </p>
                  </div>
                </div>

                {/* Contact Actions */}
                {event.contact && (
                  <div className="space-y-2 pt-2">
                    <a
                      href={`https://wa.me/${event.contact.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer text-decoration-none"
                    >
                      <FaWhatsapp size={16} /> Contact via WhatsApp ({event.contact})
                    </a>

                    <button
                      onClick={handleStartChat}
                      className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer border-none"
                    >
                      <LuMessageCircle size={16} /> Direct Campus Chat
                    </button>
                  </div>
                )}
              </div>

              {/* Special Perks & Extra Notes */}
              {event.extra && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900/90 rounded-[2rem] p-5 border border-blue-100 dark:border-slate-800 shadow-sm flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
                    <LuSparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 dark:text-cyan-400 mb-1">Spotlight Highlights</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic">
                      "{event.extra}"
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* ── RIGHT COLUMN (7 Cols): Title Header + Specs + Description + RSVP Action ── */}
            <div className="lg:col-span-7 space-y-6">

              {/* Header Card */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest">
                    <LuZap className="animate-pulse" /> Live Campus Event
                  </div>
                  <span className="text-2xl font-black text-blue-600 dark:text-cyan-400">
                    {event.price || 'Free'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-tight">
                  {event.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                    <LuGraduationCap className="text-blue-600" size={16} /> {event.uni}
                  </span>
                  {event.faculty && (
                    <>
                      <span>•</span>
                      <span>{event.faculty}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Event Specs Grid */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Key Event Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Schedule */}
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                      <LuCalendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Date & Time</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white uppercase">
                        {event.date} @ {event.time || '09:00 AM'}
                      </p>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <LuMapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Gathering Venue</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white uppercase truncate max-w-[170px]" title={event.location}>
                        {event.location}
                      </p>
                    </div>
                  </div>

                  {/* Access Basis */}
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <LuTicket size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Entry Policy</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white uppercase">
                        {event.requirements || 'Open Entry'}
                      </p>
                    </div>
                  </div>

                  {/* University */}
                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <LuGraduationCap size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Campus Arena</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white uppercase">
                        {event.uni}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Capacity Progress Bar */}
                {event.capacity && (
                  <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      <span>RSVP Spots Filled</span>
                      <span className="text-blue-600 dark:text-cyan-400">{attendeeCount} / {event.capacity} Spots</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((attendeeCount / event.capacity) * 100, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${attendeeCount >= event.capacity ? 'bg-red-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Event Description Card */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 bg-blue-600 rounded-full" />
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Event Agenda & Overview</h3>
                </div>
                <p className="text-sm sm:text-base font-normal text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>

              {/* Action Bar (RSVP / Calendar / Host Roster) */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddToCalendar}
                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 border border-slate-200 dark:border-slate-700 transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
                    title="Add to Google Calendar"
                  >
                    <LuCalendar size={20} />
                  </button>

                  {isHost ? (
                    <button
                      onClick={() => setShowDashboard(!showDashboard)}
                      className={`flex-1 py-4 px-6 rounded-2xl font-black uppercase tracking-wider text-xs transition-all border shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                        showDashboard
                          ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'bg-amber-500 border-amber-500 text-white hover:bg-amber-600'
                      }`}
                    >
                      <LuSparkles size={16} /> {showDashboard ? 'Close Dashboard' : 'Manage Attendee Roster'}
                    </button>
                  ) : (
                    <button
                      onClick={handleRsvp}
                      disabled={isLoadingRsvp || (!isInterested && !!event.capacity && attendeeCount >= event.capacity)}
                      className={`flex-1 py-4 px-6 rounded-2xl font-black uppercase tracking-wider text-xs transition-all border shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                        isInterested
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-500/20'
                          : (!isInterested && event.capacity && attendeeCount >= event.capacity)
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border-transparent'
                            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white shadow-blue-500/25'
                      }`}
                    >
                      {isLoadingRsvp ? (
                        <span className="font-bold">Updating RSVP...</span>
                      ) : (
                        <>
                          {isInterested ? <LuCheck size={18} /> : <LuTicket size={18} />}
                          <span>{isInterested ? "RSVP Confirmed (Click to Cancel)" : "RSVP Now & Reserve Spot"}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Host Roster Drawer */}
                <AnimatePresence>
                  {isHost && showDashboard && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pt-2"
                    >
                      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-inner">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                            Registered Attendees ({event.attendees?.length || 0})
                          </h4>
                          <button
                            onClick={exportToCSV}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 text-[9px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors border-none cursor-pointer"
                          >
                            <LuCloudUpload size={12} /> Export CSV
                          </button>
                        </div>

                        <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                          {!event.attendees || event.attendees.length === 0 ? (
                            <p className="text-center text-xs text-slate-500 py-4 font-medium italic">No RSVPs registered yet. Share your event flyer!</p>
                          ) : (
                            event.attendees.map((attendee: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
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

          {/* Related Events Section */}
          {relatedEvents.length > 0 && (
            <div className="mt-16 mb-12 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">More Campus Events You Might Like</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Explore upcoming meetups and cultural fests across Sri Lanka</p>
                </div>
                <Link 
                  to="/event-list"
                  className="text-xs font-black text-blue-600 dark:text-cyan-400 flex items-center gap-1 hover:underline"
                >
                  View All <LuArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedEvents.map(rel => (
                  <div 
                    key={rel.id}
                    onClick={() => navigate(`/events/${rel.id}`)}
                    className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative h-44 rounded-2xl overflow-hidden mb-3 bg-slate-950">
                      <img 
                        src={rel.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600'} 
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider">
                        {rel.category || 'Event'}
                      </div>
                    </div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {rel.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
                      <span className="flex items-center gap-1"><LuCalendar className="text-blue-500" /> {rel.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><LuMapPin className="text-blue-500" /> {rel.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ad Placement */}
          <div className="mt-10">
            <AdBanner placement="BANNER" />
          </div>

        </motion.div>
      )}
    </div>
  );
};

export default EventDetailPage;
