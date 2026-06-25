'use client';

import { useEffect, useState } from 'react';

interface GradientBackgroundProps {
  children: React.ReactNode;
  gradients?: string[];
  animationDuration?: number;
  animationDelay?: number;
  overlay?: boolean;
  className?: string;
}

const defaultGradients = [
  'linear-gradient(135deg, #d9fbff 0%, #f8ffff 45%, #c7f4f1 100%)',
  'linear-gradient(135deg, #e6ffff 0%, #ffffff 45%, #bdeeea 100%)',
  'linear-gradient(135deg, #c9f7ff 0%, #f9ffff 50%, #d7fff8 100%)',
  'linear-gradient(135deg, #eaffff 0%, #f7ffff 45%, #b8ebe7 100%)',
  'linear-gradient(135deg, #d9fbff 0%, #f8ffff 45%, #c7f4f1 100%)',
];

export function GradientBackground({
  children,
  gradients = defaultGradients,
  animationDuration = 10,
  animationDelay = 0,
  overlay = false,
  className = '',
}: GradientBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (gradients.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % gradients.length);
    }, animationDuration * 1000);

    return () => clearInterval(interval);
  }, [gradients.length, animationDuration]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="pointer-events-none fixed inset-0 -z-10 transition-all duration-1000 ease-in-out"
        style={{
          background: gradients[currentIndex],
          transitionDelay: `${animationDelay}s`,
        }}
      />
      {overlay && (
        <div
          className="pointer-events-none fixed inset-0 -z-10 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.8) 0%, transparent 60%)',
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
