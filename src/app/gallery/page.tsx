import Link from 'next/link';
import { Sparkles, Syringe, Award, Smile, Sun, Heart, Baby, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Container, SectionHeader } from '@/components/ui/Section';
import { getServices } from '@/lib/api';

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Syringe, Award, Smile, Sun, Heart, Baby, Shield,
};

export default async function GalleryPage() {
  const services = await getServices();

  return (
    <div className="min-h-dvh bg-white">
      <section className="bg-gradient-to-br from-teal-50 via-white to-teal-50/80 py-20 md:py-28">
        <Container>
          <SectionHeader
            title="Our Gallery"
            subtitle="Take a virtual tour of our clinic and see our work. Every smile tells a story."
          />
        </Container>
      </section>

      <Container className="py-16 md:py-24">
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))]">
          {services.map((s) => {
            const Icon = iconMap[s.icon ?? 'Sparkles'] ?? Sparkles;
            return (
              <Link key={s.id} href={`/services/${s.slug}`}>
                <Card className="group h-full p-6 transition-[transform,opacity] hover:border-teal-200 hover:shadow-lg">
                  <div className="mb-4 flex h-20 w-full items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-teal-100">
                    <Icon className="h-10 w-10 text-teal-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-fluid-h4 font-bold text-slate-900">
                    {s.service_name}
                  </h3>
                  <p className="mt-2 text-fluid-sm text-slate-600">{s.short_desc}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
