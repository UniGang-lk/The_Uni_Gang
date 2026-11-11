import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard';
import PageBreadcrumb from '../components/ui/PageBreadcrumb';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    const returnUrl = searchParams.get('returnUrl');
    const redirectParam = searchParams.get('redirect');

    if (returnUrl) {
      try {
        navigate(decodeURIComponent(returnUrl), { replace: true });
        return;
      } catch (e) {
        navigate(returnUrl, { replace: true });
        return;
      }
    }

    if (redirectParam === 'home') {
      navigate('/', { replace: true });
      return;
    }

    navigate('/profile', { replace: true });
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
      <SEO
        title="Sign In - The Uni Gang"
        description="Sign in or join The Uni Gang - The ultimate student platform for accommodations, marketplace, events, and campus life."
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 sm:pt-6">
        <PageBreadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Sign In', active: true }
          ]}
          backTo="/"
          backLabel="Back to Home"
        />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col justify-center items-center py-8 sm:py-12"
        >
          <AuthCard onAuthSuccess={handleAuthSuccess} />
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

