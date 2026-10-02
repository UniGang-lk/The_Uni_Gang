import React, { useState, useEffect } from 'react';
import { LuX, LuUpload, LuImagePlus, LuShieldCheck, LuCircleCheck, LuClock } from 'react-icons/lu';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<any>;
}

const CreateListingModal: React.FC<CreateListingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [type, setType] = useState<'PRODUCT' | 'GIG'>('PRODUCT');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Good');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [campusEmail, setCampusEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [emailStep, setEmailStep] = useState<'enter_email' | 'enter_code'>('enter_email');
  // 'live' = verified student published, 'pending' = awaiting email verification code
  const [successType, setSuccessType] = useState<'live' | 'pending'>('live');
  const [countdown, setCountdown] = useState(4);

  // Auto-close countdown when on success step
  useEffect(() => {
    if (step !== 3) return;
    setCountdown(4);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => onClose(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 5);
      setImages(prev => [...prev, ...filesArray].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('type', type);
      formData.append('price', price);
      formData.append('description', description);
      if (type === 'PRODUCT') formData.append('condition', condition);
      
      images.forEach(img => {
        formData.append('images', img);
      });

      const responseItem = await onSubmit(formData);
      if (responseItem && responseItem.status === 'PENDING_VERIFICATION') {
        setStep(2);
      } else {
        // Verified student — show success screen
        setSuccessType('live');
        setStep(3);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendCode = async () => {
    if (!campusEmail.trim()) return;
    setIsSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/users/profile/verify`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ campusEmail: campusEmail.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send verification code');
      
      setEmailStep('enter_code');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmCode = async () => {
    if (!verificationCode.trim()) return;
    setIsSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/users/profile/verify/confirm`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ code: verificationCode.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to verify code');

      localStorage.setItem('userIsVerifiedStudent', 'true');
      window.dispatchEvent(new Event('auth-update'));

      // Show live success screen
      setSuccessType('live');
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to verify code');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* ── STEP 1: Listing Form ── */}
        {step === 1 && (
          <>
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-slate-800/40">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Post to Hustle Hub
              </h2>
              <button onClick={onClose} className="p-2 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                <LuX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-r-md text-sm">
                  {error}
                </div>
              )}

              <form id="listingForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Type Selector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">What are you offering?</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setType('PRODUCT')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${type === 'PRODUCT' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400' : 'border-gray-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/50 text-gray-600 dark:text-slate-400'}`}
                    >
                      <span className="font-bold">Physical Item</span>
                      <span className="text-xs opacity-80">Sell textbooks, tech, etc.</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('GIG')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${type === 'GIG' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400' : 'border-gray-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/50 text-gray-600 dark:text-slate-400'}`}
                    >
                      <span className="font-bold">Freelance Gig</span>
                      <span className="text-xs opacity-80">Offer design, tutoring, etc.</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Title</label>
                    <input 
                      type="text" 
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500"
                      placeholder={type === 'PRODUCT' ? 'e.g., Casio FX-991EX Calculator' : 'e.g., I will design your presentation'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Price (Rs.)</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500"
                      placeholder="e.g., 5000"
                    />
                  </div>

                  {type === 'PRODUCT' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Condition</label>
                      <select 
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none"
                      >
                        <option value="New">Brand New</option>
                        <option value="Like New">Like New</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-slate-500"
                    placeholder="Describe your item or gig in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Images (Max 5)</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200 dark:border-white/10">
                        <img src={URL.createObjectURL(img)} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                          <LuX className="w-6 h-6" />
                        </button>
                      </div>
                    ))}
                    {images.length < 5 && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-white/10 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors flex flex-col items-center justify-center cursor-pointer text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                        <LuImagePlus className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Add Photo</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-slate-800/40 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors">
                Cancel
              </button>
              <button 
                type="submit" 
                form="listingForm"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <><LuUpload className="w-4 h-4" /> Publish Listing</>
                )}
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2: Student Email Verification ── */}
        {step === 2 && (
          <>
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-slate-800/40">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Verify Student Status</h2>
              <button onClick={onClose} className="p-2 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors border-none bg-transparent cursor-pointer">
                <LuX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 text-center flex flex-col items-center overflow-y-auto custom-scrollbar">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-4">
                <LuShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Almost Live! 🚀</h3>

              {error && (
                <div className="mb-6 p-4 w-full bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm text-left">
                  {error}
                </div>
              )}

              {emailStep === 'enter_email' ? (
                <>
                  <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-sm text-sm">
                    Your listing is saved! To publish it live, please verify your student status by entering your University Email Address (e.g. .ac.lk, sliit.lk, nsbm.ac.lk).
                  </p>

                  <input
                    type="email"
                    required
                    value={campusEmail}
                    onChange={(e) => setCampusEmail(e.target.value)}
                    placeholder="name@university.ac.lk"
                    className="w-full max-w-sm px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold placeholder:text-gray-400"
                  />

                  <div className="mt-8 flex justify-end gap-3 w-full max-w-sm">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer"
                    >
                      Verify Later
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting || !campusEmail.trim()}
                      onClick={handleSendCode}
                      className="px-6 py-2.5 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 border-none cursor-pointer"
                    >
                      {isSubmitting ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                      ) : 'Send Code'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-sm text-sm">
                    Please check your university email **{campusEmail}** for the 6-digit verification code.
                  </p>

                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    className="w-full max-w-sm px-4 py-3 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-center tracking-widest text-lg placeholder:text-gray-400"
                  />

                  <div className="mt-8 flex justify-end gap-3 w-full max-w-sm">
                    <button
                      type="button"
                      onClick={() => setEmailStep('enter_email')}
                      className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting || !verificationCode.trim()}
                      onClick={handleConfirmCode}
                      className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-650 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 border-none cursor-pointer"
                    >
                      {isSubmitting ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
                      ) : 'Verify Code'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ── STEP 3: Success Screen ── */}
        {step === 3 && (
          <div className="p-10 flex flex-col items-center text-center">
            {successType === 'live' ? (
              <>
                {/* Confetti-style animated ring */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 dark:bg-emerald-500/30 flex items-center justify-center">
                      <LuCircleCheck className="w-9 h-9 text-emerald-500 animate-[scale-in_0.4s_ease-out]" />
                    </div>
                  </div>
                  {/* Animated sparkle dots */}
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                      style={{
                        top: `${50 - 48 * Math.cos((deg * Math.PI) / 180)}%`,
                        left: `${50 + 48 * Math.sin((deg * Math.PI) / 180)}%`,
                        animation: `ping 1.5s ${i * 0.15}s ease-out infinite`,
                        opacity: 0.6
                      }}
                    />
                  ))}
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">You're Live! 🎉</h3>
                <p className="text-gray-500 dark:text-slate-400 max-w-xs mb-6">
                  Your listing is now published on the Hustle Hub. Students across campus can already see it!
                </p>
              </>
            ) : (
              <>
                <div className="w-24 h-24 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 dark:bg-amber-500/30 flex items-center justify-center">
                    <LuClock className="w-9 h-9 text-amber-500" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Under Review ⏳</h3>
                <p className="text-gray-500 dark:text-slate-400 max-w-xs mb-6">
                  Your listing is saved and your Student ID is submitted for verification. Once our team approves you, your listing goes <span className="font-bold text-indigo-500">live automatically</span>! We'll notify you right away.
                </p>
                <div className="flex flex-wrap gap-3 justify-center mb-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                    <LuClock className="w-3.5 h-3.5" /> Usually approved within 24 hours
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-semibold">
                    <LuShieldCheck className="w-3.5 h-3.5" /> ID deleted after verification
                  </div>
                </div>
              </>
            )}

            {/* Auto-close countdown */}
            <div className="w-full max-w-xs bg-gray-100 dark:bg-slate-800 rounded-full h-1.5 mb-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${successType === 'live' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${(countdown / 4) * 100}%`, transition: 'width 1s linear' }}
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-6">Closing in {countdown}s…</p>

            <button
              onClick={onClose}
              className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                successType === 'live'
                  ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
              }`}
            >
              {successType === 'live' ? 'View Marketplace →' : 'Got it, close'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CreateListingModal;
