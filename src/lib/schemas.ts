const baseUrl = 'https://drthankappandental.com';

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': `${baseUrl}/#dentist`,
    name: "Dr.Thankappan's Dental Clinic",
    description:
      'Your trusted dental clinic in Kochi offering laser dentistry, teeth whitening, gum depigmentation, gum recontouring, smile correction, clear aligners, aesthetic restorations, root canal treatment, dental cleaning, crowns and bridges, dental implants, braces and aligners, and jaw pain relief.',
    url: baseUrl,
    telephone: '+91 94471 21519',
    email: 'drthankappandentalclinic@gmail.com',
    image: `${baseUrl}/images/logo.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'M J Zakaria Sait Rd, Panayapilly East, Kappalandimukku, Mattancherry',
      addressLocality: 'Kochi',
      addressRegion: 'Kerala',
      postalCode: '682002',
      addressCountry: 'IN',
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '14:00' },
    ],
    priceRange: '₹₹',
    medicalSpecialty: 'Dentistry',
    areaServed: { '@type': 'City', name: 'Kochi' },
    sameAs: [
      'https://www.facebook.com/drthankappansdentalclinic',
      'https://www.instagram.com/drthankappansdentalclinic',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Dental Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Laser Dentistry' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Teeth Whitening' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gum Depigmentation' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gum Recontouring' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Smile Correction' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Clear Aligners' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Aesthetic Restorations' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Root Canal Treatment' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Dental Cleaning' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Dental Implants' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Braces and Aligners' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Crowns and Bridges' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Jaw Pain Relief' } },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      ratingCount: '350',
    },
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: "Dr.Thankappan's Dental Clinic",
    description:
      'Your trusted dental clinic in Kochi. A Family Tradition of Dental Excellence.',
    publisher: { '@id': `${baseUrl}/#dentist` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getMedicalServiceSchema(service: {
  name: string;
  description: string;
  url: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: service.name,
    description: service.description,
    url: service.url,
    image: service.image || `${baseUrl}/images/logo.png`,
    relevantSpecialty: { '@type': 'MedicalSpecialty', name: 'Dentistry' },
    provider: { '@id': `${baseUrl}/#dentist` },
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
