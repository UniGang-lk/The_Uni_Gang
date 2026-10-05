import React, { useState, useEffect, useRef } from 'react';
import {
  LuUser, LuMail, LuPhone, LuBuilding, LuLock, LuCamera, LuPencil, LuSave,
  LuEye, LuEyeOff, LuFacebook, LuLinkedin,
  LuMessageSquare, LuActivity, LuChevronRight, LuShieldCheck,
  LuCalendar, LuLayoutGrid, LuTrophy, LuSettings, LuLogOut, LuBriefcase, LuX, LuSend, LuTrash2, LuMegaphone, LuShoppingBag, LuStar,
  LuClock, LuHouse, LuGraduationCap, LuBell, LuLifeBuoy
} from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import SEO from '../../components/SEO';
import VerifiedBadge from '../../components/ui/VerifiedBadge';
import toast from 'react-hot-toast';
import { api } from '../../api';
import { celebrate } from '../../utils/celebrate';
import { playNotificationSound, requestNotificationPermission, triggerPushNotification } from '../../utils/sound';

import PremiumPageLoader from '../../components/ui/PremiumPageLoader';

const getInputClasses = (isEditing: boolean, focusTheme: 'blue' | 'purple' | 'indigo' | 'brand', isPassword = false) => {
  const base = `w-full pl-12 ${isPassword ? 'pr-12' : 'pr-4'} py-3 rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none`;

  if (isEditing) {
    let focusClasses = "";
    if (focusTheme === 'blue') {
      focusClasses = "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20";
    } else if (focusTheme === 'purple') {
      focusClasses = "focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 dark:focus:border-purple-400 dark:focus:ring-purple-400/20";
    } else if (focusTheme === 'indigo') {
      focusClasses = "focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20";
    } else {
      focusClasses = "focus:border-red-500 focus:ring-4 focus:ring-red-500/20 dark:focus:border-red-400 dark:focus:ring-red-400/20";
    }
    return `${base} bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-white/20 text-slate-900 dark:text-white ${focusClasses} shadow-sm`;
  } else {
    return `${base} bg-slate-100/60 dark:bg-slate-900/40 border-2 border-slate-200/40 dark:border-white/10 text-slate-800 dark:text-slate-100 cursor-not-allowed select-none`;
  }
};

