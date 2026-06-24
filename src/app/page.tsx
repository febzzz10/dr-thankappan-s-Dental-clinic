import type { Metadata } from 'next';
import { HeroSectionWrapper } from '@/components/home/HeroSectionWrapper';
import { FeatureHighlights } from '@/components/home/FeatureHighlights';
import { AboutSection } from '@/components/home/AboutSection';
import { MarqueeStrip } from '@/components/home/MarqueeStrip';
import { StatsSection } from '@/components/home/StatsSection';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { DoctorsPreview } from '@/components/home/DoctorsPreview';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTABanner } from '@/components/home/CTABanner';

export const metadata: Metadata = {
  title: {
    default: "Dr.Thankappan's Dental Clinic — Book Your Appointment Online",
    template: "%s | Dr.Thankappan's Dental Clinic",
  },
  description: 'Professional dental care in Kochi. Expert dentists offering cleaning, root canal, braces, implants & more. Book online in 60 seconds.',
};

export default function HomePage() {
  return (
    <>
      <HeroSectionWrapper />
      <FeatureHighlights />
      <AboutSection />
      <MarqueeStrip />
      <StatsSection />
      <ServicesPreview />
      <DoctorsPreview />
      <TestimonialsSection />
      <CTABanner />
    </>
  );
}
