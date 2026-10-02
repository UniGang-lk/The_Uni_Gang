import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LuCalendar,
  LuChevronRight,
  LuSparkles,
  LuGraduationCap,
  LuMapPin,
  LuTrendingUp,
  LuMusic,
  LuCode,
  LuTrophy
} from 'react-icons/lu';
import TiltCard from '../ui/TiltCard.tsx';
import PremiumPageLoader from '../ui/PremiumPageLoader';
import { useNavigate } from 'react-router-dom';
import PremiumTraceButton from '../ui/PremiumTraceButton';
import { api } from '../../api';
import CreateEventModal from './CreateEventModal';

const categories = [
  {
    icon: <LuMusic className="size-5 text-rose-500" />,
    title: 'Gigs & Cultural Festivals',
    desc: 'DJ nights, batch parties, talent shows, and university music carnivals.'
  },
  {
    icon: <LuCode className="size-5 text-cyan-500" />,
    title: 'Tech Summits & Hackathons',
    desc: 'Annual coding challenges, robotics forums, and startup pitch decks.'
  },
  {
    icon: <LuTrophy className="size-5 text-amber-500" />,
    title: 'Inter-Uni Sports meets',
    desc: 'Cricket championships, futsal leagues, and indoor sporting arenas.'
  }
];

const stats = [
  { label: 'Active Events', value: 124, icon: LuCalendar, color: 'text-rose-500 bg-rose-500/10' },
  { label: 'University Partners', value: 18, icon: LuGraduationCap, color: 'text-cyan-500 bg-cyan-500/10' },
  { label: 'User Engagement', value: '95%', icon: LuTrendingUp, color: 'text-amber-500 bg-amber-500/10' }
];

