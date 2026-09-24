import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  LuSearch,
  LuTrendingUp,
  LuSparkles,
  LuPenTool,
  LuMessageSquare,
  LuBookOpen,
  LuFlame,
  LuClock,
  LuThumbsUp,
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuTag,
  LuCompass,
  LuGraduationCap,
  LuBriefcase,
  LuLaptop,
  LuHouse,
  LuActivity,
  LuUsers,
  LuPartyPopper,
  LuMessageCircle,
  LuPenLine,
  LuArrowRight,
  LuLayers
} from 'react-icons/lu';
import { api } from '../../api';
import { Blog, Contributor, BlogCategory } from '../../types/blog';
import BlogCard from './ArticleCard';
import ContributorLeaderboard from './ContributorLeaderboard';
import SEO from '../../components/SEO';
import PremiumPageLoader from '../../components/ui/PremiumPageLoader';
import TiltCard from '../../components/ui/TiltCard';
import AdSidebarWidget from '../../components/advertise/AdSidebarWidget';
import AdNativeFeed from '../../components/advertise/AdNativeFeed';

const FloatingIcon = ({ icon: Icon, index }: { icon: React.ComponentType, index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.2, 0.5, 0.2],
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

interface CategoryItem {
  label: BlogCategory | 'All';
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryItem[] = [
  { label: 'All', icon: LuCompass },
  { label: 'Campus Life', icon: LuGraduationCap },
  { label: 'Career Advice', icon: LuBriefcase },
  { label: 'Exam Tips', icon: LuBookOpen },
  { label: 'Technology', icon: LuLaptop },
  { label: 'Student Accommodation', icon: LuHouse },
  { label: 'Sports & Fitness', icon: LuActivity },
  { label: 'Clubs & Societies', icon: LuUsers },
  { label: 'Events & Festivities', icon: LuPartyPopper },
  { label: 'General Discussion', icon: LuMessageCircle },
];

const POPULAR_TOPICS = [
  'CampusLife',
  'ExamTips',
  'FirstYearAdvice',
  'TechTrends',
  'HostelLife',
  'CareerRoadmap',
  'StudyTechniques',
  'StudentBudget'
];

type SortMode = 'trending' | 'latest' | 'popular';

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortMode>('trending');

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [blogsData, contributorsData] = await Promise.all([
          api.getBlogs(),
          api.getContributors().catch(() => [])
        ]);
        setBlogs(blogsData);
        setContributors(contributorsData);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setTimeout(() => setLoading(false), 100);
      }
    };
    fetchData();
  }, []);

  // Category counts
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { All: blogs.length };
    blogs.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return counts;
  }, [blogs]);

  // Filtering & Sorting
  const filteredBlogs = React.useMemo(() => {
    return blogs
      .filter((blog) => {
        const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          blog.title.toLowerCase().includes(query) ||
          blog.excerpt.toLowerCase().includes(query) ||
          (blog.tags && blog.tags.some((t) => t.toLowerCase().includes(query)));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'trending') {
          if (a.isTrending && !b.isTrending) return -1;
          if (!a.isTrending && b.isTrending) return 1;
          return (b.likes + b.views) - (a.likes + a.views);
        }
        if (sortBy === 'latest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'popular') {
          return (b.likes || 0) - (a.likes || 0);
        }
        return 0;
      });
  }, [blogs, selectedCategory, searchQuery, sortBy]);

  const featuredBlog = blogs.find((a) => a.isTrending) || blogs[0];

  // Scroll category bar horizontally
  const handleScrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
      <SEO
        title="Campus Blogs - The Uni Gang"
        description="Share and discover campus stories, career advice, and tech tips from fellow students."
      />

      <PremiumPageLoader isLoading={loading} message="Loading Campus Stories..." />

      <AnimatePresence>
        {!loading && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            {/* Background Decorative Globs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
              <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-6 pb-14 px-4 md:px-8 max-w-7xl mx-auto z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/60 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-200/50 dark:border-blue-800/50">
                    <LuSparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                    <span>Sri Lanka's Student Publication</span>
                  </div> */}

                  <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight">
                    Campus Voices & <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                      Student Wisdom.
                    </span>
                  </h1>

                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed font-medium">
                    Raw stories, genuine exam hacks, career roadmaps, and tech guides written by university peers across Sri Lanka.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <img
                          key={i}
                          src={`https://i.pravatar.cc/100?u=${i + 25}`}
                          className="w-11 h-11 rounded-full border-3 border-white dark:border-slate-900 object-cover shadow-sm"
                          alt="avatar"
                        />
                      ))}
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center border-3 border-white dark:border-slate-900 text-white text-xs font-black shadow-sm">
                        +5K
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none">
                        5,000+ Student Readers
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                        Active writers across 15+ campuses
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="relative mt-8 lg:mt-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-[3rem] blur-3xl" />

                  {/* Floating Dynamic Icons */}
                  <FloatingIcon icon={LuPenTool} index={0} />
                  <FloatingIcon icon={LuSparkles} index={1} />
                  <FloatingIcon icon={LuMessageSquare} index={2} />
                  <FloatingIcon icon={LuBookOpen} index={3} />

                  <TiltCard>
                    <div className="relative rounded-[2.5rem] overflow-hidden border border-white/40 dark:border-white/10 shadow-2xl bg-white/20 backdrop-blur-md p-4 sm:p-5">
                      <div className="relative h-[380px] sm:h-[440px] rounded-[2rem] overflow-hidden group">
                        <img
                          src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          alt="Blogging"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                        <div className="absolute bottom-8 left-8 right-8 space-y-3">
                          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 text-white text-xs font-bold">
                            <LuSparkles className="w-3.5 h-3.5 text-yellow-300" />
                            <span>Share Your Journey</span>
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                            Your Campus Experiences Can Inspire Others
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 font-medium">
                            Join student contributors writing about semester survival, internships, and university memories.
                          </p>
                          <div className="pt-2">
                            <Link
                              to="/submit-blog"
                              className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-blue-50 transition-colors"
                            >
                              <LuPenLine className="w-4 h-4 text-blue-600" />
                              <span>Start Writing Today</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              </div>
            </section>

            {/* Redesigned Discovery & Exploration Console */}
            <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10 mb-10">
              <div className="p-4 sm:p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none space-y-4">
                {/* Search Bar & Sorters Row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  {/* Search input with live clear */}
                  <div className="relative w-full md:max-w-md">
                    <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search stories, tips, universities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/80 dark:bg-slate-800/50 py-3 pl-11 pr-10 text-sm font-medium focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none dark:border-slate-700/80 dark:text-white transition-all shadow-inner"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                      >
                        <LuX className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Sorters & Results Counter */}
                  <div className="flex items-center justify-between w-full md:w-auto gap-3">
                    <span className="text-xs font-semibold text-slate-400">
                      {filteredBlogs.length} {filteredBlogs.length === 1 ? 'Story' : 'Stories'}
                    </span>

                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700/60 text-xs">
                      <button
                        type="button"
                        onClick={() => setSortBy('trending')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${sortBy === 'trending'
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                      >
                        <LuFlame className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Trending</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSortBy('latest')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${sortBy === 'latest'
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                      >
                        <LuClock className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Latest</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSortBy('popular')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${sortBy === 'popular'
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                      >
                        <LuThumbsUp className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Popular</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Horizontal Category Ribbon with Smooth Controls */}
                <div className="relative pt-2 border-t border-slate-100 dark:border-slate-800">
                  {/* Left scroll control */}
                  <button
                    type="button"
                    onClick={() => handleScrollCategories('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors hidden md:flex"
                    aria-label="Scroll categories left"
                  >
                    <LuChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Scrollable category list */}
                  <div
                    ref={categoryScrollRef}
                    className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 md:px-8"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = selectedCategory === cat.label;
                      const count = categoryCounts[cat.label] || 0;

                      return (
                        <button
                          key={cat.label}
                          type="button"
                          onClick={() => setSelectedCategory(cat.label)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${isSelected
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                              : 'bg-slate-100/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200/50 dark:border-slate-700/40'
                            }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{cat.label}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-200/80 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                              }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right scroll control */}
                  <button
                    type="button"
                    onClick={() => handleScrollCategories('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors hidden md:flex"
                    aria-label="Scroll categories right"
                  >
                    <LuChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Layout: Blogs Feed + Sidebar */}
            <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Blogs Feed (8 cols) */}
                <div className="lg:col-span-8 space-y-10">
                  {/* Featured Blog (shown when viewing All and no search) */}
                  {featuredBlog && selectedCategory === 'All' && !searchQuery && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        <LuTrendingUp className="w-4 h-4" />
                        <span>Featured Story of the Week</span>
                      </div>
                      <BlogCard blog={featuredBlog} isFeatured={true} />
                    </div>
                  )}

                  {/* Blogs Feed Grid */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <LuLayers className="w-5 h-5 text-blue-600" />
                        <span>{selectedCategory === 'All' ? 'All Stories' : selectedCategory}</span>
                      </h2>

                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Clear search
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredBlogs.map((blog, index) => (
                        <React.Fragment key={blog.id}>
                          <BlogCard blog={blog} />
                          {(index + 1) % 4 === 0 && (
                            <div className="col-span-1 md:col-span-2">
                              <AdNativeFeed adIndex={Math.floor((index + 1) / 4) - 1} />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Empty State */}
                    {filteredBlogs.length === 0 && (
                      <div className="text-center py-20 px-6 bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                          <LuSearch className="w-7 h-7" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            No stories found
                          </h3>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            We couldn't find any articles matching your search or category filter.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory('All');
                            setSearchQuery('');
                          }}
                          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
                        >
                          Reset All Filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Premium Sidebar (4 cols) */}
                <div className="lg:col-span-4 space-y-8">
                  {/* Modern Creator Studio Showcase Card (Replaces blunt blue box) */}
                  <div className="relative rounded-3xl overflow-hidden p-6 sm:p-7 text-white bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 shadow-2xl shadow-indigo-900/20 border border-white/20 group">
                    {/* Ambient Glows */}
                    <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-2xl transform translate-x-12 -translate-y-12 group-hover:scale-125 transition-transform duration-1000" />
                    <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-400/20 rounded-full blur-xl" />

                    <div className="relative z-10 space-y-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                        <LuSparkles className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Student Creator Hub</span>
                      </div>

                      <h3 className="text-2xl font-black tracking-tight leading-tight">
                        Got a University Story or Tip to Share?
                      </h3>

                      <p className="text-xs text-blue-100 font-medium leading-relaxed opacity-90">
                        Help freshers navigate university life, share faculty guidance, or discuss tech & student careers.
                      </p>

                      {/* Perk highlights */}
                      <div className="space-y-2 pt-1 pb-2 text-xs text-blue-50">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Build a published writing portfolio</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Compete on the student leaderboard</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Read by 5,000+ university peers</span>
                        </div>
                      </div>

                      <Link
                        to="/submit-blog"
                        className="flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-black uppercase tracking-wider shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        <LuPenLine className="w-4 h-4 text-blue-600" />
                        <span>Start Writing Free</span>
                        <LuArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Contributor Leaderboard */}
                  <ContributorLeaderboard contributors={contributors} />

                  {/* Trending Topics / Quick Filter Widget */}
                  <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white text-sm font-bold">
                        <LuTag className="w-4 h-4 text-blue-500" />
                        <span>Trending Topics</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-semibold">Campus Hits</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {POPULAR_TOPICS.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => setSearchQuery(topic)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${searchQuery.toLowerCase() === topic.toLowerCase()
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                              : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-300'
                            }`}
                        >
                          #{topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ad Widget */}
                  <AdSidebarWidget />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogList;
