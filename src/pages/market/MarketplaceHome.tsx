import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuSearch, LuPlus, LuShoppingBag, LuBriefcase, LuShieldCheck,
  LuStar, LuX, LuSend, LuChevronLeft, LuChevronRight, LuBadgeCheck,
  LuTrash2, LuArrowLeft, LuUpload, LuBuilding, LuSparkles, LuChevronDown,
  LuZap, LuRefreshCw
} from 'react-icons/lu';
import MarketplaceCard from '../../components/market/MarketplaceCard';
import { VerificationModal } from '../../features/proposal/components/verification/VerificationModal';
import AuthCard from '../../components/auth/AuthCard';
import CreateListingModal from '../../components/market/CreateListingModal';
import toast from 'react-hot-toast';
import { api } from '../../api';
import AdBanner from '../../components/advertise/AdBanner';
import AdNativeFeed from '../../components/advertise/AdNativeFeed';
import SEO from '../../components/SEO';

const MarketplaceHome: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'All' | 'PRODUCT' | 'GIG' | 'OFFICIAL_PRODUCT'>('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'rating'>('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [authTarget, setAuthTarget] = useState<'post_ad' | 'checkout' | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cart States for Official Store
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartPhone, setCartPhone] = useState(localStorage.getItem('userPhoneNumber') || '');
  const [cartLocation, setCartLocation] = useState(localStorage.getItem('userUniversity') || '');
  const [cartPayment, setCartPayment] = useState<'COD' | 'BANK_TRANSFER'>('COD');
  const [cartNotes, setCartNotes] = useState('');
  const [cartStep, setCartStep] = useState<1 | 2>(1); // 1: View Cart, 2: Checkout Form
  const [uploadedReceipt, setUploadedReceipt] = useState<File | null>(null);
  const [uploadedReceiptUrl, setUploadedReceiptUrl] = useState<string | null>(null);
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('company_store_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  // Save cart helper
  const saveCart = (newCart: any[]) => {
    setCart(newCart);
    localStorage.setItem('company_store_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-update'));
  };

  const addToCart = (item: any, qty = 1, openDrawer = false) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please log in to add items to your cart.');
      return;
    }
    const existing = cart.find(i => i.id === item.id);
    let newCart = [];
    if (existing) {
      newCart = cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i);
    } else {
      newCart = [...cart, {
        id: item.id,
        title: item.title,
        price: parseFloat(item.price),
        image: item.images && item.images.length > 0 ? item.images[0] : null,
        quantity: qty
      }];
    }
    saveCart(newCart);
    toast.success(`"${item.title}" added to cart!`);
    if (openDrawer) {
      setIsCartOpen(true);
      setCartStep(1);
    }
  };

  const updateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    const newCart = cart.map(i => i.id === itemId ? { ...i, quantity: newQty } : i);
    saveCart(newCart);
  };

  const removeFromCart = (itemId: string) => {
    const newCart = cart.filter(i => i.id !== itemId);
    saveCart(newCart);
    toast.success('Item removed from cart.');
  };

  const clearCart = () => {
    saveCart([]);
    setUploadedReceipt(null);
    setUploadedReceiptUrl(null);
    setCartStep(1);
  };

  const verifyCartPrices = async () => {
    if (cart.length === 0) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/market?type=OFFICIAL_PRODUCT`);
      if (!response.ok) throw new Error('Failed to verify catalog prices');
      const data = await response.json();
      const dbItems = Array.isArray(data) ? data : (data.data ?? []);

      let priceChanged = false;
      const updatedCart = cart.map(cartItem => {
        const dbItem = dbItems.find((i: any) => i.id === cartItem.id);
        if (dbItem) {
          const dbPrice = parseFloat(dbItem.price);
          if (cartItem.price !== dbPrice) {
            priceChanged = true;
            return { ...cartItem, price: dbPrice };
          }
        }
        return cartItem;
      });

      if (priceChanged) {
        saveCart(updatedCart);
        toast.success('Cart prices updated to match latest store rates.', {
          style: {
            borderRadius: '16px',
            background: '#334155',
            color: '#fff',
            fontWeight: 'bold',
          }
        });
      }
    } catch (err) {
      console.error('Error verifying cart prices:', err);
    }
  };

  useEffect(() => {
    if (isCartOpen) {
      verifyCartPrices();
    }
  }, [isCartOpen]);

  const handleCartCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmittingCheckout(true);
    try {
      const formData = new FormData();
      formData.append('cartItems', JSON.stringify(cart.map(i => ({ itemId: i.id, quantity: i.quantity, price: i.price }))));
      formData.append('deliveryPhone', cartPhone);
      formData.append('deliveryLocation', cartLocation);
      formData.append('paymentMethod', cartPayment);
      formData.append('notes', cartNotes);
      if (cartPayment === 'BANK_TRANSFER' && uploadedReceipt) {
        formData.append('receipt', uploadedReceipt);
      }

      await api.createMarketOrder(formData);

      toast.success('Order placed successfully!');
      clearCart();
      setIsCartOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order.');
    } finally {
      setIsSubmittingCheckout(false);
    }
  };

  // Selected item modal details state
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Floating chat states
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatText, setChatText] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/market?type=${filter === 'All' ? '' : filter}`);
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      // Guard: backend returns plain array
      setItems(Array.isArray(data) ? data : (data.data ?? []));
    } catch (error) {
      console.error('Error fetching market items', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostAdClick = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setAuthTarget('post_ad');
      setShowAuthModal(true);
      return;
    }
    const isStudentVerified = localStorage.getItem('userIsVerifiedStudent') === 'true';
    const isProfessionalVerified = localStorage.getItem('userIsVerifiedProfessional') === 'true';
    if (!isStudentVerified && !isProfessionalVerified) {
      setShowVerificationModal(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleCheckoutClick = () => {
    verifyCartPrices();
    const token = localStorage.getItem('userToken');
    if (!token) {
      setAuthTarget('checkout');
      setShowAuthModal(true);
      return;
    }
    setCartStep(2);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (authTarget === 'post_ad') {
      handlePostAdClick(); // Re-trigger check (might show verification modal now)
    } else if (authTarget === 'checkout') {
      setCartStep(2);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filter]);

  // Ensure userId is synced and handle cart opening trigger from header
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');
    if (token && !userId) {
      fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch profile'))
        .then(data => {
          if (data.success && data.user) {
            localStorage.setItem('userId', String(data.user.id));
          }
        })
        .catch(err => console.error('Error auto-syncing userId in MarketplaceHome:', err));
    }

    // Check for openCart URL parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get('openCart') === 'true') {
      setIsCartOpen(true);
      verifyCartPrices();
      // Remove query param without reload
      window.history.replaceState(null, '', window.location.pathname);
    }

    const handleOpenDrawer = () => {
      setIsCartOpen(true);
      verifyCartPrices();
    };

    window.addEventListener('open-cart-drawer', handleOpenDrawer);
    return () => {
      window.removeEventListener('open-cart-drawer', handleOpenDrawer);
    };
  }, []);

  const handleRate = async (itemId: string, score: number) => {
    try {
      const data = await api.rateListing(itemId, score);
      setItems(prev => prev.map(item => item.id === itemId ? { ...item, rating: data.rating, rating_count: data.rating_count } : item));
      if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem((prev: any) => ({ ...prev, rating: data.rating, rating_count: data.rating_count }));
      }
      toast.success('Rating submitted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit rating. You cannot rate your own listing.');
    }
  };

  const handleContactSeller = async (item: any) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please log in to contact the seller.');
      return;
    }
    if (item.seller_id === userId) {
      toast.error('This is your own listing.');
      return;
    }
    try {
      setLoadingChat(true);
      const chat = await api.startMarketplaceChat(item.id);

      const partner = item.seller;
      chat.partner = partner;
      chat.item = item;

      setActiveChat(chat);
      setSelectedItem(null);
      toast.success(`Chat started with ${partner.name}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to start conversation.');
    } finally {
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    let interval: any;
    const fetchChatMessages = async () => {
      if (!activeChat) return;
      try {
        const msgs = await api.getMarketplaceMessages(activeChat.id);
        setChatMessages(msgs);
      } catch (err) {
        console.error(err);
      }
    };
    if (activeChat) {
      fetchChatMessages();
      interval = setInterval(fetchChatMessages, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeChat]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat || !chatText.trim()) return;
    try {
      const sent = await api.sendMarketplaceMessage(activeChat.id, chatText.trim());
      setChatMessages(prev => [...prev, sent]);
      setChatText('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message.');
    }
  };

  const handleCreateListing = async (formData: FormData) => {
    const token = localStorage.getItem('userToken');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/market`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const responseText = await res.text();
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(`Server error (${res.status}): Unexpected response from server.`);
    }

    if (!res.ok) {
      throw new Error(data?.message || `Failed to post listing (${res.status})`);
    }

    // Refresh list in background — don't await so we can return data immediately
    fetchItems();
    return data;
  };

  const filteredItems = items.filter(item =>
    (item.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (item.description ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'price_low') {
      return parseFloat(String(a.price || 0)) - parseFloat(String(b.price || 0));
    }
    if (sortBy === 'price_high') {
      return parseFloat(String(b.price || 0)) - parseFloat(String(a.price || 0));
    }
    if (sortBy === 'rating') {
      return parseFloat(String(b.rating || 0)) - parseFloat(String(a.rating || 0));
    }
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  const popularKeywords = [
    { label: 'All Items', query: '' },
    { label: '📐 Calculators', query: 'calculator' },
    { label: '📚 Textbooks & Notes', query: 'book' },
    { label: '💻 Laptops & Tech', query: 'laptop' },
    { label: '🎨 Graphic & UI Design', query: 'design' },
    { label: '👨‍💻 Web & Coding', query: 'web' },
    { label: '🎓 Tutoring', query: 'tutor' },
    { label: '👕 Uni Merch', query: 'hoodie' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pt-5 pb-20 transition-colors duration-500">
      <SEO
        title="Campus Marketplace & Hustle Hub | The Uni Gang"
        description="Buy & sell cheap student gear, scientific calculators, textbooks, hoodies, and freelance services in Sri Lanka."
        schemaData={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Uni Gang Campus Marketplace",
          "itemListElement": items.slice(0, 10).map((item, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "item": {
              "@type": "Product",
              "name": item.title,
              "description": item.description,
              "offers": {
                "@type": "Offer",
                "price": item.price,
                "priceCurrency": "LKR",
                "availability": "https://schema.org/InStock"
              }
            }
          }))
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Premium Advanced Hero Section */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 shadow-2xl shadow-purple-500/10 mb-12 border border-slate-800/50">
          {/* Abstract background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[150%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[120%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTQgNThoLTQ2di00NmgyMnYtMmgtMjR2NTBoNTB2LTI0aC0ydjIyeiIgZmlsbD0icmdiYSgyNTUsIDI1NSLCAyNTUsIDAuMDUpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-20" />
          </div>

          <div className="relative z-10 p-10 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12">

            <div className="max-w-2xl text-center lg:text-left">
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-400 font-black text-[10px] uppercase tracking-[0.2em] mb-6 backdrop-blur-md"
              >
                <LuTags className="text-sm" /> The Campus Ecosystem
              </motion.div> */}

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter"
              >
                The Hustle <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Hub.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0"
              >
                The exclusive marketplace for verified university students. Buy cheap gear, sell your old textbooks, or offer freelance services directly to your peers.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePostAdClick}
                className="group relative inline-flex items-center justify-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-lg hover:bg-purple-50 transition-all overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.3)] w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <LuPlus className="w-6 h-6 text-purple-600" /> Post an Ad / Gig
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-purple-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </div>

            {/* Right side floating graphics */}
            <div className="relative w-full max-w-md hidden lg:block perspective-1000">
              <motion.div
                animate={{ y: [-15, 15, -15], rotateX: [5, -5, 5], rotateY: [-5, 5, -5] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-20 bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-[2rem] shadow-2xl"
              >
                <div className="relative overflow-hidden rounded-xl mb-4 group">
                  <img src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=800&auto=format&fit=crop" alt="Campus Hustle" className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Freelance Gig</span>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-bold text-xl mb-1">Web Design Project</h3>
                    <p className="text-slate-400 text-sm flex items-center gap-1"><LuShieldCheck className="text-emerald-400" /> Verified Student</p>
                  </div>
                  <span className="text-purple-400 font-black text-2xl">Rs. 25k</span>
                </div>
              </motion.div>

              {/* Decorative floating badges */}
              <motion.div
                animate={{ y: [15, -15, 15], x: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-10 -right-10 z-30 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-emerald-300/30 backdrop-blur-md"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <LuShieldCheck className="w-7 h-7" />
                </div>
                <div className="pr-2">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-90">100% Safe</div>
                  <div className="font-bold text-base leading-tight">Zero Scams</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [-20, 20, -20], x: [10, -10, 10] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-12 -left-12 z-10 bg-slate-800/90 backdrop-blur-xl border border-slate-700 p-5 rounded-[1.5rem] shadow-2xl flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <LuShoppingBag className="w-7 h-7" />
                </div>
                <div className="pr-4">
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Physical Items</div>
                  <div className="text-white font-black text-lg leading-tight">Buy & Sell</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Ad Placement */}
        <div className="mb-10">
          <AdBanner placement="BANNER" />
        </div>

        {/* Modern Interactive Command Bar (Filter Tabs + Search & Sort) */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-3xl p-3 sm:p-4 shadow-xl shadow-indigo-500/5 mb-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Category Segmented Tabs */}
            <div className="flex items-center gap-1 p-1 sm:p-1.5 bg-slate-100/90 dark:bg-slate-950/70 rounded-2xl border border-slate-200/60 dark:border-white/5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
              {[
                { key: 'All', label: 'All Listings', icon: LuSparkles, color: 'text-indigo-500' },
                { key: 'OFFICIAL_PRODUCT', label: 'Official Store', icon: LuBadgeCheck, color: 'text-amber-500' },
                { key: 'PRODUCT', label: 'Peer Products', icon: LuShoppingBag, color: 'text-emerald-500' },
                { key: 'GIG', label: 'Freelance Gigs', icon: LuBriefcase, color: 'text-purple-500' },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = filter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key as any)}
                    className={`relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer border-none outline-none ${
                      isActive
                        ? 'text-white shadow-lg shadow-indigo-500/25'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeMarketplaceTab"
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 rounded-xl"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input & Sort Selector */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 lg:w-80 group">
                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 w-4 h-4 transition-colors" />
                <input
                  type="text"
                  placeholder="Search calculators, notes, gigs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-xs sm:text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900/90 placeholder:text-slate-400"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer border-none bg-transparent"
                    title="Clear search"
                  >
                    <LuX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/90 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
                >
                  <option value="newest">⚡ Latest</option>
                  <option value="price_low">💰 Price: Low to High</option>
                  <option value="price_high">💎 Price: High to Low</option>
                  <option value="rating">⭐ Top Rated</option>
                </select>
                <LuChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

          </div>
        </div>

        {/* Quick Suggestion Tags & Keyword Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mb-8">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1 pl-1">
            <LuSparkles className="w-3.5 h-3.5 text-indigo-500" /> Popular:
          </span>
          {popularKeywords.map((item, idx) => {
            const isChipActive = (item.query === '' && search === '') || (item.query !== '' && search.toLowerCase().includes(item.query));
            return (
              <button
                key={idx}
                onClick={() => {
                  if (item.query === '') {
                    setSearch('');
                  } else if (search.toLowerCase() === item.query) {
                    setSearch('');
                  } else {
                    setSearch(item.query);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer border ${
                  isChipActive
                    ? 'bg-indigo-500/15 dark:bg-indigo-500/25 text-indigo-600 dark:text-indigo-400 border-indigo-500/40 font-bold shadow-sm'
                    : 'bg-white/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Listings Grid or Premium Launchpad Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-white/5 shadow-sm animate-pulse flex flex-col gap-4">
                <div className="w-full aspect-[4/3] rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  </div>
                  <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <MarketplaceCard
                  item={item}
                  onClick={() => {
                    navigate(`/market/${item.id}`);
                  }}
                  onAddToCart={(item) => addToCart(item, 1, false)}
                />
                {(index + 1) % 8 === 0 && (
                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                    <AdNativeFeed adIndex={Math.floor((index + 1) / 8) - 1} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          /* High-Converting "Hustle Launchpad" Empty State */
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-white via-slate-50/80 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/20 border border-slate-200/80 dark:border-white/10 shadow-2xl p-8 sm:p-12 md:p-16 text-center">
            {/* Ambient glowing radial orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[280px] bg-gradient-to-r from-purple-500/15 via-indigo-500/15 to-pink-500/15 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 right-10 w-72 h-72 bg-blue-500/10 blur-[90px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              
              {/* Floating 3D Badge Cluster */}
              <div className="relative mb-8 flex items-center justify-center">
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-1 shadow-2xl shadow-purple-500/30 flex items-center justify-center"
                >
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[22px] flex items-center justify-center backdrop-blur-xl">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
                      <LuShoppingBag className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                  </div>
                </motion.div>

                {/* Floating Micro Badge 1 (Left) */}
                <motion.div
                  animate={{ y: [6, -6, 6], x: [-3, 3, -3] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                  className="hidden sm:flex absolute -left-28 md:-left-36 top-2 items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-lg text-xs font-bold text-slate-700 dark:text-slate-200"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <LuShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>100% Student Verified</span>
                </motion.div>

                {/* Floating Micro Badge 2 (Right) */}
                <motion.div
                  animate={{ y: [-6, 6, -6], x: [3, -3, 3] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="hidden sm:flex absolute -right-28 md:-right-36 bottom-2 items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-lg text-xs font-bold text-slate-700 dark:text-slate-200"
                >
                  <LuZap className="w-4 h-4 text-amber-500" />
                  <span>Direct Campus Chat</span>
                </motion.div>
              </div>

              {/* Dynamic Header & Subtitle */}
              {search ? (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 mb-3">
                    <LuSearch className="w-3.5 h-3.5" /> No Direct Match
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                    No listings found for "<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">{search}</span>"
                  </h3>
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mb-8 leading-relaxed">
                    Looks like no one has posted this item yet. You can clear your search query or be the first person to offer it to fellow students!
                  </p>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-3">
                    <LuSparkles className="w-3.5 h-3.5 text-purple-500" /> Prime Spotlight Spot Available
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                    {filter === 'OFFICIAL_PRODUCT'
                      ? 'The Official Store is Getting Restocked'
                      : filter === 'GIG'
                      ? 'Be the First Campus Freelancer Here!'
                      : filter === 'PRODUCT'
                      ? 'Turn Your Old Gear into Quick Cash!'
                      : 'Be the First to Spark the Campus Hustle!'}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mb-8 leading-relaxed">
                    {filter === 'OFFICIAL_PRODUCT'
                      ? 'Uni Gang official merch and exclusive student bundles are on the way. Check back shortly or explore peer student products!'
                      : 'Thousands of university students visit The Uni Gang every week. Post your old textbooks, calculators, tech gear, or freelance services and close deals directly.'}
                  </p>
                </>
              )}

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-10 text-left">
                <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-white/5 backdrop-blur-sm shadow-sm hover:border-purple-500/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold mb-3">
                    <LuSparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Post in Under 60s</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Snap pictures, set your student rate, and publish instantly.</p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-white/5 backdrop-blur-sm shadow-sm hover:border-indigo-500/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-3">
                    <LuShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Zero Middleman Cuts</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Keep 100% of your earnings. Direct payments, no fees.</p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-white/5 backdrop-blur-sm shadow-sm hover:border-amber-500/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-3">
                    <LuZap className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Direct Campus Chat</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Chat in-app or connect on WhatsApp for safe on-campus meetups.</p>
                </div>
              </div>

              {/* High Impact Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                {search ? (
                  <button
                    onClick={() => setSearch('')}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-none"
                  >
                    <LuRefreshCw className="w-4 h-4" /> Clear Search
                  </button>
                ) : null}

                <button
                  onClick={handlePostAdClick}
                  className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-xl shadow-purple-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-none overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <LuPlus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
                    {filter === 'GIG' ? 'Post a Freelance Gig' : 'Post Your Listing / Ad Now'}
                  </span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {filter !== 'All' && (
                  <button
                    onClick={() => {
                      setFilter('All');
                      setSearch('');
                    }}
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-white/10"
                  >
                    View All Categories
                  </button>
                )}
              </div>

              {/* Frequently Requested Ideas Ticker */}
              <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-white/5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <span className="font-bold flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  🔥 Frequently Requested:
                </span>
                {['Casio fx-991EX', 'Engineering Drawing Board', 'Past Papers & Notes', 'React/Python Tutor', 'Used iPad / Tablet'].map((req, i) => (
                  <button
                    key={i}
                    onClick={() => setSearch(req)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all cursor-pointer border-none text-[11px] font-medium"
                  >
                    {req}
                  </button>
                ))}
              </div>

            </div>
          </div>
        )}

      </div>
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <LuX size={16} />
            </button>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Login Required</h2>
              <p className="text-slate-500 text-sm">Please create an account or log in to {authTarget === 'checkout' ? 'complete your purchase' : 'post an advertisement'}.</p>
            </div>
            <AuthCard onAuthSuccess={handleAuthSuccess} />
          </div>
        </div>
      )}

      {showVerificationModal && (
        <VerificationModal 
          isOpen={true} 
          onClose={() => setShowVerificationModal(false)} 
        />
      )}
      <CreateListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateListing}
      />

      {/* Selected Item Detail View Popup Card */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-md"
            />
            <div className="fixed inset-0 z-50 overflow-y-auto pointer-events-none flex items-center justify-center p-4 sm:p-6 md:p-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-150 dark:border-white/10 shadow-2xl relative pointer-events-auto overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] transition-colors"
              >
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-full z-10 transition-all shadow-md cursor-pointer border-none"
                  aria-label="Close"
                >
                  <LuX className="w-5 h-5" />
                </button>

                <div className="w-full md:w-1/2 bg-gray-50 dark:bg-slate-950/50 flex flex-col justify-center relative p-6 border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/5 h-[300px] md:h-auto">
                  {selectedItem.images && selectedItem.images.length > 0 ? (
                    <>
                      <div className="relative w-full h-64 md:h-96 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-950">
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${selectedItem.images[activeImgIndex]}`}
                          alt={selectedItem.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      {selectedItem.images.length > 1 && (
                        <>
                          <button
                            onClick={() => setActiveImgIndex(prev => prev === 0 ? selectedItem.images.length - 1 : prev - 1)}
                            className="absolute left-10 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white dark:bg-slate-800/70 dark:hover:bg-slate-800 p-2 rounded-full shadow-md z-10 transition-all cursor-pointer border-none"
                          >
                            <LuChevronLeft className="w-5 h-5 text-slate-800 dark:text-white" />
                          </button>
                          <button
                            onClick={() => setActiveImgIndex(prev => prev === selectedItem.images.length - 1 ? 0 : prev + 1)}
                            className="absolute right-10 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white dark:bg-slate-800/70 dark:hover:bg-slate-800 p-2 rounded-full shadow-md z-10 transition-all cursor-pointer border-none"
                          >
                            <LuChevronRight className="w-5 h-5 text-slate-800 dark:text-white" />
                          </button>
                          <div className="flex gap-2 justify-center mt-3 overflow-x-auto py-1">
                            {selectedItem.images.map((img: string, idx: number) => (
                              <img
                                key={idx}
                                src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${img}`}
                                alt=""
                                onClick={() => setActiveImgIndex(idx)}
                                className={`w-12 h-12 rounded-lg object-cover cursor-pointer border-2 transition-all shrink-0 ${idx === activeImgIndex ? 'border-indigo-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <LuShoppingBag className="w-16 h-16 mb-2" />
                      <span>No images uploaded</span>
                    </div>
                  )}
                </div>

                <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedItem.type === 'GIG' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {selectedItem.type}
                    </span>
                    {selectedItem.type === 'PRODUCT' && selectedItem.condition && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {selectedItem.condition}
                      </span>
                    )}
                  </div>

                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">{selectedItem.title}</h2>

                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-6">
                    Rs. {parseFloat(selectedItem.price).toLocaleString()}
                  </div>

                  <div className="flex items-center gap-2 mb-6 border-b border-gray-150 dark:border-white/5 pb-4">
                    <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                      <LuStar className={`w-4 h-4 ${parseFloat(String(selectedItem.rating || 0)) > 0 ? 'fill-current' : 'text-gray-300 dark:text-slate-600'}`} />
                      <span>{parseFloat(String(selectedItem.rating || 0)) > 0 ? parseFloat(String(selectedItem.rating)).toFixed(1) : 'No ratings yet'}</span>
                    </div>
                    {parseFloat(String(selectedItem.rating || 0)) > 0 && (
                      <span className="text-gray-400 text-xs">({selectedItem.rating_count} reviews)</span>
                    )}
                  </div>

                  <div className="mb-6 text-left">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedItem.description}</p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-150 dark:border-white/5 mb-6 text-left">
                    <p className="text-xs font-black text-slate-500 dark:text-slate-400 mb-2">Rate this {selectedItem.type.toLowerCase()}:</p>
                    <div className="flex gap-1.5 items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => handleRate(selectedItem.id, star)}
                          className="transition-transform hover:scale-125 cursor-pointer text-2xl border-none bg-transparent"
                        >
                          <LuStar
                            className={`w-6 h-6 ${star <= (hoverRating ?? 0)
                              ? 'text-amber-400 fill-amber-400'
                              : star <= Math.round(parseFloat(String(selectedItem.rating || 0)))
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-gray-300 dark:text-slate-700'
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto border-t border-gray-100 dark:border-white/5 pt-6 flex flex-col gap-4">
                    {selectedItem.type === 'OFFICIAL_PRODUCT' ? (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-50 to-orange-550 text-white flex items-center justify-center font-black border border-white/20 shadow-md">
                          UG
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                              Uni Gang Official Store
                            </span>
                            <LuBadgeCheck className="w-4 h-4 text-amber-505" title="Verified Brand Store" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Direct Merchant</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedItem.seller?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedItem.seller?.name}`}
                          alt={selectedItem.seller?.name}
                          className="w-12 h-12 rounded-full object-cover border border-gray-250 dark:border-white/10"
                        />
                        <div className="text-left">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                              {selectedItem.seller?.name || 'Seller'}
                            </span>
                            {selectedItem.seller?.is_verified_student && (
                              <LuBadgeCheck className="w-4 h-4 text-blue-500" title="Verified Student" />
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campus Merchant</span>
                        </div>
                      </div>
                    )}

                    {selectedItem.type === 'OFFICIAL_PRODUCT' ? (
                      <div className="flex flex-col sm:flex-row gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <button
                          onClick={() => {
                            addToCart(selectedItem, 1, false);
                          }}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border-none active:scale-95"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => {
                            addToCart(selectedItem, 1, true);
                            setSelectedItem(null);
                          }}
                          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer border-none active:scale-95"
                        >
                          <LuShoppingBag className="w-4 h-4" /> Buy Now
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleContactSeller(selectedItem)}
                        disabled={loadingChat}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer border-none"
                      >
                        <LuSend className="w-4 h-4" /> {loadingChat ? 'Connecting...' : 'Contact Seller (Direct Message)'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Chat Overlay Widget */}
      <AnimatePresence>
        {activeChat && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl z-[9999] overflow-hidden flex flex-col h-[420px] transition-colors"
          >
            <div className="p-4 bg-indigo-600 text-white flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={activeChat.partner?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChat.partner?.name}`}
                  alt="Recipient"
                  className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                />
                <div className="min-w-0 text-left">
                  <div className="font-black text-sm truncate leading-tight">{activeChat.partner?.name}</div>
                  <div className="text-[10px] text-indigo-200 truncate font-semibold">About: {activeChat.item?.title}</div>
                </div>
              </div>
              <button
                onClick={() => setActiveChat(null)}
                className="p-1 text-indigo-200 hover:text-white hover:bg-indigo-500/50 rounded-full transition-all cursor-pointer border-none bg-transparent"
              >
                <LuX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar flex flex-col bg-slate-50 dark:bg-slate-950/20">
              {chatMessages.length === 0 ? (
                <div className="my-auto text-center text-slate-400 dark:text-slate-550 text-xs font-bold">
                  No messages yet. Say hello!
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isMe = msg.sender_id === localStorage.getItem('userId');
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end text-right' : 'self-start items-start text-left'}`}
                    >
                      <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed ${isMe
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                        }`}>
                        {msg.message}
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 mt-0.5 px-1.5">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendChatMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-gray-150 dark:border-white/5 flex gap-2 shrink-0">
              <input
                type="text"
                placeholder="Type your message here..."
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center cursor-pointer border-none"
              >
                <LuSend size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      {cart.length > 0 && !isCartOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsCartOpen(true);
            verifyCartPrices();
          }}
          className={`fixed z-40 bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white w-16 h-16 rounded-full shadow-2xl shadow-orange-500/30 border-none cursor-pointer flex items-center justify-center transition-all ${activeChat ? 'bottom-[540px] right-6' : 'bottom-24 right-6'
            }`}
        >
          <LuShoppingBag className="w-7 h-7" />
          <span className="absolute -top-1.5 -right-1.5 bg-red-550 border-2 border-white dark:border-slate-950 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-pulse">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        </motion.button>
      )}

      {/* Cart Drawer Sliding Sidebar Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-slate-955/60 z-[999] backdrop-blur-xs"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 shadow-2xl z-[1000] flex flex-col transition-colors duration-500"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-150 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LuShoppingBag className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Company Store Cart</h3>
                </div>
                <div className="flex items-center gap-3">
                  {cart.length > 0 && cartStep === 1 && (
                    <button
                      onClick={clearCart}
                      className="text-xs font-bold text-red-500 hover:text-red-600 bg-transparent border-none cursor-pointer p-0"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 rounded-full bg-slate-105 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white cursor-pointer border-none"
                  >
                    <LuX className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-6">
                {cart.length === 0 ? (
                  <div className="my-auto flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 flex items-center justify-center mb-4">
                      <LuShoppingBag className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">Your cart is empty</h4>
                    <p className="text-xs text-slate-505 dark:text-slate-400 mb-6 max-w-[200px]">Add graduation bouquets, keytags, or souvenirs from the store.</p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setFilter('OFFICIAL_PRODUCT');
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer"
                    >
                      Browse Store
                    </button>
                  </div>
                ) : cartStep === 1 ? (
                  /* STEP 1: REVIEW CART LIST */
                  <>
                    <div className="flex-1 space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-150 dark:border-white/5 transition-all">
                          {item.image ? (
                            <img src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${item.image}`} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-white/10 shrink-0" />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 text-xs shrink-0">No Img</div>
                          )}
                          <div className="min-w-0 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate pr-2">{item.title}</h4>
                              <p className="text-xs font-extrabold text-indigo-650 dark:text-indigo-400 mt-0.5">Rs. {item.price.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  className="w-7 h-7 rounded-lg bg-slate-105 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold border-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors animate-pulse-once"
                                >
                                  -
                                </button>
                                <span className="text-xs font-black text-slate-900 dark:text-white w-6 text-center">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-7 rounded-lg bg-slate-105 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold border-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors animate-pulse-once"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-colors border-none cursor-pointer"
                              >
                                <LuTrash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 dark:border-white/5 pt-4 space-y-4">
                      <div className="flex justify-between items-center text-slate-900 dark:text-white">
                        <span className="text-sm font-semibold">Subtotal</span>
                        <span className="text-lg font-black text-indigo-650 dark:text-indigo-400">
                          Rs. {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={handleCheckoutClick}
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 cursor-pointer border-none active:scale-95"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </>
                ) : (
                  /* STEP 2: CHECKOUT FORM */
                  <form onSubmit={handleCartCheckoutSubmit} className="flex-1 flex flex-col justify-between h-full space-y-6">
                    <div className="space-y-4 flex-1">
                      {/* Back button */}
                      <button
                        type="button"
                        onClick={() => setCartStep(1)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border-none bg-transparent cursor-pointer p-0"
                      >
                        <LuArrowLeft className="w-4 h-4" /> Back to Cart
                      </button>

                      {/* Items Summary list */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-150 dark:border-white/5 rounded-2xl">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Order Summary</h4>
                        <div className="max-h-24 overflow-y-auto space-y-1.5 custom-scrollbar text-xs">
                          {cart.map(item => (
                            <div key={item.id} className="flex justify-between text-slate-600 dark:text-slate-300">
                              <span className="truncate max-w-[200px]">{item.title} (x{item.quantity})</span>
                              <span className="font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Phone field */}
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Delivery Contact Number</label>
                        <input
                          type="text"
                          required
                          value={cartPhone}
                          onChange={(e) => setCartPhone(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 outline-none text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-950 font-bold text-sm"
                          placeholder="e.g. +94771234567"
                        />
                      </div>

                      {/* Location field */}
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Delivery Address / Hostel Info</label>
                        <input
                          type="text"
                          required
                          value={cartLocation}
                          onChange={(e) => setCartLocation(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 outline-none text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-950 font-bold text-sm"
                          placeholder="e.g. UOC Hostel, Block B, Room 204"
                        />
                      </div>

                      {/* Payment Method Selector */}
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Payment Method</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'COD', label: 'Cash on Delivery' },
                            { id: 'BANK_TRANSFER', label: 'Bank Transfer' }
                          ].map(pay => (
                            <button
                              key={pay.id}
                              type="button"
                              onClick={() => setCartPayment(pay.id as any)}
                              className={`py-3 rounded-xl text-[10px] font-black uppercase border transition-all cursor-pointer ${cartPayment === pay.id
                                ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                                : 'bg-transparent border-gray-200 dark:border-white/5 text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                }`}
                            >
                              {pay.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Bank Details & Slip Upload Block */}
                      {cartPayment === 'BANK_TRANSFER' && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 text-left">
                          <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl text-[11px] text-slate-700 dark:text-slate-300">
                            <p className="font-bold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
                              <LuBuilding size={14} /> Bank Account Details
                            </p>
                            <p><strong>Bank:</strong> Sampath Bank</p>
                            <p><strong>Account Name:</strong> The Uni Gang Store</p>
                            <p><strong>Account Number:</strong> 1234 5678 9012</p>
                            <p><strong>Branch:</strong> Colombo Fort</p>
                          </div>

                          {uploadedReceipt ? (
                            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 p-3 bg-slate-50 dark:bg-slate-955/30 flex items-center gap-3">
                              {uploadedReceiptUrl && (
                                <img src={uploadedReceiptUrl} alt="Receipt Preview" className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-white/10" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{uploadedReceipt.name}</p>
                                <p className="text-[10px] text-slate-400">{(uploadedReceipt.size / (1024 * 1024)).toFixed(2)} MB</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setUploadedReceipt(null);
                                  setUploadedReceiptUrl(null);
                                }}
                                className="p-1 text-slate-400 hover:text-red-500 rounded-full transition-colors border-none bg-transparent cursor-pointer"
                              >
                                <LuX className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="border-2 border-dashed border-slate-205 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors bg-slate-50/50 dark:bg-slate-950/30">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                required
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setUploadedReceipt(file);
                                    setUploadedReceiptUrl(URL.createObjectURL(file));
                                  }
                                }}
                              />
                              <LuUpload className="w-6 h-6 text-slate-400" />
                              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center">Click to upload Receipt Slip</span>
                              <span className="text-[9px] text-slate-400 text-center">JPG, PNG, WEBP allowed</span>
                            </label>
                          )}
                        </div>
                      )}

                      {/* Notes field */}
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Notes / Instructions</label>
                        <textarea
                          value={cartNotes}
                          onChange={(e) => setCartNotes(e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 outline-none text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-950 font-semibold text-xs"
                          placeholder="Optional delivery notes..."
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-white/5 pt-4 space-y-4">
                      <div className="flex justify-between items-center text-slate-900 dark:text-white">
                        <span className="text-sm font-semibold">Total Amount</span>
                        <span className="text-lg font-black text-indigo-650 dark:text-indigo-400">
                          Rs. {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                        </span>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmittingCheckout || (cartPayment === 'BANK_TRANSFER' && !uploadedReceipt)}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-lg shadow-orange-500/20 border-none cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmittingCheckout ? 'Placing Order...' : 'Confirm Purchase'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketplaceHome;
