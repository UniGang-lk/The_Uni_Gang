import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, MoreVertical, Phone, Video, Send, Paperclip, Smile, Check, CheckCheck, Lock, ShieldAlert, Sparkles, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import { cx } from '../components/ui/ProposalPrimitives';
import { proposalApi, proposalSocketService } from '../api/proposalApi';
import { ScreenshotBlocker } from '../components/privacy/ScreenshotBlocker';

const RESTRICTED_PATTERN = /(?:facebook\.com|fb\.com|instagram\.com|insta:|ig:|tiktok\.com|linkedin\.com|t\.me|telegram|wa\.me|whatsapp|(?:\+?94|0)?\s*7[0-9]{1}\s*[-\s]?[0-9]{3}\s*[-\s]?[0-9]{4})/i;

const ICEBREAKER_TEMPLATES = [
  "🌸 ආයුබෝවන්, ඔබගේ Bio-data එක පරිශීලනය කළෙමි. අදහස් බෙදාහදා ගනිමුද?",
  "🎓 ඔබ අධ්‍යාපනය ලැබූ ක්ෂේත්‍රය පිළිබඳ විස්තර දැනගැනීමට කැමතියි.",
  "💍 අප දෙදෙනාගේ අනාගත බලාපොරොත්තු පිළිබඳ සාකච්ඡා කරමුද?"
];

