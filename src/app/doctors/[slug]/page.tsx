import { notFound } from 'next/navigation';
import { getDoctor } from '@/lib/api';
import type { Doctor } from '@/lib/api';
import { DoctorDetailContent } from '@/components/doctors/DoctorDetailContent';

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  let doctor: Doctor;
  try {
    doctor = await getDoctor(slug);
  } catch {
    notFound();
  }

  return (
    <DoctorDetailContent doctor={doctor} />
  );
}
