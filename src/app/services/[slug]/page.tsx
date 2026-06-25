import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Sparkles, Syringe, Award, Smile, Sun, Heart, Baby, Shield } from 'lucide-react';
import { getService, getServices } from '@/lib/api';
import type { Service } from '@/lib/api';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/schemas';
import { ServiceDetailContent } from '@/components/services/ServiceDetailContent';

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Syringe, Award, Smile, Sun, Heart, Baby, Shield,
};

const baseUrl = 'https://dr-thankappan-s-dental-clinic-theta.vercel.app';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const service = await getService(slug);
    return {
      title: `${service.service_name} | Dental Services in Kochi`,
      description: service.description || service.short_desc || `Learn about ${service.service_name} at Dr.Thankappan's Dental Clinic in Kochi.`,
      openGraph: {
        title: `${service.service_name} | Dr.Thankappan's Dental Clinic`,
        description: service.short_desc || `${service.service_name} treatment at our dental clinic in Kochi.`,
        url: `${baseUrl}/services/${slug}`,
      },
      alternates: {
        canonical: `${baseUrl}/services/${slug}`,
      },
    };
  } catch {
    return {};
  }
}

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

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Dental Services', url: `${baseUrl}/services` },
    { name: service.service_name, url: `${baseUrl}/services/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <ServiceDetailContent service={service} Icon={Icon} related={related} />
    </>
  );
}