const Events = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);

  const defaultEventsList = [
    {
      id: 1,
      title: "Neon Nights: The University Concert",
      uni: "University of Moratuwa",
      date: "OCT 24",
      price: "Free",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "AI & Robotics Hackathon 2024",
      uni: "SLIIT Malabe",
      date: "NOV 05",
      price: "LKR 1,000",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Inter-Uni Cricket Championship 2024",
      uni: "University of Peradeniya",
      date: "NOV 12",
      price: "Free",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=500&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Batch Party '24 - Retro Night",
      uni: "University of Sri Jayewardenepura",
      date: "NOV 18",
      price: "LKR 1,500",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "CodeSprint IX Annual Summit",
      uni: "University of Kelaniya",
      date: "DEC 02",
      price: "Free",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=500&auto=format&fit=crop"
    }
  ];

  const displayEventsList = liveEvents.length > 0 ? liveEvents : defaultEventsList;

  // Load live approved events
  const fetchLiveEvents = async () => {
    try {
      const data = await api.getApprovedEvents();
      setLiveEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  useEffect(() => {
    fetchLiveEvents();
  }, []);

  const handleUpcomingClick = () => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/event-list');
      setTimeout(() => setIsNavigating(false), 100);
    }, 300);
  };

  return (
    <section id="events" className="relative py-32 bg-white dark:bg-[#020617] overflow-hidden">
      {/* Smooth Section Blend Overlays */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-white via-white dark:from-[#020617] dark:via-[#020617] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white dark:from-[#020617] dark:via-[#020617] to-transparent pointer-events-none z-10" />
      <PremiumPageLoader isLoading={isNavigating} message="Opening Events Hub..." />

      {/* ── Background Elements (Rose/Pink Accent) ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #f43f5e 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_70%,rgba(244,63,94,0.06),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_30%,rgba(236,72,153,0.05),transparent_50%)]" />

        {/* Ambient Glowing Orbs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-[380px] h-[380px] bg-rose-500/5 blur-[100px] rounded-full"
        />
      </div>

      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 lg:px-12 2xl:px-20 relative z-10">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black text-[10px] uppercase tracking-widest mb-4">
            <LuTrendingUp className="text-sm" /> Campus Vibe Center
          </div> */}
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Latest University <span className="text-rose-500 italic">Events</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Witness the pulse of university life. From tech summits to cultural musical nights, find and host campus fests in one spot.
          </p>
        </motion.div>

        {/* ── Asymmetric Layout (Swapped Sides: 45% Left / 55% Right & Scaled Up Visuals) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* LEFT: Descriptive Content & Create Event Action (45% / 5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex flex-col justify-between h-full min-h-[460px] gap-8"
          >
            <div className="space-y-6">

              {categories.map((cat, idx) => (
                <div key={idx} className="group flex gap-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 hover:border-rose-500/30 hover:bg-white dark:hover:bg-slate-900/80 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <div>
                    <h4 className="text-md font-bold text-slate-900 dark:text-white mb-1 group-hover:text-rose-500 transition-colors">{cat.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {cat.desc}
                    </p>
                  </div>
                </div>
              ))}

              {/* Host promotional info banner card */}
              <div className="p-5 rounded-2xl bg-rose-500/5 dark:bg-slate-950/40 border border-rose-500/10 dark:border-slate-800/60">
                <h4 className="text-xs font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  Host Your Campus Event
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Got an upcoming batch party, charity drive, or technical summit? Post your event details to immediately reach over 10,000+ active students islandwide.
                </p>
              </div>

            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-150 dark:border-slate-850">
              <PremiumTraceButton
                index={10}
                onClick={handleUpcomingClick}
                isLoading={isNavigating}
                icon={<LuChevronRight />}
                className="flex-1"
              >
                Explore Events Hub
              </PremiumTraceButton>

              <button
                onClick={() => setIsModalOpen(true)}
                className="py-4 px-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl active:scale-[0.98] transition-all border-none cursor-pointer"
              >
                Publish Your Event
              </button>
            </div>
          </motion.div>

          {/* RIGHT: Premium Event Flyer Tickets Collage (55% / 7 cols) — SCALED UP */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex justify-center relative min-h-[480px]"
          >
            <div className="relative w-full max-w-xl h-[580px]">

              {/* Rotating target circles (Scaled Up) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-[460px] h-[460px] border border-rose-500/20 rounded-full animate-[spin_32s_linear_infinite]" />
                <div className="absolute w-[340px] h-[340px] border border-dashed border-pink-500/20 rounded-full animate-[spin_24s_linear_infinite_reverse]" />
              </div>

              {/* Floating Icon 1: Music note near concert ticket */}
              <motion.div
                animate={{ y: [0, -15, 0], x: [0, 5, 0], rotate: [0, 15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 left-12 w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shadow-lg backdrop-blur-md z-30"
              >
                <LuMusic className="size-5" />
              </motion.div>

              {/* Floating Icon 2: Code brackets near tech card */}
              <motion.div
                animate={{ y: [0, 12, 0], x: [0, -8, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-28 right-0 w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center shadow-lg backdrop-blur-md z-30"
              >
                <LuCode className="size-4.5" />
              </motion.div>

              {/* Floating Icon 3: Trophy (Sports meet) at the bottom right */}
              <motion.div
                animate={{ y: [0, -12, 0], x: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-20 right-8 w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-lg backdrop-blur-md z-30"
              >
                <LuTrophy className="size-5" />
              </motion.div>

              {/* Floating Icon 4: Sparkles at the top center */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="absolute top-2 left-1/2 w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-500 flex items-center justify-center shadow-md backdrop-blur-sm z-30"
              >
                <LuSparkles className="size-4" />
              </motion.div>

              {/* Floating Icon 5: Graduation cap (Uni life) near bottom left */}
              <motion.div
                animate={{ y: [0, 10, 0], x: [0, 6, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="absolute bottom-16 left-2 w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center shadow-lg backdrop-blur-md z-30"
              >
                <LuGraduationCap className="size-4.5" />
              </motion.div>

              {/* Main Ticket Stack Card 1 (Music theme) — SCALED UP */}
              <TiltCard className="absolute top-24 left-2 w-[390px] z-20">
                <div className="relative group bg-white dark:bg-slate-900 rounded-[2.2rem] p-5 border border-white/50 dark:border-slate-800 shadow-2xl overflow-hidden cursor-pointer" onClick={handleUpcomingClick}>
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-[2.2rem] blur opacity-15 group-hover:opacity-35 transition duration-700" />

                  <div className="relative h-[230px] rounded-3xl overflow-hidden mb-4 bg-slate-900">
                    <img
                      src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop"
                      alt="Concert Flyer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-md">Music Fest</span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1 mb-1.5 group-hover:text-rose-500 transition-colors">
                    Neon Nights: The University Concert
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                    <LuMapPin size={12} className="text-rose-500" /> Main Auditorium, UOM
                  </div>
                </div>
              </TiltCard>

              {/* Stack Card 2 (Tech Theme) — SCALED UP */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[15.5rem] right-0 w-[320px] z-10 opacity-85 hover:opacity-100 transition-opacity"
              >
                <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] p-4.5 border border-white/40 dark:border-slate-800 shadow-xl overflow-hidden cursor-pointer" onClick={handleUpcomingClick}>
                  <div className="relative h-[185px] rounded-2xl overflow-hidden mb-3 bg-slate-900">
                    <img
                      src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500&auto=format&fit=crop"
                      alt="Tech Flyer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[8px] font-black uppercase bg-cyan-500 text-white shadow-md">Tech Summit</span>
                  </div>
                  <h5 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">AI Hackathon 2024</h5>
                </div>
              </motion.div>

              {/* Floating Date Badge (Top right floating) — SCALED UP */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute top-0 right-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl flex flex-col items-center border border-slate-150 dark:border-slate-750 shadow-xl min-w-[3.6rem] z-30 p-2.5"
              >
                <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">OCT</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 leading-none">24</span>
              </motion.div>

              {/* Attendees Avatar Stack Badge (Bottom left floating) ── SCALED UP */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute bottom-2 left-10 px-5 py-3 bg-slate-950/70 backdrop-blur-md border border-white/10 rounded-2xl text-white shadow-2xl flex items-center gap-3.5 z-30"
              >
                <div className="flex -space-x-2">
                  {['1', '2', '3'].map((img) => (
                    <img key={img} src={`https://i.pravatar.cc/100?u=${img}`} className="w-6 h-6 rounded-full border border-slate-950 object-cover" alt="user" />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── Live Auto-Scrolling Latest Events Ticker Marquee Carousel ── */}
        <div className="mt-16 mb-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 dark:text-white">
                Live Campus Events Ticker
              </h4>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline-block">
              Hover to Pause • Click to Explore
            </span>
          </div>

          <div className="w-full overflow-hidden relative group/marquee py-2">
            {/* Ambient gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-[#020617] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-[#020617] to-transparent z-20 pointer-events-none" />

            <div className="flex gap-5 animate-marquee whitespace-nowrap">
              {[...displayEventsList, ...displayEventsList].map((event, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate('/event-list')}
                  className="inline-flex items-center gap-4 p-3 pr-6 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/10 shadow-lg hover:border-rose-500/50 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer shrink-0"
                >
                  <img
                    src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=300'}
                    alt={event.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                  />
                  <div className="text-left max-w-[210px]">
                    <span className="text-[9px] font-black uppercase tracking-wider text-rose-500 flex items-center gap-1 truncate">
                      <LuMapPin size={11} className="shrink-0" /> {event.uni || event.university || 'Campus Fest'}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate my-0.5">
                      {event.title}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <LuCalendar size={11} className="shrink-0" /> {event.date || 'Upcoming'} • {event.price ? `Rs. ${event.price}` : 'Free Entry'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Premium Stats Section (3 Columns) ── */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mt-20 pt-8 border-t border-slate-200/50 dark:border-slate-800/40">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} mb-3`}>
                  <Icon className="text-base" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-none mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ── Create Campus Event Modal ── */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLiveEvents}
      />
    </section>
  );
};

export default Events;
