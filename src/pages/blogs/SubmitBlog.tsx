import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuArrowLeft,
  LuSend,
  LuSparkles,
  LuImage,
  LuTrash2,
  LuCheck,
  LuClock,
  LuEye,
  LuPenLine,
  LuBookOpen,
  LuGraduationCap,
  LuBriefcase,
  LuLaptop,
  LuHouse,
  LuActivity,
  LuUsers,
  LuPartyPopper,
  LuMessageCircle,
  LuTag,
  LuX,
  LuRefreshCw,
  LuWand,
  LuCircleAlert,
  LuBold,
  LuItalic,
  LuUnderline,
  LuStrikethrough,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuList,
  LuListOrdered,
  LuQuote,
  LuCode,
  LuLink,
  LuEraser,
  LuUndo,
  LuRedo
} from 'react-icons/lu';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import DOMPurify from 'dompurify';
import SEO from '../../components/SEO';
import PremiumPageLoader from '../../components/ui/PremiumPageLoader';
import { toast } from 'react-hot-toast';
import { api } from '../../api';
import { BlogCategory } from '../../types/blog';

// Curated category fallback images (synced with backend fallbacks)
const CATEGORY_FALLBACK_IMAGES: Record<BlogCategory, string> = {
  'Campus Life': 'https://images.unsplash.com/photo-1523050853063-bd8012fec042?auto=format&fit=crop&q=80&w=1000',
  'Career Advice': 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1000',
  'Exam Tips': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000',
  'Technology': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
  'Student Accommodation': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
  'Sports & Fitness': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1000',
  'Clubs & Societies': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1000',
  'Events & Festivities': 'https://images.unsplash.com/photo-1540575861501-7ad0582373f3?auto=format&fit=crop&q=80&w=1000',
  'General Discussion': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1000',
};

interface CategoryOption {
  label: BlogCategory;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  pillColor: string;
}

