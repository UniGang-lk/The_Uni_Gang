import { useEffect } from 'react';
import { auth } from '../../firebase';
import { onIdTokenChanged } from 'firebase/auth';

/**
 * AuthSynchronizer silently runs in the background of the React Router.
 * Firebase automatically refreshes the underlying ID token ~5 minutes before expiration (which is 1 hour).
 * This component listens for those automatic background refreshes and syncs the new token to localStorage.
 * This prevents the massive UX bug where users who stay logged in for >1 hour start getting 401 Unauthorized API errors.
 */
const AuthSynchronizer = () => {
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        try {
          // Force fetch the latest token (Firebase serves it from cache if it hasn't expired, 
          // or fetches a fresh one if it has refreshed)
          const token = await user.getIdToken();
          
          // Only update if it's actually different or if it was somehow lost
          const currentToken = localStorage.getItem('userToken');
          if (token !== currentToken) {
            localStorage.setItem('userToken', token);
            console.log('🔄 Session token successfully synchronized and extended.');
          }
        } catch (error) {
          console.error('Failed to synchronize session token:', error);
        }
      } else {
        // If the user was signed out from Firebase, clean up session UNLESS it's a Demo session!
        const currentToken = localStorage.getItem('userToken');
        const currentEmail = localStorage.getItem('userEmail');
        if (currentToken === 'dummy_token' || currentEmail === 'kasun.demo@unigang.lk') {
          return;
        }
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userProfilePicture');
      }
    });

    return () => unsubscribe();
  }, []);

  return null; // Invisible background component
};

export default AuthSynchronizer;
