import { useState } from 'react';
import AuthCard from '../../components/auth/AuthCard';
import ProposalNavbar from './components/navbar/ProposalNavbar';
import ProposalLandingPage from './pages/ProposalLandingPage';
import ProposalOnboardingPage from './pages/ProposalOnboardingPage';
import ProposalHomePage from './pages/ProposalHomePage';
import ProposalDiscoverPage from './pages/ProposalDiscoverPage';
import ProposalPremiumPage from './pages/ProposalPremiumPage';
import ProposalInboxPage from './pages/ProposalInboxPage';
import ProposalProfilePage from './pages/ProposalProfilePage';
import ProposalSettingsPage from './pages/ProposalSettingsPage';
import ProposalFullProfilePage from './pages/ProposalFullProfilePage';
import ProposalLikesPage from './pages/ProposalLikesPage';
import ErrorBoundary from './components/ErrorBoundary';

export default function ProposalHubEntry() {
  // Single Sign-On (SSO) & Proposal Profile States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('userToken'));
  const [hasProposalProfile, setHasProposalProfile] = useState<boolean>(() => localStorage.getItem('userHasProposalProfile') === 'true');
  const [appState, setAppState] = useState<'LANDING' | 'ONBOARDING' | 'HOME'>(() => {
    const token = localStorage.getItem('userToken');
    const hasProfile = localStorage.getItem('userHasProposalProfile') === 'true';
    return (token && hasProfile) ? 'HOME' : 'LANDING';
  });
  const [subPage, setSubPage] = useState<'dashboard' | 'discover' | 'premium' | 'inbox' | 'profile' | 'settings' | 'view_profile' | 'likes'>('dashboard');
  const [activeNavbarTab, setActiveNavbarTab] = useState(() => (localStorage.getItem('userToken') && localStorage.getItem('userHasProposalProfile') === 'true') ? 'discover' : 'home');
  const [dark] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [previousSubPage, setPreviousSubPage] = useState<'dashboard' | 'discover'>('dashboard');
  const [showAuth, setShowAuth] = useState(false);

  const handleOpenProfile = (profile: any, from: 'dashboard' | 'discover') => {
    setSelectedProfile(profile);
    setPreviousSubPage(from);
    setSubPage('view_profile');
  };

  const handleGetStarted = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setShowAuth(true);
      return;
    }
    if (!hasProposalProfile) {
      setAppState('ONBOARDING');
    } else {
      setAppState('HOME');
      setSubPage('discover');
    }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    setIsLoggedIn(true);
    localStorage.setItem('userToken', 'mock_sso_jwt_token');

    if (localStorage.getItem('userHasProposalProfile') === 'true') {
      setHasProposalProfile(true);
      setAppState('HOME');
      setSubPage('dashboard');
    } else {
      setAppState('ONBOARDING');
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('userHasProposalProfile', 'true');
    setHasProposalProfile(true);
    setAppState('HOME');
    setSubPage('dashboard');
    setActiveNavbarTab('discover');
  };

  const handleGoToLanding = () => {
    setAppState('LANDING');
    setActiveNavbarTab('home');
  };

  const handleNavbarNavigate = (tabId: string) => {
    setActiveNavbarTab(tabId);
    if (tabId === 'profile' || tabId === 'dashboard') {
      if (isLoggedIn && hasProposalProfile) {
        setAppState('HOME');
        setSubPage('dashboard');
      }
    } else if (tabId === 'home') {
      setAppState('LANDING');
    } else if (tabId === 'discover') {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setShowAuth(true);
      } else if (!hasProposalProfile) {
        setAppState('ONBOARDING');
      } else if (appState !== 'HOME') {
        setAppState('HOME');
        setSubPage('discover');
      } else {
        setSubPage('discover');
      }
    } else if (tabId === 'premium' || tabId === 'pricing') {
      if (appState !== 'HOME') setAppState('HOME');
      setSubPage('premium');
    }
  };

  const getUserName = () => {
    try {
      const savedRaw = localStorage.getItem('userProposalProfile');
      if (savedRaw) {
        const parsed = JSON.parse(savedRaw);
        if (parsed.name && parsed.name.trim().length > 0) return parsed.name;
      }
    } catch (e) {}
    return 'Kasun Bandara';
  };

  if (showAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center py-10 relative">
        <button 
          onClick={() => setShowAuth(false)}
          className="absolute top-8 left-8 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 font-bold text-sm cursor-pointer"
        >
          &larr; Back to Hub
        </button>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">යූනි මංගල සේවයට ඇතුළු වන්න</h2>
          <p className="text-slate-500 text-sm">Please log in or create an account to continue.</p>
        </div>
        <AuthCard onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  if (appState === 'LANDING') {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-white selection:bg-rose-500/30">
          <ProposalNavbar
            activeTab={activeNavbarTab}
            onNavigate={handleNavbarNavigate}
            onGetStarted={handleGetStarted}
            onSignIn={() => setShowAuth(true)}
            isLoggedIn={isLoggedIn}
            hasProposalProfile={hasProposalProfile}
            user={isLoggedIn ? { name: getUserName() } : null}
            onCreateProposalProfile={() => setAppState('ONBOARDING')}
          />
          <ProposalLandingPage dark={dark} onGetStarted={handleGetStarted} hasProposalProfile={isLoggedIn && hasProposalProfile} />
        </div>
      </ErrorBoundary>
    );
  }

  if (appState === 'ONBOARDING') {
    return <ProposalOnboardingPage onComplete={handleOnboardingComplete} onBack={handleGoToLanding} dark={dark} />;
  }

  return (
    <ErrorBoundary>
      <ProposalNavbar
        activeTab={subPage}
        onNavigate={handleNavbarNavigate}
        onGetStarted={handleGetStarted}
        onSignIn={() => setShowAuth(true)}
        isLoggedIn={isLoggedIn}
        hasProposalProfile={hasProposalProfile}
        user={isLoggedIn ? { name: getUserName() } : null}
        onCreateProposalProfile={() => setAppState('ONBOARDING')}
      />
      {subPage === 'discover' && <ProposalDiscoverPage setPage={(p) => setSubPage(p as any)} openProfile={(p) => handleOpenProfile(p, 'discover')} />}
      {subPage === 'premium' && <ProposalPremiumPage setPage={(p) => setSubPage(p as any)} />}
      {subPage === 'inbox' && <ProposalInboxPage setPage={(p) => setSubPage(p as any)} />}
      {subPage === 'profile' && <ProposalProfilePage setPage={(p) => setSubPage(p as any)} />}
      {subPage === 'settings' && (
        <ProposalSettingsPage 
          setPage={(p) => setSubPage(p as any)} 
          onDeleteProposalProfile={() => {
            setHasProposalProfile(false);
            setAppState('LANDING');
            setActiveNavbarTab('home');
          }}
        />
      )}
      {subPage === 'dashboard' && <ProposalHomePage setPage={(p) => setSubPage(p as any)} openProfile={(p) => handleOpenProfile(p, 'dashboard')} goToLanding={handleGoToLanding} />}
      {subPage === 'likes' && <ProposalLikesPage setPage={(p) => setSubPage(p as any)} />}
      {subPage === 'view_profile' && <ProposalFullProfilePage profile={selectedProfile} goBack={() => setSubPage(previousSubPage)} />}
    </ErrorBoundary>
  );
}
