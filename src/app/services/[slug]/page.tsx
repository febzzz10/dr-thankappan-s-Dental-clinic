import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Sparkles, Syringe, Award, Smile, Sun, Heart, Baby, Shield } from 'lucide-react';
import { Container } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { mockData } from '@/lib/mock-data';
import { ServiceDetailContent } from '@/components/services/ServiceDetailContent';

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Syringe, Award, Smile, Sun, Heart, Baby, Shield,
};

export function generateStaticParams() {
  return mockData.services.map((s) => ({ slug: s.slug }));
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = mockData.services.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const Icon = iconMap[service.icon ?? 'Sparkles'] ?? Sparkles;
  const related = mockData.services
    .filter((s) => s.id !== service.id)
    .slice(0, 2);

  return (
    <ServiceDetailContent service={service} Icon={Icon} related={related} />
  );
}
