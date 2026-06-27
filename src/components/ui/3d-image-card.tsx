'use client';

import { cn } from '@/lib/utils';

type ThreeDImageCardProps = {
  imageUrl?: string;
  alt?: string;
  className?: string;
};

export function ThreeDImageCard({
  imageUrl = 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&h=900&fit=crop&crop=center',
  alt = 'Dental treatment',
  className,
}: ThreeDImageCardProps) {
  return (
    <div className={cn('group relative w-full max-w-md mx-auto', className)}>
      <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-2xl transition-all duration-500 ease-out group-hover:scale-[1.03]">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl p-3">
          <img
            src={imageUrl}
            alt={alt}
            className="h-full w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>
      <div className="absolute inset-0 -z-10 rounded-3xl bg-slate-300/30 blur-2xl translate-y-6" />
    </div>
  );
}
