import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuX, LuSend, LuMinimize2, LuMaximize2, LuMessageCircle } from 'react-icons/lu';
import { getSocket } from '../../services/realtime';
import { playNotificationSound, triggerPushNotification } from '../../utils/sound';
import { listenToAuthUpdate } from '../../utils/authEvents';
import { api } from '../../api';

export interface GlobalChatTarget {
  chatId: string;
  type: 'annex' | 'marketplace' | 'event';
  title?: string;
  partnerName?: string;
  partnerAvatar?: string;
  subtitle?: string;
}

export const openGlobalChat = (target: GlobalChatTarget) => {
  window.dispatchEvent(new CustomEvent('open-global-chat', { detail: target }));
};

const GlobalFloatingChat: React.FC = () => {
  const [activeChat, setActiveChat] = useState<GlobalChatTarget | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const currentChatIdRef = useRef<string | null>(null);
  currentChatIdRef.current = activeChat ? activeChat.chatId : null;
  const isMinimizedRef = useRef<boolean>(isMinimized);
  isMinimizedRef.current = isMinimized;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isMinimized]);

  // Load messages whenever active chat changes
  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    const fetchHistory = async () => {
      try {
        setLoading(true);
        if (activeChat.type === 'annex') {
          const msgs = await api.getAnnexMessages(activeChat.chatId);
          if (isMounted) setMessages(msgs);
        } else if (activeChat.type === 'marketplace') {
          const msgs = await api.getMarketplaceMessages(activeChat.chatId);
          if (isMounted) setMessages(msgs);
        } else if (activeChat.type === 'event') {
          const msgs: any = await api.getEventMessages(activeChat.chatId);
          if (isMounted) setMessages(Array.isArray(msgs) ? msgs : (msgs?.messages || []));
        }
      } catch (err) {
        console.warn('Failed to load chat history for global chat:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();

    const socket = getSocket();
    socket.emit('join_chat', activeChat.chatId);

    const handleReceiveMsg = (msg: any) => {
      const msgChatId = msg.chat_id || msg.chatId || msg.ChatID;
      if (msgChatId === activeChat.chatId) {
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        if (isMinimizedRef.current) {
          setUnreadCount(c => c + 1);
        }
      }
    };

    socket.on('receive_message', handleReceiveMsg);

    return () => {
      isMounted = false;
      socket.emit('leave_chat', activeChat.chatId);
      socket.off('receive_message', handleReceiveMsg);
    };
  }, [activeChat?.chatId, activeChat?.type]);

  // Listen to manual triggers via openGlobalChat(...)
  useEffect(() => {
    const handleOpen = (e: any) => {
      const detail: GlobalChatTarget = e.detail;
      if (!detail || !detail.chatId) return;
      setActiveChat(detail);
      setIsMinimized(false);
      setUnreadCount(0);
    };

    window.addEventListener('open-global-chat', handleOpen as EventListener);
    return () => window.removeEventListener('open-global-chat', handleOpen as EventListener);
  }, []);

  // Global socket listener: when a new message arrives from anywhere, auto-popup this floating chat box like FB!
  useEffect(() => {
    const socket = getSocket();

    const syncUserRoom = () => {
      const myUserId = localStorage.getItem('userId');
      const token = localStorage.getItem('userToken');
      if (token && myUserId) {
        socket.emit('register', myUserId);
        socket.emit('join_user_room', myUserId);
      }
    };

    // Initial sync
    syncUserRoom();

    // Re-sync on socket reconnect
    socket.on('connect', syncUserRoom);

    // Re-sync on auth events (e.g. login)
    const cleanupAuth = listenToAuthUpdate(syncUserRoom);

    const triggerAutoPopup = async (type: 'annex' | 'marketplace' | 'event', chatId: string, messageObj: any) => {
      const currentUserId = localStorage.getItem('userId');
      const senderId = messageObj?.sender_id || messageObj?.senderId || messageObj?.SenderID;

      // Don't auto-popup if sender is current user
      if (currentUserId && String(senderId) === String(currentUserId)) return;

      playNotificationSound();

      const senderName = messageObj?.sender?.name || (type === 'annex' ? 'Landlord / Student' : type === 'event' ? 'Event Organizer' : 'Market Seller');
      const senderAvatar = messageObj?.sender?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${senderName}`;

      triggerPushNotification(`💬 New Message from ${senderName}`, {
        body: messageObj?.message || 'Tap to reply...'
      });

      // If this chat is already open and not minimized, just let receive_message append it
      if (currentChatIdRef.current === chatId && !isMinimizedRef.current) {
        return;
      }

      // If minimized for this chat, increment unread badge
      if (currentChatIdRef.current === chatId && isMinimizedRef.current) {
        setUnreadCount(prev => prev + 1);
        return;
      }

      let subtitle = 'New Inquiry';
      if (type === 'annex') subtitle = 'About: Accommodation';
      else if (type === 'marketplace') subtitle = 'About: Marketplace Item';
      else if (type === 'event') subtitle = 'About: Campus Event';

      setActiveChat({
        chatId,
        type,
        partnerName: senderName,
        partnerAvatar: senderAvatar,
        subtitle
      });
      setIsMinimized(false);
      setUnreadCount(0);
    };

    const onNewAnnex = (data: any) => {
      if (data?.chatId && data?.message) {
        triggerAutoPopup('annex', data.chatId, data.message);
      }
    };

    const onNewMarket = (data: any) => {
      if (data?.chatId && data?.message) {
        triggerAutoPopup('marketplace', data.chatId, data.message);
      }
    };

    const onNewEvent = (data: any) => {
      if (data?.chatId && data?.message) {
        triggerAutoPopup('event', data.chatId, data.message);
      }
    };

    socket.on('new_annex_message', onNewAnnex);
    socket.on('new_market_message', onNewMarket);
    socket.on('new_event_message', onNewEvent);

    return () => {
      socket.off('connect', syncUserRoom);
      cleanupAuth();
      socket.off('new_annex_message', onNewAnnex);
      socket.off('new_market_message', onNewMarket);
      socket.off('new_event_message', onNewEvent);
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat || !inputText.trim() || sending) return;

    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      let sentMsg: any = null;
      if (activeChat.type === 'annex') {
        sentMsg = await api.sendAnnexMessage(activeChat.chatId, textToSend);
      } else if (activeChat.type === 'marketplace') {
        sentMsg = await api.sendMarketplaceMessage(activeChat.chatId, textToSend);
      } else if (activeChat.type === 'event') {
        sentMsg = await api.sendEventMessage(activeChat.chatId, textToSend);
      }

      if (sentMsg) {
        setMessages(prev => {
          if (prev.some(m => m.id === sentMsg.id)) return prev;
          return [...prev, sentMsg];
        });
      }
    } catch (err) {
      console.error('Failed to send message via global chat:', err);
    } finally {
      setSending(false);
    }
  };

  if (!activeChat) return null;

  const currentUserId = localStorage.getItem('userId');

  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col items-end pointer-events-none font-sans">
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="w-[360px] sm:w-[380px] max-w-[calc(100vw-2rem)] h-[480px] max-h-[calc(100vh-6rem)] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto transition-colors"
          >
            {/* Header */}
            <div className={`p-4 text-white flex items-center justify-between gap-3 shrink-0 shadow-md ${
              activeChat.type === 'annex'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                : activeChat.type === 'event'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={activeChat.partnerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChat.partnerName || 'User'}`}
                    alt={activeChat.partnerName || 'User'}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white/30"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full"></span>
                </div>
                <div className="min-w-0 text-left">
                  <h4 className="font-bold text-sm truncate leading-tight text-white m-0">
                    {activeChat.partnerName || 'Chat'}
                  </h4>
                  <p className="text-[10px] text-white/80 truncate font-medium m-0">
                    {activeChat.subtitle || 'Active conversation'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer border-none bg-transparent"
                  title="Minimize"
                >
                  <LuMinimize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveChat(null);
                    setUnreadCount(0);
                  }}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer border-none bg-transparent"
                  title="Close"
                >
                  <LuX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar flex flex-col bg-slate-50 dark:bg-slate-950/40">
              {loading ? (
                <div className="my-auto text-center text-slate-400 text-xs font-semibold">
                  Loading chat history...
                </div>
              ) : messages.length === 0 ? (
                <div className="my-auto text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
                    <LuMessageCircle size={22} />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Say hello!</p>
                  <p className="text-[11px] text-slate-400">Ask about availability, pricing, or arrange a visit.</p>
                </div>
              ) : (
                messages.map((msg: any) => {
                  const isMe = msg.sender_id === currentUserId || msg.senderId === currentUserId;
                  const senderName = isMe ? 'You' : (msg.sender?.name || activeChat.partnerName || 'User');
                  const time = new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[82%] ${isMe ? 'self-end items-end text-right' : 'self-start items-start text-left'}`}
                    >
                      <span className="text-[9px] font-bold text-slate-400 mb-0.5 px-1">
                        {senderName} • {time}
                      </span>
                      <div
                        className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                          isMe
                            ? `${activeChat.type === 'annex' ? 'bg-blue-600' : activeChat.type === 'event' ? 'bg-rose-600' : 'bg-purple-600'} text-white rounded-tr-none`
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                disabled={sending}
                className="flex-1 bg-slate-100 dark:bg-slate-800/80 border-none px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className={`p-2.5 text-white rounded-xl transition-all cursor-pointer border-none flex items-center justify-center shrink-0 disabled:opacity-50 ${
                  activeChat.type === 'annex'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : activeChat.type === 'event'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                <LuSend className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Bubble Pill (Like FB Messenger Chat Head) */}
      <AnimatePresence>
        {isMinimized && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => {
              setIsMinimized(false);
              setUnreadCount(0);
            }}
            className="pointer-events-auto relative p-1.5 bg-white dark:bg-slate-900 border-2 border-blue-500 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            title={`Open chat with ${activeChat.partnerName || 'User'}`}
          >
            <img
              src={activeChat.partnerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChat.partnerName || 'User'}`}
              alt={activeChat.partnerName || 'User'}
              className="w-12 h-12 rounded-full object-cover"
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce">
                {unreadCount}
              </span>
            )}
            <div className="absolute -top-1 -left-1 p-1 bg-blue-600 text-white rounded-full">
              <LuMaximize2 size={10} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalFloatingChat;
