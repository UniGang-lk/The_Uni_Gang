import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuArrowLeft,
  LuStar,
  LuShoppingBag,
  LuPackage,
  LuBadgeCheck,
  LuShieldCheck,
  LuMapPin,
  LuSparkles,
  LuClock,
  LuMinus,
  LuPlus,
  LuSend,
  LuChevronRight,
  LuX
} from 'react-icons/lu';
import { formatDistanceToNow } from 'date-fns';
import { api } from '../../api';
import SEO from '../../components/SEO';
import PremiumPageLoader from '../../components/ui/PremiumPageLoader';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
import VerifiedBadge from '../../components/ui/VerifiedBadge';
import MarketplaceCard from '../../components/market/MarketplaceCard';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const MarketItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<any>(null);
  const [relatedItems, setRelatedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Chat state
  const [activeChat, setActiveChat] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatText, setChatText] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;

    const fetchItemData = async () => {
      setLoading(true);
      try {
        const data = await api.getMarketItem(id);
        if (data) {
          setItem(data);
          setActiveImgIndex(0);

          // Fetch related items from marketplace
          try {
            const allItems = await api.getMarketItems(data.type);
            const pool = allItems.filter((i: any) => String(i.id) !== String(id));
            setRelatedItems(pool.slice(0, 4));
          } catch {
            /* ignore related fetch failure */
          }
        }
      } catch (err: any) {
        console.error('Error fetching marketplace item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [id]);

  // Polling for chat messages if active chat is open
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
      interval = setInterval(fetchChatMessages, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeChat]);

  const handleRate = async (score: number) => {
    if (!item) return;
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please log in to rate this listing.');
      return;
    }
    if (item.seller_id === userId) {
      toast.error('You cannot rate your own listing.');
      return;
    }
    try {
      const data = await api.rateListing(item.id, score);
      setItem((prev: any) => ({
        ...prev,
        rating: data.rating,
        rating_count: data.rating_count
      }));
      toast.success('Thank you for your rating!', {
        style: { borderRadius: '16px', background: '#1e293b', color: '#fff' }
      });
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit rating.');
    }
  };

  const handleContactSeller = async () => {
    if (!item) return;
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please log in to contact the seller.');
      return;
    }
    if (item.seller_id === userId) {
      toast.error('This is your own listing.');
      return;
    }

    setLoadingChat(true);
    try {
      const chat = await api.startMarketplaceChat(item.id);
      chat.partner = item.seller;
      chat.item = item;
      setActiveChat(chat);
      toast.success(`Direct message opened with ${item.seller?.name || 'Seller'}!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to start conversation.');
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat || !chatText.trim()) return;
    try {
      const sent = await api.sendMarketplaceMessage(activeChat.id, chatText.trim());
      setChatMessages(prev => [...prev, sent]);
      setChatText('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message.');
    }
  };

  const addToCart = (openDrawer = false, targetItem?: any) => {
    const itemToAdd = targetItem || item;
    if (!itemToAdd) return;
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please log in to add items to your cart.');
      return;
    }

    const savedCart = localStorage.getItem('company_store_cart');
    let cart: any[] = [];
    try {
      cart = savedCart ? JSON.parse(savedCart) : [];
    } catch {
      cart = [];
    }

    const qtyToAdd = targetItem ? 1 : quantity;
    const existing = cart.find(i => String(i.id) === String(itemToAdd.id));
    let newCart = [];
    if (existing) {
      newCart = cart.map(i => String(i.id) === String(itemToAdd.id) ? { ...i, quantity: i.quantity + qtyToAdd } : i);
    } else {
      newCart = [...cart, {
        id: itemToAdd.id,
        title: itemToAdd.title,
        price: parseFloat(itemToAdd.price),
        image: itemToAdd.images && itemToAdd.images.length > 0 ? itemToAdd.images[0] : null,
        quantity: qtyToAdd
      }];
    }

    localStorage.setItem('company_store_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-update'));
    toast.success(`"${itemToAdd.title}" added to cart!`, {
      style: { borderRadius: '16px', background: '#1e293b', color: '#fff' }
    });

    if (openDrawer) {
      navigate('/market?openCart=true');
    }
  };



  if (loading) {
    return <PremiumPageLoader isLoading={true} message="Loading item details..." />;
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6">
          <LuPackage className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Listing Not Found</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-sm">This item may have been sold or removed by the seller.</p>
        <Link
          to="/market"
          className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
        >
          <LuArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
      </div>
    );
  }

  const images = item.images && item.images.length > 0
    ? item.images.map((img: string) => img.startsWith('http') ? img : `${BASE_URL}${img.startsWith('/') ? '' : '/'}${img}`)
    : ['https://images.unsplash.com/photo-1521556906631-0c58e7ce65e5?q=80&w=800&auto=format&fit=crop'];

  const displayPrice = parseFloat(String(item.price || 0)).toLocaleString();
  const sellerName = item.seller?.name || 'Campus Student';
  const sellerPic = item.seller?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(sellerName)}`;
  const isStudentVerified = item.seller?.is_verified_student ?? false;
  const isProfessionalVerified = item.seller?.is_verified_professional ?? false;
  const currentUserId = localStorage.getItem('userId');
  const isOwner = currentUserId && String(item.seller_id) === String(currentUserId);
  const sellerPhone = item.seller?.phone ? item.seller.phone.replace(/[^0-9+]/g, '') : '';

  let timeAgo = 'Recently';
  try {
    if (item.createdAt) {
      timeAgo = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });
    }
  } catch {
    timeAgo = 'Recently';
  }

  const shareTitle = `${item.title} - Rs. ${displayPrice} on Uni Gang Marketplace`;
  const shareUrl = window.location.href;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 pt-6 pb-24">
      <SEO
        title={`${item.title} - Campus Marketplace | The Uni Gang`}
        description={item.description || `Buy ${item.title} for Rs. ${displayPrice} on The Uni Gang Student Marketplace.`}
        image={images[0]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Navigation Bar */}
        <PageBreadcrumb
          items={[
            { label: 'Marketplace', to: '/market' },
            {
              label: item.type.replace('_', ' ').toLowerCase(),
              to: `/market?type=${encodeURIComponent(item.type)}`,
              active: true
            },
            { label: item.title }
          ]}
          backTo="/market"
          backLabel="Back to Market"
          shareTitle={shareTitle}
          shareUrl={shareUrl}
          className="mb-8"
        />

        {/* Main 2-Column Product Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Visual Media Experience (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            {/* Primary Featured Image Display */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl group">
              <img
                src={images[activeImgIndex]}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {item.is_featured && (
                  <span className="px-3.5 py-1.5 bg-amber-500 text-white text-xs font-black rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                    <LuStar className="w-3.5 h-3.5 fill-current" /> FEATURED
                  </span>
                )}
                {item.type === 'OFFICIAL_PRODUCT' ? (
                  <span className="px-3.5 py-1.5 text-xs font-black rounded-full shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center gap-1.5">
                    <LuBadgeCheck className="w-4 h-4" /> Official Brand Store
                  </span>
                ) : (
                  <span
                    className={`px-3.5 py-1.5 text-xs font-black rounded-full shadow-lg text-white ${
                      item.type === 'GIG' ? 'bg-indigo-600' : 'bg-emerald-600'
                    }`}
                  >
                    {item.type}
                  </span>
                )}
              </div>

              {/* Condition Badge (if applicable) */}
              {item.condition && item.condition !== 'Not Applicable' && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3.5 py-1.5 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20 shadow-md">
                    Condition: {item.condition}
                  </span>
                </div>
              )}

              {/* Stock Status Indicator */}
              <div className="absolute bottom-4 left-4 z-10">
                <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200 text-xs font-bold rounded-full border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {item.status || 'AVAILABLE'}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery (if more than 1 image) */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 transition-all border-2 ${
                      activeImgIndex === idx
                        ? 'border-indigo-600 dark:border-indigo-400 ring-4 ring-indigo-500/20 scale-105 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-400'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Campus Security & Buyer Protection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <LuShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Campus Verified</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">Student accounts verified via university credentials</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <LuMapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Campus Pick-up</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">Trade safely at the university canteen or library</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  <LuSparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Direct Chat</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">Instant real-time messaging with no broker fees</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Pricing, Overview & Action Execution (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Title & Price Header Card */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl">
              
              {/* Type, Condition & Time Meta */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider">
                  {item.type.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <LuClock className="w-3.5 h-3.5" /> {timeAgo}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
                {item.title}
              </h1>

              {/* Price Tag */}
              <div className="flex items-baseline gap-3 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">
                  Rs. {displayPrice}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">LKR Fixed</span>
              </div>

              {/* Star Rating Overview */}
              <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-500 text-base">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <LuStar
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(parseFloat(String(item.rating || 0)))
                            ? 'fill-current text-amber-500'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {parseFloat(String(item.rating || 0)).toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({item.rating_count || 0} reviews)
                  </span>
                </div>

                <a
                  href="#rate-item"
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Rate this item
                </a>
              </div>

              {/* Specification Pills */}
              <div className="grid grid-cols-2 gap-3 py-5 text-xs border-b border-slate-100 dark:border-slate-800/80">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Condition</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200 mt-0.5 block">{item.condition || 'Good'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Listing Type</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200 mt-0.5 block">{item.type}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Availability</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{item.status || 'In Stock'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Seller Type</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                    {item.type === 'OFFICIAL_PRODUCT' ? 'Official Brand' : (isStudentVerified ? 'Verified Student' : 'Peer Merchant')}
                  </span>
                </div>
              </div>

              {/* Actions / CTA Section */}
              <div className="pt-6 flex flex-col gap-4">
                {item.type === 'OFFICIAL_PRODUCT' ? (
                  <>
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Quantity</span>
                      <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors shadow-sm"
                        >
                          <LuMinus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-black text-sm">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors shadow-sm"
                        >
                          <LuPlus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => addToCart(false)}
                        className="w-full py-4 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                      >
                        <LuShoppingBag className="w-4 h-4" /> Add to Cart
                      </button>

                      <button
                        onClick={() => addToCart(true)}
                        className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-95"
                      >
                        Buy Now
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {isOwner ? (
                      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800 text-center">
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                          This is your marketplace listing.
                        </span>
                        <Link
                          to="/market"
                          className="mt-2 block text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Manage your listings on Marketplace &rarr;
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={handleContactSeller}
                          disabled={loadingChat}
                          className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2.5 active:scale-95 disabled:opacity-50 cursor-pointer border-none"
                        >
                          <LuSend className="w-4 h-4" />
                          {loadingChat ? 'Connecting...' : 'Chat with Seller (Direct Message)'}
                        </button>

                        {sellerPhone && (
                          <a
                            href={`https://wa.me/${sellerPhone.replace(/^\+/, '')}?text=${encodeURIComponent(`Hi ${sellerName}, I saw your listing "${item.title}" (Rs. ${displayPrice}) on The Uni Gang Marketplace. Is it still available?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95 no-underline cursor-pointer"
                          >
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.675 1.439 5.662 1.439h.05c6.554 0 11.89-5.335 11.893-11.892a11.826 11.826 0 00-3.487-8.412Z" />
                            </svg>
                            WhatsApp Seller
                          </a>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

            </div>

            {/* Seller Profile Summary Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
              {item.type === 'OFFICIAL_PRODUCT' ? (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white text-base font-black flex items-center justify-center border border-white/20 shadow-md shrink-0">
                    UG
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        Uni Gang Official Store
                      </h3>
                      <LuBadgeCheck className="w-4 h-4 text-amber-500 shrink-0" title="Verified Store" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Official University Merchandise & Essentials
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={sellerPic}
                    alt={sellerName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {sellerName}
                      </h3>
                      {isStudentVerified && <VerifiedBadge size={16} title="Verified Student" />}
                      {isProfessionalVerified && !isStudentVerified && <VerifiedBadge size={16} title="Verified Professional" />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Contributor from {item.seller?.university || 'University of Colombo'}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Interactive Community Rating Form */}
            <div id="rate-item" className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-left">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                Rate this {item.type.toLowerCase()}
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                Help fellow university students make smart purchasing decisions.
              </p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => handleRate(star)}
                    className="transition-transform hover:scale-125 cursor-pointer text-2xl border-none bg-transparent p-0"
                  >
                    <LuStar
                      className={`w-7 h-7 ${
                        star <= (hoverRating ?? 0)
                          ? 'text-amber-400 fill-amber-400'
                          : star <= Math.round(parseFloat(String(item.rating || 0)))
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-200 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Description Block */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="max-w-4xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              Detailed Product Description
            </h3>
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {item.description || 'No detailed description provided for this listing.'}
            </p>
          </div>
        </div>

        {/* Similar / Related Campus Marketplace Listings */}
        {relatedItems.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                  More from Campus Marketplace
                </h3>
                <p className="text-xs text-slate-500 mt-1">Discover other student essentials and campus deals</p>
              </div>
              <Link
                to="/market"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1"
              >
                View Marketplace <LuChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedItems.map((relItem) => (
                <MarketplaceCard
                  key={relItem.id}
                  item={relItem}
                  onClick={() => navigate(`/market/${relItem.id}`)}
                  onAddToCart={() => {
                    addToCart(false, relItem);
                  }}
                />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Floating In-App Chat Modal */}
      <AnimatePresence>
        {activeChat && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-[9999] overflow-hidden flex flex-col h-[460px] transition-colors"
          >
            <div className="p-4 bg-indigo-600 text-white flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={activeChat.partner?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChat.partner?.name || 'Seller'}`}
                  alt="Recipient"
                  className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
                />
                <div className="min-w-0 text-left">
                  <div className="font-black text-sm truncate leading-tight">{activeChat.partner?.name || 'Seller'}</div>
                  <div className="text-[10px] text-indigo-200 truncate font-semibold">About: {item.title}</div>
                </div>
              </div>
              <button
                onClick={() => setActiveChat(null)}
                className="p-1.5 text-indigo-200 hover:text-white hover:bg-indigo-500/50 rounded-full transition-all cursor-pointer border-none bg-transparent"
              >
                <LuX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar flex flex-col bg-slate-50 dark:bg-slate-950/20">
              {chatMessages.length === 0 ? (
                <div className="my-auto text-center text-slate-400 dark:text-slate-500 text-xs font-bold">
                  No messages yet. Ask about condition, pricing, or meetup location!
                </div>
              ) : (
                chatMessages.map((msg: any) => {
                  const isMe = msg.sender_id === localStorage.getItem('userId');
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end text-right' : 'self-start items-start text-left'}`}
                    >
                      <div
                        className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                        }`}
                      >
                        {msg.message}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 px-1">
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendChatMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-100 dark:bg-slate-800/80 border-none px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={!chatText.trim()}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer border-none flex items-center justify-center shrink-0"
              >
                <LuSend className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketItemDetailPage;
