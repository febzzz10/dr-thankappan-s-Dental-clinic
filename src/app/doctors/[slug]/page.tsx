import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDoctor } from '@/lib/api';
import type { Doctor } from '@/lib/api';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/schemas';
import { DoctorDetailContent } from '@/components/doctors/DoctorDetailContent';

const baseUrl = 'https://drthankappandental.com';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const doctor = await getDoctor(slug);
    return {
      title: `Dr. ${doctor.doctor_name} | Dentist in Kochi`,
      description: `Learn about Dr. ${doctor.doctor_name}, ${doctor.qualification} — ${doctor.specialization} at Dr.Thankappan's Dental Clinic in Kochi. ${doctor.experience_yrs} years of experience.`,
      openGraph: {
        title: `Dr. ${doctor.doctor_name} | Dr.Thankappan's Dental Clinic`,
        description: `${doctor.specialization} specialist with ${doctor.experience_yrs} years of experience at our Kochi dental clinic.`,
        url: `${baseUrl}/doctors/${slug}`,
      },
      alternates: {
        canonical: `${baseUrl}/doctors/${slug}`,
      },
    };
  } catch {
    return {};
  }
}

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

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Our Doctors', url: `${baseUrl}/doctors` },
    { name: `Dr. ${doctor.doctor_name}`, url: `${baseUrl}/doctors/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <DoctorDetailContent doctor={doctor} />
    </>
  );
}
