import React, { useState, useEffect } from 'react';
import { 
  Compass, Send, Heart, Eye, CheckCircle2, Crown, ArrowRight, ArrowLeft, ShieldCheck, 
  Lock, MessageCircle, Settings, GraduationCap, User2, Inbox, Check, X, 
  Clock, Camera, Upload, AlertCircle, Phone, MapPin, Briefcase, FileText,
  Calendar, Users, Sparkles, Pencil, Bell, Shield, ChevronRight, RefreshCw, Info, Globe, Moon, Bookmark
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cx } from '../components/ui/ProposalPrimitives';
import { proposalApi } from '../api/proposalApi';

// Helper to get clean profile from localStorage without hardcoded fake data
const getInitialProfile = () => {
  const defaultProfile = {
    name: '',
    code: 'UG-' + Math.floor(100 + Math.random() * 900),
    age: '',
    gender: 'Male',
    civilStatus: 'Never Married (අවිවාහක)',
    birthday: '',
    district: '',
    hometown: '',
    country: 'Sri Lanka',
    religion: 'Buddhist',
    ethnicity: '',
    caste: '',
    height: '',
    phone: '',
    profession: '',
    workplace: '',
    university: '',
    educationCategory: '',
    monthlyIncome: '',
    drinking: 'Non-drinker',
    smoking: 'Non-smoker',
    diet: 'Non-Vegetarian',
    fatherEthnicity: '',
    fatherReligion: '',
    fatherProfession: '',
    fatherStatus: '',
    motherEthnicity: '',
    motherReligion: '',
    motherProfession: '',
    motherStatus: '',
    motherCountry: '',
    siblings: '',
    bio: '',
    promptIdealPartner: '',
    avatar: '',
    images: [],
    isVerified: false,
    verificationStatus: 'unverified',
    categoryBadge: 'ID Verification Pending ⏳',
    nicNumber: '',
    rejectionReason: null,
    profileViews: 1,
    blurPhoto: true,
    lagna: 'කන්‍යා (Virgo)',
    nekatha: 'හත (Hastha)',
    doshaStatus: 'None (දෝෂ රහිතයි)',
    horoscopeMatchRequired: 'Must Match (අත්‍යවශ්‍යයි)',
    birthTime: '',
    birthCity: '',
    horoscopeDocUrl: ''
  };

  if (typeof window !== 'undefined') {
    const savedProfileRaw = localStorage.getItem('userProposalProfile');
    if (savedProfileRaw) {
      try {
        const saved = JSON.parse(savedProfileRaw);
        return {
          ...defaultProfile,
          ...saved,
          name: saved.name || '',
          code: saved.code || defaultProfile.code,
          age: saved.age || '',
          gender: saved.gender || 'Male',
          civilStatus: saved.civil_status || saved.civilStatus || 'Never Married (අවිවාහක)',
          birthday: saved.birthday || '',
          district: saved.district || '',
          hometown: saved.hometown || '',
          country: saved.country || 'Sri Lanka',
          religion: saved.religion || 'Buddhist',
          ethnicity: saved.ethnicity || '',
          caste: saved.caste || '',
          height: saved.height || '',
          phone: saved.whatsapp_number || saved.phone || '',
          profession: saved.profession || '',
          workplace: saved.workplace || '',
          university: saved.university || '',
          educationCategory: saved.educationCategory || '',
          monthlyIncome: saved.monthlyIncome || '',
          drinking: saved.drinking || saved.social_drinking_level || 'Non-drinker',
          smoking: saved.smoking || saved.smokingStatus || 'Non-smoker',
          diet: saved.diet || saved.dietaryPreference || 'Non-Vegetarian',
          fatherEthnicity: saved.fatherEthnicity || '',
          fatherReligion: saved.fatherReligion || '',
          fatherProfession: saved.fatherProfession || '',
          fatherStatus: saved.fatherStatus || '',
          motherEthnicity: saved.motherEthnicity || '',
          motherReligion: saved.motherReligion || '',
          motherProfession: saved.motherProfession || '',
          motherStatus: saved.motherStatus || (saved.motherCountry && saved.motherCountry !== 'Sri Lanka' ? saved.motherCountry : ''),
          motherCountry: saved.motherCountry || '',
          siblings: saved.siblings || '',
          bio: saved.bio || saved.prompt_about_me || '',
          promptIdealPartner: saved.prompt_ideal_partner || saved.promptIdealPartner || '',
          avatar: saved.images?.[0] || '',
          images: Array.isArray(saved.images) ? saved.images.filter(Boolean) : [],
          isVerified: saved.isVerified === true,
          verificationStatus: saved.verificationStatus || (saved.isVerified ? 'verified' : (saved.nicFront ? 'pending_review' : 'unverified')),
          categoryBadge: saved.categoryBadge || (saved.isVerified ? 'Campus Graduate 🎓' : (saved.nicFront ? 'ID Review in Progress ⏳' : 'ID Verification Pending ⏳')),
          nicNumber: saved.nicNumber || '',
          rejectionReason: saved.rejectionReason || null,
          profileViews: saved.profileViews ?? 1,
          blurPhoto: saved.blurPhoto ?? true,
          lagna: saved.lagna || 'කන්‍යා (Virgo)',
          nekatha: saved.nekatha || 'හත (Hastha)',
          doshaStatus: saved.doshaStatus || saved.dosha_status || 'None (දෝෂ රහිතයි)',
          horoscopeMatchRequired: saved.horoscopeMatchRequired || saved.horoscope_match_required || 'Must Match (අත්‍යවශ්‍යයි)',
          birthTime: saved.birthTime || saved.birth_time || '',
          birthCity: saved.birthCity || saved.birth_city || '',
          horoscopeDocUrl: saved.horoscopeDocUrl || saved.horoscope_doc_url || ''
        };
      } catch (e) {
        console.error('Failed to parse saved proposal profile', e);
      }
    }
  }
  return defaultProfile;
};

// Calculate real dynamic completion percentage
const calculateProfileCompletion = (user: any): number => {
  if (!user) return 0;
  const fields = [
    Boolean(user.name),
    Boolean(user.age),
    Boolean(user.gender),
    Boolean(user.civilStatus),
    Boolean(user.district || user.hometown),
    Boolean(user.height),
    Boolean(user.religion),
    Boolean(user.profession),
    Boolean(user.educationCategory || user.university),
    Boolean(user.workplace),
    Boolean(user.bio),
    Boolean(user.promptIdealPartner),
    Boolean(user.images && user.images.length > 0),
    Boolean(user.phone),
    Boolean(user.fatherProfession || user.motherProfession || user.siblings),
    Boolean(user.drinking || user.smoking || user.diet),
    Boolean(user.isVerified)
  ];
  const filled = fields.filter(Boolean).length;
  return Math.min(100, Math.max(15, Math.round((filled / fields.length) * 100)));
};

