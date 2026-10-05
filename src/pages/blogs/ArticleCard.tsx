import React from 'react';
import { motion } from 'framer-motion';
import { LuClock, LuThumbsUp, LuEye, LuArrowRight } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { Blog } from '../../types/blog';

interface BlogCardProps {
  blog: Blog;
  isFeatured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, isFeatured = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.01 }}
      className={`group relative overflow-hidden rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 dark:border-slate-700/50 dark:bg-slate-900/80 ${isFeatured ? 'col-span-full grid md:grid-cols-2 gap-6' : ''
        }`}
    >
      {/* Featured Badge */}
      {blog.isTrending && (
        <div className="absolute top-4 left-4 z-10 rounded-full bg-blue-600/90 px-4 py-1 text-xs font-bold text-white backdrop-blur-md">
          TRENDING
        </div>
      )}

      {/* Image Container */}
      <div className={`relative overflow-hidden ${isFeatured ? 'h-64 md:h-full' : 'h-48'}`}>
        <img
          src={blog.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800'}
          alt={blog.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800';
          }}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className={`flex flex-col p-6 ${isFeatured ? 'justify-center' : ''}`}>
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {blog.category}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <LuClock className="w-3 h-3" /> {blog.readTime}
          </span>
        </div>

        <h3 className={`font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors ${isFeatured ? 'text-2xl md:text-4xl mb-4' : 'text-xl mb-2'
          }`}>
          {blog.title}
        </h3>

        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Author & Stats */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={blog.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author?.name || 'Author'}`}
              alt={blog.author?.name}
              className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
            />
            <div className="text-xs">
              <p className="font-bold text-slate-800 dark:text-white">{blog.author?.name || 'Anonymous'}</p>
              <p className="text-slate-500 dark:text-slate-400">{new Date(blog.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 text-xs">
              <LuThumbsUp className="w-4 h-4" /> {typeof blog.likes === 'number' ? blog.likes : (Array.isArray(blog.likes) ? (blog.likes as any).length : 0)}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <LuEye className="w-4 h-4" /> {blog.views || 0}
            </span>
          </div>
        </div>

        <Link
          to={`/blogs/${blog.slug}`}
          className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Read Full Blog <LuArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default BlogCard;
