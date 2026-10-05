import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  LuBuilding, LuMail, LuPhone, LuHeading,
  LuLink, LuImage, LuCalendar, LuMegaphone,
  LuUpload, LuTrash2, LuSparkles, LuLayers, LuShieldCheck
} from 'react-icons/lu';
import { api } from '../../api';
import toast from 'react-hot-toast';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
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
    duration_days: '14'
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isLoggedIn = !!localStorage.getItem('userToken');

  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  useEffect(() => {
    const tier = searchParams.get('tier');
    if (tier) {
      setSelectedTier(tier);
      if (tier.includes('Starter')) {
        setFormData(prev => ({ ...prev, placement_type: 'SIDEBAR', duration_days: '7' }));
      } else if (tier.includes('Hero')) {
        setFormData(prev => ({ ...prev, placement_type: 'BANNER', duration_days: '14' }));
      } else if (tier.includes('Ultimate')) {
        setFormData(prev => ({ ...prev, placement_type: 'POPUP', duration_days: '30' }));
      }
    }

    // Pre-fill from the Reach Calculator (?placement=BANNER&days=14)
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
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'placement_type' && selectedTier) {
          if (selectedTier.includes('Starter')) {
            data.append('placement_type', 'Campus Starter (SIDEBAR)');
          } else if (selectedTier.includes('Hero')) {
            data.append('placement_type', 'Campus Hero (BANNER)');
          } else if (selectedTier.includes('Ultimate')) {
            data.append('placement_type', 'Ultimate Blast (POPUP)');
          } else {
            data.append('placement_type', `${selectedTier} (${value})`);
          }
        } else {
          data.append(key, value);
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
      specs: '1200 x 400 px'
    },
    {
      id: 'SIDEBAR',
      title: 'Sticky Sidebar',
      desc: 'Persistent widget that stays in view while students scroll.',
      badge: 'Continuous Exposure',
      specs: '300 x 300 px'
    },
    {
      id: 'NATIVE_FEED',
      title: 'Native Feed Card',
      desc: 'In-stream card integrated directly into student feed lists.',
      badge: 'High Engagement',
      specs: '800 x 450 px'
    },
    {
      id: 'POPUP',
      title: 'Global Popup Interstitial',
      desc: 'Full-screen overlay pop-up for massive event or deal launches.',
      badge: 'Maximum Reach',
      specs: '600 x 600 px'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Launch Ad Campaign - The Uni Gang"
        description="Target 50,000+ Sri Lankan university students across 15+ campuses. Create your advertisement campaign."
      />

      <div className="max-w-4xl mx-auto space-y-6">

        {/* Navigation Breadcrumb */}
        <PageBreadcrumb
          items={[
            { label: 'Advertise', to: '/advertise' },
            { label: 'Create Campaign', active: true }
          ]}
          backTo="/advertise"
          backLabel="Back to Advertise"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-12 shadow-2xl shadow-blue-500/10"
        >
          {/* Header Banner */}
          <div className="text-center space-y-3 mb-10 pb-8 border-b border-slate-200/80 dark:border-slate-800">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest">
              {/* <LuSparkles className="w-4 h-4 animate-pulse" />  */}
              Self-Serve Ad Manager
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Launch Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Ad Campaign</span>
            </h1>

            <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Promote your institute, tech academy, food deal, or student service to 50,000+ Sri Lankan undergrads.
            </p>

            {!isLoggedIn && (
              <div className="mt-4 p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center gap-2 text-xs text-blue-800 dark:text-blue-300 font-bold">
                <LuShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Guest Submission Enabled. Our team will verify and contact your provided email / WhatsApp.</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Section 1: Business Details */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <LuBuilding className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">1. Advertiser Contact Profile</h3>
                  <p className="text-xs text-slate-500 font-medium">How should our campaign desk contact you?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Company / Institute Name *
                  </label>
                  <div className="relative">
                    <LuBuilding className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                    <input
                      required
                      name="company_name"
                      placeholder="e.g. SLIIT Academy, Pizza Hut, Codegen"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-sm"
                    />
                  </div>
                  {isLoggedIn && localStorage.getItem('userName') ? (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
                      <span>✓ Auto-filled from your account (feel free to edit for your brand)</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1.5">
                      Enter your organization, brand, or agency name
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Contact Email Address *
                  </label>
                  <div className="relative">
                    <LuMail className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                    <input
                      required
                      type="email"
                      name="contact_email"
                      placeholder="ads@company.com"
                      value={formData.contact_email}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-sm"
                    />
                  </div>
                  {isLoggedIn && localStorage.getItem('userEmail') ? (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
                      <span>✓ Auto-filled from your account</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1.5">
                      Order confirmation & invoice details will be sent here
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    WhatsApp / Contact Phone Number
                  </label>
                  <div className="relative">
                    <LuPhone className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                    <input
                      name="contact_phone"
                      placeholder="077 123 4567 or +94 72 447 8148"
                      value={formData.contact_phone}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Ad Copy Details */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <LuHeading className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">2. Campaign Copy & Landing Page</h3>
                  <p className="text-xs text-slate-500 font-medium">What message do you want students to see?</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Campaign Headline / Ad Title *
                  </label>
                  <input
                    required
                    name="ad_title"
                    placeholder="e.g. Software Engineering Degree Intake 2026 - 20% Discount for Uni Students"
                    value={formData.ad_title}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Description & Offer Details *
                  </label>
                  <textarea
                    required
                    name="ad_description"
                    rows={3}
                    placeholder="Explain your promotion, eligibility, discounts, or key student highlights..."
                    value={formData.ad_description}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Target Action Link (URL or WhatsApp)
                  </label>
                  <div className="relative">
                    <LuLink className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                    <input
                      type="url"
                      name="target_link"
                      placeholder="https://yourwebsite.com/apply or https://wa.me/94724478148"
                      value={formData.target_link}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Banner Image Upload */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  <LuImage className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">3. Ad Artwork & Banner File *</h3>
                  <p className="text-xs text-slate-500 font-medium">Upload high quality banner image (PNG/JPG, Max 8MB)</p>
                </div>
              </div>

              {!imagePreview ? (
                <label className="group relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/50 dark:bg-slate-950/50 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                    <LuUpload />
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">Click or Drag & Drop Banner Artwork</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Recommended: 1200x400 (Top Banner) or 800x450 (Feed Card)</p>
                </label>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border-2 border-blue-500/50 bg-slate-950 shadow-xl group">
                  <img src={imagePreview} alt="Ad Artwork Preview" className="w-full max-h-72 object-contain mx-auto py-2" />
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-lg font-bold text-xs uppercase flex items-center gap-1.5 transition-all"
                    >
                      <LuTrash2 className="w-4 h-4" /> Remove File
                    </button>
                  </div>
                  <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-center text-xs font-bold text-blue-400">
                    ✓ Artwork Loaded: {imageFile?.name}
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Visual Placement Format / Package Breakdown */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <LuLayers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">
                    4. {selectedTier ? 'Package Included Features & Placements' : 'Select Single Placement Format'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedTier
                      ? `Review the placements and campaign benefits bundled in your ${selectedTier} package.`
                      : 'Where do you want your campaign banner to appear?'}
                  </p>
                </div>
              </div>

              {selectedTier ? (
                /* CASE A: Package Feature Breakdown Card */
                <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-2 border-blue-500 shadow-2xl space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
                        Bundled B2B Package
                      </span>
                      <h4 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                        {selectedTier}
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-black text-emerald-400">
                        {selectedTier.includes('Starter') ? 'LKR 7,500' : selectedTier.includes('Hero') ? 'LKR 18,500' : 'LKR 35,000'}
                      </p>
                      <p className="text-xs text-slate-400 font-bold uppercase">
                        {selectedTier.includes('Starter') ? '/ 7 Days' : selectedTier.includes('Hero') ? '/ 14 Days' : '/ 30 Days'}
                      </p>
                    </div>
                  </div>

                  {/* Included Placements & Benefits */}
                  <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">🎁 Included Placements & Campaign Benefits:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
                      <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">✓</div>
                        <span>
                          {selectedTier.includes('Starter') && 'Sticky Sidebar Placement (~15,000 views)'}
                          {selectedTier.includes('Hero') && 'Top Banner + Native Feed Cards (~50,000+ views)'}
                          {selectedTier.includes('Ultimate') && 'Full Suite (Banner + Feed + Popup Interstitial)'}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">✓</div>
                        <span>Express 2–4h Priority Review & Live Activation</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">✓</div>
                        <span>Direct WhatsApp Lead Routing</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">✓</div>
                        <span>Real-time Views & Click Tracking</span>
                      </div>
                    </div>
                  </div>

                  {/* Dimension guidance note */}
                  <div className="p-4 rounded-2xl bg-blue-900/30 border border-blue-500/30 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-200">
                    <div>
                      <p className="font-bold">📐 Recommended Artwork Upload Dimension:</p>
                      <p className="text-slate-300 text-[11px] mt-0.5">
                        {selectedTier.includes('Starter') ? '300 x 300 px (Square Widget Image)' : selectedTier.includes('Hero') ? '1200 x 400 px (Landscape Header Banner)' : '600 x 600 px (Square Popup / High Impact)'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedTier(null)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[11px] uppercase transition-all shrink-0 border border-slate-700"
                    >
                      Switch to Custom Mode
                    </button>
                  </div>
                </div>
              ) : (
                /* CASE B: Custom Single Options */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
                    <p className="font-medium">💡 Single Option Custom Mode. Want bundled multi-placement discounts?</p>
                    <button
                      type="button"
                      onClick={() => navigate('/advertise#pricing')}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase shadow-sm transition-all cursor-pointer"
                    >
                      View Packages
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {placementOptions.map((option) => {
                      const isSelected = formData.placement_type === option.id;
                      return (
                        <div
                          key={option.id}
                          onClick={() => setFormData(prev => ({ ...prev, placement_type: option.id }))}
                          className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${isSelected
                              ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-slate-300 dark:hover:border-slate-700'
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
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2 leading-relaxed">{option.desc}</p>
                          <div className="mt-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-200/50 dark:border-slate-800 pt-2">
                            Dimensions: {option.specs}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Campaign Duration */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <LuCalendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">5. Campaign Duration</h3>
                  <p className="text-xs text-slate-500 font-medium">How many days should this ad run live?</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { days: '7', label: '7 Days', desc: 'Short Blast' },
                  { days: '14', label: '14 Days', desc: 'Popular Choice' },
                  { days: '21', label: '21 Days', desc: 'Extended Deal' },
                  { days: '30', label: '1 Month', desc: 'Maximum Exposure' }
                ].map((item) => {
                  const isSelected = formData.duration_days === item.days;
                  return (
                    <button
                      key={item.days}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, duration_days: item.days }))}
                      className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                    >
                      <div className="text-base font-black uppercase">{item.label}</div>
                      <div className={`text-[10px] font-bold ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-black text-lg uppercase tracking-wider rounded-2xl shadow-xl shadow-blue-600/25 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting Campaign...</span>
                ) : (
                  <>
                    <LuMegaphone className="w-6 h-6" /> Submit Campaign {selectedTier ? `(${selectedTier})` : 'Request'}
                  </>
                )}
              </button>

              <p className="text-center text-xs font-medium text-slate-500">
                🔒 Safe & Secure. Our ad desk verifies all artwork within 2-4 hours before live activation.
              </p>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}
