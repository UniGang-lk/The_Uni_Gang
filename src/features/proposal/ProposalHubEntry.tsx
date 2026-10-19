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
import ProposalSettingsPage from './pages/ProposalSettingsPage';
import ErrorBoundary from './components/ErrorBoundary';
import { useTheme } from '../../context/ThemeContext';

export type ProposalView = 
  | 'landing' 
  | 'discover' 
  | 'onboarding' 
  | 'dashboard' 
  | 'profile' 
  | 'inbox' 
  | 'likes' 
  | 'premium' 
  | 'settings';

export default function ProposalHubEntry() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeView, setActiveView] = useState<ProposalView>('landing');
  const [previousView, setPreviousView] = useState<ProposalView>('landing');
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [initialSearchFilters, setInitialSearchFilters] = useState<any>(null);
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
      setInitialSearchFilters(null);
      navigateTo('discover');
    } else if (target === 'dashboard') {
      handleGetStarted();
    } else {
      // Anchors: how-it-works, trust, faq
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

  return (
    <ErrorBoundary>
      <div className={`min-h-screen font-sans selection:bg-rose-500/30 transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}>
        {/* Global Proposal Navbar for Landing & Discover views */}
        {(activeView === 'landing' || activeView === 'discover') && (
          <ProposalNavbar
            onNavigate={handleNavClick}
            onGetStarted={handleGetStarted}
            onSignIn={() => navigateTo('dashboard')}
            isLoggedIn={isLoggedIn || hasProfile}
          />
        )}

        <main className="w-full">
          {activeView === 'landing' && (
            <ProposalLandingPage
              onGetStarted={handleGetStarted}
              onSearch={handleSearchFromHero}
              onViewProfile={handleViewProfile}
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
                navigateTo('dashboard');
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

          {activeView === 'profile' && selectedProfile && (
            <div className="py-6 px-4">
              <ProposalFullProfilePage
                profile={selectedProfile}
                goBack={() => navigateTo(previousView)}
                onSendProposal={() => {}}
              />
            </div>
          )}

          {activeView === 'inbox' && (
            <div className="py-6 px-4">
              <ProposalInboxPage
                setPage={(p: any) => {
                  if (p === 'landing') navigateTo('landing');
                  else navigateTo('dashboard');
                }}
              />
            </div>
          )}

          {activeView === 'likes' && (
            <div className="py-6 px-4">
              <ProposalLikesPage
                setPage={(p: any) => {
                  if (p === 'landing') navigateTo('landing');
                  else navigateTo('dashboard');
                }}
              />
            </div>
          )}

          {activeView === 'premium' && (
            <div className="py-6 px-4">
              <ProposalPremiumPage
                setPage={(p: any) => {
                  if (p === 'landing') navigateTo('landing');
                  else navigateTo('dashboard');
                }}
              />
            </div>
          )}

          {activeView === 'settings' && (
            <div className="py-6 px-4">
              <ProposalSettingsPage
                setPage={(p: any) => {
                  if (p === 'landing') navigateTo('landing');
                  else navigateTo('dashboard');
                }}
              />
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
