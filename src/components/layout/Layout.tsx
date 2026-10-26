import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  isFullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isFullWidth = false }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      {/* Global Background Decorative Glows (Mixed White/Blue aesthetic) */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed bottom-20 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <Header />
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          className: '',
          style: {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            color: '#1e293b',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
            borderRadius: '1rem',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            fontSize: '0.95rem',
            fontWeight: 500,
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
            style: {
              border: '1px solid rgba(16, 185, 129, 0.2)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              border: '1px solid rgba(239, 68, 68, 0.2)',
            },
          },
        }}
      />
      {isFullWidth ? (
        <main className="flex-grow pt-20 sm:pt-24">
          {children}
        </main>
      ) : (
        <main className="flex-grow pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8 2xl:px-12">
          <div className="w-full max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1760px] mx-auto">
            {children}
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
};

export default Layout;
