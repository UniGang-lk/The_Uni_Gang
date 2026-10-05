import { io, Socket } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

let socketInstance: Socket | null = null;

/**
 * Returns a shared, robust singleton Socket.IO instance.
 */
export const getSocket = (): Socket => {
  if (!socketInstance) {
    const token = localStorage.getItem('userToken');
    
    socketInstance = io(BASE_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      auth: token ? { token } : undefined,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socketInstance.on('connect', () => {
      console.log('⚡ [Realtime] Connected to live sync server:', socketInstance?.id);
      // If user profile is available, register to their user room
      const userId = localStorage.getItem('userId');
      if (userId) {
        socketInstance?.emit('join_user_room', userId);
        socketInstance?.emit('register', userId);
      }
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 [Realtime] Disconnected from live sync server:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.warn('⚠️ [Realtime] Socket connection error:', error.message);
    });
  }

  return socketInstance;
};

/**
 * Subscribe to blog update events (approvals, edits, status changes)
 */
export const subscribeToBlogUpdates = (callback: (data: any) => void): (() => void) => {
  const socket = getSocket();
  socket.on('blog_updated', callback);
  return () => {
    socket.off('blog_updated', callback);
  };
};

/**
 * Subscribe to blog deletion events
 */
export const subscribeToBlogDeletions = (callback: (data: any) => void): (() => void) => {
  const socket = getSocket();
  socket.on('blog_deleted', callback);
  return () => {
    socket.off('blog_deleted', callback);
  };
};

/**
 * Subscribe to annex listing updates
 */
export const subscribeToAnnexUpdates = (callback: (data: any) => void): (() => void) => {
  const socket = getSocket();
  socket.on('annex_updated', callback);
  return () => {
    socket.off('annex_updated', callback);
  };
};

/**
 * Subscribe to event updates
 */
export const subscribeToEventUpdates = (callback: (data: any) => void): (() => void) => {
  const socket = getSocket();
  socket.on('event_updated', callback);
  return () => {
    socket.off('event_updated', callback);
  };
};

/**
 * Subscribe to author notifications
 */
export const subscribeToNotifications = (callback: (data: any) => void): (() => void) => {
  const socket = getSocket();
  socket.on('new_notification', callback);
  return () => {
    socket.off('new_notification', callback);
  };
};
