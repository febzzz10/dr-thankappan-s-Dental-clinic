export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': 'https://dr-thankappan-s-dental-clinic-theta.vercel.app/#dentist',
    name: "Dr.Thankappan's Dental Clinic",
    description:
      'Your trusted dental clinic in Kochi offering root canal, dental cleaning, crowns, bridges, implants, braces, aligners, and teeth whitening.',
    url: 'https://dr-thankappan-s-dental-clinic-theta.vercel.app',
    telephone: '+91 94471 21519',
    email: 'drthankappandentalclinic@gmail.com',
    image: 'https://dr-thankappan-s-dental-clinic-theta.vercel.app/images/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kochi',
      addressLocality: 'Kochi',
      addressRegion: 'Kerala',
      addressCountry: 'IN',
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '14:00' },
    ],
    priceRange: '₹₹',
    medicalSpecialty: 'Dentistry',
    areaServed: { '@type': 'City', name: 'Kochi' },
    sameAs: [],
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getServiceSchema(services: { name: string; description: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'MedicalProcedure',
        name: s.name,
        description: s.description,
        url: s.url,
        relevantSpecialty: { '@type': 'MedicalSpecialty', name: 'Dentistry' },
      },
    })),
  };
}
