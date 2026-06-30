import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.drthankappandentalclinic.com';

  return [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/services`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/doctors`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/faq`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/gallery`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/testimonials`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/book`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/laser-dentistry-kochi`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/root-canal-kochi`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/dental-cleaning-kochi`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/teeth-whitening-kochi`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/dental-implants-kochi`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/braces-aligners-kochi`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/crowns-bridges-kochi`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/gum-depigmentation-kochi`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/smile-correction-kochi`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/jaw-pain-relief-kochi`, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
