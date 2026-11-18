import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import { ABOUT_METRICS, ABOUT_PILLARS, SHOWROOM_IMAGE } from '../data/storeShowroom';
import { buildGeneralInquiryUrl } from '../utils/whatsapp';

interface AboutUsSectionProps {
  onBrowseCatalog: () => void;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({ onBrowseCatalog }) => {
  const [activePillarId, setActivePillarId] = useState<'story' | 'verification' | 'care'>('story');
  const [imgFailed, setImgFailed] = useState(false);

  const activePillar =
    ABOUT_PILLARS.find((pillar) => pillar.id === activePillarId) ?? ABOUT_PILLARS[0];

  return (
    <section id="about-us" className="bg-[#05070B] py-14 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-[#60A5FA]">
              <span>About Us</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">DHA Phase 6, Lahore</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Since 2016</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
              Built Around Verified Flagships &amp; Honest Care
            </h2>
          </div>

          <a
            href="#visit-us"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#60A5FA] hover:text-blue-300 transition-colors whitespace-nowrap shrink-0"
          >
            <span>See Showroom &amp; Map</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Balanced 2-Column Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Architectural Showroom Photography */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden bg-[#111622] border border-white/10 min-h-[280px] sm:min-h-[360px]">
            {!imgFailed ? (
              <img
                src={SHOWROOM_IMAGE}
                alt="Yasir Mobile Store obsidian flagship showroom in DHA Phase 6, Lahore"
                className="w-full h-full lg:absolute lg:inset-0 object-cover"
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div className="w-full h-full min-h-[320px] flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#0B162C] to-[#111622] text-center">
                <ShieldCheck className="w-10 h-10 text-[#60A5FA] mb-3" />
                <p className="text-sm font-semibold text-white">Yasir Mobile Store Flagship Lounge</p>
                <p className="text-xs text-slate-400 mt-1">Commercial Area, Phase 6, DHA, Lahore</p>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#05070B]/95 via-[#05070B]/35 to-transparent pointer-events-none" />

            <div className="relative lg:absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex flex-col gap-1 z-10 mt-auto">
              <span className="text-xs font-medium text-blue-300">
                Lahore Flagship Counter · Live Demo Tables
              </span>
              <p className="text-sm sm:text-base font-semibold text-white leading-snug">
                Test cameras, displays, and titanium finishes in person before you unbox.
              </p>
            </div>
          </div>

          {/* Right: Interactive Story & Verification Content */}
          <div className="lg:col-span-7 bg-[#111622] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              {/* Interactive Pillar Segmented Tabs */}
              <div
                role="tablist"
                aria-label="About Yasir Mobile Store"
                className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#090C12] border border-white/10"
              >
                {ABOUT_PILLARS.map((pillar) => {
                  const isActive = pillar.id === activePillar.id;
                  return (
                    <button
                      key={pillar.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActivePillarId(pillar.id)}
                      className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#0066FF] text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {pillar.label}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug text-balance">
                  {activePillar.headline}
                </h3>
                <p className="text-sm sm:text-[15px] text-slate-300 leading-relaxed max-w-[65ch]">
                  {activePillar.body}
                </p>
              </div>

              {/* Clean Highlight List separated by hairline dividers */}
              <ul className="divide-y divide-white/10 border-t border-white/10 pt-1">
                {activePillar.highlights.map((line) => (
                  <li key={line} className="py-3 flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-[#60A5FA] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
              <button
                onClick={onBrowseCatalog}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0066FF] hover:bg-[#1A75FF] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Explore All 47 Models</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={buildGeneralInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#090C12] hover:bg-white/10 border border-white/15 text-slate-200 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" aria-hidden="true" />
                <span>Ask Our Team</span>
              </a>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Store Facts Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {ABOUT_METRICS.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl bg-[#090C12] border border-white/10 px-5 py-4 flex flex-col gap-1"
            >
              <span className="text-xl sm:text-2xl font-extrabold text-white font-mono tabular-nums tracking-tight">
                {metric.value}
              </span>
              <span className="text-xs sm:text-sm text-slate-400">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
