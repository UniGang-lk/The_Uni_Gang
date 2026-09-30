import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LuMic, LuTrendingUp, LuQuote } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import TiltCard from '../ui/TiltCard';
import PremiumTraceButton from '../ui/PremiumTraceButton';
import PremiumPageLoader from '../ui/PremiumPageLoader';
import campusLife from "../../assets/campus-life.jpg";
import BlogCard from '../../pages/blogs/ArticleCard';
import { Blog } from '../../types/blog';
import { api } from '../../api';

const latestBlogs: Blog[] = [
  {
    id: '1',
    title: 'Surviving Finals Week: A Practical Guide',
    slug: 'surviving-finals-week',
    excerpt: 'The ultimate guide to managing your time, stress, and study techniques during the most critical week of the semester.',
    content: '',
    author: {
      id: 'a1',
      name: 'Sarah Perera',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      university: 'University of Colombo'
    },
    category: 'Campus Life',
    featuredImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-04-20T10:00:00Z',
    readTime: '5 min read',
    likes: 124,
    views: 1450,
    isTrending: true,
    tags: ['study', 'tips']
  },
  {
    id: '2',
    title: 'Top 5 Skills Every IT Graduate Needs',
    slug: 'top-5-it-skills',
    excerpt: 'Industry experts share their thoughts on what makes a fresh IT graduate stand out in today\'s competitive job market.',
    content: '',
    author: {
      id: 'a2',
      name: 'Kavindu Silva',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavindu',
      university: 'SLIIT'
    },
    category: 'Career Advice',
    featuredImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-04-18T14:30:00Z',
    readTime: '7 min read',
    likes: 89,
    views: 920,
    isTrending: false,
    tags: ['career', 'tech']
  },
  {
    id: '3',
    title: 'My Experience at the Hackathon 2026',
    slug: 'hackathon-experience-2026',
    excerpt: 'A first-hand account of the adrenaline, the code, and the teamwork that led us to the top 10 at this year\'s biggest hackathon.',
    content: '',
    author: {
      id: 'a3',
      name: 'Amanda Peiris',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda',
      university: 'University of Moratuwa'
    },
    category: 'Technology',
    featuredImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    createdAt: '2026-04-15T09:15:00Z',
    readTime: '4 min read',
    likes: 210,
    views: 3100,
    isTrending: true,
    tags: ['hackathon', 'coding']
  }
];

const Blogs = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await api.getBlogs();
        setBlogs(data);
      } catch (err) {
        console.error('Failed to fetch latest blogs:', err);
      }
    };
    fetchLatest();
  }, []);

  const handleExploreFeed = () => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/blogs');
      setTimeout(() => setIsNavigating(false), 500);
    }, 300);
  };

  return (
    <section id="blogs" className="relative py-32 bg-slate-150 dark:bg-[#020617] overflow-hidden">
      {/* Smooth Section Blend Overlays */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-slate-150 via-slate-150 dark:from-[#020617] dark:via-[#020617] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-150 via-slate-150 dark:from-[#020617] dark:via-[#020617] to-transparent pointer-events-none z-10" />
      <PremiumPageLoader isLoading={isNavigating} message="Opening the blog archive..." />
      {/* 🌌 High-End Mesh Gradient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_35%,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_65%,rgba(99,102,241,0.08),transparent_50%)]" />

        {/* Animated Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-blue-400/10 blur-[120px] rounded-full"
        />
      </div>

      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 lg:px-12 2xl:px-20 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Campus <span className="text-blue-800 italic">Blogs</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Beyond the lecture halls lies a wealth of experience. Our Blogs section is the definitive space for Sri Lankan students to document their journey, share technical breakthroughs, and inspire the next generation.
          </p>
        </motion.div>

        {/* Filters & Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16"
        >
          {/* Left Side: Filter */}
          <div className="flex flex-wrap gap-4">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="bg-blue-800 text-white shadow-md shadow-blue-800/20 px-8 py-3 rounded-full text-sm font-semibold cursor-pointer backdrop-blur-md transition-all"
            >
              Latest Stories
            </motion.span>
          </div>

          {/* Right Side Actions: PREMIUM TRACE BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <PremiumTraceButton
              index={5}
              icon={<span className="material-symbols-outlined">east</span>}
              onClick={handleExploreFeed}
              className="w-full sm:w-auto"
            >
              Read the Collection
            </PremiumTraceButton>

            <PremiumTraceButton
              index={6}
              icon={<span className="material-symbols-outlined">auto_awesome</span>}
              onClick={() => navigate('/submit-blog')}
              className="w-full sm:w-auto"
            >
              Submit Entry
            </PremiumTraceButton>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center mt-12">
          {/* Left Side: Latest Blogs Grid (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col w-full h-full justify-center">
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-between mb-8"
            >
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Latest <span className="text-blue-800 italic">Entries</span>
              </h3>
              <span onClick={handleExploreFeed} className="text-blue-600 font-bold text-sm cursor-pointer hover:underline flex items-center gap-1 transition-all">
                View All <span className="material-symbols-outlined text-[16px]">east</span>
              </span>
            </motion.div> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(blogs.length > 0 ? blogs.slice(0, 2) : latestBlogs.slice(0, 2)).map((blog, idx) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </div>
          </div>


          {/* Right Side: Modern 3D Visual Collage & Metrics (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start gap-12">

            {/* Modern 3D Visual Collage */}
            <div className="relative h-[500px] flex items-center justify-center w-full max-w-sm lg:max-w-md mx-auto lg:mx-0">

              {/* Background Decorative Rings */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-[400px] h-[400px] border border-blue-500 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute w-[300px] h-[300px] border border-dashed border-indigo-500 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              </div>

              <TiltCard className="w-full max-w-md relative z-20">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                  <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 border border-white/50 dark:border-slate-800 shadow-2xl">
                    <div className="relative h-[400px] rounded-[2rem] overflow-hidden">
                      <img
                        src={campusLife}
                        alt="Campus"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      {/* Floating Info Overlays */}
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute top-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white"
                      >
                        <LuQuote className="text-blue-400 mb-2" />
                        <p className="text-xs font-medium leading-relaxed italic">
                          "The best way to predict your future is to document your growth along the way."
                        </p>
                      </motion.div>

                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-3 mb-2">
                          <LuMic className="text-blue-500" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Recording Now</span>
                        </div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Unleash <br /> Your Story.</h4>
                      </div>
                    </div>
                  </div>

                  {/* Floating "Live" Article Card */}
                  <motion.div
                    initial={{ x: 60, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -right-8 top-1/2 -translate-y-1/2 w-56 bg-white dark:bg-slate-800 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-700 p-4 hidden xl:block z-30"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                        <LuTrendingUp size={16} />
                      </div>
                      <div>
                        <div className="text-[8px] font-black text-blue-600 uppercase">Top Blogger</div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Mithun Bandara</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full" />
                      <div className="w-3/4 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full" />
                    </div>
                  </motion.div>
                </div>
              </TiltCard>

              {/* Random Floating Particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -40, 0],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                  className="absolute w-2 h-2 bg-blue-500 rounded-full blur-[1px]"
                  style={{
                    top: `${20 + i * 15}%`,
                    left: `${10 + i * 20}%`
                  }}
                />
              ))}
            </div>
            {/* Quick Metrics */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex w-full justify-center lg:justify-start gap-12"
            >
              <div className="text-center lg:text-left">
                <div className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-2">500<span className="text-blue-600">+</span></div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thought Pieces</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-2">15<span className="text-indigo-600">k</span></div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Peers</div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Blogs;
