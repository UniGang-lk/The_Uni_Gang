import { PageBreadcrumb } from '../components/ui/PageBreadcrumb';
import { LuPlus, LuListOrdered } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard';
import AnnexAdForm from './annex/AnnexAdForm';
import MyAdsList from './annex/MyAdsList';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';
import { Annex } from '../types/annex';
import { SubmissionSuccessModal } from '../components/ui/SubmissionSuccessModal';

import PremiumPageLoader from '../components/ui/PremiumPageLoader';
import { motion, AnimatePresence } from 'framer-motion';

const PostAdPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'postAdForm' | 'myAds'>('postAdForm');
  const [editingAd, setEditingAd] = useState<any | null>(null);
  const [myAds, setMyAds] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditSuccess, setIsEditSuccess] = useState(false);

  const fetchMyAds = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/annexes/my-listings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMyAds(Array.isArray(data) ? data : (data.data || []));
      }
    } catch (err) {
      console.error('Failed to load my ads:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsLoggedIn(true);
      setCurrentView('postAdForm');
      fetchMyAds();
    }

    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (tab === 'myAds') {
      setCurrentView('myAds');
      fetchMyAds();
    }
    const editId = searchParams.get('editAd');
    if (editId) {
      const token = localStorage.getItem('userToken');
      if (token) {
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/annexes/${editId}`)
          .then(res => res.json())
          .then(data => {
            const ad = data?.data || data;
            if (ad) {
              setEditingAd(ad);
              setCurrentView('postAdForm');
            }
          })
          .catch(console.error);
      }
    }
  }, [tab, isLoggedIn, searchParams]);

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    fetchMyAds();

    const returnUrl = searchParams.get('returnUrl');
    const redirectParam = searchParams.get('redirect');

    if (returnUrl) {
      navigate(decodeURIComponent(returnUrl), { replace: true });
      return;
    }

    if (redirectParam === 'home') {
      navigate('/', { replace: true });
      return;
    }

    // Default: If user came directly to post an ad, show postAdForm
    setCurrentView('postAdForm');
  };

  const handleAnnexFormSubmit = async (adData: any, isEditing: boolean) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error('Session expired. Please log in again.');
      setIsLoggedIn(false);
      return;
    }

    // Use isSubmitting instead of loading so we don't unmount the Leaflet map mid-submission
    setIsSubmitting(true);
    const toastId = toast.loading(isEditing ? 'Updating your listing...' : 'Publishing your advertisement...');
    try {
      // Build description — never allow empty string (DB column is NOT NULL)
      const builtDescription = [
        adData.houseRules ? `House Rules: ${adData.houseRules}` : '',
        adData.description || ''
      ].filter(Boolean).join('\n') || 'No description provided.';

      const formData = new FormData();
      formData.append('title', adData.title);
      formData.append('description', builtDescription);
      formData.append('price', adData.monthlyRent);
      formData.append('address', adData.address);
      formData.append('beds', adData.beds);
      formData.append('bath', adData.bath);
      formData.append('latitude', String(adData.latitude));
      formData.append('longitude', String(adData.longitude));
      formData.append('universityId', adData.universityId);
      formData.append('securityDeposit', adData.securityDeposit || '');
      const parsedKeyMoney = parseInt(String(adData.securityDeposit).replace(/\D/g, ''), 10);
      formData.append('keyMoneyMonths', String(isNaN(parsedKeyMoney) || parsedKeyMoney <= 0 ? 1 : parsedKeyMoney));
      formData.append('listingType', adData.listingType || 'LANDLORD_RENT');
      if (adData.landlordPresence) formData.append('landlordPresence', adData.landlordPresence);
      if (adData.curfewTime) formData.append('curfewTime', adData.curfewTime);
      if (adData.visitorPolicy) formData.append('visitorPolicy', adData.visitorPolicy);
      if (adData.busRoute) formData.append('busRoute', adData.busRoute);
      if (adData.customInstitution) {
        formData.append('customInstitution', adData.customInstitution);
      }

      const features = (adData.amenities as string[]) || [];
      const hasPowerBackup = features.some(f => f.includes('Power Backup') || f.includes('Power Generator'));
      const isCookingAllowed = features.some(f => f.includes('Kitchen') || f.includes('Cooking Allowed'));
      const hasSeparateEntrance = features.some(f => f.includes('Separate Entrance') || f.includes('Entrance'));
      const hasWaterTank = features.some(f => f.includes('Water Tank') || f.includes('Water Storage'));
      formData.append('hasPowerBackup', String(hasPowerBackup));
      formData.append('isCookingAllowed', String(isCookingAllowed));
      formData.append('hasSeparateEntrance', String(hasSeparateEntrance));
      formData.append('hasWaterTank', String(hasWaterTank));

      let genderPolicy = 'ANY';
      const hr = ((adData.houseRules as string) || '').toLowerCase();
      if (hr.includes('girl') || hr.includes('female')) genderPolicy = 'GIRLS_ONLY';
      else if (hr.includes('boy') || hr.includes('male')) genderPolicy = 'BOYS_ONLY';
      formData.append('genderPolicy', genderPolicy);
      formData.append('features', JSON.stringify(features));

      if (adData.newImages && adData.newImages.length > 0) {
        // Convert images to Base64 so they persist permanently in DB (bypasses ephemeral serverless disk)
        const base64List: string[] = await Promise.all(
          adData.newImages.map((file: File) => new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
          }))
        );
        formData.append('base64Images', JSON.stringify(base64List.filter(Boolean)));

        // Also append as file objects for backward compatibility
        adData.newImages.forEach((file: File) => {
          formData.append('images', file);
        });
      }

      let response;
      if (isEditing && editingAd) {
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/annexes/${editingAd.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/annexes`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });
      }

      if (response.ok) {
        toast.success(isEditing ? 'Ad updated successfully!' : 'Ad posted! Awaiting admin approval.', { id: toastId });
        await fetchMyAds();
        setIsEditSuccess(isEditing);
        setShowSuccessModal(true);
        setEditingAd(null);
        setCurrentView('myAds');
      } else {
        const err = await response.json();
        toast.error(err.message || 'Failed to submit advertisement.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during submission.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAd = async (adId: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}/api/annexes/${adId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          toast.success('Ad removed successfully!');
          await fetchMyAds();
        } else {
          toast.error('Failed to remove ad.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error deleting ad.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
      <PremiumPageLoader isLoading={loading} message="Authenticating..." />

      <SEO
        title="Post Your Annex Advertisement - The Uni Gang"
        description="Landlords and students: Post your boarding place or annex advertisement for free and reach thousands of students."
      />

      <AnimatePresence mode="wait">
        {!loading && (
          <motion.div
            key={isLoggedIn ? 'dashboard' : 'auth'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 md:px-8 pt-3 sm:pt-4"
          >
            {/* Top Navigation & Breadcrumb */}
            <PageBreadcrumb
              items={[
                { label: 'Accommodation', to: '/annex-list' },
                { 
                  label: currentView === 'postAdForm' 
                    ? (editingAd ? 'Edit Advertisement' : 'Post Advertisement') 
                    : 'My Advertisements', 
                  active: true 
                }
              ]}
              backTo="/annex-list"
              backLabel="Back to Accommodation"
              rightSlot={
                isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    {currentView === 'myAds' ? (
                      <button
                        onClick={() => { setEditingAd(null); setCurrentView('postAdForm'); }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs md:text-sm font-bold shadow-md hover:shadow-lg transition-all"
                      >
                        <LuPlus className="w-4 h-4" /> Post New Advertisement
                      </button>
                    ) : (
                      <button
                        onClick={() => { setCurrentView('myAds'); }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs md:text-sm font-bold border border-slate-300 dark:border-slate-700 transition-all"
                      >
                        <LuListOrdered className="w-4 h-4" /> View My Ads ({myAds.length})
                      </button>
                    )}
                  </div>
                ) : undefined
              }
            />

            {!isLoggedIn ? (
              <div className="flex flex-col justify-center items-center py-10">
                <AuthCard onAuthSuccess={handleAuthSuccess} />
              </div>
            ) : (
              <div className="space-y-8">

                <motion.div
                  key={currentView + (editingAd?.id || 'new')}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {currentView === 'postAdForm' && (
                    <AnnexAdForm
                      initialData={editingAd ?? undefined}
                      onSubmit={handleAnnexFormSubmit}
                      onCancel={() => setCurrentView('myAds')}
                      isEditing={!!editingAd}
                      isSubmitting={isSubmitting}
                    />
                  )}

                  {currentView === 'myAds' && (
                    <MyAdsList
                      ads={myAds}
                      onEdit={(ad: Annex) => { setEditingAd(ad); setCurrentView('postAdForm'); }}
                      onDelete={handleDeleteAd}
                    />
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <SubmissionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        isPendingApproval={!isEditSuccess}
        title={isEditSuccess ? 'දැන්වීම සාර්ථකව යාවත්කාලීන විය!' : 'නවාතැන් දැන්වීම සාර්ථකව ඉදිරිපත් කරන ලදී!'}
        subtitle={isEditSuccess ? 'Listing Updated Successfully' : 'Annex Submitted • Awaiting Admin Approval'}
        description={
          isEditSuccess
            ? 'ඔබ විසින් සිදුකරන ලද වෙනස්කම් සාර්ථකව සුරැකිණි.'
            : 'ඔබගේ බෝඩිං / ඇනෙක්ස් දැන්වීම අපගේ Admin කණ්ඩායම විසින් සමාලෝචනය කර අනුමත කළ විගස, එය The Uni Gang හි සියලුම සිසුන්ට සජීවීව දිස්වනු ඇත.'
        }
        primaryActionLabel="View My Listings (මගේ දැන්වීම්)"
        onPrimaryAction={() => setCurrentView('myAds')}
      />
    </div>
  );
};

export default PostAdPage;