const CATEGORIES: CategoryOption[] = [
  { label: 'Campus Life', icon: LuGraduationCap, accentColor: 'from-blue-500 to-indigo-600', pillColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  { label: 'Career Advice', icon: LuBriefcase, accentColor: 'from-emerald-500 to-teal-600', pillColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  { label: 'Exam Tips', icon: LuBookOpen, accentColor: 'from-amber-500 to-orange-600', pillColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  { label: 'Technology', icon: LuLaptop, accentColor: 'from-cyan-500 to-blue-600', pillColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' },
  { label: 'Student Accommodation', icon: LuHouse, accentColor: 'from-violet-500 to-purple-600', pillColor: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20' },
  { label: 'Sports & Fitness', icon: LuActivity, accentColor: 'from-rose-500 to-red-600', pillColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  { label: 'Clubs & Societies', icon: LuUsers, accentColor: 'from-indigo-500 to-purple-600', pillColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
  { label: 'Events & Festivities', icon: LuPartyPopper, accentColor: 'from-pink-500 to-rose-600', pillColor: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20' },
  { label: 'General Discussion', icon: LuMessageCircle, accentColor: 'from-slate-500 to-slate-700', pillColor: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' },
];

const POPULAR_TAGS = [
  'CampusLife',
  'ExamTips',
  'FirstYearAdvice',
  'StudyTechniques',
  'CareerRoadmap',
  'TechTrends',
  'StudentBudget',
  'HostelGuide',
  'UniversityLife'
];

/**
 * Modern Native Rich Text Editor component
 * 100% compatible with React 19 (Zero findDOMNode deprecation issues)
 */
interface ModernRichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const ModernRichTextEditor: React.FC<ModernRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your thoughts, tips, or experiences here...'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isTypingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isTypingRef.current = true;
      const html = editorRef.current.innerHTML;
      const cleanHtml = html === '<p><br></p>' || html === '<br>' ? '' : html;
      onChange(cleanHtml);
      setTimeout(() => {
        isTypingRef.current = false;
      }, 50);
    }
  };

  const executeCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const handleInsertLink = () => {
    const url = prompt('Enter link URL (e.g., https://example.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
      {/* Sticky / Modern Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 sm:p-2.5 bg-slate-50/90 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-700/60 select-none">
        {/* Headings */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200 dark:border-slate-700">
          <button
            type="button"
            title="Heading 1"
            onClick={() => executeCommand('formatBlock', '<h2>')}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LuHeading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 2"
            onClick={() => executeCommand('formatBlock', '<h3>')}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LuHeading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 3"
            onClick={() => executeCommand('formatBlock', '<h4>')}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LuHeading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Inline Formatting */}
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200 dark:border-slate-700">
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onClick={() => executeCommand('bold')}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LuBold className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onClick={() => executeCommand('italic')}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LuItalic className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Underline (Ctrl+U)"
            onClick={() => executeCommand('underline')}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LuUnderline className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Strikethrough"
            onClick={() => executeCommand('strikeThrough')}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LuStrikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200 dark:border-slate-700">
          <button
            type="button"
            title="Bulleted List"
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LuList className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Numbered List"
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LuListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Quote Block"
            onClick={() => executeCommand('formatBlock', '<blockquote>')}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LuQuote className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Code Block"
            onClick={() => executeCommand('formatBlock', '<pre>')}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LuCode className="w-4 h-4" />
          </button>
        </div>

        {/* Link & Clear */}
        <div className="flex items-center gap-0.5 px-2 border-r border-slate-200 dark:border-slate-700">
          <button
            type="button"
            title="Insert Link"
            onClick={handleInsertLink}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LuLink className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Clear Formatting"
            onClick={() => executeCommand('removeFormat')}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LuEraser className="w-4 h-4" />
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 pl-2 ml-auto">
          <button
            type="button"
            title="Undo (Ctrl+Z)"
            onClick={() => executeCommand('undo')}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LuUndo className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Redo (Ctrl+Y)"
            onClick={() => executeCommand('redo')}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LuRedo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editable Canvas */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        className="modern-editor-canvas min-h-[380px] p-5 sm:p-6 text-base sm:text-lg text-slate-800 dark:text-slate-100 outline-none leading-relaxed overflow-y-auto"
      />

      <style>{`
        .modern-editor-canvas:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          cursor: text;
          pointer-events: none;
        }
        .modern-editor-canvas h2 {
          font-size: 1.6rem;
          font-weight: 800;
          margin-top: 1.5rem;
          margin-bottom: 0.6rem;
          color: inherit;
        }
        .modern-editor-canvas h3 {
          font-size: 1.35rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: inherit;
        }
        .modern-editor-canvas h4 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.4rem;
          color: inherit;
        }
        .modern-editor-canvas p {
          margin-bottom: 0.85rem;
          line-height: 1.8;
        }
        .modern-editor-canvas blockquote {
          border-left: 4px solid #3b82f6;
          padding: 0.5rem 1rem;
          margin: 1rem 0;
          font-style: italic;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .modern-editor-canvas pre {
          background: #0f172a;
          color: #f8fafc;
          padding: 1rem;
          border-radius: 0.75rem;
          font-family: monospace;
          font-size: 0.9rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .modern-editor-canvas ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 0.85rem;
        }
        .modern-editor-canvas ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 0.85rem;
        }
        .modern-editor-canvas a {
          color: #2563eb;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

const SubmitBlog: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active View Tab: 'editor' or 'preview'
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [previewSubMode, setPreviewSubMode] = useState<'card' | 'article'>('card');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BlogCategory>('Campus Life');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Status & Telemetry
  const [loading, setLoading] = useState(false);
  const [draftStatus, setDraftStatus] = useState<string>('');
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  // Auth Info
  const userToken = localStorage.getItem('userToken');
  const userName = localStorage.getItem('userName') || 'Student Writer';
  const userProfilePic = localStorage.getItem('userProfilePicture') || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;

  // Image Object URL lifecycle management
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreviewUrl(null);
    }
  }, [imageFile]);

  // Compute stats: word count & read time
  const plainText = content.replace(/<[^>]*>/g, '').trim();
  const wordCount = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
  const readTimeMin = Math.max(1, Math.round(wordCount / 200));
  const readTime = `${readTimeMin} min read`;

  // Draft Recovery on Mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('blog_draft_v2') || localStorage.getItem('blog_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.title || parsed.content) {
          setShowDraftBanner(true);
        }
      } catch (e) {
        console.error('Draft parsing error:', e);
      }
    }
  }, []);

  const restoreDraft = () => {
    try {
      const savedDraft = localStorage.getItem('blog_draft_v2') || localStorage.getItem('blog_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.excerpt) setExcerpt(parsed.excerpt);
        if (parsed.content) setContent(parsed.content);
        if (Array.isArray(parsed.tags)) {
          setTags(parsed.tags);
        } else if (typeof parsed.tags === 'string' && parsed.tags) {
          setTags(parsed.tags.split(',').map((t: string) => t.trim()).filter(Boolean));
        }
        toast.success('Draft restored from your last session!', {
          icon: '📝',
          style: { borderRadius: '14px', background: '#0f172a', color: '#fff' }
        });
      }
    } catch (e) {
      console.error('Failed to parse draft', e);
    }
    setShowDraftBanner(false);
  };

  const discardDraft = () => {
    localStorage.removeItem('blog_draft_v2');
    localStorage.removeItem('blog_draft');
    setShowDraftBanner(false);
    toast('Draft cleared', { icon: '🗑️' });
  };

  // Debounced Auto-Save
  useEffect(() => {
    if (!title && !content && !excerpt) return;

    setDraftStatus('Saving...');
    const timeoutId = setTimeout(() => {
      const draftData = {
        title,
        category,
        excerpt,
        content,
        tags
      };
      localStorage.setItem('blog_draft_v2', JSON.stringify(draftData));
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setDraftStatus(`Saved at ${timeStr}`);
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [title, category, excerpt, content, tags]);

  // Handle Tag Input
  const handleAddTag = (rawTag: string) => {
    const formatted = rawTag.trim().replace(/^#/, '');
    if (formatted && !tags.includes(formatted) && tags.length < 8) {
      setTags([...tags, formatted]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  // Auto-generate Excerpt from Content
  const handleAutoGenerateExcerpt = () => {
    if (!plainText) {
      toast.error('Write some story content first to extract a summary!');
      return;
    }
    const cleanSnippet = plainText.slice(0, 160).replace(/\s+[^\s]*$/, '...');
    setExcerpt(cleanSnippet);
    toast.success('Excerpt generated from your content!', { icon: '✨' });
  };

  // Pre-flight validation checks
  const isTitleValid = title.trim().length >= 4;
  const isExcerptValid = excerpt.trim().length >= 10;
  const isContentValid = wordCount >= 15;
  const canPublish = isTitleValid && isExcerptValid && isContentValid;

  // Handle Form Submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!userToken) {
      toast.error('Please log in first to submit your story for moderation.', {
        duration: 4000,
        style: { borderRadius: '14px', background: '#0f172a', color: '#fff' }
      });
      return;
    }

    if (!isTitleValid) {
      toast.error('Please provide a descriptive title (at least 4 characters).');
      return;
    }
    if (!isExcerptValid) {
      toast.error('Please write a brief 1-2 sentence excerpt summarizing your post.');
      return;
    }
    if (!isContentValid) {
      toast.error('Please write some content for your story (at least 15 words).');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', title.trim());
      data.append('category', category);
      data.append('excerpt', excerpt.trim());
      data.append('content', content);
      data.append('tags', tags.join(', '));
      if (imageFile) {
        data.append('image', imageFile);
      }

      await api.createBlog(data, userToken);

      // Trigger Celebration Fireworks
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        /* ignore confetti errors */
      }

      // Clear drafts
      localStorage.removeItem('blog_draft_v2');
      localStorage.removeItem('blog_draft');
      setDraftStatus('');

      toast.success('Story submitted successfully! Our editors will review it shortly.', {
        duration: 5000,
        style: {
          borderRadius: '16px',
          background: '#0f172a',
          color: '#fff',
          fontWeight: 600
        }
      });

      navigate('/blogs');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to submit blog post. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const coverImageSrc = imagePreviewUrl || CATEGORY_FALLBACK_IMAGES[category];

  return (
    <div className="relative min-h-[calc(100vh-140px)] transition-colors duration-300">
      <SEO
        title="Creator Studio - Write & Publish Your Story"
        description="Share your university experiences, tips, and insights with Sri Lanka's largest student network."
      />

      <PremiumPageLoader isLoading={loading} message="Publishing your masterpiece to the Uni Gang..." />

      {/* Draft Recovery Notification Pill */}
      <AnimatePresence>
        {showDraftBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-purple-900/90 backdrop-blur-xl border border-blue-500/30 text-white shadow-2xl shadow-blue-900/20 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <LuSparkles className="text-yellow-400 w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-bold">Unsaved draft found!</p>
                <p className="text-xs text-blue-200">Would you like to restore your previous writing session?</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={discardDraft}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={restoreDraft}
                className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/30"
              >
                Restore Draft
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guest Mode Notice */}
      {!userToken && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LuCircleAlert className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs sm:text-sm font-medium">
              You are currently drafting as a guest. Please log in before publishing so your story is attributed to your student profile!
            </p>
          </div>
          <Link
            to="/profile"
            className="shrink-0 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            Log In
          </Link>
        </div>
      )}

      {/* Top Studio Control Bar */}
      <div className="mb-8 p-3 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-100 dark:shadow-none flex flex-wrap items-center justify-between gap-4">
        {/* Left: Back & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/blogs')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <LuArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Blogs</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping hidden sm:block" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Creator Studio</span>
            {draftStatus && (
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 hidden md:inline">
                • {draftStatus}
              </span>
            )}
          </div>
        </div>

        {/* Center: Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'editor'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LuPenLine className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LuEye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
            {(title || content) && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Right: Telemetry & Primary Action */}
        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <LuClock className="w-3.5 h-3.5 text-blue-500" />
            <span>{readTime}</span>
            <span>•</span>
            <span>{wordCount} words</span>
          </div>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={loading || !canPublish}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg ${
              canPublish
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Publish Story</span>
            <LuSend className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Studio Viewport */}
      {activeTab === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Writing Canvas (Left - 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-10 space-y-8">
              {/* Cover Image Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <LuImage className="w-3.5 h-3.5 text-blue-500" />
                    Cover Photo
                  </label>
                  {imageFile ? (
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                    >
                      <LuTrash2 className="w-3 h-3" /> Remove custom image
                    </button>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-400">
                      Using curated fallback for {category}
                    </span>
                  )}
                </div>

                {/* Banner Preview & Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer h-56 sm:h-72 bg-slate-950/5 dark:bg-slate-950/40 flex items-center justify-center"
                >
                  <img
                    src={coverImageSrc}
                    alt="Cover preview"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/60 transition-colors flex flex-col items-center justify-center p-6 text-center text-white backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <LuImage className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-bold tracking-tight">
                      {imageFile ? 'Click to replace cover photo' : 'Upload custom cover image'}
                    </p>
                    <p className="text-xs text-slate-200 mt-1">
                      PNG, JPG, or WebP (Recommended 1200 × 630px)
                    </p>
                    {!imageFile && (
                      <span className="mt-3 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white/90">
                        Default: {category} Photo Active
                      </span>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          toast.error('Image size must be under 10MB');
                          return;
                        }
                        setImageFile(file);
                        toast.success('Cover image selected!', { icon: '🖼️' });
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Title of your story..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-2xl sm:text-4xl font-black text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 bg-transparent border-none outline-none focus:ring-0 leading-tight transition-all"
                  maxLength={120}
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>Make it catchy and descriptive</span>
                  <span>{title.length}/120</span>
                </div>
              </div>

              {/* Excerpt / Short Hook */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <LuSparkles className="w-3.5 h-3.5 text-blue-500" />
                    Story Hook / Excerpt
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateExcerpt}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <LuWand className="w-3 h-3" /> Auto-extract
                  </button>
                </div>
                <textarea
                  placeholder="Sum up your story in 1-2 compelling sentences. This appears on social cards and article feeds..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  maxLength={220}
                  className="w-full text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 bg-transparent border-none outline-none resize-none leading-relaxed"
                />
                <div className="text-right text-[10px] text-slate-400">
                  {excerpt.length}/220 characters
                </div>
              </div>

              {/* Full Rich Text Editor (Native React 19 Compatible) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Story Content
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {wordCount} words
                  </span>
                </div>

                <ModernRichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Pour your thoughts, tips, or experiences here. Use the toolbar above for headers, bold text, lists, and links to make it engaging..."
                />
              </div>
            </div>
          </div>

          {/* Publishing Settings & Metadata (Right - 4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Author Card */}
            <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Author Attribution
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={userProfilePic}
                  alt={userName}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500/20 shadow-md"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {userName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {userToken ? 'Verified Student Contributor' : 'Guest Writer'}
                  </p>
                </div>
              </div>
            </div>

            {/* Category Selector */}
            <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Select Category
                </label>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {category}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.label;
                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setCategory(cat.label)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-[1.01]'
                          : 'bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold truncate">
                          {cat.label}
                        </span>
                      </div>
                      {isSelected && <LuCheck className="w-4 h-4 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tags & Keywords */}
            <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <LuTag className="w-3.5 h-3.5 text-blue-500" />
                  Tags & Topics
                </label>
                <span className="text-[11px] text-slate-400">{tags.length}/8 tags</span>
              </div>

              {/* Tag Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type tag & press Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                {tagInput && (
                  <button
                    type="button"
                    onClick={() => handleAddTag(tagInput)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg"
                  >
                    Add
                  </button>
                )}
              </div>

              {/* Selected Tags Pills */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-rose-500 ml-0.5"
                      >
                        <LuX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Suggested Tags */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Popular Suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TAGS.map((popTag) => (
                    <button
                      key={popTag}
                      type="button"
                      onClick={() => handleAddTag(popTag)}
                      disabled={tags.includes(popTag)}
                      className={`text-[11px] font-semibold px-2 py-1 rounded-md transition-colors ${
                        tags.includes(popTag)
                          ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-300'
                      }`}
                    >
                      +{popTag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Publishing Readiness Checklist */}
            <div className="p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Publication Readiness
                </h4>
                <span
                  className={`text-xs font-bold ${
                    canPublish ? 'text-emerald-500' : 'text-amber-500'
                  }`}
                >
                  {canPublish ? 'Ready to Publish' : 'Drafting'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isTitleValid ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}
                  >
                    <LuCheck className="w-2.5 h-2.5" />
                  </div>
                  <span className={isTitleValid ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400'}>
                    Descriptive article title
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isExcerptValid ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}
                  >
                    <LuCheck className="w-2.5 h-2.5" />
                  </div>
                  <span className={isExcerptValid ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400'}>
                    Short summary / excerpt
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isContentValid ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}
                  >
                    <LuCheck className="w-2.5 h-2.5" />
                  </div>
                  <span className={isContentValid ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400'}>
                    Article content ({wordCount}/15 words)
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <LuCheck className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">
                    Category: {category}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      imageFile ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
                    }`}
                  >
                    <LuCheck className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">
                    {imageFile ? 'Custom cover image attached' : 'Curated category fallback image'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={loading || !canPublish}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-xl ${
                  canPublish
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/30 hover:scale-[1.02] active:scale-95 cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                }`}
              >
                <span>Submit for Moderation</span>
                <LuSend className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Live Preview Mode */
        <div className="space-y-8 max-w-5xl mx-auto">
          {/* Sub-mode selector */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Live Rendering Preview
              </h3>
              <p className="text-xs text-slate-500">
                See exactly how readers will experience your blog post.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewSubMode('card')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  previewSubMode === 'card'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Feed Card Preview
              </button>
              <button
                type="button"
                onClick={() => setPreviewSubMode('article')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  previewSubMode === 'article'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Full Reader View
              </button>
            </div>
          </div>

          {/* Feed Card Preview */}
          {previewSubMode === 'card' && (
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-100/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex flex-col items-center justify-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                Feed Card Representation (Uni Gang Blogs Grid)
              </span>

              <div className="max-w-md w-full">
                <div className="group relative overflow-hidden rounded-3xl border border-white/40 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl transition-all duration-300">
                  {/* Cover */}
                  <div className="relative h-52 overflow-hidden bg-slate-900">
                    <img
                      src={coverImageSrc}
                      alt={title || 'Blog cover'}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                        {category}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <LuClock className="w-3 h-3" /> {readTime}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-xl line-clamp-2">
                      {title || 'Untitled Story: How I Survived My First Semester'}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                      {excerpt || 'Your short excerpt will appear here to hook readers browsing through the campus stories feed...'}
                    </p>

                    {/* Author & Stats Footer */}
                    <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={userProfilePic}
                          alt={userName}
                          className="h-8 w-8 rounded-full border-2 border-white shadow-sm object-cover"
                        />
                        <div className="text-xs">
                          <p className="font-bold text-slate-800 dark:text-white leading-tight">
                            {userName}
                          </p>
                          <p className="text-slate-400 text-[11px]">Just now</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-slate-400 text-xs">
                        <span className="flex items-center gap-1">
                          <LuEye className="w-3.5 h-3.5" /> 1
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full Article Reader View */}
          {previewSubMode === 'article' && (
            <div className="rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 sm:p-12 space-y-8">
              {/* Header Meta */}
              <div className="space-y-4 max-w-3xl mx-auto">
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wider">
                    {category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <LuClock className="w-3.5 h-3.5" /> {readTime}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {title || 'Untitled Story'}
                </h1>

                {/* Author Bar */}
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={userProfilePic}
                    alt={userName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/20 shadow-md"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {userName}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Published • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cover Banner */}
              <div className="rounded-2xl overflow-hidden max-h-[480px] shadow-lg">
                <img
                  src={coverImageSrc}
                  alt={title || 'Story cover'}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Excerpt Callout */}
              {excerpt && (
                <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-900/10 border-l-4 border-blue-600 text-slate-700 dark:text-slate-300 text-base sm:text-lg italic font-medium">
                  "{excerpt}"
                </div>
              )}

              {/* Sanitized Content Body */}
              <div className="max-w-3xl mx-auto prose dark:prose-invert prose-lg text-slate-800 dark:text-slate-200">
                {content ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(content)
                    }}
                  />
                ) : (
                  <p className="text-slate-400 italic">No content written yet...</p>
                )}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="max-w-3xl mx-auto pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
                  {tags.map(t => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubmitBlog;
