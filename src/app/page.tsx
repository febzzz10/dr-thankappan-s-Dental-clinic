import type { Metadata } from 'next';
import { GradientBackground } from '@/components/ui/gradient-background';
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

const dentalSoftGradients = [
  'linear-gradient(135deg, #d9fbff 0%, #f8ffff 45%, #c7f4f1 100%)',
  'linear-gradient(135deg, #e6ffff 0%, #ffffff 45%, #bdeeea 100%)',
  'linear-gradient(135deg, #c9f7ff 0%, #f9ffff 50%, #d7fff8 100%)',
  'linear-gradient(135deg, #eaffff 0%, #f7ffff 45%, #b8ebe7 100%)',
  'linear-gradient(135deg, #d9fbff 0%, #f8ffff 45%, #c7f4f1 100%)',
];

export default function HomePage() {
  return (
    <GradientBackground gradients={dentalSoftGradients} animationDuration={10} overlay={false} className="min-h-screen">
      <HeroSectionWrapper />
      <FeatureHighlights />
      <AboutSection />
      <MarqueeStrip />
      <StatsSection />
      <ServicesPreview />
      <DoctorsPreview />
      <TestimonialsSection />
      <CTABanner />
    </GradientBackground>
  );
}
