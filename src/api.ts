import { Blog, Contributor } from './types/blog';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const api = {
  // Blogs
  getBlogs: async (category?: string, search?: string): Promise<Blog[]> => {
    const queryParams = new URLSearchParams();
    if (category && category !== 'All') queryParams.append('category', category);
    if (search) queryParams.append('search', search);

    const token = localStorage.getItem('userToken');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${BASE_URL}/api/blogs?${queryParams.toString()}`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to fetch blogs');
    const data = await response.json();
    return data.map((blog: any) => ({
      ...blog,
      tags: blog.tags ? blog.tags.split(',').map((t: string) => t.trim()) : [],
      author: {
        ...blog.author,
        avatar: blog.author.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author.name}`
      },
      featuredImage: blog.featuredImage ? (blog.featuredImage.startsWith('http') ? blog.featuredImage : `${BASE_URL}${blog.featuredImage}`) : ''
    }));
  },

  getBlogBySlug: async (slug: string): Promise<Blog> => {
    const token = localStorage.getItem('userToken');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${BASE_URL}/api/blogs/slug/${slug}`, {
      headers
    });
    if (!response.ok) throw new Error('Failed to fetch blog post');
    const data = await response.json();
    const blog = data.blog || data;
    const author = blog.author || {};
    return {
      ...blog,
      hasLiked: data.isLiked ?? blog.hasLiked ?? false,
      tags: typeof blog.tags === 'string'
        ? (blog.tags ? blog.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [])
        : (Array.isArray(blog.tags) ? blog.tags : []),
      author: {
        ...author,
        name: author.name || 'Anonymous',
        avatar: author.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.name || 'Author'}`,
        university: author.university || 'University of Colombo'
      },
      featuredImage: blog.featuredImage ? (blog.featuredImage.startsWith('http') ? blog.featuredImage : `${BASE_URL}${blog.featuredImage}`) : '',
      comments: Array.isArray(blog.comments) ? blog.comments.map((comment: any) => ({
        ...comment,
        user: {
          ...comment.user,
          name: comment.user?.name || 'Anonymous',
          avatar: comment.user?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user?.name || 'User'}`
        }
      })) : []
    };
  },

  getMyBlogs: async (token: string): Promise<Blog[]> => {
    const response = await fetch(`${BASE_URL}/api/blogs/my`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch your blogs');
    const data = await response.json();
    return data.map((blog: any) => ({
      ...blog,
      tags: blog.tags ? blog.tags.split(',').map((t: string) => t.trim()) : [],
      author: {
        ...blog.author,
        avatar: blog.author?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author?.name || 'User'}`
      },
      featuredImage: blog.featuredImage ? (blog.featuredImage.startsWith('http') ? blog.featuredImage : `${BASE_URL}${blog.featuredImage}`) : ''
    }));
  },

  createBlog: async (formData: FormData, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/blogs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const rawText = await response.text();

    if (!response.ok) {
      // Safely try to parse JSON error message from backend
      try {
        const err = JSON.parse(rawText);
        throw new Error(err.message || `Server error ${response.status}`);
      } catch {
        // Server returned HTML (e.g. crash page) instead of JSON
        console.error('Non-JSON error from /api/blogs:', rawText.slice(0, 300));
        throw new Error(`Server error ${response.status} — check backend console for details.`);
      }
    }

    try {
      return JSON.parse(rawText);
    } catch {
      throw new Error('Server returned an unexpected response. Please try again.');
    }
  },

  toggleLike: async (blogId: string, token: string): Promise<{ likes: number; hasLiked: boolean }> => {
    const response = await fetch(`${BASE_URL}/api/blogs/${blogId}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to toggle like');
    return response.json();
  },

  addComment: async (blogId: string, content: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/blogs/${blogId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });
    if (!response.ok) {
      try {
        const err = await response.json();
        throw new Error(err.message || 'Failed to submit comment');
      } catch (e: any) {
        throw new Error(e.message || 'Failed to submit comment');
      }
    }
    const result = await response.json();
    const comment = result.comment || result;
    const commentUser = comment?.user || {
      name: localStorage.getItem('userName') || 'User',
      profile_pic: localStorage.getItem('userProfilePicture') || '',
      email: localStorage.getItem('userEmail') || ''
    };
    return {
      ...comment,
      user: {
        ...commentUser,
        name: commentUser.name || localStorage.getItem('userName') || 'User',
        avatar: commentUser.avatar || commentUser.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${commentUser.name || 'User'}`
      }
    };
  },

  deleteComment: async (blogId: string, commentId: string, token: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/blogs/${blogId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete comment');
  },

  updateProfile: async (
    profileData: { name: string; profile_pic?: string | null; phone?: string | null },
    token: string
  ): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  // Contributors
  getContributors: async (): Promise<Contributor[]> => {
    const response = await fetch(`${BASE_URL}/api/blogs/contributors/leaderboard`);
    if (!response.ok) throw new Error('Failed to fetch contributors leaderboard');
    return response.json();
  },

  // Annexes & Accommodations Connected to Backend
  getAnnexes: async (filters?: any): Promise<any[]> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, String(filters[key]));
        }
      });
    }
    const response = await fetch(`${BASE_URL}/api/annexes?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch approved listings');
    return response.json();
  },

  getAnnexById: async (id: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/annexes/${id}`);
    if (!response.ok) throw new Error('Listing not found');
    return response.json();
  },

  createAnnex: async (formData: FormData, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/annexes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to submit property');
    }
    return response.json();
  },

  deleteAnnex: async (id: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/annexes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to remove listing');
    return response.json();
  },

  submitReview: async (id: string, reviewData: any, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/annexes/${id}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(reviewData)
    });
    if (!response.ok) throw new Error('Failed to submit your review');
    return response.json();
  },

  submitServiceRequest: async (requestData: {
    serviceName: string;
    clientPhone: string;
    clientEmail?: string;
    brief: string;
    deadline?: string;
    budget?: string;
  }, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(requestData)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to submit service request');
    }
    return response.json();
  },

  getMyServiceRequests: async (token: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/services/my-requests`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch your service requests');
    const data = await response.json();
    return data.data ?? [];
  },

  getServiceMessages: async (requestId: string, token: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/services/${requestId}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch messages for this request');
    const data = await response.json();
    return data.data ?? [];
  },

  addServiceMessage: async (requestId: string, message: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/services/${requestId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to submit comment');
    }
    const data = await response.json();
    return data.data;
  },

  // Events API
  getApprovedEvents: async (): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/events`);
    if (!response.ok) throw new Error('Failed to fetch approved events');
    const result = await response.json();
    return result.data || [];
  },

  getEventById: async (id: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/events/${id}`);
    if (!response.ok) throw new Error('Event not found');
    const result = await response.json();
    return result.data;
  },


  startEventChat: async (eventId: string): Promise<any> => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/api/events/chats/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ eventId })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to start event chat');
    }
    return response.json();
  },

  getEventChats: async (): Promise<any[]> => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/api/events/chats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch event chats');
    return response.json();
  },

  getEventMessages: async (chatId: string): Promise<any[]> => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/api/events/chats/${chatId}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  },

  sendEventMessage: async (chatId: string, message: string): Promise<any> => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/api/events/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },

  toggleEventRsvp: async (id: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/events/${id}/rsvp`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to toggle RSVP');
    }
    return response.json();
  },

  submitEvent: async (formData: FormData, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to submit event');
    }
    return response.json();
  },

  getMyEvents: async (token: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/events/my-events`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch your events');
    const data = await response.json();
    return data.data ?? [];
  },

  deleteEvent: async (id: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/events/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to delete event');
    }
    return response.json();
  },

  // Notifications API Integration
  getMyNotifications: async (token: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    const data = await response.json();
    return data.notifications ?? [];
  },

  markNotificationAsRead: async (id: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return response.json();
  },

  markAllNotificationsAsRead: async (token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/notifications/read-all`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to mark all as read');
    return response.json();
  },

  // Social & Follow Network
  toggleFollow: async (userId: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/users/${userId}/follow`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) {
      try {
        const err = await response.json();
        throw new Error(err.message || 'Failed to toggle follow');
      } catch (e: any) {
        throw new Error(e.message || 'Failed to toggle follow');
      }
    }
    return response.json();
  },

  getUserNetwork: async (userId: string, token: string): Promise<any> => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/${userId}/network`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) return { followers: [], following: [], followersCount: 0, followingCount: 0 };
      return await response.json();
    } catch {
      return { followers: [], following: [], followersCount: 0, followingCount: 0 };
    }
  },

  // ─── ADVERTISEMENTS API ────────────────────────────────────────

  getActiveAds: async (): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/advertisements/active`);
    if (!response.ok) throw new Error('Failed to fetch advertisements');
    const data = await response.json();
    return data.data ?? [];
  },

  submitAdvertisement: async (formData: FormData): Promise<any> => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/api/advertisements`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to submit advertisement request');
    }
    return response.json();
  },

  trackAdClick: async (id: string | number): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/api/advertisements/${id}/click`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to track ad click', error);
    }
  },

  getMyAdvertisements: async (token: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/advertisements/my-ads`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch your advertisements');
    const data = await response.json();
    return data.data ?? [];
  },

  // Marketplace
  getMarketItem: async (id: string): Promise<any> => {
    try {
      const response = await fetch(`${BASE_URL}/api/market/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data && (data.id || data.title)) return data;
      }
    } catch {
      /* ignore and fallback */
    }
    // Fallback: fetch all items and find by ID
    const res = await fetch(`${BASE_URL}/api/market`);
    if (!res.ok) throw new Error('Failed to fetch item details');
    const items = await res.json();
    const item = Array.isArray(items) ? items.find((i: any) => String(i.id) === String(id)) : null;
    if (!item) throw new Error('Item not found');
    return item;
  },

  getMarketItems: async (type?: string): Promise<any[]> => {
    const url = type && type !== 'All' ? `${BASE_URL}/api/market?type=${type}` : `${BASE_URL}/api/market`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch marketplace items');
    return response.json();
  },

  getMyListings: async (): Promise<any[]> => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/api/market/my`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch your listings');
    return response.json();
  },

  deleteListing: async (id: string): Promise<any> => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/api/market/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete listing');
    return response.json();
  },

  rateListing: async (id: string, rating: number): Promise<any> => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/api/market/${id}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ rating })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to submit rating');
    }
    return response.json();
  },

  startMarketplaceChat: async (itemId: string): Promise<any> => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/api/market/chats/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ itemId })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to start chat');
    }
    return response.json();
  },

  getMarketplaceChats: async (): Promise<any[]> => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/api/market/chats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch marketplace chats');
    return response.json();
  },

  getMarketplaceMessages: async (chatId: string): Promise<any[]> => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/api/market/chats/${chatId}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  },

  sendMarketplaceMessage: async (chatId: string, message: string): Promise<any> => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/api/market/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },

  createMarketOrder: async (formData: FormData): Promise<any> => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/api/market/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to place order');
    }
    return response.json();
  },

  getMyMarketOrders: async (): Promise<any[]> => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/api/market/orders/my`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch your orders');
    return response.json();
  },

  submitFeedback: async (formData: FormData): Promise<any> => {
    const token = localStorage.getItem('userToken');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${BASE_URL}/api/support/feedbacks`, {
      method: 'POST',
      headers,
      body: formData
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to submit feedback');
    }
    return response.json();
  },

  getApprovedFeedbacks: async (): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/support/feedbacks/approved`);
    if (!response.ok) throw new Error('Failed to fetch testimonials');
    const data = await response.json();
    return data.feedbacks || [];
  },

  submitSupportProblem: async (data: { name: string; email: string; inquiryType: string; message: string; }): Promise<any> => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/api/support/problems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to report problem');
    }
    return response.json();
  },

  getMySupportProblems: async (): Promise<any[]> => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}/api/support/my-problems`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch support tickets');
    const data = await response.json();
    return data.problems || [];
  },

  // ─── ADMIN MODERATION DASHBOARD API ────────────────────────────
  getAdminUsers: async (token: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch admin users');
    return response.json();
  },

  verifyAdminUser: async (userId: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/admin/users/${userId}/verify`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to verify user');
    return response.json();
  },

  updateAdminUser: async (userId: string, data: any, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  getAdminPremiumPayments: async (token: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/proposals/admin/payments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch payments');
    const data = await response.json();
    return data.payments || [];
  },

  updateAdminPremiumPaymentStatus: async (paymentId: string, status: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/proposals/admin/payments/${paymentId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update payment status');
    return response.json();
  },

  getAdminAnnexes: async (token: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/annexes/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch admin annexes');
    return response.json();
  },

  updateAdminAnnexStatus: async (annexId: string, status: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/annexes/${annexId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update annex status');
    return response.json();
  },

  deleteAdminAnnex: async (annexId: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/annexes/${annexId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete annex');
    return response.json();
  },

  getAdminMarketItems: async (token: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/admin/market`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch admin market items');
    return response.json();
  },

  updateAdminMarketStatus: async (itemId: string, status: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/admin/market/${itemId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update market status');
    return response.json();
  },

  deleteAdminMarketItem: async (itemId: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/admin/market/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete market item');
    return response.json();
  },

  getAdminEvents: async (token: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/events/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch admin events');
    const result = await response.json();
    return result.data || [];
  },

  updateAdminEventStatus: async (eventId: string, status: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/events/${eventId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update event status');
    return response.json();
  },

  getAdminFeedbacks: async (token: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/support/admin/feedbacks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch admin feedbacks');
    const data = await response.json();
    return data.feedbacks || [];
  },

  updateAdminFeedbackStatus: async (id: string, is_approved: boolean, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/support/admin/feedbacks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ is_approved })
    });
    if (!response.ok) throw new Error('Failed to update feedback approval status');
    return response.json();
  },

  getAdminProblems: async (token: string): Promise<any[]> => {
    const response = await fetch(`${BASE_URL}/api/support/admin/problems`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch admin problem reports');
    const data = await response.json();
    return data.problems || [];
  },

  replyAdminProblem: async (id: string, status: string, adminReply: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/support/admin/problems/${id}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, adminReply })
    });
    if (!response.ok) throw new Error('Failed to submit reply');
    return response.json();
  },

  verifyUser: async (userId: string, token: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/api/admin/users/${userId}/verify-student`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to verify student');
    return response.json();
  }
};
