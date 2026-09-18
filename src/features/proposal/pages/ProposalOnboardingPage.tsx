import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  X, 
  Briefcase, 
  GraduationCap, 
  Users, 
  User2, 
  Heart, 
  Lock, 
  Sparkles,
  Info
} from 'lucide-react';
import { cx, Logo, Card, PrimaryButton, GhostButton } from '../components/ui/ProposalPrimitives';
import { proposalApi } from '../api/proposalApi';

const ONBOARDING_STEPS = [
  "Basic & Residency", 
  "Education & Career", 
  "Family Details", 
  "Expectations & Mindset", 
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

  // Comprehensive Form State matching ProposalFullProfilePage fields
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
    social_drinking_level: 'Non-drinker 🚭',
    smokingStatus: 'Non-smoker 🚭',
    dietaryPreference: 'Non-Vegetarian 🍗',
    prompt_about_me: '',
    prompt_ideal_partner: '',
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
            setLoading(true);
            try {
              const payload = {
                ...formData,
                age: parseInt(formData.age) || 27,
                lookingFor: formData.gender === 'Male' ? 'Female' : 'Male',
                images: images.filter(Boolean),
                blurPhoto: formData.blurPhoto
              };
              await proposalApi.submitProfile(payload);
              onComplete();
            } catch (error) {
              console.error(error);
              alert("Failed to submit profile. Please try again.");
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
                {step === 1 && <GraduationCap className="text-indigo-500 shrink-0" />}
                {step === 2 && <Users className="text-amber-500 shrink-0" />}
                {step === 3 && <Heart className="text-rose-500 shrink-0" />}
                {step === 4 && <Lock className="text-emerald-500 shrink-0" />}
                {ONBOARDING_STEPS[step]}
              </h2>
            </div>

            <p className="text-xs sm:text-sm font-medium mb-8 text-slate-500 dark:text-slate-400">
              {step === 0 && "Enter your basic attributes and residency details (පෞද්ගලික හා පදිංචි විස්තර)"}
              {step === 1 && "Share your academic qualifications and current profession (අධ්‍යාපනය හා රැකියාව)"}
              {step === 2 && "Provide your parents & family details for proposal bio-data (පවුලේ විස්තර)"}
              {step === 3 && "Tell us about yourself and your ideal partner expectations (අපේක්ෂා හා අදහස්)"}
              {step === 4 && "Upload profile photos & configure photo privacy settings (ඡායාරූප හා රහස්‍යභාවය)"}
            </p>

            <div className="min-h-[320px]">
              
              {/* STEP 1: Basic & Residency */}
              {step === 0 && (
                <div className="space-y-6 animate-fade-up">
                  <div className="bg-rose-500/5 p-4 rounded-2xl border border-rose-500/20 text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <Info size={16} className="text-rose-500 shrink-0" />
                    <span>Your full name and contact details remain 100% private until mutual proposal acceptance.</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Full Name (සම්පූර්ණ නම)</label>
                      <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. Piyumali Perera" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Age (වයස)</label>
                      <input required type="number" min="18" max="75" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. 27" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Gender (ස්ත්‍රී/පුරුෂ)</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        <option value="Male">Male (පුරුෂ)</option>
                        <option value="Female">Female (ස්ත්‍රී)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Civil Status (සිවිල් තත්වය)</label>
                      <select name="civilStatus" value={formData.civilStatus} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
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
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Ethnicity (ජාතිය)</label>
                      <select name="ethnicity" value={formData.ethnicity} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        {["Sinhalese", "Tamil", "Moor", "Burgher", "Other"].map(e => (
                          <option key={e} value={e}>{e}</option>
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
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Caste (කුලය)</label>
                      <select name="caste" value={formData.caste} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        {["Govigama", "Karawa", "Durawa", "Salagama", "Vishwakarma", "Other / Not Specified"].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Residency Country (රට)</label>
                      <select name="country" value={formData.country} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        {["Sri Lanka", "Australia", "United Kingdom", "USA", "Canada", "New Zealand", "UAE / Gulf", "Other Overseas"].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Current Living District (දැනට පදිංචි දිස්ත්‍රික්කය)</label>
                      <select name="district" value={formData.district} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        {SRI_LANKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Hometown / Native Area (ගම / මුල් ගම)</label>
                      <input required name="hometown" value={formData.hometown} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. Colombo 1 / Nittambuwa" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Education & Career */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-up">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                      Primary Profile Badge (ඔබගේ ප්‍රධාන පසුබිම් Badge එක)
                    </label>
                    <p className="text-xs text-rose-500 dark:text-rose-400 font-semibold mb-3 flex items-center gap-1.5">
                      <Sparkles size={13} className="shrink-0" />
                      <span>Choose the main badge for your profile card. You can enter BOTH your University and Career details below!</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button 
                        type="button" 
                        onClick={() => setFormData({ ...formData, educationCategory: 'University' })} 
                        className={cx(
                          "flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-center", 
                          formData.educationCategory === 'University' 
                            ? "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-sm" 
                            : "border-slate-200 dark:border-slate-800 hover:border-rose-300 text-slate-500"
                        )}
                      >
                        <GraduationCap size={24} className="mb-1.5" />
                        <span className="font-bold text-xs">Campus Graduate 🎓</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Uni Student / Graduate</span>
                      </button>

                      <button 
                        type="button" 
                        onClick={() => setFormData({ ...formData, educationCategory: 'Professional Qualification' })} 
                        className={cx(
                          "flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-center", 
                          formData.educationCategory === 'Professional Qualification' 
                            ? "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-sm" 
                            : "border-slate-200 dark:border-slate-800 hover:border-rose-300 text-slate-500"
                        )}
                      >
                        <Briefcase size={24} className="mb-1.5" />
                        <span className="font-bold text-xs">Working Professional 💼</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Executive / Specialist</span>
                      </button>

                      <button 
                        type="button" 
                        onClick={() => setFormData({ ...formData, educationCategory: 'General / Business' })} 
                        className={cx(
                          "flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-center", 
                          formData.educationCategory === 'General / Business' 
                            ? "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-sm" 
                            : "border-slate-200 dark:border-slate-800 hover:border-rose-300 text-slate-500"
                        )}
                      >
                        <User2 size={24} className="mb-1.5" />
                        <span className="font-bold text-xs">Business Enterprise 🏢</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Entrepreneur / Business Owner</span>
                      </button>
                    </div>
                  </div>

                  {/* UNCONDITIONAL COMPLETE EDUCATION & CAREER INPUT FIELDS */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">University / Institute Name (විශ්වවිද්‍යාලය / ආයතනය)</label>
                      <input name="university" value={formData.university} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. University of Moratuwa / UCSC / CIMA / SLIIT" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Faculty / Field of Study (පීඨය / ක්ෂේත්‍රය)</label>
                      <input name="faculty" value={formData.faculty} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. Engineering / Computer Science / Finance" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Academic Status (තත්වය)</label>
                      <select name="educationStatus" value={formData.educationStatus} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        <option value="Graduate">Graduate (උපාධිධාරී)</option>
                        <option value="Undergraduate">Undergraduate (අධ්‍යයන ලබන)</option>
                        <option value="Postgraduate">Postgraduate (පශ්චාත් උපාධිධාරී)</option>
                        <option value="Professional Diploma">Professional Diploma / Chartered</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Profession / Designation (රැකියාව / තනතුර)</label>
                      <input required name="profession" value={formData.profession} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. Senior Software Engineer / Doctor / Business Owner" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Workplace / Company (සේවා ස්ථානය)</label>
                      <input name="workplace" value={formData.workplace} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. WSO2 / Tech Corp / General Hospital / Self-Employed" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Highest Education Level (අධ්‍යාපන මට්ටම)</label>
                      <select name="educationGoal" value={formData.educationGoal} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        <option value="University Degree">University Degree (උපාධිය)</option>
                        <option value="Undergraduate">Undergraduate (විශ්වවිද්‍යාල ශිෂ්‍ය)</option>
                        <option value="Master's / Postgraduate">Master's / Postgraduate (පශ්චාත් උපාධිය)</option>
                        <option value="Professional Qualification / Diploma">Professional Qualification / Diploma (වෘත්තීය ඩිප්ලෝමා)</option>
                        <option value="G.C.E. Advanced Level - A/L">G.C.E. Advanced Level - A/L (උසස් පෙළ)</option>
                        <option value="Business Owner / Self-Employed">Business Owner / Self-Employed (ව්‍යාපාරික)</option>
                        <option value="Other / General">Other / General (වෙනත්)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Monthly Income Range (මාසික ආදායම)</label>
                      <select name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        <option value="Under Rs 100,000">Under Rs 100,000</option>
                        <option value="Rs 100,000 - Rs 200,000">Rs 100,000 - Rs 200,000</option>
                        <option value="Rs 200,000 - Rs 300,000">Rs 200,000 - Rs 300,000</option>
                        <option value="Rs 300,000 - Rs 500,000">Rs 300,000 - Rs 500,000</option>
                        <option value="Rs 500,000+">Rs 500,000+</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Family Information */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-up">
                  
                  {/* FATHER */}
                  <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20">
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1.5">
                      <Users size={14} /> FATHER'S DETAILS (පියාගේ විස්තර)
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Father's Ethnicity</label>
                        <select name="fatherEthnicity" value={formData.fatherEthnicity} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50">
                          {["Sinhalese", "Tamil", "Moor", "Burgher", "Other"].map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Father's Religion</label>
                        <select name="fatherReligion" value={formData.fatherReligion} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50">
                          {["Buddhist", "Hindu", "Muslim", "Catholic", "Christian", "Other"].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Father's Profession</label>
                        <input name="fatherProfession" value={formData.fatherProfession} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50" placeholder="e.g. Businessman / Government Officer" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Father's Status</label>
                        <select name="fatherStatus" value={formData.fatherStatus} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50">
                          <option value="Active / Employed">Active / Employed</option>
                          <option value="Retired">Retired</option>
                          <option value="Deceased">Deceased</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* MOTHER */}
                  <div className="bg-pink-500/5 p-4 rounded-2xl border border-pink-500/20">
                    <h3 className="text-xs font-black uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-3 flex items-center gap-1.5">
                      <Users size={14} /> MOTHER'S DETAILS (මවගේ විස්තර)
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Mother's Ethnicity</label>
                        <select name="motherEthnicity" value={formData.motherEthnicity} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/50">
                          {["Sinhalese", "Tamil", "Moor", "Burgher", "Other"].map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Mother's Religion</label>
                        <select name="motherReligion" value={formData.motherReligion} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/50">
                          {["Buddhist", "Hindu", "Muslim", "Catholic", "Christian", "Other"].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Mother's Profession</label>
                        <input name="motherProfession" value={formData.motherProfession} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/50" placeholder="e.g. Teacher / Housewife" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Mother's Country</label>
                        <select name="motherCountry" value={formData.motherCountry} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/50">
                          <option value="Sri Lanka">Sri Lanka</option>
                          <option value="Overseas">Overseas</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SIBLINGS */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Siblings & Family Status (සහෝදර සහෝදරියන්ගේ විස්තර)</label>
                    <input required name="siblings" value={formData.siblings} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. 1 Brother, 1 Sister (Respectable Family / All Employed)" />
                  </div>

                </div>
              )}

              {/* STEP 4: Mindset & Partner Expectations */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-up">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Food / Diet Preference (කෑම බීම)</label>
                      <select name="dietaryPreference" value={formData.dietaryPreference} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        <option value="Non-Vegetarian 🍗">Non-Vegetarian 🍗 (සාමාන්‍ය කෑම)</option>
                        <option value="Vegetarian 🥗">Vegetarian 🥗 (නිර්මාංශ)</option>
                        <option value="Vegan 🌿">Vegan 🌿 (සම්පූර්ණ නිර්මාංශ)</option>
                        <option value="Halal 🕌">Halal 🕌 (හලාල් පරිභෝජනය)</option>
                        <option value="Eggetarian 🥚">Eggetarian 🥚</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Past Affairs Openness</label>
                      <select name="past_affairs_openness" value={formData.past_affairs_openness} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        <option value="Open to partners with past affairs">Open to partners with past affairs</option>
                        <option value="Never had affairs before">Never had affairs before</option>
                        <option value="First relationship preferred">First relationship preferred</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Drinking Lifestyle</label>
                      <select name="social_drinking_level" value={formData.social_drinking_level} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        <option value="Non-drinker 🚭">Non-drinker 🚭</option>
                        <option value="Social/Occasional Drinker 🍷">Social/Occasional Drinker 🍷</option>
                        <option value="Regular Drinker">Regular Drinker</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Smoking Lifestyle</label>
                      <select name="smokingStatus" value={formData.smokingStatus} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                        <option value="Non-smoker 🚭">Non-smoker 🚭</option>
                        <option value="Social/Occasional Smoker 🚬">Social/Occasional Smoker 🚬</option>
                        <option value="Regular Smoker">Regular Smoker</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <label className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <User2 size={14} /> About Candidate (මං ගැන වචන කිහිපයකින්...)
                      </label>
                      <textarea required name="prompt_about_me" value={formData.prompt_about_me} onChange={handleChange} rows={3} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. Educated university graduate currently residing in Colombo 1. Looking for a grounded partner with genuine moral values..." />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Sparkles size={14} /> 💕 Partner Preference (සහකරු / සහකාරිය පිළිබඳ අපේක්ෂා)
                      </label>
                      <textarea required name="prompt_ideal_partner" value={formData.prompt_ideal_partner} onChange={handleChange} rows={3} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 font-sinhala" placeholder="e.g. සමාන අධ්‍යාපන සුදුසුකම් ඇති, යහපත් ගුණධර්ම සහිත වෛද්‍ය/ඉංජිනේරු/කථිකාචාර්ය/මෘදුකාංග ඉංජිනේරු වැනි ගෞරවනීය රැකියාවක නිරත සහකරුවෙකු/සහකාරියක් සොයයි." />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Photos & Privacy */}
              {step === 4 && (
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

