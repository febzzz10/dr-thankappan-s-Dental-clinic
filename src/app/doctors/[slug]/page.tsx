import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BadgeCheck } from 'lucide-react';
import { Container } from '@/components/ui/Section';
import { mockData } from '@/lib/api';
import { DoctorDetailContent } from '@/components/doctors/DoctorDetailContent';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

export function generateStaticParams() {
  return mockData.doctors.map((d) => ({ slug: d.slug }));
}

export default function DoctorDetailPage({ params }: { params: { slug: string } }) {
  const doctor = mockData.doctors.find((d) => d.slug === params.slug);
  if (!doctor) notFound();

  let availability: Record<string, boolean> = {};
  try {
    availability = JSON.parse(doctor.availability ?? '{}');
  } catch { }

  return (
    <DoctorDetailContent doctor={doctor} availability={availability} />
  );
}
