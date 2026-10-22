import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  X, 
  Briefcase, 
  User2, 
  Lock, 
  Sparkles,
  Info
} from 'lucide-react';
import { cx, Logo, Card, PrimaryButton, GhostButton } from '../components/ui/ProposalPrimitives';
import { proposalApi } from '../api/proposalApi';
import { celebrate } from '../../../utils/celebrate';
import toast from 'react-hot-toast';

const ONBOARDING_STEPS = [
  "Personal & Identity", 
  "Profession & Education", 
  "Photos & Privacy"
];

const SRI_LANKA_DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", 
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", 
  "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee", 
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", 
  "Moneragala", "Ratnapura", "Kegalle"
];

export default function ProposalOnboardingPage({
  dark,
  onComplete,
  onBack
}: {
  dark: boolean;
  onComplete: () => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const last = step === ONBOARDING_STEPS.length - 1;

  // Streamlined Form State matching V1 MVP specs
  const [formData, setFormData] = useState({
    // Step 1: Personal & Residency
    accountCreatedBy: 'Self (මා විසින්ම)',
    name: '',
    age: '26',
    gender: 'Male',
    civil_status: 'Never Married (අවිවාහක)',
    height: '5.5 ft',
    religion: 'Buddhist',
    country: 'Sri Lanka',
    district: 'Colombo',
    hometown: '',
    whatsapp_number: '',

    // Step 2: Profession & Background
    categoryBadge: 'Campus Graduate 🎓',
    profession: '',
    workplace: '',
    university: '',
    educationCategory: 'University Degree',
    bio: '',
    prompt_ideal_partner: '',

    // Step 3: Photos & Privacy
    blurPhoto: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [images, setImages] = useState<(string | null)[]>([null, null, null, null]);

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  return (
    <div className="w-full flex flex-col py-6">
      <header className="max-w-3xl w-full mx-auto flex items-center justify-between mb-8 px-4 sm:px-0">
        <button onClick={onBack} className="hover:opacity-80 transition-opacity cursor-pointer">
          <Logo />
        </button>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
          Step {step + 1} of {ONBOARDING_STEPS.length}
        </span>
      </header>

      {/* Stepper Bar */}
      <div className="max-w-3xl w-full mx-auto mb-10 px-4 sm:px-0">
        <div className="flex items-start gap-2">
          {ONBOARDING_STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col gap-2 min-w-0">
              <div
                className={cx(
                  "h-2 w-full rounded-full transition-all duration-500",
                  i < step
                    ? "bg-rose-500"
                    : i === step
                      ? "bg-gradient-to-r from-rose-500 to-fuchsia-500 shadow-md shadow-rose-500/20"
                      : "bg-slate-200 dark:bg-slate-800"
                )}
              />
              <span className={cx(
                "text-[10px] font-bold uppercase tracking-wider transition-colors truncate",
                i <= step ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-600"
              )}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-3xl w-full mx-auto flex-1 px-4 sm:px-0">
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (last) {
            const validImages = images.filter(Boolean);
            if (validImages.length === 0) {
              toast.error("කරුණාකර ඔබගේ අවම වශයෙන් එක් ඡායාරූපයක්වත් (At least 1 Photo) Upload කරන්න.");
              return;
            }
            setLoading(true);
            try {
              const payload = {
                ...formData,
                managed_by: formData.accountCreatedBy,
                managedBy: formData.accountCreatedBy,
                accountCreatedBy: formData.accountCreatedBy,
                account_created_by: formData.accountCreatedBy,
                age: parseInt(formData.age) || 26,
                gender: formData.gender,
                looking_for: formData.gender === 'Male' ? 'Female' : 'Male',
                prompt_about_me: formData.bio,
                prompt_ideal_partner: formData.prompt_ideal_partner,
                images: validImages,
                blur_photo: formData.blurPhoto,
                blurPhoto: formData.blurPhoto
              };
              await proposalApi.submitProfile(payload);
              celebrate();
              onComplete();
            } catch (error) {
              console.error(error);
              toast.error("Failed to submit profile. Please try again.");
            } finally {
              setLoading(false);
            }
          } else {
            setStep((s) => s + 1);
          }
        }}>
          <Card className="p-6 sm:p-10 shadow-2xl shadow-rose-500/5 rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                {step === 0 && <User2 className="text-rose-500 shrink-0" />}
                {step === 1 && <Briefcase className="text-indigo-500 shrink-0" />}
                {step === 2 && <Lock className="text-emerald-500 shrink-0" />}
                {ONBOARDING_STEPS[step]}
              </h2>
            </div>

            <p className="text-xs sm:text-sm font-medium mb-8 text-slate-500 dark:text-slate-400">
              {step === 0 && "Enter your basic personal & residency details (මූලික තොරතුරු)"}
              {step === 1 && "What is your profession, education, or career background? (රැකියාව සහ අධ්‍යාපනය)"}
              {step === 2 && "Add your photographs & configure photo blur protection (ඡායාරූප සහ ආරක්ෂාව)"}
            </p>

            <div className="min-h-[300px]">
              
              {/* STEP 1: Personal & Residency */}
              {step === 0 && (
                <div className="space-y-6 animate-fade-up">
                  <div className="bg-rose-500/5 p-4 rounded-2xl border border-rose-500/20 text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <Info size={16} className="text-rose-500 shrink-0" />
                    <span>Your contact details and phone number remain 100% private.</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        Account Created By (ගිණුම සාදනු ලබන්නේ) *
                      </label>
                      <select 
                        name="accountCreatedBy" 
                        value={formData.accountCreatedBy} 
                        onChange={handleChange} 
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                      >
                        <option value="Self (මා විසින්ම)">👤 Self (මා විසින්ම)</option>
                        <option value="Parents (දෙමව්පියන් විසින්)">👨‍👩‍👧 Parents (දෙමව්පියන් විසින්)</option>
                        <option value="Sibling (සහෝදරයා/සහෝදරිය)">👫 Sibling (සහෝදරයා/සහෝදරිය)</option>
                        <option value="Relative / Guardian (ඥාතියෙකු/භාරකරුවෙකු)">🤝 Relative / Guardian (ඥාතියෙකු/භාරකරුවෙකු)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Full Name (නම) *</label>
                      <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. Kasun Perera" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Age (වයස) *</label>
                      <input required type="number" min="18" max="75" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. 26" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Gender (ස්ත්‍රී/පුරුෂ) *</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        <option value="Male">Male (මනාලයෙක් / පිරිමි)</option>
                        <option value="Female">Female (මනාලියක් / ගැහැණු)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Civil Status (සිවිල් තත්වය)</label>
                      <select name="civil_status" value={formData.civil_status} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        <option value="Never Married (අවිවාහක)">Never Married (අවිවාහක)</option>
                        <option value="Divorced (දික්කසාද)">Divorced (දික්කසාද)</option>
                        <option value="Widowed (වැන්දඹු)">Widowed (වැන්දඹු)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Height (උස)</label>
                      <select name="height" value={formData.height} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        {["4.8 ft", "4.9 ft", "5.0 ft", "5.1 ft", "5.2 ft", "5.3 ft", "5.4 ft", "5.5 ft", "5.6 ft", "5.7 ft", "5.8 ft", "5.9 ft", "6.0 ft", "6.1 ft+"].map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Religion (ආගම)</label>
                      <select name="religion" value={formData.religion} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        {["Buddhist", "Hindu", "Muslim", "Catholic", "Christian", "Other"].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Residency Country (පදිංචි රට) *</label>
                      <select name="country" value={formData.country} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        {["Sri Lanka", "UAE / Dubai", "United Kingdom", "Italy", "Australia", "New Zealand", "South Korea", "Japan", "Canada", "USA", "Other Country"].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Living District / Area (පදිංචි දිස්ත්‍රික්කය) *</label>
                      <select name="district" value={formData.district} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Hometown / City (උපන් ගම / නගරය) *</label>
                      <input 
                        required
                        name="hometown" 
                        value={formData.hometown} 
                        onChange={handleChange} 
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" 
                        placeholder="e.g. Maharagama, Alawwa, Kandy" 
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        Contact / WhatsApp Number (සම්බන්ධ කරගත හැකි අංකය) *
                      </label>
                      <input 
                        required 
                        name="whatsapp_number" 
                        value={formData.whatsapp_number} 
                        onChange={handleChange} 
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" 
                        placeholder="e.g. 077 123 4567 (Strictly Private - Never shown on public profile)" 
                      />
                      <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 font-medium">
                        🔒 මෙම අංකය ඔබ Proposal එකක් Accept කරන තෙක් කිසිම අයෙකුට නොපෙනේ.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Profession & Background */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-up">
                  {/* Category Selection Pills */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      Official Profile Category (ඔබගේ නිල කාණ්ඩය) *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'Campus Graduate 🎓', label: '🎓 Campus Graduate', desc: 'Graduated / Degree Alumni' },
                        { id: 'Campus Undergrad 🏛️', label: '🏛️ Campus Student', desc: 'Current Undergraduate' },
                        { id: 'Higher Edu Verified 📜', label: '📜 Higher Edu', desc: 'Diploma / CIMA / NVQ / Course' },
                        { id: 'Working Professional 💼 / Abroad ✈️', label: '💼 Working / Abroad', desc: 'Job / Business / Overseas' }
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, categoryBadge: item.id }))}
                          className={cx(
                            "p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-center",
                            formData.categoryBadge === item.id
                              ? "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold shadow-sm ring-1 ring-rose-500/30"
                              : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                          )}
                        >
                          <span className="text-xs font-black">{item.label}</span>
                          <span className="text-[10px] opacity-70 mt-0.5">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Profession / Occupation (රැකියාව / වෘත්තිය) *</label>
                      <input required name="profession" value={formData.profession} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. Technician in LG / Software Engineer / Nursing / Banking / Business" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Workplace / Company (සේවා ස්ථානය / ආයතනය) *</label>
                      <input required name="workplace" value={formData.workplace} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. Abans / Private Firm / Govt / Dubai Mall" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">University / Campus (කැම්පස් එක / ආයතනය) *</label>
                      <input required name="university" value={formData.university} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. University of Moratuwa / SLIIT / NSBM" />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Highest Education / Course (අධ්‍යාපනය / හැදෑරූ පාඨමාලාව) *</label>
                      <select name="educationCategory" value={formData.educationCategory} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        <option value="University Degree">University Degree (උපාධිධාරී)</option>
                        <option value="Undergraduate">Campus Undergraduate (විශ්වවිද්‍යාල ශිෂ්‍ය)</option>
                        <option value="Diploma / NVQ / Vocational">Diploma / NVQ / Course (ඩිප්ලෝමා / වෘත්තීය පාඨමාලා)</option>
                        <option value="A/L / School Education">G.C.E. A/L (උසස් පෙළ)</option>
                        <option value="Other">Other / Self-made</option>
                      </select>
                    </div>

                    {/* Box 1: About Me */}
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <User2 size={14} className="text-rose-500" />
                        <span>මා පිළිබඳ හැඳින්වීමක් (About Me / Bio) *</span>
                      </label>
                      <textarea 
                        required
                        minLength={10}
                        name="bio" 
                        value={formData.bio} 
                        onChange={handleChange} 
                        rows={2} 
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" 
                        placeholder="e.g. අවංක, සරල ජීවන රටාවකට ප්‍රිය කරන විශ්වවිද්‍යාල උපාධිධාරියෙක්මි..." 
                      />
                    </div>

                    {/* Box 2: What I'm Looking For / Ideal Partner */}
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-rose-500" />
                        <span>හොයන සහකරු / සහකාරිය පිළිබඳව සටහනක් (Partner Preferences) *</span>
                      </label>
                      <textarea 
                        required
                        minLength={10}
                        name="prompt_ideal_partner" 
                        value={formData.prompt_ideal_partner} 
                        onChange={handleChange} 
                        rows={3} 
                        className="w-full bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" 
                        placeholder="e.g. සමාන අධ්‍යාපන සුදුසුකම් ඇති, යහපත් ගුණධර්ම සහිත ගුණගරුක සහකාරියක් බලාපොරොත්තු වෙමි..." 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Photos & Privacy */}
              {step === 2 && (
                <div className="animate-fade-up space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Upload Profile Photos (up to 4 images)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {images.map((img, i) => (
                        img ? (
                          <div key={i} className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md group border border-slate-200 dark:border-slate-800">
                            <img src={img} alt={`Upload ${i}`} className="w-full h-full object-cover" />
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
                            <Upload size={24} strokeWidth={2.5} />
                          </label>
                        )
                      ))}
                    </div>
                  </div>

                  {/* Photo Blurring Toggle UI */}
                  <div className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-4 shadow-sm">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                        <Lock size={16} className="text-rose-500" /> Photo Privacy Protection (Blur Photo)
                      </h4>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                        Keep photos blurred for general viewers. Photos will only unlock after you accept a proposal request.
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
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
              <GhostButton
                type="button"
                dark={dark}
                icon={ArrowLeft}
                onClick={() => (step === 0 ? onBack() : setStep((s) => s - 1))}
              >
                {step === 0 ? "Cancel" : "Back"}
              </GhostButton>

              <PrimaryButton
                type="submit"
                icon={last ? CheckCircle2 : ArrowRight}
                disabled={loading}
                className="shadow-xl shadow-rose-500/20"
              >
                {loading ? "Submitting..." : (last ? "Complete Proposal Profile" : "Continue")}
              </PrimaryButton>
            </div>
          </Card>
        </form>
      </main>
    </div>
  );
}
