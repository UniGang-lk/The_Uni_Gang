import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuX,
  LuSend,
  LuCloudUpload,
  LuCalendar,
  LuClock,
  LuMapPin,
  LuGraduationCap,
  LuTag,
  LuTicket,
  LuPhone,
  LuUsers,
  LuInfo,
  LuCalendarPlus
} from 'react-icons/lu';
import { api } from '../../api';
import AuthCard from '../auth/AuthCard';
import toast from 'react-hot-toast';
import { celebrate } from '../../utils/celebrate';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CATEGORIES = [
  { label: 'Tech & Hackathons', value: 'Tech' },
  { label: 'Culture & Music', value: 'Culture' },
  { label: 'Sports & Gaming', value: 'Sports' },
  { label: 'Business & Startups', value: 'Business' },
  { label: 'Academic & Workshops', value: 'Academic' },
  { label: 'Lifestyle & Socials', value: 'Lifestyle' }
];

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset auth gate & preview when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowAuthGate(false);
      setPreviewImage(null);
    }
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = formData.get('title') as string;
    const uni = formData.get('uni') as string;
    const category = formData.get('category') as string;
    const location = formData.get('location') as string;
    const price = formData.get('price') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const contact = formData.get('contact') as string;
    const capacity = formData.get('capacity') as string;
    const requirements = formData.get('requirements') as string;
    const extra = formData.get('extra') as string;
    const description = formData.get('description') as string;
    const flyerFile = fileInputRef.current?.files?.[0];

    const token = localStorage.getItem('userToken');

    // If user is not logged in, cache the form and show Auth gate
    if (!token) {
      setIsSubmitting(true);
      try {
        let base64Image = previewImage;
        if (flyerFile && !base64Image) {
          base64Image = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(flyerFile);
          });
        }

        const pendingData = {
          title,
          uni,
          category,
          location,
          price: price || 'Free',
          date,
          time: time || '09:00 AM',
          contact,
          capacity,
          requirements,
          extra,
          description,
          base64Image
        };

        localStorage.setItem('pending_event_submission', JSON.stringify(pendingData));
        setShowAuthGate(true);
      } catch (err) {
        console.error('Failed to cache event data:', err);
        toast.error('Failed to preserve draft for sign-in.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Submit directly with active token
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append('title', title);
      submitData.append('uni', uni);
      submitData.append('category', category);
      submitData.append('location', location);
      submitData.append('price', price || 'Free');
      submitData.append('date', date);
      submitData.append('time', time || '09:00 AM');
      submitData.append('contact', contact);
      if (capacity) submitData.append('capacity', capacity);
      if (requirements) submitData.append('requirements', requirements);
      if (extra) submitData.append('extra', extra);
      submitData.append('description', description);
      if (flyerFile) {
        submitData.append('image', flyerFile);
      }

      await api.submitEvent(submitData, token);

      celebrate();
      toast.success('Event submitted successfully for review!');
      form.reset();
      setPreviewImage(null);
      onClose();
      onSuccess?.();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to submit event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSuccess = async () => {
    setShowAuthGate(false);
    const token = localStorage.getItem('userToken');
    const pendingStr = localStorage.getItem('pending_event_submission');

    if (!token || !pendingStr) return;

    setIsSubmitting(true);
    try {
      const pendingData = JSON.parse(pendingStr);
      const submitData = new FormData();
      submitData.append('title', pendingData.title);
      submitData.append('uni', pendingData.uni);
      submitData.append('category', pendingData.category || 'Tech');
      submitData.append('location', pendingData.location);
      submitData.append('price', pendingData.price || 'Free');
      submitData.append('date', pendingData.date);
      submitData.append('time', pendingData.time || '09:00 AM');
      submitData.append('contact', pendingData.contact);
      if (pendingData.capacity) submitData.append('capacity', pendingData.capacity);
      if (pendingData.requirements) submitData.append('requirements', pendingData.requirements);
      if (pendingData.extra) submitData.append('extra', pendingData.extra);
      submitData.append('description', pendingData.description);

      if (pendingData.base64Image) {
        const res = await fetch(pendingData.base64Image);
        const blob = await res.blob();
        const file = new File([blob], 'event_flyer.png', { type: blob.type });
        submitData.append('image', file);
      }

      await api.submitEvent(submitData, token);

      localStorage.removeItem('pending_event_submission');
      celebrate();
      toast.success('Event submitted successfully for review!');
      setPreviewImage(null);
      onClose();
      onSuccess?.();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to submit saved event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto p-4 sm:p-6 py-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 25 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className={`w-full ${
              showAuthGate ? 'max-w-xl' : 'max-w-3xl'
            } relative z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] border border-white/60 dark:border-white/10 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]`}
          >
            {/* Ambient Decorative Glows */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 dark:bg-blue-600/25 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/20 dark:bg-cyan-600/25 blur-3xl rounded-full pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 sm:px-8 border-b border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <LuCalendarPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {showAuthGate ? 'Sign in to Continue' : 'Post Campus Event'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {showAuthGate
                      ? 'Authenticate your student account to register this event'
                      : 'Showcase your university event to thousands of students across Sri Lanka'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-rose-500 hover:text-white hover:rotate-90 transition-all duration-300 border-none cursor-pointer"
                aria-label="Close modal"
              >
                <LuX className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="relative z-10 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
              {showAuthGate ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-full flex justify-center">
                    <AuthCard onAuthSuccess={handleAuthSuccess} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAuthGate(false)}
                    className="mt-6 text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors border-none bg-transparent cursor-pointer"
                  >
                    ← Back to event form
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Poster / Flyer Upload */}
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400 mb-2 flex items-center gap-1.5">
                      <LuCloudUpload className="w-4 h-4" /> Event Flyer / Poster
                    </label>

                    <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4">
                      <div
                        className={`relative group cursor-pointer w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-cyan-400 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 transition-all flex flex-col items-center justify-center gap-2 overflow-hidden flex-1 ${
                          previewImage ? 'h-24 sm:h-28' : 'h-32'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                        />
                        <LuCloudUpload className="w-7 h-7 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors" />
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium text-center">
                          {previewImage ? 'Click to change flyer image' : 'Click or drag flyer image to upload'}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                          PNG, JPG, WEBP (Max 5MB)
                        </span>
                      </div>

                      {previewImage && (
                        <div className="relative w-24 h-28 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 shrink-0">
                          <img
                            src={previewImage}
                            alt="Event Flyer Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-rose-500 text-white p-1 rounded-full backdrop-blur-md transition-colors shadow-sm z-20 border-none cursor-pointer"
                            aria-label="Remove image"
                          >
                            <LuX className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Event Name & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 block">
                        Event Title *
                      </label>
                      <input
                        required
                        name="title"
                        type="text"
                        placeholder="e.g. SLIIT CodeSprint 2025 or Mora Neon Nights"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                        <LuTag className="w-3.5 h-3.5 text-blue-500" /> Category *
                      </label>
                      <select
                        name="category"
                        defaultValue="Tech"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-semibold cursor-pointer"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value} className="dark:bg-slate-900">
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* University & Venue */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                        <LuGraduationCap className="w-3.5 h-3.5 text-blue-500" /> University & Faculty *
                      </label>
                      <input
                        required
                        name="uni"
                        type="text"
                        placeholder="e.g. UOM - Engineering or SLIIT Computing"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                        <LuMapPin className="w-3.5 h-3.5 text-blue-500" /> Venue / Location *
                      </label>
                      <input
                        required
                        name="location"
                        type="text"
                        placeholder="e.g. Main Auditorium, Katubedda or Online"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* Date, Time & Price */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                        <LuCalendar className="w-3.5 h-3.5 text-blue-500" /> Date *
                      </label>
                      <input
                        required
                        name="date"
                        type="date"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                        <LuClock className="w-3.5 h-3.5 text-blue-500" /> Time
                      </label>
                      <input
                        name="time"
                        type="text"
                        placeholder="e.g. 09:00 AM"
                        defaultValue="09:00 AM"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                        <LuTicket className="w-3.5 h-3.5 text-blue-500" /> Ticket / Entry Price
                      </label>
                      <input
                        name="price"
                        type="text"
                        placeholder="Free or LKR 1,000"
                        defaultValue="Free"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* Contact WhatsApp, Capacity & Requirements */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                        <LuPhone className="w-3.5 h-3.5 text-blue-500" /> Contact (WhatsApp) *
                      </label>
                      <input
                        required
                        name="contact"
                        type="tel"
                        placeholder="+94 7X XXX XXXX"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                        <LuUsers className="w-3.5 h-3.5 text-blue-500" /> Estimated Capacity
                      </label>
                      <input
                        name="capacity"
                        type="number"
                        placeholder="e.g. 500"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                        <LuInfo className="w-3.5 h-3.5 text-blue-500" /> Requirements / Eligibility
                      </label>
                      <input
                        name="requirements"
                        type="text"
                        placeholder="e.g. Student ID, Open for all"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* Extra Highlights */}
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Extra Perks / Highlights (Optional)
                    </label>
                    <input
                      name="extra"
                      type="text"
                      placeholder="e.g. Live stream, Free t-shirts, Drone shots, DJ after-party"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-semibold"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 block">
                      Description & Event Agenda *
                    </label>
                    <textarea
                      required
                      name="description"
                      rows={4}
                      placeholder="Provide details about the schedule, key attractions, registration deadlines, and guest speakers..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border-none"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/35 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50"
                    >
                      <LuSend className="w-4 h-4" />
                      {isSubmitting ? 'Submitting Event...' : 'Submit Campus Event'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateEventModal;
