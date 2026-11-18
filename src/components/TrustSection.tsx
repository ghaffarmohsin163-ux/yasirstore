import React from 'react';
import { Truck, ShieldCheck, Headphones, RotateCcw } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const items = [
    {
      icon: Truck,
      title: 'Free Shipping',
      subtitle: 'On all orders nationwide',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payment',
      subtitle: '100% protected & PTA verified',
    },
    {
      icon: Headphones,
      title: 'Instant WhatsApp Support',
      subtitle: 'Daily · 09:00 AM – 09:00 PM',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      subtitle: '7-day replacement guarantee',
    },
  ];

  return (
    <section className="bg-[#05070B] py-6 border-b border-white/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start sm:items-center gap-2.5 sm:gap-3.5 p-3 sm:py-3.5 sm:px-4 rounded-2xl bg-gradient-to-b from-[#111622] to-[#0B0F17] border border-white/10 shadow-sm"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#0066FF]/15 border border-[#3B82F6]/30 text-[#60A5FA] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.9} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-white leading-snug">{item.title}</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-snug mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
