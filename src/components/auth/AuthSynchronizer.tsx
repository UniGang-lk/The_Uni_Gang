import { useEffect } from 'react';
import { auth } from '../../firebase';
import { onIdTokenChanged } from 'firebase/auth';
import { getSocket } from '../../services/realtime';
import { dispatchAuthUpdate } from '../../utils/authEvents';

/**
 * AuthSynchronizer silently runs in the background of the React Router.
 * Firebase automatically refreshes the underlying ID token ~5 minutes before expiration (which is 1 hour).
 * This component listens for those automatic background refreshes and syncs the new token to localStorage.
 * This prevents the massive UX bug where users who stay logged in for >1 hour start getting 401 Unauthorized API errors.
 */
const AuthSynchronizer = () => {
  useEffect(() => {
    // ⚡ Connect to realtime socket on website entry (counts towards live telemetry)
    const socket = getSocket();
    const userId = localStorage.getItem('userId');
    if (userId) {
      socket.emit('register', userId);
      socket.emit('join_user_room', userId);
    }

    // 📡 Global Active Session Pulse (Guarantees 100% accurate live telemetry across AWS Lambda instances)
    let sessionId = sessionStorage.getItem('uni_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      sessionStorage.setItem('uni_session_id', sessionId);
    }

    const sendPulse = () => {
      const currentUid = localStorage.getItem('userId') || '';
      const currentRole = localStorage.getItem('userRole') || 'guest';
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

      fetch(`${apiBase}/api/stats/pulse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId: currentUid,
          role: currentRole,
        }),
      }).catch(() => {});
    };

    // Send immediate pulse on page load
    sendPulse();

    // Pulse heartbeat every 20 seconds while user/visitor is browsing
    const pulseInterval = setInterval(sendPulse, 20000);

    // 🎓 Real-Time Verification Sync: Instant update when admin approves verification
    const handleProfileUpdated = (updatedUser: any) => {
      if (updatedUser) {
        if (updatedUser.is_verified_student !== undefined) {
          localStorage.setItem('userIsVerifiedStudent', String(!!updatedUser.is_verified_student));
        }
        if (updatedUser.is_verified_landlord !== undefined) {
          localStorage.setItem('userIsVerifiedLandlord', String(!!updatedUser.is_verified_landlord));
        }
        if (updatedUser.role) {
          localStorage.setItem('userRole', updatedUser.role);
        }
        if (updatedUser.name) {
          localStorage.setItem('userName', updatedUser.name);
        }
        dispatchAuthUpdate();
      }
    };
    socket.on('user_profile_updated', handleProfileUpdated);
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
        // When signed out from Firebase, clean up all session variables
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userFirstName');
        localStorage.removeItem('userLastName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userProfilePicture');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userPhoneNumber');
        localStorage.removeItem('userUniversity');
        localStorage.removeItem('userFbHandle');
        localStorage.removeItem('userLinkedinHandle');
        localStorage.removeItem('userIsVerifiedStudent');
        localStorage.removeItem('userIsVerifiedLandlord');
      }
    });

    return () => {
      clearInterval(pulseInterval);
      socket.off('user_profile_updated', handleProfileUpdated);
      unsubscribe();
    };
  }, []);

  return null; // Invisible background component
};

export default AuthSynchronizer;
