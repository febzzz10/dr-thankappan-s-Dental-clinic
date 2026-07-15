'use client';

import { useEffect, useState } from 'react';
import { PiChatCircle } from 'react-icons/pi';
import { getSettings } from '@/lib/api';
import { generateWhatsAppUrl } from '@/lib/utils';

export function WhatsAppFab() {
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    getSettings().then((s) => {
      if (s.whatsapp_number) setWhatsappNumber(s.whatsapp_number);
    });
  }, []);

  const number = whatsappNumber || '919447121519';
  const message = "Hi! I'd like to enquire about a dental appointment.";
  const href = generateWhatsAppUrl(number, message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:bg-green-600 hover:shadow-xl active:scale-[0.95] md:bottom-6 md:z-40"
      aria-label="Chat on WhatsApp"
    >
      <PiChatCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}
