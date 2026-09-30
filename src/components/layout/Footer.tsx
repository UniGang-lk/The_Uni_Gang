import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaInstagram,
} from 'react-icons/fa';
import { LuSend } from 'react-icons/lu';
import logo from '../../assets/logoImage.jpg';

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const footerColumns = [
  {
    heading: 'Features',
    links: [
      { label: 'Uni Proposals (Matchmaking)', to: '/proposals', highlight: true },
      { label: 'Find Annexes', to: '/annex-list' },
      { label: 'Campus Events', to: '/event-list' },
      { label: 'Student Blogs', to: '/blogs' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Post an Ad', to: '/post-ad' },
      { label: 'Submit a Blog', to: '/submit-blog' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact Us', to: '/contact-us' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', to: '/#home' },
      { label: 'Advertise with Us', to: '/advertise' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Service', to: '/terms-of-service' },
    ],
  },
];

const socialLinks = [
  { icon: <FaFacebook size={16} />, href: '#', label: 'Facebook' },
  { icon: <FaTwitter size={16} />, href: '#', label: 'Twitter' },
  { icon: <FaYoutube size={16} />, href: '#', label: 'YouTube' },
  { icon: <FaInstagram size={16} />, href: '#', label: 'Instagram' },
];

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer
      style={{
        background:
          'linear-gradient(135deg, #0d0f2b 0%, #111433 60%, #0a0c24 100%)',
      }}
      className="relative overflow-hidden"
    >
      {/* Subtle ambient glow at top */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[200px] rounded-full blur-[80px]"
        style={{ background: 'rgba(99,102,241,0.08)' }}
      />

      {/* ── Main grid ────────────────────────── */}
      <div className="container mx-auto max-w-7xl 2xl:max-w-[1600px] px-6 2xl:px-20 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* ① Brand column */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* Logo + name */}
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-indigo-500/60 group-hover:ring-indigo-400 transition-all duration-300">
                <img
                  src={logo}
                  alt="The Uni Gang"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight tracking-wide">
                  The Uni Gang
                </p>
                <p
                  className="text-[10px] leading-tight font-medium tracking-widest uppercase"
                  style={{ color: 'rgba(129,140,248,0.8)' }}
                >
                  Student Platform
                </p>
              </div>
            </Link>

            {/* Tagline */}
            <p className="text-slate-400 text-sm leading-relaxed">
              The ultimate platform for Sri Lankan undergraduates. Find your perfect match, discover student accommodation, events, and thrive in your university life.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5 mt-1">
              {socialLinks.map(({ icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors duration-200"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* ② – ④  Link columns */}
          {footerColumns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <h4 className="text-white font-semibold text-sm tracking-wide">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className={`text-sm transition-colors duration-200 ${
                        link.highlight
                          ? 'text-indigo-400 hover:text-indigo-300 font-medium'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ⑤ Stay Connected */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-sm tracking-wide">
              Stay Connected
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get the latest updates and tips for your student journey.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-1">
              <div className="flex items-center gap-2">
                {/* Email input */}
                <input
                  type="email"
                  id="footer-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                />
                {/* Subscribe button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white whitespace-nowrap shadow-lg transition-all duration-200"
                  style={{
                    background:
                      'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
                  }}
                >
                  <LuSend size={13} />
                  Subscribe
                </motion.button>
              </div>

              {/* Success feedback */}
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-400 text-xs font-medium"
                >
                  ✓ You're subscribed! Thanks for joining.
                </motion.p>
              )}
            </form>
          </div>
        </div>

        {/* ── Divider + Copyright bar ──────────── */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-slate-500 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} The Uni Gang. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              to="/privacy-policy"
              className="text-slate-500 hover:text-slate-300 text-xs transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-slate-500 hover:text-slate-300 text-xs transition-colors duration-200"
            >
              Terms
            </Link>
            <Link
              to="/faq"
              className="text-slate-500 hover:text-slate-300 text-xs transition-colors duration-200"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
