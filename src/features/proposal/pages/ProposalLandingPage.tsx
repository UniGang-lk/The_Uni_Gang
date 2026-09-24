import { motion } from 'framer-motion';
import { ShieldCheck, Heart, Crown, Lock, Video, CheckCircle2, Star, UserCheck, Sparkles, ArrowRight } from 'lucide-react';
import { PrimaryButton, Card } from '../components/ui/ProposalPrimitives';
import { SUCCESS_STORIES } from '../data/mockProposalData';
import ProposalHeroSection from '../components/hero/ProposalHeroSection';
import ProposalFAQSection from '../components/faq/ProposalFAQSection';
import { useTheme } from '../../../context/ThemeContext';

export default function ProposalLandingPage({
  onGetStarted,
  hasProposalProfile = false
}: {
  dark?: boolean;
  onGetStarted: () => void;
  hasProposalProfile?: boolean;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`w-full relative min-h-screen font-sans selection:bg-rose-500/30 overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto relative z-10">

        {/* 1. HERO SECTION */}
        <ProposalHeroSection onGetStarted={onGetStarted} hasProposalProfile={hasProposalProfile} />

        {/* 2. TRUST & SAFETY SECTION (MATCHING SCREENSHOT 1) */}
        <section className="py-16 relative">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className={`p-8 text-center hover:-translate-y-2 transition-transform duration-500 ${
              isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
            }`}>
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 shadow-inner">
                <Lock size={28} strokeWidth={2.5} />
              </div>
              <h3 className={`text-xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>100% Confidential</h3>
              <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Your profile is invisible to search engines like Google or Facebook. Only verified members can view your details.
              </p>
            </Card>
            <Card className={`p-8 text-center hover:-translate-y-2 transition-transform duration-500 ${
              isDark ? 'bg-slate-900/80 border-rose-900/30 text-white' : 'bg-white border-rose-200 text-slate-900 shadow-xl'
            }`}>
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center mb-6 text-rose-500 shadow-inner">
                <UserCheck size={28} strokeWidth={2.5} />
              </div>
              <h3 className={`text-xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Elite Community</h3>
              <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Strictly for undergraduates and graduates. Every profile is manually vetted using University ID or Alumni proof.
              </p>
            </Card>
            <Card className={`p-8 text-center hover:-translate-y-2 transition-transform duration-500 ${
              isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
            }`}>
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-500 shadow-inner">
                <ShieldCheck size={28} strokeWidth={2.5} />
              </div>
              <h3 className={`text-xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Privacy First</h3>
              <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Keep your photos blurred to the public. Reveal your identity only to those whose proposals you explicitly accept.
              </p>
            </Card>
          </div>
        </section>



        {/* 3. HOW IT WORKS */}
        <section className={`py-20 relative border-t ${isDark ? 'border-slate-900' : 'border-slate-200'}`}>
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-5xl font-black mt-4 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              How Uni Porondam Works
            </h2>
          </div>

          <div className="space-y-16 w-full">
            {/* Step 1 */}
            <div className="grid lg:grid-cols-2 gap-10 sm:gap-14 items-center group">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 mb-5 font-black text-xl shadow-inner">01</div>
                <h3 className={`text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Create a Verified Profile
                </h3>
                <p className={`text-sm sm:text-base leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Join an exclusive community. Your profile is strictly verified using your University Student ID or Alumni details to keep out fake accounts and casual daters.
                </p>
                <ul className="space-y-3">
                  {[
                    "Manual verification within 24 hours",
                    "Add your faculty, profession, and district",
                    "Set up your privacy preferences (e.g. Blur photos)"
                  ].map(point => (
                    <li key={point} className={`flex items-center gap-3 text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`order-1 lg:order-2 relative h-[360px] sm:h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all duration-700 hover:shadow-rose-500/20 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Students studying" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>
                <div className={`absolute bottom-6 left-6 right-6 p-4 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-4 border animate-fade-up ${
                  isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
                }`}>
                  <ShieldCheck size={32} className="text-emerald-500" />
                  <div>
                    <p className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Identity Verified</p>
                    <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>UCSC Registration confirmed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid lg:grid-cols-2 gap-10 sm:gap-14 items-center group">
              <div className={`relative h-[360px] sm:h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all duration-700 hover:shadow-fuchsia-500/20 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <img src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Friends laughing" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>
                <div className={`absolute bottom-6 left-6 right-6 p-4 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-4 border animate-fade-up ${
                  isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
                }`}>
                  <ShieldCheck size={32} className="text-fuchsia-500" />
                  <div>
                    <p className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Smart Algorithm</p>
                    <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Matching based on lifestyle & district</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-fuchsia-500/20 text-fuchsia-500 mb-5 font-black text-xl shadow-inner">02</div>
                <h3 className={`text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Discover & Get Matched
                </h3>
                <p className={`text-sm sm:text-base leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Our smart filters do the heavy lifting. We surface individuals who perfectly align with your relationship goals, geographical preferences, and academic background.
                </p>
                <ul className="space-y-3">
                  {[
                    "Swipe through highly compatible profiles",
                    "Filter by specific Universities and Faculties",
                    "See mutual hobbies and lifestyle choices"
                  ].map(point => (
                    <li key={point} className={`flex items-center gap-3 text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      <CheckCircle2 size={18} className="text-fuchsia-500 shrink-0" /> {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid lg:grid-cols-2 gap-10 sm:gap-14 items-center group">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 mb-5 font-black text-xl shadow-inner">03</div>
                <h3 className={`text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Send a Proposal & Connect
                </h3>
                <p className={`text-sm sm:text-base leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  When you find someone special, send them a proposal. If they accept, you unlock a private chat room to start the conversation securely in real-time.
                </p>
                <ul className="space-y-3">
                  {[
                    "Real-time Secure Messaging with instant delivery",
                    "Live Online/Offline status tracking",
                    "In-App Voice & Video calls for Premium members"
                  ].map(point => (
                    <li key={point} className={`flex items-center gap-3 text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      <CheckCircle2 size={18} className="text-amber-500 shrink-0" /> {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`order-1 lg:order-2 relative h-[360px] sm:h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all duration-700 hover:shadow-amber-500/20 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Couple holding hands" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none"></div>

                <div className={`absolute top-1/3 left-6 backdrop-blur-xl p-3 pr-5 rounded-2xl rounded-bl-none shadow-xl border animate-[float_4s_ease-in-out_infinite] ${
                  isDark ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
                }`}>
                  <p className="text-xs font-bold font-sans">Hi! I saw you're from UoM too? 👋</p>
                </div>
                <div className="absolute top-1/2 right-6 bg-rose-500 p-3 pr-5 rounded-2xl rounded-br-none shadow-xl shadow-rose-500/30 animate-[float_5s_ease-in-out_infinite_reverse]">
                  <p className="text-white text-xs font-bold font-sans">Yes! Batch of '19. Nice to meet you! 😊</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SUCCESS STORIES */}
        <section className={`py-20 border-t ${isDark ? 'border-slate-900' : 'border-slate-200'}`}>
          <div className="text-center mb-14 relative z-10">
            <h2 className={`text-3xl sm:text-5xl font-black mt-4 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Happily Ever After
            </h2>
            <p className={`mt-3 text-sm sm:text-base font-medium max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Real stories from verified university alumni who found their perfect match right here on Uni Porondam.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUCCESS_STORIES.slice(0, 3).map((story) => (
              <Card key={story.id} className={`p-6 flex flex-col hover:-translate-y-2 transition-transform duration-500 border ${
                isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
              }`}>
                <div className="relative h-48 rounded-2xl overflow-hidden mb-5">
                  <img src={story.image} alt="Couple" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-bold text-base">{story.names}</p>
                    <p className="text-rose-400 font-bold text-xs">Married {story.date}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex gap-1 text-amber-400 mb-3">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill="currentColor" />)}
                  </div>
                  <p className={`text-xs sm:text-sm font-medium italic leading-relaxed line-clamp-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    "{story.quote}"
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 5. PRICING PLANS */}
        <section id="pricing" className={`py-20 border-t w-full font-sans ${isDark ? 'border-slate-900' : 'border-slate-200'}`}>
          <div className="text-center mb-14 relative z-10">
            <h2 className={`text-3xl sm:text-5xl font-black mt-4 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Choose your path
            </h2>
            <p className={`mt-3 text-sm sm:text-base font-medium max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Start for free and experience the platform, or upgrade to Premium for unlimited access and advanced matching features.
            </p>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full items-stretch relative z-10">
              {/* Free Tier */}
              <div className={`p-7 sm:p-9 rounded-[2.5rem] backdrop-blur-md border flex flex-col h-full relative overflow-hidden shadow-xl ${
                isDark ? 'bg-slate-900/60 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Basic Plan</h3>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Free</span>
                    <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>forever</span>
                  </div>
                </div>

                <ul className="space-y-4 flex-1">
                  {[
                    "Create a verified profile",
                    "View 6 profiles per day",
                    "Send 6 proposals per day",
                    "Basic district & age filtering",
                    "6 Messages per match",
                    "AI Phone Number Masking (Security)",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <PrimaryButton onClick={onGetStarted} className={`w-full mt-8 shadow-none border-none ${
                  isDark ? 'bg-white text-slate-950 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}>
                  Get Started for Free
                </PrimaryButton>
              </div>

              {/* Premium Tier */}
              <div className="p-7 sm:p-9 rounded-[2.5rem] bg-gradient-to-b from-amber-500/20 to-rose-500/5 backdrop-blur-xl border border-amber-500/30 flex flex-col h-full relative overflow-hidden shadow-2xl">
                <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg">
                  <Crown size={12} strokeWidth={3} /> Most Popular
                </div>

                <div className="mb-6 relative z-10">
                  <h3 className="text-xl font-bold text-amber-500 mb-1">Premium</h3>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>Rs. 1,500</span>
                    <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/ month</span>
                  </div>
                </div>

                <ul className="space-y-4 flex-1 relative z-10">
                  {[
                    "Unlimited profile viewing & proposals",
                    "See exactly who liked your profile",
                    "Advanced filters (Profession, Diet, Hobbies)",
                    "Priority profile placement (5x more views)",
                    "Read receipts & Undo accidental swipes",
                    "Exclusive Grid / Gallery View",
                    "Ad-free experience"
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-amber-500 shrink-0 mt-0.5" />
                      <span className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{f}</span>
                    </li>
                  ))}

                  <li className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Video size={10} className="text-white" fill="white" />
                    </div>
                    <span className="text-xs font-bold text-amber-500 leading-relaxed">
                      Exclusive In-App Video & Voice Calling (100% Privacy)
                    </span>
                  </li>
                </ul>

                <button className="w-full mt-8 py-3.5 px-6 rounded-full font-extrabold text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl hover:scale-[1.02] transition-all">
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. SINHALA FAQ / Q&A SECTION */}
        <ProposalFAQSection />

        {/* 7. FOOTER CTA */}
        <section className={`py-20 text-center border-t ${isDark ? 'border-slate-900' : 'border-slate-200'}`}>
          <h2 className={`text-3xl sm:text-5xl font-black mb-4 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Ready to find your match?
          </h2>
          <p className={`text-sm sm:text-base font-medium mb-8 max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Join thousands of verified undergraduates and alumni across Sri Lanka who are already writing their success stories.
          </p>
          <PrimaryButton onClick={onGetStarted} icon={Heart} className="px-8 py-4 text-xs font-extrabold shadow-[0_0_35px_rgba(244,63,94,0.4)]">
            {hasProposalProfile ? 'Go to My Proposal Dashboard' : 'Join Uni Porondam Today'}
          </PrimaryButton>
        </section>
      </div>
    </div>
  );
}
