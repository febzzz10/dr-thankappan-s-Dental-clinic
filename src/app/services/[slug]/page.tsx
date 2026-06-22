import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Sparkles, Syringe, Award, Smile, Sun, Heart, Baby, Shield } from 'lucide-react';
import { Container } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { getService, getServices } from '@/lib/api';
import type { Service } from '@/lib/api';
import { ServiceDetailContent } from '@/components/services/ServiceDetailContent';

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Syringe, Award, Smile, Sun, Heart, Baby, Shield,
};

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  let service: Service;
  try {
    service = await getService(slug);
  } catch {
    notFound();
  }

  const Icon = iconMap[service.icon ?? 'Sparkles'] ?? Sparkles;
  const allServices = await getServices();
  const related = allServices
    .filter((s) => s.id !== service.id)
    .slice(0, 2);

  return (
    <ServiceDetailContent service={service} Icon={Icon} related={related} />
  );
}
