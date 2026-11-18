export const SHOWROOM_IMAGE = '/src/assets/images/yasir_showroom_lahore_1794606073967.jpg';

export interface AboutPillar {
  id: 'story' | 'verification' | 'care';
  label: string;
  headline: string;
  body: string;
  highlights: string[];
}

export const ABOUT_PILLARS: AboutPillar[] = [
  {
    id: 'story',
    label: 'Our Story',
    headline: 'Trusted Flagship Smartphone Specialists in Lahore Since 2016',
    body: 'Founded in DHA Phase 6, Yasir Mobile Store started as a dedicated flagship counter for buyers who wanted factory-sealed devices without grey-market guesswork. Today, our team curates 47+ verified models across Apple, Samsung, Google Pixel, OnePlus, Xiaomi, and realme—backed by transparent PKR pricing and nationwide insured dispatch.',
    highlights: [
      'Direct sourcing from authorized regional distributors and official brand partners',
      'Dedicated showroom desk in Commercial Area, DHA Phase 6 for hands-on comparison',
      'Live stock transparency with instant WhatsApp order confirmation on 03293179587',
    ],
  },
  {
    id: 'verification',
    label: 'PTA & Quality Check',
    headline: '28-Point Diagnostic & Official PTA IMEI Verification',
    body: 'Every smartphone—whether brand-new factory sealed or certified showroom stock—passes our multi-stage authenticity inspection before leaving the counter. Buyers receive the exact IMEI serial check on the spot and clear warranty coverage documentation.',
    highlights: [
      'Official DIRBS / PTA approval verification prior to sealing your invoice',
      'Original battery health, True Tone, and display uniformity verification',
      '7-day instant replacement cover against any manufacturer hardware defect',
    ],
  },
  {
    id: 'care',
    label: 'Trade-In & Delivery',
    headline: 'Same-Day Lahore Courier & Instant Device Upgrade Desk',
    body: 'Upgrading from an older iPhone or Galaxy flagship takes under 15 minutes at our Lahore lounge. For online shoppers across Karachi, Islamabad, Rawalpindi, and Multan, orders dispatch in tamper-evident armored boxes with real-time order tracking.',
    highlights: [
      'Fair on-spot valuation when trading in gently used PTA-approved flagships',
      'Same-day 2-hour rider delivery across DHA, Gulberg, Model Town, and Cantt',
      '24–48 hour insured air courier across Pakistan with Cash on Delivery support',
    ],
  },
];

export const ABOUT_METRICS = [
  { value: '2016', label: 'Established in Lahore' },
  { value: '18,500+', label: 'Smartphones Delivered' },
  { value: '100%', label: 'PTA & IMEI Verified' },
  { value: '47+', label: 'Flagship Models Ready' },
];

export interface RatingBreakdownRow {
  stars: number;
  percentage: number;
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  device: string;
  rating: number;
  dateLabel: string;
  comment: string;
}

export interface ShowroomLandmark {
  id: string;
  name: string;
  shortLabel: string;
  distance: string;
  travelTime: string;
  note: string;
  lat: number;
  lng: number;
}

export const SHOWROOM_LOCATION = {
  shortHeading: 'Commercial Area, Phase 6, DHA',
  plotAddress: 'Plot 42-C, Commercial Area, Phase 6, DHA, Lahore, Pakistan',
  coordinates: '31.4697° N, 74.4480° E',
  lat: 31.4697,
  lng: 74.448,
  landmarkSummary: 'Opposite Sector C Main Boulevard, 2 mins from DHA Raya Fairways',
  hoursWeekday: 'Monday – Sunday: 09:00 AM – 09:00 PM',
  hoursFridayBreak: 'Friday Break: 01:00 PM – 02:30 PM',
  parkingNote: 'Free valet & parking available',
  dispatchCutoff: 'Order before 04:00 PM for same-day Lahore express rider delivery',
};

export const STORE_RATING_SUMMARY = {
  score: 4.9,
  outOf: 5,
  totalReviews: '4,280+',
  verifiedLabel: '98% recommend buying in-store & online',
  breakdown: [
    { stars: 5, percentage: 89 },
    { stars: 4, percentage: 8 },
    { stars: 3, percentage: 2 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 0 },
  ] as RatingBreakdownRow[],
};

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Hamza Tariq',
    location: 'DHA Phase 5, Lahore',
    device: 'iPhone 16 Pro · 256GB',
    rating: 5,
    dateLabel: '2 days ago',
    comment: 'Verified the PTA IMEI status right in front of me at the Phase 6 desk. Sealed box, zero hidden charges, and quick setup.',
  },
  {
    id: 'rev-2',
    author: 'Ayesha Kamran',
    location: 'Bahria Town, Lahore',
    device: 'Galaxy S24 Ultra · 512GB',
    rating: 5,
    dateLabel: '1 week ago',
    comment: 'Ordered via WhatsApp at noon and received my courier rider by 3:30 PM with the printed invoice and seal intact.',
  },
  {
    id: 'rev-3',
    author: 'Bilal Mahmood',
    location: 'F-7 Markaz, Islamabad',
    device: 'Google Pixel 9 Pro',
    rating: 5,
    dateLabel: '2 weeks ago',
    comment: 'Packaged securely for Islamabad delivery. Live tracking link updated smoothly and customer care replied in minutes.',
  },
];

export const SHOWROOM_LANDMARKS: ShowroomLandmark[] = [
  {
    id: 'store',
    name: 'Yasir Mobile Store Lounge',
    shortLabel: 'Yasir Store',
    distance: '0 m',
    travelTime: 'Destination',
    note: 'Plot 42-C, Commercial Area, Phase 6 — ground floor showroom with demo counters.',
    lat: 31.4697,
    lng: 74.448,
  },
  {
    id: 'raya',
    name: 'DHA Raya Golf & Country Club',
    shortLabel: 'Raya Club',
    distance: '450 m',
    travelTime: '2 min drive',
    note: 'Head west down Main Boulevard Phase 6 directly toward Sector C Commercial.',
    lat: 31.4742,
    lng: 74.4395,
  },
  {
    id: 'ring-road',
    name: 'Lahore Ring Road Phase 6 Exit',
    shortLabel: 'Ring Road Exit',
    distance: '1.2 km',
    travelTime: '4 min drive',
    note: 'Take Nawaz Sharif Interchange exit onto DHA Phase 6 Main Boulevard.',
    lat: 31.482,
    lng: 74.4585,
  },
  {
    id: 'parking',
    name: 'Sector C Visitor Parking Lot',
    shortLabel: 'Free Parking',
    distance: '120 m',
    travelTime: '1 min walk',
    note: 'Shaded ground parking bay directly behind Commercial Plaza Block C.',
    lat: 31.4691,
    lng: 74.4486,
  },
];

export function clampMapZoom(zoom: number): number {
  return Math.min(1.8, Math.max(0.85, Number(zoom.toFixed(2))));
}

export function buildGoogleMapsUrl(address: string = SHOWROOM_LOCATION.plotAddress): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function buildGoogleMapsDirectionsUrl(
  destination: string = SHOWROOM_LOCATION.plotAddress
): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
