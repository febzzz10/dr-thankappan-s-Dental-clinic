import { cn } from '@/lib/utils';

interface SectionProps {
  className?: string;
  children: React.ReactNode;
  id?: string;
}

export function Section({ className, children, id }: SectionProps) {
  return (
    <section id={id} className={cn('py-[var(--section-padding)]', className)}>
      {children}
    </section>
  );
}

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('mx-auto max-w-7xl px-[var(--container-padding)]', className)}>
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  className,
  as,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
  as?: 'h1' | 'h2';
}) {
  const Tag = as === 'h1' ? 'h1' : 'h2';
  return (
    <div className={cn('mx-auto mb-16 max-w-2xl text-center md:mb-20', className)}>
      {eyebrow && (
        <span className="mb-5 inline-block rounded-full bg-teal-50 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-teal-700">
          {eyebrow}
        </span>
      )}
      <Tag className="font-display text-fluid-h2 font-bold tracking-tight text-slate-900">
        {title}
      </Tag>
      {subtitle && (
        <p className="mt-5 text-base leading-relaxed text-slate-600 md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
