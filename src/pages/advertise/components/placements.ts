export type PlacementId = 'BANNER' | 'SIDEBAR' | 'NATIVE_FEED' | 'POPUP';

export interface PlacementInfo {
  id: PlacementId;
  title: string;
  short: string;
  desc: string;
  bestFor: string;
  specs: string;
  ratePerDay: number;       // LKR
  dailyImpressions: number; // estimated
  ctr: number;              // estimated click-through rate (0-1)
}

// NOTE: ratePerDay, dailyImpressions and ctr are planning estimates used by the
// Reach Calculator and Placement Explorer. Replace them with real analytics
// once a public stats endpoint is available.
export const PLACEMENTS: PlacementInfo[] = [
  {
    id: 'BANNER',
    title: 'Top Banner',
    short: 'Banner',
    desc: 'Full-width banner at the top of high-traffic feeds. First thing students see.',
    bestFor: 'Course intakes & brand launches',
    specs: '1200 × 400 px',
    ratePerDay: 1350,
    dailyImpressions: 3500,
    ctr: 0.009,
  },
  {
    id: 'NATIVE_FEED',
    title: 'Native Feed Card',
    short: 'Feed',
    desc: 'Blends into annex, event and market listings as a sponsored card.',
    bestFor: 'Services, events & app installs',
    specs: '800 × 450 px',
    ratePerDay: 1200,
    dailyImpressions: 2800,
    ctr: 0.015,
  },
  {
    id: 'SIDEBAR',
    title: 'Sticky Sidebar',
    short: 'Sidebar',
    desc: 'Stays in view while students scroll. Shows as a feed card on mobile.',
    bestFor: 'Local shops & ongoing deals',
    specs: '300 × 300 px',
    ratePerDay: 1000,
    dailyImpressions: 2100,
    ctr: 0.006,
  },
  {
    id: 'POPUP',
    title: 'Global Popup',
    short: 'Popup',
    desc: 'Full-screen interstitial shown once per session. Maximum attention.',
    bestFor: 'Big launches & limited-time offers',
    specs: '600 × 600 px',
    ratePerDay: 2200,
    dailyImpressions: 5000,
    ctr: 0.025,
  },
];

export const DURATION_OPTIONS = [7, 14, 21, 30] as const;

export const getPlacement = (id: PlacementId) =>
  PLACEMENTS.find((p) => p.id === id) ?? PLACEMENTS[0];

export const formatLKR = (n: number) => `LKR ${Math.round(n).toLocaleString('en-LK')}`;
export const formatNum = (n: number) => Math.round(n).toLocaleString('en-LK');
