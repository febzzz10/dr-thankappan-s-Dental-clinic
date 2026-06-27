'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PiMapPin, PiPhone, PiEnvelope, PiClock } from 'react-icons/pi';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 pb-20 md:pb-0">
      <div className="mx-auto max-w-7xl px-[var(--container-padding)] py-[var(--section-padding)]">
        <div className="grid gap-12 grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="Dr.Thankappan's Dental Clinic" width={36} height={36} className="h-9 w-auto" />
              <span className="font-display text-sm font-bold text-slate-900 sm:text-xl">
                Dr.Thankappan&apos;s Dental Clinic
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Your trusted dental clinic in kochi.
              A Family Tradition of Dental Excellence
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-slate-600 transition-colors hover:text-teal-600 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none">Home</Link></li>
              <li><Link href="/services" className="text-sm text-slate-600 transition-colors hover:text-teal-600 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none">Services</Link></li>
              <li><Link href="/doctors" className="text-sm text-slate-600 transition-colors hover:text-teal-600 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none">Doctors</Link></li>
              <li><Link href="/about" className="text-sm text-slate-600 transition-colors hover:text-teal-600 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-600 transition-colors hover:text-teal-600 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <PiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                <span>M J Zakaria Sait Rd, Panayapilly East, Kappalandimukku,<br />Mattancherry, Kochi, Kerala 682002</span>
              </li>
              <li>
                <a href="tel:+919447121519" className="flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-teal-600 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none">
                  <PiPhone className="h-4 w-4 shrink-0 text-teal-600" />
                  +91 94471 21519
                </a>
              </li>
              <li>
                <a href="mailto:drthankappandentalclinic@gmail.com" className="flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-teal-600 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none">
                  <PiEnvelope className="h-4 w-4 shrink-0 text-teal-600" />
                  drthankappandentalclinic@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <PiClock className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                <div>
                  <p>Mon–Fri: 9:00 AM – 6:00 PM</p>
                  <p>Sat: 9:00 AM – 2:00 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-sm text-slate-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Dr.Thankappan&apos;s Dental Clinic. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition-colors hover:text-teal-600 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-teal-600 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
