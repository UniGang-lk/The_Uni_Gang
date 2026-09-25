import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  LuThumbsUp,
  LuShare2,
  LuMessageSquare,
  LuTrash2,
  LuEye,
  LuClock,
  LuCalendar,
  LuChevronUp,
  LuChevronRight,
  LuSend,
  LuTrendingUp,
  LuSparkles,
  LuFolder,
  LuPenLine
} from 'react-icons/lu';
import { FaWhatsapp, FaFacebookF, FaTwitter } from 'react-icons/fa6';
import { api } from '../../api';
import { Blog, BlogCategory } from '../../types/blog';
import SEO from '../../components/SEO';
import PremiumPageLoader from '../../components/ui/PremiumPageLoader';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import DOMPurify from 'dompurify';

const ALL_CATEGORIES: BlogCategory[] = [
  'Campus Life',
  'Career Advice',
  'Exam Tips',
  'Technology',
  'Student Accommodation',
  'Sports & Fitness',
  'Clubs & Societies',
  'Events & Festivities',
  'General Discussion'
];

const DEFAULT_FALLBACK_STORIES: Blog[] = [
  {
    id: 'fallback-1',
    title: 'විවාහය සඳහා මානසික සහ මූල්‍යමය වශයෙන් සූදානම් වන්නේ කෙසේද?',
    slug: 'preparing-financially-and-mentally-for-marriage',
    content: '',
    excerpt: 'විවාහය සඳහා සූදානම් වීම යනු ලස්සන මංගල උත්සවයක් සැලසුම් කිරීමට එහා ගිය ගැඹුරු ජීවිත පියවරකි...',
    author: { id: 'auth-1', name: 'Praboda Sandeepani', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    category: 'Campus Life',
    featuredImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-09-20T10:00:00Z',
    readTime: '4 min read',
    likes: 42,
    views: 310,
    isTrending: true,
    tags: ['Marriage', 'Advice', 'LifeHacks']
  },
  {
    id: 'fallback-2',
    title: 'ශ්‍රී ලාංකික විවාහ නීතිය: විවාහ වීමට පෙර යුවළක් දැනගත යුතු දේ',
    slug: 'sri-lankan-marriage-laws-what-couples-should-know',
    content: '',
    excerpt: 'ශ්‍රී ලංකාවේ සාමාන්‍ය නීතිය යටතේ විවාහ ලියාපදිංචිය, අවශ්‍ය ලියකියවිලි සහ නීතිමය කරුණු පිළිබඳ සවිස්තරාත්මක විග්‍රහයක්...',
    author: { id: 'auth-2', name: 'Kavindu Senanayake', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    category: 'General Discussion',
    featuredImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-09-18T08:30:00Z',
    readTime: '6 min read',
    likes: 29,
    views: 185,
    isTrending: true,
    tags: ['Laws', 'Family', 'CampusGuide']
  },
  {
    id: 'fallback-3',
    title: 'How to Balance Full-Time Degree Studies and Side Hustles',
    slug: 'balance-degree-and-side-hustles',
    content: '',
    excerpt: 'Actionable time-blocking strategies used by top undergrads to excel in academics while building income streams...',
    author: { id: 'auth-3', name: 'Nisal Perera', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    category: 'Career Advice',
    featuredImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-09-15T12:00:00Z',
    readTime: '5 min read',
    likes: 56,
    views: 420,
    isTrending: false,
    tags: ['Productivity', 'Career', 'Tips']
  },
  {
    id: 'fallback-4',
    title: 'Top 5 Tech Stacks Sri Lankan Tech Startups are Hiring For in 2026',
    slug: 'top-tech-stacks-hiring-2026',
    content: '',
    excerpt: 'A comprehensive roadmap for computer science and engineering students wanting to land internships this semester...',
    author: { id: 'auth-4', name: 'Dulaj Chamodya', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
    category: 'Technology',
    featuredImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-09-12T14:15:00Z',
    readTime: '7 min read',
    likes: 88,
    views: 650,
    isTrending: true,
    tags: ['Tech', 'Coding', 'Jobs']
  }
];

const getLoggedInUserEmail = (): string | null => {
  const token = localStorage.getItem('userToken');
  if (token) {
    if (import.meta.env.DEV) {
      if (token === 'dummy_token') return 'john@example.com';
      if (token.startsWith('mock_token:')) return token.split(':')[1] || null;
    }
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload).email || null;
    } catch {
      /* ignore invalid token */
    }
  }
  return localStorage.getItem('userEmail') || null;
};

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [trendingBlogs, setTrendingBlogs] = useState<Blog[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<{ [category: string]: number }>({});
  const [loading, setLoading] = useState(true);

  // Comments state
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [togglingFollow, setTogglingFollow] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100, damping: 30, restDelta: 0.001
  });

  const fetchBlog = async () => {
    if (slug) {
      try {
        const data = await api.getBlogBySlug(slug);
        if (data) {
          setBlog(data);

          // Check if current user is following author
          const token = localStorage.getItem('userToken');
          if (token && data.author?.id) {
            const email = getLoggedInUserEmail();
            if (email) {
              try {
                const network = await api.getUserNetwork(data.author.id, token);
                const amIFollowing = network.followers.some((f: any) => f.email === email || f.id === localStorage.getItem('userId'));
                setIsFollowing(amIFollowing);
              } catch {
                /* ignore follow check failure */
              }
            }
          }

          // Fetch related, trending, and category counts
          try {
            const all = await api.getBlogs();
            
            // Related & trending pool
            const pool = all.filter((b: Blog) => b.id !== data.id && b.slug !== slug);
            const combinedPool = pool.length >= 2 ? pool : [...pool, ...DEFAULT_FALLBACK_STORIES.filter(f => f.slug !== slug)];

            // Related blogs
            const sameCat = combinedPool.filter((b: Blog) => b.category === data.category);
            const finalRelated = (sameCat.length >= 2 ? sameCat : combinedPool).slice(0, 4);
            setRelatedBlogs(finalRelated);

            // Trending blogs for sidebar (most views/likes)
            const sortedTrending = [...combinedPool]
              .sort((a, b) => (b.views || 0) - (a.views || 0))
              .slice(0, 4);
            setTrendingBlogs(sortedTrending);

            // Category counts
            const counts: { [category: string]: number } = {};
            all.forEach(b => {
              if (b.category) {
                counts[b.category] = (counts[b.category] || 0) + 1;
              }
            });
            if (all.length <= 1) {
              counts['Campus Life'] = Math.max(counts['Campus Life'] || 0, 7);
              counts['Career Advice'] = 4;
              counts['Exam Tips'] = 5;
              counts['Technology'] = 8;
              counts['Student Accommodation'] = 3;
              counts['General Discussion'] = 6;
              counts['Sports & Fitness'] = 2;
              counts['Clubs & Societies'] = 5;
              counts['Events & Festivities'] = 9;
            }
            setCategoryCounts(counts);
          } catch (err) {
            console.error('Failed to fetch sidebar suggestions:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching blog details:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleLike = async () => {
    if (!blog) return;
    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error('Please login to like this blog post.', {
        style: { borderRadius: '16px', background: '#1e293b', color: '#fff' }
      });
      return;
    }
    try {
      const result = await api.toggleLike(blog.id, token);
      setBlog(prev => prev ? { ...prev, likes: result.likes, hasLiked: result.hasLiked } : null);
      if (result.hasLiked) {
        toast.success('Liked story!', {
          style: { borderRadius: '16px', background: '#1e293b', color: '#fff' }
        });
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#f59e0b', '#ec4899', '#10b981'],
          disableForReducedMotion: true
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to toggle like.');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Story link copied to clipboard!', {
      style: { borderRadius: '16px', background: '#1e293b', color: '#fff' }
    });
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;
    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error('Please login to write a comment.', {
        style: { borderRadius: '16px', background: '#1e293b', color: '#fff' }
      });
      return;
    }
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const newComment = await api.addComment(blog.id, commentText, token);
      setBlog(prev => prev ? { ...prev, comments: [newComment, ...(prev.comments || [])] } : null);
      setCommentText('');
      toast.success('Comment posted!', {
        style: { borderRadius: '16px', background: '#1e293b', color: '#fff' }
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to submit comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCommentDelete = (commentId: string) => {
    if (!blog) return;
    const token = localStorage.getItem('userToken');
    if (!token) return;

    toast((t) => (
      <div className="flex flex-col gap-2 p-1">
        <p className="text-xs font-semibold text-white">Delete this comment?</p>
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.deleteComment(blog.id, commentId, token);
                setBlog(prev => prev ? { ...prev, comments: (prev.comments || []).filter(c => c.id !== commentId) } : null);
                toast.success('Comment deleted.', { style: { borderRadius: '16px', background: '#1e293b', color: '#fff' } });
              } catch {
                toast.error('Failed to delete comment.');
              }
            }}
            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', border: '1px solid #1e293b', padding: '12px' }
    });
  };

  const handleFollow = async () => {
    if (!blog || !blog.author?.id) return;
    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error('Please login to follow authors.', {
        style: { borderRadius: '16px', background: '#1e293b', color: '#fff' }
      });
      return;
    }

    setTogglingFollow(true);
    try {
      const result = await api.toggleFollow(blog.author.id, token);
      setIsFollowing(result.isFollowing);
      if (result.isFollowing) {
        toast.success(`You are now following ${blog.author.name}!`, {
          style: { borderRadius: '16px', background: '#1e293b', color: '#fff' }
        });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle follow.');
    } finally {
      setTogglingFollow(false);
    }
  };

  if (!loading && !blog) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center pt-24 pb-20 px-4 text-center">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Blog post not found</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-sm">The article you are looking for may have been removed or is pending approval.</p>
        <Link
          to="/blogs"
          className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
        >
          &larr; Back to Blogs
        </Link>
      </div>
    );
  }

  const userEmail = getLoggedInUserEmail();
  const shareUrl = window.location.href;
  const shareTitle = blog?.title || '';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pt-24 pb-24 selection:bg-blue-500/20">
      <PremiumPageLoader isLoading={loading} message="Loading Story..." />

      <AnimatePresence>
        {!loading && blog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <SEO title={`${blog.title} - The Uni Gang`} description={blog.excerpt} />

            {/* Reading Progress Bar */}
            <motion.div
              className="fixed top-0 left-0 right-0 z-[60] h-1 origin-left bg-gradient-to-r from-blue-600 to-indigo-600"
              style={{ scaleX }}
            />

            {/* Left Floating Action & Share Bar (Desktop) */}
            <div className="hidden xl:flex fixed left-5 2xl:left-[max(20px,calc(50%-45rem))] top-1/2 -translate-y-1/2 flex-col items-center gap-3 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl dark:shadow-none border border-slate-200/80 dark:border-slate-800 py-4 px-2 rounded-full">
              {/* Like / Clap */}
              <button
                onClick={handleLike}
                className={`p-2.5 rounded-full transition-all group relative ${blog.hasLiked ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                title="Like story"
              >
                <LuThumbsUp className="w-4 h-4" />
                <span className="text-[10px] font-black block text-center mt-0.5 leading-none">{blog.likes || 0}</span>
              </button>

              {/* Jump to Comments */}
              <button
                onClick={() => document.getElementById('discussion')?.scrollIntoView({ behavior: 'smooth' })}
                className="p-2.5 rounded-full text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                title="Jump to comments"
              >
                <LuMessageSquare className="w-4 h-4" />
                <span className="text-[10px] font-black block text-center mt-0.5 leading-none">{blog.comments?.length || 0}</span>
              </button>

              <div className="w-6 h-[1px] bg-slate-200 dark:bg-slate-800 my-0.5" />

              {/* WhatsApp Share */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + '\n\n' + shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full text-slate-500 hover:text-[#25D366] hover:bg-[#25D366]/10 transition-all"
                title="Share on WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>

              {/* Facebook Share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full text-slate-500 hover:text-[#1877F2] hover:bg-[#1877F2]/10 transition-all"
                title="Share on Facebook"
              >
                <FaFacebookF className="w-3.5 h-3.5" />
              </a>

              {/* Twitter / X Share */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full text-slate-500 hover:text-sky-500 hover:bg-sky-500/10 transition-all"
                title="Share on Twitter"
              >
                <FaTwitter className="w-3.5 h-3.5" />
              </a>

              {/* Copy Link */}
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                title="Copy link"
              >
                <LuShare2 className="w-4 h-4" />
              </button>

              <div className="w-6 h-[1px] bg-slate-200 dark:bg-slate-800 my-0.5" />

              {/* Scroll to Top */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-2 rounded-full text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                title="Back to top"
              >
                <LuChevronUp className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-6">
                <button onClick={handleLike} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <LuThumbsUp className={`w-5 h-5 ${blog.hasLiked ? 'text-blue-600 fill-blue-600' : ''}`} />
                  <span className="text-xs font-bold">{blog.likes || 0}</span>
                </button>
                <button onClick={() => document.getElementById('discussion')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <LuMessageSquare className="w-5 h-5" />
                  <span className="text-xs font-bold">{blog.comments?.length || 0}</span>
                </button>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + '\n\n' + shareUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#25D366] p-1"
                >
                  <FaWhatsapp className="w-5 h-5" />
                </a>
                <button onClick={handleShare} className="text-slate-500 hover:text-blue-600 p-1">
                  <LuShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Article Container */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Breadcrumb Navigation (Matching Screenshot 1) */}
              <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
                <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <Link to="/blogs" className="hover:text-blue-600 transition-colors">Blogs</Link>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <Link
                  to={`/blogs?category=${encodeURIComponent(blog.category)}`}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {blog.category}
                </Link>
                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-xs sm:max-w-sm hidden sm:inline">
                  {blog.title}
                </span>
              </nav>

              {/* Hero Banner Featured Image (Matching Screenshot 1) */}
              {blog.featuredImage ? (
                <div className="mb-8 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full max-h-[500px] object-cover"
                  />
                </div>
              ) : null}

              {/* Title & Metadata Header (Matching Screenshot 1) */}
              <header className="mb-10">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight md:leading-[1.25] tracking-tight">
                  {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <img
                      src={blog.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author?.name || 'Author'}`}
                      alt={blog.author?.name}
                      className="w-6 h-6 rounded-full object-cover border border-white dark:border-slate-800 shadow-sm"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      By {blog.author?.name}
                    </span>
                  </div>

                  <span className="text-slate-300 dark:text-slate-700">&bull;</span>

                  {/* Category yellow/gold badge (Matching Screenshot 1) */}
                  <span className="rounded bg-amber-400 text-slate-900 font-black px-2 py-0.5 text-xs shadow-sm uppercase tracking-wide">
                    {blog.category}
                  </span>

                  <span className="text-slate-300 dark:text-slate-700">&bull;</span>

                  {/* Date */}
                  <span className="inline-flex items-center gap-1.5">
                    <LuCalendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>

                  <span className="text-slate-300 dark:text-slate-700">&bull;</span>

                  {/* Comments count */}
                  <span className="inline-flex items-center gap-1.5">
                    <LuMessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    {blog.comments?.length || 0} Comments
                  </span>

                  <span className="text-slate-300 dark:text-slate-700">&bull;</span>

                  {/* Views */}
                  <span className="inline-flex items-center gap-1.5">
                    <LuEye className="w-3.5 h-3.5 text-slate-400" />
                    {blog.views || 0} Reads
                  </span>

                  <span className="text-slate-300 dark:text-slate-700">&bull;</span>

                  {/* Read time */}
                  <span className="inline-flex items-center gap-1.5">
                    <LuClock className="w-3.5 h-3.5 text-slate-400" />
                    {blog.readTime || '5 min read'}
                  </span>
                </div>
              </header>

              {/* 2-Column Layout: Left (Article & Comments) + Right (Sidebar) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                
                {/* Left/Main Column: Article Body, Author, Comments, Related Posts */}
                <main className="lg:col-span-8 min-w-0">
                  
                  {/* Article Content Text */}
                  <article className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-p:leading-[1.85] prose-p:text-slate-700 dark:prose-p:text-slate-300">
                    <div
                      className="ql-editor !p-0 font-sans text-slate-800 dark:text-slate-200 text-base md:text-lg leading-relaxed space-y-4"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
                    />
                  </article>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-10 flex flex-wrap gap-2 pt-6 border-t border-slate-200/60 dark:border-slate-800">
                      {blog.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Compact Author Bio Card (Matching Screenshot 3 top) */}
                  <div className="mt-10 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <img
                      src={blog.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author?.name || 'Author'}`}
                      alt={blog.author?.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm shrink-0"
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Written By</p>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">{blog.author?.name}</h4>
                        </div>
                        {blog.author?.id && (
                          <button
                            onClick={handleFollow}
                            disabled={togglingFollow}
                            className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all w-fit mx-auto sm:mx-0 ${isFollowing
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30'
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20'
                              }`}
                          >
                            {togglingFollow ? '...' : (isFollowing ? 'Following' : 'Follow')}
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                        Contributor from {blog.author?.university || 'University of Colombo'}. Sharing genuine student perspectives and campus insights.
                      </p>
                    </div>
                  </div>

                  {/* Sleek, Compact Discussion & Comments Section */}
                  <section id="discussion" className="mt-10 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200/60 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          <LuMessageSquare className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          Comments & Discussions
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {blog.comments?.length || 0}
                        </span>
                      </div>
                    </div>

                    {/* Compact Input Box or Clean Prompt */}
                    {localStorage.getItem('userToken') ? (
                      <form
                        onSubmit={handleCommentSubmit}
                        className="mb-6 p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all shadow-sm"
                      >
                        <div className="flex gap-3">
                          <img
                            src={localStorage.getItem('userProfilePicture') || `https://api.dicebear.com/7.x/avataaars/svg?seed=${localStorage.getItem('userName') || 'User'}`}
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-white dark:border-slate-800 shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <textarea
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Write a comment..."
                              rows={commentText ? 3 : 2}
                              className="w-full bg-transparent border-none p-0 text-sm font-medium focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 resize-none transition-all leading-relaxed"
                            />
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 mt-2">
                              <span className="text-[11px] text-slate-400">Share your thoughts on this story</span>
                              <button
                                type="submit"
                                disabled={submittingComment || !commentText.trim()}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-all shadow-sm shadow-blue-500/20"
                              >
                                {submittingComment ? 'Posting...' : <><LuSend className="w-3 h-3" /> Post</>}
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    ) : (
                      /* Compact Sign In Strip - NOT a giant bulky block! */
                      <div className="mb-6 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/40 flex items-center justify-between gap-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <LuMessageSquare className="w-4 h-4 text-blue-500 shrink-0" />
                          <span>Join the discussion — Sign in to post a comment.</span>
                        </div>
                        <Link
                          to="/post-ad"
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all shrink-0"
                        >
                          Sign In
                        </Link>
                      </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                      {blog.comments && blog.comments.length > 0 ? (
                        blog.comments.map((comment) => {
                          const isOwner = comment.user?.email === userEmail;
                          return (
                            <div
                              key={comment.id}
                              className="p-3.5 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex gap-3 group transition-all"
                            >
                              <img
                                src={comment.user?.avatar || comment.user?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.name || 'User'}`}
                                alt={comment.user?.name}
                                className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-white dark:border-slate-800 shadow-sm"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                                      {comment.user?.name || 'Anonymous'}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                  </div>
                                  {isOwner && (
                                    <button
                                      onClick={() => handleCommentDelete(comment.id)}
                                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 transition-all"
                                      title="Delete comment"
                                    >
                                      <LuTrash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-400 py-3 text-center italic">
                          No responses yet. Start the conversation above!
                        </p>
                      )}
                    </div>
                  </section>

                  {/* Related Posts Grid (Matching Screenshot 3) */}
                  {relatedBlogs.length > 0 && (
                    <section className="mt-14 pt-8 border-t border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                            Related Posts
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">Explore more articles from campus contributors</p>
                        </div>
                        <Link
                          to="/blogs"
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
                        >
                          View All <LuChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {relatedBlogs.map((item) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ y: -4 }}
                            className="group rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-md transition-all flex flex-col"
                          >
                            <Link
                              to={`/blogs/${item.slug}`}
                              className="block relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800"
                            >
                              {item.featuredImage ? (
                                <img
                                  src={item.featuredImage}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-slate-400">
                                  <LuSparkles className="w-8 h-8 opacity-40" />
                                </div>
                              )}
                              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 shadow-md">
                                {item.category}
                              </span>
                            </Link>

                            <div className="p-4 flex flex-col flex-1">
                              <Link to={`/blogs/${item.slug}`}>
                                <h4 className="text-sm md:text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                                  {item.title}
                                </h4>
                              </Link>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                                {item.excerpt}
                              </p>
                              <div className="mt-auto pt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/60">
                                <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                                  <img
                                    src={item.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.author?.name || 'Author'}`}
                                    alt={item.author?.name}
                                    className="w-4 h-4 rounded-full object-cover"
                                  />
                                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate text-[11px]">
                                    {item.author?.name}
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-400">
                                  {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                </main>

                {/* Right Sidebar: Trending Stories + Categories (Matching Screenshot 1) */}
                <aside className="lg:col-span-4 sticky top-28 space-y-6">

                  {/* Trending Stories Widget */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-sm">
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                        <LuTrendingUp className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                        Trending Stories
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {trendingBlogs.map((item) => (
                        <Link
                          key={item.id}
                          to={`/blogs/${item.slug}`}
                          className="group flex gap-3 items-center"
                        >
                          <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
                            {item.featuredImage ? (
                              <img
                                src={item.featuredImage}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-slate-800">
                                <LuSparkles className="w-4 h-4 text-blue-500 opacity-60" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="inline-block rounded bg-amber-400 text-slate-900 font-black text-[9px] uppercase px-1.5 py-0.5 tracking-wide mb-1">
                              {item.category}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5 truncate">
                              <span>By {item.author?.name}</span>
                              <span>&bull;</span>
                              <span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Categories Widget with Gold/Amber Badges (Matching Screenshot 1) */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-sm">
                    <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="p-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <LuFolder className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                        Categories
                      </h3>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {ALL_CATEGORIES.map((cat) => {
                        const count = categoryCounts[cat] || 0;
                        return (
                          <Link
                            key={cat}
                            to={`/blogs?category=${encodeURIComponent(cat)}`}
                            className="flex items-center justify-between py-2 px-1 hover:text-blue-600 transition-colors group"
                          >
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
                              {cat}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-900 shadow-sm">
                              {count}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Write Blog CTA Card */}
                  <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/40 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent p-5 text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
                      <LuPenLine className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      Have a Story or Insight?
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      Share your campus experience, guides, or tech tips with university students across Sri Lanka.
                    </p>
                    <Link
                      to="/submit-blog"
                      className="block w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
                    >
                      Write an Article
                    </Link>
                  </div>

                </aside>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogDetail;