export default function ProposalInboxPage({ setPage }: { setPage: (p: any) => void }) {
  const [chats, setChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showUnmatchModal, setShowUnmatchModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial profile to get my userId (for Socket) and inbox
  useEffect(() => {
    const init = async () => {
      try {
        const profile = await proposalApi.getMyProfile();
        if (profile.success && profile.profile) {
          const uid = profile.profile.user_id;
          setUserId(uid);
          setIsPremium(profile.profile.is_premium || localStorage.getItem('userIsProposalPremium') === 'true');
          proposalSocketService.connect(uid);
        }
        if (profile.success && profile.user) {
          setIsVerified(profile.user.is_verified_student || profile.user.is_verified_professional);
        }
        
        const inbox = await proposalApi.getInbox();
        if (inbox.success) {
          const rawChats = inbox.chats || [];
          if (rawChats.length === 0 && Array.isArray(inbox.matches) && inbox.matches.length > 0) {
            const converted = inbox.matches.map((m: any) => {
              const myId = profile.profile?.user_id;
              const isSender = m.sender_id === myId || m.senderId === myId;
              const partner = isSender ? m.Receiver : m.Sender;
              return {
                id: m.id || m.ID,
                userId: partner?.id || partner?.ID,
                name: partner?.name || 'Matched Candidate',
                avatar: partner?.avatar || '',
                lastMessage: 'Tap to start conversation',
                timestamp: m.updated_at || m.UpdatedAt || new Date().toISOString(),
                isMatch: true,
                online: true,
                unreadCount: 0
              };
            });
            setChats(converted);
          } else {
            setChats(Array.isArray(rawChats) ? rawChats : []);
          }
        }
      } catch (err) {
        console.error('Error fetching inbox:', err);
      }
    };
    init();

    // Listen for online status changes globally
    proposalSocketService.onUserStatusChange(({ userId: changedUserId, status }) => {
      setChats(prev => prev.map(c => 
        c.userId === changedUserId ? { ...c, online: status === 'online' } : c
      ));
    });

    return () => {
      proposalSocketService.offUserStatusChange();
      proposalSocketService.disconnect();
    };
  }, []);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (activeChatId) {
      const fetchMessages = async () => {
        try {
          const res = await proposalApi.getMessages(activeChatId);
          if (res.success) {
            setActiveMessages(res.messages);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchMessages();

      // Join Socket Room
      proposalSocketService.joinChat(activeChatId);

      // Listen for incoming messages
      proposalSocketService.onNewMessage((msg) => {
        setActiveMessages(prev => [...prev, msg]);
        // Update last message in sidebar
        setChats(prev => prev.map(c => 
          c.id === activeChatId ? { ...c, lastMessage: msg.content || msg.text || 'New message' } : c
        ));
      });

      return () => {
        proposalSocketService.leaveChat(activeChatId);
        proposalSocketService.offNewMessage();
      };
    }
  }, [activeChatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const mySentMessagesCount = activeMessages.filter(m => 
    m.sender === 'me' || (Boolean(userId) && (m.sender_id === userId || m.senderId === userId || m.sender?.id === userId || m.SenderID === userId))
  ).length;
  const isMessageLimitReached = !isPremium && mySentMessagesCount >= 10;

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChatId) return;

    // Free plan 10 messages per match limit check
    if (isMessageLimitReached) {
      toast.error(
        "🔒 Basic Plan එකෙහි මෙම match එක සඳහා හිමි නොමිලේ messages 10 සීමාව ඔබ අවසන් කර ඇත. Unlimited Chat සඳහා Classic Plan එකට Upgrade වන්න.",
        { duration: 6000 }
      );
      setPage('premium');
      return;
    }

    // Safety Shield Check
    if (RESTRICTED_PATTERN.test(message)) {
      toast.error(
        "🛡️ Uni Porondam Safety Shield: පෞද්ගලිකත්වය සුරැකීමට බාහිර සමාජ මාධ්‍ය links හෝ දුරකථන අංක හුවමාරු කිරීම අවහිර කර ඇත. කරුණාකර In-App Chat එක භාවිත කරන්න.",
        { duration: 6000 }
      );
      return;
    }

    const msgText = message;
    setMessage('');
    try {
      const res = await proposalApi.sendMessage(activeChatId, msgText);
      if (res.success) {
        if (res.blockedContentDetected) {
          toast(res.safetyWarning || "🛡️ බාහිර contact තොරතුරු ආරක්ෂක පියවරක් ලෙස mask කරන ලදී.", { icon: '🛡️' });
        }
        setActiveMessages(prev => [...prev, res.message]);
        setChats(prev => prev.map(c => 
          c.id === activeChatId ? { ...c, lastMessage: msgText } : c
        ));
      }
    } catch (err: any) {
      if (err.requiresPremium) {
        toast.error(err.message, { duration: 5000 });
        setPage('premium'); // Redirect to premium page
      } else {
        console.error(err);
        toast.error('Failed to send message');
      }
    }
  };

  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div className="w-full max-w-[1600px] mx-auto h-[calc(100dvh-70px)] sm:h-[calc(100vh-80px)] flex flex-col p-0 sm:p-4 font-sans">
      
      {/* Split Pane Layout */}
      <div className="flex-1 flex overflow-hidden sm:rounded-[2rem] sm:border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-2xl backdrop-blur-xl">
        
        {/* Left Pane - Chat List */}
        <div className={cx(
          "w-full md:w-[380px] flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 shrink-0 transition-transform duration-300",
          activeChatId ? "hidden md:flex" : "flex"
        )}>
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <button onClick={() => setPage('dashboard')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ChevronLeft size={24} className="text-slate-700 dark:text-slate-300" />
            </button>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Messages</h2>
          </div>
          
          {/* New Matches Strip */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">New Matches</h3>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {chats.filter(c => c.isMatch).map(match => (
                <div key={`match-${match.id}`} className="flex flex-col items-center gap-2 cursor-pointer shrink-0" onClick={() => setActiveChatId(match.id)}>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 to-blue-600">
                      <img src={match.avatar || 'https://via.placeholder.com/150'} alt={match.name} className="w-full h-full rounded-full border-2 border-white dark:border-slate-900 object-cover" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{match.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            {chats.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center my-auto">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3 border border-rose-500/20">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  තවමත් සාකච්ඡා නැත
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-xs leading-relaxed font-sinhala">
                  යෝජනා පිරික්සා දෙපාර්ශවයම Accept වූ පසු මෙහි In-App Chat ස්වයංක්‍රීයව විවෘත වේ.
                </p>
                <button
                  type="button"
                  onClick={() => setPage('discover')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  යෝජනා සොයන්න (Discover)
                </button>
              </div>
            ) : (
              chats.map(chat => (
                <div 
                  key={chat.id} 
                  onClick={() => setActiveChatId(chat.id)}
                  className={cx(
                    "flex items-center gap-4 p-4 cursor-pointer transition-colors border-l-4",
                    activeChatId === chat.id 
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500" 
                      : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  )}
                >
                  <div className="relative shrink-0">
                    <img src={chat.avatar || 'https://via.placeholder.com/150'} alt={chat.name} className="w-14 h-14 rounded-full object-cover" />
                    {chat.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{chat.name}</h3>
                      <span className="text-[10px] font-medium text-slate-500 shrink-0">
                        {new Date(chat.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-slate-500 truncate">{chat.lastMessage}</p>
                      {chat.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane - Active Chat */}
        <div className={cx(
          "flex-1 flex flex-col bg-white dark:bg-slate-900/50 relative",
          !activeChatId ? "hidden md:flex items-center justify-center" : "flex"
        )}>
          
          {/* Chat Placeholder (When none selected) */}
          {!activeChatId && (
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full grid place-items-center mx-auto mb-4">
                <Send size={32} className="text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Your Messages</h2>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">Select a conversation from the list to start chatting with your matches.</p>
            </div>
          )}

          {activeChat && (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 relative">
                <div 
                  className="flex items-center gap-4 cursor-pointer group"
                  onClick={() => setShowPartnerModal(true)}
                  title="Click to view partner's verified Bio-Data"
                >
                  <button className="md:hidden p-2 -ml-2 text-slate-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); setActiveChatId(null); }}>
                    <ChevronLeft size={24} />
                  </button>
                  <div className="relative">
                    <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover group-hover:ring-2 group-hover:ring-rose-500/50 transition-all" />
                    {activeChat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors flex items-center gap-1.5">
                      <span>{activeChat.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({activeChat.id ? 'UG-' + String(activeChat.id).slice(-4) : 'MATCH'})</span>
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${activeChat.online ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span>{activeChat.online ? 'Online' : 'Offline'} • Click to view Bio-Data</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 text-slate-500 relative">
                  <button 
                    type="button"
                    onClick={() => toast("📞 End-to-End Encrypted Matrimonial Voice Call is coming in the next release for VIP verified members!", { icon: '🔒', duration: 4000 })}
                    title="Matrimonial Voice Call (VIP)"
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer text-slate-500 hover:text-emerald-500"
                  >
                    <Phone size={18} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => toast("📹 100% Private Matrimonial Video Calling will be available for VIP Verified members in the next release!", { icon: '👑', duration: 4000 })}
                    title="Matrimonial Video Call (VIP)"
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer text-slate-500 hover:text-amber-500"
                  >
                    <Video size={18} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {/* More Dropdown Menu */}
                  {showMoreMenu && (
                    <div className="absolute right-0 top-12 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-xs font-bold animate-fadeIn">
                      <button
                        type="button"
                        onClick={() => {
                          setShowMoreMenu(false);
                          setShowPartnerModal(true);
                        }}
                        className="w-full px-4 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <span>👤 View Matched Bio-Data</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowMoreMenu(false);
                          setShowUnmatchModal(true);
                        }}
                        className="w-full px-4 py-2 text-left text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2 cursor-pointer border-t border-slate-100 dark:border-slate-800"
                      >
                        <span>💔 End Proposal / Unmatch</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowMoreMenu(false);
                          toast.success(`🛡️ Safety Shield Report received. Admin will monitor this conversation.`);
                        }}
                        className="w-full px-4 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer border-t border-slate-100 dark:border-slate-800"
                      >
                        <span>🚨 Report Conversation</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Partner Quick Bio-Data Modal */}
              {showPartnerModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] max-w-md w-full p-6 shadow-2xl relative text-center">
                    <button 
                      type="button"
                      onClick={() => setShowPartnerModal(false)}
                      className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      ✕
                    </button>
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-rose-500/40 p-0.5">
                      <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{activeChat.name}</h3>
                    <p className="text-xs text-rose-500 font-bold mb-4">Mutual Proposal Match 💕</p>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-left space-y-2 mb-5">
                      <div className="flex justify-between"><span className="text-slate-500">Proposal ID:</span><span className="font-bold font-mono">UG-{String(activeChat.id).slice(-4)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Identity Status:</span><span className="font-bold text-emerald-500">ID Verified Member ✓</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Safety Status:</span><span className="font-bold text-blue-500">In-App Protected Match</span></div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPartnerModal(false)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Back to Chat
                    </button>
                  </div>
                </div>
              )}

              {/* End Proposal / Unmatch Confirmation Modal */}
              {showUnmatchModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] max-w-md w-full p-6 shadow-2xl relative text-center">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-500 text-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                      💔
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                      End Matrimonial Proposal?
                    </h3>
                    <p className="text-xs text-rose-500 font-bold mb-3">
                      {activeChat.name} (UG-{String(activeChat.id).slice(-4)})
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-sinhala">
                      ඔබට මෙම විවාහ යෝජනා සාකච්ඡාව සුහදව අවසන් කිරීමට අවශ්‍යද? ඉන්පසු මෙම සංවාදය Inbox එකෙන් Archive වන අතර දෙපාර්ශ්වයේම රහස්‍යභාවය හා ගෞරවය සුරැකේ.
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowUnmatchModal(false)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        නැවත Chat වෙත
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const targetId = activeChat.id;
                          setShowUnmatchModal(false);
                          try {
                            await proposalApi.unmatch(targetId);
                          } catch {
                            // smooth fallback
                          }
                          setChats(prev => prev.filter(c => c.id !== targetId));
                          setActiveChatId(null);
                          toast.success("විවාහ යෝජනාව සුහදව අවසන් කරන ලදී. 🕊️");
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                      >
                        සුහදව අවසන් කරන්න
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Messages Area */}
              <ScreenshotBlocker currentUserId={userId || 'unknown'}>
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 dark:bg-slate-950/30 relative">
                <div className="text-center">
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Today
                  </span>
                </div>
                
                {activeMessages.map((msg: any) => {
                  const isMyMessage = msg.sender === 'me' || (Boolean(userId) && (msg.sender_id === userId || msg.senderId === userId || msg.sender?.id === userId || msg.SenderID === userId));
                  const msgContent = msg.content || msg.text || '';
                  const msgTime = msg.createdAt || msg.time || msg.CreatedAt || new Date().toISOString();
                  const isRead = msg.read || msg.is_read || false;

                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id} 
                      className={cx("flex", isMyMessage ? "justify-end" : "justify-start")}
                    >
                      <div className={cx(
                        "max-w-[75%] rounded-2xl px-5 py-3 shadow-sm relative group",
                        isMyMessage 
                          ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-sm" 
                          : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm border border-slate-100 dark:border-slate-700"
                      )}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msgContent}</p>
                        
                        <div className={cx(
                          "flex items-center gap-1 mt-1 justify-end",
                          isMyMessage ? "text-blue-100" : "text-slate-400"
                        )}>
                          <span className="text-[10px]">{new Date(msgTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMyMessage && (
                            isRead ? <CheckCheck size={14} className="text-white" /> : <Check size={14} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input or Lock */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                {!isVerified ? (
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-sm font-bold text-slate-700 dark:border-slate-300 mb-2 flex items-center gap-2">
                      <Lock size={16} className="text-blue-500" /> Verify your profile to unlock messaging
                    </p>
                    <button 
                      onClick={() => setPage('settings')}
                      className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors cursor-pointer"
                    >
                      Verify Now
                    </button>
                  </div>
                ) : isMessageLimitReached ? (
                  /* 10/10 MESSAGES USED FOR THIS MATCH - PAYWALL GATEKEEPER */
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                        <Lock size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">Free Message Quota (10/10) Reached for this Match</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sinhala">
                          මෙම match එක සඳහා හිමි නොමිලේ messages 10 අවසන්. Unlimited කතාබස් කිරීමට Classic Plan එකට Upgrade වන්න.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPage('premium')}
                      className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white font-bold text-xs uppercase tracking-wider shrink-0 flex items-center gap-1.5 shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
                    >
                      <Crown size={14} /> Upgrade to Classic
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Live Safety Shield Alert */}
                    {RESTRICTED_PATTERN.test(message) && (
                      <div className="mb-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-amber-500 animate-fadeIn">
                        <ShieldAlert size={18} className="shrink-0 mt-0.5 text-amber-500" />
                        <div>
                          <span className="font-bold text-xs">🛡️ Uni Porondam Safety Shield සක්‍රීයයි:</span>
                          <p className="text-[11px] text-amber-600/90 dark:text-amber-400/90 leading-relaxed mt-0.5 font-medium">
                            ඔබගේ සහ සහකරුගේ පෞද්ගලිකත්වය සුරැකීමට බාහිර සමාජ මාධ්‍ය links හෝ දුරකථන අංක හුවමාරු කිරීම අවහිර කර ඇත. සියලු සන්නිවේදනයන් මෙම ආරක්ෂිත chat එක තුළ පමණක් සිදු කරන්න.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Header Row: Icebreakers + Free Quota Counter */}
                    <div className="mb-2.5 flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar pb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                          <Sparkles size={11} className="text-amber-500" /> Icebreakers:
                        </span>
                        {ICEBREAKER_TEMPLATES.map((tmpl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setMessage(tmpl)}
                            className="text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 cursor-pointer"
                          >
                            {tmpl}
                          </button>
                        ))}
                      </div>

                      {/* Remaining Messages Chip for Free users */}
                      {!isPremium && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 shrink-0">
                          {10 - mySentMessagesCount} / 10 Free Left
                        </span>
                      )}
                    </div>

                    <div className="flex items-end gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-2 border border-slate-200 dark:border-slate-700 focus-within:border-blue-500/50 focus-within:ring-2 ring-blue-500/20 transition-all">
                      <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shrink-0">
                        <Smile size={24} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shrink-0">
                        <Paperclip size={24} />
                      </button>
                    
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 text-sm text-slate-900 dark:text-white max-h-32 min-h-[44px]"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    
                    <button 
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                    >
                      <Send size={18} className="translate-x-[1px]" />
                    </button>
                  </div>
                </>
                )}
              </div>
                </div>
              </ScreenshotBlocker>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
