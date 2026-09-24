import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuShieldCheck, LuShoppingBag, LuCalendar,
  LuMessageSquare, LuCheck, LuX, LuTrash2, LuSearch,
  LuExternalLink, LuUserCheck, LuMail, LuHouse, LuUsers,
  LuLifeBuoy, LuCreditCard, LuRefreshCw, LuFootprints,
  LuMapPin, LuGraduationCap, LuBriefcase
} from 'react-icons/lu';
import { FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../../api';
import SEO from '../../components/SEO';
import { jwtDecode } from 'jwt-decode';

type AdminTab = 'annexes' | 'market' | 'events' | 'users' | 'feedbacks' | 'problems' | 'payments';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('annexes');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [annexes, setAnnexes] = useState<any[]>([]);
  const [marketItems, setMarketItems] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [problems, setProblems] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  // Reply modal state for problem reports
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<any | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  const token = localStorage.getItem('userToken');

  useEffect(() => {
    if (!token) {
      toast.error('Admin authentication required.');
      navigate('/');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role !== 'admin') {
        toast.error('Unauthorized access. Admin only.');
        navigate('/');
        return;
      }
    } catch {
      toast.error('Invalid token. Please log in again.');
      navigate('/');
      return;
    }

    fetchAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  const fetchAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [annexData, marketData, eventData, userData, feedbackData, problemData, paymentData] = await Promise.all([
        api.getAdminAnnexes(token).catch(() => []),
        api.getAdminMarketItems(token).catch(() => []),
        api.getAdminEvents(token).catch(() => []),
        api.getAdminUsers(token).catch(() => []),
        api.getAdminFeedbacks(token).catch(() => []),
        api.getAdminProblems(token).catch(() => []),
        api.getAdminPremiumPayments(token).catch(() => [])
      ]);

      setAnnexes(annexData);
      setMarketItems(marketData);
      setEvents(eventData);
      setUsers(userData);
      setFeedbacks(feedbackData);
      setProblems(problemData);
      setPayments(paymentData);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      toast.error('Failed to load some admin data.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Status Handlers
  const handleAnnexStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      await api.updateAdminAnnexStatus(id, status, token);
      toast.success(`Annex status updated to ${status}`);
      setAnnexes(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err: any) {
      toast.error(err.message || 'Failed to update annex status');
    }
  };

  const handleDeleteAnnex = async (id: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this annex listing?')) return;
    try {
      await api.deleteAdminAnnex(id, token);
      toast.success('Annex listing deleted');
      setAnnexes(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete annex');
    }
  };

  const handleMarketStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      await api.updateAdminMarketStatus(id, status, token);
      toast.success(`Listing status updated to ${status}`);
      setMarketItems(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    } catch (err: any) {
      toast.error(err.message || 'Failed to update listing status');
    }
  };

  const handleDeleteMarketItem = async (id: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.deleteAdminMarketItem(id, token);
      toast.success('Marketplace item deleted');
      setMarketItems(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete item');
    }
  };

  const handleEventStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      await api.updateAdminEventStatus(id, status, token);
      toast.success(`Event status updated to ${status}`);
      setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    } catch (err: any) {
      toast.error(err.message || 'Failed to update event status');
    }
  };

  const handleVerifyUser = async (userId: string) => {
    if (!token) return;
    try {
      await api.verifyUser(userId, token);
      toast.success('User student verified successfully!');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_verified_student: true } : u));
    } catch (err: any) {
      toast.error(err.message || 'Failed to verify user');
    }
  };

  const handleVerifyProfessional = async (userId: string) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/admin/users/${userId}/verify-professional`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to verify professional');
      toast.success('User verified as professional successfully!');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_verified_professional: true } : u));
    } catch (err: any) {
      toast.error(err.message || 'Failed to verify professional');
    }
  };

  const handleFeedbackApproval = async (id: string, is_approved: boolean) => {
    if (!token) return;
    try {
      await api.updateAdminFeedbackStatus(id, is_approved, token);
      toast.success(is_approved ? 'Feedback approved for homepage!' : 'Feedback unapproved');
      setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, is_approved } : f));
    } catch (err: any) {
      toast.error(err.message || 'Failed to update feedback status');
    }
  };

  const handleSendProblemReply = async () => {
    if (!token || !selectedProblem || !adminReplyText.trim()) {
      toast.error('Please enter a reply message.');
      return;
    }
    try {
      await api.replyAdminProblem(selectedProblem.id, 'RESOLVED', adminReplyText, token);
      toast.success('Support problem resolved and reply sent!');
      setProblems(prev => prev.map(p => p.id === selectedProblem.id ? { ...p, status: 'RESOLVED', admin_reply: adminReplyText } : p));
      setReplyModalOpen(false);
      setSelectedProblem(null);
      setAdminReplyText('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to resolve problem');
    }
  };

  const handlePaymentStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      await api.updateAdminPremiumPaymentStatus(id, status, token);
      toast.success(`Payment status updated to ${status}`);
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    } catch (err: any) {
      toast.error(err.message || 'Failed to update payment status');
    }
  };

  // Metrics summary
  const pendingAnnexesCount = annexes.filter(a => a.status === 'Pending').length;
  const pendingMarketCount = marketItems.filter(m => m.status === 'PENDING_VERIFICATION' || m.status === 'PENDING').length;
  const pendingEventsCount = events.filter(e => e.status === 'Pending' || e.status === 'PENDING').length;
  const pendingProblemsCount = problems.filter(p => p.status === 'PENDING' || p.status === 'IN_PROGRESS').length;
  const pendingPaymentsCount = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-12 font-sans relative overflow-hidden">
      <SEO title="Admin Moderation Dashboard | The Uni Gang" description="Moderation & Governance Control Center for The Uni Gang" />

      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Dashboard Title & Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-3 border border-indigo-500/20">
              <LuShieldCheck className="text-sm" /> Governance Control Center
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Admin <span className="text-indigo-500 italic">Moderation Hub</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search listings, users..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-500"
              />
              <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
            </div>
            <button
              onClick={fetchAdminData}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LuRefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>

        {/* Metrics Overview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Pending Annexes', val: pendingAnnexesCount, icon: FiHome, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
            { label: 'Pending Marketplace', val: pendingMarketCount, icon: LuShoppingBag, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
            { label: 'Pending Events', val: pendingEventsCount, icon: LuCalendar, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
            { label: 'Unresolved Tickets', val: pendingProblemsCount, icon: LuMessageSquare, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' }
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className={`p-5 rounded-2xl border ${m.color} backdrop-blur-xl flex items-center justify-between`}>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{m.label}</p>
                  <p className="text-3xl font-black text-white">{m.val}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10">
                  <Icon className="text-xl" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800 mb-8 overflow-x-auto">
          {[
            { id: 'annexes', label: `Annexes (${annexes.length})`, icon: LuHouse, count: pendingAnnexesCount },
            { id: 'market', label: `Marketplace (${marketItems.length})`, icon: LuShoppingBag, count: pendingMarketCount },
            { id: 'events', label: `Events (${events.length})`, icon: LuCalendar, count: pendingEventsCount },
            { id: 'users', label: `Users & Badges (${users.length})`, icon: LuUsers },
            { id: 'feedbacks', label: `Client Feedbacks (${feedbacks.length})`, icon: LuMessageSquare },
            { id: 'problems', label: `Support Tickets (${problems.length})`, icon: LuLifeBuoy, count: pendingProblemsCount },
            { id: 'payments', label: `Premium Payments (${payments.length})`, icon: LuCreditCard, count: pendingPaymentsCount }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-none relative flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <tab.icon size={15} />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Moderation Deck...</p>
          </div>
        ) : (
          <div>
            {/* 1. Annexes Tab */}
            {activeTab === 'annexes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {annexes
                  .filter(a => !searchQuery || a.title?.toLowerCase().includes(searchQuery.toLowerCase()) || a.address?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(annex => (
                    <div key={annex.id} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            annex.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            annex.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                          }`}>
                            {annex.status || 'Pending'}
                          </span>
                          <span className="text-xs font-bold text-indigo-400">Rs. {parseFloat(annex.price || 0).toLocaleString()}/mo</span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{annex.title}</h3>
                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{annex.address}</p>

                        <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 font-medium mb-4">
                          <span className="inline-flex items-center gap-1"><LuFootprints size={12} /> {annex.walk_time_mins || annex.walkTimeMins || 5} mins walk</span>
                          <span>·</span>
                          <span>Owner: {annex.owner ? annex.owner.name : 'Unknown'} ({annex.owner ? annex.owner.phone : 'N/A'})</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                        <a href={`/annex/${annex.id}`} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-bold">
                          View <LuExternalLink size={12} />
                        </a>

                        <div className="flex items-center gap-2">
                          {annex.status !== 'Approved' && (
                            <button
                              onClick={() => handleAnnexStatus(annex.id, 'Approved')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <LuCheck size={14} /> Approve
                            </button>
                          )}
                          {annex.status !== 'Rejected' && (
                            <button
                              onClick={() => handleAnnexStatus(annex.id, 'Rejected')}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <LuX size={14} /> Reject
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAnnex(annex.id)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors cursor-pointer"
                            title="Delete Listing"
                          >
                            <LuTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* 2. Marketplace Tab */}
            {activeTab === 'market' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {marketItems
                  .filter(m => !searchQuery || m.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(item => (
                    <div key={item.id} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            item.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            item.status === 'SUSPENDED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                          }`}>
                            {item.status}
                          </span>
                          <span className="text-xs font-bold text-purple-400">Rs. {parseFloat(item.price || 0).toLocaleString()}</span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{item.description}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Seller: {item.seller ? item.seller.name : 'Unknown'}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-2">
                        {item.status !== 'AVAILABLE' && (
                          <button
                            onClick={() => handleMarketStatus(item.id, 'AVAILABLE')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <LuCheck size={14} /> Approve
                          </button>
                        )}
                        {item.status !== 'SUSPENDED' && (
                          <button
                            onClick={() => handleMarketStatus(item.id, 'SUSPENDED')}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <LuX size={14} /> Suspend
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMarketItem(item.id)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors cursor-pointer"
                          title="Delete Listing"
                        >
                          <LuTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* 3. Events Tab */}
            {activeTab === 'events' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events
                  .filter(e => !searchQuery || e.title?.toLowerCase().includes(searchQuery.toLowerCase()) || e.uni?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(event => (
                    <div key={event.id} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            event.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            event.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                          }`}>
                            {event.status || 'Pending'}
                          </span>
                          <span className="text-xs font-bold text-rose-400">{event.uni}</span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{event.title}</h3>
                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{event.description}</p>
                        <p className="text-[10px] text-slate-500 font-medium flex items-center gap-2">
                          <span className="inline-flex items-center gap-1"><LuMapPin size={11} /> {event.location}</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1"><LuCalendar size={11} /> {event.date}</span>
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-2">
                        {event.status !== 'Approved' && (
                          <button
                            onClick={() => handleEventStatus(event.id, 'Approved')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <LuCheck size={14} /> Approve
                          </button>
                        )}
                        {event.status !== 'Rejected' && (
                          <button
                            onClick={() => handleEventStatus(event.id, 'Rejected')}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <LuX size={14} /> Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* 4. Users Tab */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-widest text-[10px] font-black">
                    <tr>
                      <th className="p-4">User</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Verification Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users
                      .filter(u => !searchQuery || u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(user => (
                        <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-white text-sm">{user.name}</p>
                            <p className="text-slate-500 text-[11px]">{user.email}</p>
                          </td>
                          <td className="p-4 font-bold uppercase tracking-wider text-slate-300">
                            {user.role}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {user.is_verified_student && (
                                <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30 inline-flex items-center gap-1">
                                  <LuGraduationCap size={12} /> Verified University
                                </span>
                              )}
                              {user.is_verified_landlord && (
                                <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 inline-flex items-center gap-1">
                                  <LuHouse size={12} /> Verified Landlord
                                </span>
                              )}
                              {user.is_verified_professional && (
                                <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 inline-flex items-center gap-1">
                                  <LuBriefcase size={12} /> Verified Professional
                                </span>
                              )}
                              {!user.is_verified_student && !user.is_verified_landlord && !user.is_verified_professional && (
                                <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-slate-800 text-slate-400 border border-slate-700">
                                  Unverified
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex gap-2 justify-end">
                              {!user.is_verified_student && (
                                <button
                                  onClick={() => handleVerifyUser(user.id)}
                                  className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/30 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                                >
                                  <LuUserCheck size={14} /> Student
                                </button>
                              )}
                              {!user.is_verified_professional && (
                                <button
                                  onClick={() => handleVerifyProfessional(user.id)}
                                  className="px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-white border border-yellow-500/30 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                                >
                                  <LuUserCheck size={14} /> Professional
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 5. Feedbacks Tab */}
            {activeTab === 'feedbacks' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {feedbacks.map(fb => (
                  <div key={fb.id} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          fb.is_approved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {fb.is_approved ? 'Homepage Approved' : 'Hidden'}
                        </span>
                        <span className="text-amber-400 font-bold text-xs">⭐ {fb.rating}/5</span>
                      </div>

                      <p className="text-sm text-slate-200 italic mb-4">"{fb.comment}"</p>
                      <p className="text-xs font-bold text-white">{fb.name} <span className="text-slate-500 font-normal">· {fb.institution || 'Verified Client'}</span></p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleFeedbackApproval(fb.id, !fb.is_approved)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          fb.is_approved
                            ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30'
                        }`}
                      >
                        {fb.is_approved ? <><LuX size={14} /> Hide</> : <><LuCheck size={14} /> Approve for Homepage</>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. Problems / Support Tickets Tab */}
            {activeTab === 'problems' && (
              <div className="space-y-4">
                {problems.map(prob => (
                  <div key={prob.id} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          prob.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                        }`}>
                          {prob.status}
                        </span>
                        <span className="text-xs font-bold text-indigo-400">{prob.inquiry_type || prob.inquiryType || 'General Problem'}</span>
                      </div>

                      <h4 className="text-base font-bold text-white mb-1">{prob.name} ({prob.email})</h4>
                      <p className="text-xs text-slate-300 leading-relaxed mb-2">{prob.message}</p>

                      {prob.admin_reply && (
                        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 mt-2">
                          <span className="font-bold">Admin Reply:</span> {prob.admin_reply}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0">
                      {prob.status !== 'RESOLVED' && (
                        <button
                          onClick={() => {
                            setSelectedProblem(prob);
                            setReplyModalOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all cursor-pointer shadow-lg shadow-indigo-600/30 border-none flex items-center gap-2"
                        >
                          <LuMail size={14} /> Reply & Resolve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7. Premium Payments Tab */}
            {activeTab === 'payments' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {payments
                  .filter(p => !searchQuery || p.reference_number?.toLowerCase().includes(searchQuery.toLowerCase()) || p.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(payment => (
                    <div key={payment.id} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            payment.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            payment.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                          }`}>
                            {payment.status || 'pending'}
                          </span>
                          <span className="text-xs font-bold text-amber-400">Rs. {payment.amount}</span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">User: {payment.user?.name}</h3>
                        <p className="text-xs text-slate-400 mb-1">Email: {payment.user?.email}</p>
                        <p className="text-xs text-slate-400 mb-1">WhatsApp: {payment.whatsapp_number}</p>
                        <p className="text-[10px] text-slate-500 mt-2 font-medium">Ref: {payment.reference_number || 'N/A'} · Date: {new Date(payment.payment_date).toLocaleString()}</p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-800/80">
                        <a href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}${payment.receipt_url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-bold">
                          <LuExternalLink size={12} /> View Receipt
                        </a>

                        <div className="flex items-center justify-end gap-2 mt-4">
                          {payment.status !== 'approved' && (
                            <button
                              onClick={() => handlePaymentStatus(payment.id, 'approved')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <LuCheck size={14} /> Approve
                            </button>
                          )}
                          {payment.status !== 'rejected' && (
                            <button
                              onClick={() => handlePaymentStatus(payment.id, 'rejected')}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <LuX size={14} /> Reject
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reply Modal for Support Problems */}
      <AnimatePresence>
        {replyModalOpen && selectedProblem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4"
            >
              <h3 className="text-xl font-black text-white">Resolve Ticket & Reply to User</h3>
              <p className="text-xs text-slate-400">User Inquiry: "{selectedProblem.message}"</p>

              <textarea
                rows={4}
                value={adminReplyText}
                onChange={e => setAdminReplyText(e.target.value)}
                placeholder="Type resolution reply message..."
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:border-indigo-500 outline-none resize-none"
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setReplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendProblemReply}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold border-none cursor-pointer"
                >
                  Send & Resolve
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
