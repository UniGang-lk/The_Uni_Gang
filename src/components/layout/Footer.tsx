import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa6';
import { LuSend } from 'react-icons/lu';
import logo from '../../assets/logoImage.jpg';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────
   Footer Columns Data
───────────────────────────────────────── */
const footerColumns = [
  {
    heading: 'Core Ecosystem',
    links: [
      { label: 'Find Student Annexes', to: '/annex-list', badge: 'Hot' },
      { label: 'Hustle Hub Market', to: '/market' },
      { label: 'Campus Services', to: '/services' },
      { label: 'University Events', to: '/event-list' },
      { label: 'Student Blogs & Feed', to: '/blogs' },
    ],
  },
  {
    heading: 'Matchmaking & B2B',
    links: [
      { label: 'Uni Porondam', to: '/proposals', highlight: true, badge: 'VIP' },
      { label: 'Advertise with Us', to: '/advertise', highlight: true },
      { label: 'Create Ad Campaign', to: '/advertise/submit' },
      { label: 'Submit Event or Ad', to: '/post-ad' },
      { label: 'Submit Student Article', to: '/submit-blog' },
    ],
  },
  {
    heading: 'Help & Information',
    links: [
      { label: 'About The Uni Gang', to: '/about' },
      { label: 'Help Center & FAQ', to: '/faq' },
      { label: 'Support & Contact Us', to: '/contact-us' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Service', to: '/terms-of-service' },
    ],
  },
];

const socialLinks = [
  { icon: <FaFacebook size={16} />, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
  { icon: <FaInstagram size={16} />, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
  { icon: <FaYoutube size={16} />, href: '#', label: 'YouTube', color: 'hover:bg-red-600' },
  { icon: <FaWhatsapp size={16} />, href: 'https://wa.me/94724478148', label: 'WhatsApp', color: 'hover:bg-emerald-600' },
];

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('🎉 Welcome aboard! You have subscribed to The Uni Gang newsletter.');
      setEmail('');
    }
  };

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300 border-t border-slate-800/80 font-sans select-none">
      {/* Dynamic Ambient Glow Backdrops */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 w-[600px] h-[300px] rounded-full bg-blue-600/10 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-1/4 w-[600px] h-[300px] rounded-full bg-indigo-600/10 blur-[140px]"
      />

      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 2xl:px-20 pt-14 pb-10 relative z-10">
        
        {/* ── Main Top Row Grid (5 Columns Layout) ────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 items-start">

          {/* ① Brand Column */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden ring-2 ring-blue-500/50 group-hover:ring-blue-400 transition-all duration-300 shadow-md">
                <img
                  src={logo}
                  alt="The Uni Gang"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white font-black text-base tracking-tight leading-none">
                  The Uni Gang
                </p>
                <p className="text-[9px] font-black tracking-widest uppercase text-blue-400 mt-1">
                  CAMPUS PLATFORM & B2B HUB
                </p>
              </div>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              Empowering 50,000+ Sri Lankan undergraduates across 15+ university campuses with housing, events, trading, and connections.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 mt-1">
              {socialLinks.map(({ icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-8.5 h-8.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 ${color}`}
                >
                  {icon}
                </motion.a>
              ))}
            </div>

            {/* Platform Status Badge */}
            <div className="mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-400 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* ② – ④ Link Columns */}
          {footerColumns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3.5">
              <h4 className="text-white font-extrabold text-xs tracking-wider uppercase text-slate-200">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className={`text-xs transition-all duration-200 flex items-center gap-2 ${
                        link.highlight
                          ? 'text-blue-400 hover:text-blue-300 font-bold'
                          : 'text-slate-400 hover:text-white font-medium'
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ⑤ Subscribe Section MOVED TO TOP RIGHT (Right Corner) */}
          <div className="lg:col-span-1 flex flex-col gap-3.5 bg-slate-900/60 p-5 rounded-3xl border border-slate-800/80 backdrop-blur-xl">
            <h4 className="text-white font-extrabold text-xs tracking-wider uppercase text-slate-200">
              Subscribe to Digest
            </h4>
            <p className="text-slate-400 text-xs font-normal leading-relaxed">
              Get the latest annex alerts, campus events, and career updates directly to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5 mt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500 transition-all font-medium"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <LuSend size={13} />
                <span>Join Digest</span>
              </motion.button>
            </form>
          </div>

        </div>

        {/* ── Bottom Bar ──────────── */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} <span className="text-slate-300 font-bold">The Uni Gang</span>. Built for Sri Lankan University Students with ❤️.
          </p>

          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300 transition-colors">About</Link>
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link to="/faq" className="hover:text-slate-300 transition-colors">FAQ</Link>
            <Link to="/contact-us" className="hover:text-slate-300 transition-colors">Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
