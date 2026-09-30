import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuSend, LuPhone, LuMail, LuMapPin, LuMessageSquareQuote, LuStar, LuChevronDown, LuUser, LuCopy, LuCheck } from 'react-icons/lu';
import TiltCard from '../ui/TiltCard.tsx';
import toast from 'react-hot-toast';
import { api } from '../../api';

interface Feedback {
    id: number;
    name: string;
    role: string;
    comment: string;
    avatar: string;
    rating: number;
}

const feedbacks: Feedback[] = [
    {
        id: 1,
        name: "Amara Perera",
        role: "Club President, UOM",
        comment: "The Uni Gang designed our club's website perfectly! The campus events display is a game changer for our member engagement.",
        avatar: "https://i.pravatar.cc/150?u=1",
        rating: 5,
    },
    {
        id: 2,
        name: "Kasun Jayawardena",
        role: "Annex Owner",
        comment: "Outstanding SEO services. Our annex listings are now on the first page of search results, bringing in more students than ever.",
        avatar: "https://i.pravatar.cc/150?u=2",
        rating: 5,
    },
    {
        id: 3,
        name: "Sajini Fernando",
        role: "Secretary, Student Society",
        comment: "The web app they developed for our student society is incredibly intuitive and fast. Highly recommend their development team!",
        avatar: "https://i.pravatar.cc/150?u=3",
        rating: 4,
    },
    {
        id: 4,
        name: "Nuwan Silva",
        role: "University Student",
        comment: "I love how easy it is to find and track campus events here. Great service for students to stay connected.",
        avatar: "https://i.pravatar.cc/150?u=4",
        rating: 5,
    },
    {
        id: 5,
        name: "Dilini Ratnayake",
        role: "Tech Entrepreneur",
        comment: "Professional web designing at its best. They really understood our brand identity and delivered a stunning platform.",
        avatar: "https://i.pravatar.cc/150?u=5",
        rating: 5,
    },
    {
        id: 6,
        name: "Tharindu Bandara",
        role: "Event Organizer",
        comment: "Their digital solutions have significantly improved our engagement. The event listing feature is top-notch.",
        avatar: "https://i.pravatar.cc/150?u=6",
        rating: 5,
    }
];



const TestimonialCard = ({ feedback }: { feedback: Feedback }) => {
    const nameParts = feedback.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    return (
        <div className="relative p-6 flex-shrink-0" style={{ width: "340px" }}>
            <div className="absolute text-gray-200 dark:text-slate-800 select-none" style={{ top: "62px", left: "22px", fontSize: "44px", lineHeight: 1, fontFamily: "Georgia, serif", zIndex: 10 }}>"</div>
            <div className="absolute text-gray-200 dark:text-slate-800 select-none" style={{ bottom: "50px", right: "22px", fontSize: "44px", lineHeight: 1, fontFamily: "Georgia, serif", zIndex: 10 }}>"</div>

            <TiltCard>
                <div className="relative z-10 mt-1">
                    <div className="absolute z-20" style={{ top: "-20px", right: "16px" }}>
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="rounded-full bg-white dark:bg-slate-900 border-[4px] border-[#E91E63] overflow-hidden shadow-lg"
                            style={{ width: "72px", height: "72px" }}
                        >
                            <img src={feedback.avatar} alt={feedback.name} className="w-full h-full object-cover" />
                        </motion.div>
                    </div>

                    <div className="relative px-6 py-5 shadow-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl border border-white/20 rounded-[22px] min-h-[190px]">
                        <div className="mb-3 pr-20">
                            <p className="font-extrabold uppercase tracking-wide leading-tight text-[0.95rem]">
                                <span style={{ color: "#E91E63" }}>{firstName} </span>
                                <span className="text-gray-800 dark:text-slate-100">{lastName}</span>
                            </p>
                            <p className="text-gray-500 dark:text-slate-400 text-xs mt-0.5 font-medium">{feedback.role}</p>
                        </div>

                        <div className="relative">
                            <span className="absolute -left-2 -top-1 text-[#E91E63] text-2xl font-serif">'</span>
                            <p className="text-gray-600 dark:text-slate-400 text-xs text-center leading-relaxed px-2 font-serif italic">
                                {feedback.comment}
                            </p>
                            <span className="absolute -right-1 -bottom-1 text-[#E91E63] text-2xl font-serif">'</span>
                        </div>

                        <div className="mt-6 flex items-center gap-1.5">
                            <div className="flex-1 h-px bg-[#E91E63]/20" />
                            <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <LuStar key={i} size={14} fill={i < feedback.rating ? "#FFC107" : "none"} stroke={i < feedback.rating ? "#FFC107" : "#ccc"} />
                                ))}
                            </div>
                            <div className="flex-1 h-px bg-[#E91E63]/20" />
                        </div>

                        <div className="absolute -bottom-[22px] right-[52px] w-0 h-0 border-l-[16px] border-l-transparent border-t-[22px] border-t-white/70 dark:border-t-slate-800/70" />
                    </div>
                </div>
            </TiltCard>
        </div>
    );
};

