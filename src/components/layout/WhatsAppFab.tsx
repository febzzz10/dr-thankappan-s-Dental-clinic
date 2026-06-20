'use client';

import { PiChatCircle } from 'react-icons/pi';
import { mockData } from '@/lib/api';

export function WhatsAppFab() {
  const number = mockData.settings.whatsapp_number;

  return (
    <a
      href={`https://wa.me/${number}?text=Hi! I'd like to enquire about a dental appointment.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:bg-green-600 hover:shadow-xl active:scale-[0.95] md:bottom-6 md:z-40"
      aria-label="Chat on WhatsApp"
    >
      <PiChatCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}
