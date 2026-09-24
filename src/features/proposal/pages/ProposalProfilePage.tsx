import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Camera, 
  User2, 
  GraduationCap, 
  Users, 
  Heart, 
  Save, 
  Lock, 
  Upload, 
  X,
  Sparkles,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { PrimaryButton, Card, cx } from '../components/ui/ProposalPrimitives';
import { proposalApi } from '../api/proposalApi';

const SRI_LANKA_DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", 
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", 
  "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee", 
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", 
  "Moneragala", "Ratnapura", "Kegalle"
];

export default function ProposalProfilePage({ setPage }: { setPage: (p: string) => void }) {
  const [activeTab, setActiveTab] = useState<'photos' | 'basic' | 'education' | 'family' | 'expectations'>('photos');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Comprehensive Profile Form State matching Onboarding & Proposal details
  const [formData, setFormData] = useState({
    // 1. Basic & Residency
    name: '',
    age: '27',
    gender: 'Male',
    civilStatus: 'Never Married (අවිවාහක)',
    height: '5.4 ft',
    ethnicity: 'Sinhalese',
    religion: 'Buddhist',
    caste: 'Govigama',
    country: 'Sri Lanka',
    district: 'Colombo',
    hometown: 'Colombo 1',

    // 2. Education & Career
    educationCategory: 'University',
    university: '',
    faculty: '',
    educationStatus: 'Graduate',
    educationGoal: 'Bachelor Degree',
    profession: '',
    workplace: '',
    monthlyIncome: 'Rs 200,000 - Rs 300,000',

    // 3. Family Information
    fatherEthnicity: 'Sinhalese',
    fatherReligion: 'Buddhist',
    fatherProfession: 'Businessman',
    fatherStatus: 'Active / Retired',
    motherEthnicity: 'Sinhalese',
    motherReligion: 'Buddhist',
    motherProfession: 'Teacher / Housewife',
    motherCountry: 'Sri Lanka',
    siblings: '1 Brother, 1 Sister (Respectable Family)',

    // 4. Mindset & Sri Lankan Prompts
    past_affairs_openness: 'Open to partners with past affairs',
    social_drinking_level: 'Non-drinker',
    smokingStatus: 'Non-smoker',
    dietaryPreference: 'Non-Vegetarian',
    prompt_about_me: '',
    prompt_ideal_partner: '',
    blurPhoto: true
  });

  const [images, setImages] = useState<(string | null)[]>([null, null, null, null]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        let profileData: any = null;

        // 1. Try local storage cache first
        const savedRaw = localStorage.getItem('userProposalProfile');
        if (savedRaw) {
          try { profileData = JSON.parse(savedRaw); } catch (e) {}
        }

        // 2. Try API call
        try {
          const res = await proposalApi.getMyProfile();
          if (res.success && res.profile) {
            profileData = { ...profileData, ...res.profile };
          }
        } catch (e) {
          console.warn('API getMyProfile offline/fallback:', e);
        }

        if (profileData) {
          setFormData((prev) => ({
            ...prev,
            ...profileData,
            age: String(profileData.age || '27')
          }));

          if (profileData.images && Array.isArray(profileData.images)) {
            const loadedImgs = [...profileData.images];
            while (loadedImgs.length < 4) loadedImgs.push(null);
            setImages(loadedImgs.slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Error populating edit profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        const newImages = [...images];
        newImages[index] = compressedBase64;
        setImages(newImages);
      } catch (err) {
        console.error('Image compression failed', err);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const validImages = images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0);
      const payload = {
        ...formData,
        age: parseInt(formData.age) || 27,
        images: validImages,
        blurPhoto: formData.blurPhoto
      };

      await proposalApi.submitProfile(payload);
      localStorage.setItem('userProposalProfile', JSON.stringify(payload));
      localStorage.setItem('userHasProposalProfile', 'true');

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Error saving profile changes. Local profile was updated.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-slate-500 font-bold">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span>Loading Bio-data Profile...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans min-h-[calc(100vh-80px)]">
      {/* Sticky Header Bar */}
      <div className="flex items-center justify-between mb-8 sticky top-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-md z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setPage('dashboard')} 
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer"
            title="Back to Dashboard"
          >
            <ChevronLeft size={20} className="text-slate-700 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Edit Proposal Bio-Data</h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Update your proposal attributes & privacy settings anytime</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 animate-fade-in">
              <CheckCircle2 size={14} /> Saved Successfully!
            </span>
          )}
          <button
            onClick={() => setPage('settings')}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Account Privacy & Verification Settings"
          >
            <Settings size={18} />
          </button>
          <PrimaryButton small icon={Save} onClick={handleSave} disabled={saving} className="shadow-lg shadow-rose-500/20">
            {saving ? 'Saving...' : 'Save Profile'}
          </PrimaryButton>
        </div>
      </div>

      {/* Main Form Container */}
      <Card className="overflow-hidden shadow-2xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50 p-2 gap-2">
          {[
            { id: 'photos', label: 'Photos & Privacy', icon: Camera },
            { id: 'basic', label: 'Basic Info', icon: User2 },
            { id: 'education', label: 'Education & Career', icon: GraduationCap },
            { id: 'family', label: 'Family Details', icon: Users },
            { id: 'expectations', label: 'Expectations', icon: Heart }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cx(
                "flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 whitespace-nowrap cursor-pointer relative",
                activeTab === tab.id 
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/25 scale-[1.02]" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
              )}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-10 bg-white dark:bg-slate-900">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: Photos & Privacy */}
            {activeTab === 'photos' && (
              <motion.div key="photos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-1">Profile Photo Gallery</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">The 1st photo uploaded is your main proposal avatar. You can upload up to 4 images.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img, i) => (
                    img ? (
                      <div key={i} className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md group border border-slate-200 dark:border-slate-800">
                        <img src={img} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                        {i === 0 && (
                          <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                            Main Photo #1
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-2 right-2 w-7 h-7 bg-slate-950/70 hover:bg-rose-500 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors cursor-pointer opacity-90 group-hover:opacity-100"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                      </div>
                    ) : (
                      <label
                        key={i}
                        className="aspect-[4/5] rounded-2xl grid place-items-center border-2 border-dashed transition-colors cursor-pointer bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400 hover:border-rose-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                      >
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(i, e)} />
                        <div className="flex flex-col items-center gap-1.5 p-3 text-center">
                          <Upload size={22} strokeWidth={2.5} />
                          <span className="text-[11px] font-bold">Add Photo #{i + 1}</span>
                        </div>
                      </label>
                    )
                  ))}
                </div>

                {/* Photo Blurring Privacy Control */}
                <div className="mt-8 p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-4 shadow-sm">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                      <Lock size={16} className="text-rose-500" /> Privacy Photo Protection
                    </h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                      Keep photos blurred for public view until mutual proposal request acceptance.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.blurPhoto} 
                      onChange={(e) => setFormData(prev => ({ ...prev, blurPhoto: e.target.checked }))} 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 dark:peer-focus:ring-rose-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-rose-500"></div>
                  </label>
                </div>
              </motion.div>
            )}

            {/* TAB 2: Basic & Residency */}
            {activeTab === 'basic' && (
              <motion.div key="basic" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-1">Basic Profile & Residency</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Personal bio-data attributes for matching algorithm</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Full Name (සම්පූර්ණ නම)</label>
                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Age (වයස)</label>
                    <input required type="number" min="18" max="75" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Gender (ස්ත්‍රී/පුරුෂ)</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                      <option value="Male">Male (පුරුෂ)</option>
                      <option value="Female">Female (ස්ත්‍රී)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Civil Status (සිවිල් තත්වය)</label>
                    <select name="civilStatus" value={formData.civilStatus} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                      <option value="Never Married (අවිවාහක)">Never Married (අවිවාහක)</option>
                      <option value="Divorced (දික්කසාද)">Divorced (දික්කසාද)</option>
                      <option value="Widowed (වැන්දඹු)">Widowed (වැන්දඹු)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Height (උස)</label>
                    <select name="height" value={formData.height} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                      {["4.8 ft", "4.9 ft", "5.0 ft", "5.1 ft", "5.2 ft", "5.3 ft", "5.4 ft", "5.5 ft", "5.6 ft", "5.7 ft", "5.8 ft", "5.9 ft", "6.0 ft", "6.1 ft+"].map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Ethnicity (ජාතිය)</label>
                    <select name="ethnicity" value={formData.ethnicity} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                      {["Sinhalese", "Tamil", "Moor", "Burgher", "Other"].map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Religion (ආගම)</label>
                    <select name="religion" value={formData.religion} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                      {["Buddhist", "Hindu", "Muslim", "Catholic", "Christian", "Other"].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Caste (කුලය)</label>
                    <select name="caste" value={formData.caste} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                      {["Govigama", "Karawa", "Durawa", "Salagama", "Vishwakarma", "Other / Not Specified"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Residency Country (රට)</label>
                    <select name="country" value={formData.country} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                      {["Sri Lanka", "Australia", "United Kingdom", "USA", "Canada", "New Zealand", "UAE / Gulf", "Other Overseas"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Current Living District (දැනට පදිංචි දිස්ත්‍රික්කය)</label>
                    <select name="district" value={formData.district} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                      {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Hometown / Native Area (ගම / මුල් ගම)</label>
                    <input required name="hometown" value={formData.hometown} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: Education & Career */}
            {activeTab === 'education' && (
              <motion.div key="education" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-1">Education & Current Career</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Qualifications, university background, and career level</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 block font-sans">
                      Profile Category Badge (ප්‍රධාන පසුබිම් කාණ්ඩය)
                    </label>
                    <select
                      name="educationCategory"
                      value={formData.educationCategory}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 font-sans font-bold"
                    >
                      <option value="University">Campus Graduate / University Student</option>
                      <option value="Professional Qualification">Working Professional / Technical Specialist</option>
                      <option value="General / Business">Business Enterprise / Entrepreneur & General</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">University / Institute Name (විශ්වවිද්‍යාලය)</label>
                    <input name="university" value={formData.university} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. University of Moratuwa / CIMA" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Faculty / Field (පීඨය)</label>
                    <input name="faculty" value={formData.faculty} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. Engineering / Science" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Highest Education Goal (අධ්‍යාපන මට්ටම)</label>
                    <select name="educationGoal" value={formData.educationGoal} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                      <option value="University Degree">University Degree (උපාධිය)</option>
                      <option value="Undergraduate">Undergraduate (විශ්වවිද්‍යාල ශිෂ්‍ය)</option>
                      <option value="Master's / Postgraduate">Master's / Postgraduate (පශ්චාත් උපාධිය)</option>
                      <option value="Professional Qualification / Diploma">Professional Qualification / Diploma</option>
                      <option value="G.C.E. Advanced Level - A/L">G.C.E. Advanced Level - A/L</option>
                      <option value="Business Owner / Self-Employed">Business Owner / Self-Employed</option>
                      <option value="Other / General">Other / General</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Profession / Designation (රැකියාව / ව්‍යාපාරය)</label>
                    <input required name="profession" value={formData.profession} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. Software Engineer / Accountant / Doctor" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Workplace / Company (ආයතනය)</label>
                    <input name="workplace" value={formData.workplace} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. Tech Corp / Govt Ministry" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Monthly Income Range (මාසික ආදායම)</label>
                    <select name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                      <option value="Under Rs 100,000">Under Rs 100,000</option>
                      <option value="Rs 100,000 - Rs 200,000">Rs 100,000 - Rs 200,000</option>
                      <option value="Rs 200,000 - Rs 300,000">Rs 200,000 - Rs 300,000</option>
                      <option value="Rs 300,000 - Rs 500,000">Rs 300,000 - Rs 500,000</option>
                      <option value="Rs 500,000+">Rs 500,000+</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: Family Details */}
            {activeTab === 'family' && (
              <motion.div key="family" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-1">Family Bio-Data Details</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Parents ethnicity, religion, status, and siblings overview</p>
                </div>

                {/* Father */}
                <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20">
                  <h4 className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 mb-3">Father's Information (පියාගේ විස්තර)</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Father's Ethnicity</label>
                      <select name="fatherEthnicity" value={formData.fatherEthnicity} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs">
                        {["Sinhalese", "Tamil", "Moor", "Burgher", "Other"].map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Father's Religion</label>
                      <select name="fatherReligion" value={formData.fatherReligion} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs">
                        {["Buddhist", "Hindu", "Muslim", "Catholic", "Christian", "Other"].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Father's Profession</label>
                      <input name="fatherProfession" value={formData.fatherProfession} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Father's Status</label>
                      <select name="fatherStatus" value={formData.fatherStatus} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs">
                        <option value="Active / Employed">Active / Employed</option>
                        <option value="Retired">Retired</option>
                        <option value="Deceased">Deceased</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Mother */}
                <div className="bg-pink-500/5 p-4 rounded-2xl border border-pink-500/20">
                  <h4 className="text-xs font-black uppercase text-pink-600 dark:text-pink-400 mb-3">Mother's Information (මවගේ විස්තර)</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Mother's Ethnicity</label>
                      <select name="motherEthnicity" value={formData.motherEthnicity} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs">
                        {["Sinhalese", "Tamil", "Moor", "Burgher", "Other"].map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Mother's Religion</label>
                      <select name="motherReligion" value={formData.motherReligion} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs">
                        {["Buddhist", "Hindu", "Muslim", "Catholic", "Christian", "Other"].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Mother's Profession</label>
                      <input name="motherProfession" value={formData.motherProfession} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Mother's Country</label>
                      <select name="motherCountry" value={formData.motherCountry} onChange={handleChange} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs">
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="Overseas">Overseas</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Siblings & Family Status (සහෝදර සහෝදරියන්ගේ විස්තර)</label>
                  <input required name="siblings" value={formData.siblings} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm" />
                </div>
              </motion.div>
            )}

            {/* TAB 5: Mindset & Expectations */}
            {activeTab === 'expectations' && (
              <motion.div key="expectations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-1">Mindset & Partner Expectations</h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Lifestyle preferences, about me statement, and ideal partner criteria</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Dietary Preference</label>
                    <select name="dietaryPreference" value={formData.dietaryPreference} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-xs">
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Halal">Halal</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Past Affairs Openness</label>
                    <select name="past_affairs_openness" value={formData.past_affairs_openness} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-xs">
                      <option value="Open to partners with past affairs">Open to partners with past affairs</option>
                      <option value="Never had affairs before">Never had affairs before</option>
                      <option value="First relationship preferred">First relationship preferred</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Drinking Lifestyle</label>
                    <select name="social_drinking_level" value={formData.social_drinking_level} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-xs">
                      <option value="Non-drinker">Non-drinker</option>
                      <option value="Social/Occasional Drinker">Social/Occasional Drinker</option>
                      <option value="Regular Drinker">Regular Drinker</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Smoking Lifestyle</label>
                    <select name="smokingStatus" value={formData.smokingStatus} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-xs">
                      <option value="Non-smoker">Non-smoker</option>
                      <option value="Social/Occasional Smoker">Social/Occasional Smoker</option>
                      <option value="Regular Smoker">Regular Smoker</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <User2 size={14} /> About Candidate (මං ගැන වචන කිහිපයකින්...)
                    </label>
                    <textarea required name="prompt_about_me" value={formData.prompt_about_me} onChange={handleChange} rows={3} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Sparkles size={14} /> Partner Preference (සහකරු / සහකාරිය පිළිබඳ අපේක්ෂා)
                    </label>
                    <textarea required name="prompt_ideal_partner" value={formData.prompt_ideal_partner} onChange={handleChange} rows={3} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 font-sinhala" />
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
