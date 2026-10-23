import { useState, useEffect } from 'react';
import ProposalNavbar from './components/navbar/ProposalNavbar';
import ProposalLandingPage from './pages/ProposalLandingPage';
import ProposalDiscoverPage from './pages/ProposalDiscoverPage';
import ProposalOnboardingPage from './pages/ProposalOnboardingPage';
import ProposalHomePage from './pages/ProposalHomePage';
import ProposalFullProfilePage from './pages/ProposalFullProfilePage';
import ProposalInboxPage from './pages/ProposalInboxPage';
import ProposalLikesPage from './pages/ProposalLikesPage';
import ProposalPremiumPage from './pages/ProposalPremiumPage';
import ProposalHowItWorksPage from './pages/ProposalHowItWorksPage';
import ProposalSafetyPage from './pages/ProposalSafetyPage';
import ProposalFAQPage from './pages/ProposalFAQPage';
import ProposalSettingsPage from './pages/ProposalSettingsPage';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from '../../components/layout/Footer';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

export type ProposalView = 
  | 'landing' 
  | 'discover' 
  | 'onboarding' 
  | 'dashboard' 
  | 'profile' 
  | 'inbox' 
  | 'likes' 
  | 'premium' 
  | 'how-it-works'
  | 'safety'
  | 'faq'
  | 'settings';

