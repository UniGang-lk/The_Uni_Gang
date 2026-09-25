import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { LuArrowLeft, LuThumbsUp, LuShare2, LuMessageSquare, LuTrash2, LuEye } from 'react-icons/lu';
import { api } from '../../api';
import { Blog } from '../../types/blog';
import SEO from '../../components/SEO';
import PremiumPageLoader from '../../components/ui/PremiumPageLoader';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import ArticleCard from './ArticleCard';
import DOMPurify from 'dompurify';
import AdSidebarWidget from '../../components/advertise/AdSidebarWidget';

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
  const [loading, setLoading] = useState(true);

  // TOC State
  const [headings, setHeadings] = useState<{ id: string, text: string, level: number }[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');

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
          if (token) {
            const email = getLoggedInUserEmail();
            if (email) {
              try {
                // To check follow status, we need current user ID. We can fetch profile or network.
                // Assuming we can just fetch the author's network and see if our email is in followers
                const network = await api.getUserNetwork(data.author?.id, token);
                const amIFollowing = network.followers.some((f: any) => f.email === email || f.id === localStorage.getItem('userId'));
                setIsFollowing(amIFollowing);
              } catch { console.error('Failed to check follow status'); }
            }
          }

          // Fetch related blogs
          try {
            const all = await api.getBlogs();
            const related = all.filter((b: Blog) => b.category === data.category && b.id !== data.id).slice(0, 3);
            setRelatedBlogs(related);
          } catch { console.error('Failed to fetch related blogs'); }
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

  // Generate TOC
  useEffect(() => {
    if (blog?.content) {
      setTimeout(() => {
        const elements = Array.from(document.querySelectorAll('.prose h2, .prose h3'));
        const newHeadings = elements.map((elem, index) => {
          if (!elem.id) elem.id = `heading-${index}`;
          return {
            id: elem.id,
            text: elem.textContent || '',
            level: Number(elem.tagName.substring(1))
          };
        });
        setHeadings(newHeadings);
      }, 500); // Wait for dangerouslySetInnerHTML rendering
    }
  }, [blog]);

  // TOC Scroll Spy
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveHeadingId(entry.target.id);
      });
    }, { rootMargin: '0px 0px -80% 0px' }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  const handleLike = async () => {
    if (!blog) return;
    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error('Please login to like this blog post.', { style: { borderRadius: '20px', background: '#1e293b', color: '#fff' } });
      return;
    }
    try {
      const result = await api.toggleLike(blog.id, token);
      setBlog(prev => prev ? { ...prev, likes: result.likes, hasLiked: result.hasLiked } : null);
      if (result.hasLiked) {
        toast.success('Liked story!', { style: { borderRadius: '20px', background: '#1e293b', color: '#fff' } });
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
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
    toast.success('Story link copied to clipboard!', { style: { borderRadius: '20px', background: '#1e293b', color: '#fff' } });
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;
    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error('Please login to write a comment.', { style: { borderRadius: '20px', background: '#1e293b', color: '#fff' } });
      return;
    }
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const newComment = await api.addComment(blog.id, commentText, token);
      setBlog(prev => prev ? { ...prev, comments: [newComment, ...(prev.comments || [])] } : null);
      setCommentText('');
      toast.success('Comment posted successfully!', { style: { borderRadius: '20px', background: '#1e293b', color: '#fff' } });
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
      <div className="flex flex-col gap-3 p-1">
        <p className="text-sm font-semibold text-white">Are you sure you want to remove this comment?</p>
        <div className="flex justify-end gap-2 mt-1">
          <button onClick={() => toast.dismiss(t.id)} className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700">Cancel</button>
          <button onClick={async () => {
            toast.dismiss(t.id);
            try {
              await api.deleteComment(blog.id, commentId, token);
              setBlog(prev => prev ? { ...prev, comments: (prev.comments || []).filter(c => c.id !== commentId) } : null);
              toast.success('Comment removed.', { style: { borderRadius: '20px', background: '#1e293b', color: '#fff' } });
            } catch { toast.error('Failed to delete comment.'); }
          }}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/20"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 6000, position: 'top-center',
      style: { borderRadius: '24px', background: '#0f172a', color: '#fff', border: '1px solid #1e293b', padding: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)' }
    });
  };

  const handleFollow = async () => {
    if (!blog || !blog.author?.id) return;
    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error('Please login to follow authors.', { style: { borderRadius: '20px', background: '#1e293b', color: '#fff' } });
      return;
    }

    setTogglingFollow(true);
    try {
      const result = await api.toggleFollow(blog.author.id, token);
      setIsFollowing(result.isFollowing);
      if (result.isFollowing) {
        toast.success(`You are now following ${blog.author.name}!`, { style: { borderRadius: '20px', background: '#1e293b', color: '#fff' } });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle follow.');
    } finally {
      setTogglingFollow(false);
    }
  };

  if (!loading && !blog) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center pt-20">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Blog not found</h2>
        <Link to="/blogs" className="mt-4 text-blue-600 font-bold">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pt-28 pb-32 xl:pb-20 selection:bg-blue-500/30">
      <PremiumPageLoader isLoading={loading} message="Loading Story..." />

      <AnimatePresence>
        {!loading && blog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <SEO title={`${blog.title} - Blogs`} description={blog.excerpt} />

            {/* Reading Progress Bar */}
            <motion.div className="fixed top-0 left-0 right-0 z-[60] h-1 origin-left bg-blue-600 dark:bg-blue-500" style={{ scaleX }} />

            {/* Left Floating Action Bar - Sleek Pill Card */}
            <div className="hidden xl:flex fixed left-8 2xl:left-[max(32px,calc(50%-42rem))] top-1/2 -translate-y-1/2 flex-col items-center gap-5 z-40 bg-white dark:bg-slate-900 shadow-2xl dark:shadow-none border border-slate-200 dark:border-slate-800 py-6 px-3 rounded-full">
              <div className="flex flex-col items-center gap-1 group">
                <button onClick={handleLike} className={`p-2.5 rounded-full transition-all duration-300 ${blog.hasLiked ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  <LuThumbsUp className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors">{blog.likes}</span>
              </div>

              <div className="flex flex-col items-center gap-1 group">
                <button onClick={() => document.getElementById('discussion')?.scrollIntoView({ behavior: 'smooth' })} className="p-2.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                  <LuMessageSquare className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors">{blog.comments?.length || 0}</span>
              </div>

              <div className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800 my-1" />

              <button onClick={handleShare} className="p-2.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" title="Copy Link">
                <LuShare2 className="w-5 h-5" />
              </button>

              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" className="p-2.5 rounded-full text-slate-400 hover:text-[#1DA1F2] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
              </a>
            </div>

            {/* Mobile/Tablet Fixed Bottom Action Bar */}
            <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border-t border-slate-200/60 dark:border-slate-800/60 px-6 py-4 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-[calc(env(safe-area-inset-bottom)+1rem)]">
              <div className="flex items-center gap-8">
                <button onClick={handleLike} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
                  <LuThumbsUp className={`w-6 h-6 ${blog.hasLiked ? 'text-blue-600 fill-blue-600' : ''}`} />
                  <span className="text-sm font-semibold">{blog.likes}</span>
                </button>
                <button onClick={() => document.getElementById('discussion')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
                  <LuMessageSquare className="w-6 h-6" />
                  <span className="text-sm font-semibold">{blog.comments?.length || 0}</span>
                </button>
              </div>
              <div className="flex items-center gap-5">
                <button onClick={handleShare} className="text-slate-500 hover:text-blue-600 transition-colors p-1">
                  <LuShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <main className="container mx-auto px-6 max-w-[700px] xl:max-w-[1000px] xl:grid xl:grid-cols-12 xl:gap-16">

              {/* Central Content Area */}
              <article className="xl:col-span-8 w-full max-w-[700px] mx-auto">

                {/* Navigation */}
                <Link to="/blogs" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 w-fit">
                  <LuArrowLeft className="w-4 h-4" /> Back to Blogs
                </Link>

                {/* Header (Title, Meta) */}
                <header className="mb-10">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      {blog.category}
                    </span>
                  </div>

                  <h1 className="mb-8 text-[2.5rem] md:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 dark:text-slate-50 tracking-normal leading-snug lg:leading-[1.3]">
                    {blog.title}
                  </h1>

                  <div className="flex items-center justify-between py-6 border-y border-slate-100 dark:border-slate-800/60 mb-10">
                    <div className="flex items-center gap-4">
                      <img src={blog.author.avatar} alt={blog.author.name} className="h-12 w-12 rounded-full object-cover" />
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{blog.author.name}</p>
                          {blog.author?.id && (
                            <button
                              onClick={handleFollow}
                              disabled={togglingFollow}
                              className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${isFollowing
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20'
                                }`}
                              onMouseEnter={(e) => { if (isFollowing) e.currentTarget.innerText = 'Unfollow' }}
                              onMouseLeave={(e) => { if (isFollowing) e.currentTarget.innerText = 'Following' }}
                            >
                              {togglingFollow ? '...' : (isFollowing ? 'Following' : 'Follow')}
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                          <span>{blog.readTime} read</span>
                          <span className="text-slate-300 dark:text-slate-700">&middot;</span>
                          <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Featured Image */}
                {blog.featuredImage ? (
                  <div className="mb-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img src={blog.featuredImage} alt={blog.title} className="w-full object-cover" />
                  </div>
                ) : null}

                {/* Blog Body */}
                <div className="prose prose-lg md:prose-xl mx-auto max-w-none dark:prose-invert prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-headings:font-black prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-headings:tracking-tight prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-2xl font-serif leading-relaxed tracking-wide">
                  {/* Used specifically for ReactQuill rendered content */}
                  <div className="ql-editor" style={{ padding: 0 }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }} />
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-16 flex flex-wrap gap-2 pt-8">
                    {blog.tags.map(tag => (
                      <span key={tag} className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Author Footer */}
                <div className="mt-16 py-8 border-t border-b border-slate-100 dark:border-slate-800/60">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <img src={blog.author.avatar} alt={blog.author.name} className="h-20 w-20 rounded-full object-cover" />
                    <div className="text-center sm:text-left flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Written By</p>
                          <h4 className="text-2xl font-black text-slate-900 dark:text-white">{blog.author.name}</h4>
                        </div>
                        {blog.author?.id && (
                          <button
                            onClick={handleFollow}
                            disabled={togglingFollow}
                            className={`text-sm font-bold px-6 py-2 rounded-full transition-all w-full sm:w-auto ${isFollowing
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30'
                              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 shadow-xl'
                              }`}
                            onMouseEnter={(e) => { if (isFollowing) e.currentTarget.innerText = 'Unfollow' }}
                            onMouseLeave={(e) => { if (isFollowing) e.currentTarget.innerText = 'Following' }}
                          >
                            {togglingFollow ? '...' : (isFollowing ? 'Following' : 'Follow')}
                          </button>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
                        Contributor from {blog.author.university || 'University of Colombo'}. Passionate about sharing student perspectives and helping the community grow.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Discussion Section */}
                <section id="discussion" className="mt-16 mb-16">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">
                    Responses ({blog.comments ? blog.comments.length : 0})
                  </h3>

                  {/* Comment Input */}
                  {localStorage.getItem('userToken') ? (
                    <form onSubmit={handleCommentSubmit} className="mb-12 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60">
                      <div className="flex gap-4 items-start">
                        <img src={localStorage.getItem('userProfilePicture') || `https://api.dicebear.com/7.x/avataaars/svg?seed=${localStorage.getItem('userName') || 'User'}`} alt="avatar" className="w-10 h-10 rounded-full object-cover shrink-0" />
                        <div className="flex-1">
                          <textarea
                            value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="What are your thoughts?" required
                            className="w-full bg-transparent border-none text-base font-medium focus:ring-0 outline-none dark:text-white resize-none h-24 placeholder:text-slate-400"
                          />
                          <div className="flex justify-end mt-2">
                            <button type="submit" disabled={submittingComment || !commentText.trim()} className="px-6 py-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-full text-sm font-bold transition-all disabled:opacity-50">
                              {submittingComment ? 'Posting...' : 'Respond'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="mb-12 p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 flex flex-col items-center justify-center text-center">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Write Your Response</h4>
                      <p className="text-slate-500 text-sm mb-6">Sign in to leave a response.</p>
                      <Link to="/post-ad" className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-sm font-bold transition-transform hover:-translate-y-0.5">
                        Sign In
                      </Link>
                    </div>
                  )}

                  {/* Comments List */}
                  <div className="space-y-8">
                    {blog.comments && blog.comments.length > 0 ? (
                      blog.comments.map((comment) => {
                        const userEmail = getLoggedInUserEmail();
                        const isOwner = comment.user.email === userEmail;
                        return (
                          <motion.div key={comment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
                            <img src={comment.user.avatar || comment.user.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user.name}`} alt={comment.user.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl rounded-tl-none">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-slate-900 dark:text-white">{comment.user.name}</span>
                                    <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                  </div>
                                  <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">{comment.content}</p>
                                </div>
                                {isOwner && (
                                  <button onClick={() => handleCommentDelete(comment.id)} className="text-slate-400 hover:text-red-500 p-2 transition-colors">
                                    <LuTrash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : null}
                  </div>
                </section>
              </article>

              {/* Minimal Right Sidebar (TOC) - Only visible on desktop */}
              <aside className="hidden xl:block xl:col-span-4 relative">
                <div className="sticky top-32 pl-8 border-l border-slate-100 dark:border-slate-800/60 pb-10">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6 text-sm">On this page</h3>

                  {headings.length > 0 ? (
                    <nav className="flex flex-col gap-3">
                      {headings.map(h => (
                        <a
                          key={h.id}
                          href={`#${h.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`text-sm transition-colors duration-200 block truncate
                            ${activeHeadingId === h.id
                              ? 'font-bold text-blue-600 dark:text-blue-400'
                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                            }
                            ${h.level === 3 ? 'ml-4' : ''}
                          `}
                        >
                          {h.text}
                        </a>
                      ))}
                    </nav>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No headings in this article.</p>
                  )}

                  {/* Clean Integrated Stats inside Sidebar */}
                  <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800/60">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6 text-sm">Article Stats</h3>
                    <div className="flex flex-col gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><LuEye className="w-4 h-4" /> Reads</span>
                        <span className="font-bold text-slate-900 dark:text-white">{blog.views}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2"><LuThumbsUp className="w-4 h-4" /> Claps</span>
                        <span className="font-bold text-slate-900 dark:text-white">{blog.likes}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Ad Placement */}
                  <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800/60">
                    <AdSidebarWidget />
                  </div>
                </div>
              </aside>

            </main>

            {/* Read Next Section */}
            {relatedBlogs.length > 0 && (
              <section className="bg-slate-50 dark:bg-slate-900/30 mt-10 py-24 border-t border-slate-100 dark:border-slate-800/60">
                <div className="container mx-auto px-6 max-w-[1000px]">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-10">Read Next</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {relatedBlogs.map((b) => (
                      <ArticleCard key={b.id} blog={b} />
                    ))}
                  </div>
                </div>
              </section>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogDetail;
