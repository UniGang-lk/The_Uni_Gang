import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logoImage.jpg'; // Adjusting path if needed, wait, original Header had '../assets/logoImage.jpg'. I'll use '../assets/logoImage.jpg'. Oh wait, `Layout.tsx` has `import Header from '../Header';`.

import { LuMenu, LuX, LuUser, LuLogOut, LuSun, LuMoon, LuShoppingBag } from 'react-icons/lu';
import { useTheme } from '../../context/ThemeContext'; // wait, Header.tsx might be in src/components/
import { dispatchAuthUpdate, listenToAuthUpdate } from '../../utils/authEvents';
import toast from 'react-hot-toast';
import { NotificationDropdown } from '../ui/NotificationDropdown';

const SubHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userProfilePic, setUserProfilePic] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isVerifiedStudent, setIsVerifiedStudent] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check Login Status and sync Cart Count
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('userToken');
      const storedUserName = localStorage.getItem('userName');
      const storedProfilePic = localStorage.getItem('userProfilePicture');
      const verified = localStorage.getItem('userIsVerifiedStudent') === 'true';

      setIsLoggedIn(!!token);
      setUserName(storedUserName);
      setUserProfilePic(storedProfilePic);
      setIsVerifiedStudent(verified);

      if (token && (!localStorage.getItem('userId') || localStorage.getItem('userIsVerifiedStudent') === null)) {
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch profile'))
          .then(data => {
            if (data.success && data.user) {
              localStorage.setItem('userId', String(data.user.id));
              localStorage.setItem('userIsVerifiedStudent', String(!!data.user.is_verified_student));
              // Dispatch event to sync other components
              window.dispatchEvent(new Event('auth-update'));
            }
          })
          .catch(err => console.error('Error auto-syncing userId in SubHeader:', err));
      }
    };

    const updateCartCount = () => {
      const savedCart = localStorage.getItem('company_store_cart');
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) {
            const count = parsed.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(count);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setCartCount(0);
    };

    checkLoginStatus();
    updateCartCount();

    const cleanup = listenToAuthUpdate(checkLoginStatus);
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cart-update', updateCartCount);

    return () => {
      cleanup();
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cart-update', updateCartCount);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userProfilePicture');
    localStorage.removeItem('userId');
    localStorage.removeItem('userIsVerifiedStudent');
    setIsLoggedIn(false);
    setUserName(null);
    setUserProfilePic(null);
    setIsVerifiedStudent(false);
    setIsProfileDropdownOpen(false);
    dispatchAuthUpdate();
    toast.success('Logged out successfully');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-blue-500/10 py-2'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden rounded-full border-2 border-blue-500 p-0.5 transition-transform duration-300 group-hover:scale-105">
            <img src={logo} alt="The Uni Gang" className="w-9 h-9 rounded-full object-cover" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
            The <span className="text-blue-600">Uni Gang</span>
          </span>
        </Link>

        {/* Desktop Profile / Auth / Actions */}
        <div className="hidden md:flex items-center gap-3" ref={dropdownRef}>
          {/* Notification Icon */}
          {isLoggedIn && <NotificationDropdown />}

          {/* Cart Icon (Only if isLoggedIn is true and there are items in the cart) */}
          {isLoggedIn && cartCount > 0 && (
            <button
              onClick={() => {
                if (window.location.pathname === '/market') {
                  window.dispatchEvent(new Event('open-cart-drawer'));
                } else {
                  // Redirect to /market with openCart parameter
                  window.location.href = '/market?openCart=true';
                }
              }}
              className="p-2.5 rounded-full text-slate-650 hover:bg-slate-100 hover:text-indigo-600 transition-all relative cursor-pointer"
              title="View Shopping Cart"
            >
              <LuShoppingBag className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-slate-900 shadow-sm animate-pulse">
                {cartCount}
              </span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {theme === 'dark' ? <LuSun className="w-5 h-5" /> : <LuMoon className="w-5 h-5" />}
          </button>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 focus:outline-none transition-all hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 pr-3 rounded-full border border-transparent hover:border-slate-100"
              >
                {userProfilePic ? (
                  <div className={`p-[2px] rounded-full shrink-0 ${
                    isVerifiedStudent
                      ? 'bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-400 shadow-sm shadow-amber-400/30'
                      : 'bg-linear-to-tr from-blue-300 via-indigo-300 to-purple-300'
                  }`}>
                    <img src={userProfilePic} alt="Profile" className="w-8 h-8 rounded-full border border-white dark:border-slate-900 object-cover" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <LuUser className="w-5 h-5" />
                  </div>
                )}
              </button>

              {/* Dropdown */}
              <div
                className={`absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 transform transition-all duration-200 origin-top-right ${isProfileDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
              >
                <div className="px-4 py-3 border-b border-slate-100 mb-1">
                  <p className="text-sm font-semibold text-slate-800">{userName}</p>
                  <p className="text-xs text-slate-500">Student Profile</p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <LuUser className="w-4 h-4" /> Profile
                </Link>
                <div className="h-px bg-slate-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  <LuLogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/post-ad"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold rounded-full hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/20"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-slate-800 dark:text-white focus:outline-none p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <LuX className="w-7 h-7" /> : <LuMenu className="w-7 h-7" />}
        </button>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-8 md:hidden"
            >
              {/* Theme Toggle (Mobile) */}
              <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? <LuSun className="w-6 h-6" /> : <LuMoon className="w-6 h-6" />}
              </button>

              {/* Mobile Links */}
              <div className="flex flex-col items-center space-y-6 w-full px-8 mt-10">
                {isLoggedIn ? (
                  <div className="flex flex-col items-center space-y-4 w-full">
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-6 py-3 rounded-2xl w-full justify-center">
                      {userProfilePic ? (
                        <img src={userProfilePic} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <LuUser className="w-8 h-8 text-slate-400" />
                      )}
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-800 dark:text-white">{userName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Logged In</p>
                      </div>
                    </div>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 text-slate-600 dark:text-slate-300 font-medium tracking-wide">Profile</Link>
                    <button onClick={handleLogout} className="text-red-500 font-medium tracking-wide mt-4">Log Out</button>
                  </div>
                ) : (
                  <Link
                    to="/post-ad"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    Sign In / Register
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default SubHeader;
