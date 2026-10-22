import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheck, FiInfo, FiFileText, FiCalendar, FiTool, FiHome, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../api';
import { useNavigate } from 'react-router-dom';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'Proposal': return <FiHeart className="w-4 h-4 text-pink-500" />;
    case 'Blog': return <FiFileText className="w-4 h-4 text-purple-500" />;
    case 'Event': return <FiCalendar className="w-4 h-4 text-emerald-500" />;
    case 'Service': return <FiTool className="w-4 h-4 text-orange-500" />;
    case 'Annex': return <FiHome className="w-4 h-4 text-rose-500" />;
    case 'Marketplace': return <FiShoppingBag className="w-4 h-4 text-indigo-500" />;
    case 'System':
    default: return <FiInfo className="w-4 h-4 text-blue-500" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'Proposal': return 'bg-pink-500/10 border-pink-500/20';
    case 'Blog': return 'bg-purple-500/10 border-purple-500/20';
    case 'Event': return 'bg-emerald-500/10 border-emerald-500/20';
    case 'Service': return 'bg-orange-500/10 border-orange-500/20';
    case 'Annex': return 'bg-rose-500/10 border-rose-500/20';
    case 'Marketplace': return 'bg-indigo-500/10 border-indigo-500/20';
    case 'System':
    default: return 'bg-blue-500/10 border-blue-500/20';
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (token) {
        const data = await api.getMyNotifications(token);
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polled every 30s for better responsiveness
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('userToken');
      if (token) {
        await api.markNotificationAsRead(id, token);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (token) {
        await api.markAllNotificationsAsRead(token);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      const token = localStorage.getItem('userToken');
      if (token) {
        await api.markNotificationAsRead(notification.id, token);
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
      }
    }
    setIsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        <FiBell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-pulse text-blue-600 dark:text-blue-400' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 flex items-center justify-center w-2.5 h-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white dark:border-slate-900"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(5px)' }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute right-0 mt-3 w-[22rem] sm:w-[24rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/50 dark:border-slate-700/50 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="text-[1.05rem] font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Notifications 
                {unreadCount > 0 && (
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full font-semibold">
                    {unreadCount} New
                  </span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            {/* Body */}
            <div className="max-h-[26rem] overflow-y-auto custom-scrollbar p-2">
              {notifications.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <FiBell className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="font-medium text-slate-600 dark:text-slate-300">All caught up!</p>
                  <p className="text-sm mt-1">You have no new notifications.</p>
                </motion.div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-1"
                >
                  <AnimatePresence>
                    {notifications.map(notification => (
                      <motion.div 
                        variants={itemVariants}
                        layout
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 ease-out border overflow-hidden
                          ${!notification.isRead 
                            ? 'bg-white dark:bg-slate-800/90 border-slate-200/60 dark:border-slate-700 shadow-sm hover:shadow-md' 
                            : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                      >
                        {/* Soft background glow for unread */}
                        {!notification.isRead && (
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-transparent pointer-events-none" />
                        )}

                        <div className="flex gap-4 relative">
                          {/* Icon Badge */}
                          <div className="flex-shrink-0 mt-0.5">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-sm ${getNotificationColor(notification.type)}`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 pr-8">
                            <p className={`text-[14px] leading-tight ${!notification.isRead ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-300'}`}>
                              {notification.title}
                            </p>
                            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                              {notification.message}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-2 font-semibold tracking-wider uppercase flex items-center gap-1.5">
                              {!notification.isRead && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block"></span>}
                              {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>

                          {/* Action Button: Stylish visible tick inside a small circle */}
                          {!notification.isRead && (
                            <button 
                              type="button"
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                              className="shrink-0 self-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700/60 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white hover:border-emerald-500 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs group/btn"
                              title="Mark as read"
                            >
                              <FiCheck className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center shadow-[inset_0_10px_20px_-10px_rgba(0,0,0,0.05)]">
              <span className="text-[11px] font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase">End of updates</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
