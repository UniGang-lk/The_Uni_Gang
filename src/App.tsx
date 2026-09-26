import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import SubLayout from './components/layout/SubLayout';
import ScrollHandler from './components/layout/ScrollHandler';
import PremiumPageLoader from './components/ui/PremiumPageLoader';
import PageErrorBoundary from './components/ui/PageErrorBoundary';

// Home Sections Imports (Direct for Instant Home rendering)
import Hero from './components/home/Hero';
import FeaturedAnnexes from './components/annex/Annex';
import Services from './components/services/Services';
import Events from './components/events/Events';
import Blogs from './components/blogs/Blogs';
import AdvertiseSection from './components/advertise/Advertise';
import Contact from './components/contact/Contact';
import MarketSection from './components/market/MarketSection';
import AdBanner from './components/advertise/AdBanner';
import ProposalTeaserSection from './components/proposal/ProposalTeaserSection';
import WhatsAppButton from './components/whatsAppButton/WhatsAppButton';
import SEO from './components/SEO';
import AdPopup from './components/advertise/AdPopup';
import GoogleOneTap from './components/auth/GoogleOneTap';
import AuthSynchronizer from './components/auth/AuthSynchronizer';
import NotFound from './pages/NotFound';
import './App.css';

// Lazy-Loaded Sub-Pages (Splits heavy chunks for 4x faster initial loading)
const FindAccommodationPage = lazy(() => import('./pages/FindAccommodationPage'));
const PostAdPage = lazy(() => import('./pages/PostAdPage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));
const AnnexDetailsPage = lazy(() => import('./pages/annex/AnnexDetailsPage'));
const ProfilePage = lazy(() => import('./pages/profile/Profile'));
const AnnexList = lazy(() => import('./pages/annex/AnnexList'));
const EventList = lazy(() => import('./pages/events/EventList'));
const EventDetailPage = lazy(() => import('./pages/events/EventDetailPage'));
const PrivacyPolicy = lazy(() => import('./pages/privacyPolicy/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/terms/Terms'));
const FAQ = lazy(() => import('./pages/f&q/F&Q'));
const BlogList = lazy(() => import('./pages/blogs/BlogList'));
const BlogDetail = lazy(() => import('./pages/blogs/BlogDetail'));
const SubmitBlog = lazy(() => import('./pages/blogs/SubmitBlog'));
const AdvertiseLanding = lazy(() => import('./pages/advertise/AdvertiseLanding'));
const AdSubmissionForm = lazy(() => import('./pages/advertise/AdSubmissionForm'));
const MarketplaceHome = lazy(() => import('./pages/market/MarketplaceHome'));
const MarketItemDetailPage = lazy(() => import('./pages/market/MarketItemDetailPage'));
const ServicesPage = lazy(() => import('./pages/services/ServicesPage'));
const ProposalHubEntry = lazy(() => import('./features/proposal/ProposalHubEntry'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

function App() {
  return (
    <Router>
      <ScrollHandler />
      <PageErrorBoundary>
        <Suspense fallback={<PremiumPageLoader isLoading={true} message="Loading Page..." />}>
        <Routes>
          {/* Home Route containing all sections inline */}
          <Route
            path="/"
            element={
              <Layout isFullWidth>
                <div className="flex flex-col">
                  <SEO
                    title="The Uni Gang - Find Your Perfect Student Annex in Sri Lanka"
                    description="Connect with the best student accommodations near universities in Sri Lanka. Easy, secure, and student-friendly annex hunting."
                  />

                  <Hero />

                  <div className="w-full flex flex-col">
                    <div id="annex"><FeaturedAnnexes /></div>
                    <div id="market"><MarketSection /></div>

                    <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 my-6">
                      <AdBanner placement="BANNER" />
                    </div>

                    {/* Future Placeholders handling Navigation Anchors */}
                    <div id="feed" className="min-h-[10px]"></div>
                    <Services />
                    <Events />
                    <ProposalTeaserSection />
                    <div id="blogs"><Blogs /></div>
                    <div id="advertise"><AdvertiseSection /></div>
                    <Contact />
                  </div>
                </div>
              </Layout>
            }
          />

          {/* Single Pages using standard Layout */}
          <Route path="/find-accommodation" element={<Layout><FindAccommodationPage /></Layout>} />
          <Route path="/contact-us" element={<Layout><ContactUsPage /></Layout>} />
          <Route path="/annex/:id" element={<Layout><AnnexDetailsPage /></Layout>} />

          {/* Post Advertiesment using SubLayout */}
          <Route path="/post-ad" element={<SubLayout><PostAdPage /></SubLayout>} />

          {/* Profile using SubLayout */}
          <Route path="/profile" element={<SubLayout><ProfilePage /></SubLayout>} />

          {/* AnnexList using SubLayout */}
          <Route path="/annex-list" element={<SubLayout><AnnexList /></SubLayout>} />

          {/* EventList using SubLayout */}
          <Route path="/event-list" element={<SubLayout><EventList /></SubLayout>} />
          <Route path="/events/:id" element={<SubLayout><EventDetailPage /></SubLayout>} />

          {/* Privacy Policy using SubLayout */}
          <Route path="/privacy-policy" element={<SubLayout><PrivacyPolicy /></SubLayout>} />

          {/* Terms of Service using SubLayout */}
          <Route path="/terms-of-service" element={<SubLayout><Terms /></SubLayout>} />

          {/* FAQ using SubLayout */}
          <Route path="/faq" element={<SubLayout><FAQ /></SubLayout>} />

          {/* Blogs Routes */}
          <Route path="/blogs" element={<SubLayout><BlogList /></SubLayout>} />
          <Route path="/blogs/:slug" element={<SubLayout><BlogDetail /></SubLayout>} />
          <Route path="/submit-blog" element={<SubLayout><SubmitBlog /></SubLayout>} />

          {/* Advertisement Routes */}
          <Route path="/advertise" element={<SubLayout><AdvertiseLanding /></SubLayout>} />
          <Route path="/advertise/submit" element={<SubLayout><AdSubmissionForm /></SubLayout>} />

          {/* Marketplace Route */}
          <Route path="/market" element={<SubLayout><MarketplaceHome /></SubLayout>} />
          <Route path="/market/:id" element={<SubLayout><MarketItemDetailPage /></SubLayout>} />

          {/* Services Dedicated Route */}
          <Route path="/services" element={<SubLayout><ServicesPage /></SubLayout>} />

          {/* Uni Porondam Proposal Hub Route */}
          <Route path="/proposals" element={<ProposalHubEntry />} />

          {/* Admin Moderation Route */}
          <Route path="/admin" element={<SubLayout><AdminDashboard /></SubLayout>} />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<SubLayout><NotFound /></SubLayout>} />
        </Routes>
      </Suspense>
      </PageErrorBoundary>

      <WhatsAppButton />
      <AdPopup />
      <GoogleOneTap />
      <AuthSynchronizer />
    </Router>
  );
}

export default App;
