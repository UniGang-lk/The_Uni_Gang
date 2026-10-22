# 💍 Uni Porondam (Proposal System) - Development Handover & Progress Summary
**Last Updated:** 2026-10-21 (End-to-End Implementation Session)  
**Status:** 3-Tier Membership Ecosystem, Safety Shield Filter, Bank Slip Uploads, and Admin Verification Queue are 100% operational across Frontend, Backend, Database, and Admin Dashboard.

---

## 📌 1. අද දින සාර්ථකව සම්පූර්ණ කළ කාර්යයන් (Completed Today)

### A. 💎 The Master 3-Tier All-Inclusive Membership Ecosystem
- සම්පූර්ණයෙන්ම ක්‍රියාත්මක කළ Packages 3:
  1. **🥉 Basic (Free Plan - රු. 0 Lifetime):** Bio-data creation, Admin-only NIC Verification, 10 profile views/day, 3 proposals/mo, receiving proposals free, 10 initial in-app messages on match.
  2. **🥈 Classic Plan (Most Popular - රු. 2,990 / මාස 3):** Unlimited profiles & proposals, Unlimited In-App Real-Time Chat, "Who Liked You" unlocked, Read Receipts (Seen ✓✓), Shortlist 25 profiles with private family notes, Rewind 5 passes/day, 2x profile boost.
  3. **🥇 VIP Premium Plan (Best Value - රු. 4,990 / මාස 6):** මාස 6ක වලංගුභාවය (දින 180), 5x Top of Discover Stack & Exclusive Gold VIP Ring, Incognito / Ghost Mode (රහසිගතව profiles නැරඹීම), Unlimited shortlists & rewinds, සම්පූර්ණ කේන්දරය & පොරොන්දම් වාර්තාව, Priority VIP Admin WhatsApp Concierge.
- **Frontend Pages Aligned:**
  - `Website/src/features/proposal/pages/ProposalPremiumPage.tsx`
  - `Website/src/components/proposal/ProposalPricingCards.tsx`

### B. 🛡️ In-App Chat Safety Shield & External Link / Contact Blocker
- **Zero Platform Leakage & Anti-Harassment:**
  - WhatsApp හෝ Personal phone numbers බාහිරව හෙළිදරව් නොකර platform එක තුළම ආරක්ෂිත Real-Time In-App Chat එක සක්‍රීය කරන ලදී.
  - Social media links (`fb.com`, `facebook.com`, `instagram.com`, `ig:`, `tiktok.com`, `linkedin.com`, `t.me`, `wa.me`) සහ දුරකථන අංක type කරන විට input box එක මත සජීවී **Amber Safety Shield Alert Banner** එකක් පෙන්වනු ලැබේ.
  - Send button ක්ලික් කිරීමේදී restricted content හමු වුවහොත් toast alert මගින් අවහිර කර පරිශීලකයාගේ පෞද්ගලිකත්වය සුරකියි.
  - ගෞරවනීය සිංහල Matrimonial Icebreaker chips 3ක් input box එක මත සපයා ඇත.
- **Backend Filter (`Backend/internal/controller/proposal_controller.go`):**
  - Regex මගින් links සහ phone numbers `[🛡️ Contact/Link Blocked for Safety]` ලෙස sanitize කර `blockedContentDetected: true` සහ warning message එක API response එක මගින් ලබා දේ.

### C. 🏛️ Database & Backend Go Architecture
- **Updated Models (`Backend/internal/model/proposal.go`):**
  - `ProposalProfile`: `ManagedBy` (`'self'` vs `'parents'`) field එක එක් කරන ලදී.
  - `ProposalPayment`: `ReferenceNumber`, `PaymentDate`, `WhatsAppNumber`, `DurationMonths` (3 or 6) fields එක් කරන ලදී.
- **Submit Payment Endpoint (`POST /api/proposals/payments`):**
  - `multipart/form-data` හරහා transfer slip image/pdf upload කර `middleware.SaveUploadedFile` මගින් `/uploads/...` ලෙස සුරැකීම හෝ JSON bind කිරීම යන ක්‍රම දෙකටම සහය දක්වයි.
  - Plan type අනුව (`classic_3m` ➔ රු. 2,990, `vip_6m` ➔ රු. 4,990) duration සහ amount auto-assign කර pending review තත්වයට පත් කරයි.

### D. 👑 Admin Dashboard Moderation & Verification Queue
- **Admin Dashboard Integration (`Dashboard/src/pages/admin/ProposalsPage.tsx`):**
  - **3rd Tab එක් කරන ලදී: `💰 Verify Payments`** (Pending badge count සමග).
  - Pending Review, Active Members, සහ Rejected payments filter කිරීමේ හැකියාව.
  - Member name, email, WhatsApp number, selected plan, amount, bank reference, transfer date සහ slip preview.
  - Slip එක zoom කර බැලිය හැකි High-resolution modal viewer.
  - **`Approve & Activate` (Emerald button):** ක්ලික් කළ විට payment එක approve වී, අදාළ user ගේ proposal profile එක `is_premium = true` සහ `premium_until` (දින 90 හෝ 180) auto-calculate වී සක්‍රීය වේ. පරිශීලකයාට System Notification එකක් auto-trigger වේ.
  - **`Reject` (Rose button):** Invalid slips reject කර පරිශීලකයාට alert එකක් යවයි.
- **Admin API Endpoints (`Backend/internal/controller/admin_controller.go`):**
  - `GET /api/admin/proposals/payments`
  - `PUT /api/admin/proposals/payments/:id/status`

### E. 🔒 Free Tier Quota Limits & Strict Hard Paywalls (Implemented)
- **1. දිනක Profiles පිරික්සුම් සීමාව (10 Daily Views):**
  - Basic සාමාජිකයින්ට දිනකට Profiles 10ක් පමණක් නැරඹිය හැකි අතර, 11 වන Profile එකේදී **Discover Paywall Banner Card** එක මගින් block වී Upgrade කිරීමට මග පෙන්වයි.
- **2. මාසික Proposal යැවීමේ සීමාව (3 Monthly Proposals):**
  - Basic සාමාජිකයින්ට මසකට යැවිය හැක්කේ Proposal Requests 3ක් පමණි. 4 වන Proposal එක යැවීමට ගිය විට **`ProposalLimitModal`** එක popup වී Classic / VIP වෙත Upgrade කිරීමට මග පෙන්වයි.
- **3. Chat Message සීමාව (10 Messages Per Match):**
  - Chat එකක් unlock වූ විට Basic සාමාජිකයින්ට අදාළ match එක සමග යැවිය හැක්කේ පණිවිඩ 10ක් පමණි.
  - 10 වන පණිවිඩයෙන් පසු Chat Input එක lock වී, "Message Limit Reached" paywall card එක දිස්වේ. අනෙකුත් matches සඳහා ද වෙන වෙනම 10 බැගින් හිමිවේ.

