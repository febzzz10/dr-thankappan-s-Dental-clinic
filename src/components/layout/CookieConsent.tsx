'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsent() {
  const [visible, setVisible] = useState(() =>
    typeof window !== 'undefined' && !localStorage.getItem('cookie-consent')
  );

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 48, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-tinted"
        >
          <p className="text-sm leading-relaxed text-slate-600">
            We use essential cookies to ensure the site works properly.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={accept}
              className="rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Accept
            </button>
            <button
              onClick={accept}
              className="text-sm text-slate-600 transition-colors hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
