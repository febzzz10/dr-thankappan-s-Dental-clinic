'use client';

import dynamic from 'next/dynamic';

const HeroSectionInner = dynamic(() => import('@/components/home/HeroSection').then(m => ({ default: m.HeroSection })));

export function HeroSectionWrapper() {
  return <HeroSectionInner />;
}