export default function ProposalHomePage({
  setPage,
  openProfile,
  goToLanding: _goToLanding
}: {
  setPage: (page: string) => void;
  openProfile: (p: any) => void;
  goToLanding?: () => void;
}) {
  const [currentUser, setCurrentUser] = useState<any>(getInitialProfile);
  const completionPercentage = calculateProfileCompletion(currentUser);

  const [activeTab, setActiveTab] = useState<'overview' | 'proposals' | 'photos' | 'verification'>('overview');
  const [activeCardModal, setActiveCardModal] = useState<'sent' | 'received' | 'views' | 'matches' | null>(null);
  const [notificationsActive, setNotificationsActive] = useState(true);
  const [blurPhotosActive, setBlurPhotosActive] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isShortlistModalOpen, setIsShortlistModalOpen] = useState(false);
  const [shortlists, setShortlists] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('proposal_shortlists') || '[]');
    } catch {
      return [];
    }
  });

  // Edit Bio-Data Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTab, setEditTab] = useState<'personal' | 'career' | 'family' | 'expectations' | 'horoscope'>('personal');
  const [editFormData, setEditFormData] = useState<any>({});

  // Verification modal and upload state
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [nicNumberInput, setNicNumberInput] = useState('');
  const [nicFront, setNicFront] = useState<string | null>(null);
  const [nicBack, setNicBack] = useState<string | null>(null);
  const [isSubmittingNic, setIsSubmittingNic] = useState(false);

  // Lists for Interactive Modals
  const [sentProposalsList, setSentProposalsList] = useState([
    {
      id: 'sent_1',
      code: 'BR000158',
      name: 'Piyumali L.',
      age: 25,
      district: 'Colombo 1',
      profession: 'Software Engineer',
      sentDate: 'Yesterday',
      status: 'Pending Response ⏳',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    },
    {
      id: 'sent_2',
      code: 'BR000113',
      name: 'Kasuni D.',
      age: 26,
      district: 'Gampaha',
      profession: 'Banking Executive',
      sentDate: '3 days ago',
      status: 'Accepted 💕',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    }
  ]);

  const [receivedProposalsList, setReceivedProposalsList] = useState([
    {
      id: 'rec_1',
      code: 'BR000112',
      name: 'Dharani P. A.',
      age: 31,
      district: 'Kuliyapitiya',
      profession: 'Doctor (MBBS)',
      receivedDate: '2 hours ago',
      avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    },
    {
      id: 'rec_2',
      code: 'BR000064',
      name: 'Inoka D.',
      age: 28,
      district: 'Matale',
      profession: 'Chartered Accountant',
      receivedDate: '1 day ago',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    }
  ]);

  const [mutualMatchesList, setMutualMatchesList] = useState([
    {
      id: 'match_1',
      code: 'BR000113',
      name: 'Kasuni D.',
      age: 26,
      district: 'Gampaha',
      profession: 'Banking Executive',
      matchedDate: 'Matched Feb 2026',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    }
  ]);

  const [profileViewersList, setProfileViewersList] = useState([
    {
      id: 'view_1',
      code: 'BR000112',
      name: 'Dharani P. A.',
      age: 31,
      district: 'Kuliyapitiya',
      profession: 'Doctor',
      viewedTime: '10 mins ago',
      avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    },
    {
      id: 'view_2',
      code: 'BR000158',
      name: 'Piyumali L.',
      age: 25,
      district: 'Colombo 1',
      profession: 'Software Engineer',
      viewedTime: '1 hour ago',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      blurPhoto: false
    }
  ]);

  // Read saved profile data on mount and sync matches
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const profile = getInitialProfile();
    setCurrentUser(profile);
    if (profile.blurPhoto !== undefined) {
      setBlurPhotosActive(profile.blurPhoto);
    }

    // Fetch real matches & received proposals from Backend
    const fetchRealDashboardData = async () => {
      try {
        const matchesRes = await proposalApi.getMatches();
        if (matchesRes && matchesRes.matches && matchesRes.matches.length > 0) {
          const mappedMatches = matchesRes.matches.map((m: any) => {
            const otherUser = m.sender_id === profile.id ? m.receiver : m.sender;
            return {
              id: m.id,
              code: otherUser?.id ? 'UG-' + String(otherUser.id).slice(-4) : 'MATCH',
              name: otherUser?.name || 'Matched Partner',
              age: 26,
              district: otherUser?.district || 'Colombo',
              profession: otherUser?.profession || 'Professional',
              matchedDate: m.updated_at ? new Date(m.updated_at).toLocaleDateString() : 'Recently Matched',
              avatar: otherUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              blurPhoto: false
            };
          });
          setMutualMatchesList(mappedMatches);
        }
      } catch (err) {
        console.warn('Real matches fallback to local list:', err);
      }

      try {
        const likedRes = await proposalApi.getLikedMe();
        if (likedRes && likedRes.profiles && likedRes.profiles.length > 0) {
          const mappedLikes = likedRes.profiles.map((p: any) => ({
            id: p.id,
            code: p.code || 'BR-' + String(p.id).slice(-4),
            name: p.user?.name || 'Interested Member',
            age: p.age || 25,
            district: p.district || 'Colombo',
            profession: p.profession || 'Professional',
            receivedDate: 'Recently',
            avatar: p.images?.[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            blurPhoto: p.blur_photo ?? false
          }));
          setReceivedProposalsList(mappedLikes);
        }
      } catch {
        // Free or empty
      }

      // 3. Fetch real Profile Views Count and Recent Viewers from Backend
      try {
        const statsRes = await proposalApi.getGamificationStats();
        if (statsRes?.success && statsRes.stats) {
          if (typeof statsRes.stats.profileViews === 'number') {
            setCurrentUser((prev: any) => ({
              ...prev,
              profileViews: statsRes.stats.profileViews
            }));
          }
          if (Array.isArray(statsRes.stats.viewers) && statsRes.stats.viewers.length > 0) {
            setProfileViewersList(statsRes.stats.viewers.map((v: any) => ({
              id: v.id,
              code: v.code || 'UG-MEMBER',
              name: v.name || 'Verified Member',
              age: 26,
              district: 'Active Member',
              profession: 'Member',
              viewedTime: v.viewedTime || 'Recently',
              avatar: v.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              blurPhoto: false
            })));
          }
        }
      } catch (err) {
        console.warn('Real gamification stats fallback:', err);
      }

      // 4. Sync profile membership tier and view count from getMyProfile
      try {
        const myProfileRes = await proposalApi.getMyProfile();
        if (myProfileRes?.success && myProfileRes.profile) {
          const p = myProfileRes.profile;
          setCurrentUser((prev: any) => ({
            ...prev,
            profileViews: p.view_count ?? p.viewCount ?? prev.profileViews ?? 0,
            membershipTier: p.membership_tier || prev.membershipTier,
            isVIP: p.is_vip ?? prev.isVIP,
            isClassic: p.is_classic ?? prev.isClassic,
            isGhostMode: p.is_ghost_mode ?? prev.isGhostMode,
            isPaused: p.is_paused ?? prev.isPaused
          }));
        }
      } catch {
        // keep local state
      }

      // 5. Fetch real Shortlists and Family Notes
      try {
        const shortlistRes = await proposalApi.getShortlists();
        if (shortlistRes?.success && Array.isArray(shortlistRes.shortlists)) {
          setShortlists(shortlistRes.shortlists.map((s: any) => ({
            id: s.candidate_id || s.id,
            code: s.candidate?.code || s.code || 'UG-101',
            name: s.candidate?.user?.name || s.name || 'Shortlisted Member',
            age: s.candidate?.age || s.age || 26,
            district: s.candidate?.district || s.district || 'Sri Lanka',
            profession: s.candidate?.profession || s.profession || 'Professional',
            avatar: s.candidate?.images?.[0] || s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
            note: s.family_notes || s.note || '',
            candidate: s.candidate || s
          })));
        }
      } catch {
        // keep local state
      }
    };
    fetchRealDashboardData();
  }, []);

  const handleRemoveShortlist = async (id: string | number) => {
    try {
      await proposalApi.removeShortlist(id);
    } catch {}
    const updated = shortlists.filter(s => String(s.id) !== String(id));
    setShortlists(updated);
    localStorage.setItem('proposal_shortlists', JSON.stringify(updated));
    toast.success("Profile removed from Shortlist.");
  };

  const handleOpenEditModal = (tab: 'personal' | 'career' | 'family' | 'expectations' | 'horoscope' = 'personal') => {
    setEditFormData({
      ...currentUser,
      drinking: currentUser.drinking || 'Non-drinker',
      smoking: currentUser.smoking || 'Non-smoker',
      diet: currentUser.diet || 'Non-Vegetarian',
      gender: currentUser.gender || 'Male',
      country: currentUser.country || 'Sri Lanka',
      civilStatus: currentUser.civilStatus || 'Never Married (අවිවාහක)',
      categoryBadge: currentUser.categoryBadge || 'Campus Graduate 🎓',
      religion: currentUser.religion || 'Buddhist',
      motherStatus: currentUser.motherStatus || (currentUser.motherCountry && currentUser.motherCountry !== 'Sri Lanka' ? currentUser.motherCountry : ''),
      lagna: currentUser.lagna || 'කන්‍යා (Virgo)',
      nekatha: currentUser.nekatha || '',
      doshaStatus: currentUser.doshaStatus || 'None (දෝෂ රහිතයි)',
      horoscopeMatchRequired: currentUser.horoscopeMatchRequired || 'Must Match (අත්‍යවශ්‍යයි)',
      birthTime: currentUser.birthTime || '',
      birthCity: currentUser.birthCity || '',
      horoscopeDocUrl: currentUser.horoscopeDocUrl || ''
    });
    setEditTab(tab);
    setIsEditModalOpen(true);
  };

  const handleSaveBioData = async () => {
    const updatedUser = {
      ...currentUser,
      ...editFormData,
      phone: editFormData.phone || editFormData.whatsapp_number || currentUser.phone || '',
      whatsapp_number: editFormData.phone || editFormData.whatsapp_number || currentUser.phone || '',
      prompt_about_me: editFormData.bio || currentUser.bio || '',
      prompt_ideal_partner: editFormData.promptIdealPartner || currentUser.promptIdealPartner || '',
      civil_status: editFormData.civilStatus || currentUser.civilStatus || '',
      dietaryPreference: editFormData.diet || currentUser.diet || 'Non-Vegetarian',
      social_drinking_level: editFormData.drinking || currentUser.drinking || 'Non-drinker',
      smokingStatus: editFormData.smoking || currentUser.smoking || 'Non-smoker',
      lagna: editFormData.lagna || currentUser.lagna || 'කන්‍යා (Virgo)',
      nekatha: editFormData.nekatha || currentUser.nekatha || '',
      doshaStatus: editFormData.doshaStatus || currentUser.doshaStatus || 'None (දෝෂ රහිතයි)',
      dosha_status: editFormData.doshaStatus || currentUser.doshaStatus || 'None (දෝෂ රහිතයි)',
      horoscopeMatchRequired: editFormData.horoscopeMatchRequired || currentUser.horoscopeMatchRequired || 'Must Match (අත්‍යවශ්‍යයි)',
      horoscope_match_required: editFormData.horoscopeMatchRequired || currentUser.horoscopeMatchRequired || 'Must Match (අත්‍යවශ්‍යයි)',
      birthTime: editFormData.birthTime || currentUser.birthTime || '',
      birth_time: editFormData.birthTime || currentUser.birthTime || '',
      birthCity: editFormData.birthCity || currentUser.birthCity || '',
      birth_city: editFormData.birthCity || currentUser.birthCity || '',
      horoscopeDocUrl: editFormData.horoscopeDocUrl || currentUser.horoscopeDocUrl || '',
      horoscope_doc_url: editFormData.horoscopeDocUrl || currentUser.horoscopeDocUrl || '',
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('userProposalProfile', JSON.stringify(updatedUser));
    try {
      await proposalApi.submitProfile(updatedUser);
      toast.success('Bio-Data successfully updated! 🎉');
    } catch {
      toast.success('Bio-Data saved successfully! 🎉');
    }
    setIsEditModalOpen(false);
  };

  const compressImage = (file: File, maxWidth = 1200, quality = 0.75): Promise<string> => {
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

  const handleAcceptReceivedProposal = async (item: any) => {
    setReceivedProposalsList(prev => prev.filter(p => p.id !== item.id));
    setMutualMatchesList(prev => [{ ...item, matchedDate: 'Just Now' }, ...prev]);
    toast.success(`Proposal from ${item.name} (${item.code}) accepted! Photos unblurred & Chat unlocked 💕`);

    try {
      const target = item.userId || item.id || item.code;
      await proposalApi.swipe(String(target), 'like');
    } catch (err) {
      console.warn('Backend match sync fallback:', err);
    }
  };

  const handleDeclineReceivedProposal = async (item: any) => {
    setReceivedProposalsList(prev => prev.filter(p => p.id !== item.id));
    toast.success(`Proposal request from ${item.name} declined.`);

    try {
      const target = item.userId || item.id || item.code;
      await proposalApi.swipe(String(target), 'pass');
    } catch (err) {
      console.warn('Backend decline sync fallback:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        if (side === 'front') setNicFront(compressedBase64);
        else setNicBack(compressedBase64);
      } catch (err) {
        console.error('NIC photo compression error:', err);
        const reader = new FileReader();
        reader.onload = (event) => {
          if (side === 'front') setNicFront(event.target?.result as string);
          else setNicBack(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNic = nicNumberInput.trim().toUpperCase();

    // 1. NIC Format validation
    const isValidFormat = /^[0-9]{9}[VX]$/.test(cleanNic) || /^[0-9]{12}$/.test(cleanNic);
    if (!isValidFormat) {
      toast.error('වලංගු ජාතික හැඳුනුම්පත් අංකයක් ඇතුළත් කරන්න (උදා: 199812345678 හෝ 981234567V)');
      return;
    }

    // 2. Photos uploaded
    if (!nicFront || !nicBack) {
      toast.error('හැඳුනුම්පතේ ඉදිරිපස සහ පසුපස ඡායාරූප 2 ම upload කරන්න');
      return;
    }

    // 3. Deduplication Check against registered NICs
    const registeredNicsRaw = localStorage.getItem('unigang_registered_nics');
    const registeredNics: { nicNumber: string; userCode: string; userName: string }[] = registeredNicsRaw ? JSON.parse(registeredNicsRaw) : [
      { nicNumber: '199512345678', userCode: 'UG-999', userName: 'Sample Profile' }
    ];

    const duplicateAccount = registeredNics.find(item => item.nicNumber === cleanNic && item.userCode !== currentUser.code);
    if (duplicateAccount) {
      toast.error(`මෙම හැඳුනුම්පත් අංකය (${cleanNic}) දැනටමත් වෙනත් ගිණුමකට (${duplicateAccount.userCode}) භාවිත කර ඇත! එකම ID එකෙන් ගිණුම් කිහිපයක් සෑදිය නොහැක.`, { duration: 6000 });
      return;
    }

    setIsSubmittingNic(true);
    try {
      await proposalApi.submitNICVerification({
        nicNumber: cleanNic,
        nicFront,
        nicBack,
        categoryBadge: currentUser.categoryBadge
      });
    } catch (err) {
      console.warn("Backend submitNICVerification fallback to local state", err);
    }
    setIsSubmittingNic(false);

    // Register this NIC to current user
    const updatedNics = registeredNics.filter(item => item.userCode !== currentUser.code);
    updatedNics.push({ nicNumber: cleanNic, userCode: currentUser.code, userName: currentUser.name || 'Member' });
    localStorage.setItem('unigang_registered_nics', JSON.stringify(updatedNics));

    const updatedStatus = 'pending_review';
    const updatedBadge = 'ID Review in Progress ⏳';
    const updatedUser = {
      ...currentUser,
      verificationStatus: updatedStatus,
      categoryBadge: updatedBadge,
      nicNumber: cleanNic,
      nicFront,
      nicBack,
      rejectionReason: null
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('userProposalProfile', JSON.stringify(updatedUser));

    toast.success('🛡️ ඔබගේ හැඳුනුම්පත සාර්ථකව Review සඳහා යොමු විය! පැය 12-24ක් ඇතුළත පරීක්ෂා කර Badge එක ලබාදෙනු ඇත. මේ අතරතුර ඔබට සුපුරුදු පරිදි Platform එකේ වැඩ කළ හැක.', { duration: 6000 });
    setIsVerificationModalOpen(false);
  };

  const handleAdminApprove = () => {
    const updatedUser = {
      ...currentUser,
      isVerified: true,
      verificationStatus: 'verified',
      categoryBadge: 'Campus Graduate 🎓',
      rejectionReason: null
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('userProposalProfile', JSON.stringify(updatedUser));
    toast.success('🎉 Admin Action: ID Verification Approved! "ID Verified ✓" badge is now active.');
  };

  const handleAdminReject = (reason = 'හැඳුනුම්පත අපැහැදිලියි (Blurry ID photo). කරුණාකර පැහැදිලිව නැවත upload කරන්න.') => {
    const updatedUser = {
      ...currentUser,
      isVerified: false,
      verificationStatus: 'rejected',
      categoryBadge: 'ID Verification Pending ⏳',
      rejectionReason: reason
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('userProposalProfile', JSON.stringify(updatedUser));
    toast.error(`⚠️ Admin Action: Verification Rejected! Reason: ${reason}`);
  };

  const handleResetProfile = () => {
    localStorage.removeItem('userHasProposalProfile');
    localStorage.removeItem('userProposalProfile');
    toast.success('Test profile reset! You can now test the form from scratch.');
    setPage('landing');
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-8 lg:px-12 py-8 font-sans transition-colors duration-300">
      
      {/* ============================================================== */}
      {/* 1. TOP PROFILE HEADER BANNER (PORONDU LANKA STYLE) */}
      {/* ============================================================== */}
      <div className="rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-rose-950/5 mb-8">
        
        {/* Colorful Gradient Cover Banner */}
        <div className="relative h-44 sm:h-56 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/20 blur-2xl pointer-events-none" />
          <div className="absolute left-1/3 -bottom-10 w-64 h-64 rounded-full bg-amber-300/20 blur-xl pointer-events-none" />
          
          {/* Top Cover Banner Navigation: Back to Landing on Left, Status + Reset on Right */}
          <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-10">
            <button
              onClick={() => setPage('landing')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-105"
            >
              <ArrowLeft size={13} />
              <span>Back to Landing</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-sm">
                <Sparkles size={12} className="text-amber-300" />
                <span>Uni Porondam Member</span>
              </span>

              <button
                type="button"
                onClick={handleResetProfile}
                title="Reset test profile to test onboarding from scratch"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-rose-950/80 backdrop-blur-md border border-white/20 text-white/90 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw size={12} />
                <span>Reset Test Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info Bar with Overlapping Avatar */}
        <div className="relative px-6 sm:px-10 pb-6 pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            {/* Left: Overlapping Circular Avatar + Name + Location */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-16 sm:-mt-20">
              
              {/* Overlapping Avatar */}
              <div className="relative group shrink-0">
                {currentUser.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name || 'Profile'}
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-2xl ring-2 ring-rose-500/20"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 text-white font-black text-3xl sm:text-4xl flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-2xl ring-2 ring-rose-500/20 uppercase">
                    {currentUser.name ? currentUser.name.charAt(0) : <User2 size={42} />}
                  </div>
                )}
                <button
                  onClick={() => handleOpenEditModal('personal')}
                  title="Change Photo"
                  className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-slate-900 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer border-2 border-white dark:border-slate-900"
                >
                  <Camera size={16} />
                </button>
              </div>

              {/* Name & Credentials */}
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {currentUser.name || 'සාමාජිකයා (Member)'}
                  </h1>

                  {/* Category / Verification Pill */}
                  {currentUser.verificationStatus === 'verified' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck size={14} /> ID Verified ✓
                    </span>
                  ) : currentUser.verificationStatus === 'pending_review' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      <Clock size={14} /> Verification Under Review ⏳
                    </span>
                  ) : currentUser.verificationStatus === 'rejected' ? (
                    <button
                      type="button"
                      onClick={() => setIsVerificationModalOpen(true)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 cursor-pointer"
                    >
                      <AlertCircle size={14} /> ID Rejected • Retry ✕
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                      {currentUser.categoryBadge || 'Uni Porondam Member 🎓'}
                    </span>
                  )}
                </div>

                {/* Subtext: Location | Age */}
                <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-rose-500" />
                    <span>
                      {currentUser.hometown && currentUser.district 
                        ? `${currentUser.hometown}, ${currentUser.district}`
                        : (currentUser.hometown || currentUser.district || 'ශ්‍රී ලංකාව')}
                    </span>
                  </span>
                  <span>•</span>
                  <span>{currentUser.age ? `${currentUser.age} වයස (Years)` : 'වයස දක්වා නැත'}</span>
                </div>
              </div>
            </div>

            {/* Right: Single Prominent "Bio-Data සංස්කරණය" Button + Settings Button */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => handleOpenEditModal('personal')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Pencil size={14} />
                <span>Bio-Data සංස්කරණය (Edit Bio-Data)</span>
              </button>

              <button
                onClick={() => setPage('settings')}
                title="Account Privacy, Photo Blur & Verification Settings"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-wider border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              >
                <Settings size={15} />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. PORONDU LANKA QUICK TABS NAVIGATION (DIRECTLY BELOW BANNER) */}
        {/* ============================================================== */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 px-6 sm:px-10 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Left: 3 Core Profile Tabs (Segmented Control - Fits perfectly on all screens without scrolling) */}
            <div className="inline-flex items-center p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-2xl w-full sm:w-auto">
              {/* Tab 1: Overview */}
              <button
                onClick={() => setActiveTab('overview')}
                className={cx(
                  "flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer",
                  activeTab === 'overview'
                    ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <FileText size={15} />
                <span>මගේ Bio-Data (Overview)</span>
              </button>

              {/* Tab 2: Photos */}
              <button
                onClick={() => setActiveTab('photos')}
                className={cx(
                  "flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer",
                  activeTab === 'photos'
                    ? "bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Camera size={15} />
                <span>ඡායාරූප (Photos)</span>
              </button>

              {/* Tab 3: Verification */}
              <button
                onClick={() => setActiveTab('verification')}
                className={cx(
                  "flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer",
                  activeTab === 'verification'
                    ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <ShieldCheck size={15} />
                <span>NIC Verification</span>
              </button>
            </div>

            {/* Right: Hub Actions (Discover Candidates, Shortlists, Chat, Notifications & Settings) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setPage('discover')}
                className="px-4 py-2 rounded-xl text-xs font-black bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Compass size={15} />
                <span className="hidden sm:inline">මනාලියන් / මනාලයන් සොයන්න (Discover)</span>
                <span className="sm:hidden">Discover</span>
              </button>

              {/* Saved Shortlists & Family Notes Button */}
              <button
                onClick={() => setIsShortlistModalOpen(true)}
                title="View Saved Shortlisted Profiles & Family Notes"
                className="px-3 py-2 rounded-xl text-xs font-black bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 border border-slate-200 dark:border-slate-700 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer relative"
              >
                <Bookmark size={15} className="text-amber-500" />
                <span className="hidden md:inline">කෙටි ලැයිස්තුව</span>
                {shortlists.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black flex items-center justify-center">
                    {shortlists.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setPage('inbox')}
                className="px-3.5 py-2 rounded-xl text-xs font-black bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-pink-600 border border-slate-200 dark:border-slate-700 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer relative"
              >
                <MessageCircle size={15} className="text-pink-500" />
                <span className="hidden md:inline">සාකච්ඡා (Chat)</span>
                {mutualMatchesList.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                )}
              </button>

              {/* In-App Notifications Bell Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  title="Proposal Notifications & System Alerts"
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-500 border border-slate-200 dark:border-slate-700 shadow-sm transition-all cursor-pointer relative"
                >
                  <Bell size={15} />
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-1" />
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 top-11 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-xs animate-fadeIn font-sans">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Bell size={13} className="text-rose-500" />
                        <span>දැනුම්දීම් (Notifications)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsNotificationOpen(false)}
                        className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-60 overflow-y-auto">
                      <div 
                        onClick={() => {
                          setIsNotificationOpen(false);
                          setPage('likes');
                        }}
                        className="p-2.5 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 cursor-pointer transition-colors"
                      >
                        <p className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                          <span>නව යෝජනා කැමැත්තක් 💌</span>
                          <span className="text-[9px] text-slate-400 font-normal">අද</span>
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          සාමාජිකයෙකු ඔබගේ Bio-Data පැතිකඩට කැමැත්ත ප්‍රකාශ කළා!
                        </p>
                      </div>

                      <div 
                        onClick={() => {
                          setIsNotificationOpen(false);
                          setActiveTab('verification');
                        }}
                        className="p-2.5 rounded-xl bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 cursor-pointer transition-colors"
                      >
                        <p className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                          <span>NIC සත්‍යාපන තත්ත්වය 🛡️</span>
                          <span className="text-[9px] text-slate-400 font-normal">ක්‍රියාත්මකයි</span>
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          ඔබගේ හැඳුනුම්පත Admin ආරක්ෂිත පරීක්ෂාව සඳහා යොමුව ඇත.
                        </p>
                      </div>

                      <div 
                        onClick={() => {
                          setIsNotificationOpen(false);
                          setActiveCardModal('views');
                        }}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        <p className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                          <span>Profile Views සටහන 👀</span>
                          <span className="text-[9px] text-slate-400 font-normal">සක්‍රීයයි</span>
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          සත්‍යාපිත සාමාජිකයින් ඔබගේ Profile එක නැරඹූ වාර ගණන {currentUser.profileViews || 1} කි.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setPage('settings')}
                title="Account Privacy, Photo Blur & Verification Settings"
                className="px-3 py-2 rounded-xl text-xs font-black bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Settings size={15} className="text-slate-500" />
                <span className="hidden lg:inline">Settings</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* 2.5 PROFILE PAUSED ALERT BANNER */}
      {(currentUser.is_paused || currentUser.isPaused) && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm font-sans animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 text-lg flex items-center justify-center shrink-0">
              ⏸️
            </div>
            <div>
              <p className="font-bold text-amber-600 dark:text-amber-400">
                ඔබගේ Profile එක දැනට Pause කර ඇත (Profile Paused)
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                සෙවුම් ප්‍රතිඵල (Search matches) වලින් ඔබගේ Bio-Data සැඟවී ඇත. නව යෝජනා ලැබීමට Profile එක නැවත සක්‍රීය කරන්න.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              try {
                await proposalApi.togglePauseProfile();
              } catch {}
              setCurrentUser((prev: any) => ({ ...prev, isPaused: false, is_paused: false }));
              const saved = localStorage.getItem('userProposalProfile');
              if (saved) {
                const parsed = JSON.parse(saved);
                parsed.isPaused = false;
                parsed.is_paused = false;
                localStorage.setItem('userProposalProfile', JSON.stringify(parsed));
              }
              toast.success("Profile යළි සක්‍රීය කරන ලදී! සෙවුම් වලදී ඔබගේ Bio-Data දැන් දිස්වේ. 🎉");
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            ▶️ Resume Profile (යළි සක්‍රීය කරන්න)
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. MAIN 2-COLUMN CONTENT SECTION (PORONDU LANKA GRID) */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN (7 COLS): BIO-DATA PROFILE DETAILS ── */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Profile Completion Highlight Banner */}
            <div 
              onClick={() => {
                const missingTab = (!currentUser.fatherProfession && !currentUser.motherProfession)
                  ? 'family'
                  : (!currentUser.lagna || !currentUser.nekatha)
                    ? 'horoscope'
                    : !currentUser.promptIdealPartner
                      ? 'expectations'
                      : 'personal';
                handleOpenEditModal(missingTab as any);
              }}
              className="bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-amber-500/10 border border-rose-500/20 rounded-[2rem] p-5 sm:p-6 shadow-sm cursor-pointer hover:border-rose-500/40 hover:shadow-md transition-all group"
              title="Click to directly complete your missing Bio-Data fields"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-rose-500/20 shrink-0 group-hover:scale-105 transition-transform">
                    {completionPercentage}%
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>සම්පූර්ණ Bio-Data තත්ත්වය (Profile Completion)</span>
                      <Sparkles size={14} className="text-rose-500" />
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {completionPercentage >= 90
                        ? 'ඔබගේ Bio-Data සම්පූර්ණයි! ඔබගේ profile එක දැන් අනෙක් සාමාජිකයන්ට ආකර්ෂණීයව දිස්වේ.'
                        : 'ඔබගේ පවුලේ විස්තර සහ සහකරු බලාපොරොත්තු සම්පූර්ණ කර 100% කරගන්න.'}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center">
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 text-xs font-bold flex items-center gap-1.5 shadow-sm group-hover:bg-rose-500 group-hover:text-white transition-all">
                    <Sparkles size={13} className="text-rose-500 group-hover:text-white" />
                    <span>{completionPercentage === 100 ? '100% Verified Profile' : 'අඩුපාඩු සම්පූර්ණ කරන්න →'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Card 1: පුද්ගලික තොරතුරු (Personal Details & Habits) */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                  <User2 size={20} className="text-rose-500" />
                  <span>පුද්ගලික තොරතුරු (Personal Details & Habits)</span>
                </h3>
                <button
                  onClick={() => handleOpenEditModal('personal')}
                  className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Edit <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                {/* 1. Full Name */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">සම්පූර්ණ නම (Full Name)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.name || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}
                  </span>
                </div>

                {/* 2. Age & Birthday */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">වයස සහ උපන් දිනය (Age & Birthday)</span>
                  <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                    <span>{currentUser.age ? `${currentUser.age} වයස (Years)` : 'නොදක්වා ඇත'}</span>
                    {currentUser.birthday && (
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        • {currentUser.birthday}
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. Gender */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">ස්ත්‍රී / පුරුෂ භාවය (Gender)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.gender || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}
                  </span>
                </div>

                {/* 4. Residency Country */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">පදිංචි රට (Residency Country)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.country || 'Sri Lanka'}
                  </span>
                </div>

                {/* 5. District & Hometown */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">දිස්ත්‍රික්කය සහ උපන් ගම (District & Hometown)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.hometown && currentUser.district 
                      ? `${currentUser.hometown}, ${currentUser.district}`
                      : (currentUser.hometown || currentUser.district || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>)}
                  </span>
                </div>

                {/* 6. Religion & Ethnicity */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">ආගම සහ ජාතිය (Religion & Ethnicity)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.religion || 'නොදක්වා ඇත'}{currentUser.ethnicity ? ` • ${currentUser.ethnicity}` : ''}
                  </span>
                </div>

                {/* 7. Caste */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">කුලය (Caste)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.caste || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}
                  </span>
                </div>

                {/* 8. Height */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">උස (Height)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.height || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}
                  </span>
                </div>

                {/* 9. Civil Status */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">විවාහක තත්ත්වය (Civil Status)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.civilStatus || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}
                  </span>
                </div>

                {/* 10. Habits & Diet - Displaying ALL 3 Habits with uniform badges */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">පුරුදු සහ ආහාර රටාව (Habits & Diet)</span>
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-[11px] shadow-xs">
                      {currentUser.drinking || 'Non-drinker'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-[11px] shadow-xs">
                      {currentUser.smoking || 'Non-smoker'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-[11px] shadow-xs">
                      {currentUser.diet || 'Non-Vegetarian'}
                    </span>
                  </div>
                </div>

                {/* 11. Phone Number */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 sm:col-span-2">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">දුරකථන / WhatsApp අංකය (Phone Number - Masked for Privacy)</span>
                  {currentUser.phone ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {currentUser.phone}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Mutual Accept වූ අයට පමණක් පෙනේ
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-normal italic">ඇතුළත් කර නොමැත</span>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2: අධ්‍යාපනය සහ රැකියාව (Education & Career) */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Briefcase size={20} className="text-indigo-500" />
                  <span>අධ්‍යාපනය සහ රැකියාව (Education & Career)</span>
                </h3>
                <button
                  onClick={() => handleOpenEditModal('career')}
                  className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Edit <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                {/* Official Category Badge */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 sm:col-span-2">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-indigo-500 mb-1">නිල Profile වර්ගය (Official Category Badge)</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 font-extrabold text-sm text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs">
                    <GraduationCap size={15} className="text-indigo-500" />
                    <span>{currentUser.categoryBadge || 'Campus Graduate 🎓'}</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">රැකියාව (Profession)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.profession || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">සේවා ස්ථානය (Workplace / Company)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.workplace || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">කැම්පස් / ආයතනය (University)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.university || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">අධ්‍යාපන සුදුසුකම (Education Degree)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.educationCategory || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 sm:col-span-2">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">මාසික ආදායම (Monthly Income)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.monthlyIncome || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: පවුලේ තොරතුරු (Family Information) */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Users size={20} className="text-amber-500" />
                  <span>පවුලේ තොරතුරු (Family Information)</span>
                </h3>
                <button
                  onClick={() => handleOpenEditModal('family')}
                  className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Edit <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                {/* Father Info */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-amber-500 font-bold">පියා පිළිබඳ තොරතුරු (Father)</span>
                  <div className="space-y-1.5 text-xs">
                    <p className="text-slate-500 dark:text-slate-400">රැකියාව: <strong className="text-slate-900 dark:text-white">{currentUser.fatherProfession || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}</strong></p>
                    <p className="text-slate-500 dark:text-slate-400">තත්ත්වය: <strong className="text-slate-900 dark:text-white">{currentUser.fatherStatus || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}</strong></p>
                    <p className="text-slate-500 dark:text-slate-400">ආගම: <strong className="text-slate-900 dark:text-white">{currentUser.fatherReligion || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}</strong></p>
                    <p className="text-slate-500 dark:text-slate-400">ජාතිය: <strong className="text-slate-900 dark:text-white">{currentUser.fatherEthnicity || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}</strong></p>
                  </div>
                </div>

                {/* Mother Info */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-amber-500 font-bold">මව පිළිබඳ තොරතුරු (Mother)</span>
                  <div className="space-y-1.5 text-xs">
                    <p className="text-slate-500 dark:text-slate-400">රැකියාව: <strong className="text-slate-900 dark:text-white">{currentUser.motherProfession || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}</strong></p>
                    <p className="text-slate-500 dark:text-slate-400">තත්ත්වය: <strong className="text-slate-900 dark:text-white">{currentUser.motherStatus || currentUser.motherCountry || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}</strong></p>
                    <p className="text-slate-500 dark:text-slate-400">ආගම: <strong className="text-slate-900 dark:text-white">{currentUser.motherReligion || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}</strong></p>
                    <p className="text-slate-500 dark:text-slate-400">ජාතිය: <strong className="text-slate-900 dark:text-white">{currentUser.motherEthnicity || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}</strong></p>
                  </div>
                </div>

                {/* Siblings */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 sm:col-span-2">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">සහෝදර සහෝදරියන් (Siblings & Status)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.siblings || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: සහකරු පිළිබඳ අපේක්ෂා & Bio (About Candidate & Partner Expectations) */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Sparkles size={20} className="text-pink-500" />
                  <span>සහකරු පිළිබඳ අපේක්ෂා & ජීවන රටාව (Expectations)</span>
                </h3>
                <button
                  onClick={() => handleOpenEditModal('expectations')}
                  className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Edit <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-4 text-xs font-medium">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">මා පිළිබඳව (About Me / Bio)</span>
                  <p className="text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                    {currentUser.bio || (
                      <span className="text-slate-400 dark:text-slate-500 italic flex items-center gap-1.5 font-normal">
                        <Info size={14} /> තවම හැඳින්වීමක් ඇතුළත් කර නොමැත. "Edit Bio-Data" වෙතින් එක් කළ හැක.
                      </span>
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
                    සහකරු / සහකාරිය පිළිබඳ අපේක්ෂා (Partner Preferences)
                  </span>
                  <p className="text-rose-900 dark:text-rose-200 font-bold leading-relaxed">
                    {currentUser.promptIdealPartner || (
                      <span className="text-rose-400/80 italic flex items-center gap-1.5 font-normal">
                        <Sparkles size={14} /> ඔබ අපේක්ෂා කරන සහකරු/සහකාරිය පිළිබඳ සටහනක් එක් කර නොමැත.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 5: කේන්දර සහ නැකත් විස්තර (Astrological & Horoscope Information) */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Moon size={20} className="text-purple-500" />
                  <span>කේන්දර සහ නැකත් විස්තර (Astrological Details)</span>
                </h3>
                <button
                  onClick={() => handleOpenEditModal('horoscope')}
                  className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Edit <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-0.5">ලග්නය (Lagna / Zodiac)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.lagna || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-0.5">නැකත (Nekatha / Birth Star)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.nekatha || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">ශනි / කුජ දෝෂ (Dosha Status)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.doshaStatus || <span className="text-slate-400 font-normal italic">දෝෂ රහිතයි</span>}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">කේන්දර ගැලපීම (Requirement)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.horoscopeMatchRequired || <span className="text-slate-400 font-normal italic">Must Match</span>}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">උපන් වේලාව (Birth Time)</span>
                  <span className="font-extrabold text-sm font-mono text-slate-900 dark:text-white">
                    {currentUser.birthTime || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">උපන් නගරය (Birth City)</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.birthCity || currentUser.district || <span className="text-slate-400 font-normal italic">නොදක්වා ඇත</span>}
                  </span>
                </div>

                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <FileText size={16} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                        කේන්දර පිටපත (Horoscope Chart Document)
                      </span>
                      {(currentUser.horoscopeDocUrl || currentUser.horoscope_doc_url) ? (
                        <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                          Verified Document Attached ✓
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal italic text-xs">
                          තවම කේන්දර කොපියක් හෝ Link එකක් එක් කර නොමැත
                        </span>
                      )}
                    </div>
                  </div>
                  {(currentUser.horoscopeDocUrl || currentUser.horoscope_doc_url) ? (
                    <a
                      href={currentUser.horoscopeDocUrl || currentUser.horoscope_doc_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/20 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      View Chart <ChevronRight size={13} />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal('horoscope')}
                      className="text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-xl border border-rose-500/20 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      + Add Link / Slip
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN (5 COLS): VERIFICATION, NOTIFICATIONS & QUICK STATS ── */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card 1: 🛡️ NIC / PASSPORT VERIFICATION GATE */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    අනන්‍යතාවය තහවුරු කිරීම (ID Verification)
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    100% Verified Community Standard
                  </p>
                </div>
              </div>

              {currentUser.verificationStatus === 'verified' ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-emerald-500" />
                      <span className="font-black text-sm">Identity Verified ✓</span>
                    </div>
                    {currentUser.nicNumber && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        NIC: {currentUser.nicNumber.slice(0, 4)}••••{currentUser.nicNumber.slice(-3)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                    ඔබගේ අනන්‍යතාවය ජාතික හැඳුනුම්පත මඟින් සාර්ථකව තහවුරු කර ඇත. ඔබගේ Profile එක විශ්වාසනීයත්වයෙන් ඉහළින්ම දිස්වේ.
                  </p>
                </div>
              ) : currentUser.verificationStatus === 'pending_review' ? (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-amber-500 animate-pulse" />
                      <span className="font-black text-sm">Review in Progress ⏳</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                      සාමාන්‍යයෙන් පැය 12-24
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300 font-medium">
                    ඔබගේ ජාතික හැඳුනුම්පත අපගේ Review Team එක විසින් පරීක්ෂා කරමින් පවතී.
                  </p>
                  <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-amber-500/20 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    💡 <strong>ගැටළුවක් නැත:</strong> Review එක සිදුවන අතරතුර ඔබට සාමාන්‍ය පරිදි Proposal සෙවීමට, බැලීමට හා Bio-Data සංස්කරණය කිරීමට පූර්ණ අවසර ඇත.
                  </div>
                  
                  {/* Admin Simulation Testing Trigger */}
                  <div className="pt-1 flex items-center justify-between border-t border-amber-500/20">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admin Test Tools:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleAdminApprove}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] cursor-pointer"
                        title="Simulate Admin Approving the ID"
                      >
                        Approve ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdminReject()}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] cursor-pointer"
                        title="Simulate Admin Rejecting the ID"
                      >
                        Reject ✕
                      </button>
                    </div>
                  </div>
                </div>
              ) : currentUser.verificationStatus === 'rejected' ? (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black">
                    <AlertCircle size={18} />
                    <span>හැඳුනුම්පත ප්‍රතික්ෂේප විය (Verification Rejected)</span>
                  </div>
                  <p className="text-xs text-rose-700 dark:text-rose-300">
                    හේතුව: <strong>{currentUser.rejectionReason || 'ඡායාරූපය අපැහැදිලි වීම හෝ නම නොගැළපීම'}</strong>
                  </p>
                  <button
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} />
                    <span>නැවත නිවැරදිව Upload කරන්න (Re-upload ID)</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <p className="font-bold text-slate-900 dark:text-white mb-1">🛡️ අනන්‍යතාවය තහවුරු කරන්න</p>
                    වංචනික ගිණුම්වලින් තොර 100% තහවුරු වූ සහකරුවන්/සහකාරියන් සමඟ විශ්වාසයෙන් සම්බන්ධ වීමට ඔබගේ ජාතික හැඳුනුම්පත (NIC) upload කරන්න.
                  </div>

                  <button
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload size={16} />
                    <span>Upload NIC / Passport Now</span>
                  </button>
                </div>
              )}
            </div>

            {/* Card 2: PORONDU LANKA STYLE NOTIFICATIONS TOGGLE */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Bell size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">දැනුම්දීම් (Notifications)</h4>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Proposals ලැබෙන විට instant alerts</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setNotificationsActive(!notificationsActive);
                    toast.success(notificationsActive ? 'Notifications Muted' : 'Notifications Activated (සක්‍රියයි)!');
                  }}
                  className={cx(
                    "px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border",
                    notificationsActive
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                  )}
                >
                  {notificationsActive ? 'සක්‍රියයි (Active)' : 'අක්‍රියයි'}
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                යමෙකු ඔබට යෝජනාවක් එවූ විට හෝ ඔබේ යෝජනාව පිළිගත් විට SMS / Web Notification එකක් ලැබේ.
              </p>
            </div>

            {/* Card 3: 4 INTERACTIVE METRIC CARDS */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { 
                  id: 'sent', 
                  label: "Proposals Sent", 
                  sinhala: "යවන ලද යෝජනා", 
                  value: sentProposalsList.length, 
                  icon: Send, 
                  color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
                  onClick: () => setActiveCardModal('sent')
                },
                { 
                  id: 'received', 
                  label: "Proposals Received", 
                  sinhala: "ලැබුණු යෝජනා", 
                  value: receivedProposalsList.length, 
                  icon: Inbox, 
                  color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20", 
                  onClick: () => setActiveCardModal('received') 
                },
                { 
                  id: 'views', 
                  label: "Profile Views", 
                  sinhala: "බැලූ වාර ගණන", 
                  value: currentUser.profileViews, 
                  icon: Eye, 
                  color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20", 
                  onClick: () => setActiveCardModal('views') 
                },
                { 
                  id: 'matches', 
                  label: "Mutual Matches", 
                  sinhala: "ගැලපුණු යෝජනා", 
                  value: mutualMatchesList.length, 
                  icon: Heart, 
                  color: "text-pink-500 bg-pink-500/10 border-pink-500/20",
                  onClick: () => setActiveCardModal('matches')
                },
              ].map((s) => (
                <div 
                  key={s.label} 
                  onClick={s.onClick}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-rose-400 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${s.color}`}>
                      <s.icon size={15} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {s.value}
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{s.label}</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sinhala truncate">{s.sinhala}</p>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 4. NIC VERIFICATION TAB VIEW */}
      {/* ============================================================== */}
      {activeTab === 'verification' && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  ජාතික හැඳුනුම්පත් (NIC) තහවුරු කිරීම
                </h2>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  National Identity Card / Passport Verification Gate
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className="text-xs font-black text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Back to Overview ✕
            </button>
          </div>

          <form onSubmit={handleSubmitVerification} className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="font-bold text-emerald-700 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                <Lock size={14} /> 100% Private & Confidential
              </p>
              ඔබගේ හැඳුනුම්පත් ඡායාරූප වෙනත් කිසිදු සාමාජිකයෙකුට නොපෙනේ. එය භාවිතා කරන්නේ අපගේ admin කණ්ඩායම විසින් ඔබගේ අනන්‍යතාවය තහවුරු කිරීමට පමණි.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* NIC Front */}
              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  1. හැඳුනුම්පතේ ඉදිරිපස (Front Side) *
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-3xl p-6 text-center cursor-pointer relative bg-slate-50 dark:bg-slate-850 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'front')}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {nicFront ? (
                    <div className="relative">
                      <img src={nicFront} alt="NIC Front" className="h-36 mx-auto rounded-xl object-contain shadow-md" />
                      <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <Check size={12} /> Front Uploaded
                      </span>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Upload size={28} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to upload Front photo</p>
                      <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* NIC Back */}
              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  2. හැඳුනුම්පතේ පසුපස (Back Side) *
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-3xl p-6 text-center cursor-pointer relative bg-slate-50 dark:bg-slate-850 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'back')}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {nicBack ? (
                    <div className="relative">
                      <img src={nicBack} alt="NIC Back" className="h-36 mx-auto rounded-xl object-contain shadow-md" />
                      <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <Check size={12} /> Back Uploaded
                      </span>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Upload size={28} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to upload Back photo</p>
                      <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingNic || !nicFront || !nicBack}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmittingNic ? (
                  <span>Submitting for Review...</span>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Submit NIC for Verification</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. PHOTOS & PRIVACY TAB VIEW */}
      {/* ============================================================== */}
      {activeTab === 'photos' && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
                <Camera size={24} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  ඡායාරූප සහ රහස්‍යභාවය (Photos & Privacy)
                </h2>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Manage gallery & photo blur settings
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className="text-xs font-black text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Back to Overview ✕
            </button>
          </div>

          <div className="space-y-6">
            
            {/* Privacy Blur Toggle Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Lock size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    ඡායාරූප ප්‍රසිද්ධියේ Blur කර තබන්න (Privacy Blur)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ඔබ proposal එකක් mutually accept කළ පසු පමණක් ඡායාරූප unblur වේ.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setBlurPhotosActive(!blurPhotosActive);
                  toast.success(blurPhotosActive ? 'Photo Blur Turned Off (Photos Public)' : 'Photo Blur Activated (Photos Protected)!');
                }}
                className={cx(
                  "px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border",
                  blurPhotosActive
                    ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                )}
              >
                {blurPhotosActive ? '🔒 Protected (Blur ON)' : '🔓 Public (Blur OFF)'}
              </button>
            </div>

            {/* Photo Gallery Grid */}
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                My Uploaded Photos ({currentUser.images?.length || 0}/4)
              </h4>
              {(!currentUser.images || currentUser.images.length === 0) ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-850">
                  <Camera className="mx-auto text-slate-400 mb-2" size={32} />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">තවම ඡායාරූප ඇතුළත් කර නොමැත</p>
                  <p className="text-[10px] text-slate-400 mt-1">ඡායාරූප ඇතුළත් කිරීමෙන් ඔබගේ Bio-Data වලට වැඩි ප්‍රතිචාර ලැබේ.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {currentUser.images.map((imgUrl: string, idx: number) => (
                    <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm group">
                      <img 
                        src={imgUrl} 
                        alt={`Photo ${idx + 1}`} 
                        className={cx(
                          "w-full h-full object-cover transition-all",
                          blurPhotosActive && "blur-md scale-105"
                        )} 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white bg-black/60 px-2.5 py-1 rounded-full">
                          Photo {idx + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setPage('profile')}
              className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              Upload / Replace Photos in Edit Bio-Data
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. POPUP MODALS: PROPOSALS SENT / RECEIVED / VIEWS / MATCHES */}
      {/* ============================================================== */}
      
      {/* 1. PROPOSALS SENT MODAL */}
      {activeCardModal === 'sent' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button 
              onClick={() => setActiveCardModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
                <Send size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Proposals Sent (යවන ලද යෝජනා)</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Proposals you have expressed interest in</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 my-2">
              {sentProposalsList.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{item.name} <span className="text-xs text-slate-500 font-medium">({item.code})</span></h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.age} yrs • {item.district} • {item.profession}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {item.status}
                    </span>
                    <button
                      onClick={() => {
                        setActiveCardModal(null);
                        openProfile(item);
                      }}
                      className="text-[11px] font-extrabold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={12} /> View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveCardModal(null)}
              className="mt-4 w-full py-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-colors cursor-pointer text-center"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* 2. PROPOSALS RECEIVED MODAL */}
      {activeCardModal === 'received' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button 
              onClick={() => setActiveCardModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
                <Inbox size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Proposals Received (ලැබුණු යෝජනා)</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Accept to unblur photos and open private chat</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 my-2">
              {receivedProposalsList.length === 0 ? (
                <p className="text-center text-slate-400 text-xs py-8">No pending received proposals.</p>
              ) : (
                receivedProposalsList.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{item.name} <span className="text-xs text-slate-500 font-medium">({item.code})</span></h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.age} yrs • {item.district} • {item.profession}</p>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{item.receivedDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleDeclineReceivedProposal(item)}
                        className="flex-1 sm:flex-initial py-2 px-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black text-xs hover:bg-rose-500/20 transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAcceptReceivedProposal(item)}
                        className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-md shadow-emerald-500/20 transition-colors"
                      >
                        Accept 💕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setActiveCardModal(null)}
              className="mt-4 w-full py-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-colors cursor-pointer text-center"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* 3. PROFILE VIEWS MODAL */}
      {activeCardModal === 'views' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button 
              onClick={() => setActiveCardModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-500 shrink-0">
                <Eye size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Profile Viewers (පැමිණි නරඹන්නන්)</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Candidates who recently viewed your proposal profile</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 my-2">
              {profileViewersList.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{item.name} <span className="text-xs text-slate-500 font-medium">({item.code})</span></h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.age} yrs • {item.district} • {item.profession}</p>
                      <span className="text-[10px] text-indigo-500 font-semibold flex items-center gap-1 mt-0.5"><Clock size={10} /> Viewed {item.viewedTime}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveCardModal(null);
                      openProfile(item);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-rose-500 hover:text-white font-extrabold text-xs transition-colors shrink-0 cursor-pointer"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveCardModal(null)}
              className="mt-4 w-full py-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-colors cursor-pointer text-center"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* 4. MUTUAL MATCHES MODAL */}
      {activeCardModal === 'matches' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button 
              onClick={() => setActiveCardModal(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-500 shrink-0">
                <Heart size={22} strokeWidth={2.5} fill="currentColor" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Mutual Matches (ගැලපුණු යෝජනා)</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mutually accepted profiles ready to chat</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 my-2">
              {mutualMatchesList.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{item.name} <span className="text-xs text-slate-500 font-medium">({item.code})</span></h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.age} yrs • {item.district} • {item.profession}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveCardModal(null);
                      setPage('inbox');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-xs shadow-md shadow-rose-500/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <MessageCircle size={14} /> Chat
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveCardModal(null)}
              className="mt-4 w-full py-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-colors cursor-pointer text-center"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. INTERACTIVE EDIT BIO-DATA MODAL (POPUPS ON EDIT CLICK) */}
      {/* ============================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-3xl rounded-[2.5rem] shadow-2xl p-6 sm:p-8 relative max-h-[90vh] flex flex-col font-sans">
            
            {/* Close Button */}
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 shrink-0">
                <Pencil size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Bio-Data සහ ගිණුමේ විස්තර සංස්කරණය
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  මෙහි ඇතුළත් කරන සියලු විස්තර අන් අයට පෙනෙන ඔබගේ Bio-Data පත්‍රිකාවට යාවත්කාලීන වේ.
                </p>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setEditTab('personal')}
                className={cx(
                  "px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0",
                  editTab === 'personal'
                    ? "bg-rose-500 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                👤 පුද්ගලික තොරතුරු
              </button>
              <button
                type="button"
                onClick={() => setEditTab('career')}
                className={cx(
                  "px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0",
                  editTab === 'career'
                    ? "bg-rose-500 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                💼 අධ්‍යාපනය & රැකියාව
              </button>
              <button
                type="button"
                onClick={() => setEditTab('family')}
                className={cx(
                  "px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0",
                  editTab === 'family'
                    ? "bg-rose-500 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                👨‍👩‍👧‍👦 පවුලේ තොරතුරු
              </button>
              <button
                type="button"
                onClick={() => setEditTab('expectations')}
                className={cx(
                  "px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0",
                  editTab === 'expectations'
                    ? "bg-rose-500 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                💍 සහකරු බලාපොරොත්තු
              </button>
              <button
                type="button"
                onClick={() => setEditTab('horoscope')}
                className={cx(
                  "px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0",
                  editTab === 'horoscope'
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50"
                )}
              >
                ✨ කේන්දර & නැකත්
              </button>
            </div>

            {/* Modal Form Scrollable Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 text-xs font-medium">
              
              {/* Tab 1: Personal */}
              {editTab === 'personal' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">සම්පූර්ණ නම (Full Name) *</label>
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">වයස (Age) *</label>
                    <input
                      type="number"
                      value={editFormData.age || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">ස්ත්‍රී / පුරුෂ භාවය (Gender) *</label>
                    <select
                      value={editFormData.gender || 'Male'}
                      onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    >
                      <option value="Male">Male (මනාලයෙක් / පිරිමි)</option>
                      <option value="Female">Female (මනාලියක් / ගැහැණු)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">උපන් දිනය (Birthday)</label>
                    <input
                      type="date"
                      value={editFormData.birthday || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, birthday: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">උස (Height)</label>
                    <input
                      type="text"
                      placeholder="e.g. 5.8 ft"
                      value={editFormData.height || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, height: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">විවාහක තත්ත්වය</label>
                    <select
                      value={editFormData.civilStatus || 'Never Married (අවිවාහක)'}
                      onChange={(e) => setEditFormData({ ...editFormData, civilStatus: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    >
                      <option>Never Married (අවිවාහක)</option>
                      <option>Divorced (දික්කසාද වූ)</option>
                      <option>Widowed (වැන්දඹු)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">පදිංචි රට (Residency Country)</label>
                    <input
                      type="text"
                      placeholder="e.g. Sri Lanka, UAE, UK"
                      value={editFormData.country || 'Sri Lanka'}
                      onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">ආගම (Religion)</label>
                    <select
                      value={editFormData.religion || 'Buddhist'}
                      onChange={(e) => setEditFormData({ ...editFormData, religion: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    >
                      <option>Buddhist</option>
                      <option>Christian / Catholic</option>
                      <option>Hindu</option>
                      <option>Islam</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">ජාතිය සහ කුලය (Ethnicity & Caste)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Ethnicity (ජාතිය)"
                        value={editFormData.ethnicity || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, ethnicity: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Caste (කුලය)"
                        value={editFormData.caste || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, caste: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">දිස්ත්‍රික්කය & උපන් ගම</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="District (දිස්ත්‍රික්කය)"
                        value={editFormData.district || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Hometown (ගම/නගරය)"
                        value={editFormData.hometown || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, hometown: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      දුරකථන / WhatsApp අංකය (Contact Number - Privately Saved)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 077 123 4567"
                      value={editFormData.phone || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value, whatsapp_number: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">පුරුදු (Habits & Diet)</label>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={editFormData.drinking || 'Non-drinker'}
                        onChange={(e) => setEditFormData({ ...editFormData, drinking: e.target.value })}
                        className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-[11px]"
                      >
                        <option>Non-drinker</option>
                        <option>Social Drinker</option>
                        <option>Regular</option>
                      </select>
                      <select
                        value={editFormData.smoking || 'Non-smoker'}
                        onChange={(e) => setEditFormData({ ...editFormData, smoking: e.target.value })}
                        className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-[11px]"
                      >
                        <option>Non-smoker</option>
                        <option>Occasional</option>
                        <option>Smoker</option>
                      </select>
                      <select
                        value={editFormData.diet || 'Non-Vegetarian'}
                        onChange={(e) => setEditFormData({ ...editFormData, diet: e.target.value })}
                        className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-[11px]"
                      >
                        <option>Non-Vegetarian</option>
                        <option>Vegetarian</option>
                        <option>Vegan</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Career & Education */}
              {editTab === 'career' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      නිල Profile කාණ්ඩය (Official Category Badge)
                    </label>
                    <select
                      value={editFormData.categoryBadge || 'Campus Graduate 🎓'}
                      onChange={(e) => setEditFormData({ ...editFormData, categoryBadge: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    >
                      <option value="Campus Graduate 🎓">🎓 Campus Graduate (උපාධිධාරී)</option>
                      <option value="Campus Undergrad 🏛️">🏛️ Campus Undergrad (විශ්වවිද්‍යාල ශිෂ්‍ය)</option>
                      <option value="Higher Edu Verified 📜">📜 Higher Edu Verified (ඩිප්ලෝමා / NVQ / පාඨමාලා)</option>
                      <option value="Working Professional 💼 / Abroad ✈️">💼 Working Professional / Abroad</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">රැකියාව (Profession) *</label>
                    <input
                      type="text"
                      placeholder="e.g. Doctor, Software Engineer"
                      value={editFormData.profession || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, profession: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">සේවා ස්ථානය (Workplace / Company)</label>
                    <input
                      type="text"
                      placeholder="e.g. Ministry of Health, Private Firm"
                      value={editFormData.workplace || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, workplace: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">කැම්පස් එක / ආයතනය (University)</label>
                    <input
                      type="text"
                      placeholder="e.g. University of Moratuwa"
                      value={editFormData.university || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, university: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">අධ්‍යාපන සුදුසුකම (Education Degree)</label>
                    <input
                      type="text"
                      placeholder="e.g. University Degree (BSc)"
                      value={editFormData.educationCategory || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, educationCategory: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">මාසික ආදායම (Monthly Income)</label>
                    <select
                      value={editFormData.monthlyIncome || 'Rs 200,000 - Rs 300,000'}
                      onChange={(e) => setEditFormData({ ...editFormData, monthlyIncome: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    >
                      <option>Below Rs 100,000</option>
                      <option>Rs 100,000 - Rs 200,000</option>
                      <option>Rs 200,000 - Rs 350,000</option>
                      <option>Rs 350,000 - Rs 500,000</option>
                      <option>Rs 500,000+</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Tab 3: Family Information */}
              {editTab === 'family' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-3">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-amber-500">පියා පිළිබඳ තොරතුරු (Father)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">පියාගේ රැකියාව (Father's Profession)</label>
                        <input
                          type="text"
                          placeholder="e.g. Businessman, Government Officer"
                          value={editFormData.fatherProfession || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, fatherProfession: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">තත්ත්වය (Father's Status)</label>
                        <input
                          type="text"
                          placeholder="e.g. Active / Retired / Deceased"
                          value={editFormData.fatherStatus || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, fatherStatus: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">පියාගේ ආගම (Religion)</label>
                        <input
                          type="text"
                          placeholder="e.g. Buddhist"
                          value={editFormData.fatherReligion || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, fatherReligion: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">පියාගේ ජාතිය (Ethnicity)</label>
                        <input
                          type="text"
                          placeholder="e.g. Sinhalese"
                          value={editFormData.fatherEthnicity || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, fatherEthnicity: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-3">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-amber-500">මව පිළිබඳ තොරතුරු (Mother)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">මවගේ රැකියාව (Mother's Profession)</label>
                        <input
                          type="text"
                          placeholder="e.g. Teacher, Housewife"
                          value={editFormData.motherProfession || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, motherProfession: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">තත්ත්වය (Mother's Status)</label>
                        <input
                          type="text"
                          placeholder="e.g. Active / Retired / Housewife / Deceased"
                          value={editFormData.motherStatus || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, motherStatus: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">මවගේ ආගම (Religion)</label>
                        <input
                          type="text"
                          placeholder="e.g. Buddhist"
                          value={editFormData.motherReligion || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, motherReligion: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">මවගේ ජාතිය (Ethnicity)</label>
                        <input
                          type="text"
                          placeholder="e.g. Sinhalese"
                          value={editFormData.motherEthnicity || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, motherEthnicity: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">සහෝදර සහෝදරියන් (Siblings & Status)</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Brother, 1 Sister (Respectable Family)"
                      value={editFormData.siblings || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, siblings: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>
              )}

              {/* Tab 4: Partner Expectations & Bio */}
              {editTab === 'expectations' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                      තමන් පිළිබඳ කෙටි හැඳින්වීමක් (About Me / Bio)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="ඔබගේ චරිත ස්වභාවය සහ ජීවන රටාව පිළිබඳව කෙටියෙන්..."
                      value={editFormData.bio || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-rose-500 mb-1">
                      සහකරු / සහකාරිය පිළිබඳ බලාපොරොත්තු (Partner Preferences)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="ඔබ අපේක්ෂා කරන සහකරුගේ අධ්‍යාපනය, රැකියාව, ගුණධර්ම ආදිය..."
                      value={editFormData.promptIdealPartner || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, promptIdealPartner: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Tab 5: Horoscope & Astrological Info */}
              {editTab === 'horoscope' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 space-y-3">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      කේන්දර සහ නැකත් විස්තර (Astrological Information)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-1">ලග්නය (Lagna / Zodiac Sign)</label>
                        <select
                          value={editFormData.lagna || 'කන්‍යා (Virgo)'}
                          onChange={(e) => setEditFormData({ ...editFormData, lagna: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                        >
                          <option value="මේෂ (Aries)">මේෂ (Aries)</option>
                          <option value="වෘෂභ (Taurus)">වෘෂභ (Taurus)</option>
                          <option value="මිථුන (Gemini)">මිථුන (Gemini)</option>
                          <option value="කටක (Cancer)">කටක (Cancer)</option>
                          <option value="සිංහ (Leo)">සිංහ (Leo)</option>
                          <option value="කන්‍යා (Virgo)">කන්‍යා (Virgo)</option>
                          <option value="තුලා (Libra)">තුලා (Libra)</option>
                          <option value="වෘශ්චික (Scorpio)">වෘශ්චික (Scorpio)</option>
                          <option value="ධනු (Sagittarius)">ධනු (Sagittarius)</option>
                          <option value="මකර (Capricorn)">මකර (Capricorn)</option>
                          <option value="කුම්භ (Aquarius)">කුම්භ (Aquarius)</option>
                          <option value="මීන (Pisces)">මීන (Pisces)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-1">නැකත (Nekatha / Birth Star)</label>
                        <input
                          type="text"
                          placeholder="e.g. හත, අස්විද, රෙහෙණ..."
                          value={editFormData.nekatha || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, nekatha: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-1">ශනි / කුජ දෝෂ තත්ත්වය (Dosha Status)</label>
                        <select
                          value={editFormData.doshaStatus || 'None (දෝෂ රහිතයි)'}
                          onChange={(e) => setEditFormData({ ...editFormData, doshaStatus: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                        >
                          <option value="None (දෝෂ රහිතයි)">None (දෝෂ රහිතයි)</option>
                          <option value="Kuja Dosha (කුජ 7 හෝ 8 ඇත)">Kuja Dosha (කුජ 7 හෝ 8 ඇත)</option>
                          <option value="Shani Dosha (ශනි දෝෂ ඇත)">Shani Dosha (ශනි දෝෂ ඇත)</option>
                          <option value="Not Checked (නොදනී / අදාළ නොවේ)">Not Checked (නොදනී / අදාළ නොවේ)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-1">කේන්දර ගැලපීම (Matching Requirement)</label>
                        <select
                          value={editFormData.horoscopeMatchRequired || 'Must Match (අත්‍යවශ්‍යයි)'}
                          onChange={(e) => setEditFormData({ ...editFormData, horoscopeMatchRequired: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                        >
                          <option value="Must Match (අත්‍යවශ්‍යයි)">Must Match (අත්‍යවශ්‍යයි)</option>
                          <option value="Preferred (කැමතියි)">Preferred (කැමතියි)</option>
                          <option value="Not Strict (විශේෂ සැලකිල්ලක් නැත)">Not Strict (විශේෂ සැලකිල්ලක් නැත)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-1">උපන් නිවැරදි වේලාව (Birth Time)</label>
                        <input
                          type="text"
                          placeholder="e.g. පෙ.ව. 08:42"
                          value={editFormData.birthTime || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, birthTime: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold font-mono"
                        />
                        <span className="text-[9px] text-slate-400 font-normal block mt-1">(විකල්ප / Optional - නොදන්නේ නම් හිස්ව තබන්න)</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-1">උපන් ස්ථානය/නගරය (Birth City)</label>
                        <input
                          type="text"
                          placeholder="e.g. කොළඹ, මහනුවර..."
                          value={editFormData.birthCity || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, birthCity: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                        />
                        <span className="text-[9px] text-slate-400 font-normal block mt-1">(විකල්ප / Optional)</span>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-black text-slate-500 mb-1">
                          කේන්දර පිටපත (Horoscope Chart Image / PDF)
                        </label>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="e.g. Image URL හෝ Cloud Drive Link එකක් මෙතැනට paste කරන්න"
                            value={editFormData.horoscopeDocUrl || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, horoscopeDocUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs"
                          />
                          <div className="flex items-center gap-2">
                            <label className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-xs border border-purple-500/20 cursor-pointer transition-colors inline-flex items-center gap-1.5">
                              <Upload size={14} />
                              <span>Upload from Device (Image / PDF)</span>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setEditFormData({ ...editFormData, horoscopeDocUrl: reader.result as string });
                                      toast.success("Horoscope document loaded successfully! 📜");
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            {editFormData.horoscopeDocUrl && (
                              <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                                <Check size={13} /> Document Attached
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                අවලංගු කරන්න (Cancel)
              </button>
              <button
                type="button"
                onClick={handleSaveBioData}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-xs shadow-md shadow-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={16} />
                <span>සුරකින්න (Save Bio-Data)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. ID VERIFICATION UPLOAD MODAL */}
      {/* ============================================================== */}
      {isVerificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-xl max-h-[92vh] flex flex-col p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    ජාතික හැඳුනුම්පත තහවුරු කිරීම (ID Verification)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    100% Real Members Only Community Standard
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVerificationModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Rejection Notice if any */}
            {currentUser.verificationStatus === 'rejected' && currentUser.rejectionReason && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
                ⚠️ කලින් ප්‍රතික්ෂේප වීමට හේතුව: <strong>{currentUser.rejectionReason}</strong>. කරුණාකර නිවැරදි පැහැදිලි ඡායාරූප ලබාදෙන්න.
              </div>
            )}

            {currentUser.verificationStatus === 'pending_review' ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                  <Clock size={32} />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h4 className="text-base font-black text-slate-900 dark:text-white">හැඳුනුම්පත Review වෙමින් පවතී (Under Review) ⏳</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sinhala">
                    ඔබගේ ජාතික හැඳුනුම්පත ({currentUser.nicNumber || 'NIC'}) සාර්ථකව ලැබී ඇති අතර, පැය 12-24ක් ඇතුළත අපගේ පරිපාලක මණ්ඩලය විසින් තහවුරු කරනු ඇත. මේ අතරතුර ඔබට සුපුරුදු පරිදි Profiles නැරඹිය හැක.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 w-full max-w-sm">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ Front & Back ඡායාරූප ලැබී ඇත</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVerificationModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
                >
                  හරි, තේරුණා (Close)
                </button>
              </div>
            ) : (
            /* Modal Body Form */
            <form onSubmit={handleSubmitVerification} className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-4 text-xs font-medium">
              
              {/* Privacy Guarantee Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 leading-relaxed space-y-1">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Lock size={14} className="text-emerald-500" />
                  <span>100% රහස්‍යතා ආරක්ෂාව (Privacy Guaranteed):</span>
                </p>
                <p className="text-[11px]">
                  ඔබගේ ජාතික හැඳුනුම්පත කිසිදු සාමාජිකයෙකුට හෝ බාහිර පාර්ශවයකට නොපෙනෙන අතර, අපගේ Review Team එක මඟින් නම සහ වයස තහවුරු කිරීමට පමණක් රහසිගතව පරීක්ෂා කෙරේ.
                </p>
              </div>

              {/* Input 1: NIC Number */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  ජාතික හැඳුනුම්පත් අංකය (National Identity Card Number - NIC) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 199812345678 හෝ 981234567V"
                  value={nicNumberInput}
                  onChange={(e) => setNicNumberInput(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm tracking-wider uppercase"
                />
                <span className="block text-[10px] text-slate-400 mt-1">
                  පැරණි NIC (අංක 9 + V) හෝ නව Smart NIC (අංක 12). එකම හැඳුනුම්පතෙන් ගිණුම් කිහිපයක් සෑදිය නොහැක.
                </span>
              </div>

              {/* Upload 1: NIC Front Photo */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  හැඳුනුම්පතේ ඉදිරිපස ඡායාරූපය (Front Side Photo) *
                </label>
                {nicFront ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/50 h-36 bg-slate-900 group">
                    <img src={nicFront} alt="NIC Front" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold cursor-pointer">
                        වෙනස් කරන්න
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'front')} className="hidden" />
                      </label>
                    </div>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                      VERIFIED ONLY FOR THE-UNI-GANG
                    </span>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 hover:bg-emerald-500/5 transition-all">
                    <Camera size={26} className="text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Front Photo එක Upload කරන්න</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG (පැහැදිලි ඡායාරූපයක් විය යුතුය)</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'front')} className="hidden" />
                  </label>
                )}
              </div>

              {/* Upload 2: NIC Back Photo */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  හැඳුනුම්පතේ පසුපස ඡායාරූපය (Back Side Photo) *
                </label>
                {nicBack ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/50 h-36 bg-slate-900 group">
                    <img src={nicBack} alt="NIC Back" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold cursor-pointer">
                        වෙනස් කරන්න
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'back')} className="hidden" />
                      </label>
                    </div>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                      VERIFIED ONLY FOR THE-UNI-GANG
                    </span>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 hover:bg-emerald-500/5 transition-all">
                    <Camera size={26} className="text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Back Photo එක Upload කරන්න</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'back')} className="hidden" />
                  </label>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsVerificationModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  අවලංගු කරන්න (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNic || !nicFront || !nicBack}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-black text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmittingNic ? (
                    <>
                      <Clock size={16} className="animate-spin" />
                      <span>යොමු කරමින් පවතී...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>තහවුරු කිරීමට ඉදිරිපත් කරන්න</span>
                    </>
                  )}
                </button>
              </div>

            </form>
            )}

          </div>
        </div>
      )}

      {/* 5. SHORTLIST & FAMILY NOTES MODAL */}
      {isShortlistModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                  <Bookmark size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Saved Shortlist & Family Notes (කෙටි ලැයිස්තුව)
                  </h3>
                  <p className="text-xs text-slate-500">
                    {shortlists.length} Profiles saved with private family observations
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShortlistModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {shortlists.length === 0 ? (
                <div className="py-16 text-center">
                  <Bookmark size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">කෙටි ලැයිස්තුව හිස්ය</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                    Discover පිටුවෙන් ඔබ කැමති profiles තෝරා 'Shortlist & Notes' ක්ලික් කර පවුලේ සටහන් එක්කරගන්න.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsShortlistModalOpen(false);
                      setPage('discover');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-colors cursor-pointer"
                  >
                    මනාලියන් / මනාලයන් සොයන්න →
                  </button>
                </div>
              ) : (
                shortlists.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-200 dark:border-slate-600">
                        <img
                          src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">{item.name}</h4>
                          <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                            {item.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.profession || 'Professional'} • {item.district || 'Sri Lanka'}
                        </p>
                        {item.note && (
                          <div className="mt-2 text-xs bg-amber-500/10 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/20 font-medium">
                            <span className="font-bold">📝 Family Note: </span>
                            {item.note}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setIsShortlistModalOpen(false);
                          openProfile(item.candidate || item);
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition-colors cursor-pointer"
                      >
                        View Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveShortlist(item.id)}
                        title="Remove from shortlist"
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
