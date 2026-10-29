import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard';
import AnnexAdForm from './annex/AnnexAdForm';
import MyAdsList from './annex/MyAdsList';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';
import { Annex } from '../types/annex';

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
  }, [tab, isLoggedIn]);

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setCurrentView('postAdForm');
    fetchMyAds();
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
      formData.append('listingType', adData.listingType || 'LANDLORD_RENT');
      if (adData.landlordPresence) formData.append('landlordPresence', adData.landlordPresence);
      if (adData.curfewTime) formData.append('curfewTime', adData.curfewTime);
      if (adData.visitorPolicy) formData.append('visitorPolicy', adData.visitorPolicy);
      if (adData.busRoute) formData.append('busRoute', adData.busRoute);
      if (adData.customInstitution) {
        formData.append('customInstitution', adData.customInstitution);
      }

      const features = (adData.amenities as string[]) || [];
      const hasPowerBackup = features.includes('Power Backup') || features.includes('Power');
      const isCookingAllowed = features.includes('Kitchen');
      const hasSeparateEntrance = features.includes('Separate Entrance');
      formData.append('hasPowerBackup', String(hasPowerBackup));
      formData.append('isCookingAllowed', String(isCookingAllowed));
      formData.append('hasSeparateEntrance', String(hasSeparateEntrance));

      let genderPolicy = 'ANY';
      const hr = ((adData.houseRules as string) || '').toLowerCase();
      if (hr.includes('girl') || hr.includes('female')) genderPolicy = 'GIRLS_ONLY';
      else if (hr.includes('boy') || hr.includes('male')) genderPolicy = 'BOYS_ONLY';
      formData.append('genderPolicy', genderPolicy);
      formData.append('features', JSON.stringify(features));

      if (adData.newImages && adData.newImages.length > 0) {
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
    </div>
  );
};

export default PostAdPage;
