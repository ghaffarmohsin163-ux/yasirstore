import React from 'react';
import { MessageCircle } from 'lucide-react';
import { buildGeneralInquiryUrl } from '../utils/whatsapp';

export const FloatingWhatsAppButton: React.FC = () => {
  return (
    <aside aria-label="Quick support" className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-30">
      <a
        href={buildGeneralInquiryUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Yasir Mobile Store on WhatsApp (03293179587)"
        title="Chat on WhatsApp (03293179587)"
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white flex items-center justify-center shadow-lg transition-transform duration-150 hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </a>
    </aside>
  );
};