export default function ProposalHubEntry() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeView, setActiveView] = useState<ProposalView>('landing');
  const [previousView, setPreviousView] = useState<ProposalView>('landing');
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [initialSearchFilters, setInitialSearchFilters] = useState<any>(null);
  const [selectedPricingPlan, setSelectedPricingPlan] = useState<'classic_3m' | 'vip_6m' | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(() => {
    return localStorage.getItem('userHasProposalProfile') === 'true';
  });

  const isLoggedIn = !!localStorage.getItem('userToken') && localStorage.getItem('userToken') !== 'null';

  // Listen to profile updates in localStorage
  useEffect(() => {
    const checkProfile = () => {
      setHasProfile(localStorage.getItem('userHasProposalProfile') === 'true');
    };
    window.addEventListener('storage', checkProfile);
    return () => window.removeEventListener('storage', checkProfile);
  }, []);

  const navigateTo = (view: ProposalView) => {
    setPreviousView(activeView);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    if (hasProfile) {
      navigateTo('dashboard');
    } else {
      navigateTo('onboarding');
    }
  };

  const handleSearchFromHero = (filters: any) => {
    // Convert hero search filters to Discover SearchFilterState format
    const formatted: any = {};
    if (filters.lookingFor) formatted.lookingFor = filters.lookingFor;
    if (filters.ageRange) {
      formatted.ageRange = filters.ageRange;
      const parts = filters.ageRange.split('-');
      if (parts.length === 2) {
        formatted.minAge = parts[0];
        formatted.maxAge = parts[1];
      }
    }
    if (filters.religion && filters.religion !== 'Any') {
      formatted.religion = filters.religion;
    }
    if (filters.livingIn && filters.livingIn !== 'Anywhere') {
      formatted.country = filters.livingIn;
    }
    if (filters.category) {
      if (filters.category === 'campus') formatted.education = 'University';
      else if (filters.category === 'working') formatted.profession = 'Working Professional';
      else if (filters.category === 'abroad') formatted.country = 'Abroad';
    }

    setInitialSearchFilters(formatted);

    if (!isLoggedIn) {
      toast("💍 ඔබගේ සෙවුමට ගැළපෙන සහකරුවන් හමුවිය! මූලික තොරතුරු බැලීමට කරුණාකර The Uni Gang ගිණුමට Log In වන්න.", {
        icon: '🔐',
        duration: 5000
      });
      navigateTo('landing');
      return;
    }

    navigateTo('discover');
  };

  const handleViewProfile = (profile: any) => {
    setSelectedProfile(profile);
    setPreviousView(activeView);
    setActiveView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (target: string) => {
    if (target === 'home') {
      navigateTo('landing');
    } else if (target === 'discover') {
      if (!isLoggedIn) {
        toast("🔒 අපගේ සාමාජිකයින්ගේ මූලික තොරතුරු පිරික්සීමට කරුණාකර පළමුව The Uni Gang වෙබ් අඩවියට Log In වන්න.", {
          icon: '🔐',
          duration: 5000
        });
        navigateTo('landing');
        return;
      }
      setInitialSearchFilters(null);
      navigateTo('discover');
    } else if (target === 'pricing' || target === 'premium') {
      setSelectedPricingPlan(null);
      navigateTo('premium');
    } else if (target === 'how-it-works') {
      navigateTo('how-it-works');
    } else if (target === 'trust' || target === 'safety') {
      navigateTo('safety');
    } else if (target === 'faq') {
      navigateTo('faq');
    } else if (target === 'dashboard') {
      handleGetStarted();
    } else if (target === 'settings') {
      navigateTo('settings');
    } else {
      if (activeView !== 'landing') {
        setActiveView('landing');
        setTimeout(() => {
          const el = document.getElementById(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getSavedProfile = () => {
    try {
      const raw = localStorage.getItem('userProposalProfile');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className={`min-h-screen flex flex-col font-sans selection:bg-rose-500/30 transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}>
        {/* Global Proposal Navbar for Landing, Discover, Pricing, How It Works, Safety & FAQ views */}
        {(activeView === 'landing' || activeView === 'discover' || activeView === 'premium' || activeView === 'how-it-works' || activeView === 'safety' || activeView === 'faq') && (
          <ProposalNavbar
            onNavigate={handleNavClick}
            onGetStarted={handleGetStarted}
            onSignIn={() => navigateTo('dashboard')}
            isLoggedIn={isLoggedIn || hasProfile}
          />
        )}

        <main className="w-full flex-grow">
          {activeView === 'landing' && (
            <ProposalLandingPage
              onGetStarted={handleGetStarted}
              onSearch={handleSearchFromHero}
              onViewProfile={handleViewProfile}
              onViewPricing={() => {
                setSelectedPricingPlan(null);
                navigateTo('premium');
              }}
              onChoosePricingPlan={(plan) => {
                setSelectedPricingPlan(plan);
                navigateTo('premium');
              }}
              onViewHowItWorks={() => navigateTo('how-it-works')}
              onViewSafety={() => navigateTo('safety')}
              onViewFAQ={() => navigateTo('faq')}
              hasProposalProfile={hasProfile}
            />
          )}

          {activeView === 'discover' && (
            <ProposalDiscoverPage
              setPage={(p: any) => {
                if (p === 'landing' || p === 'home') navigateTo('landing');
                else if (p === 'onboarding') navigateTo('onboarding');
                else if (p === 'dashboard') navigateTo('dashboard');
                else navigateTo(p);
              }}
              openProfile={handleViewProfile}
              initialFilters={initialSearchFilters}
            />
          )}

          {activeView === 'onboarding' && (
            <ProposalOnboardingPage
              dark={isDark}
              onComplete={() => {
                setHasProfile(true);
                if (initialSearchFilters) {
                  navigateTo('discover');
                } else {
                  navigateTo('dashboard');
                }
              }}
              onBack={() => navigateTo('landing')}
            />
          )}

          {activeView === 'dashboard' && (
            <ProposalHomePage
              setPage={(page: string) => {
                if (page === 'landing' || page === 'home') navigateTo('landing');
                else if (page === 'discover') navigateTo('discover');
                else if (page === 'onboarding') navigateTo('onboarding');
                else if (page === 'inbox') navigateTo('inbox');
                else if (page === 'likes') navigateTo('likes');
                else if (page === 'premium') navigateTo('premium');
                else if (page === 'settings') navigateTo('settings');
                else navigateTo(page as ProposalView);
              }}
              openProfile={handleViewProfile}
              goToLanding={() => navigateTo('landing')}
            />
          )}

          {activeView === 'profile' && (
            <div className="py-6 px-4">
              <ProposalFullProfilePage
                profile={selectedProfile || getSavedProfile() || {
                  name: 'Kasun Bandara',
                  code: 'UG-101',
                  age: 26,
                  district: 'Colombo',
                  profession: 'Software Engineer',
                  religion: 'Buddhist'
                }}
                goBack={() => navigateTo(previousView)}
                onSendProposal={() => {
                  try {
                    const sentIds: string[] = JSON.parse(localStorage.getItem('sentProposalInterestIds') || '[]');
                    if (selectedProfile?.id && !sentIds.includes(String(selectedProfile.id))) {
                      sentIds.push(String(selectedProfile.id));
                      localStorage.setItem('sentProposalInterestIds', JSON.stringify(sentIds));
                    }
                  } catch {
                    // ignore
                  }
                }}
                onVerifyNow={() => navigateTo('premium')}
                onRegisterNow={() => navigateTo('onboarding')}
                onVerifyIdentity={() => navigateTo('dashboard')}
              />
            </div>
          )}

          {activeView === 'inbox' && (
            <div className="py-6 px-4">
              <ProposalInboxPage
                setPage={(p: any) => {
                  if (p === 'landing' || p === 'home') navigateTo('landing');
                  else if (p === 'premium') navigateTo('premium');
                  else if (p === 'settings') navigateTo('settings');
                  else if (p === 'discover') navigateTo('discover');
                  else navigateTo('dashboard');
                }}
              />
            </div>
          )}

          {activeView === 'likes' && (
            <div className="py-6 px-4">
              <ProposalLikesPage
                setPage={(p: any) => {
                  if (p === 'landing' || p === 'home') navigateTo('landing');
                  else if (p === 'premium') navigateTo('premium');
                  else if (p === 'discover') navigateTo('discover');
                  else navigateTo('dashboard');
                }}
              />
            </div>
          )}

          {activeView === 'premium' && (
            <div className="py-6 px-4">
              <ProposalPremiumPage
                setPage={(p: any) => {
                  if (p === 'landing' || p === 'home') navigateTo('landing');
                  else if (p === 'discover') navigateTo('discover');
                  else if (p === 'dashboard') navigateTo('dashboard');
                  else navigateTo(p as ProposalView);
                }}
                previousView={previousView}
                initialPlan={selectedPricingPlan}
              />
            </div>
          )}

          {activeView === 'how-it-works' && (
            <ProposalHowItWorksPage
              setPage={(p: any) => {
                if (p === 'landing' || p === 'home') navigateTo('landing');
                else if (p === 'discover') navigateTo('discover');
                else if (p === 'dashboard') navigateTo('dashboard');
                else if (p === 'premium') navigateTo('premium');
                else if (p === 'safety') navigateTo('safety');
                else if (p === 'faq') navigateTo('faq');
                else navigateTo(p as ProposalView);
              }}
              onGetStarted={handleGetStarted}
              previousView={previousView}
            />
          )}

          {activeView === 'safety' && (
            <ProposalSafetyPage
              setPage={(p: any) => {
                if (p === 'landing' || p === 'home') navigateTo('landing');
                else if (p === 'discover') navigateTo('discover');
                else if (p === 'dashboard') navigateTo('dashboard');
                else if (p === 'premium') navigateTo('premium');
                else if (p === 'how-it-works') navigateTo('how-it-works');
                else if (p === 'faq') navigateTo('faq');
                else navigateTo(p as ProposalView);
              }}
              onGetStarted={handleGetStarted}
              previousView={previousView}
            />
          )}

          {activeView === 'faq' && (
            <ProposalFAQPage
              setPage={(p: any) => {
                if (p === 'landing' || p === 'home') navigateTo('landing');
                else if (p === 'discover') navigateTo('discover');
                else if (p === 'dashboard') navigateTo('dashboard');
                else if (p === 'premium') navigateTo('premium');
                else if (p === 'how-it-works') navigateTo('how-it-works');
                else if (p === 'safety') navigateTo('safety');
                else navigateTo(p as ProposalView);
              }}
              onGetStarted={handleGetStarted}
              previousView={previousView}
            />
          )}

          {activeView === 'settings' && (
            <div className="py-6 px-4">
              <ProposalSettingsPage
                setPage={(p: any) => {
                  if (p === 'landing' || p === 'home') navigateTo('landing');
                  else if (p === 'premium') navigateTo('premium');
                  else navigateTo('dashboard');
                }}
                onDeleteProposalProfile={() => {
                  setHasProfile(false);
                  navigateTo('landing');
                }}
              />
            </div>
          )}
        </main>

        {/* The Uni Gang Platform Main Footer */}
        {activeView !== 'inbox' && (
          <Footer />
        )}
      </div>
    </ErrorBoundary>
  );
}
