import { auth } from '../firebase';

/**
 * Returns a fresh, valid Firebase ID token.
 * If Firebase has an authenticated user, it calls getIdToken(false) (or true if forced/expired)
 * to guarantee that 401 Unauthorized errors do not occur due to an expired localStorage token.
 * Updates localStorage.userToken with the fresh token.
 */
export const getFreshToken = async (forceRefresh = false): Promise<string | null> => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const freshToken = await currentUser.getIdToken(forceRefresh);
      if (freshToken) {
        localStorage.setItem('userToken', freshToken);
        return freshToken;
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not refresh token from Firebase currentUser:', err);
  }

  // Fallback to whatever is currently stored in localStorage
  return localStorage.getItem('userToken');
};
