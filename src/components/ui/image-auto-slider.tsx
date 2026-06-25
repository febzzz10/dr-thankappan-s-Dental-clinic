'use client';

import Image from 'next/image';

const images = [
  '/images/about-gallery/image1.webp',
  '/images/about-gallery/image2.webp',
  '/images/about-gallery/image3.webp',
  '/images/about-gallery/image4.webp',
  '/images/about-gallery/image5.webp',
  '/images/about-gallery/image1.webp',
  '/images/about-gallery/image2.webp',
  '/images/about-gallery/image3.webp',
  '/images/about-gallery/image4.webp',
  '/images/about-gallery/image5.webp',
];

export function ImageAutoSlider() {
  return (
    <section className="relative w-full overflow-hidden py-12 md:py-20">
      <div
        className="scroll-container"
        style={{
          mask: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMask: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div className="infinite-scroll flex gap-4 md:gap-6" style={{ animation: 'scroll 30s linear infinite' }}>
          {images.map((src, i) => (
            <div
              key={`${i}`}
              className="image-item flex-shrink-0 w-48 h-56 md:w-64 md:h-72 lg:w-80 lg:h-96 rounded-3xl overflow-hidden border border-white/70 bg-white/70 shadow-xl shadow-teal-900/5"
            >
              <Image
                src={src}
                alt={`Dental clinic gallery image ${(i % 5) + 1}`}
                width={420}
                height={420}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/70 to-transparent z-20" />
      <style jsx>{`
        .infinite-scroll:hover {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-420px * 5 - 4 * 24px));
          }
        }
      `}</style>
    </section>
  );
}