const Contact = () => {
    const [activeTab, setActiveTab] = useState<'contact' | 'feedback'>('feedback');
    const [rating, setRating] = useState(0);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    // Report problem form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [inquiryType, setInquiryType] = useState('');
    const [message, setMessage] = useState('');

    // Client feedback form states
    const [feedbackName, setFeedbackName] = useState('');
    const [feedbackInstitution, setFeedbackInstitution] = useState('');
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackSuccess, setFeedbackSuccess] = useState(false);

    // Dynamic testimonials state
    const [activeFeedbacks, setActiveFeedbacks] = useState<Feedback[]>(feedbacks);

    // Copy states
    const [copiedItem, setCopiedItem] = useState<string | null>(null);

    // Fetch approved feedbacks from database
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const approved = await api.getApprovedFeedbacks();
                if (approved && approved.length > 0) {
                    const mapped: Feedback[] = approved.map((f: any) => ({
                        id: f.id,
                        name: f.name,
                        role: f.institution || 'Verified Client',
                        comment: f.comment,
                        avatar: f.avatar.startsWith('http') ? f.avatar : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${f.avatar}`,
                        rating: f.rating
                    }));
                    setActiveFeedbacks(mapped);
                }
            } catch (err) {
                console.error("Failed to load approved feedbacks:", err);
            }
        };
        fetchFeedbacks();
    }, []);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedItem(label);
        setTimeout(() => setCopiedItem(null), 2000);
    };

    const getRatingLabel = (stars: number) => {
        switch (stars) {
            case 1: return "1/5 - Poor";
            case 2: return "2/5 - Fair";
            case 3: return "3/5 - Good";
            case 4: return "4/5 - Very Good";
            case 5: return "5/5 - Excellent!";
            default: return "Select your rating above";
        }
    };

    const handleSendInquiry = async () => {
        if (!name.trim() || !email.trim() || !inquiryType || !message.trim()) {
            toast.error("Please fill all fields");
            return;
        }

        const token = localStorage.getItem('userToken');
        if (!token) {
            toast.error("Please login to report a problem.");
            return;
        }

        try {
            await api.submitSupportProblem({
                name,
                email,
                inquiryType,
                message
            });

            toast.success("Problem reported successfully to the admin team!");
            setName('');
            setEmail('');
            setInquiryType('');
            setMessage('');
        } catch (err: any) {
            toast.error(err.message || "Failed to submit problem report");
        }
    };

    const handleSendFeedback = async () => {
        if (!feedbackName.trim() || !feedbackText.trim() || rating === 0) {
            toast.error("Please provide your name, feedback comment, and a star rating.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', feedbackName);
            formData.append('institution', feedbackInstitution);
            formData.append('comment', feedbackText);
            formData.append('rating', String(rating));
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            await api.submitFeedback(formData);

            setFeedbackSuccess(true);
            toast.success("Feedback posted successfully!");
            setTimeout(() => {
                setFeedbackSuccess(false);
                setFeedbackName('');
                setFeedbackInstitution('');
                setFeedbackText('');
                setRating(0);
                setAvatarPreview(null);
                setAvatarFile(null);
            }, 3000);
        } catch (err: any) {
            toast.error(err.message || "Failed to submit feedback");
        }
    };

    return (
        <section id="contact" className="relative pt-12 pb-10 bg-slate-150 dark:bg-[#020617] font-sans overflow-hidden">
            {/* Smooth Section Blend Overlays */}
            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-slate-150 via-slate-150 dark:from-[#020617] dark:via-[#020617] to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-150 via-slate-150 dark:from-[#020617] dark:via-[#020617] to-transparent pointer-events-none z-10" />
            {/* Ambient background decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-fixed/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-50"></div>

            <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 2xl:px-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                        Contact <span className="text-primary italic">The Uni Gang</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch mb-32 px-4 md:px-8">
                    {/* Contact Info Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-5"
                    >
                        <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl p-10 md:p-12 rounded-[2.5rem] border border-white/30 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] h-full flex flex-col transition-all duration-500 hover:border-primary/30">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-12 tracking-tight">Reach Out To Us</h3>

                            <div className="space-y-10 flex-grow">
                                {[
                                    { icon: LuMail, label: "Email Endpoint", value: "uniganglk@gmail.com" },
                                    { icon: LuPhone, label: "Direct Hotline", value: "+94 72 447 8148" },
                                    { icon: LuMapPin, label: "Our Base", value: "Colombo, Sri Lanka" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 6 }}
                                        className="flex gap-6 items-center group relative cursor-pointer"
                                        onClick={() => handleCopy(item.value, item.label)}
                                    >
                                        <motion.div
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                                            className="w-14 h-14 rounded-2xl bg-white/20 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300"
                                        >
                                            <item.icon className="text-2xl" />
                                        </motion.div>
                                        <div className="flex-1 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-1">{item.label}</p>
                                                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">{item.value}</p>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-slate-400 dark:text-slate-500 hover:text-primary p-2">
                                                {copiedItem === item.label ? (
                                                    <LuCheck className="text-emerald-500 text-lg animate-pulse" />
                                                ) : (
                                                    <LuCopy className="text-lg" />
                                                )}
                                            </div>
                                        </div>
                                        {/* Copied Tooltip */}
                                        <AnimatePresence>
                                            {copiedItem === item.label && (
                                                <motion.span
                                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                                    className="absolute -top-6 right-0 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-md z-20"
                                                >
                                                    Copied!
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                whileInView={{ opacity: [0, 1], y: [20, 0] }}
                                className="mt-16 p-8 rounded-[2rem] bg-white/5 dark:bg-slate-800/20 backdrop-blur-lg border border-white/10 dark:border-slate-700/30 overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Online Now</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Typical response time: <span className="text-primary font-bold">~2 Hours</span></p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Pro Dual Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-7"
                    >
                        <div className="relative h-full rounded-[2.5rem] overflow-hidden border border-white/40 dark:border-slate-800/50 shadow-[0_8px_40px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.2)] bg-white/30 dark:bg-slate-900/40 backdrop-blur-3xl p-8 flex flex-col transition-all duration-500 hover:border-primary/20">
                            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-slate-700/50 to-transparent" />

                            <div className="flex gap-2 p-1.5 rounded-3xl border border-white/40 dark:border-slate-800 mb-8 bg-white/20 dark:bg-slate-900/20 backdrop-blur-md">
                                <button
                                    onClick={() => setActiveTab('feedback')}
                                    className={`flex-1 py-4 rounded-[1.25rem] text-[11px] font-bold uppercase tracking-widest transition-all duration-500 relative ${activeTab === 'feedback' ? 'text-[#E91E63]' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {activeTab === 'feedback' && <motion.div layoutId="tab-pill" className="absolute inset-0 bg-white/90 dark:bg-slate-800 rounded-[1.25rem] shadow-xl border border-white dark:border-slate-700"></motion.div>}
                                    <span className="relative z-10">Client Feedback</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('contact')}
                                    className={`flex-1 py-4 rounded-[1.25rem] text-[11px] font-bold uppercase tracking-widest transition-all duration-500 relative ${activeTab === 'contact' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {activeTab === 'contact' && <motion.div layoutId="tab-pill" className="absolute inset-0 bg-white/90 dark:bg-slate-800 rounded-[1.25rem] shadow-xl border border-white dark:border-slate-700"></motion.div>}
                                    <span className="relative z-10">Report Problem</span>
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab + (feedbackSuccess ? '-success' : '-form')}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex flex-col gap-4 flex-grow"
                                >
                                    {feedbackSuccess ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="flex flex-col items-center justify-center text-center p-12 h-full my-auto"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6 border border-rose-500/30 animate-bounce">
                                                <LuMessageSquareQuote size={36} />
                                            </div>
                                            <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Thank You!</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                                                Your valuable feedback has been submitted successfully. We appreciate your support in making The Uni Gang the best platform in Sri Lanka!
                                            </p>
                                        </motion.div>
                                    ) : activeTab === 'contact' ? (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                                <div className="group">
                                                    <input required value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Full Name" className="w-full px-6 py-4 rounded-[1.25rem] text-sm font-semibold bg-slate-100/50 dark:bg-slate-800/40 backdrop-blur-md border-[1.5px] border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] group-hover:bg-white/70 dark:group-hover:bg-slate-800/70 text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />
                                                </div>
                                                <div className="group">
                                                    <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email Address" className="w-full px-6 py-4 rounded-[1.25rem] text-sm font-semibold bg-slate-100/50 dark:bg-slate-800/40 backdrop-blur-md border-[1.5px] border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] group-hover:bg-white/70 dark:group-hover:bg-slate-800/70 text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />
                                                </div>
                                            </div>
                                            <div className="relative group mb-5">
                                                <select required value={inquiryType} onChange={(e) => setInquiryType(e.target.value)} className="w-full px-6 py-4 rounded-[1.25rem] text-sm font-semibold bg-slate-100/50 dark:bg-slate-800/40 backdrop-blur-md border-[1.5px] border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none appearance-none cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] group-hover:bg-white/70 dark:group-hover:bg-slate-800/70 text-slate-700 dark:text-slate-200">
                                                    <option disabled value="" className="dark:bg-slate-900">Select Inquiry or Problem Type</option>
                                                    <option value="General Inquiry" className="dark:bg-slate-900">General Inquiry</option>
                                                    <option value="Report a Bug / Problem" className="dark:bg-slate-900">Report a Bug / Problem</option>
                                                    <option value="Request a New Service / Dev" className="dark:bg-slate-900">Request a New Service / Dev</option>
                                                    <option value="Accommodation Listing Help" className="dark:bg-slate-900">Accommodation Listing Help</option>
                                                    <option value="Event Posting Help" className="dark:bg-slate-900">Event Posting Help</option>
                                                </select>
                                                <LuChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                                            </div>
                                            <div className="group mb-6">
                                                <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Tell us about your problem, question, or request..." className="w-full px-6 py-4 rounded-[1.25rem] text-sm font-semibold bg-slate-100/50 dark:bg-slate-800/40 backdrop-blur-md border-[1.5px] border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] group-hover:bg-white/70 dark:group-hover:bg-slate-800/70 text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />
                                            </div>
                                            <motion.button
                                                onClick={handleSendInquiry}
                                                whileHover={{ scale: 1.02, y: -2, boxShadow: "0 20px 40px -10px rgba(79, 70, 229, 0.4)" }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full mt-auto py-4 rounded-[1.25rem] text-white text-[11px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-blue-600 to-primary flex items-center justify-center gap-3 transition-all"
                                            >
                                                Send Message <LuSend size={14} />
                                            </motion.button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-6 p-6 rounded-2xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                                                <label className="relative cursor-pointer group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="sr-only"
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                                                                setAvatarFile(e.target.files[0]);
                                                            }
                                                        }}
                                                    />
                                                    <motion.div
                                                        whileHover={{ scale: 1.05 }}
                                                        className="w-16 h-16 rounded-3xl border-2 border-dashed border-rose-400 dark:border-rose-500/60 flex items-center justify-center bg-white/40 dark:bg-slate-800/40 hover:border-rose-500 dark:hover:bg-rose-500/10 hover:shadow-[0_0_15px_rgba(233,30,99,0.3)] transition-all relative overflow-hidden group"
                                                    >
                                                        {avatarPreview ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover rounded-3xl" /> : <LuUser className="text-slate-400 dark:text-slate-500 size-6 group-hover:text-rose-500 transition-colors" />}
                                                        <div className="absolute -bottom-1 -right-1 bg-[#E91E63] text-white text-[8px] font-black px-1.5 py-0.5 rounded-lg shadow-lg">UP</div>
                                                    </motion.div>
                                                </label>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Profile Avatar</p>
                                                    <p className="text-[10px] text-slate-500 font-medium">JPG/PNG · Max 5MB · Auto-crops to 1:1</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="group">
                                                    <input required value={feedbackName} onChange={(e) => setFeedbackName(e.target.value)} type="text" placeholder="Your Name" className="w-full px-6 py-4 rounded-[1.25rem] text-sm font-semibold bg-slate-100/50 dark:bg-slate-800/40 backdrop-blur-md border-[1.5px] border-slate-200 dark:border-slate-800 focus:border-[#E91E63] focus:ring-4 focus:ring-[#E91E63]/10 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] group-hover:bg-white/70 dark:group-hover:bg-slate-800/70 text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />
                                                </div>
                                                <div className="group">
                                                    <input required value={feedbackInstitution} onChange={(e) => setFeedbackInstitution(e.target.value)} type="text" placeholder="Club / University" className="w-full px-6 py-4 rounded-[1.25rem] text-sm font-semibold bg-slate-100/50 dark:bg-slate-800/40 backdrop-blur-md border-[1.5px] border-slate-200 dark:border-slate-800 focus:border-[#E91E63] focus:ring-4 focus:ring-[#E91E63]/10 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] group-hover:bg-white/70 dark:group-hover:bg-slate-800/70 text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 shadow-sm relative overflow-hidden group">
                                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#E91E63]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Rate Your Experience</p>
                                                <div className="flex gap-3">
                                                    {[1, 2, 3, 4, 5].map((i) => (
                                                        <motion.button
                                                            key={i}
                                                            type="button"
                                                            whileHover={{ scale: 1.25, rotate: 10 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => setRating(i)}
                                                            className="focus:outline-none"
                                                        >
                                                            <LuStar
                                                                size={36}
                                                                className={`transition-all duration-300 ${
                                                                    i <= rating
                                                                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                                                        : 'text-slate-300 dark:text-slate-700 hover:text-amber-300'
                                                                }`}
                                                            />
                                                        </motion.button>
                                                    ))}
                                                </div>
                                                <AnimatePresence mode="wait">
                                                    <motion.p
                                                        key={rating}
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -5 }}
                                                        className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                                                    >
                                                        {getRatingLabel(rating)}
                                                    </motion.p>
                                                </AnimatePresence>
                                            </div>
                                            <textarea required value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} rows={3} placeholder="Tell your Feedback..." className="w-full px-6 py-4 rounded-[1.25rem] text-sm font-semibold bg-slate-100/50 dark:bg-slate-800/40 backdrop-blur-md border-[1.5px] border-slate-200 dark:border-slate-800 focus:border-[#E91E63] focus:ring-4 focus:ring-[#E91E63]/10 outline-none resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] group-hover:bg-white/70 dark:group-hover:bg-slate-800/70 text-slate-800 dark:text-slate-100 placeholder:text-slate-400" />
                                            <motion.button
                                                onClick={handleSendFeedback}
                                                whileHover={{ scale: 1.02, y: -2, boxShadow: "0 20px 40px -10px rgba(233, 30, 99, 0.4)" }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full py-4 mt-auto rounded-[1.25rem] text-white text-[11px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-[#E91E63] to-[#880E4F] flex items-center justify-center gap-3 transition-all"
                                            >
                                                Post Feedback <LuMessageSquareQuote size={14} />
                                            </motion.button>
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>

                {/* Testimonials */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-5 text-center"
                >
                    <h3 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
                        What Our <span className="text-[#E91E63] italic">Clients Say</span>
                    </h3>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#E91E63] to-transparent mx-auto"></div>
                </motion.div>

                <div className="relative overflow-hidden pt-15 pb-30">
                    <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#f7f9fb] dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#f7f9fb] dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>

                    <div className="flex gap-8 animate-marquee">
                        {[...activeFeedbacks, ...activeFeedbacks, ...activeFeedbacks].map((f, i) => (
                            <TestimonialCard key={`${f.id}-${i}`} feedback={f} />
                        ))}
                    </div>

                    <style dangerouslySetInnerHTML={{
                        __html: `
                            @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
                            .animate-marquee { animation: marquee 60s linear infinite; width: max-content; }
                            .animate-marquee:hover { animation-play-state: paused; }
                        `
                    }} />
                </div>

            </div>
        </section>
    );
};

export default Contact;
