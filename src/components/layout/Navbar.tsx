'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PiHouse, PiStethoscope, PiUsers, PiInfo, PiPhoneCall, PiQuestion, PiCalendarBlank } from 'react-icons/pi';
import { NavBar as TubelightNav } from '@/components/ui/tubelight-navbar';

const desktopNav = [
  { name: 'Home', url: '/', icon: PiHouse },
  { name: 'Services', url: '/services', icon: PiStethoscope },
  { name: 'Doctors', url: '/doctors', icon: PiUsers },
  { name: 'About', url: '/about', icon: PiInfo },
  { name: 'Contact', url: '/contact', icon: PiPhoneCall },
  { name: 'FAQ', url: '/faq', icon: PiQuestion },
];

const mobileNav = desktopNav.filter((item) => item.name !== 'FAQ');

export function Navbar() {
  return (
    <>
      {/* Mobile — tubelight nav at bottom */}
      <div className="md:hidden">
        <TubelightNav items={mobileNav} />
      </div>

      {/* Desktop — floating glass pill nav */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 pt-6">
        <div className="mx-auto flex w-max items-center gap-8 rounded-full border border-white/10 bg-white/80 px-6 py-2 shadow-ambient backdrop-blur-2xl supports-[backdrop-filter]:bg-white/70">
          {/* Logo + name */}
          <Link href="/" className="flex items-center gap-2.5 pr-4 border-r border-slate-200/50">
            <Image src="/images/logo.png" alt="Dr.Thankappan's Dental Clinic" width={36} height={36} className="h-8 w-auto" />
            <div className="leading-snug">
              <p className="font-display text-sm font-bold tracking-tight text-slate-800">Dr.Thankappan&apos;s</p>
              <p className="text-[9px] font-bold tracking-widest text-teal-600">DENTAL CLINIC</p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {desktopNav.map((item) => (
              <Link
                key={item.name}
                href={item.url}
                className="rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-[transform,opacity,color,background-color] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-teal-50 hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA button */}
          <Link
            href="/book"
            className="group inline-flex items-center gap-2 rounded-full bg-teal-600 pl-5 pr-3 py-2 text-xs font-semibold text-white shadow-ambient transition-[transform,opacity,color,background-color] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_8px_32px_-8px_rgba(15,118,110,0.3)] hover:bg-teal-700 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span className="transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[-2px]">
              Book Appointment
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:scale-105">
              <PiCalendarBlank size={11} />
            </span>
          </Link>
        </div>
      </header>
    </>
  );
}
