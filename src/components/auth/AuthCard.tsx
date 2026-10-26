import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { LuUser, LuMail, LuLock, LuArrowRight, LuEye, LuEyeOff, LuGraduationCap, LuCheck, LuKeyRound } from 'react-icons/lu';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile, 
    signInWithPopup, 
    GoogleAuthProvider,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../../firebase';
import { dispatchAuthUpdate } from '../../utils/authEvents';
import toast from 'react-hot-toast';
import PremiumPageLoader from '../ui/PremiumPageLoader';
import { celebrate } from '../../utils/celebrate';

interface AuthCardProps {
    onAuthSuccess: () => void;
}

const GoogleSignInButton = ({ onSuccess, onFailure, setLoading }: { 
    onSuccess: (userData: any, token: string) => void, 
    onFailure: (error?: any) => void,
    setLoading: (loading: boolean) => void
}) => {
    const handleGoogleClick = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            const token = await userCredential.user.getIdToken(true);

            // Sync with backend database
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/users/sync`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    name: userCredential.user.displayName || 'Google User',
                    email: userCredential.user.email || '',
                    picture: userCredential.user.photoURL || ''
                })
            });
            const data = await res.json();
            const syncedUser = data.user || {
                name: userCredential.user.displayName || 'Google User',
                email: userCredential.user.email || '',
                profile_pic: userCredential.user.photoURL || ''
            };
            onSuccess(syncedUser, token);
        } catch (error) {
            console.error('Google Auth Error:', error);
            onFailure(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleClick}
            type="button"
            className="w-full bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-black py-4 rounded-2xl shadow-xl shadow-slate-200/5 dark:shadow-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group uppercase tracking-widest text-[10px]"
        >
            <FcGoogle className="text-xl group-hover:scale-110 transition-transform duration-300" />
            <span>Continue with Google</span>
        </motion.button>
    );
};

const AuthCard: React.FC<AuthCardProps> = ({ onAuthSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authName, setAuthName] = useState('');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        const cleanEmail = authEmail.trim();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, authPassword);
            const token = await userCredential.user.getIdToken(true);

            // Sync/Verify with backend
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/users/sync`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    name: userCredential.user.displayName || authName.trim() || 'Student',
                    email: cleanEmail,
                    picture: userCredential.user.photoURL || ''
                })
            });
            const data = await res.json();
            const syncedUser = data.user || {
                name: userCredential.user.displayName || authName.trim() || 'Student',
                email: cleanEmail,
                profile_pic: userCredential.user.photoURL || ''
            };

            localStorage.setItem('userToken', token);
            localStorage.setItem('userName', syncedUser.name || 'Student');
            localStorage.setItem('userEmail', cleanEmail);
            if (syncedUser.id) {
                localStorage.setItem('userId', String(syncedUser.id));
            }
            if (syncedUser.role) {
                localStorage.setItem('userRole', syncedUser.role);
            }
            if (syncedUser.is_verified_student !== undefined) {
                localStorage.setItem('userIsVerifiedStudent', String(syncedUser.is_verified_student));
            }
            if (syncedUser.is_verified_landlord !== undefined) {
                localStorage.setItem('userIsVerifiedLandlord', String(syncedUser.is_verified_landlord));
            }
            if (syncedUser.profile_pic) {
                localStorage.setItem('userProfilePicture', syncedUser.profile_pic);
            }
            dispatchAuthUpdate();
            onAuthSuccess();
            toast.success('Welcome back!');
            celebrate();
        } catch (error: any) {
            console.error('Login Error:', error);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                setMessage({ text: 'Invalid email or password. Please try again.', type: 'error' });
            } else if (error.code === 'auth/invalid-email') {
                setMessage({ text: 'Please enter a valid email address.', type: 'error' });
            } else {
                setMessage({ text: error.message || 'Login failed. Please try again.', type: 'error' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        const cleanEmail = authEmail.trim();
        const cleanName = authName.trim();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, authPassword);
            if (cleanName) {
                await updateProfile(userCredential.user, { displayName: cleanName });
            }
            const token = await userCredential.user.getIdToken(true);

            // Sync with backend so MySQL profile is created immediately
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/users/sync`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    name: cleanName || 'Student',
                    email: cleanEmail,
                    picture: ''
                })
            });
            const data = await res.json();
            const syncedUser = data.user || {
                name: cleanName || 'Student',
                email: cleanEmail,
                profile_pic: ''
            };

            // Ensure fresh clean slate by wiping any stale fields from previous session
            localStorage.removeItem('userPhoneNumber');
            localStorage.removeItem('userUniversity');
            localStorage.removeItem('userFbHandle');
            localStorage.removeItem('userLinkedinHandle');

            localStorage.setItem('userToken', token);
            localStorage.setItem('userName', syncedUser.name || cleanName || 'Student');
            localStorage.setItem('userEmail', cleanEmail);
            if (syncedUser.id) {
                localStorage.setItem('userId', String(syncedUser.id));
            }
            if (syncedUser.role) {
                localStorage.setItem('userRole', syncedUser.role);
            }
            if (syncedUser.is_verified_student !== undefined) {
                localStorage.setItem('userIsVerifiedStudent', String(syncedUser.is_verified_student));
            }
            if (syncedUser.is_verified_landlord !== undefined) {
                localStorage.setItem('userIsVerifiedLandlord', String(syncedUser.is_verified_landlord));
            }
            dispatchAuthUpdate();
            onAuthSuccess();
            toast.success('Account created successfully!');
            celebrate();
        } catch (error: any) {
            console.error('Register Error:', error);
            if (error.code === 'auth/email-already-in-use') {
                setMessage({ text: 'An account with this email already exists.', type: 'error' });
            } else if (error.code === 'auth/weak-password') {
                setMessage({ text: 'Security Key must be at least 6 characters long.', type: 'error' });
            } else {
                setMessage({ text: error.message || 'Registration failed. Please check your details.', type: 'error' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = (userData: any, token: string) => {
        localStorage.setItem('userToken', token);
        localStorage.setItem('userName', userData.name || 'Google User');
        localStorage.setItem('userEmail', userData.email || '');
        if (userData.id) {
            localStorage.setItem('userId', String(userData.id));
        }
        if (userData.role) {
            localStorage.setItem('userRole', userData.role);
        }
        if (userData.is_verified_student !== undefined) {
            localStorage.setItem('userIsVerifiedStudent', String(userData.is_verified_student));
        }
        if (userData.is_verified_landlord !== undefined) {
            localStorage.setItem('userIsVerifiedLandlord', String(userData.is_verified_landlord));
        }
        if (userData.profile_pic) {
            localStorage.setItem('userProfilePicture', userData.profile_pic);
        }
        dispatchAuthUpdate();
        onAuthSuccess();
        toast.success(`Welcome back, ${userData.name || 'Student'}!`);
        celebrate();
    };

    const handleGoogleFailure = (error?: any) => {
        console.error('Google Login Error details:', error);
        const errCode = error?.code || '';
        if (errCode === 'auth/popup-closed-by-user') {
            setMessage({ text: 'Google Sign-In popup was closed. Please try again.', type: 'error' });
        } else if (errCode === 'auth/unauthorized-domain') {
            setMessage({ text: 'This domain/port is not authorized in Firebase Console. Please use Email & Password Sign-In.', type: 'error' });
        } else {
            setMessage({ text: 'Google Login failed. Please use Email & Password Sign-In.', type: 'error' });
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetMessage, setResetMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    // University Campus Email Auto-Detection (.ac.lk or common uni domains)
    const isCampusEmail = useMemo(() => {
        const lower = authEmail.trim().toLowerCase();
        return lower.endsWith('.ac.lk') || lower.includes('.ac.lk');
    }, [authEmail]);

    // Password Strength Meter calculation (0-4 score)
    const passwordStrength = useMemo(() => {
        if (!authPassword) return { score: 0, label: '', color: 'bg-slate-200' };
        let score = 0;
        if (authPassword.length >= 6) score += 1;
        if (authPassword.length >= 8) score += 1;
        if (/[A-Z]/.test(authPassword) && /[a-z]/.test(authPassword)) score += 1;
        if (/[0-9]/.test(authPassword) || /[^A-Za-z0-9]/.test(authPassword)) score += 1;

        switch (score) {
            case 1:
                return { score: 1, label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
            case 2:
                return { score: 2, label: 'Fair', color: 'bg-amber-500', width: 'w-2/4' };
            case 3:
                return { score: 3, label: 'Good', color: 'bg-blue-500', width: 'w-3/4' };
            case 4:
                return { score: 4, label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
            default:
                return { score: 0, label: 'Too short', color: 'bg-red-400', width: 'w-1/12' };
        }
    }, [authPassword]);

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetEmail) {
            setResetMessage({ text: 'Please enter your account email address.', type: 'error' });
            return;
        }
        setResetLoading(true);
        setResetMessage(null);
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setResetMessage({ text: 'Password reset link sent to your email inbox! Please check your spam folder too.', type: 'success' });
            toast.success('Password reset email dispatched!');
        } catch (error: any) {
            console.error('Password reset error:', error);
            if (error.code === 'auth/user-not-found') {
                setResetMessage({ text: 'No user registered with this email address.', type: 'error' });
            } else if (error.code === 'auth/invalid-email') {
                setResetMessage({ text: 'Please enter a valid email address.', type: 'error' });
            } else {
                setResetMessage({ text: error.message || 'Failed to send reset link.', type: 'error' });
            }
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl overflow-hidden max-w-xl w-full border border-white/20 dark:border-slate-800 relative mx-auto">
            <PremiumPageLoader isLoading={loading} message={isRegistering ? "Creating your account..." : "Securing access..."} />
            
            <div className="p-10 pb-8">
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20"
                    >
                        <LuLock className="text-2xl text-white" />
                    </motion.div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter uppercase">
                        {isRegistering ? 'Join Us' : 'Welcome'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest text-[10px]">
                        {isRegistering ? 'The future of campus life' : 'Sign in to your portal'}
                    </p>
                </div>

                {message && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl mb-8 text-xs font-black uppercase tracking-widest text-center ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50' : 'bg-green-50 text-green-600 border border-green-100'}`}
                    >
                        {message.text}
                    </motion.div>
                )}

                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
                    {isRegistering && (
                        <div className="relative group">
                            <LuUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                className="w-full pl-14 pr-6 py-4 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 dark:text-white font-bold placeholder:text-slate-400"
                                placeholder="Display Name"
                                value={authName}
                                onChange={(e) => setAuthName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="relative group">
                        <LuMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="email"
                            className="w-full pl-14 pr-6 py-4 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 dark:text-white font-bold placeholder:text-slate-400"
                            placeholder="Email Address (e.g. name@eng.pdn.ac.lk or personal)"
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Campus Email Auto-Detect Badge */}
                    <AnimatePresence>
                        {isCampusEmail && (
                            <motion.div
                                initial={{ opacity: 0, y: -6, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -6, height: 0 }}
                                className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-3 flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-xs font-bold"
                            >
                                <div className="flex items-center gap-2">
                                    <LuGraduationCap className="text-lg text-emerald-600 shrink-0" />
                                    <span>Official Campus Domain Detected! Auto-Verified Student Badge enabled.</span>
                                </div>
                                <LuCheck className="text-emerald-600 text-base shrink-0 ml-2" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Password Field with Eye Toggle */}
                    <div className="relative group">
                        <LuLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full pl-14 pr-14 py-4 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 dark:text-white font-bold placeholder:text-slate-400"
                            placeholder="Security Key (Password)"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        >
                            {showPassword ? <LuEyeOff className="text-lg" /> : <LuEye className="text-lg" />}
                        </button>
                    </div>

                    {/* Password Strength Meter (Shown on Register mode) */}
                    {isRegistering && authPassword && (
                        <div className="space-y-1.5 px-1">
                            <div className="flex items-center justify-between text-[11px] font-bold">
                                <span className="text-slate-400 uppercase tracking-wider text-[9px]">Password Strength</span>
                                <span className={passwordStrength.score >= 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div 
                                    className={`h-full ${passwordStrength.color} rounded-full transition-all duration-300`}
                                    style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Forgot Password Link (Only in Login mode) */}
                    {!isRegistering && (
                        <div className="flex justify-end pt-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setResetEmail(authEmail);
                                    setResetMessage(null);
                                    setIsResetOpen(true);
                                }}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline transition-all"
                            >
                                Forgot Security Key?
                            </button>
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group uppercase tracking-widest text-xs"
                    >
                        {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Sign In')}
                        {!loading && <LuArrowRight className="group-hover:translate-x-1 transition-transform" />}
                    </motion.button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black">
                        <span className="px-6 bg-white dark:bg-[#0f172a] text-slate-400">Security Gate</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <GoogleSignInButton
                        onSuccess={handleGoogleSuccess}
                        onFailure={handleGoogleFailure}
                        setLoading={setLoading}
                    />
                </div>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-900/40 p-6 text-center border-t border-white/20 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                    {isRegistering ? 'Already a member?' : "New to the gang?"}
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="ml-2 font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest text-[10px]"
                    >
                        {isRegistering ? 'Sign In' : 'Join Now'}
                    </button>
                </p>
            </div>

            {/* Forgot Password Reset Modal */}
            <AnimatePresence>
                {isResetOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
                        >
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <LuKeyRound className="text-2xl" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    Reset Password
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">
                                    Enter your registered email and we'll send a secure password reset link.
                                </p>
                            </div>

                            {resetMessage && (
                                <div className={`p-4 rounded-2xl mb-5 text-xs font-bold ${resetMessage.type === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'}`}>
                                    {resetMessage.text}
                                </div>
                            )}

                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <div className="relative">
                                    <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
                                        placeholder="Enter your registered email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsResetOpen(false)}
                                        className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={resetLoading}
                                        className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        {resetLoading ? 'Sending...' : 'Send Link'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AuthCard;
