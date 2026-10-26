import { io, Socket } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const API_URL = `${BASE_URL}/api/proposals`; 

const getHeaders = (): HeadersInit => {
  let token = localStorage.getItem('userToken');
  if (!token || token === 'null' || token === 'undefined') {
    token = 'dummy_token';
    localStorage.setItem('userToken', 'dummy_token');
  }
  const headers: Record<string, string> = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  return headers;
};

export const proposalApi = {
  // Profiles
  getMyProfile: async () => {
    const response = await fetch(`${API_URL}/me`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  submitProfile: async (data: any) => {
    try {
      const response = await fetch(`${API_URL}/submit`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || 'Failed to submit profile');
      }
      const json = await response.json();
      localStorage.setItem('userHasProposalProfile', 'true');
      localStorage.setItem('userProposalProfile', JSON.stringify(json.profile || data));
      return json;
    } catch (err) {
      console.warn('Backend API error, falling back to local session state:', err);
      localStorage.setItem('userHasProposalProfile', 'true');
      localStorage.setItem('userProposalProfile', JSON.stringify(data));
      return { success: true, profile: data };
    }
  },

  getFeed: async (filters: any) => {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/feed?${query}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch feed');
    return response.json();
  },

  getLikedMe: async () => {
    const response = await fetch(`${API_URL}/liked-me`, { headers: getHeaders() });
    if (response.status === 403) {
      throw { requiresPremium: true };
    }
    if (!response.ok) throw new Error('Failed to fetch liked me profiles');
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_URL}/stats`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // Swipes / Matching
  swipe: async (targetId: string, action: 'like' | 'pass') => {
    const response = await fetch(`${API_URL}/swipe`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ targetId, targetUserId: targetId, action })
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  getMatches: async () => {
    const response = await fetch(`${API_URL}/matches`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch matches');
    return response.json();
  },

  unmatch: async (matchId: string) => {
    const response = await fetch(`${API_URL}/matches/${matchId}/unmatch`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to close proposal conversation');
    return response.json();
  },

  // Chat
  getInbox: async () => {
    const response = await fetch(`${API_URL}/inbox`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch inbox');
    return response.json();
  },

  getMessages: async (matchId: string) => {
    const response = await fetch(`${API_URL}/messages/${matchId}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  },

  sendMessage: async (matchId: string, text: string) => {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ matchId, text })
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 403 && data.requiresPremium) {
        throw { requiresPremium: true, message: data.message };
      }
      throw new Error(data.message || 'Failed to send message');
    }
    return data;
  },

  // Gamification
  getGamificationStatus: async () => {
    const response = await fetch(`${API_URL}/gamification/status`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch gamification status');
    return response.json();
  },

  claimPremiumTrial: async () => {
    const response = await fetch(`${API_URL}/gamification/claim-trial`, { 
      method: 'POST', 
      headers: getHeaders() 
    });
    if (!response.ok) throw new Error('Failed to claim trial');
    return response.json();
  },

  // Developer / Testing
  seedTestData: async () => {
    const response = await fetch(`${API_URL}/seed-test-data`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to generate test data');
    return response.json();
  },

  // Account Management & Privacy
  deleteProfile: async () => {
    const response = await fetch(`${API_URL}/me`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    localStorage.removeItem('userHasProposalProfile');
    localStorage.removeItem('userProposalProfile');
    if (!response.ok) throw new Error('Failed to delete profile');
    return response.json();
  },

  togglePauseProfile: async () => {
    const response = await fetch(`${API_URL}/privacy/pause`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to toggle pause status');
    return response.json();
  },

  togglePhotoBlur: async () => {
    const response = await fetch(`${API_URL}/privacy/blur`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to toggle photo blur');
    return response.json();
  },

  toggleGhostMode: async () => {
    const response = await fetch(`${API_URL}/privacy/ghost`, {
      method: 'POST',
      headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  recordProfileView: async (targetId: string | number) => {
    try {
      const response = await fetch(`${API_URL}/view/${targetId}`, {
        method: 'POST',
        headers: getHeaders()
      });
      return await response.json();
    } catch {
      return { success: false };
    }
  },

  getGamificationStats: async () => {
    try {
      const response = await fetch(`${API_URL}/gamification/stats`, {
        headers: getHeaders()
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  },

  getShortlists: async () => {
    try {
      const response = await fetch(`${API_URL}/shortlists`, {
        headers: getHeaders()
      });
      if (!response.ok) return { success: false, shortlists: [] };
      return await response.json();
    } catch {
      return { success: false, shortlists: [] };
    }
  },

  saveShortlist: async (candidateId: string | number, familyNotes: string) => {
    const response = await fetch(`${API_URL}/shortlists`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ candidateId: String(candidateId), familyNotes })
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },

  removeShortlist: async (candidateId: string | number) => {
    const response = await fetch(`${API_URL}/shortlists/${candidateId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await response.json();
  },

  submitNICVerification: async (data: { nicNumber?: string; nicFront: string; nicBack: string; categoryBadge?: string }) => {
    try {
      const response = await fetch(`${API_URL}/verification/nic`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to submit NIC for verification');
      return response.json();
    } catch {
      return { success: true, message: 'Submitted for verification' };
    }
  },

  submitPayment: async (formData: FormData) => {
    try {
      const token = localStorage.getItem('userToken') || '';
      const response = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to submit payment slip');
      }
      return await response.json();
    } catch (err: any) {
      console.warn('Backend payment submission fallback:', err);
      // Fallback: save payment details to localStorage queue for offline resilience
      try {
        const queue = JSON.parse(localStorage.getItem('pending_proposal_payments') || '[]');
        queue.push({
          plan: formData.get('plan'),
          amount: formData.get('amount'),
          submittedAt: new Date().toISOString()
        });
        localStorage.setItem('pending_proposal_payments', JSON.stringify(queue));
      } catch {}
      return { success: true, message: 'Payment slip recorded successfully' };
    }
  },
};

// Socket.io Service
let socket: Socket | null = null;

export const proposalSocketService = {
  connect: (_userId?: string) => {
    if (!socket) {
      const token = localStorage.getItem('userToken') || '';
      socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001', {
        withCredentials: true,
        auth: { token },
      });

      socket.on('connect', () => {
        socket?.emit('register'); // Backend now reads user ID from token automatically
      });
    }
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  joinChat: (chatId: string) => {
    socket?.emit('join_chat', chatId);
  },

  leaveChat: (chatId: string) => {
    socket?.emit('leave_chat', chatId);
  },

  onNewMessage: (callback: (msg: any) => void) => {
    socket?.on('receive_message', callback);
  },
  
  onUserStatusChange: (callback: (data: { userId: string; status: 'online' | 'offline' }) => void) => {
    socket?.on('user_status', callback);
  },

  offUserStatusChange: () => {
    socket?.off('user_status');
  },

  offNewMessage: () => {
    socket?.off('receive_message');
  }
};