const getIconClasses = (isEditing: boolean, theme: 'blue' | 'purple' | 'indigo' | 'brand') => {
  const base = "absolute left-3 p-2 rounded-lg transition-all duration-300";
  if (isEditing) {
    if (theme === 'blue') {
      return `${base} bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400`;
    } else if (theme === 'purple') {
      return `${base} bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400`;
    } else if (theme === 'indigo') {
      return `${base} bg-indigo-600/10 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-400`;
    } else {
      return `${base} bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400`;
    }
  } else {
    return `${base} bg-slate-500/5 text-slate-400 dark:text-slate-500`;
  }
};

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [university, setUniversity] = useState<string>('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Expanded Social & Stats State
  const [fbHandle, setFbHandle] = useState('');
  const [linkedinHandle, setLinkedinHandle] = useState('');
  const [stats, setStats] = useState({
    savedAnnexes: 0,
    recentReviews: 0,
    activityScore: 0,
    registeredEvents: 0,
    publishedAds: 0,
    rewardPoints: 0,
    followers: 0,
    following: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showServicesModal, setShowServicesModal] = useState(false);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const [showBlogsModal, setShowBlogsModal] = useState(false);
  const [submittedBlogs, setSubmittedBlogs] = useState<any[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);

  const [showEventsModal, setShowEventsModal] = useState(false);
  const [submittedEvents, setSubmittedEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');

  const [showAdsModal, setShowAdsModal] = useState(false);
  const [myAds, setMyAds] = useState<any[]>([]);
  const [loadingAds, setLoadingAds] = useState(false);

  // Marketplace states
  const [showListingsModal, setShowListingsModal] = useState(false);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);

  // Annex and Verification states
  const [myAnnexes, setMyAnnexes] = useState<any[]>([]);
  const [, setLoadingAnnexes] = useState(false);
  const [isVerifiedStudent, setIsVerifiedStudent] = useState(false);
  const [isVerifiedLandlord, setIsVerifiedLandlord] = useState(false);
  const [isVerificationPending, setIsVerificationPending] = useState(false);

  // Campus Email Verify Modal states
  const [showVerifyIdModal, setShowVerifyIdModal] = useState(false);
  const [campusEmailInput, setCampusEmailInput] = useState('');
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [emailVerificationStep, setEmailVerificationStep] = useState<'enter_email' | 'enter_code'>('enter_email');
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'annexes' | 'marketplace' | 'events' | 'security'>('overview');

  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchMyOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await api.getMyMarketOrders();
      setMyOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchSupportProblems = async () => {
    try {
      setLoadingSupport(true);
      const data = await api.getMySupportProblems();
      setSupportProblems(data);
    } catch (err) {
      console.error('Failed to load support tickets:', err);
    } finally {
      setLoadingSupport(false);
    }
  };

  // Unified Inbox states
  const [showInboxModal, setShowInboxModal] = useState(false);
  const [inboxTab, setInboxTab] = useState<'annex' | 'marketplace' | 'events' | 'support'>('annex');

  // Annex Chat states
  const [annexChats, setAnnexChats] = useState<any[]>([]);
  const [loadingAnnexChats, setLoadingAnnexChats] = useState(false);
  const [selectedAnnexChat, setSelectedAnnexChat] = useState<any | null>(null);
  const [annexChatMessages, setAnnexChatMessages] = useState<any[]>([]);
  const [annexChatText, setAnnexChatText] = useState('');

  const fetchAnnexChats = async () => {
    try {
      setLoadingAnnexChats(true);
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/annexes/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAnnexChats(data.chats || []);
      }
    } catch (err) {
      console.error('Failed to load annex chats:', err);
    } finally {
      setLoadingAnnexChats(false);
    }
  };

  const fetchAnnexMessages = async (chatId: string) => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/annexes/chats/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAnnexChatMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load annex messages:', err);
    }
  };

  const handleSendAnnexMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnnexChat || !annexChatText.trim()) return;

    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/annexes/chats/${selectedAnnexChat.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: annexChatText.trim() })
      });
      const data = await res.json();
      if (data.success) {
        playNotificationSound();
        setAnnexChatMessages(prev => [...prev, data.message]);
        setAnnexChatText('');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  useEffect(() => {
    if (selectedAnnexChat) {
      fetchAnnexMessages(selectedAnnexChat.id);
    }
  }, [selectedAnnexChat]);

  // Real-time Socket Audio Chimes & Desktop Push Notifications Listener
  useEffect(() => {
    requestNotificationPermission();

    const socketUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
    const socket = io(socketUrl, {
      auth: { token: localStorage.getItem('userToken') }
    });

    const userId = localStorage.getItem('userId');
    if (userId) {
      socket.emit('join_user_room', userId);
    }

    socket.on('new_annex_message', (data: any) => {
      playNotificationSound();
      triggerPushNotification('New Annex Inquiry Message', {
        body: data.message?.message || 'You received a new inquiry message for your annex listing.'
      });
      fetchAnnexChats();
    });

    socket.on('new_market_message', (data: any) => {
      playNotificationSound();
      triggerPushNotification('New Marketplace Message', {
        body: data.message?.message || 'You received a new message regarding a marketplace item.'
      });
    });

    socket.on('new_event_message', (data: any) => {
      playNotificationSound();
      triggerPushNotification('New Event Inquiry Message', {
        body: data.message?.message || 'You received a new message regarding a campus event.'
      });
      fetchEventChats();
    });

    socket.on('new_notification', (data: any) => {
      playNotificationSound();
      triggerPushNotification(data.title || 'Notification', {
        body: data.message || 'You have a new update.'
      });
    });

    socket.on('blog_updated', (data: any) => {
      setSubmittedBlogs(prev => prev.map(b => b.id === data.blogId ? { ...b, status: data.status, ...(data.blog || {}) } : b));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Marketplace states
  const [marketplaceChats, setMarketplaceChats] = useState<any[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatText, setChatText] = useState('');

  // Event chat states
  const [eventChats, setEventChats] = useState<any[]>([]);
  const [loadingEventChats, setLoadingEventChats] = useState(false);
  const [selectedEventChat, setSelectedEventChat] = useState<any | null>(null);
  const [eventChatMessages, setEventChatMessages] = useState<any[]>([]);
  const [eventChatText, setEventChatText] = useState('');

  // Support Inbox states
  const [supportProblems, setSupportProblems] = useState<any[]>([]);
  const [loadingSupport, setLoadingSupport] = useState(false);
  const [selectedSupportTicket, setSelectedSupportTicket] = useState<any | null>(null);

  const fetchEventChats = async () => {
    try {
      setLoadingEventChats(true);
      const data = await api.getEventChats();
      setEventChats(data);
    } catch (err) {
      console.error('Failed to load event chats:', err);
    } finally {
      setLoadingEventChats(false);
    }
  };

  const handleSendEventMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventChat || !eventChatText.trim()) return;
    try {
      const sent = await api.sendEventMessage(selectedEventChat.id, eventChatText.trim());
      setEventChatMessages(prev => [...prev, sent]);
      setEventChatText('');
      const updated = await api.getEventChats();
      setEventChats(updated);
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message.');
    }
  };

  const fetchSubmittedEvents = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      setLoadingEvents(true);
      const data = await api.getMyEvents(token);
      setSubmittedEvents(data);
    } catch (err) {
      console.error('Failed to load submitted events:', err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchMyAds = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      setLoadingAds(true);
      const data = await api.getMyAdvertisements(token);
      setMyAds(data);
    } catch (err) {
      console.error('Failed to load my advertisements:', err);
    } finally {
      setLoadingAds(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event concept? This will permanently remove it from the platform.")) {
      return;
    }
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      await api.deleteEvent(id, token);
      setSubmittedEvents(submittedEvents.filter(e => e.id !== id));
      setSelectedEvent(null);
      toast.success("Event deleted successfully.");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete event.");
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) return;
      try {
        setLoadingRequests(true);
        const data = await api.getMyServiceRequests(token);
        setServiceRequests(data);
      } catch (err) {
        console.error('Failed to load service requests:', err);
      } finally {
        setLoadingRequests(false);
      }
    };
    
    const fetchBlogs = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) return;
      try {
        setLoadingBlogs(true);
        const data = await api.getMyBlogs(token);
        setSubmittedBlogs(data);
      } catch (err) {
        console.error('Failed to load submitted blogs:', err);
      } finally {
        setLoadingBlogs(false);
      }
    };

    const fetchNetwork = async () => {
      const token = localStorage.getItem('userToken');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) return;
      try {
        const data = await api.getUserNetwork(userId, token);
        setStats(prev => ({
          ...prev,
          followers: data.followersCount || 0,
          following: data.followingCount || 0
        }));
      } catch (err) {
        console.error('Failed to load network:', err);
      }
    };

    fetchRequests();
    fetchSubmittedEvents();
    fetchBlogs();
    fetchNetwork();
    fetchMyAds();
    fetchListings();
    fetchMyAnnexes();
    fetchUserProfile();
    fetchChats();
    fetchEventChats();
    fetchMyOrders();
    fetchSupportProblems();
  }, []);

  const fetchListings = async () => {
    try {
      setLoadingListings(true);
      const data = await api.getMyListings();
      setMyListings(data);
    } catch (err) {
      console.error('Failed to load listings:', err);
    } finally {
      setLoadingListings(false);
    }
  };

  const fetchMyAnnexes = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      setLoadingAnnexes(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/annexes/my-listings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMyAnnexes(data || []);
      }
    } catch (err) {
      console.error('Failed to load my annexes:', err);
    } finally {
      setLoadingAnnexes(false);
    }
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setIsVerifiedStudent(!!data.user.is_verified_student);
          setIsVerifiedLandlord(!!data.user.is_verified_landlord);
          // If email is linked but not verified, or legacy ID upload exists -> pending
          setIsVerificationPending(!data.user.is_verified_student && (!!data.user.campus_email || !!data.user.verification_id_url));
          // Sync with navbar
          localStorage.setItem('userIsVerifiedStudent', String(!!data.user.is_verified_student));
          window.dispatchEvent(new Event('auth-update'));
        }
      }
    } catch (err) {
      console.error('Failed to load user profile verification:', err);
    }
  };

  const fetchChats = async () => {
    try {
      setLoadingChats(true);
      const data = await api.getMarketplaceChats();
      setMarketplaceChats(data);
    } catch (err) {
      console.error('Failed to load chats:', err);
    } finally {
      setLoadingChats(false);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this listing? This will permanently remove it from the platform.")) {
      return;
    }
    try {
      await api.deleteListing(id);
      setMyListings(prev => prev.filter(item => item.id !== id));
      toast.success("Listing deleted successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete listing.");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const chatId = params.get('chatId');
    const type = params.get('type') || 'marketplace';
    if (tab === 'orders') {
      setShowOrdersModal(true);
      fetchMyOrders();
    }
    if (tab === 'inbox' || tab === 'annex_inbox') {
      setShowInboxModal(true);
      const actualType = tab === 'annex_inbox' ? 'annex' : type;
      setInboxTab(actualType as any);

      if (actualType === 'annex') {
        const selectParamAnnexChat = async () => {
          try {
            setLoadingAnnexChats(true);
            const token = localStorage.getItem('userToken');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/annexes/chats`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.chats)) {
              setAnnexChats(data.chats);
              if (chatId) {
                const found = data.chats.find((c: any) => c.id === chatId);
                if (found) {
                  setSelectedAnnexChat(found);
                }
              }
            }
          } catch (err) {
            console.error('Error selecting param annex chat:', err);
          } finally {
            setLoadingAnnexChats(false);
          }
        };
        selectParamAnnexChat();
      } else if (actualType === 'marketplace' && chatId) {
        const selectParamChat = async () => {
          try {
            const data = await api.getMarketplaceChats();
            setMarketplaceChats(data);
            const found = data.find((c: any) => c.id === chatId);
            if (found) {
              setSelectedChat(found);
            }
          } catch (err) {
            console.error('Error selecting param chat:', err);
          }
        };
        selectParamChat();
      } else if (actualType === 'event' && chatId) {
        const selectParamEventChat = async () => {
          try {
            const data = await api.getEventChats();
            setEventChats(data);
            const found = data.find((c: any) => c.id === chatId);
            if (found) {
              setSelectedEventChat(found);
            }
          } catch (err) {
            console.error('Error selecting param event chat:', err);
          }
        };
        selectParamEventChat();
      }
    }
  }, []);

  useEffect(() => {
    let socket: any;
    const fetchChatMessages = async () => {
      if (!selectedChat) return;
      try {
        const msgs = await api.getMarketplaceMessages(selectedChat.id);
        setChatMessages(msgs);
      } catch (err) {
        console.error(err);
      }
    };

    if (selectedChat) {
      // Fetch initial chat history once
      fetchChatMessages();

      // Establish real-time Socket.io link
      socket = io(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}`, {
        withCredentials: true,
        auth: { token: localStorage.getItem('userToken') }
      });

      // Join chat room session
      socket.emit('join_chat', selectedChat.id);

      // Listen for inbound messages
      socket.on('receive_message', (msg: any) => {
        if (msg.chat_id === selectedChat.id) {
          setChatMessages(prev => {
            const exists = prev.some(m => m.id === msg.id);
            if (exists) return prev;
            return [...prev, msg];
          });
        }
      });
    }

    return () => {
      if (socket) {
        if (selectedChat) {
          socket.emit('leave_chat', selectedChat.id);
        }
        socket.disconnect();
      }
    };
  }, [selectedChat]);

  useEffect(() => {
    let socket: any;
    const fetchChatMessages = async () => {
      if (!selectedEventChat) return;
      try {
        const msgs = await api.getEventMessages(selectedEventChat.id);
        setEventChatMessages(msgs);
      } catch (err) {
        console.error(err);
      }
    };

    if (selectedEventChat) {
      fetchChatMessages();

      socket = io(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}`, {
        withCredentials: true,
        auth: { token: localStorage.getItem('userToken') }
      });

      socket.emit('join_chat', selectedEventChat.id);

      socket.on('receive_message', (msg: any) => {
        if (msg.chat_id === selectedEventChat.id) {
          setEventChatMessages(prev => {
            const exists = prev.some(m => m.id === msg.id);
            if (exists) return prev;
            return [...prev, msg];
          });
        }
      });
    }

    return () => {
      if (socket) {
        if (selectedEventChat) {
          socket.emit('leave_chat', selectedEventChat.id);
        }
        socket.disconnect();
      }
    };
  }, [selectedEventChat]);

  const handleSendMarketplaceMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !chatText.trim()) return;
    try {
      const sent = await api.sendMarketplaceMessage(selectedChat.id, chatText.trim());
      setChatMessages(prev => [...prev, sent]);
      setChatText('');
      // Sync chats list updated_at
      const updated = await api.getMarketplaceChats();
      setMarketplaceChats(updated);
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message.');
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedRequest) return;
      const token = localStorage.getItem('userToken');
      if (!token) return;
      try {
        setLoadingMessages(true);
        const data = await api.getServiceMessages(selectedRequest.id, token);
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedRequest]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !newMessageText.trim()) return;
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const sent = await api.addServiceMessage(selectedRequest.id, newMessageText, token);
      setMessages([...messages, sent]);
      setNewMessageText('');
    } catch (err) {
      console.error('Failed to send message:', err);
      toast.error('Failed to send message.');
    }
  };

  useEffect(() => {
    const storedFirstName = localStorage.getItem('userFirstName') || 'John';
    const storedLastName = localStorage.getItem('userLastName') || 'Doe';
    const storedEmail = localStorage.getItem('userEmail') || 'john.doe@example.com';
    const storedPhoneNumber = localStorage.getItem('userPhoneNumber') || '0712345678';
    const storedUniversity = localStorage.getItem('userUniversity') || '';
    const storedPassword = localStorage.getItem('userPassword') || 'dummy_password';
    const storedProfilePic = localStorage.getItem('userProfilePicture');
    const storedFb = localStorage.getItem('userFbHandle') || '';
    const storedLinkedin = localStorage.getItem('userLinkedinHandle') || '';

    setFirstName(storedFirstName);
    setLastName(storedLastName);
    setEmail(storedEmail);
    setPhoneNumber(storedPhoneNumber);
    setUniversity(storedUniversity);
    setPassword(storedPassword);
    setProfilePicture(storedProfilePic);
    setFbHandle(storedFb);
    setLinkedinHandle(storedLinkedin);

    // Enhanced Mock stats
    setStats(prev => ({
      ...prev,
      savedAnnexes: 5,
      recentReviews: 12,
      activityScore: 88,
      registeredEvents: 3,
      publishedAds: 1,
      rewardPoints: 1250
    }));

    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
        localStorage.setItem('userProfilePicture', reader.result as string);
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    const fullName = `${firstName} ${lastName}`.trim();

    if (token) {
      try {
        await api.updateProfile({
          name: fullName,
          profile_pic: profilePicture,
          phone: phoneNumber
        }, token);
        localStorage.setItem('userName', fullName);
      } catch (err: any) {
        console.error('Failed to sync profile changes with backend:', err);
        toast.error('Sync error: changes saved locally but failed to save to server.');
      }
    }

    localStorage.setItem('userFirstName', firstName);
    localStorage.setItem('userLastName', lastName);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPhoneNumber', phoneNumber);
    localStorage.setItem('userUniversity', university);
    localStorage.setItem('userPassword', password);
    localStorage.setItem('userFbHandle', fbHandle);
    localStorage.setItem('userLinkedinHandle', linkedinHandle);

    if (profilePicture) {
      localStorage.setItem('userProfilePicture', profilePicture);
    } else {
      localStorage.removeItem('userProfilePicture');
    }

    setIsEditing(false);
    toast.success('Profile saved successfully!');
    celebrate();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pt-8 pb-24 px-4 font-sans transition-colors duration-500">
      <PremiumPageLoader isLoading={loading} message="Authenticating your profile..." />
      <SEO title="Member Profile | The Uni Gang" />

      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto relative z-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">

              {/* ═════════ LEFT: Profile Sidebar ═════════ */}
              <aside className="lg:sticky lg:top-24 space-y-4">
                <div className="rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                  {/* Cover */}
                  <div className="h-24 relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{ backgroundImage: 'radial-gradient(at 20% 20%, rgba(255,255,255,0.4) 0, transparent 50%)' }}
                    />
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      <button type="button" aria-label="Settings" className="p-2 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-all cursor-pointer">
                        <LuSettings className="w-4 h-4" />
                      </button>
                      <button type="button" aria-label="Log out" className="p-2 rounded-lg bg-white/15 hover:bg-red-500/70 border border-white/20 text-white transition-all cursor-pointer">
                        <LuLogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="px-5 pb-5 -mt-12 text-center">
                    {/* Avatar */}
                    <div className="relative inline-block">
                      <div
                        className={`p-1 rounded-full shadow-lg ${
                          isVerifiedStudent
                            ? 'bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-400'
                            : 'bg-white dark:bg-slate-800'
                        }`}
                      >
                        <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                          {profilePicture ? (
                            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <LuUser className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            </div>
                          )}
                          <AnimatePresence>
                            {isEditing && (
                              <motion.button
                                type="button"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 text-white cursor-pointer border-none"
                              >
                                <LuCamera className="w-5 h-5" />
                              </motion.button>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleProfilePictureChange} className="hidden" accept="image/*" />
                    </div>

                    {/* Identity */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                          {firstName} {lastName}
                        </h1>
                        {(isVerifiedStudent || isVerifiedLandlord) && <VerifiedBadge size={18} title="Verified Student Member" />}
                      </div>

                      {(isVerifiedStudent || isVerifiedLandlord) ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                          Verified Student
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-500/10 border border-slate-400/25 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                          <LuShieldCheck className="w-3.5 h-3.5" /> Email Verified
                        </span>
                      )}

                      <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {email && <p className="flex items-center justify-center gap-1.5 truncate"><LuMail className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{email}</span></p>}
                        {university && <p className="flex items-center justify-center gap-1.5"><LuGraduationCap className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{university}</span></p>}
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Member</span>
                        {myAnnexes.length > 0 && <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Annex Provider</span>}
                        {submittedEvents.length > 0 && <span className="px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[10px] font-bold uppercase tracking-wider">Event Master</span>}
                        {myListings.length > 0 && <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold uppercase tracking-wider">Market Seller</span>}
                      </div>
                    </div>

                    {/* Edit actions */}
                    <div className="mt-5">
                      <AnimatePresence mode="wait">
                        {!isEditing ? (
                          <motion.button
                            key="edit-btn"
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsEditing(true)}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer border-none"
                          >
                            <LuPencil className="w-4 h-4" /> Edit Profile
                          </motion.button>
                        ) : (
                          <motion.div key="actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs border border-slate-200 dark:border-slate-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.98 }}
                              onClick={handleSave}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer border-none"
                            >
                              <LuSave className="w-4 h-4" /> Save
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm p-2 flex lg:flex-col gap-1 overflow-x-auto custom-scrollbar">
                  {[
                    { id: 'overview', label: 'Overview', icon: LuUser, count: null as number | null },
                    { id: 'annexes', label: 'My Annexes', icon: LuBuilding, count: myAnnexes.length },
                    { id: 'marketplace', label: 'Marketplace', icon: LuLayoutGrid, count: myListings.length },
                    { id: 'events', label: 'Events & Services', icon: LuCalendar, count: submittedEvents.length + serviceRequests.length },
                    { id: 'security', label: 'Security', icon: LuLock, count: null as number | null },
                  ].map((tab) => {
                    const active = activeProfileTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveProfileTab(tab.id as any)}
                        className={`shrink-0 lg:w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none ${
                          active
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                            : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="flex items-center gap-2.5 whitespace-nowrap"><tab.icon className="w-4 h-4" /> {tab.label}</span>
                        {tab.count !== null && (
                          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${active ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>{tab.count}</span>
                        )}
                      </button>
                    );
                  })}
                </nav>

                <p className="hidden lg:block text-center text-[10px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                  Protected by UniGang Security
                </p>
              </aside>

              {/* ═════════ RIGHT: Content ═════════ */}
              <main className="space-y-6 min-w-0">
                {/* Key metrics */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                  {[
                    { label: 'Followers', value: stats.followers, icon: LuUser, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Following', value: stats.following, icon: LuActivity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Activity', value: `${stats.activityScore}%`, icon: LuActivity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Reward Points', value: stats.rewardPoints, icon: LuTrophy, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm">
                      <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon size={18} /></div>
                      <div>
                        <div className="text-lg font-black text-slate-900 dark:text-white leading-none">{stat.value}</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick access */}
                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                  {[
                    { label: 'Inbox', value: marketplaceChats.length + eventChats.length + supportProblems.length, icon: LuMessageSquare, color: 'text-blue-500', onClick: () => { setShowInboxModal(true); fetchSupportProblems(); fetchChats(); fetchEventChats(); } },
                    { label: 'Listings', value: myListings.length, icon: LuLayoutGrid, color: 'text-orange-500', onClick: () => setShowListingsModal(true) },
                    { label: 'Ads', value: myAds.length, icon: LuMegaphone, color: 'text-rose-500', onClick: () => setShowAdsModal(true) },
                    { label: 'Orders', value: myOrders.length, icon: LuShoppingBag, color: 'text-amber-500', onClick: () => { setShowOrdersModal(true); fetchMyOrders(); } },
                    { label: 'Services', value: serviceRequests.length, icon: LuBriefcase, color: 'text-sky-500', onClick: () => setShowServicesModal(true) },
                    { label: 'Blogs', value: submittedBlogs.length, icon: LuMessageSquare, color: 'text-purple-500', onClick: () => setShowBlogsModal(true) },
                    { label: 'Events', value: submittedEvents.length, icon: LuCalendar, color: 'text-pink-500', onClick: () => setShowEventsModal(true) },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={item.onClick}
                      className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500/60 hover:shadow-sm transition-all cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200"
                    >
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span>{item.label}</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400">{item.value}</span>
                    </button>
                  ))}
                </div>

                {/* ── TAB 1: OVERVIEW ── */}
                {activeProfileTab === 'overview' && (
                  <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
                    {!isVerifiedStudent && (
                      isVerificationPending ? (
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                          <div className="w-10 h-10 shrink-0 bg-amber-500/15 rounded-xl flex items-center justify-center"><LuClock className="w-5 h-5 text-amber-600" /></div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300">Verify Campus Email</h3>
                            <p className="text-xs text-amber-700 dark:text-amber-400/80">A verification code was generated for your university email. Enter it to finish verification.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setEmailVerificationStep('enter_code'); setShowVerifyIdModal(true); }}
                            className="shrink-0 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-xs cursor-pointer transition-colors border-none"
                          >
                            <LuShieldCheck className="w-4 h-4" /> Enter Code
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white border border-blue-400/30">
                          <div className="w-10 h-10 shrink-0 bg-white/15 rounded-xl flex items-center justify-center"><LuGraduationCap className="w-5 h-5" /></div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold">Get your Verified Student badge</h3>
                            <p className="text-xs text-blue-100">Verify with your .ac.lk email for instant approval, auto-approved ads and higher trust.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setEmailVerificationStep('enter_email'); setShowVerifyIdModal(true); }}
                            className="shrink-0 inline-flex items-center justify-center gap-2 bg-white text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-xl font-bold text-xs cursor-pointer transition-all border-none"
                          >
                            <LuShieldCheck className="w-4 h-4" /> Verify Now
                          </button>
                        </div>
                      )
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500"><LuUser className="w-5 h-5" /></div>
                          <h2 className="text-base font-bold text-slate-900 dark:text-white">Personal Details</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="group space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-focus-within:text-blue-500 transition-colors">First Name</label>
                            <div className="relative flex items-center">
                              <div className={getIconClasses(isEditing, 'blue')}><LuUser className="w-4 h-4" /></div>
                              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={!isEditing} className={getInputClasses(isEditing, 'blue')} />
                            </div>
                          </div>
                          <div className="group space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-focus-within:text-blue-500 transition-colors">Last Name</label>
                            <div className="relative flex items-center">
                              <div className={getIconClasses(isEditing, 'blue')}><LuUser className="w-4 h-4" /></div>
                              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={!isEditing} className={getInputClasses(isEditing, 'blue')} />
                            </div>
                          </div>
                        </div>

                        <div className="group space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-focus-within:text-blue-500 transition-colors">Contact Number</label>
                          <div className="relative flex items-center">
                            <div className={getIconClasses(isEditing, 'blue')}><LuPhone className="w-4 h-4" /></div>
                            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={!isEditing} className={getInputClasses(isEditing, 'blue')} />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
                          <div className="relative flex items-center">
                            <div className="absolute left-3 p-2 rounded-lg bg-slate-500/5 text-slate-400 dark:text-slate-500"><LuMail className="w-4 h-4" /></div>
                            <input
                              type="email"
                              value={email}
                              disabled={true}
                              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-white/5 text-sm font-semibold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                          <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500"><LuBuilding className="w-5 h-5" /></div>
                          <h2 className="text-base font-bold text-slate-900 dark:text-white">University & Social</h2>
                        </div>

                        <div className="group space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-focus-within:text-purple-500 transition-colors">University</label>
                          <div className="relative flex items-center">
                            <div className={getIconClasses(isEditing, 'purple')}><LuBuilding className="w-4 h-4" /></div>
                            <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} disabled={!isEditing} placeholder="e.g. University of Moratuwa" className={getInputClasses(isEditing, 'purple')} />
                          </div>
                        </div>

                        <div className="group space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 transition-colors">Facebook</label>
                          <div className="relative flex items-center">
                            <div className={getIconClasses(isEditing, 'blue')}><LuFacebook className="w-4 h-4" /></div>
                            <input type="text" value={fbHandle} placeholder="@username" onChange={(e) => setFbHandle(e.target.value)} disabled={!isEditing} className={getInputClasses(isEditing, 'blue')} />
                          </div>
                        </div>

                        <div className="group space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-focus-within:text-indigo-600 transition-colors">LinkedIn</label>
                          <div className="relative flex items-center">
                            <div className={getIconClasses(isEditing, 'indigo')}><LuLinkedin className="w-4 h-4" /></div>
                            <input type="text" value={linkedinHandle} placeholder="profile-id" onChange={(e) => setLinkedinHandle(e.target.value)} disabled={!isEditing} className={getInputClasses(isEditing, 'indigo')} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* ── TAB 2: ANNEXES ── */}
                {activeProfileTab === 'annexes' && (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">My Boarding Places & Annexes</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Manage your listings and view student inquiries</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => { setShowInboxModal(true); setInboxTab('annex'); fetchAnnexChats(); }}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-blue-400 transition-all cursor-pointer"
                        >
                          <LuMessageSquare className="w-4 h-4" /> Inquiries ({annexChats.length})
                        </button>
                        <a href="/post-ad" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all no-underline">
                          <LuBuilding className="w-4 h-4" /> Post New Annex
                        </a>
                      </div>
                    </div>

                    {myAnnexes.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {myAnnexes.map((annexItem: any) => (
                          <div key={annexItem.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${annexItem.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
                                  {annexItem.status || 'Approved'}
                                </span>
                                <span className="text-sm font-black text-blue-600 dark:text-blue-400">Rs. {parseFloat(annexItem.price || 0).toLocaleString()}</span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{annexItem.title}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{annexItem.address}</p>
                            </div>
                            <a href={`/annex/${annexItem.id}`} className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl text-center transition-all block no-underline">
                              View Listing
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 text-center rounded-2xl bg-white dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700">
                        <LuBuilding className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white">No annex listings yet</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">You have not posted any boarding places or annexes.</p>
                        <a href="/post-ad" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl no-underline">+ Post Your Boarding Place</a>
                      </div>
                    )}
                  </div>
                )}

                {/* ── TAB 3: MARKETPLACE ── */}
                {activeProfileTab === 'marketplace' && (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Marketplace & Orders</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Manage items for sale and your buyer orders</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => { setShowOrdersModal(true); fetchMyOrders(); }}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-blue-400 transition-all cursor-pointer"
                        >
                          <LuShoppingBag className="w-4 h-4" /> Orders ({myOrders.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowInboxModal(true); setInboxTab('marketplace'); fetchChats(); }}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-blue-400 transition-all cursor-pointer"
                        >
                          <LuMessageSquare className="w-4 h-4" /> Buyer Chats ({marketplaceChats.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowListingsModal(true)}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer border-none"
                        >
                          <LuLayoutGrid className="w-4 h-4" /> Manage Listings ({myListings.length})
                        </button>
                      </div>
                    </div>

                    {myListings.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {myListings.map((item: any) => (
                          <div key={item.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${item.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
                                  {item.status || 'AVAILABLE'}
                                </span>
                                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">Rs. {parseFloat(item.price || 0).toLocaleString()}</span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{item.description}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteListing(item.id)}
                              className="w-full py-2 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white text-xs font-bold rounded-xl transition-all border-none cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 text-center rounded-2xl bg-white dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700">
                        <LuLayoutGrid className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white">No marketplace items</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">You have not listed any items in Hustle Hub yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── TAB 4: EVENTS, SERVICES & BLOGS ── */}
                {activeProfileTab === 'events' && (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Events, Services & Blogs</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Manage your campus contributions and service requests</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { title: 'Campus Events', desc: `You have submitted ${submittedEvents.length} campus events.`, btn: 'View Events', icon: LuCalendar, tone: 'text-pink-500 bg-pink-500/10', onClick: () => setShowEventsModal(true) },
                        { title: 'Service Requests', desc: `You have ${serviceRequests.length} service requests.`, btn: 'View Services', icon: LuBriefcase, tone: 'text-sky-500 bg-sky-500/10', onClick: () => setShowServicesModal(true) },
                        { title: 'Student Blogs', desc: `You have written ${submittedBlogs.length} blog articles.`, btn: 'View Blogs', icon: LuMessageSquare, tone: 'text-purple-500 bg-purple-500/10', onClick: () => setShowBlogsModal(true) },
                      ].map((card) => (
                        <div key={card.title} className="p-5 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all space-y-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.tone}`}><card.icon className="w-5 h-5" /></div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{card.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{card.desc}</p>
                          </div>
                          <button type="button" onClick={card.onClick} className="w-full inline-flex items-center justify-center gap-1.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all border-none cursor-pointer">
                            {card.btn} <LuChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── TAB 5: SECURITY ── */}
                {activeProfileTab === 'security' && (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Security & Preferences</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Manage your password and notification options</p>
                    </div>

                    <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-500"><LuLock className="w-5 h-5" /></div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Password</h3>
                      </div>
                      <div className="group space-y-1.5 max-w-lg">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Security Key</label>
                        <div className="relative flex items-center">
                          <div className={getIconClasses(isEditing, 'brand')}><LuLock className="w-4 h-4" /></div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={!isEditing}
                            className={getInputClasses(isEditing, 'brand', true)}
                          />
                          {isEditing && (
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer">
                              {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                            </button>
                          )}
                        </div>
                      </div>
                      {isEditing ? (
                        <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs border-none cursor-pointer">
                          Update Security Credentials
                        </button>
                      ) : (
                        <p className="text-xs text-slate-400">Click “Edit Profile” in the sidebar to change your password.</p>
                      )}
                    </form>

                    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500"><LuBell className="w-5 h-5" /></div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Audio Notifications</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Chime played when new messages arrive</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => playNotificationSound()} className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-xs border border-blue-500/20 cursor-pointer">
                          <LuBell size={13} /> Test Sound
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </main>
            </div>

            {/* Backdrop-Blurred Ads Tracker Modal */}
            <AnimatePresence>
              {showAdsModal && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowAdsModal(false)}
                    className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md"
                  />
                  <div className="fixed inset-0 z-[101] overflow-y-auto pointer-events-none flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="w-full max-w-2xl bg-white/95 dark:bg-slate-950/98 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative pointer-events-auto overflow-hidden max-h-[85vh] flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-1 block">My Advertisements</span>
                          <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Campaign Tracker</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAdsModal(false)}
                          className="p-2.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white transition-all hover:rotate-90 duration-300"
                        >
                          <LuX size={18} />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {loadingAds ? (
                          <div className="py-20 text-center text-slate-400 animate-pulse font-black uppercase text-xs">
                            Loading your campaigns...
                          </div>
                        ) : myAds.length === 0 ? (
                          <div className="py-20 text-center bg-slate-500/5 border border-slate-200/10 dark:border-white/10 rounded-3xl">
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active campaigns</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-4">
                            {myAds.map((ad) => (
                              <div key={ad.id} className="p-5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/10 rounded-3xl flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                                      ad.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                      ad.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                      'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                    }`}>
                                      {ad.status}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400">{ad.placement_type}</span>
                                  </div>
                                  <h4 className="text-base font-black text-slate-800 dark:text-white truncate">
                                    {ad.ad_title}
                                  </h4>
                                </div>
                                <div className="text-right">
                                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance</div>
                                  <div className="text-sm font-bold text-slate-800 dark:text-white">{ad.views} <span className="text-slate-500">Views</span></div>
                                  <div className="text-sm font-bold text-slate-800 dark:text-white">{ad.clicks} <span className="text-slate-500">Clicks</span></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>

            {/* Backdrop-Blurred Services Tracker Modal */}
            <AnimatePresence>
              {showServicesModal && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      setShowServicesModal(false);
                      setSelectedRequest(null);
                    }}
                    className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md"
                  />

                  <div className="fixed inset-0 z-[101] overflow-y-auto pointer-events-none flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="w-full max-w-2xl bg-white/95 dark:bg-slate-950/98 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative pointer-events-auto overflow-hidden max-h-[85vh] flex flex-col"
                    >
                      <AnimatePresence mode="wait">
                        {!selectedRequest ? (
                          <motion.div
                            key="list"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex flex-col h-full overflow-hidden"
                          >
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1 block">Services Tracker</span>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Your Service Requests</h3>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowServicesModal(false)}
                                className="p-2.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white transition-all hover:rotate-90 duration-300"
                              >
                                <LuX size={18} />
                              </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                              {loadingRequests ? (
                                <div className="py-20 text-center text-slate-400 dark:text-slate-500 animate-pulse font-black uppercase tracking-widest text-xs">
                                  Retrieving your requests...
                                </div>
                              ) : serviceRequests.length === 0 ? (
                                <div className="py-20 text-center bg-slate-500/5 border border-slate-200/10 dark:border-white/10 rounded-3xl">
                                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No service requests found</p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 gap-4">
                                  {serviceRequests.map((req) => (
                                    <div
                                      key={req.id}
                                      onClick={() => setSelectedRequest(req)}
                                      className="cursor-pointer p-5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/10 rounded-3xl hover:border-blue-500/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-all duration-300 shadow-sm flex items-center justify-between gap-4 group"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${req.status === 'completed'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dark:border-white/10'
                                            : req.status === 'in_progress'
                                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 dark:border-white/10'
                                              : req.status === 'rejected'
                                                ? 'bg-red-500/10 text-red-400 border-red-500/20 dark:border-white/10'
                                                : req.status === 'approved'
                                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 dark:border-white/10'
                                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20 dark:border-white/10'
                                            }`}>
                                            {req.status}
                                          </span>
                                          <span className="text-[10px] font-bold text-slate-400">{new Date(req.created_at || req.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h4 className="text-base font-black text-slate-800 dark:text-white tracking-tight group-hover:text-blue-500 transition-colors truncate">
                                          {req.serviceName}
                                        </h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1 leading-relaxed mt-1">{req.brief}</p>
                                      </div>
                                      <LuChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="detail"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex flex-col h-full overflow-hidden"
                          >
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <button
                                  type="button"
                                  onClick={() => setSelectedRequest(null)}
                                  className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 mb-1 flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  ← Back to list
                                </button>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mt-1">{selectedRequest.serviceName}</h3>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowServicesModal(false);
                                  setSelectedRequest(null);
                                }}
                                className="p-2.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white transition-all hover:rotate-90 duration-300"
                              >
                                <LuX size={18} />
                              </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                              <div className="p-5 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/10 dark:border-white/10">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 mb-2">Project Brief</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedRequest.brief}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/10 dark:border-white/10">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 mb-1">Target Budget</p>
                                  <p className="text-sm font-black text-blue-500">{selectedRequest.budget || 'Open / Custom'}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/10 dark:border-white/10">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 mb-1">Desired Launch</p>
                                  <p className="text-sm font-black text-slate-800 dark:text-white">{selectedRequest.deadline || 'Flexible'}</p>
                                </div>
                              </div>

                              {/* Dynamic Progress Stepper Timeline */}
                              <div className="p-5 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/10 dark:border-white/10">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 mb-4">Lifecycle Status Tracker</p>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative pl-4 sm:pl-0">
                                  {[
                                    { id: 'pending', label: 'Submitted', desc: 'Awaiting review' },
                                    { id: 'approved', label: 'Approved', desc: 'Planning phase' },
                                    { id: 'in_progress', label: 'In Progress', desc: 'Actively crafting' },
                                    { id: 'completed', label: 'Completed', desc: 'Ready & delivered' }
                                  ].map((step, idx, arr) => {
                                    const getStepIndex = (s: string) => {
                                      if (s === 'rejected') return 1;
                                      const stepsMap = ['pending', 'approved', 'in_progress', 'completed'];
                                      const pos = stepsMap.indexOf(s);
                                      return pos === -1 ? 0 : pos;
                                    };
                                    const currentIdx = getStepIndex(selectedRequest.status);
                                    const isDone = idx <= currentIdx;
                                    const isCurrent = idx === currentIdx;
                                    const isRejected = selectedRequest.status === 'rejected' && idx === 1;

                                    return (
                                      <div key={step.id} className="flex sm:flex-col items-start sm:items-center sm:text-center gap-3 sm:gap-2 flex-1 w-full relative z-10">
                                        {idx < arr.length - 1 && (
                                          <div className={`hidden sm:block absolute left-[calc(50%+14px)] top-[13px] w-[calc(100%-28px)] h-0.5 -z-10 ${
                                            idx < currentIdx ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                                          }`} />
                                        )}
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 border-2 ${
                                          isCurrent
                                            ? isRejected
                                              ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20'
                                              : 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                            : isDone
                                              ? 'bg-emerald-500 border-emerald-500 text-white'
                                              : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-400'
                                        }`}>
                                          {isRejected ? '✕' : isDone && !isCurrent ? '✓' : idx + 1}
                                        </div>
                                        <div className="text-left sm:text-center">
                                          <p className={`text-[10px] font-black uppercase tracking-wider ${isCurrent ? 'text-blue-600 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                            {isRejected ? 'Rejected' : step.label}
                                          </p>
                                          <p className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-0.5">
                                            {isRejected ? 'Inquiry declined' : step.desc}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {selectedRequest.adminNotes && (
                                <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/10 dark:border-white/10">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-amber-500 mb-2">Admin Remarks</p>
                                  <p className="text-xs text-slate-700 dark:text-amber-250 leading-relaxed font-semibold italic">"{selectedRequest.adminNotes}"</p>
                                </div>
                              )}

                              {/* On-Site Client-Admin Discussion Thread */}
                              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 flex flex-col h-[320px]">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-450 mb-3 ml-1 text-left">Project DNA Discussions</p>
                                
                                <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar flex flex-col">
                                  {loadingMessages ? (
                                    <div className="my-auto text-center text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider animate-pulse">
                                      Synchronizing comments...
                                    </div>
                                  ) : messages.length === 0 ? (
                                    <div className="my-auto text-center text-slate-450 dark:text-slate-550 text-[10px] font-black uppercase tracking-wider">
                                      Thread initialized. Send details to start chat.
                                    </div>
                                  ) : (
                                    messages.map((msg) => {
                                      const isAdmin = msg.senderType === 'admin';
                                      return (
                                        <div
                                          key={msg.id}
                                          className={`flex flex-col max-w-[85%] ${isAdmin ? 'self-start items-start text-left' : 'self-end items-end text-right'}`}
                                        >
                                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mb-0.5 px-1.5">
                                            {isAdmin ? 'Admin Helpdesk' : 'You'} • {new Date(msg.created_at || msg.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                          <div className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                                            isAdmin 
                                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none' 
                                              : 'bg-blue-600 text-white rounded-tr-none shadow-xs'
                                          }`}>
                                            {msg.message}
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>

                                <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Type your message here..."
                                    value={newMessageText}
                                    onChange={(e) => setNewMessageText(e.target.value)}
                                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                  <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-750 text-white p-3 rounded-xl transition-all shadow-xs flex items-center justify-center cursor-pointer"
                                    aria-label="Send"
                                  >
                                    <LuSend size={15} />
                                  </button>
                                </form>
                              </div>

                              <div className="p-5 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/10 dark:border-white/10">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 mb-2">Registered Contact Connection</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-black text-slate-800 dark:text-white">{selectedRequest.clientPhone}</span>
                                  <a
                                    href={`https://wa.me/${selectedRequest.clientPhone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                  >
                                    Launch Chat
                                  </a>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>

            {/* Backdrop-Blurred Events Tracker Modal */}
            <AnimatePresence>
              {showEventsModal && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      setShowEventsModal(false);
                      setSelectedEvent(null);
                    }}
                    className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md"
                  />

                  <div className="fixed inset-0 z-[101] overflow-y-auto pointer-events-none flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="w-full max-w-2xl bg-white/95 dark:bg-slate-950/98 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative pointer-events-auto overflow-hidden max-h-[85vh] flex flex-col"
                    >
                      <AnimatePresence mode="wait">
                        {!selectedEvent ? (
                          <motion.div
                            key="events-list"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex flex-col h-full overflow-hidden"
                          >
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-1 block">Events Hub</span>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Your Event Submissions</h3>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowEventsModal(false)}
                                className="p-2.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white transition-all hover:rotate-90 duration-300"
                              >
                                <LuX size={18} />
                              </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                              {loadingEvents ? (
                                <div className="py-20 text-center text-slate-400 dark:text-slate-500 animate-pulse font-black uppercase tracking-widest text-xs">
                                  Retrieving your events...
                                </div>
                              ) : submittedEvents.length === 0 ? (
                                <div className="py-20 text-center bg-slate-500/5 border border-slate-200/10 dark:border-white/10 rounded-3xl">
                                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">No event submissions found</p>
                                  <p className="text-[10px] text-slate-400 font-semibold">Share your first campus event to get started!</p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 gap-4">
                                  {submittedEvents.map((evt) => (
                                    <div
                                      key={evt.id}
                                      onClick={() => setSelectedEvent(evt)}
                                      className="cursor-pointer p-5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/10 rounded-3xl hover:border-pink-500/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-all duration-300 shadow-sm flex items-center justify-between gap-4 group"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${evt.status === 'approved'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dark:border-white/10'
                                            : evt.status === 'rejected'
                                              ? 'bg-red-500/10 text-red-400 border-red-500/20 dark:border-white/10'
                                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20 dark:border-white/10'
                                            }`}>
                                            {evt.status}
                                          </span>
                                          <span className="text-[10px] font-bold text-slate-400">{new Date(evt.date).toLocaleDateString()}</span>
                                        </div>
                                        <h4 className="text-base font-black text-slate-800 dark:text-white tracking-tight group-hover:text-pink-500 transition-colors truncate">
                                          {evt.title}
                                        </h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1 leading-relaxed mt-1">{evt.description}</p>
                                      </div>
                                      <LuChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="event-detail"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex flex-col h-full overflow-hidden"
                          >
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <button
                                  type="button"
                                  onClick={() => setSelectedEvent(null)}
                                  className="text-[10px] font-black uppercase tracking-widest text-pink-500 hover:text-pink-600 mb-1 flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  ← Back to list
                                </button>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mt-1">{selectedEvent.title}</h3>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowEventsModal(false);
                                  setSelectedEvent(null);
                                }}
                                className="p-2.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white transition-all hover:rotate-90 duration-300"
                              >
                                <LuX size={18} />
                              </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                              {/* Event Flyer Banner */}
                              <div className="relative h-48 rounded-3xl overflow-hidden border border-slate-200/30 dark:border-white/10 bg-slate-900">
                                <img
                                  src={selectedEvent.image ? (selectedEvent.image.startsWith('http') ? selectedEvent.image : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${selectedEvent.image}`) : 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800'}
                                  alt={selectedEvent.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${selectedEvent.status === 'approved'
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : selectedEvent.status === 'rejected'
                                      ? 'bg-red-500 border-red-500 text-white'
                                      : 'bg-amber-500 border-amber-500 text-white'
                                    }`}>
                                    {selectedEvent.status}
                                  </span>
                                </div>
                              </div>

                              <div className="p-5 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/10 dark:border-white/10">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 mb-2">Event Description</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedEvent.description}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/10 dark:border-white/10">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 mb-1">Alma Mater / University</p>
                                  <p className="text-sm font-black text-slate-800 dark:text-white">{selectedEvent.uni}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/10 dark:border-white/10">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 mb-1">Ticket Price</p>
                                  <p className="text-sm font-black text-pink-500">{selectedEvent.price || 'Free / TBA'}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/10 dark:border-white/10">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 mb-1">Date & Time</p>
                                  <p className="text-sm font-bold text-slate-800 dark:text-white">{new Date(selectedEvent.date).toLocaleDateString()} {selectedEvent.time ? `at ${selectedEvent.time}` : ''}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/10 dark:border-white/10">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 mb-1">Venue Location</p>
                                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{selectedEvent.location}</p>
                                </div>
                              </div>

                              {(selectedEvent.requirements || selectedEvent.extra) && (
                                <div className="p-5 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/10 dark:border-white/10 space-y-4">
                                  {selectedEvent.requirements && (
                                    <div>
                                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 mb-1">Prerequisites / Requirements</p>
                                      <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">{selectedEvent.requirements}</p>
                                    </div>
                                  )}
                                  {selectedEvent.extra && (
                                    <div>
                                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 mb-1">Additional Notes</p>
                                      <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold italic">"{selectedEvent.extra}"</p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Self-Deletion Action */}
                              <div className="p-5 rounded-2xl bg-red-500/5 dark:bg-red-950/10 border border-red-500/10 dark:border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left">
                                  <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">Remove Event Proposal</p>
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-normal">This will permanently delete your submission and take down any listings.</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                                  className="w-full sm:w-auto px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-red-500/10 active:scale-95 border-none"
                                >
                                  <LuTrash2 size={14} /> Delete Concept
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>
            {/* Backdrop-Blurred Blogs Tracker Modal */}
            <AnimatePresence>
              {showBlogsModal && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      setShowBlogsModal(false);
                      setSelectedBlog(null);
                    }}
                    className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md"
                  />

                  <div className="fixed inset-0 z-[101] overflow-y-auto pointer-events-none flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="w-full max-w-2xl bg-white/95 dark:bg-slate-950/98 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative pointer-events-auto overflow-hidden max-h-[85vh] flex flex-col"
                    >
                      <AnimatePresence mode="wait">
                        {!selectedBlog ? (
                          <motion.div
                            key="list"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex flex-col h-full overflow-hidden"
                          >
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-1 block">Content Hub</span>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Your Published Blogs</h3>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowBlogsModal(false)}
                                className="p-2.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white transition-all hover:rotate-90 duration-300"
                              >
                                <LuX size={18} />
                              </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                              {loadingBlogs ? (
                                <div className="py-20 text-center text-slate-400 dark:text-slate-500 animate-pulse font-black uppercase tracking-widest text-xs">
                                  Retrieving your blogs...
                                </div>
                              ) : submittedBlogs.length === 0 ? (
                                <div className="py-20 text-center bg-slate-500/5 border border-slate-200/10 dark:border-white/10 rounded-3xl">
                                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No blogs found</p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 gap-4">
                                  {submittedBlogs.map((blog) => (
                                    <div
                                      key={blog.id}
                                      onClick={() => setSelectedBlog(blog)}
                                      className="cursor-pointer p-5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/10 rounded-3xl hover:border-purple-500/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-all duration-300 shadow-sm flex items-center justify-between gap-4 group"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${blog.status === 'Approved'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dark:border-white/10'
                                            : blog.status === 'Rejected'
                                              ? 'bg-red-500/10 text-red-400 border-red-500/20 dark:border-white/10'
                                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20 dark:border-white/10'
                                            }`}>
                                            {blog.status}
                                          </span>
                                          <span className="text-[10px] font-bold text-slate-400">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h4 className="text-base font-black text-slate-800 dark:text-white tracking-tight group-hover:text-purple-500 transition-colors truncate">
                                          {blog.title}
                                        </h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1 leading-relaxed mt-1">{blog.excerpt}</p>
                                        <div className="flex gap-4 mt-3">
                                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><LuEye size={12} /> {blog.views || 0}</div>
                                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><LuMessageSquare size={12} /> {blog.commentsCount || 0}</div>
                                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><LuActivity size={12} /> {blog.likes || 0}</div>
                                        </div>
                                      </div>
                                      <LuChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="detail"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex flex-col h-full overflow-hidden"
                          >
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <button
                                  type="button"
                                  onClick={() => setSelectedBlog(null)}
                                  className="text-[10px] font-black uppercase tracking-widest text-purple-500 hover:text-purple-600 mb-1 flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  ← Back to list
                                </button>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mt-1 leading-tight">{selectedBlog.title}</h3>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowBlogsModal(false);
                                  setSelectedBlog(null);
                                }}
                                className="p-2.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white transition-all hover:rotate-90 duration-300"
                              >
                                <LuX size={18} />
                              </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                              <div className="relative rounded-2xl overflow-hidden shadow-inner max-h-[250px] bg-slate-900 border border-slate-200/10 dark:border-white/10">
                                {selectedBlog.featuredImage ? (
                                  <img src={selectedBlog.featuredImage} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-32 bg-slate-800 flex items-center justify-center">
                                    <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">No Image</span>
                                  </div>
                                )}
                              </div>

                              <div className="p-5 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/10 dark:border-white/10">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 mb-2">Excerpt</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">"{selectedBlog.excerpt}"</p>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/10 dark:border-white/10 flex flex-col items-center justify-center text-center">
                                  <LuEye size={20} className="text-blue-500 mb-2" />
                                  <p className="text-xl font-black text-slate-800 dark:text-white leading-none mb-1">{selectedBlog.views || 0}</p>
                                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Views</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/10 dark:border-white/10 flex flex-col items-center justify-center text-center">
                                  <LuActivity size={20} className="text-pink-500 mb-2" />
                                  <p className="text-xl font-black text-slate-800 dark:text-white leading-none mb-1">{selectedBlog.likes || 0}</p>
                                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Likes</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-500/5 dark:bg-slate-900/30 border border-slate-200/10 dark:border-white/10 flex flex-col items-center justify-center text-center">
                                  <LuMessageSquare size={20} className="text-purple-500 mb-2" />
                                  <p className="text-xl font-black text-slate-800 dark:text-white leading-none mb-1">{selectedBlog.commentsCount || 0}</p>
                                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Comments</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>

            {/* Backdrop-Blurred Orders Tracker Modal */}
            <AnimatePresence>
              {showOrdersModal && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowOrdersModal(false)}
                    className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md"
                  />

                  <div className="fixed inset-0 z-[101] overflow-y-auto pointer-events-none flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="w-full max-w-2xl bg-white/95 dark:bg-slate-950/98 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative pointer-events-auto overflow-hidden max-h-[85vh] flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1 block">Purchase Hub</span>
                          <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Your Official Store Orders</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowOrdersModal(false)}
                          className="p-2.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-655 dark:text-slate-400 hover:bg-red-500 hover:text-white transition-all hover:rotate-90 duration-300 border-none cursor-pointer"
                        >
                          <LuX size={18} />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {loadingOrders ? (
                          <div className="py-20 text-center text-slate-400 dark:text-slate-500 animate-pulse font-black uppercase tracking-widest text-xs">
                            Retrieving your orders...
                          </div>
                        ) : myOrders.length === 0 ? (
                          <div className="py-20 text-center bg-slate-500/5 border border-slate-200/10 dark:border-white/10 rounded-3xl">
                            <p className="text-slate-505 font-bold uppercase tracking-widest text-xs mb-2">No orders found</p>
                            <p className="text-[10px] text-slate-400 font-semibold">Buy merchandise, souvenirs, or flower bouquets from the Official Store!</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-4">
                            {myOrders.map((order) => {
                              const item = order.item || {};
                              const img = item.images && item.images.length > 0
                                ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${item.images[0]}`
                                : 'https://images.unsplash.com/photo-1521556906631-0c58e7ce65e5?q=80&w=600';
                              
                              const statusSteps = ['PENDING', 'PROCESSING', 'DELIVERED'];
                              const currentStepIdx = statusSteps.indexOf(order.status);
                              const stepLabels = ['Order Placed', 'Processing', 'Delivered'];
                              const isCancelled = order.status === 'CANCELLED';

                              return (
                                <div key={order.id} className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-white/10 rounded-3xl flex flex-col gap-6 text-left">
                                  <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <img src={img} alt="" className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                                    <div className="flex-1 min-w-0 text-center sm:text-left">
                                      <h4 className="text-base font-black text-slate-805 dark:text-white truncate">{item.title || 'Official Product'}</h4>
                                      <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
                                        Qty: {order.quantity} • Total Price: <span className="text-indigo-650 dark:text-indigo-400 font-bold">Rs. {parseFloat(order.total_price).toLocaleString()}</span>
                                      </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                      order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500' :
                                      order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-505' :
                                      'bg-amber-500/10 text-amber-500'
                                    }`}>
                                      {order.status}
                                    </span>
                                  </div>

                                  {/* Custom Stepper Tracker */}
                                  {!isCancelled ? (
                                    <div className="flex items-center justify-between mt-2 pl-2 pr-2">
                                      {stepLabels.map((lbl, idx) => {
                                        const isCompleted = idx <= currentStepIdx;
                                        const isCurrent = idx === currentStepIdx;
                                        return (
                                          <div key={lbl} className="flex items-center gap-2 flex-1 last:flex-none">
                                            <div className="flex items-center gap-2">
                                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                                                isCurrent ? 'bg-indigo-650 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' :
                                                isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                                                'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-400'
                                              }`}>
                                                {isCompleted && !isCurrent ? '✓' : idx + 1}
                                              </div>
                                              <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:inline ${
                                                isCurrent ? 'text-indigo-655 dark:text-white' :
                                                isCompleted ? 'text-slate-700 dark:text-slate-350' :
                                                'text-slate-400 dark:text-slate-600'
                                              }`}>{lbl}</span>
                                            </div>
                                            {idx < stepLabels.length - 1 && (
                                              <div className={`h-0.5 flex-1 min-w-[20px] mx-2 ${
                                                idx < currentStepIdx ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                                              }`} />
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div className="text-center p-3 bg-red-500/5 border border-red-500/10 rounded-2xl text-xs font-bold text-red-550">
                                      This purchase has been cancelled.
                                    </div>
                                  )}
                                  <div className="text-[11px] text-slate-450 border-t border-slate-100 dark:border-white/5 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                      <span className="font-bold text-slate-500 block mb-1">Delivery Address:</span>
                                      {order.delivery_location} • Phone: {order.delivery_phone}
                                      <p className="mt-1 text-slate-405">
                                        Payment Method: <span className="font-bold text-slate-600 dark:text-slate-300">{order.payment_method === 'BANK_TRANSFER' ? 'Direct Bank Transfer' : 'Cash on Delivery (COD)'}</span>
                                      </p>
                                      {order.notes && (
                                        <p className="mt-2 italic text-slate-400">"{order.notes}"</p>
                                      )}
                                    </div>
                                    {order.payment_method === 'BANK_TRANSFER' && order.payment_slip && (
                                      <a
                                        href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${order.payment_slip}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-[10px] font-black text-slate-700 dark:text-white transition-all w-fit cursor-pointer border-none no-underline"
                                      >
                                        View Receipt Slip
                                      </a>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>

            {/* Backdrop-Blurred Listings Modal */}
            <AnimatePresence>
              {showListingsModal && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowListingsModal(false)}
                    className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md"
                  />

                  <div className="fixed inset-0 z-[101] overflow-y-auto pointer-events-none flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="w-full max-w-2xl bg-white/95 dark:bg-slate-950/98 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative pointer-events-auto overflow-hidden max-h-[85vh] flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1 block">Hustle Hub</span>
                          <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Your Listings</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowListingsModal(false)}
                          className="p-2.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white transition-all hover:rotate-90 duration-300"
                        >
                          <LuX size={18} />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {loadingListings ? (
                          <div className="py-20 text-center text-slate-400 dark:text-slate-500 animate-pulse font-black uppercase tracking-widest text-xs">
                            Retrieving your listings...
                          </div>
                        ) : myListings.length === 0 ? (
                          <div className="py-20 text-center bg-slate-500/5 border border-slate-200/10 dark:border-white/10 rounded-3xl">
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">No listings found</p>
                            <p className="text-[10px] text-slate-400 font-semibold">Post a product or gig on the marketplace to start selling!</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-4">
                            {myListings.map((listing) => {
                              const img = listing.images && listing.images.length > 0
                                ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${listing.images[0]}`
                                : 'https://images.unsplash.com/photo-1521556906631-0c58e7ce65e5?q=80&w=600&auto=format&fit=crop';
                              return (
                                <div key={listing.id} className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-white/10 rounded-3xl flex flex-col sm:flex-row items-center gap-4">
                                  <img src={img} alt={listing.title} className="w-16 h-16 rounded-2xl object-cover shrink-0 animate-in fade-in zoom-in" />
                                  <div className="flex-1 min-w-0 text-center sm:text-left">
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${listing.type === 'GIG' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                        {listing.type}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${listing.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {listing.status}
                                      </span>
                                    </div>
                                    <h4 className="text-base font-black text-slate-800 dark:text-white truncate">{listing.title}</h4>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1">
                                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Rs. {parseFloat(listing.price).toLocaleString()}</span>
                                      <span className="text-[10px] text-slate-400 dark:text-slate-550 font-bold">•</span>
                                      <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                                        <LuStar className="w-3.5 h-3.5 fill-current" />
                                        <span>{parseFloat(String(listing.rating || 0)) > 0 ? parseFloat(String(listing.rating)).toFixed(1) : 'No rating'}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteListing(listing.id)}
                                    className="w-full sm:w-auto p-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all cursor-pointer border-none flex items-center justify-center"
                                  >
                                    <LuTrash2 size={16} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>

            {/* Backdrop-Blurred Unified Inbox Modal */}
            <AnimatePresence>
              {showInboxModal && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                      setShowInboxModal(false);
                      setSelectedChat(null);
                      setSelectedEventChat(null);
                      setSelectedSupportTicket(null);
                    }}
                    className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md"
                  />

                  <div className="fixed inset-0 z-[101] overflow-y-auto pointer-events-none flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="w-full max-w-4xl bg-white/95 dark:bg-slate-950/98 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative pointer-events-auto overflow-hidden h-[85vh] flex flex-col"
                    >
                      {/* Modal Header */}
                      <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-200/50 dark:border-white/10">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1 block">Unified Inbox</span>
                          <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Messages Hub</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowInboxModal(false);
                            setSelectedChat(null);
                            setSelectedEventChat(null);
                            setSelectedSupportTicket(null);
                          }}
                          className="p-2.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white transition-all hover:rotate-90 duration-300 border-none cursor-pointer"
                        >
                          <LuX size={18} />
                        </button>
                      </div>

                      {/* Tab Selection Row (Hidden if a specific chat or ticket detail is open) */}
                      {!selectedChat && !selectedEventChat && !selectedSupportTicket && !selectedAnnexChat && (
                        <div className="flex flex-wrap gap-2 mb-6 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl w-fit">
                          <button
                            type="button"
                            onClick={() => {
                              setInboxTab('annex');
                              fetchAnnexChats();
                            }}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all inline-flex items-center gap-1.5 ${
                              inboxTab === 'annex'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white bg-transparent border-none cursor-pointer'
                            }`}
                          >
                            <LuHouse size={14} /> Bodim / Annexes ({annexChats.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setInboxTab('marketplace')}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all inline-flex items-center gap-1.5 ${
                              inboxTab === 'marketplace'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white bg-transparent border-none cursor-pointer'
                            }`}
                          >
                            <LuShoppingBag size={14} /> Marketplace ({marketplaceChats.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setInboxTab('events')}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all inline-flex items-center gap-1.5 ${
                              inboxTab === 'events'
                                ? 'bg-pink-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white bg-transparent border-none cursor-pointer'
                            }`}
                          >
                            <LuCalendar size={14} /> Events ({eventChats.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setInboxTab('support')}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all inline-flex items-center gap-1.5 ${
                              inboxTab === 'support'
                                ? 'bg-rose-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white bg-transparent border-none cursor-pointer'
                            }`}
                          >
                            <LuLifeBuoy size={14} /> Support ({supportProblems.length})
                          </button>
                        </div>
                      )}

                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {/* ── ANNEX TAB CONTENT ── */}
                        {inboxTab === 'annex' && (
                          <AnimatePresence mode="wait">
                            {!selectedAnnexChat ? (
                              <motion.div
                                key="annex-list"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-4"
                              >
                                {loadingAnnexChats ? (
                                  <div className="py-20 text-center text-slate-400 dark:text-slate-500 animate-pulse font-black uppercase tracking-widest text-xs">
                                    Synchronizing annex inquiries...
                                  </div>
                                ) : annexChats.length === 0 ? (
                                  <div className="py-20 text-center bg-slate-500/5 border border-slate-200/10 dark:border-white/10 rounded-3xl">
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">No Annex Inquiries Yet</p>
                                    <p className="text-[10px] text-slate-400 font-semibold">Click "Send Inquiry" on any Annex card to chat with landlords in real-time.</p>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 gap-4">
                                    {annexChats.map((chat) => {
                                      const currentUserId = localStorage.getItem('userId');
                                      const otherUser = chat.student_id === currentUserId ? chat.landlord : chat.student;
                                      const otherName = otherUser?.name || 'Landlord / Student';
                                      const otherPic = otherUser?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherName}`;
                                      const annexTitle = chat.annex?.title || 'Annex Listing';

                                      return (
                                        <div
                                          key={chat.id}
                                          onClick={() => setSelectedAnnexChat(chat)}
                                          className="cursor-pointer p-5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/10 rounded-3xl hover:border-blue-500/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-all duration-300 shadow-sm flex items-center justify-between gap-4 group"
                                        >
                                          <div className="flex items-center gap-4 min-w-0">
                                            <img src={otherPic} alt={otherName} className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-white/10 shrink-0" />
                                            <div className="min-w-0 text-left">
                                              <h4 className="text-base font-black text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors truncate">
                                                {otherName}
                                              </h4>
                                              <p className="text-slate-400 dark:text-slate-500 text-xs font-bold truncate mt-0.5 flex items-center gap-1">Regarding: <LuHouse size={12} className="text-blue-500 shrink-0" /> {annexTitle}</p>
                                            </div>
                                          </div>
                                          <LuChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </motion.div>
                            ) : (
                              <motion.div
                                key="annex-detail"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex flex-col h-full overflow-hidden text-left"
                              >
                                <div className="flex justify-between items-start mb-4 border-b border-slate-100 dark:border-white/5 pb-4">
                                  <div className="flex items-center gap-3">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedAnnexChat(null)}
                                      className="text-xs font-black uppercase text-blue-500 hover:text-blue-600 mr-2 bg-transparent border-none cursor-pointer font-bold"
                                    >
                                      ← Back
                                    </button>
                                    <img
                                      src={(selectedAnnexChat.student_id === localStorage.getItem('userId') ? selectedAnnexChat.landlord : selectedAnnexChat.student)?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(selectedAnnexChat.student_id === localStorage.getItem('userId') ? selectedAnnexChat.landlord : selectedAnnexChat.student)?.name}`}
                                      alt="Avatar"
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="text-left">
                                      <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">
                                        {(selectedAnnexChat.student_id === localStorage.getItem('userId') ? selectedAnnexChat.landlord : selectedAnnexChat.student)?.name}
                                      </h3>
                                      <p className="text-slate-400 dark:text-slate-500 text-xs font-bold truncate flex items-center gap-1">Listing: <LuHouse size={12} className="text-blue-500 shrink-0" /> {selectedAnnexChat.annex?.title}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="h-[320px] overflow-y-auto pr-1 space-y-3 custom-scrollbar flex flex-col bg-slate-50 dark:bg-slate-950/20 p-4 rounded-3xl mb-4">
                                  {annexChatMessages.length === 0 ? (
                                    <div className="my-auto text-center text-slate-400 text-xs font-bold">
                                      No messages yet. Send a message to start inquiry.
                                    </div>
                                  ) : (
                                    annexChatMessages.map((msg) => {
                                      const isMe = msg.sender_id === localStorage.getItem('userId');
                                      return (
                                        <div
                                          key={msg.id}
                                          className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end text-right' : 'self-start items-start text-left'}`}
                                        >
                                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 mb-0.5 px-1.5">
                                            {isMe ? 'You' : msg.sender?.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                          <div className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                                            isMe
                                              ? 'bg-blue-600 text-white rounded-tr-none'
                                              : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                                          }`}>
                                            {msg.message}
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>

                                <form onSubmit={handleSendAnnexMessage} className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Type your inquiry message here..."
                                    value={annexChatText}
                                    onChange={(e) => setAnnexChatText(e.target.value)}
                                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3.5 text-xs text-slate-700 dark:text-slate-250 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                  <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl transition-all shadow-xs flex items-center justify-center cursor-pointer border-none"
                                  >
                                    <LuSend size={15} />
                                  </button>
                                </form>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}

                        {/* ── MARKETPLACE TAB CONTENT ── */}
                        {inboxTab === 'marketplace' && (
                          <AnimatePresence mode="wait">
                            {!selectedChat ? (
                              <motion.div
                                key="marketplace-list"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-4"
                              >
                                {loadingChats ? (
                                  <div className="py-20 text-center text-slate-400 dark:text-slate-500 animate-pulse font-black uppercase tracking-widest text-xs">
                                    Synchronizing inbox...
                                  </div>
                                ) : marketplaceChats.length === 0 ? (
                                  <div className="py-20 text-center bg-slate-500/5 border border-slate-200/10 dark:border-white/10 rounded-3xl">
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Inbox Empty</p>
                                    <p className="text-[10px] text-slate-400 font-semibold">Start chat on any product card in the marketplace.</p>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 gap-4">
                                    {marketplaceChats.map((chat) => {
                                      const otherUser = chat.buyer_id === localStorage.getItem('userId') ? chat.seller : chat.buyer;
                                      const otherName = otherUser?.name || 'Unknown User';
                                      const otherPic = otherUser?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherName}`;
                                      const itemTitle = chat.item?.title || 'Unknown Item';
                                      return (
                                        <div
                                          key={chat.id}
                                          onClick={() => setSelectedChat(chat)}
                                          className="cursor-pointer p-5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/10 rounded-3xl hover:border-indigo-500/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-all duration-300 shadow-sm flex items-center justify-between gap-4 group"
                                        >
                                          <div className="flex items-center gap-4 min-w-0">
                                            <img src={otherPic} alt={otherName} className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-white/10 shrink-0" />
                                            <div className="min-w-0 text-left">
                                              <h4 className="text-base font-black text-slate-800 dark:text-white group-hover:text-indigo-500 transition-colors truncate">
                                                {otherName}
                                              </h4>
                                              <p className="text-slate-400 dark:text-slate-500 text-xs font-bold truncate mt-0.5">Regarding: {itemTitle}</p>
                                            </div>
                                          </div>
                                          <LuChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </motion.div>
                            ) : (
                              <motion.div
                                key="marketplace-detail"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex flex-col h-full overflow-hidden text-left"
                              >
                                <div className="flex justify-between items-start mb-4 border-b border-slate-100 dark:border-white/5 pb-4">
                                  <div className="flex items-center gap-3">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedChat(null)}
                                      className="text-xs font-black uppercase text-indigo-500 hover:text-indigo-600 mr-2 bg-transparent border-none cursor-pointer font-bold"
                                    >
                                      ← Back
                                    </button>
                                    <img
                                      src={(selectedChat.buyer_id === localStorage.getItem('userId') ? selectedChat.seller : selectedChat.buyer)?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(selectedChat.buyer_id === localStorage.getItem('userId') ? selectedChat.seller : selectedChat.buyer)?.name}`}
                                      alt="Avatar"
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="text-left">
                                      <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">
                                        {(selectedChat.buyer_id === localStorage.getItem('userId') ? selectedChat.seller : selectedChat.buyer)?.name}
                                      </h3>
                                      <p className="text-slate-400 dark:text-slate-500 text-xs font-bold truncate">Listing: {selectedChat.item?.title}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="h-[320px] overflow-y-auto pr-1 space-y-3 custom-scrollbar flex flex-col bg-slate-50 dark:bg-slate-950/20 p-4 rounded-3xl mb-4">
                                  {chatMessages.length === 0 ? (
                                    <div className="my-auto text-center text-slate-400 text-xs font-bold">
                                      No messages yet. Send a message to start conversation.
                                    </div>
                                  ) : (
                                    chatMessages.map((msg) => {
                                      const isMe = msg.sender_id === localStorage.getItem('userId');
                                      return (
                                        <div
                                          key={msg.id}
                                          className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end text-right' : 'self-start items-start text-left'}`}
                                        >
                                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 mb-0.5 px-1.5">
                                            {isMe ? 'You' : msg.sender?.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                          <div className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                                            isMe
                                              ? 'bg-indigo-650 text-white rounded-tr-none'
                                              : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                                          }`}>
                                            {msg.message}
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>

                                <form onSubmit={handleSendMarketplaceMessage} className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Type your message here..."
                                    value={chatText}
                                    onChange={(e) => setChatText(e.target.value)}
                                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3.5 text-xs text-slate-700 dark:text-slate-250 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                  <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-xl transition-all shadow-xs flex items-center justify-center cursor-pointer border-none"
                                  >
                                    <LuSend size={15} />
                                  </button>
                                </form>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}

                        {/* ── EVENTS TAB CONTENT ── */}
                        {inboxTab === 'events' && (
                          <AnimatePresence mode="wait">
                            {!selectedEventChat ? (
                              <motion.div
                                key="events-chat-list"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-4"
                              >
                                {loadingEventChats ? (
                                  <div className="py-20 text-center text-slate-400 dark:text-slate-500 animate-pulse font-black uppercase tracking-widest text-xs">
                                    Synchronizing inbox...
                                  </div>
                                ) : eventChats.length === 0 ? (
                                  <div className="py-20 text-center bg-slate-500/5 border border-slate-200/10 dark:border-white/10 rounded-3xl">
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Inbox Empty</p>
                                    <p className="text-[10px] text-slate-400 font-semibold">Start chat on any event listing card.</p>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 gap-4">
                                    {eventChats.map((chat) => {
                                      const otherUser = chat.buyer_id === localStorage.getItem('userId') ? chat.host : chat.buyer;
                                      const otherName = otherUser?.name || 'Unknown User';
                                      const otherPic = otherUser?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherName}`;
                                      const eventTitle = chat.event?.title || 'Unknown Event';
                                      return (
                                        <div
                                          key={chat.id}
                                          onClick={() => setSelectedEventChat(chat)}
                                          className="cursor-pointer p-5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/10 rounded-3xl hover:border-pink-500/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-all duration-300 shadow-sm flex items-center justify-between gap-4 group"
                                        >
                                          <div className="flex items-center gap-4 min-w-0">
                                            <img src={otherPic} alt={otherName} className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-white/10 shrink-0" />
                                            <div className="min-w-0 text-left">
                                              <h4 className="text-base font-black text-slate-805 dark:text-white group-hover:text-pink-500 transition-colors truncate">
                                                {otherName}
                                              </h4>
                                              <p className="text-slate-400 dark:text-slate-500 text-xs font-bold truncate mt-0.5">Regarding Event: {eventTitle}</p>
                                            </div>
                                          </div>
                                          <LuChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </motion.div>
                            ) : (
                              <motion.div
                                key="events-chat-detail"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex flex-col h-full overflow-hidden text-left"
                              >
                                <div className="flex justify-between items-start mb-4 border-b border-slate-100 dark:border-white/5 pb-4">
                                  <div className="flex items-center gap-3">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedEventChat(null)}
                                      className="text-xs font-black uppercase text-pink-500 hover:text-pink-600 mr-2 bg-transparent border-none cursor-pointer font-bold"
                                    >
                                      ← Back
                                    </button>
                                    <img
                                      src={(selectedEventChat.buyer_id === localStorage.getItem('userId') ? selectedEventChat.host : selectedEventChat.buyer)?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${(selectedEventChat.buyer_id === localStorage.getItem('userId') ? selectedEventChat.host : selectedEventChat.buyer)?.name}`}
                                      alt="Avatar"
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="text-left">
                                      <h3 className="text-lg font-black text-slate-808 dark:text-white leading-tight">
                                        {(selectedEventChat.buyer_id === localStorage.getItem('userId') ? selectedEventChat.host : selectedEventChat.buyer)?.name}
                                      </h3>
                                      <p className="text-slate-400 dark:text-slate-500 text-xs font-bold truncate">Event: {selectedEventChat.event?.title}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="h-[320px] overflow-y-auto pr-1 space-y-3 custom-scrollbar flex flex-col bg-slate-50 dark:bg-slate-950/20 p-4 rounded-3xl mb-4">
                                  {eventChatMessages.length === 0 ? (
                                    <div className="my-auto text-center text-slate-400 text-xs font-bold">
                                      No messages yet. Send a message to start conversation.
                                    </div>
                                  ) : (
                                    eventChatMessages.map((msg) => {
                                      const isMe = msg.sender_id === localStorage.getItem('userId');
                                      return (
                                        <div
                                          key={msg.id}
                                          className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end text-right' : 'self-start items-start text-left'}`}
                                        >
                                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 mb-0.5 px-1.5">
                                            {isMe ? 'You' : msg.sender?.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                          <div className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                                            isMe
                                              ? 'bg-pink-600 text-white rounded-tr-none'
                                              : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                                          }`}>
                                            {msg.message}
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>

                                <form onSubmit={handleSendEventMessage} className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Type your message here..."
                                    value={eventChatText}
                                    onChange={(e) => setEventChatText(e.target.value)}
                                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3.5 text-xs text-slate-700 dark:text-slate-250 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                  />
                                  <button
                                    type="submit"
                                    className="bg-pink-600 hover:bg-pink-700 text-white px-5 rounded-xl transition-all shadow-xs flex items-center justify-center cursor-pointer border-none"
                                  >
                                    <LuSend size={15} />
                                  </button>
                                </form>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}

                        {/* ── SUPPORT TAB CONTENT ── */}
                        {inboxTab === 'support' && (
                          <AnimatePresence mode="wait">
                            {!selectedSupportTicket ? (
                              <motion.div
                                key="support-list"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-4"
                              >
                                {loadingSupport ? (
                                  <div className="flex items-center justify-center py-20">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                                  </div>
                                ) : supportProblems.length === 0 ? (
                                  <div className="py-20 text-center bg-slate-500/5 border border-slate-200/10 dark:border-white/10 rounded-3xl">
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No support tickets found</p>
                                    <p className="text-[10px] text-slate-400 max-w-xs mx-auto mt-1">If you have encountered any issues, submit a report on our Contact page.</p>
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    {supportProblems.map((ticket) => (
                                      <div
                                        key={ticket.id}
                                        onClick={() => setSelectedSupportTicket(ticket)}
                                        className="group p-5 rounded-[1.8rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 hover:border-rose-500/30 dark:hover:border-rose-500/20 hover:bg-white dark:hover:bg-slate-900/60 transition-all cursor-pointer flex items-center justify-between"
                                      >
                                        <div className="min-w-0 flex-1 text-left">
                                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <span className="text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400 px-2.5 py-0.5 rounded-full border border-rose-500/25">
                                              {ticket.inquiryType}
                                            </span>
                                            <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                              ticket.status === 'Resolved'
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                              {ticket.status}
                                            </span>
                                          </div>
                                          <p className="text-sm font-extrabold text-slate-800 dark:text-white truncate">{ticket.message}</p>
                                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1">
                                            Reported on {new Date(ticket.createdAt).toLocaleDateString()}
                                          </p>
                                        </div>
                                        <LuChevronRight size={18} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </motion.div>
                            ) : (
                              <motion.div
                                key="support-detail"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-6 text-left"
                              >
                                <button
                                  type="button"
                                  onClick={() => setSelectedSupportTicket(null)}
                                  className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline mb-2 bg-transparent border-none cursor-pointer"
                                >
                                  ← Back to Tickets list
                                </button>

                                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 relative overflow-hidden">
                                  <div className="absolute top-0 right-0 p-3">
                                    <span className="text-[8px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-500 dark:bg-rose-500/25 dark:text-rose-400 px-2 py-0.5 rounded-md">
                                      Your Ticket
                                    </span>
                                  </div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{selectedSupportTicket.inquiryType}</p>
                                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">{selectedSupportTicket.message}</p>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-3">
                                    Sent: {new Date(selectedSupportTicket.createdAt).toLocaleString()}
                                  </p>
                                </div>

                                {selectedSupportTicket.adminReply ? (
                                  <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 dark:from-[#0c2423] dark:to-[#051717] border border-emerald-500/20 dark:border-emerald-500/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3">
                                      <span className="text-[8px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-400 px-2 py-0.5 rounded-md">
                                        Admin Reply
                                      </span>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-2">Reply Message</p>
                                    <p className="text-sm text-slate-805 dark:text-slate-202 leading-relaxed font-semibold italic">"{selectedSupportTicket.adminReply}"</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-4">
                                      Replied: {new Date(selectedSupportTicket.repliedAt).toLocaleString()}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="p-5 rounded-3xl bg-amber-500/5 dark:bg-[#201c10] border border-amber-500/20 dark:border-amber-500/10 flex items-center gap-3">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                                    <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest animate-pulse">
                                      Waiting for Administration review... typical response time is ~2 hours
                                    </p>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
      {/* ─────── Campus Email Verify Modal ─────── */}
      <AnimatePresence>
        {showVerifyIdModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-slate-800/40">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Verify Student Status
                </h2>
                <button
                  onClick={() => setShowVerifyIdModal(false)}
                  className="p-2 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <LuX className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 text-center flex flex-col items-center overflow-y-auto">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-4">
                  <LuShieldCheck className="w-6 h-6" />
                </div>

                {emailVerificationStep === 'enter_email' ? (
                  <>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">University Email Address</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-6 max-w-sm">
                      Enter your official university email (e.g. ending in .ac.lk, sliit.lk, nsbm.ac.lk). We'll send you a 6-digit verification code.
                    </p>

                    <input
                      type="email"
                      value={campusEmailInput}
                      onChange={(e) => setCampusEmailInput(e.target.value)}
                      placeholder="username@university.ac.lk"
                      className="w-full max-w-sm px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold placeholder:text-gray-400"
                    />

                    <div className="mt-8 flex justify-end gap-3 w-full max-w-sm">
                      <button
                        type="button"
                        onClick={() => setShowVerifyIdModal(false)}
                        className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isSendingCode || !campusEmailInput.trim()}
                        onClick={async () => {
                          if (!campusEmailInput.trim()) return;
                          setIsSendingCode(true);
                          try {
                            const token = localStorage.getItem('userToken');
                            const res = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}`}/api/users/profile/verify`, {
                              method: 'POST',
                              headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}` 
                              },
                              body: JSON.stringify({ campusEmail: campusEmailInput.trim() })
                            });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.message || 'Failed to send code');
                            
                            toast.success('Verification code generated successfully!');
                            setEmailVerificationStep('enter_code');
                            setIsVerificationPending(true);
                          } catch (err: any) {
                            toast.error(err.message || 'Failed to generate code.');
                          } finally {
                            setIsSendingCode(false);
                          }
                        }}
                        className="px-6 py-2.5 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 border-none cursor-pointer"
                      >
                        {isSendingCode ? (
                          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                        ) : 'Send Code'}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Enter Verification Code</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-6 max-w-sm">
                      Please check your campus email **{campusEmailInput}** for the 6-digit verification code.
                    </p>

                    <input
                      type="text"
                      maxLength={6}
                      value={verificationCodeInput}
                      onChange={(e) => setVerificationCodeInput(e.target.value)}
                      placeholder="123456"
                      className="w-full max-w-sm px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-center tracking-widest text-lg placeholder:text-gray-400"
                    />

                    <div className="mt-8 flex justify-end gap-3 w-full max-w-sm">
                      <button
                        type="button"
                        onClick={() => setEmailVerificationStep('enter_email')}
                        className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        disabled={isVerifyingCode || !verificationCodeInput.trim()}
                        onClick={async () => {
                          if (!verificationCodeInput.trim()) return;
                          setIsVerifyingCode(true);
                          try {
                            const token = localStorage.getItem('userToken');
                            const res = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}`}/api/users/profile/verify/confirm`, {
                              method: 'POST',
                              headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}` 
                              },
                              body: JSON.stringify({ code: verificationCodeInput.trim() })
                            });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.message || 'Verification failed');
                            
                            setIsVerifiedStudent(true);
                            setIsVerificationPending(false);
                            localStorage.setItem('userIsVerifiedStudent', 'true');
                            window.dispatchEvent(new Event('auth-update'));
                            setShowVerifyIdModal(false);
                            toast.success('Your university student status is verified!');
                          } catch (err: any) {
                            toast.error(err.message || 'Invalid code. Please try again.');
                          } finally {
                            setIsVerifyingCode(false);
                          }
                        }}
                        className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 border-none cursor-pointer"
                      >
                        {isVerifyingCode ? (
                          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
                        ) : 'Verify Code'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
