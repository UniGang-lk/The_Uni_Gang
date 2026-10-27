import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  LuBuilding, LuMail, LuPhone, LuHeading,
  LuLink, LuImage, LuCalendar, LuMegaphone,
  LuUpload, LuTrash2, LuLayers, LuShieldCheck,
  LuGraduationCap, LuCheck, LuSparkles, LuEye,
  LuZap, LuClock, LuExternalLink
} from 'react-icons/lu';
import { api } from '../../api';
import toast from 'react-hot-toast';
import { PageBreadcrumb } from '../../components/ui/PageBreadcrumb';
import SEO from '../../components/SEO';

export default function AdSubmissionForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    contact_email: '',
    contact_phone: '',
    ad_title: '',
    ad_description: '',
    target_link: '',
    placement_type: 'BANNER',
    duration_days: '14',
    target_campus: 'All Campuses (Island-wide)'
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isLoggedIn = !!localStorage.getItem('userToken');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  useEffect(() => {
    const tier = searchParams.get('tier');
    if (tier) {
      setSelectedTier(tier);
      if (tier.toLowerCase().includes('starter')) {
        setFormData(prev => ({ ...prev, placement_type: 'SIDEBAR', duration_days: '7' }));
      } else if (tier.toLowerCase().includes('hero')) {
        setFormData(prev => ({ ...prev, placement_type: 'BANNER', duration_days: '14' }));
      } else if (tier.toLowerCase().includes('ultimate')) {
        setFormData(prev => ({ ...prev, placement_type: 'POPUP', duration_days: '30' }));
      }
    }

    // Pre-fill from Reach Calculator (?placement=BANNER&days=14)
    const placementParam = searchParams.get('placement');
    const daysParam = searchParams.get('days');
    const validPlacements = ['BANNER', 'SIDEBAR', 'NATIVE_FEED', 'POPUP'];
    const validDays = ['7', '14', '21', '30'];
    if (placementParam && validPlacements.includes(placementParam)) {
      setFormData(prev => ({ ...prev, placement_type: placementParam }));
    }
    if (daysParam && validDays.includes(daysParam)) {
      setFormData(prev => ({ ...prev, duration_days: daysParam }));
    }

    // Auto fill user contact email if logged in
    const storedEmail = localStorage.getItem('userEmail');
    const storedName = localStorage.getItem('userName');
    if (storedEmail || storedName) {
      setFormData(prev => ({
        ...prev,
        contact_email: prev.contact_email || storedEmail || '',
        company_name: prev.company_name || storedName || ''
      }));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 8 * 1024 * 1024) {
        toast.error('Image file size must be less than 8MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Ad banner artwork image is required!');
      return;
    }
    setIsSubmitting(true);
    try {
      const data = new FormData();
      if (formData.target_campus) {
        data.append('target_campus', formData.target_campus);
      }
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'target_campus') {
          return;
        }
        if (key === 'target_link') {
          const trimmed = value.trim();
          const normalized = trimmed ? (trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`) : '';
          data.append('target_link', normalized);
        } else if (key === 'placement_type' && selectedTier) {
          if (selectedTier.toLowerCase().includes('starter')) {
            data.append('placement_type', 'Campus Starter (SIDEBAR)');
          } else if (selectedTier.toLowerCase().includes('hero')) {
            data.append('placement_type', 'Campus Hero (BANNER)');
          } else if (selectedTier.toLowerCase().includes('ultimate')) {
            data.append('placement_type', 'Ultimate Blast (POPUP)');
          } else {
            data.append('placement_type', `${selectedTier} (${value})`);
          }
        } else {
          data.append(key, typeof value === 'string' ? value.trim() : value);
        }
      });
      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await api.submitAdvertisement(data);
      if (res && res.id) {
        localStorage.setItem('last_submitted_ad_id', res.id);
      }
      toast.success('🎉 Advertisement campaign submitted! Our ad desk will contact you within 2-4 hours.');
      navigate(`/advertise?track=true${res?.id ? `&id=${res.id}` : ''}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit advertisement campaign request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const placementOptions = [
    {
      id: 'BANNER',
      title: 'Top Banner',
      desc: 'High visibility header banner displayed across major feed views.',
      badge: 'High Impact',
      specs: '1200 x 400 px',
      rate: 1000
    },
    {
      id: 'SIDEBAR',
      title: 'Sticky Sidebar',
      desc: 'Persistent widget that stays in view while students scroll.',
      badge: 'Continuous Exposure',
      specs: '300 x 300 px',
      rate: 600
    },
    {
      id: 'NATIVE_FEED',
      title: 'Native Feed Card',
      desc: 'In-stream card integrated directly into student feed lists.',
      badge: 'High Engagement',
      specs: '800 x 450 px',
      rate: 800
    },
    {
      id: 'POPUP',
      title: 'Global Popup Interstitial',
      desc: 'Full-screen overlay pop-up for massive event or deal launches.',
      badge: 'Maximum Reach',
      specs: '600 x 600 px',
      rate: 1500
    }
  ];

  // Pricing & metadata helper
  const getPackageDetails = () => {
    if (selectedTier) {
      if (selectedTier.toLowerCase().includes('starter')) {
        return {
          name: 'Campus Starter',
          priceText: 'LKR 4,500',
          durationText: '7 Days',
          reachText: '~15,000 Impressions',
          specs: '300 x 300 px (Sidebar / Feed)',
          badge: 'Starter Pack',
          benefits: ['Sticky Sidebar Placement', 'Basic Click & View Tracker', 'Standard 12h Review', 'Direct WhatsApp / Web Link']
        };
      }
      if (selectedTier.toLowerCase().includes('hero')) {
        return {
          name: 'Campus Hero',
          priceText: 'LKR 12,500',
          durationText: '14 Days',
          reachText: '~50,000+ Impressions',
          specs: '1200 x 400 px (Top Banner + Feed)',
          badge: 'Most Popular',
          benefits: ['Top Banner + Native Feed Cards', 'Targeted Campus Filters', 'WhatsApp Lead Direct Routing', 'Priority 2h Express Approval']
        };
      }
      return {
        name: 'Ultimate Uni Blast',
        priceText: 'LKR 24,500',
        durationText: '30 Days',
        reachText: '~150,000+ Impressions',
        specs: '600 x 600 px (Full Suite + Popup)',
        badge: 'Maximum Reach',
        benefits: ['Full Suite (Banner + Feed + Popup)', 'Dedicated Campaign Manager', 'Social Media Co-Promotion', '24/7 Priority Support']
      };
    }

    // Custom placement calculation
    const currentPlacement = placementOptions.find(p => p.id === formData.placement_type) || placementOptions[0];
    const days = parseInt(formData.duration_days, 10) || 14;
    const gross = currentPlacement.rate * days;
    const discount = days >= 30 ? gross * 0.1 : 0;
    const finalCost = gross - discount;

    return {
      name: `${currentPlacement.title} Custom`,
      priceText: `LKR ${finalCost.toLocaleString()}`,
      durationText: `${days} Days`,
      reachText: `~${(days * 3000).toLocaleString()} Impressions`,
      specs: currentPlacement.specs,
      badge: 'Custom Placement',
      benefits: [
        `${currentPlacement.title} placement`,
        'Express 2-4h turnaround',
        'Direct link integration',
        'Real-time view & click stats'
      ]
    };
  };

  const currentPackage = getPackageDetails();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-50 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 pt-20 pb-24 px-4 sm:px-6 lg:px-8 2xl:px-12 relative overflow-hidden">
      <SEO
        title="Launch Ad Campaign - The Uni Gang"
        description="Target 50,000+ Sri Lankan university students across 15+ campuses. Create your advertisement campaign."
      />

      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto space-y-6 relative z-10">

        {/* Navigation Breadcrumb */}
        <PageBreadcrumb
          items={[
            { label: 'Advertise', to: '/advertise' },
            { label: selectedTier ? `Campaign - ${selectedTier}` : 'Create Campaign', active: true }
          ]}
          backTo="/advertise"
          backLabel="Back to Advertise"
        />

        {/* Header Hero Section */}
        <div className="text-center space-y-3 pt-2 pb-4 max-w-3xl mx-auto">
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest shadow-xs">
            <LuSparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> Self-Serve Ad Manager
          </div> */}

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Launch Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">Ad Campaign</span>
          </h1>

          <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400">
            Promote your institute, tech academy, food deal, or student service to 50,000+ Sri Lankan undergrads.
          </p>

          {!isLoggedIn && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 text-xs text-blue-800 dark:text-blue-300 font-bold">
              <LuShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Guest Submission Enabled. Fast 2-4h turnaround via WhatsApp / Email.</span>
            </div>
          )}
        </div>

        {/* Two-Column Responsive Layout: Left = Organized Form, Right = Sticky Live Preview & Order Card */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Column: Form Fields (7 or 8 columns on wide screen) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">

              {/* STEP 1: Advertiser Profile */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-6"
              >
                <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20 text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">
                      Advertiser Contact Profile
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      How our campaign review desk will reach you with approval and updates
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Company / Institute Name *
                    </label>
                    <div className="relative">
                      <LuBuilding className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
                      <input
                        required
                        name="company_name"
                        placeholder="e.g. SLIIT Academy, Pizza Hut, Codegen"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-sm"
                      />
                    </div>
                    {isLoggedIn && localStorage.getItem('userName') ? (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
                        <span>✓ Auto-filled from account</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 font-medium mt-1">Brand or organization name</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Contact Email Address *
                    </label>
                    <div className="relative">
                      <LuMail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
                      <input
                        required
                        type="email"
                        name="contact_email"
                        placeholder="ads@company.com"
                        value={formData.contact_email}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-sm"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Verification and report destination</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      WhatsApp / Direct Phone Number *
                    </label>
                    <div className="relative">
                      <LuPhone className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
                      <input
                        required
                        name="contact_phone"
                        placeholder="077 123 4567 or +94 72 447 8148"
                        value={formData.contact_phone}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-sm"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">
                      Our desk will send WhatsApp express review notification and live link
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* STEP 2: Campaign Copy & Target Audience */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-6"
              >
                <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-500/20 text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">
                      Campaign Message & Destination
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      What offer or headline should students see when viewing this ad?
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Campaign Headline / Title *
                    </label>
                    <div className="relative">
                      <LuHeading className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
                      <input
                        required
                        name="ad_title"
                        placeholder="e.g. Software Engineering Degree Intake 2026 - 20% Discount for Uni Students"
                        value={formData.ad_title}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Offer Description & Highlights *
                    </label>
                    <textarea
                      required
                      name="ad_description"
                      rows={3}
                      placeholder="Detail your promotional offer, course intakes, student discount codes, or key application steps..."
                      value={formData.ad_description}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-sm leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Target Landing URL or WhatsApp Link *
                    </label>
                    <div className="relative">
                      <LuLink className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
                      <input
                        required
                        type="text"
                        name="target_link"
                        placeholder="e.g. wa.me/94724478148 or https://yourbrand.com/deal"
                        value={formData.target_link}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-sm"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Students will be directed here upon tapping your ad</p>
                  </div>

                  {/* Campus Audience Dropdown */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Target Campus / University Audience
                      </label>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                        Smart Rotation Included
                      </span>
                    </div>
                    <div className="relative">
                      <LuGraduationCap className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
                      <select
                        name="target_campus"
                        value={formData.target_campus}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-10 py-3 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-sm cursor-pointer appearance-none"
                      >
                        <option value="All Campuses (Island-wide)">🌐 All Universities Across Sri Lanka (Maximum Reach)</option>
                        <option value="University of Moratuwa (UOM)">🏛️ University of Moratuwa (UOM)</option>
                        <option value="University of Colombo (UOC)">🏛️ University of Colombo (UOC)</option>
                        <option value="University of Sri Jayewardenepura (USJ)">🏛️ University of Sri Jayewardenepura (USJ)</option>
                        <option value="SLIIT (Malabe / Metro)">🏢 SLIIT (Malabe / Metro)</option>
                        <option value="NSBM Green University">🌿 NSBM Green University</option>
                        <option value="University of Kelaniya (UOK)">🏛️ University of Kelaniya (UOK)</option>
                        <option value="University of Peradeniya (UOP)">🏛️ University of Peradeniya (UOP)</option>
                        <option value="IIT - Informatics Institute of Technology">💻 IIT Campus (Informatics)</option>
                        <option value="General Sir John Kotelawala Defence University (KDU)">🎖️ KDU Campus</option>
                      </select>
                      <div className="absolute right-4 top-4 pointer-events-none text-slate-400 text-xs">▼</div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                      Your campaign receives a 3x affinity boost for students browsing from this selected university.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* STEP 3: Banner Creative Artwork Upload */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-cyan-500/20 text-sm">
                      3
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">
                        Ad Artwork & Graphic Upload *
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Upload high-resolution creative banner (PNG, JPG, WebP up to 8MB)
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    <LuImage className="w-3.5 h-3.5 text-blue-500" /> {currentPackage.specs.split(' ')[0]}
                  </div>
                </div>

                {!imagePreview ? (
                  <label className="group relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/60 dark:bg-slate-950/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                      <LuUpload />
                    </div>
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                      Click or Drag & Drop Banner Artwork
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 max-w-sm">
                      Recommended dimension: <span className="font-bold text-blue-600 dark:text-blue-400">{currentPackage.specs}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 font-bold">PNG</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 font-bold">JPG</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 font-bold">WEBP</span>
                      <span>Max 8MB</span>
                    </div>
                  </label>
                ) : (
                  <div className="relative rounded-3xl overflow-hidden border-2 border-blue-500/60 bg-slate-950 shadow-2xl group">
                    <img src={imagePreview} alt="Ad Artwork Preview" className="w-full max-h-72 object-contain mx-auto py-2" />
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <label className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg transition-all backdrop-blur-md">
                        Change File
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg font-bold text-xs transition-all cursor-pointer"
                        title="Remove image"
                      >
                        <LuTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between px-4 text-xs font-bold text-slate-300">
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <LuCheck className="w-4 h-4" /> Ready for Live Serving
                      </span>
                      <span className="text-slate-400 truncate max-w-xs">{imageFile?.name}</span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* STEP 4: Placements & Duration */}
              {!selectedTier && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-purple-500/20 text-sm">
                        4
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">
                          Select Placement Format
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Choose where you want your ad served
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/advertise#pricing')}
                      className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline uppercase"
                    >
                      View Bundled Packs →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {placementOptions.map((option) => {
                      const isSelected = formData.placement_type === option.id;
                      return (
                        <div
                          key={option.id}
                          onClick={() => setFormData(prev => ({ ...prev, placement_type: option.id }))}
                          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${isSelected
                              ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-lg shadow-blue-500/10'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 hover:border-slate-300'
                            }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                                {option.badge}
                              </span>
                              <h4 className="text-base font-black text-slate-900 dark:text-white uppercase mt-0.5">{option.title}</h4>
                            </div>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-transparent'
                              }`}>
                              ✓
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">{option.desc}</p>
                          <div className="mt-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-200/50 dark:border-slate-800 pt-2 flex justify-between">
                            <span>{option.specs}</span>
                            <span className="text-blue-600 dark:text-blue-400 font-black">LKR {option.rate}/day</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 5 / Duration: Campaign Runtime Selection */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-6"
              >
                <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/20 text-sm">
                    {selectedTier ? 4 : 5}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">
                      Campaign Duration
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      How long should this advertisement campaign remain active?
                    </p>
                  </div>
                </div>

                {selectedTier ? (
                  <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-cyan-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                        Bundled Deal Duration
                      </span>
                      <p className="text-base font-black text-slate-900 dark:text-white mt-1">
                        {currentPackage.durationText} Included with {selectedTier}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Standard campaign runtime bundled into this flat-rate package.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedTier(null)}
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 border border-slate-700"
                    >
                      Switch to Custom Days
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {[
                      { days: '7', label: '7 Days', desc: 'Short Blast', badge: null },
                      { days: '14', label: '14 Days', desc: 'Popular Choice', badge: 'Popular' },
                      { days: '21', label: '21 Days', desc: 'Extended Deal', badge: null },
                      { days: '30', label: '30 Days', desc: '1 Full Month', badge: '10% OFF' }
                    ].map((item) => {
                      const isSelected = formData.duration_days === item.days;
                      return (
                        <button
                          key={item.days}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, duration_days: item.days }))}
                          className={`relative p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col justify-between ${isSelected
                              ? 'border-blue-600 bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/25 scale-[1.02]'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                        >
                          {item.badge && (
                            <span className={`absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-blue-600 text-white'
                              }`}>
                              {item.badge}
                            </span>
                          )}
                          <div className="text-base sm:text-lg font-black uppercase tracking-wide">{item.label}</div>
                          <div className={`text-[11px] font-bold mt-1 ${isSelected ? 'text-white/85' : 'text-slate-400'}`}>
                            {item.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>

            </div>

            {/* Right Column: Sticky Live Preview & Order Summary (4 or 5 cols) */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">

              {/* Real-time Interactive Ad Preview Card */}
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <LuEye className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Live Student Preview
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    Student Feed View
                  </span>
                </div>

                {/* Simulated Student Feed Mockup Card */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden shadow-sm">
                  {/* Banner Creative Display */}
                  <div className="relative aspect-[16/8] bg-slate-800 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Mock Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4 space-y-2">
                        <LuImage className="w-8 h-8 text-slate-500 mx-auto opacity-40 animate-pulse" />
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Artwork will render here
                        </p>
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-sm border border-white/20">
                      Sponsored
                    </span>
                    {formData.target_campus !== 'All Campuses (Island-wide)' && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-blue-600/90 text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-sm">
                        {formData.target_campus.split(' ')[0]}
                      </span>
                    )}
                  </div>

                  {/* Content snippet */}
                  <div className="p-4 space-y-2">
                    <p className="text-[10px] font-black uppercase text-blue-600 dark:text-cyan-400 tracking-wider">
                      {formData.company_name || 'Your Brand Name'}
                    </p>
                    <h5 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">
                      {formData.ad_title || 'Your Eye-Catching Campaign Headline Here'}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {formData.ad_description || 'Brief description highlighting student deals, intake dates, eligibility, or promotional vouchers...'}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
                      <span className="text-slate-400 font-medium truncate max-w-[140px]">
                        {formData.target_link ? formData.target_link.replace(/^https?:\/\//, '') : 'yourwebsite.com'}
                      </span>
                      <span className="inline-flex items-center gap-1 font-black text-blue-600 dark:text-blue-400 uppercase text-[10px]">
                        Open Link <LuExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order & Package Summary Card */}
              <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-2 border-blue-500 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between border-b border-slate-800 pb-4 relative z-10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/30">
                      {currentPackage.badge}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mt-1.5">
                      {currentPackage.name}
                    </h4>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-emerald-400 whitespace-nowrap">
                      {currentPackage.priceText}
                    </p>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">
                      / {currentPackage.durationText}
                    </p>
                  </div>
                </div>

                {/* Key Deliverables */}
                <div className="space-y-3 relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Included Benefits & Guarantees:
                  </p>
                  <ul className="space-y-2.5 text-xs font-medium">
                    <li className="flex items-center gap-2.5 text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">✓</div>
                      <span><strong>{currentPackage.reachText}</strong> across university network</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                        <LuClock className="w-3 h-3" />
                      </div>
                      <span>Express 2–4h verification & live activation</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                        <LuZap className="w-3 h-3" />
                      </div>
                      <span>WhatsApp direct lead routing enabled</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                        <LuGraduationCap className="w-3 h-3" />
                      </div>
                      <span className="truncate">Campus: {formData.target_campus.split(' ')[0]}</span>
                    </li>
                  </ul>
                </div>

                {/* Submit Action */}
                <div className="space-y-3 pt-2 relative z-10">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-indigo-500 active:scale-95 disabled:opacity-50 text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Submitting Campaign...</span>
                    ) : (
                      <>
                        <LuMegaphone className="w-5 h-5" /> Launch Campaign Now
                      </>
                    )}
                  </button>

                  {selectedTier && (
                    <button
                      type="button"
                      onClick={() => setSelectedTier(null)}
                      className="w-full py-2 text-center text-xs text-slate-400 hover:text-white font-bold transition-colors cursor-pointer"
                    >
                      Switch to Custom Placement Mode
                    </button>
                  )}

                  <p className="text-center text-[11px] text-slate-400 font-medium">
                    🔒 No payment required now. Our desk verifies your artwork and sends payment instructions upon approval.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
