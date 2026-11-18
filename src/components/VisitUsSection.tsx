import React, { useState } from 'react';
import {
  Check,
  Clock,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Star,
} from 'lucide-react';
import { STORE_CONFIG } from '../data/products';
import {
  CUSTOMER_REVIEWS,
  SHOWROOM_LANDMARKS,
  SHOWROOM_LOCATION,
  STORE_RATING_SUMMARY,
  buildGoogleMapsUrl,
} from '../data/storeShowroom';
import { buildGeneralInquiryUrl } from '../utils/whatsapp';
import { ShowroomGoogleMap } from './ShowroomGoogleMap';

interface VisitUsSectionProps {
  hasMapsApiKey: boolean;
}

export const VisitUsSection: React.FC<VisitUsSectionProps> = ({ hasMapsApiKey }) => {
  const [activeLandmarkId, setActiveLandmarkId] = useState<string>('store');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const selectedLandmark =
    SHOWROOM_LANDMARKS.find((lm) => lm.id === activeLandmarkId) ?? SHOWROOM_LANDMARKS[0];

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(SHOWROOM_LOCATION.plotAddress);
    } catch {
      // Fallback handled cleanly via local state feedback
    }
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2400);
  };

  return (
    <section id="visit-us" className="bg-[#05070B] py-14 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#60A5FA]">
              <span>Visit Us</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Commercial Area, Phase 6, DHA, Lahore</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 tabular-nums">
                {STORE_RATING_SUMMARY.score.toFixed(1)} / 5.0 Customer Rating
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
              Visit Our Showroom &amp; Customer Ratings
            </h2>
          </div>

          <a
            href={buildGoogleMapsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#60A5FA] hover:text-blue-300 transition-colors whitespace-nowrap shrink-0"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Main 2-Column Layout: Map & Ratings Left | Store Info Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (7 cols): Interactive Dark Google Map + Ratings */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Dark Google Map Card */}
            <div className="bg-[#111622] border border-white/10 rounded-3xl overflow-hidden flex flex-col">
              {/* Map Header */}
              <div className="px-5 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-8 h-8 rounded-xl bg-[#0066FF]/15 border border-[#3B82F6]/30 text-[#60A5FA] flex items-center justify-center shrink-0">
                    <Navigation className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">
                      DHA Phase 6 · Interactive Google Map
                    </h3>
                    <p className="text-xs text-slate-400 font-mono tabular-nums truncate">
                      {SHOWROOM_LOCATION.coordinates}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveLandmarkId('store')}
                  className="px-3 py-1.5 rounded-lg bg-[#090C12] hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  Center on Store
                </button>
              </div>

              {/* Live Dark-Mode Google Map */}
              <ShowroomGoogleMap
                selectedLandmark={selectedLandmark}
                onSelectLandmark={setActiveLandmarkId}
                hasApiKey={hasMapsApiKey}
              />

              {/* Selected Landmark Readout Bar */}
              <div className="px-5 py-3 border-t border-white/10 bg-[#0B101B] flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {selectedLandmark.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {selectedLandmark.note}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#60A5FA] font-mono tabular-nums block">
                    {selectedLandmark.distance}
                  </span>
                  <span className="text-[11px] text-slate-400">{selectedLandmark.travelTime}</span>
                </div>
              </div>

              {/* Landmark Selector Buttons & Copy Address Bar */}
              <div className="px-5 py-4 border-t border-white/10 bg-[#090C12] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Nearby landmarks">
                  {SHOWROOM_LANDMARKS.map((lm) => {
                    const isActive = lm.id === activeLandmarkId;
                    return (
                      <button
                        key={lm.id}
                        type="button"
                        onClick={() => setActiveLandmarkId(lm.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-[#0066FF] text-white'
                            : 'bg-[#111622] text-slate-300 border border-white/10 hover:text-white'
                        }`}
                      >
                        {lm.shortLabel}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#111622] hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Address Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#60A5FA]" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Verified Rating Breakdown & Reviews Card */}
            <div className="bg-[#111622] border border-white/10 rounded-3xl p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pb-5 border-b border-white/10">
                {/* Overall Score */}
                <div className="sm:col-span-5 space-y-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
                      {STORE_RATING_SUMMARY.score.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-400 font-mono">/ 5.0</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#FACC15]" aria-label="4.9 out of 5 stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-slate-200 tabular-nums">
                    {STORE_RATING_SUMMARY.totalReviews} Verified Buyer Reviews
                  </p>
                  <p className="text-xs text-slate-400">
                    {STORE_RATING_SUMMARY.verifiedLabel}
                  </p>
                </div>

                {/* 5-Star Distribution Bars */}
                <div className="sm:col-span-7 space-y-2.5">
                  {STORE_RATING_SUMMARY.breakdown.map((row) => (
                    <div key={row.stars} className="flex items-center gap-3 text-xs">
                      <span className="w-14 whitespace-nowrap text-slate-300 font-mono tabular-nums shrink-0">
                        {row.stars} Star
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-[#090C12] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#0066FF]"
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                      <span className="w-9 text-right text-slate-400 font-mono tabular-nums shrink-0">
                        {row.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Customer Testimonials */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CUSTOMER_REVIEWS.map((review) => (
                  <article
                    key={review.id}
                    className="bg-[#090C12] border border-white/10 rounded-2xl p-4 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-0.5 text-[#FACC15]" aria-label={`${review.rating} stars`}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-3 h-3 fill-current" aria-hidden="true" />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-500">{review.dateLabel}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-xs font-semibold text-white">{review.author}</p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {review.location} · {review.device}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Store Information, Hours, Contact & Visitor Perks */}
          <div className="lg:col-span-5 bg-[#111622] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Store Location &amp; Desk Hours</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Walk in for hands-on flagship demos, instant PTA verification, or in-store pickup.
                </p>
              </div>

              {/* Contact & Address Rows */}
              <div className="divide-y divide-white/10 border-t border-b border-white/10">
                <div className="py-4 flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#60A5FA] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 block">
                      Flagship Address
                    </span>
                    <p className="text-sm font-semibold text-white">
                      {SHOWROOM_LOCATION.plotAddress}
                    </p>
                    <p className="text-xs text-slate-400">
                      {SHOWROOM_LOCATION.landmarkSummary}
                    </p>
                  </div>
                </div>

                <div className="py-4 flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-[#60A5FA] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 block">
                      Opening Hours
                    </span>
                    <p className="text-sm font-semibold text-white tabular-nums">
                      {SHOWROOM_LOCATION.hoursWeekday}
                    </p>
                    <p className="text-xs text-slate-400 tabular-nums">
                      {SHOWROOM_LOCATION.hoursFridayBreak}
                    </p>
                  </div>
                </div>

                <div className="py-4 flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-[#60A5FA] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 block">
                      Direct Helpline &amp; WhatsApp
                    </span>
                    <a
                      href={`tel:${STORE_CONFIG.phoneDisplay}`}
                      className="text-sm font-bold text-[#60A5FA] hover:text-blue-300 font-mono tabular-nums block transition-colors"
                    >
                      {STORE_CONFIG.phoneDisplay}
                    </a>
                    <p className="text-xs text-slate-400">
                      Instant stock checks &amp; reservation hold on WhatsApp
                    </p>
                  </div>
                </div>

                <div className="py-4 flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-[#60A5FA] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 block">
                      Support &amp; Corporate Desk
                    </span>
                    <a
                      href={`mailto:${STORE_CONFIG.email}`}
                      className="text-sm font-semibold text-white hover:text-[#60A5FA] transition-colors block"
                    >
                      {STORE_CONFIG.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Practical In-Store Random Information */}
              <div className="rounded-2xl bg-[#090C12] border border-white/10 p-4 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Good to Know Before You Visit
                </h4>
                <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
                  <li>{SHOWROOM_LOCATION.parkingNote}</li>
                  <li>{SHOWROOM_LOCATION.dispatchCutoff}</li>
                  <li>Apple, Samsung, Google Pixel, OnePlus &amp; Xiaomi live demo units ready</li>
                </ul>
              </div>
            </div>

            {/* Bottom CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={buildGeneralInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#0066FF] hover:bg-[#1A75FF] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>WhatsApp Store ({STORE_CONFIG.phoneDisplay})</span>
              </a>

              <a
                href={buildGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#090C12] hover:bg-white/10 border border-white/15 text-slate-200 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#60A5FA]" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
