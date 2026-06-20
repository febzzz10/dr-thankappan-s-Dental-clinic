import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled' | 'default';
  className?: string;
  children: React.ReactNode;
}

const variants: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-slate-100 text-slate-700 border-slate-200',
  cancelled: 'bg-slate-100 text-slate-500 border-slate-200 line-through',
  default: 'bg-teal-100 text-teal-800 border-teal-200',
};

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
